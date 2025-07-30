try {
  document.addEventListener('DOMContentLoaded', function() {
  
  const statusDiv = document.getElementById('status');
  const urlContainer = document.getElementById('urlContainer');
  const urlDisplay = document.getElementById('urlDisplay');
  const copyButton = document.getElementById('copyButton');
  const generateButton = document.getElementById('generateButton');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  const helpButton = document.getElementById('helpButton');
  const helpModal = document.getElementById('helpModal');
  const closeHelpButton = document.getElementById('closeHelpButton');
  
  // Help modal functionality
  function showHelp() {
    helpModal.classList.remove('hidden');
  }

  function hideHelp() {
    helpModal.classList.add('hidden');
  }

  // Event listeners for help
  helpButton.addEventListener('click', showHelp);
  closeHelpButton.addEventListener('click', hideHelp);
  
  // Close modal when clicking outside
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      hideHelp();
    }
  });

  // Function to show status
  function showStatus(message, isError = false) {
    statusDiv.innerHTML = `
      ${isError ? '' : '<div class="loading"></div>'}
      <div>${message}</div>
    `;
    statusDiv.className = `status ${isError ? 'error' : ''}`;
    statusDiv.classList.remove('hidden');
    urlContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
  }

  // Function to show URL with multi-page info
  function showUrl(url, result) {
    statusDiv.classList.add('hidden');
    urlContainer.classList.remove('hidden');
    urlDisplay.textContent = url;
    errorContainer.classList.add('hidden');
    
    // Remove any existing info div
    const existingInfo = urlContainer.querySelector('.multi-page-info');
    if (existingInfo) {
      existingInfo.remove();
    }
    
    // Add multi-page information if available
    if (result.visitedPages && result.visitedPages > 1) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'multi-page-info';
      infoDiv.style.cssText = 'font-size: 12px; color: #6c757d; margin-top: 10px; text-align: center;';
      infoDiv.textContent = `Collected data from ${result.visitedPages} pages with ${result.filledFields} filled fields`;
      urlContainer.appendChild(infoDiv);
    }
  }

  // Function to show error
  function showError(message) {
    statusDiv.classList.add('hidden');
    urlContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    errorMessage.textContent = message;
  }

  // Function to copy URL to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy Link';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy Link';
      }, 2000);
    }
  }

  // Function to generate prefill URL
  async function generatePrefillUrl() {
    try {
      showStatus('Analyzing form...');
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('docs.google.com/forms')) {
        showError('Please navigate to a Google Form page to use this extension.');
        return null;
      }

      // Execute content script to extract form data using the multi-page function
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: async () => {
          // Try the multi-page extractFormData function first
          if (typeof window.extractFormData === 'function') {
            try {
              const result = await window.extractFormData();
              return result;
            } catch (error) {
              console.error('extractFormData error:', error);
              // Fall back to single-page function
              if (typeof window.extractCurrentPageFormData === 'function') {
                return window.extractCurrentPageFormData();
              }
              return { error: 'Failed to extract form data: ' + error.message };
            }
          } else if (typeof window.extractCurrentPageFormData === 'function') {
            // Use single-page function as fallback
            return window.extractCurrentPageFormData();
          } else {
            console.error('No form analysis function available');
            return { error: 'Form analysis function not available' };
          }
        }
      });

      const result = results[0].result;
      
      if (result.error) {
        showError(result.error);
        return null;
      }

      if (!result.url) {
        showError('Could not generate prefill URL. Make sure you are on a Google Form page.');
        return null;
      }

      showUrl(result.url, result);
      return result;
      
    } catch (error) {
      console.error('Error generating prefill URL:', error);
      showError('An error occurred while generating the prefill URL. Please try again.');
      return null;
    }
  }

  // Event listeners
  copyButton.addEventListener('click', () => {
    copyToClipboard(urlDisplay.textContent);
  });

  generateButton.addEventListener('click', generatePrefillUrl);

  // Generate URL when popup opens
  generatePrefillUrl();
  });
} catch (error) {
  console.error('Error in popup.js:', error);
  alert('Error in popup.js: ' + error.message);
} 