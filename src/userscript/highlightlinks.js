/* global ADBLOCKRECOVERYSTYLE*/

import {$on,qsa,appendCSS,qs} from '../common/js/helpers';

export default class Highlightlinks {
    constructor(utils, logs) {
        this.linkElements = null;
        this.utils = utils;
        this.logs = logs;
    }

    /**
     * Find link elements on a page
     *
     * @param  {Function} handler   function which is checking the link for compliance with settings Adblock Recovery
     */
    show(handler) {
        if (!this.pageCheckRequirements()) {
            return false;
        }

        this.linkElements = qsa('a');

        if (!this.linkElements.length) {
            return false;
        }

        if (!qs('#adblock-recovery-styles')) {
            appendCSS(ADBLOCKRECOVERYSTYLE, null, 'adblock-recovery-styles');
        }

        this.linkElements.forEach((el) => this.addIconToLinkElement(el, handler));
    }

    /**
     * Add icons
     *
     * @param  {Object} el   current element
     * @param  {Function} handler   function which is checking the link for compliance with settings Adblock Recovery
     */
    addIconToLinkElement(el, handler) {
        if (!this.linkCheckRequirements(el)) {
            return false;
        }

        let elementData = handler(el.hostname) || this.findAlternativeLink(el, handler);

        if (!elementData) {
            return false;
        }

        let adblockRecoveryIcon, adblockRecovery;

        adblockRecoveryIcon = document.createElement('div');
        adblockRecoveryIcon.className = 'adblock-recovery-status';

        adblockRecovery = document.createElement('div');
        adblockRecovery.className = 'adblock-recovery';
        adblockRecovery.setAttribute('data-href', el.hostname);
        adblockRecovery.setAttribute('data-href-alt', elementData.domain);
        adblockRecovery.appendChild(adblockRecoveryIcon);

        elementData.categories.forEach((lvl) => {
            adblockRecoveryIcon.classList.add('adblock-recovery-status-' + lvl);
        });

        el.parentNode.insertBefore(adblockRecovery, el.nextSibling);
        $on(adblockRecoveryIcon, 'click', this.stopPropagation);
    }

    /**
     * Page validation
     */
    pageCheckRequirements() {
        if (!this.utils.validatePage()) {
            return false;
        }

        if (!this.utils.checkVisibleAreaSize()) {
            return false;
        }

        return true;
    }

    /**
     * Link element validation
     */
    linkCheckRequirements(el) {
        let url = decodeURIComponent(el.hostname);

        // do not highlighting links in `.module__content` block on a duckduckgo.com
        if (this.utils.ancestorValidation(el, 'module__content')) {
            return false;
        }

        switch (false) {
            case this.utils.validateUrlString(url):
                return false;

            case this.utils.validateUrlIsExternal(url):
                return false;

            case this.utils.validateLinkIsNotEmpty(el):
                return false;

            case this.utils.validateLinkIsNotBgImage(el):
                return false;

            case this.utils.validateLinkIsNotTagImage(el):
                return false;

            case !this.utils.validateLinkAlreadyChecked(el):
                return false;
            default:
                return true;
        }
    }

    /**
     * Finding threated links in short urls like `t.co`
     *
     * @param  {Object} element   current element
     * @param  {Function} handler   function which is checking the link for compliance with settings Adblock Recovery
     */
    findAlternativeLink(element, handler) {
        const altUrls = [];

        altUrls.push(element.getAttribute('data-expanded-url')); // twitter
        altUrls.push(element.getAttribute('title')); // others

        for (let url of altUrls) {
            if (url) {
                url = decodeURIComponent(url);

                url = this.utils.validateUrlString(url) && handler(url);
                if (url) {
                    return url;
                }
            }
        }
    }

    stopPropagation(e) {
        e.stopPropagation();
    }
}
