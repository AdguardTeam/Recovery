/* global RECOVERYGLOBALCSS*/

import {$on,qsa,appendCSS,qs} from '../common/js/helpers';
import {excludedClasses} from '../common/js/options';

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

        if (!qs('#recovery-styles')) {
            appendCSS(RECOVERYGLOBALCSS, null, 'recovery-styles');
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
        adblockRecoveryIcon.className = 'recovery-status';

        adblockRecovery = document.createElement('div');
        adblockRecovery.className = 'recovery';
        adblockRecovery.setAttribute('data-href', el.href);
        adblockRecovery.setAttribute('data-href-alt', elementData.domain);
        adblockRecovery.appendChild(adblockRecoveryIcon);

        elementData.categories.forEach((lvl) => {
            adblockRecoveryIcon.classList.add('recovery-status-' + lvl);
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

        if (this.checkParentsElements(el)) {
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

    // do not highlight links if a some parent has class from excluded list
    checkParentsElements(el) {
        return excludedClasses.find(className => this.utils.ancestorValidation(el, className));
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
