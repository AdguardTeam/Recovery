import {qs, qsa, $delegate} from '../../common/helpers';
import {i18n} from '../../common/localization';
import {commonOptions, urlsOptions} from './options';

export default class View {
    constructor() {
        this.options = {};

        for (let option in commonOptions) {
            if (commonOptions.hasOwnProperty(option)) {
                this.options[option] = qs('#' + option);
            }
        }

        for (let option in urlsOptions) {
            if (urlsOptions.hasOwnProperty(option)) {
                this.options[option] = qs('#' + option);
            }
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

    }

    setOptions(data) {
        if(!this.optionsBlock) {
            return false;
        }

        for (let option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                let input = this.options[option] && this.options[option].querySelector('input');
                if (input) {
                    input.checked = data[option].show;
                }
            }
        }
    }

    getOptions() {
        let data = {};
        for (let option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                data[option].show = this.options[option].checked;
            }
        }
        return data;
    }
}
