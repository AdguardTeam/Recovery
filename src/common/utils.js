import {qsa} from './helpers';

export default class Utils {
    validateUrlString(url) {
        return !!url && url.length > 4;
    }

    validateUrlIsExternal(url) {
        let host = document.location.host.split('.').slice(-2).join('.');
        url = url.replace('www.', '');
        return url.indexOf(host) === -1;
    }

    validateLinkIsNotEmpty(el) {
        return el.innerHTML !== '' && el.innerText !== '';
    }

    validateLinkIsNotBgImage(el) {
        return window.getComputedStyle(el, null).background.indexOf('url') === -1;
    }

    validateLinkIsNotTagImage(el) {
        return !(el.childElementCount === 1 && el.innerHTML.indexOf('img') > -1);
    }

    /**
     * validateLinkAlreadyChecked
     *
     * @param  {Object} el   current link element
     * @return {Object|undefined}    object for update or undefined
     */
    validateLinkAlreadyChecked(el) {
        let href = el.hostname;
        let iconElements = qsa('.adguard-icon', el.parentNode);
        let currentEl;

        iconElements.forEach((el) => {
            if(el.getAttribute('data-href') === href) {
                currentEl = el;
            }
        });

        return currentEl;
    }
}
