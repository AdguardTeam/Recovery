/* global chrome */
import {qs,qsa,$on} from '../../common/js/helpers';

export default class View {
    constructor() {

    }

    appendContent(responseText, url) {
        if(!responseText) {
            return false;
        }

        // simple current page url parser
        let currentUrl = document.createElement('a');
        currentUrl.href = url;

        let content = new DOMParser().parseFromString(responseText, 'text/html');

        // remove scripts, styles, images
        let elements = qsa('script, link, noscript, style, img, input, button, iframe', content);

        for (let index = elements.length - 1; index >= 0; index--) {
            elements[index].parentNode.removeChild(elements[index]);
        }

        // remove inline styles
        let inlineStyles = qsa('[style]', content);

        for (let index = inlineStyles.length - 1; index >= 0; index--) {
            inlineStyles[index].removeAttribute('style');
        }

        // changing links
        let links = qsa('a', content);

        for (let index = 0; index < links.length; index++) {
            let href = links[index].getAttribute('href');

            // better url parser implementation
            let linkUrl = document.createElement('a');
            linkUrl.href = href;

            // rewrite links with javascript code
            if (linkUrl.protocol.indexOf('javascript') === 0) {
                linkUrl.href = currentUrl.href;
            }

            // TODO: don't change third-party links:
            // let isTPL = links[index].hostname && links[index].hostname.indexOf(currentUrl.hostname.replace('www.','')) < 0;
            let url = chrome.runtime.getURL('readmode.html') + '?url=' +
                currentUrl.protocol + '//' +
                (linkUrl.host === document.location.host ? currentUrl.host : linkUrl.host) +
                (linkUrl.pathname === document.location.pathname ? currentUrl.pathname : linkUrl.pathname);

            links[index].setAttribute('href', url);
        }

        const closeBtn = qs('.adblock-recovery-readmode-close');

        $on(closeBtn, 'click', () => {
            chrome.tabs.getCurrent((tab) => {
                chrome.tabs.remove(tab.id);
            });
        });

        qs('.container', document.body).innerHTML = content.body.innerHTML;
    }
}
