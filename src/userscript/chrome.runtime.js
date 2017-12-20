/* global chrome */

const chromeRuntime = typeof(chrome) !== 'undefined' && chrome.runtime ? chrome.runtime : null;

/**
 * chrome.runtime listener which waiting messages from extension popup and returning data about the page
 */
export function chromeRuntimeListener(controller) {
    if (!chromeRuntime) {
        return false;
    }

    chromeRuntime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.getData) {
            sendResponse({
                done: true,
                location: document.location,
                data: controller.check(document.location.host)
            });
        }

        if (request.showReadMode) {
            controller.readMode(request.content);
        }
    });
}

/*
 * sending messages to background.js
 */
export function chromeRuntimeSend(data) {
    if (!chromeRuntime) {
        return false;
    }

    chromeRuntime.sendMessage(data);
}
