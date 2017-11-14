/* global ADBLOCKRECOVERYSTYLE */
import {$on, $delegate, qsa} from './helpers';
import Urls from '../data/urls.json';
import logs from './logs';

export default class View {
    constructor(template) {
        this.template = template;

        $on(document, 'click', this.closeLinksStatus);
        $delegate(document, '.adblock-recovery-status', 'click', ({target}) => {
            this.closeLinksStatus();
            this.showLinkStatus(target);
        }, true);
        $delegate(document, '.adblock-recovery-status-close', 'click', () => {
            this.closeLinksStatus();
        }, true);
    }

    /**
     * opening popup with information about the link. `z-index:0` style is necessary for the icons to be always under the popup
     *
     * @param {Object} target   current link element
     */
    showLinkStatus(target) {
        const _this = this;
        target.classList.add('adblock-recovery-status-show');
        qsa('.adblock-recovery').forEach((el) => el.style = 'z-index:0!important;');
        target.parentNode.style = '';

        const iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'adblock-recovery-status-iframe');
        iframe.setAttribute('frameBorder', 0);
        iframe.setAttribute('width', 400);
        iframe.setAttribute('height', 300);
        iframe.setAttribute('allowTransparency', 'true');

        let iframeAlreadyLoaded = false;

        iframe.onload = function() {
            if (iframeAlreadyLoaded) {
                //IE calls load each time when we use document.close
                return;
            }
            iframeAlreadyLoaded = true;
            let status = Urls.data.find((link) => {
                return target.parentNode.getAttribute('data-href').indexOf(link.domain) >= 0;
            });
            const content = _this.template.linkStatus(status);
            _this.appendContentToIframe(iframe, content);

            $delegate(document, '.adblock-recovery-status-close', 'click', () => {
                _this.closeLinksStatus();
            }, true);
        };

        target.appendChild(iframe);
    }

    /**
     * write the content in the iframe
     *
     * @param {Object} iframe   current iframe
     * @param {String} content   content
     */
    appendContentToIframe(iframe, content) {
        const _this = this;
        try {
            const doc = iframe.contentDocument;

            // ADBLOCKRECOVERYSTYLE - global styles string which created by the gulp
            const style = '<style type="text/css">' + ADBLOCKRECOVERYSTYLE + '</style>';
            doc.open();
            doc.write('<html><head>' + style + '</head><body class="adblock-recovery-status-body">' + content + '</body></html>');
            doc.close();
            iframe.style.setProperty('display', 'block', 'important');

            $delegate(doc, '.adblock-recovery-status-close', 'click', () => {
                _this.closeLinksStatus();
            }, true);

            $delegate(doc, '.adblock-recovery-status-settings', 'click', () => {
                return;
            }, true);
        } catch (ex) {
            logs.error(ex);
        }
    }

    /**
     * closing popup with information about the link and resetting inline `z-index:0` style
     */
    closeLinksStatus() {
        qsa('.adblock-recovery').forEach((el) => el.style = '');
        qsa('.adblock-recovery-status-show').forEach((e) => {
            e.classList.remove('adblock-recovery-status-show');
            e.innerHTML = '';
        });
    }
}
