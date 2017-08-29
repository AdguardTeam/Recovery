/* global chrome */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!sender.tab) {
        if (request.findLinks) {
            sendResponse({
                done: true,
                linksCountAllowed: document.querySelectorAll('.adguard-icon-status-ok').length,
                linksCountBlocked: document.querySelectorAll('.adguard-icon-status-not-ok').length
            });
        }
    }
});
