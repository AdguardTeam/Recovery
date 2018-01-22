const languages = {
    en: require('../../_locales/en.json'),
    // ru: require('../../_locales/ru.json')
};

let currentLocale, locale;

if (navigator.languages) {
    locale = navigator.languages[0];
} else if (navigator.language) {
    locale = navigator.language.split('-')[0];
}

if (languages[locale]) {
    currentLocale = locale;
} else {
    currentLocale = 'en';
}

export const i18n = key => {
    if (languages[currentLocale][key] && languages[currentLocale][key].message) {
        return languages[currentLocale][key].message;
    } else {
        return key;
    }
};
