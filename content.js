let matchedElements = [];
let currentIndex = -1;
let currentQuery = '';
let currentLoose = true;
let observer = null;
let currentUrl = window.location.href;

function clearSearch() {
  currentQuery = '';
  currentLoose = true;
  matchedElements = [];
  currentIndex = -1;
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  // Remove all highlights from the page
  const allMarks = document.querySelectorAll('mark');
  allMarks.forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
  
  console.log('Search cleared for new page');
}

// Detect page changes
function detectPageChange() {
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    console.log('Page changed from', currentUrl, 'to', newUrl);
    currentUrl = newUrl;
    clearSearch();
  }
}

// Monitor for URL changes (for SPAs like YouTube)
let urlCheckInterval = setInterval(detectPageChange, 1000);

// Also listen for popstate events
window.addEventListener('popstate', () => {
  setTimeout(detectPageChange, 100);
});

// Listen for pushstate/replacestate (YouTube navigation)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
  originalPushState.apply(history, arguments);
  setTimeout(detectPageChange, 100);
};

history.replaceState = function() {
  originalReplaceState.apply(history, arguments);
  setTimeout(detectPageChange, 100);
};

function highlightMatches(query, loose = true, autoTriggered = false) {
  // Check if page has changed before highlighting
  detectPageChange();
  
  currentQuery = query;
  currentLoose = loose;
  
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return;

  const selectors = [
    '#content-text',                           // YouTube comment text
    'div[data-test-id="comment"]',            // Reddit comment
    'ytd-comment-view-model #content-text',   // YouTube new structure
    'yt-attributed-string span',              // YouTube comment spans
    '.comment-text',                          // Generic comment text
    '[data-testid="comment"] p',             // Reddit comment paragraphs
    'div[id^="t1_"] .usertext-body',         // Reddit comment body
    '.Comment p',                            // Reddit comment class
    '.usertext .md p'                        // Reddit markdown comments
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  const previousMatchCount = matchedElements.length;
  matchedElements = [];

  elements.forEach(el => {
    const originalText = el.textContent;
    const text = originalText.toLowerCase();
    let matched = false;
    let highlighted = originalText;

      if (loose) {
        const matchesAllWords = words.every(w => text.includes(w));
        if (matchesAllWords) {
          matched = true;
          words.forEach(word => {
            const wordRegex = new RegExp(`\\b(${word})\\b`, 'gi');
            highlighted = highlighted.replace(wordRegex, '<mark style="background-color: yellow; padding: 1px 2px; border-radius: 2px;">$1</mark>');
          });
        }
      } else {
        const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const phraseRegex = new RegExp(`\\b(${escaped})\\b`, 'i');
        if (phraseRegex.test(text)) {
          matched = true;
          highlighted = originalText.replace(phraseRegex, '<mark style="background-color: yellow; padding: 1px 2px; border-radius: 2px;">$1</mark>');
        }
      }    if (matched) {
      el.innerHTML = highlighted;
      matchedElements.push(el);
    } else {
      el.innerHTML = originalText;
    }
  });

  // Only auto-scroll if this is a manual search (not auto-triggered)
  // and we have matches
  if (matchedElements.length > 0 && !autoTriggered) {
    currentIndex = 0;
    scrollToMatch(currentIndex);
  } else if (autoTriggered && matchedElements.length > previousMatchCount) {
    // For auto-triggered searches, just update the current index if we have more matches
    // but don't scroll
    if (currentIndex === -1) {
      currentIndex = 0;
    }
    console.log(`Auto-search found ${matchedElements.length - previousMatchCount} new matches`);
  }

  // Start observing for new comments if we have a search query
  startObserving();
}

function startObserving() {
  // Stop any existing observer
  if (observer) {
    observer.disconnect();
  }

  // Only observe if we have a current search query
  if (!currentQuery) return;

  observer = new MutationObserver((mutations) => {
    let shouldRerun = false;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // More comprehensive check for new comments
          const commentSelectors = [
            '#content-text',                              // YouTube comment text
            'div[data-test-id="comment"]',               // Reddit comment
            'ytd-comment-thread-renderer',               // YouTube comment container
            'ytd-comment-view-model',                    // YouTube new comment structure
            '.comment',                                   // Generic comment class
            '[data-testid="comment"]',                   // Reddit comment testid
            'div[id^="t1_"]',                           // Reddit comment threads
            '.Comment'                                   // Reddit comment class
          ];
          
          const hasNewComments = commentSelectors.some(selector => 
            (node.matches && node.matches(selector)) || 
            (node.querySelector && node.querySelector(selector))
          );
          
          // Also check if the node contains comment-like text content
          const hasCommentContent = node.textContent && 
                                   node.textContent.length > 20 && // Reasonable comment length
                                   (node.querySelector('p') || node.querySelector('span')); // Contains text elements
          
          if (hasNewComments || hasCommentContent) {
            shouldRerun = true;
          }
        }
      });
    });

    if (shouldRerun) {
      // Debounce the re-search to avoid too many calls
      clearTimeout(window.searchDebounceTimer);
      window.searchDebounceTimer = setTimeout(() => {
        console.log('Auto-searching new comments...');
        highlightMatches(currentQuery, currentLoose, true); // Mark as auto-triggered
      }, 800); // Increased delay for better performance
    }
  });

  // Observe multiple potential containers where comments might be loaded
  const targets = [
    document.getElementById('comments'),                    // YouTube comments section
    document.getElementById('contents'),                   // YouTube main content
    document.querySelector('#comments #continuations'),   // YouTube comment continuations
    document.querySelector('.commentarea'),               // Reddit comment area
    document.querySelector('[data-testid="comments-page-link-num-comments"]')?.closest('div'), // Reddit
    document.querySelector('.sitetable'),                 // Reddit comment listing
    document.body // Fallback to watch entire page
  ].filter(Boolean);

  targets.forEach(target => {
    if (target) {
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });
    }
  });

  console.log('Observer started for auto-search on scroll');
}

