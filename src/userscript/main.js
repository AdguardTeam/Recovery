/**
 * Userscript initial
 */

import Logs from '../common/js/logs';
import Store from '../common/js/store';

import Template from './templates';
import Controller from './controller';
import ViewPopover from './view-popover';
import ViewHighlightlinks from './view-highlightlinks';
import ViewReadmode from './view-readmode';
import Utils from './utils';

const templates = new Template();
const logs = new Logs();
const store = new Store();
const utils = new Utils(logs);
const viewPopover = new ViewPopover(templates, utils);
const viewHighlightlinks = new ViewHighlightlinks(utils, logs);
const viewReadmode = new ViewReadmode(logs);
const controller = new Controller(logs, viewPopover, viewHighlightlinks, viewReadmode, store, utils);

// global scope for testing
window.controller = controller;
