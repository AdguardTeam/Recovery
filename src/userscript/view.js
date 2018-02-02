/* global RECOVERYGLOBALCSS */
import {$on, $delegate, qsa, qs, appendCSS} from '../common/js/helpers';
import logs from '../common/js/logs';

import Urls from '../_data/urls.json';

import {chromeRuntimeSend} from './chrome.runtime';

export default class View {
    constructor(template, utils) {
        this.template = template;
        this.utils = utils;

        $on(document, 'click', this.closeLinksStatus);
        $delegate(document, '.recovery-status', 'click', ({target}) => {
            this.closeLinksStatus();
            this.showLinkStatus(target);
        }, true);
    }

    /**
     * opening popup with information about the link
     *
     * @param {Object} target   current link element
     */
    showLinkStatus(target) {
        const _this = this;
        target.classList.add('recovery-status-show');
        const status = Urls.data.find((link) => {
            return target.parentNode.getAttribute('data-href').indexOf(link.domain) >= 0 || target.parentNode.getAttribute('data-href-alt').indexOf(link.domain) >= 0;
        });
        const rect = this.getOffsetRect(target);
        const content = _this.template.linkStatus(status);
        const urlForReadMode = target.parentNode.getAttribute('data-href');
        let el = null;

        if (this.utils.checkShadowDomSupport()) {
            el = this.createShadowRootElement(content, rect, urlForReadMode);

            // storing shadowdom root element to close popover event
            this.shadowDomRoot = el;
        } else {
            el = this.createIframeElement(content, rect, urlForReadMode);
        }

        document.documentElement.appendChild(el);
    }

    appendDefailtEvents(el, url) {
        const _this = this;

        $delegate(el, '.recovery-status-close', 'click', () => {
            _this.closeLinksStatus();
        }, true);

        $delegate(el, '.recovery-status-readmod', 'click', () => {
            // `location` variable is like document.location
            let location = {
                href: url
            };
            _this.gettingContentForReadMode(location);
        }, true);
    }

    createIframeElement(content, rect, url) {
        let iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'recovery-status-iframe');
        iframe.setAttribute('frameBorder', 0);
        iframe.setAttribute('width', 350);
        iframe.setAttribute('allowTransparency', 'true');
        this.moveElementTo(iframe, rect.left, rect.top);

        iframe.onload = () => {
            const doc = iframe.contentDocument;

            // RECOVERYGLOBALCSS - global styles string which created by the gulp task `tasks/extension.js`
            const style = '<style type="text/css">' + RECOVERYGLOBALCSS + '</style>';
            doc.open();
            doc.write('<html><head>' + style + '</head><body class="recovery-status-body">' + content + '</body></html>');
            doc.close();

            // setting iframe height dynamically based on inner content
            iframe.setAttribute('height', iframe.contentWindow.document.body.scrollHeight || 370);
            this.appendDefailtEvents(doc, url);
        };

