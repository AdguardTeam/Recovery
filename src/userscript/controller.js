import _ from 'lodash';
import Urls from '../_data/urls.json';

import {googleSpreadSheetPrefix} from '../common/js/options';

import {chromeRuntimeSend, chromeRuntimeListener} from './chrome.runtime';

export default class Controller {
    constructor(logs, view, highlightlinks, store, utils) {
        this.store = store;
        this.view = view;
        this.utils = utils;
        this.highlightlinks = highlightlinks;
        this.logs = logs;
        this.observer = null;
        this.urls = Urls.data;

        store.getData().then(response => {
            this.init(response);
        });

        chromeRuntimeSend({
            from: 'content',
            subject: 'getDataFromSpreadSheet'
        });

        this.check = this.checkLink.bind(this);
    }

    // TODO: remove this after release
    dataFromGoogleSpreadSheet(response) {
        response = JSON.parse(response);

        for (let i of response.feed.entry) {
            let domain = i[googleSpreadSheetPrefix + 'domain'].$t;

            let categories = i[googleSpreadSheetPrefix + 'categories'].$t;

            if (categories) {
                categories = this.parseCategories(categories);
            }

            let issueLink = i[googleSpreadSheetPrefix + 'issuelink'].$t;

            let paymentLink = i[googleSpreadSheetPrefix + 'paymentlink'].$t;

            this.urls.push({
                'domain': domain,
                'categories': categories,
                'issueLink': issueLink,
                'paymentLink': paymentLink
            });
        }

        if (this.utils.validatePage() && this.utils.checkVisibleAreaSize()) {
            chromeRuntimeSend({
                from: 'content',
                subject: 'showPageAction',
                data: this.checkLink(document.location.host)
            });
        }
    }

    parseCategories(categories) {
        categories = categories.split(',');

        return _.map(categories, (n) => {
            return parseInt(n);
        });
    }

    init(options) {
        if (this.pageCheckRequirements(options)) {
            this.highlightlinks.show(this.check);
            this.mutationObserver();
        }

        if (this.utils.validatePage() && this.utils.checkVisibleAreaSize()) {
            chromeRuntimeSend({
                from: 'content',
                subject: 'showPageAction',
                data: this.checkLink(document.location.host)
            });

            chromeRuntimeListener(this);
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
        if (nodes.className !== 'recovery-content' && !elClasses.contains('recovery') && !elClasses.contains('recovery-status')) {
            _this.highlightlinks.show(_this.check);
        }
    }

    /**
     * Checking the link for compliance with settings Adblock Recovery
     *
     * @param  {String} url    url link
     */
    checkLink(url) {
        return this.urls.find((link) => url.indexOf(link.domain) >= 0);
    }

    readMode(content) {
        this.view.openInReadmod(content);
    }

    prepareReadmod() {
        this.view.prepareReadmodBlock();
    }
}
