/**
 * Global Shell for GenAI Incremental Localization Experiment
 * 
 * This script provides the chrome around each step:
 * - Top bar with step selector, navigation, copy link
 * - Sidebar with agent notes and prompts
 * - Footer with attribution
 */

(function() {
  'use strict';

  const STEPS_JSON_URL = () => `${getBasePrefix()}/steps.json`;
  
  let stepsData = [];
  let currentStep = null;
  let sidebarOpen = window.innerWidth >= 768;

  function getBasePrefix() {
    const path = window.location.pathname.replace(/\/index\.html$/, '');
    const stepMatch = path.match(/^(.*)\/step-\d+(?:\/|$)/);
    if (stepMatch) return stepMatch[1] || '';
    const aboutMatch = path.match(/^(.*)\/about\/?$/);
    if (aboutMatch) return aboutMatch[1] || '';
    if (path === '/') return '';
    return path.replace(/\/$/, '');
  }

  function joinBase(pathname) {
    const base = getBasePrefix();
    if (!base) return pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${base}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
  }

  // Initialize shell
  async function init() {
    // Detect current step from URL
    const pathMatch = window.location.pathname.match(/\/(step-\d+)(?:\/|\/index\.html)/);
    if (!pathMatch) {
      console.log('[shell] Not on a step page, skipping shell initialization');
      return;
    }
    
    currentStep = pathMatch[1];
    console.log('[shell] Current step:', currentStep);

    try {
      // Load steps metadata
      const response = await fetch(STEPS_JSON_URL());
      if (!response.ok) throw new Error('Failed to load steps.json');
      stepsData = await response.json();
      console.log('[shell] Loaded steps data:', stepsData);

      // Inject shell UI
      injectShell();
      
      // Load sidebar content
      loadSidebarContent();
      
      // Set up event listeners
      setupEventListeners();
      
    } catch (error) {
      console.error('[shell] Initialization error:', error);
    }
  }

  function injectShell() {
    const body = document.body;
    
    // Create shell container
    const shellContainer = document.createElement('div');
    shellContainer.id = 'global-shell';
    shellContainer.innerHTML = `
      <div class="shell-topbar">
        <div class="shell-topbar-left">
          <button class="shell-hamburger" id="shell-hamburger" aria-label="Toggle sidebar">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <select class="shell-step-selector" id="shell-step-selector" aria-label="Select step">
            ${generateStepOptions()}
          </select>
        </div>
        <div class="shell-topbar-right">
          <a href="${joinBase('/') }" class="shell-nav-link">Home</a>
          <a href="${joinBase('about/') }" class="shell-nav-link">About</a>
          <button class="shell-copy-link" id="shell-copy-link" aria-label="Copy link to this step">
            <span class="copy-icon">🔗</span>
            <span class="copy-text">Link</span>
            <span class="copied-text">Copied!</span>
          </button>
        </div>
      </div>
      
      <div class="shell-layout">
        <aside class="shell-sidebar ${sidebarOpen ? 'open' : ''}" id="shell-sidebar">
          <div class="shell-sidebar-content">
            <div class="shell-sidebar-section">
              <h3 class="shell-sidebar-heading">Agent Notes</h3>
              <div id="shell-notes-content" class="shell-sidebar-iframe-container">
                <p class="shell-loading">Loading...</p>
              </div>
            </div>
            <div class="shell-sidebar-section">
              <h3 class="shell-sidebar-heading">Prompt</h3>
              <div id="shell-prompt-content" class="shell-sidebar-iframe-container">
                <p class="shell-loading">Loading...</p>
              </div>
            </div>
          </div>
        </aside>
        
        <main class="shell-main" id="shell-main">
          <!-- Original page content will be here -->
        </main>
      </div>
      
      <footer class="shell-footer">
        <p>Made by <a href="https://moriel.tech" target="_blank" rel="noopener">Moriel Schottlender</a></p>
      </footer>
    `;

    // Move existing body content into shell-main
    const main = shellContainer.querySelector('#shell-main');
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }

    // Append shell to body
    body.appendChild(shellContainer);
  }

  function generateStepOptions() {
    return stepsData.map(step => {
      const selected = step.tag === currentStep ? ' selected' : '';
      return `<option value="${step.tag}"${selected}>${step.tag}: ${step.description}</option>`;
    }).join('');
  }

  function loadSidebarContent() {
    const currentStepData = stepsData.find(s => s.tag === currentStep);
    if (!currentStepData) {
      console.error('[shell] Current step not found in metadata');
      return;
    }

    // Load agent notes
    const notesContainer = document.getElementById('shell-notes-content');
    fetch(joinBase(currentStepData.notesPath))
      .then(response => response.text())
      .then(html => {
        const iframe = document.createElement('iframe');
        iframe.srcdoc = html;
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.style.minHeight = '400px';
        iframe.onload = () => {
          // Adjust iframe height to content
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const height = iframeDoc.body.scrollHeight;
            iframe.style.height = `${height + 20}px`;
          } catch (e) {
            console.warn('[shell] Could not adjust iframe height:', e);
          }
        };
        notesContainer.innerHTML = '';
        notesContainer.appendChild(iframe);
      })
      .catch(error => {
        console.error('[shell] Error loading notes:', error);
        notesContainer.innerHTML = '<p class="shell-error">Failed to load agent notes.</p>';
      });

    // Load prompt
    const promptContainer = document.getElementById('shell-prompt-content');
    fetch(joinBase(currentStepData.promptPath))
      .then(response => response.text())
      .then(html => {
        const iframe = document.createElement('iframe');
        iframe.srcdoc = html;
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.style.minHeight = '200px';
        iframe.onload = () => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const height = iframeDoc.body.scrollHeight;
            iframe.style.height = `${height + 20}px`;
          } catch (e) {
            console.warn('[shell] Could not adjust iframe height:', e);
          }
        };
        promptContainer.innerHTML = '';
        promptContainer.appendChild(iframe);
      })
      .catch(error => {
        console.error('[shell] Error loading prompt:', error);
        promptContainer.innerHTML = '<p class="shell-error">Failed to load prompt.</p>';
      });
  }

  function setupEventListeners() {
    // Step selector change
    const selector = document.getElementById('shell-step-selector');
    selector.addEventListener('change', (e) => {
      const selectedStep = e.target.value;
      const stepData = stepsData.find(s => s.tag === selectedStep);
      if (stepData) {
        window.location.href = joinBase(stepData.path);
      }
    });

    // Hamburger toggle
    const hamburger = document.getElementById('shell-hamburger');
    const sidebar = document.getElementById('shell-sidebar');
    hamburger.addEventListener('click', () => {
      sidebarOpen = !sidebarOpen;
      sidebar.classList.toggle('open', sidebarOpen);
      hamburger.classList.toggle('active', sidebarOpen);
    });

    // Copy link button
    const copyButton = document.getElementById('shell-copy-link');
    copyButton.addEventListener('click', async () => {
      const url = window.location.href;
      
      try {
        await navigator.clipboard.writeText(url);
        copyButton.classList.add('copied');
        setTimeout(() => {
          copyButton.classList.remove('copied');
        }, 2000);
      } catch (error) {
        console.error('[shell] Copy failed:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          copyButton.classList.add('copied');
          setTimeout(() => {
            copyButton.classList.remove('copied');
          }, 2000);
        } catch (e) {
          console.error('[shell] Fallback copy failed:', e);
        }
        document.body.removeChild(textArea);
      }
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebarOpen && window.innerWidth < 768) {
        sidebarOpen = false;
        sidebar.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });

    // Responsive behavior
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && !sidebarOpen) {
        sidebarOpen = true;
        sidebar.classList.add('open');
      }
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