        return iframe;
    }

    createShadowRootElement(content, rect, url) {
        const el = document.createElement('div');
        const shadowRootElement = el.attachShadow({mode: 'closed'});

        const shadowRootDefaultStyle = {
            display: 'block',
            width: 0,
            height: 0,
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            'z-index': 9999999999
        };

        let style = [];

        Object.keys(shadowRootDefaultStyle).forEach(function(key) {
            style.push(key + ':' + shadowRootDefaultStyle[key] + '!important;');
        });

        style = ':host {' + style.join('') + '}';
        shadowRootElement.innerHTML = '<style>' + style + RECOVERYGLOBALCSS + '</style>' + content;

        let contentEl = shadowRootElement.querySelector('div.recovery-status-content');

        contentEl.classList.add('recovery-status-content--margin');
        this.moveElementTo(contentEl, rect.left, rect.top);
        this.appendDefailtEvents(shadowRootElement, url);

        return el;
    }

    /**
     * write the content in the iframe
     *
     * @param {Object} iframe   current iframe
     * @param {String} content   content
     * @param {String} href   url link to open read mode
     */
    appendContentToIframe(iframe, content, href) {
        const doc = iframe.contentDocument;

        // RECOVERYGLOBALCSS - global styles string which created by the gulp task `tasks/extension.js`
        const style = '<style type="text/css">' + RECOVERYGLOBALCSS + '</style>';
        doc.open();
        doc.write('<html><head>' + style + '</head><body class="recovery-status-body">' + content + '</body></html>');
        doc.close();
        iframe.style.setProperty('display', 'block', 'important');

        // setting iframe height dynamically based on inner content
        iframe.setAttribute('height', iframe.contentWindow.document.body.scrollHeight || 370);

        // `location` variable is like document.location
        let location = {
            href: href
        };

        this.appendDefailtEvents(iframe.contentWindow.document.body, location);
    }

    /**
     * closing popup with information about the link
     */
    closeLinksStatus() {
        let frame = this.shadowDomRoot || qs('.recovery-status-iframe');
        if (frame) {
            frame.remove();
            frame = null;
        }
        qsa('.recovery-status-show').forEach((e) => {
            e.classList.remove('recovery-status-show');
        });
    }

    getOffsetRect(elem) {
        const box = elem.getBoundingClientRect();

        const body = document.body;
        const docElem = document.documentElement;

        const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        const clientTop = docElem.clientTop || body.clientTop || 0;
        const clientLeft = docElem.clientLeft || body.clientLeft || 0;

        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;

        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    }

    /**
     * Set transition css property for drag
     * translate3d is for better rendering performance
     * see: https://www.html5rocks.com/en/tutorials/speed/layers/
     */
    moveElementTo(el, x, y) {
        let transform = 'translate3d(' + x + 'px,' + y + 'px, 0px)';
        el.style.webkitTransform = transform;
        el.style.mozTransform = transform;
        el.style.msTransform = transform;
        el.style.oTransform = transform;
        el.style.transform = transform;
    }

    gettingContentForReadMode(location) {
        this.prepareReadmodBlock();

        chromeRuntimeSend({
            from: 'content',
            subject: 'readmode',
            location: location
        });
    }

    prepareReadmodBlock() {
        let allredyDef = qs('.recovery-readmode');

        if (allredyDef) {
            return allredyDef;
        }

        let readmodBlock = document.createElement('div');
        readmodBlock.setAttribute('class', 'recovery-readmode');

        let closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'recovery-readmode-close');

        readmodBlock.appendChild(closeBtn);
        $on(closeBtn, 'click', this.closeReadMod);

        document.body.appendChild(readmodBlock);

        return readmodBlock;
    }

    /*
     * Inserting readmode modal
     */
    openInReadmod(responseText) {
        const _this = this;
        let allredyDef = qs('.recovery-readmode > iframe');

        let content = new DOMParser().parseFromString(responseText, 'text/html');

        // remove scripts, styles, images
        let elements = qsa('script, link, noscript, style, img, form, input, button, textarea', content);

        for (let index = elements.length - 1; index >= 0; index--) {
            elements[index].parentNode.removeChild(elements[index]);
        }

        // remove inline styles
        let inlineStyles = qsa('[style]', content);

        for (let index = inlineStyles.length - 1; index >= 0; index--) {
            inlineStyles[index].removeAttribute('style');
        }

        let readmodBlock;
        let iframe;

        if (!allredyDef) {
            readmodBlock = this.prepareReadmodBlock();
            iframe = document.createElement('iframe');
            readmodBlock.appendChild(iframe);

            // TODO: take out attributes
            iframe.setAttribute('frameBorder', 0);
            iframe.setAttribute('allowTransparency', 'false');
        } else {
            iframe = allredyDef;
            iframe.contentDocument.body.scrollTop = 0;
        }

        try {
            const doc = iframe.contentDocument;
            // TODO: styles
            const style = '<style type="text/css">body {position: relative;font: 16px/1.625 "Open Sans",Arial,sans-serif;color: #262626;}a{color:#68BC71;text-decoration: underline;outline: 0;}</style>';
            doc.open();
            doc.write(
                `<html><head> ${style} </head><body><div class="options"><div class="container"> ${content.body.outerHTML} </div></div></body></html>`
            );
            doc.close();
            iframe.style.setProperty('display', 'block', 'important');

            $delegate(doc, 'a', 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let location = {
                    href: e.target.href || e.path.find(el => el.href).href
                };
                iframe.style.setProperty('display', 'none', 'important');
                _this.gettingContentForReadMode(location);
            });
        } catch (ex) {
            logs.error(ex);
        }

        if (!qs('#recovery-styles')) {
            appendCSS(RECOVERYGLOBALCSS, null, 'recovery-styles');
        }
    }

    closeReadMod() {
        let readmodBlock = qs('.recovery-readmode');

        if (readmodBlock) {
            readmodBlock.remove();
            readmodBlock = null;
        }
    }
}
