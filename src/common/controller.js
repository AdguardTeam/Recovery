import {Throttle} from 'lodash-decorators/throttle'; // jshint ignore:line
import {qsa, gm} from './helpers';
import {options} from '../options/js/options';
import {optionsUrl} from '../options/js/options';

export default class Controller {
    constructor(view) {
        this.view = view;
        this.options = this.getOptions();
        this.observer = null;
        this.observerConfig = {
            childList: true,
            subtree: true
        };

        const isOptionsPage = document.location.href.indexOf('/AntiAdblock/options/') >= 0;

        if (isOptionsPage) {
            this.setOptions();
            view.pageOptionsChangeListener(this.setOptions.bind(this));
        } else {
            this.pageRequirements(this.options);
            view.prepareReadView();
        }

        gm.registerMenu('AntiAdblock settings page', this.registerMenu);
    }

    pageRequirements(options) {
        if (this.pageCheckRequirements(options)) {
            this.view.checkLinks(options, this.openInReadmod.bind(this));
            this.view.bindOpenItemCancel();
            this.mutationObserver();
        }
    }

    pageCheckRequirements(opt) {
        if (!opt.warningIconsNearLinks) {
            return false;
        }else if (opt.google && document.location.host.indexOf('www.google.') === 0) {
            return true;
        } else if (opt.bing && document.location.host.indexOf('www.bing.com') === 0) {
            return true;
        } else if (opt.yahoo && document.location.host.indexOf('search.yahoo.com') === 0) {
            return true;
        } else if (opt.duckduckgo && document.location.host.indexOf('duckduckgo.com') === 0) {
            return true;
        } else if (opt.facebook && document.location.host.indexOf('www.facebook.com') === 0) {
            return true;
        } else if (opt.twitter && document.location.host.indexOf('twitter.com') === 0) {
            return true;
        } else if (opt.googlenews && document.location.host.indexOf('news.google.') === 0) {
            return true;
        } else if (opt.yahooNews && document.location.href.indexOf('https://www.yahoo.com/news/') === 0) {
            return true;
        } else if (opt.reddit && document.location.host.indexOf('www.reddit.com') === 0) {
            return true;
        } else {
            return false;
        }
    }

    mutationObserver() {
        const _this = this;

        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        try {
            _this.observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        _this.rebuild(mutation.target.classList, mutation.addedNodes[0]);
                    }
                });
            });

            _this.observer.observe(document, _this.observerConfig);
        } catch (e) {
            console.log('MutationObserver is not available on this browser');
        }
    }

    /* jshint ignore:start */
    @Throttle(500)
    /* jshint ignore:end */
    rebuild(elClasses, nodes) {
        if (nodes && nodes.className !== 'adblock-recovery-content' && !elClasses.contains('adguard-icon') && !elClasses.contains('adguard-icon-status')) {
            this.view.checkLinks(this.options, this.openInReadmod.bind(this));
        }
    }

    setOptions() {
        let data = localStorage.getItem('anti-adblock-store');

        if (!data) {
            data = {};
            const elements = qsa('label.option');
            elements.forEach(el => {
                data[el.id] = el.children[el.id].checked;
            });
        } else {
            data = JSON.parse(data);
        }

        gm.set('anti-adblock-store', data);
    }

    getOptions() {
        return gm.get('anti-adblock-store', options);
    }

    registerMenu() {
        document.location.href = optionsUrl;
    }

    openInReadmod(el) {
        const _this = this;
        let url = decodeURIComponent(el.href);

        gm.req({
            method: 'GET',
            url: url,
            onload: function(response) {
                let content = new DOMParser().parseFromString(response.responseText, 'text/html');
                if(_this.observer) {
                    _this.observer.disconnect();
                }
                _this.view.appendReadViewContent(content, _this.openInReadmod.bind(_this));
            }
        });
    }
}
