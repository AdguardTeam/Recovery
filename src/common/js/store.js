/* global chrome */
import {commonOptions,storeName} from './options';

export default class Store {
    constructor() {
        const localStorage = window.localStorage;

        this.chrome = typeof(chrome) === 'undefined' ? null : chrome;
        this.defaultoptions = commonOptions;

        // jshint ignore: start
        this.getData = async() => {
            const options = await this.getFromStorageAsync();

            if (options && Object.keys(options).length !== 0) {
                return options;
            } else {
                return this.defaultoptions;
            }
        }
        this.updateData = async(id, value) => {
            let options = await this.getFromStorageAsync();

            if (options && Object.keys(options).length === 0) {
                options = this.defaultoptions;
            }

            options[id].show = !!value;

            this.setLocalStorage(options);
        }
        // jshint ignore: end

        this.setLocalStorage = (data) => {
            let obj = {};
            obj[storeName] = JSON.stringify(data);

            if (this.chrome) {
                this.chrome.storage.sync.set(obj);
            } else {
                localStorage.setItem(storeName, obj[storeName]);
            }
        };
    }

    getFromStorageAsync() {
        const _this = this;
        return new Promise(resolve => {
            if (!_this.chrome) {
                let data = localStorage.getItem(storeName);

                if (data) {
                    resolve(JSON.parse(data));
                } else {
                    resolve(null);
                }
            }

            _this.chrome.storage.sync.get(storeName, (storageData) => {
                if (storageData && storageData[storeName]) {
                    storageData = JSON.parse(storageData[storeName]);
                }

                resolve(storageData);
            });
        });
    }
}
