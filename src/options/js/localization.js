const languages = {
    en: require('../_locales/en/messages.json')
};

const current = 'en';

export const i18n = s => languages[current][s] && languages[current][s].message ? languages[current][s].message : s;
