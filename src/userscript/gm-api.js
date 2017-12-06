export const gm = {
    get: typeof(GM_getValue) === 'undefined' ? function() {return false;} : GM_getValue, // jshint ignore:line
    set: typeof(GM_setValue) === 'undefined' ? function() {return false;} : GM_setValue, // jshint ignore:line
    registerMenu: typeof(GM_registerMenuCommand) === 'undefined' ? function() {return false;} : GM_registerMenuCommand, // jshint ignore:line
    openTab: typeof(GM_openInTab) === 'undefined' ? function() {return false;} : GM_openInTab, // jshint ignore:line
    req: typeof(GM_xmlhttpRequest) === 'undefined' ? function() {return false;} : GM_xmlhttpRequest, // jshint ignore:line
    css: typeof(GM_addStyle) === 'undefined' ? function() {return false;} : GM_addStyle, // jshint ignore:line
};
