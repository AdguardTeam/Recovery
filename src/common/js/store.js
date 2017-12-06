/* global chrome */
import {commonOptions} from './options';

export default class Store {
    constructor() {
        const localStorage = window.localStorage;

        this.chrome = typeof(chrome) === 'undefined' ? null : chrome;

        // jshint ignore: start
        this.getData = async() => {
            const options = await this.getFromStorageAsync();

            if (options && Object.keys(options).length !== 0) {
                return options;
            } else {
                return commonOptions;
            }
        }
        this.updateData = async(id, value) => {
            let options = await this.getFromStorageAsync();

            if (options && Object.keys(options).length === 0) {
                options = commonOptions;
            }

            options[id].show = !value;

            this.setLocalStorage(options);
        }
        // jshint ignore: end

        this.setLocalStorage = (data) => {
            if (this.chrome) {
                this.chrome.storage.sync.set({'data': JSON.stringify(data)});
            } else {
                localStorage.setItem('data', JSON.stringify(data));
            }
        };
    }

    getFromStorageAsync() {
        const _this = this;
        return new Promise(resolve => {
            if (!_this.chrome) {
                let data = localStorage.getItem('data');

                if (data) {
                    resolve(JSON.parse(data));
                } else {
                    resolve(null);
                }
            }

            _this.chrome.storage.sync.get('data', (storageData) => {
                if (storageData && storageData.data) {
                    storageData = JSON.parse(storageData.data);
                }

                resolve(storageData);
            });
        });
    }


}
