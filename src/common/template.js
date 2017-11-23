import {escapeForHTML} from './helpers';
import categories from '../data/categories.json';
import {i18n} from './localization';

export default class Template {
    linkStatus(data) {
        let text = {};
        text.threats = [];
        text.status = 'Donate';
        text.statusClass = 'allow';

        data.categories.forEach((id) => {
            if (id === 1 || id === 2 || id === 4) {
                text.status = 'Warning';
                text.statusClass = 'warning';
            }

            text.threats.push(categories[id]);
        });

        let threats = text.threats.reduce((text, threat) => {
            return text +
                '<li><p>' +
                    i18n(escapeForHTML(threat.name)) +
                    '<span class="adblock-recovery-status-tooltip">' +
                        '<span class="adblock-recovery-status-tooltip-text">' +
                            i18n(escapeForHTML(threat.description)) +
                        '</span>' +
                    '</span>' +
                '</p></li>';
        }, '');

        return `<div class="adblock-recovery-status-content">
            <button class="adblock-recovery-status-close">×</button>
            <h1 class="adguard-status-recovery">
                ${i18n('adblock_recovery')}
            </h1>
            <p class="status status-${escapeForHTML(text.statusClass)}">
                ${i18n('status')}: ${escapeForHTML(text.status)}
            </p>
            <p>${escapeForHTML(data.domain)} ${i18n('mechanisms')}:</p>
            <ul class="status-icon status-icon-${escapeForHTML(text.statusClass)}">${threats}</ul>
        </div>`;
    }
}
