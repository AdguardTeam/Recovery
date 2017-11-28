/* global chrome */

import {categoriesID} from './data/categories';

chrome.runtime.onMessage.addListener((msg, sender) => {
      if (msg.data) {
          msg.data.categories.forEach((id) => {
              if (id === categoriesID.adblockWall || id === categoriesID.paywall || id === categoriesID.adReinjection) {
                  chrome.browserAction.setIcon({tabId: sender.tab.id, path: 'options/img/not-ok.png'}, () => {
                      if (chrome.runtime.lastError) {
                          return false;
                      }
                  });
              } else {
                  chrome.browserAction.setIcon({tabId: sender.tab.id, path: 'options/img/logo.png'}, () => {
                      if (chrome.runtime.lastError) {
                          return false;
                      }
                  });
              }

              chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '' + msg.data.categories.length});
          });
      } else {
          chrome.browserAction.setIcon({tabId: sender.tab.id, path: 'options/img/unknown.png'}, () => {
              if (chrome.runtime.lastError) {
                  return false;
              }
          });
          chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: ''});
      }
});
