/* global RECOVERYGLOBALCSS */
import {$on, $delegate, qsa, qs} from '../common/js/helpers';

import Urls from '../_data/urls.json';

export default class View {
    constructor(template, utils) {
        this.template = template;
        this.utils = utils;
        this.popoverElement = null;
    }

    init(readmodeHandler) {
        $on(document, 'click', this.closeLinksStatus.bind(this));

        $delegate(document, '.recovery-status', 'click', ({target}) => {
            this.closeLinksStatus();
            this.showLinkStatus(target, readmodeHandler);
        }, true);
    }

    /**
     * opening popup with information about the link
     *
     * @param {Object} target   current link element
     */
    showLinkStatus(target, readmodeHandler) {
        const _this = this;

        target.classList.add('recovery-status-show');
        const status = Urls.data.find((link) => {
            return target.parentNode.getAttribute('data-href').indexOf(link.domain) >= 0 || target.parentNode.getAttribute('data-href-alt').indexOf(link.domain) >= 0;
        });
        const rect = this.getOffsetRect(target);
        const content = this.template.linkStatus(status);
        const urlForReadMode = target.parentNode.getAttribute('data-href');
        let el = null;

        if (this.utils.checkShadowDomSupport()) {
            el = this.createShadowRootElement(content, rect);
        } else {
            el = this.createIframeElement(content, rect);
        }

        this.addDefaultEvents(el, readmodeHandler, urlForReadMode);
        this.popoverElement = el;

        document.documentElement.appendChild(el);

        // fade in
        setTimeout(() => qs('.recovery-status-content', _this.popoverParentElement).style.opacity = 1);
    }

    addDefaultEvents(el, readmodeHandler, urlForReadMode) {
        // prevent close popover by clicking to himself
        $on(el, 'click', (e) => {
            e.stopPropagation();
        });

        $delegate(this.popoverParentElement, '.recovery-status-close', 'click', () => {
            this.closeLinksStatus();
        }, true);

        $delegate(this.popoverParentElement, '.recovery-status-readmode', 'click', () => {
            // `location` variable is like document.location
            let location = {
                href: urlForReadMode
            };
            readmodeHandler.gettingContentForReadMode(location, this.closeLinksStatus.bind(this));
        }, true);
    }

    createIframeElement(content, rect) {
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
        };

        this.popoverParentElement = iframe.contentWindow.document.body;

        return iframe;
    }

    createShadowRootElement(content, rect) {
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

        // storing shadowdom closed root element to add event listeners
        this.popoverParentElement = shadowRootElement;

        return el;
    }

    /**
     * closing popup with information about the link
     */
    closeLinksStatus() {
        if (this.popoverElement) {
            this.popoverElement.remove();
            this.popoverElement = null;

            qsa('.recovery-status-show').forEach((e) => {
                e.classList.remove('recovery-status-show');
            });
        }

        return;
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
}
