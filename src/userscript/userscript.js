/**
 * Userscript
 */

import Logs from '../common/js/logs';
import Store from '../common/js/store';

import Template from './template';
import Controller from './controller';
import View from './view';
import Highlightlinks from './highlightlinks';
import Utils from './utils';

const template = new Template();
const view = new View(template);
const logs = new Logs();
const store = new Store();
const utils = new Utils(logs);
const highlightlinks = new Highlightlinks(utils, logs);
const controller = new Controller(logs, view, highlightlinks, store, utils);

window.controller = controller;
