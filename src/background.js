/* global chrome */
import {settings} from './common/js/settings';
import categories from './_data/categories.json';

chrome.runtime.onMessage.addListener((msg, sender) => {
      if (msg.data) {
          msg.data.categories.forEach((id) => {
              if (categories[id].warning) {
                  chrome.browserAction.setIcon({tabId: sender.tab.id, path: settings.notOkIcon}, () => {
                      if (chrome.runtime.lastError) {
                          return false;
                      }
                  });
              } else {
                  chrome.browserAction.setIcon({tabId: sender.tab.id, path: settings.okIcon}, () => {
                      if (chrome.runtime.lastError) {
                          return false;
                      }
                  });
              }

              chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '' + msg.data.categories.length});
              chrome.browserAction.setBadgeBackgroundColor({color: settings.badgeBackgroundColor});
          });
      } else {
          chrome.browserAction.setIcon({tabId: sender.tab.id, path: settings.unknownIcon}, () => {
              if (chrome.runtime.lastError) {
                  return false;
              }
          });
          chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: ''});
      }
});
