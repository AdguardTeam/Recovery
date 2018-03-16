/* global RECOVERYGLOBALCSS */
import {$on, $delegate, qs, qsa, appendCSS} from '../common/js/helpers';

import {chromeRuntimeSend} from './chrome.runtime';

import Readability from 'readability';

export default class View {
    constructor(logs) {
        this.logs = logs;
    }

    addDefaultEvents(el, url) {
        const _this = this;

        $delegate(el, '.recovery-status-readmode', 'click', () => {
            // `location` variable is like document.location
            let location = {
                href: url
            };
            _this.gettingContentForReadMode(location);
        }, true);
    }


    gettingContentForReadMode(location, handler) {
        this.prepareReadModeBlock();
        handler.call();

        chromeRuntimeSend({
            from: 'content',
            subject: 'readmode',
            location: location
        });
    }

    prepareReadModeBlock() {
        let alreadyDef = qs('.recovery-readmode');

        if (alreadyDef) {
            return alreadyDef;
        }

        let readModeBlock = document.createElement('div');
        readModeBlock.setAttribute('class', 'recovery-readmode');

        let closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'recovery-readmode-close');

        readModeBlock.appendChild(closeBtn);
        $on(closeBtn, 'click', this.closeReadMode);

        document.body.appendChild(readModeBlock);

        return readModeBlock;
    }

    /*
     * Inserting readmode modal
     */
    openInReadMode(responseText) {
        let alreadyDef = qs('.recovery-readmode > iframe');

        let content = new DOMParser().parseFromString(responseText, 'text/html');

        if (!content) {
            this.logs.error('Failed to parse page content');
            return false;
        }

        content = this.clearImages(content);

        let article = new Readability({}, content).parse();

        if (!article) {
            article = {
                title: '',
                content: this.clearContent(content).body.outerHTML
            };
        }

        let readModeBlock;
        let iframe;

        if (!alreadyDef) {
            readModeBlock = this.prepareReadModeBlock();
            iframe = document.createElement('iframe');
            readModeBlock.appendChild(iframe);

            // TODO: take out attributes
            iframe.setAttribute('frameBorder', 0);
            iframe.setAttribute('allowTransparency', 'false');
        } else {
            iframe = alreadyDef;
            iframe.contentDocument.body.scrollTop = 0;
        }

        try {
            const doc = iframe.contentDocument;
            doc.open();
            doc.write(
                `<html><head><style type="text/css"> ${RECOVERYGLOBALCSS} </style></head><body><div class="readmode-container"><h1> ${article.title} </h1> ${article.content} </div></body></html>`
            );
            doc.close();
            iframe.style.setProperty('display', 'block', 'important');

            $delegate(doc, 'a', 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let link = e.target && e.target.href || e.path.find(el => el.href).href;
                if (link) {
                    window.open(link);
                }
            });
        } catch (ex) {
            this.logs.error(ex);
        }

        if (!qs('#recovery-styles')) {
            appendCSS(RECOVERYGLOBALCSS, null, 'recovery-styles');
        }
    }

    clearImages(content) {
        // remove image width-height attributes to avoid stretching the popup
        let images = content.querySelectorAll('img');
        images.forEach((img) => {
            img.removeAttribute('width');
            img.removeAttribute('height');
        });

        return content;
    }

    clearContent(content) {
        // remove scripts, styles, images
        let removingTags = 'script, link, noscript, style, img, form, input, button, textarea, select, footer';
        let elements = qsa(removingTags, content);

        for (let index = elements.length - 1; index >= 0; index--) {
            elements[index].parentNode.removeChild(elements[index]);
        }

        // remove inline styles
        let inlineStyles = qsa('[style]', content);

        for (let index = inlineStyles.length - 1; index >= 0; index--) {
            inlineStyles[index].removeAttribute('style');
        }

        return content;
    }

    closeReadMode() {
        let readModeBlock = qs('.recovery-readmode');

        if (readModeBlock) {
            readModeBlock.remove();
            readModeBlock = null;
        }
    }
}
