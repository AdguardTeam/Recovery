/* global ADBLOCKRECOVERYSTYLE*/

import {$on,qsa,appendCSS} from './helpers';

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

        let elementData = handler(el.hostname);

        if (!elementData) {
            return false;
        }

        let adblockRecoveryIcon, adblockRecovery;

        adblockRecoveryIcon = document.createElement('div');
        adblockRecoveryIcon.className = 'adblock-recovery-status';

        adblockRecovery = document.createElement('div');
        adblockRecovery.className = 'adblock-recovery';
        adblockRecovery.setAttribute('data-href', el.hostname);
        adblockRecovery.appendChild(adblockRecoveryIcon);

        elementData.categories.forEach((lvl) => {
            adblockRecoveryIcon.classList.add('adblock-recovery-status-' + lvl);
        });

        appendCSS(ADBLOCKRECOVERYSTYLE);

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

    stopPropagation(e) {
        e.stopPropagation();
    }
}
