export const commonOptions = {
    warningIconsNearLinks: {show: true},
    preventAccess: {show: true},
    tryToCircumvent: {show: true},
    google: {show: true, host: 'www.google.'},
    bing: {show: true, host: 'www.bing.com'},
    yahoo: {show: true, host: 'search.yahoo.com'},
    duckduckgo: {show: true, host: 'duckduckgo.com'},
    facebook: {show: true, host: 'www.facebook.com'},
    twitter: {show: true, host: 'twitter.com'},
    googlenews: {show: true, host: 'news.google.'},
    yahooNews: {show: true, host: 'https://www.yahoo.com/news/'},
    reddit: {show: true, host: 'www.reddit.com'}
};

export const storeName = 'adblockRecoveryStoreCommon';

// list of elements classes in which not to highlighting links
export const excludedClasses = [
    // duckduckgo.com
    'module__content',

    // google.com
    'knowledge-panel',

    // yahoo.com
    'searchRightTop'
];

// TODO: remove this after release
export const googleSpreadSheetPrefix = 'gsx$';
