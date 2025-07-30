// Content script for Google Form Prefill Link Generator
// This script runs on Google Form pages to extract form data across multiple pages

(function() {
  'use strict';

  // Global storage for multi-page form data
  let multiPageFormData = {
    allFields: {},
    visitedPages: new Set(),
    formTitle: '',
    baseUrl: '',
    lastUpdated: Date.now()
  };

  // Function to get or initialize multi-page form data
  function getMultiPageFormData() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['multiPageFormData'], (result) => {
        if (result.multiPageFormData) {
          multiPageFormData = { ...result.multiPageFormData };
          // Convert visitedPages back to Set
          multiPageFormData.visitedPages = new Set(multiPageFormData.visitedPages);
        }
        resolve(multiPageFormData);
      });
    });
  }

  // Function to save multi-page form data
  function saveMultiPageFormData() {
    const dataToSave = {
      ...multiPageFormData,
      visitedPages: Array.from(multiPageFormData.visitedPages),
      lastUpdated: Date.now()
    };
    chrome.storage.local.set({ multiPageFormData: dataToSave });
  }

  // Function to extract form data from current page
  function extractCurrentPageData() {
    try {
      // Get the base form URL
      const currentUrl = window.location.href;
      let baseUrl = currentUrl;
      
      // Remove any existing query parameters
      if (baseUrl.includes('?')) {
        baseUrl = baseUrl.split('?')[0];
      }
      
      // Remove any existing prefill parameters
      if (baseUrl.includes('&entry.')) {
        baseUrl = baseUrl.split('&entry.')[0];
      }

      // Try to get form title
      let formTitle = 'Google Form';
      const titleElement = document.querySelector('h1, .freebirdFormviewerViewFormTitle, .docs-ml-title');
      if (titleElement) {
        formTitle = titleElement.textContent.trim();
      }

      // Find all form fields with name starting with "entry."
      const formFields = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."], select[name^="entry."]');
      
      if (formFields.length === 0) {
        return { error: 'No form fields found on current page.' };
      }

      const currentPageFields = {};
      const fieldData = [];
      let filledFields = 0;
      let totalFields = formFields.length;
      
      formFields.forEach(field => {
        const name = field.getAttribute('name');
        let value = '';
        
        if (field.type === 'checkbox') {
          value = field.checked ? field.value || 'on' : '';
        } else if (field.type === 'radio') {
          if (field.checked) {
            value = field.value || 'on';
          }
        } else if (field.tagName === 'SELECT') {
          const selectedOption = field.options[field.selectedIndex];
          value = selectedOption ? selectedOption.value : '';
        } else {
          value = field.value || '';
        }
        
        // Try to find the label for this field
        let label = '';
        const fieldId = field.getAttribute('id');
        
        // Method 1: Look for label with 'for' attribute
        if (fieldId) {
          const labelElement = document.querySelector(`label[for="${fieldId}"]`);
          if (labelElement) {
            label = labelElement.textContent.trim();
          }
        }
        
        // Method 2: Look for label in Google Forms structure
        if (!label) {
          const questionContainer = field.closest('[role="listitem"]');
          if (questionContainer) {
            const headingElement = questionContainer.querySelector('[role="heading"]');
            if (headingElement) {
              label = headingElement.textContent.trim();
            }
          }
        }
        
        // Method 2.5: Look for aria-labelledby (most reliable for Google Forms)
        if (!label && field.getAttribute('aria-labelledby')) {
          const labelledByIds = field.getAttribute('aria-labelledby').split(' ');
          for (let id of labelledByIds) {
            const labelledElement = document.getElementById(id);
            if (labelledElement) {
              label = labelledElement.textContent.trim();
              break;
            }
          }
        }
        
        // Method 3: Look for aria-label
        if (!label && field.getAttribute('aria-label')) {
          label = field.getAttribute('aria-label');
        }
        
        // Method 4: Look for placeholder
        if (!label && field.getAttribute('placeholder')) {
          label = field.getAttribute('placeholder');
        }
        
        // Method 5: Look for nearby text elements
        if (!label) {
          const parent = field.parentElement;
          if (parent) {
            const textElements = parent.querySelectorAll('div, span, p');
            for (let element of textElements) {
              const text = element.textContent.trim();
              if (text && text.length > 0 && text.length < 100) {
                label = text;
                break;
              }
            }
          }
        }
        
        // Fallback to field name if no label found
        if (!label) {
          label = name;
        }
        
        // Store field data
        const fieldInfo = {
          name: name,
          label: label,
          type: field.type || field.tagName.toLowerCase(),
          value: value,
          hasValue: value && value.trim() !== ''
        };
        
        fieldData.push(fieldInfo);
        
        // Store in current page fields
        currentPageFields[name] = fieldInfo;
        
        // Count filled fields
        if (value && value.trim() !== '') {
          filledFields++;
        }
      });

      return {
        currentPageFields,
        fieldData,
        filledFields,
        totalFields,
        formTitle,
        baseUrl
      };
      
    } catch (error) {
      console.error('Error extracting current page data:', error);
      return { error: 'Failed to extract current page data: ' + error.message };
    }
  }

  // Function to extract complete multi-page form data
  async function extractFormData() {
    try {
      // Check if we're on a Google Form page
      if (!window.location.href.includes('docs.google.com/forms')) {
        return { error: 'Not on a Google Form page' };
      }

      // Get current page data
      const currentPageData = extractCurrentPageData();
      
      if (currentPageData.error) {
        return currentPageData;
      }

      // Get stored multi-page data
      await getMultiPageFormData();

      // Update multi-page data with current page
      multiPageFormData.formTitle = currentPageData.formTitle;
      multiPageFormData.baseUrl = currentPageData.baseUrl;
      multiPageFormData.visitedPages.add(window.location.href);
      
      // Merge current page fields with stored fields
      Object.assign(multiPageFormData.allFields, currentPageData.currentPageFields);
      
      // Save updated data
      saveMultiPageFormData();

      // Generate prefill URL from all collected fields
      const params = [];
      let totalFilledFields = 0;
      let totalFields = Object.keys(multiPageFormData.allFields).length;
      
      Object.values(multiPageFormData.allFields).forEach(field => {
        if (field.hasValue) {
          totalFilledFields++;
          params.push(`${field.name}=${encodeURIComponent(field.value.trim())}`);
        }
      });

      if (params.length === 0) {
        return { 
          error: 'No form fields have values across all pages. Please fill in some example responses first.',
          formTitle: multiPageFormData.formTitle,
          totalFields: totalFields,
          filledFields: 0,
          visitedPages: multiPageFormData.visitedPages.size,
          debug: Object.values(multiPageFormData.allFields)
        };
      }

      const prefillUrl = `${multiPageFormData.baseUrl}?${params.join('&')}`;
      
      return { 
        url: prefillUrl,
        formTitle: multiPageFormData.formTitle,
        totalFields: totalFields,
        filledFields: totalFilledFields,
        visitedPages: multiPageFormData.visitedPages.size,
        debug: Object.values(multiPageFormData.allFields)
      };
      
    } catch (error) {
      console.error('Error extracting form data:', error);
      return { error: 'Failed to extract form data: ' + error.message };
    }
  }

  // Function to clear multi-page form data (for new forms)
  function clearMultiPageFormData() {
    multiPageFormData = {
      allFields: {},
      visitedPages: new Set(),
      formTitle: '',
      baseUrl: '',
      lastUpdated: Date.now()
    };
    chrome.storage.local.remove(['multiPageFormData']);
  }

  // Function to detect form navigation
  function setupNavigationDetection() {
    // Listen for Next/Back button clicks
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // Check if it's a navigation button
      if (target.textContent && (
        target.textContent.toLowerCase().includes('next') ||
        target.textContent.toLowerCase().includes('back') ||
        target.textContent.toLowerCase().includes('submit')
      )) {
        // Save current page data before navigation
        const currentPageData = extractCurrentPageData();
        if (!currentPageData.error) {
          Object.assign(multiPageFormData.allFields, currentPageData.currentPageFields);
          saveMultiPageFormData();
        }
      }
    });

    // Listen for form submission
    document.addEventListener('submit', function(e) {
      const currentPageData = extractCurrentPageData();
      if (!currentPageData.error) {
        Object.assign(multiPageFormData.allFields, currentPageData.currentPageFields);
        saveMultiPageFormData();
      }
    });
  }

  // Function to listen for form field changes
  function setupFormListeners() {
    const formFields = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."], select[name^="entry."]');
    
    formFields.forEach(field => {
      field.addEventListener('change', function() {
        // Update the stored form data
        const currentPageData = extractCurrentPageData();
        if (!currentPageData.error) {
          Object.assign(multiPageFormData.allFields, currentPageData.currentPageFields);
          saveMultiPageFormData();
        }
      });
      
      field.addEventListener('input', function() {
        // For text inputs, update on input (debounced)
        clearTimeout(field.debounceTimer);
        field.debounceTimer = setTimeout(() => {
          const currentPageData = extractCurrentPageData();
          if (!currentPageData.error) {
            Object.assign(multiPageFormData.allFields, currentPageData.currentPageFields);
            saveMultiPageFormData();
          }
        }, 500);
      });
    });
  }

  // Function to handle dynamic content loading
  function observeFormChanges() {
    const observer = new MutationObserver(function(mutations) {
      let shouldSetupListeners = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const formFields = node.querySelectorAll ? 
                node.querySelectorAll('input[name^="entry."], textarea[name^="entry."], select[name^="entry."]') : [];
              
              if (formFields.length > 0) {
                shouldSetupListeners = true;
              }
            }
          });
        }
      });
      
      if (shouldSetupListeners) {
        setupFormListeners();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Function to detect new forms (clear old data)
  function detectNewForm() {
    const currentUrl = window.location.href;
    const formId = currentUrl.match(/\/forms\/d\/e\/([^\/]+)/);
    
    if (formId) {
      chrome.storage.local.get(['lastFormId'], (result) => {
        if (result.lastFormId !== formId[1]) {
          // New form detected, clear old data
          clearMultiPageFormData();
          chrome.storage.local.set({ lastFormId: formId[1] });
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      detectNewForm();
      setupFormListeners();
      setupNavigationDetection();
      observeFormChanges();
    });
  } else {
    detectNewForm();
    setupFormListeners();
    setupNavigationDetection();
    observeFormChanges();
  }

  // Also set up listeners after a short delay to catch any late-loading content
  setTimeout(() => {
    setupFormListeners();
  }, 1000);

  // Make extractFormData available globally for the popup script
  window.extractFormData = extractFormData;

  // Also provide a simple single-page fallback
  window.extractCurrentPageFormData = function() {
    try {
      // Check if we're on a Google Form page
      if (!window.location.href.includes('docs.google.com/forms')) {
        return { error: 'Not on a Google Form page' };
      }

      // Get the base form URL
      const currentUrl = window.location.href;
      let baseUrl = currentUrl;
      
      // Remove any existing query parameters
      if (baseUrl.includes('?')) {
        baseUrl = baseUrl.split('?')[0];
      }
      
      // Remove any existing prefill parameters
      if (baseUrl.includes('&entry.')) {
        baseUrl = baseUrl.split('&entry.')[0];
      }

      // Try to get form title
      let formTitle = 'Google Form';
      const titleElement = document.querySelector('h1, .freebirdFormviewerViewFormTitle, .docs-ml-title');
      if (titleElement) {
        formTitle = titleElement.textContent.trim();
      }

      // Find all form fields with name starting with "entry."
      const formFields = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."], select[name^="entry."]');
      
      if (formFields.length === 0) {
        return { error: 'No form fields found. Make sure you are on the form entry page.' };
      }

      const params = [];
      const fieldData = [];
      let filledFields = 0;
      let totalFields = formFields.length;
      
      formFields.forEach(field => {
        const name = field.getAttribute('name');
        let value = '';
        
        if (field.type === 'checkbox') {
          value = field.checked ? field.value || 'on' : '';
        } else if (field.type === 'radio') {
          if (field.checked) {
            value = field.value || 'on';
          }
        } else if (field.tagName === 'SELECT') {
          const selectedOption = field.options[field.selectedIndex];
          value = selectedOption ? selectedOption.value : '';
        } else {
          value = field.value || '';
        }
        
        // Try to find the label for this field
        let label = '';
        const fieldId = field.getAttribute('id');
        
        // Method 1: Look for label with 'for' attribute
        if (fieldId) {
          const labelElement = document.querySelector(`label[for="${fieldId}"]`);
          if (labelElement) {
            label = labelElement.textContent.trim();
          }
        }
        
        // Method 2: Look for label in Google Forms structure
        if (!label) {
          const questionContainer = field.closest('[role="listitem"]');
          if (questionContainer) {
            const headingElement = questionContainer.querySelector('[role="heading"]');
            if (headingElement) {
              label = headingElement.textContent.trim();
            }
          }
        }
        
        // Method 2.5: Look for aria-labelledby (most reliable for Google Forms)
        if (!label && field.getAttribute('aria-labelledby')) {
          const labelledByIds = field.getAttribute('aria-labelledby').split(' ');
          for (let id of labelledByIds) {
            const labelledElement = document.getElementById(id);
            if (labelledElement) {
              label = labelledElement.textContent.trim();
              break;
            }
          }
        }
        
        // Method 3: Look for aria-label
        if (!label && field.getAttribute('aria-label')) {
          label = field.getAttribute('aria-label');
        }
        
        // Method 4: Look for placeholder
        if (!label && field.getAttribute('placeholder')) {
          label = field.getAttribute('placeholder');
        }
        
        // Method 5: Look for nearby text elements
        if (!label) {
          const parent = field.parentElement;
          if (parent) {
            const textElements = parent.querySelectorAll('div, span, p');
            for (let element of textElements) {
              const text = element.textContent.trim();
              if (text && text.length > 0 && text.length < 100) {
                label = text;
                break;
              }
            }
          }
        }
        
        // Fallback to field name if no label found
        if (!label) {
          label = name;
        }
        
        // Store field data for debugging
        fieldData.push({
          name: name,
          label: label,
          type: field.type || field.tagName.toLowerCase(),
          value: value,
          hasValue: value && value.trim() !== ''
        });
        
        // Count filled fields
        if (value && value.trim() !== '') {
          filledFields++;
          params.push(`${name}=${encodeURIComponent(value.trim())}`);
        }
      });

      if (params.length === 0) {
        return { 
          error: 'No form fields have values. Please fill in some example responses first.',
          formTitle: formTitle,
          totalFields: totalFields,
          filledFields: 0,
          debug: fieldData
        };
      }

      const prefillUrl = `${baseUrl}?${params.join('&')}`;
      
      return { 
        url: prefillUrl,
        formTitle: formTitle,
        totalFields: totalFields,
        filledFields: filledFields,
        debug: fieldData
      };
      
    } catch (error) {
      console.error('Error extracting form data:', error);
      return { error: 'Failed to extract form data: ' + error.message };
    }
  };
})(); 