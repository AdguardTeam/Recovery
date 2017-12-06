/* global chrome */

export default class ChromeRuntime {
    constructor(controller, utils) {
        this.utils = utils;
        this.controller = controller;
        this.chrome = typeof(chrome) === 'undefined' ? null : chrome;

        if (this.chrome) {
            this.init();
            this.addListener();
        }
    }

    init() {
        if (!this.utils.validatePage() || !this.utils.checkVisibleAreaSize()) {
            return false;
        }

        this.chrome.runtime.sendMessage({
            from: 'content',
            subject: 'showPageAction',
            data: this.checkThePage()
        });
    }

    /**
     * chrome.runtime listener which waiting messages from extension popup and returning data about the page
     */
    addListener() {
        const _this = this;

        if (!this.utils.validatePage() || !this.utils.checkVisibleAreaSize()) {
            return false;
        }

        this.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (!sender.tab) {
                if (request.getData) {
                    sendResponse({
                        done: true,
                        host: document.location.host,
                        data: _this.checkThePage()
                    });
                }
            }
        });
    }

    checkThePage() {
        return this.controller.check(document.location.host);
    }
}
