import _ from 'lodash';
import {gm} from './gm-api';
import {defaultOptions} from '../options/js/options';
import Urls from '../data/urls.json';

export default class Controller {
    constructor(logs, view, highlightlinks) {
        this.view = view;
        this.highlightlinks = highlightlinks;
        this.logs = logs;
        this.options = this.getOptions() || defaultOptions;
        this.observer = null;

        this.check = this.checkLink.bind(this);

        this.init();

        this.mutationObserver();
    }

    init() {
        if (this.pageCheckRequirements(this.options)) {
            this.highlightlinks.show(this.check);
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

        return opt.urls.some((url) => {
            if (url.show && document.location.host.indexOf(url.host) === 0) {
                return true;
            }
        });
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
                    if (mutation.type === 'childList') {
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
     * Function for highlighting links when changing the DOM. Lodash Throttle with 500 ms for better performance
     *
     * @param  {Object} elClasses   list of element classes
     * @param  {Object} nodes       changeable DOM node
     */
    rebuild(_this, elClasses, nodes) {
        if (nodes && nodes.className !== 'adblock-recovery-content' && !elClasses.contains('adblock-recovery') && !elClasses.contains('adblock-recovery-status')) {
            _this.init();
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

    getOptions() {
        return gm.get('adblock-recovery-store', defaultOptions);
    }
}
