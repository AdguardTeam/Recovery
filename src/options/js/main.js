import Controller from './controller';
import Store from './store';
import View from './view';
const store = new Store();
const view = new View();

new Controller(store, view);
