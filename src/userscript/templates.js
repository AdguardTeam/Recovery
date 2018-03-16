import {escapeForHTML} from '../common/js/helpers';
import {i18n} from '../common/js/localization';

import categories from '../_data/categories.json';

/**
 * Html templates for userscript.
 * @constructor
 * @param {object} data - data to display.
 */
export default class Template {
    linkStatus(data) {
        let text = {};
        text.threats = [];
        text.status = 'Donate';
        text.statusClass = 'allow';

        data.categories.forEach((id) => {
            if (categories[id].warning) {
                text.status = 'Warning';
                text.statusClass = 'warning';
            }

            text.threats.push(categories[id]);
        });

        let threats = text.threats.reduce((text, threat) => {
            let icon = threat.warning ? 'warning' : 'passed';

            return `${text}<li class="status-icon-${icon}">
                <p>
                    <b class="recovery-threat-name">${i18n(escapeForHTML(threat.name))}</b>
                    <span class="recovery-status-tooltip">
                        <span class="recovery-status-tooltip-text">${i18n(escapeForHTML(threat.description))}</span>
                    </span>
                </p>
            </li>`;
        }, '');

        return `<div class="recovery-status-content">
            <button class="recovery-status-close">×</button>
            <p class="status status-${escapeForHTML(text.statusClass)}">
                ${i18n('status')}: ${escapeForHTML(text.status)}
            </p>
            <p>${i18n('mechanisms').replace('%domain%', data.domain)}:</p>
            <ul class="status-list">${threats}</ul>
            <button class="recovery-btn recovery-status-readmode">${i18n('open_read_view')}</button>
        </div>`;
    }
}
