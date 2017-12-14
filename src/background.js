/**
 * Extension background page
 */

/* global chrome */
import {settings} from './common/js/settings';
import categories from './_data/categories.json';

/**
 * Setting badge icon, text and background color based on current website ranking
 * @param {String} tabId
 * @param {String} icon
 * @param {String} badgeText
 * @param {String} badgeColor
 */
const setBadge = (tabId, icon, badgeText, badgeColor) => {
    chrome.browserAction.setIcon({tabId: tabId, path: icon}, () => {
        if (chrome.runtime.lastError) {
            return false;
        }
    });

    chrome.browserAction.setBadgeText({tabId: tabId, text: '' + badgeText});
    chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
};

/**
 * Getting content of the page for readmode
 * @param {Object} msg page data from userscript
 */
const requestForReadMode = (msg) => {
    if (!msg.href) {
        return false;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', msg.href, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {showReadMode: true, content: xhr.responseText}, () => {
                    if (chrome.runtime.lastError) {
                        return false;
                    }
                });
            });
        }
    };
    xhr.send();
};

/**
 * Setting badge text and icon based on site ranking
 * @param {Object} msg page data from userscript
 * @param {Object} sender current browser tab data
 */
const badgeTextPopupIcon = (msg, sender) => {
    let icon = settings.unknownIcon;
    let badgeText = '';
    let badgeColor = settings.badgeBackgroundColor;

    if (msg.data) {
        badgeText = '' + msg.data.categories.length;
        icon = settings.okIcon;

        msg.data.categories.forEach((id) => {
            if (categories[id].warning) {
                icon = settings.notOkIcon;
            }
        });
    }

    setBadge(sender.tab.id, icon, badgeText, badgeColor);
};

// Event listener
chrome.runtime.onMessage.addListener((msg, sender) => {
    switch (msg.subject) {
        case 'readmode':
            requestForReadMode(msg);
            break;
        case 'showPageAction':
            badgeTextPopupIcon(msg, sender);
            break;
    }
});
