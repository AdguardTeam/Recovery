/* global chrome */

(function () {
    const allow = document.getElementById('allow');
    const disallow = document.getElementById('disallow');
    const options = document.getElementById('options');

    const doTheThing = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {findLinks: true}, function(response) {
            if(response.done) {
                allow.innerText = 'Links trusted: ' + response.linksCountAllowed;
                disallow.innerText = 'Links untrusted: ' + response.linksCountBlocked;
            }
          });
        });
    };

    options.addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          // New way to open options pages, if supported (Chrome 42+).
          chrome.runtime.openOptionsPage();
        } else {
          // Reasonable fallback.
          window.open(chrome.runtime.getURL('options.html'));
        }
    });

    // doTheThing();
})();
