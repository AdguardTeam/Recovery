import Store from '../../common/js/store';

import Controller from './controller';
import View from './view';
const store = new Store();
const view = new View();

new Controller(store, view);
