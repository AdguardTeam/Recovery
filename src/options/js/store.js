import {defaultOptions} from './options';

export default class Store {
    constructor(name, callback) {
        const localStorage = window.localStorage;

        this.getLocalStorage = () => {
            const data = localStorage.getItem(name);

            if (data) {
                return JSON.parse(data);
            } else {
                return defaultOptions;
            }
        };

        this.setLocalStorage = (data) => {
            localStorage.setItem(name, JSON.stringify(data));
        };

        if (callback) {
            callback();
        }
    }

    getOptions(callback) {
        callback(this.getLocalStorage());
    }

    update(options, callback) {
        this.setLocalStorage(options);

        if (callback) {
            callback();
        }
    }

    updateOption(option, value, callback) {
        const options = this.getLocalStorage();

        options[option] = !value;

        this.setLocalStorage(options);

        if (callback) {
            callback(options);
        }
    }
}
