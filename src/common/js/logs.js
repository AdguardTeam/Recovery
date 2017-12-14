import {settings} from './settings';

export default class Logs {
    constructor() {}

    error(text, data) {
        if (!settings.DEBUG) {
            return false;
        }

        if (text) {
            console.error(text, data);
        } else {
            console.error('unknown error');
        }
    }

    info(text, data) {
        if (!settings.DEBUG) {
            return false;
        }

        if (text) {
            console.info(text, data);
        } else {
            console.error('unknown info');
        }
    }
}