function scrollToMatch(index) {
  if (!matchedElements.length) return;
  const el = matchedElements[index];
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Remove previous highlights
  matchedElements.forEach(e => {
    const marks = e.querySelectorAll('mark');
    marks.forEach(mark => mark.style.outline = '');
  });
  
  // Highlight current match's words with red outline
  const currentMarks = el.querySelectorAll('mark');
  currentMarks.forEach(mark => mark.style.outline = '2px solid red');
}

// Listen for search request
window.addEventListener('commentSearch', (e) => {
  const { query, loose } = e.detail;
  console.log('Search triggered:', query, loose);
  
  // Clear any existing search first
  if (currentQuery && currentQuery !== query) {
    clearSearch();
  }
  
  highlightMatches(query, loose);
});

// Listen for navigation
window.addEventListener('jumpToMatch', (e) => {
  if (!matchedElements.length) return;

  if (e.detail === 'next') {
    currentIndex = (currentIndex + 1) % matchedElements.length;
  } else if (e.detail === 'prev') {
    currentIndex = (currentIndex - 1 + matchedElements.length) % matchedElements.length;
  }

  scrollToMatch(currentIndex);
});

// Add scroll listener as backup
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!currentQuery) return;
  
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const newCommentCount = document.querySelectorAll([
      '#content-text',
      'div[data-test-id="comment"]',
      'ytd-comment-view-model #content-text',
      'yt-attributed-string span',
      '.comment-text',
      '[data-testid="comment"] p',
      'div[id^="t1_"] .usertext-body',
      '.Comment p',
      '.usertext .md p'
    ].join(', ')).length;
    
    if (newCommentCount > matchedElements.length) {
      console.log('New comments detected via scroll, re-searching...');
      highlightMatches(currentQuery, currentLoose, true); // Mark as auto-triggered
    }
  }, 1000);
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  clearInterval(urlCheckInterval);
  clearSearch();
});
