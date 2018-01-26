/**
 * Extension background page
 */

/* global chrome */
import {settings} from './common/js/settings';
import categories from './_data/categories.json';

/**
 * Setting badge icon and background color based on current website ranking
 * @param {String} tabId
 * @param {String} icon
 * @param {String} badgeColor
 */
const setBadge = (tabId, icon, badgeColor) => {
    chrome.browserAction.setIcon({tabId: tabId, path: icon}, () => {
        if (chrome.runtime.lastError) {
            return false;
        }
    });

    chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
};

/**
 * Setting badge text and icon based on site ranking
 * @param {Object} msg page data from userscript
 * @param {Object} sender current browser tab data
 */
const badgeTextPopupIcon = (msg, sender) => {
    let icon = settings.unknownIcon;
    let badgeColor = settings.badgeBackgroundColor;

    if (msg.data) {
        icon = settings.okIcon;

        msg.data.categories.forEach((id) => {
            if (categories[id].warning) {
                icon = settings.notOkIcon;
            }
        });
    }

    setBadge(sender.tab.id, icon, badgeColor);
};

const sendMessageToCurrentTab = (requestType, data) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {requestType: requestType, data: data}, () => {
            if (chrome.runtime.lastError) {
                return false;
            }
        });
    });
};

/**
 * Getting content of the page for readmode
 * @param {Object} msg page data from userscript
 */
const requestForReadMode = (msg) => {
    if (!msg.location) {
        return false;
    }

    let url = msg.location.origin || msg.location.href;

    if (!url) {
        return false;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            sendMessageToCurrentTab('showReadMode', xhr.responseText);
        }
    };
    xhr.send();
};

// TODO: remove this after release
const getDataFromSpreadSheet = () => {
    const googleSpreadSheet = 'https://spreadsheets.google.com/feeds/list/1e2qnCK1PzmQiAaH1UjqYjetxV6cwAeoYxKohGOJkNtc/od6/public/values?alt=json';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', googleSpreadSheet, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            sendMessageToCurrentTab('dataFromSpredSheet', xhr.responseText);
        }
    };
    xhr.send();
};

// Event listener
chrome.runtime.onMessage.addListener((msg, sender) => {
    switch (msg.subject) {
        case 'readmode':
            if (msg.from === 'popup') {
                sendMessageToCurrentTab('prepareReadmod');
            }

            requestForReadMode(msg);
            break;
        case 'showPageAction':
            badgeTextPopupIcon(msg, sender);
            break;
        case 'getDataFromSpreadSheet':
            getDataFromSpreadSheet(msg);
            break;
    }
});
