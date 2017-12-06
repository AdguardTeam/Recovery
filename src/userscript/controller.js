import _ from 'lodash';
import Urls from '../_data/urls.json';

export default class Controller {
    constructor(logs, view, highlightlinks, store) {
        this.store = store;
        this.view = view;
        this.highlightlinks = highlightlinks;
        this.logs = logs;
        this.observer = null;

        store.getData().then(response => {
            this.init(response);
        });

        this.check = this.checkLink.bind(this);
    }

    init(options) {
        if (this.pageCheckRequirements(options)) {
            this.highlightlinks.show(this.check);
            this.mutationObserver();
        }
    }

    /**
     * Checking the page for compliance with settings Adblock Recovery
     *
     * @param  {Object} opt   options object
     * @return {Boolean}      corresponds or not
     */
    pageCheckRequirements(opt) {
        if (!opt.warningIconsNearLinks) {
            return false;
        }

        if (!opt.warningIconsNearLinks.show) {
            return false;
        }

        for (let url in opt) {
            if (opt[url].show && document.location.host.indexOf(opt[url].host) === 0) {
                return true;
            }
        }
    }

    /**
     * DOM change event listener
     */
    mutationObserver() {
        const _this = this;

        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        const throttleRebuild = _.throttle(this.rebuild, 500);

        try {
            _this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes[0]) {
                        throttleRebuild(_this, mutation.target.classList, mutation.addedNodes[0]);
                    }
                });
            });

            _this.observer.observe(document, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            this.logs.error('MutationObserver is not available on this browser');
        }
    }

    /**
     * Function for highlighting links when changing the DOM
     *
     * @param  {Object} elClasses   list of element classes
     * @param  {Object} nodes       changeable DOM node
     */
    rebuild(_this, elClasses, nodes) {
        if (nodes.className !== 'adblock-recovery-content' && !elClasses.contains('adblock-recovery') && !elClasses.contains('adblock-recovery-status')) {
            _this.highlightlinks.show(_this.check);
        }
    }

    /**
     * Checking the link for compliance with settings Adblock Recovery
     *
     * @param  {String} url    url link
     */
    checkLink(url) {
        return Urls.data.find((link) => url.indexOf(link.domain) >= 0);
    }
}
