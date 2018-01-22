/**
 * Extension popup page
 */

/* global chrome */

import {qs,qsa} from '../common/js/helpers';
import {i18n} from '../common/js/localization';
import logs from '../common/js/logs';

import categories from '../_data/categories.json';

const log = new logs();
const sitename = qs('.adblock-recovery-popup__sitename');
const techniquesList = qs('.adblock-recovery-popup__techniques-list');
const optionsBtn = qs('.adblock-recovery-popup__options');
const readModeBtn = qs('.adblock-recovery-popup__openinreadmode');
const popup = qs('.adblock-recovery-popup');

let currentPageLocation = null;

/**
 * Getting website url and antiadblock techniques from userscript
 */
const getSiteData = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {getData: true}, function(response) {
            const lastError = chrome.runtime.lastError;

            if (lastError) {
                log.error(lastError);
                noData(tabs[0].url);
                currentPageLocation = null;
                return;
            }

            if (response && response.done) {
                currentPageLocation = response.location;
                sitename.innerText = response.location.host;
            }

            if (response.data) {
                appendData(response);
            } else {
                noData();
            }
        });
    });
};

const localization = () => {
    const elements = qsa('[i18n]');

    elements.forEach(el => el.innerText = i18n(el.getAttribute('i18n')));
};

/**
 * Display information about website and antiadblock techniques
 *
 * @param  {Object} website   website data
 */
const appendData = (website) => {
    popup.classList.remove('no-data');

    if (!website.data) {
        return false;
    }

    let text = {};
    text.threats = [];

    website.data.categories.forEach((id) => {
        text.threats.push(categories[id]);
    });

    let threats = text.threats.reduce((text, threat) => {
        let icon = threat.warning ? 'status-icon-warning' : 'status-icon-passed';

        return text +
            `<li class="adblock-recovery-popup__status-icon ${icon}"><p>
            <span class="adblock-recovery-status-name">${i18n(threat.name)}</span>
            <span class="adblock-recovery-status-tooltip">
                <span class="adblock-recovery-status-tooltip-text">${i18n(threat.description)}</span>
            </span>
            </p></li>`;
    }, '');

    techniquesList.innerHTML =
        `<ul>${threats}</ul>`;
};

const noData = (url) => {
    popup.classList.add('no-data');

    if (url) {
        sitename.innerText = url;
    }
};

const openInReadmod = () => {
    if (!currentPageLocation) {
        return false;
    }

    chrome.runtime.sendMessage({
        from: 'content',
        subject: 'readmode',
        location: currentPageLocation
    });
};

window.addEventListener('DOMContentLoaded', function() {
    optionsBtn.addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
            // Chrome 42+ method to open options pages
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    readModeBtn.addEventListener('click', function() {
        openInReadmod();
    });

    getSiteData();
    localization();
});
