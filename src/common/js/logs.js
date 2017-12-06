import {settings} from './settings';

export default class Logs {
    constructor() {}

    error(text) {
        if (!settings.DEBUG) {
            return false;
        }

        if (text) {
            console.error(text);
        } else {
            console.error('unknown error');
        }
    }

    info(text) {
        if (!settings.DEBUG) {
            return false;
        }

        if (text) {
            console.info(text);
        } else {
            console.error('unknown info');
        }
    }
}
