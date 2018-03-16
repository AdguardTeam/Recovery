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
        switch (request.requestType) {
            case 'getData':
                // sending site data to popup
                sendResponse({
                    done: true,
                    location: document.location,
                    data: controller.check(document.location.host)
                });
                break;
            case 'showReadMode':
                controller.readMode(request.data);
                break;
            case 'dataFromSpredSheet':
                controller.dataFromGoogleSpreadSheet(request.data);
                break;
            case 'prepareReadMode':
                controller.prepareReadMode();
                break;
            case 'log':
                controller.logs.info(request);
                break;
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
