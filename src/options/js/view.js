import {qs, qsa, $delegate} from '../../common/helpers';
import {i18n} from './localization';
import {options} from './options';

export default class View {
    constructor() {
        this.options = {};

        for (let option in options) {
            this.options[option] = qs('#' + option);
        }

        this.optionsBlock = qs('.options');
    }

    localization() {
        // too slow select
        const elements = qsa('*[i18n]');
        elements.forEach(el => {
            el.innerText = i18n(el.getAttribute('i18n'));
        });
    }

    updateOption(handler) {
        $delegate(this.optionsBlock, '.option', 'click', ({target}) => {
            let id = target.id;
            let value = target.children[id].checked;
            handler(id, value);
        });
    }

    showSaveStatus() {
        this.statusText.classList.add('active');
        setTimeout(() => {
            this.statusText.classList.remove('active');
        }, 750);
    }

    setOptions(data) {
        if(!this.optionsBlock) {
            return false;
        }

        for (let option in this.options) {
            this.options[option].querySelector('input').checked = data[option];
        }
    }

    getOptions() {
        let data = {};
        for (let option in this.options) {
            data[option] = this.options[option].checked;
        }
        return data;
    }
}
