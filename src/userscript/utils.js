import {qsa, qs} from '../common/js/helpers';
import {settings} from '../common/js/settings';

/**
 * Secondary functions class.
 * @constructor
 * @param {class} logs - logging info or errors.
 * @returns {{validatePage: Function, checkVisibleAreaSize: Function, validateUrlString: Function, validateUrlIsExternal: Function, validateLinkIsNotEmpty: Function, validateLinkIsNotBgImage: Function, validateLinkIsNotTagImage: Function, validateLinkAlreadyChecked: Function, ancestorValidation: Function, checkShadowDomSupport: Function}}
 */
export default class Utils {
    constructor(logs) {
        this.logs = logs;
    }

    /**
     * Page validation
     */
    validatePage() {
        if (window.window !== window.top) {
            this.logs.error('Page is iframe: ' + window.location.href);
            return false;
        }

        // Check for necessary html elements existence
        const head = !!document.getElementsByTagName('head').length;
        const body = !!document.getElementsByTagName('body').length;

        if (!head) {
            this.logs.error('Head tag is missing');
        }

        if (!body) {
            this.logs.error('Body tag is missing');
        }

        return head && body;
    }

    /**
     * Page area size validation
     */
    checkVisibleAreaSize() {
        const viewPort = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        const visibleAreaSize = viewPort.height > settings.MINIMUM_VISIBLE_HEIGHT_TO_HIGHLIGHTING;

        if (!visibleAreaSize) {
            this.logs.error('Viewport height is too small: ' + viewPort.height);
        }

        return visibleAreaSize;
    }

    /**
     * url string is not empty validation
     */
    validateUrlString(url) {
        return !!url && url.length > 3;
    }

    /**
     * url string is external validation
     */
    validateUrlIsExternal(url) {
        let host = document.location.host.split('.').slice(-2).join('.');
        url = url.replace('www.', '');
        return url.indexOf(host) === -1;
    }

    /**
     * element is not empty validation
     */
    validateLinkIsNotEmpty(el) {
        return el.innerHTML !== '' && el.innerText !== '';
    }

    /**
     * link is not image validation
     */
    validateLinkIsNotBgImage(el) {
        return window.getComputedStyle(el, null).background.indexOf('url') === -1;
    }

    /**
     *checking that link does not have images
     */
    validateLinkIsNotTagImage(el) {
        return !qs('img', el);
    }

    /**
     * link is already checked validation
     *
     * @param  {Object} el   current link element
     * @return {Object|undefined}    object for update or undefined
     */
    validateLinkAlreadyChecked(el) {
        let href = el.hostname;
        let iconElements = qsa('.recovery', el.parentNode);
        let currentEl;

        iconElements.forEach((el) => {
            if(el.getAttribute('data-href').indexOf(href) >= 0) {
                currentEl = el;
            }
        });

        return currentEl;
    }

    ancestorValidation(el, cls) {
        return !!this.findAncestor(el, cls);
    }

    findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls)); // jshint ignore: line
        return el;
    }

    /**
     * Check browser shadow dom support
     */
    checkShadowDomSupport() {
        return typeof(document.documentElement.attachShadow) !== 'undefined';
    }
}
