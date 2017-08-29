import {$on, $delegate, qsa} from './helpers';
import Utils from './utils';
import Urls from '../common.urls.json';

const ESCAPE_KEY = 27;

const utils = new Utils();

export default class View {
    constructor(template) {
        this.template = template;

        this.linkElements = document.querySelectorAll('a');

        $on(document, 'click', this.closeLinksStatus);
        $delegate(document, '.adguard-icon-status', 'click', ({target}) => {
            this.closeLinksStatus();
            this.openLinkStatus(target);
        }, true);
        $delegate(document, '.adguard-icon-status-close', 'click', () => {
            this.closeLinksStatus();
        }, true);
    }

    checkLinks(preventAccess) {
        this.linkElements = document.querySelectorAll('a');

        if(!this.linkElements.length) {
            return false;
        }

        this.linkElements.forEach(el => {
            this.addIconToLinkElement(el, {preventAccess: preventAccess});
        });
    }

    addIconToLinkElement(el, options) {
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
}
