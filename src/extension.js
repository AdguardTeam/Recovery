import Template from './common/template';
import Controller from './common/controller';
import View from './common/view';
import Highlightlinks from './common/highlightlinks';
import ChromeRuntime from './common/chrome.runtime';
import Utils from './common/utils';
import Logs from './common/logs';

const template = new Template();
const view = new View(template);
const logs = new Logs();
const utils = new Utils(logs);
const highlightlinks = new Highlightlinks(utils, logs);
const controller = new Controller(logs, view, highlightlinks);

new ChromeRuntime(controller);

window.controller = controller;
