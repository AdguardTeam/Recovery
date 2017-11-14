import {qsa} from './helpers';
import {settings} from './settings';

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
        return !!url && url.length > 4;
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
     * link is not image validation
     */
    validateLinkIsNotTagImage(el) {
        return !(el.childElementCount === 1 && el.innerHTML.indexOf('img') > -1);
    }

    /**
     * link is already checked validation
     *
     * @param  {Object} el   current link element
     * @return {Object|undefined}    object for update or undefined
     */
    validateLinkAlreadyChecked(el) {
        let href = el.hostname;
        let iconElements = qsa('.adblock-recovery', el.parentNode);
        let currentEl;

        iconElements.forEach((el) => {
            if(el.getAttribute('data-href') === href) {
                currentEl = el;
            }
        });

        return currentEl;
    }
}
