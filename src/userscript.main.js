import Template from './common/template';
import Controller from './common/controller';
import View from './common/view';

const template = new Template();
const view = new View(template);

new Controller(view);
