import {$on, $delegate, qsa, qs} from './helpers';
import Utils from './utils';
import Urls from '../common.urls.json';
import Readability from 'readability';

const ESCAPE_KEY = 27;

const utils = new Utils();

export default class View {
    constructor(template) {
        this.template = template;
        this.readmode = null;
        this.readmodeContent = null;

        $on(document, 'click', this.closeLinksStatus);
        $delegate(document, '.adguard-icon-status', 'click', ({target}) => {
            this.closeLinksStatus();
            this.openLinkStatus(target);
        }, true);
        $delegate(document, '.adguard-icon-status-close', 'click', () => {
            this.closeLinksStatus();
        }, true);
    }

    checkLinks(options, openInReadmod) {
        this.linkElements = qsa('a');

        if(!this.linkElements.length) {
            return false;
        }

        this.linkElements.forEach(el => {
            this.addIconToLinkElement(el, {preventAccess: options.preventAccess}, openInReadmod);
        });
    }

    addIconToLinkElement(el, options, openInReadmod) {
        if (this.linkCheckRequirements(el)) {
            let adguard = document.createElement('div');
            let adguradIcon = document.createElement('div');
            adguard.className = 'adguard-icon';
            adguard.setAttribute('data-href', el.hostname);
            adguradIcon.className = 'adguard-icon-status';

            adguard.appendChild(adguradIcon);

            let status = Urls.data.find(this.compare.bind(this, el.hostname, adguradIcon));

            if (status) {
                el.parentNode.insertBefore(adguard, el.nextSibling);
                this.showLinkStatus(adguradIcon, status);

                if(options.preventAccess) {
                    $on(el, 'click', this.preventDefault);
                }

                const openInReadmodBtn = qs('.status-icon-readmod', adguard);

                $on(openInReadmodBtn, 'click', () => {
                    openInReadmod(el);
                });
            }
        }
    }

    linkCheckRequirements(el) {
        let url = decodeURIComponent(el.hostname);

        switch (false) {
            case utils.validateUrlString(url):
                return false;

            case utils.validateUrlIsExternal(url):
                return false;

            case utils.validateLinkIsNotEmpty(el):
                return false;

            case utils.validateLinkIsNotBgImage(el):
                return false;

            case utils.validateLinkIsNotTagImage(el):
                return false;

            case !utils.validateLinkAlreadyChecked(el):
                return false;
            default:
                return true;
        }
    }

    compare(href, adguradIcon, link) {
        if (href.indexOf(link.domain) > -1 && link.categories.length) {
            link.categories.forEach((lvl) => {
                adguradIcon.classList.add('adguard-status-' + lvl);
            });

            return link;
        } else {
            adguradIcon.classList.add('adguard-icon-status-ok');
        }
    }

    openLinkStatus(target) {
        target.classList.add('adguard-icon-status-show');
        qsa('.adguard-icon').forEach((el) => el.style = 'z-index:0;');
        target.parentNode.style = '';
    }

    showLinkStatus(target, data) {
        $on(target, 'click', this.stopPropagation);
        target.innerHTML = this.template.linkStatus(data);
    }

    closeLinksStatus() {
        qsa('.adguard-icon').forEach((el) => el.style = '');
        qsa('.adguard-icon-status-show').forEach((e) => e.classList.remove('adguard-icon-status-show'));
    }

    bindOpenItemCancel() {
        $on(document, 'keydown', ({keyCode}) => {
            if (keyCode === ESCAPE_KEY) {
                this.closeLinksStatus();
            }
        });
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    preventDefault(e) {
        e.preventDefault();
    }

    pageOptionsChangeListener(handler) {
        $delegate(document, '.option', 'click', () => {
            handler();
        });
    }

    setReadMode(url) {
        const loc = url;
        const uri = {
          spec: loc.href,
          host: loc.host,
          prePath: loc.protocol + '//' + loc.host,
          scheme: loc.protocol.substr(0, loc.protocol.indexOf(':')),
          pathBase: loc.protocol + '//' + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf('/') + 1)
        };
        const article = new Readability(uri, document.cloneNode(true)).parse();

        if(article && article.content) {
            const adblock = document.createElement('div');
            adblock.className = 'adblock-recovery-content';
            adblock.innerHTML = article.content;
            document.body.appendChild(adblock);
        }
    }

    prepareReadView() {
        this.readmode = document.createElement('div');
        this.readmode.innerHTML = this.template.readmodeContent();
        this.readmodeContent = qs('.adblock-recovery-readmode-content', this.readmode);
        document.body.appendChild(this.readmode);

        $delegate(this.readmode, '.adblock-recovery-readmode-close', 'click', () => {
            this.readmode.classList.remove('adblock-recovery-readmode-active');
        });
    }

    appendReadViewContent(content, handler) {
        let elements = qsa('script, link, noscript, style, img', content);

        for (let index = elements.length - 1; index >= 0; index--) {
            elements[index].parentNode.removeChild(elements[index]);
        }

        let inlineStyles = qsa('[style]', content);

        for (let index = inlineStyles.length - 1; index >= 0; index--) {
            inlineStyles[index].removeAttribute('style');
        }

        this.readmodeContent.innerHTML = content.body.innerHTML;

        $delegate(this.readmodeContent, 'a', 'click', (e) => {
            e.preventDefault();
            handler(e.target);
        }, true);

        this.readmode.classList.add('adblock-recovery-readmode-active');
    }
}
