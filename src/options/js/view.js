import {qs, qsa, $delegate} from '../../common/js/helpers';
import {i18n} from '../../common/js/localization';
import {commonOptions, urlsOptions} from '../../common/js/options';

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
        $delegate(this.optionsBlock, 'label.option', 'click', ({target}) => {
            if (!target.parentNode.id) {
                return false;
            }

            let id = target.parentNode.id;
            let value = target.parentNode.children[0].checked;
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
