/* global chrome */

export default class ChromeRuntime {
    constructor(controller) {
        this.controller = controller;
        this.chrome = typeof(chrome) === 'undefined' ? null : chrome;
        this.addListener();
    }

    /**
     * chrome.runtime listener which waiting messages from extension popup and returning data about the page
     */
    addListener() {
        const _this = this;

        if(!this.chrome) {
            return false;
        }

        this.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (!sender.tab) {
                if (request.getData) {
                    sendResponse({
                        done: true,
                        host: document.location.host,
                        data: _this.controller.check(document.location.host)
                    });
                }
            }
        });
    }
}
