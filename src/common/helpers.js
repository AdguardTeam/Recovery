export function qs(selector, scope) {
    return (scope || document).querySelector(selector);
}

export function $on(target, type, callback, capture) {
    target.addEventListener(type, callback, !!capture);
}

export function $off(target, type, callback, capture) {
    target.removeEventListener(type, callback, !!capture);
}

export function qsa(selector, scope) {
    return (scope || document).querySelectorAll(selector);
}

export function $delegate(target, selector, type, handler, capture) {
    if(!target) {
        return false;
    }
    const dispatchEvent = event => {
        const targetElement = event.target;
        const potentialElements = target.querySelectorAll(selector);
        let i = potentialElements.length;

        while (i--) {
            if (potentialElements[i] === targetElement) {
                handler.call(targetElement, event);
                break;
            }
        }
    };

    $on(target, type, dispatchEvent, !!capture);
}

export const escapeForHTML = s => s.replace(/[&<]/g, c => c === '&' ? '&amp;' : '&lt;');

export const gm = {
    get: typeof(GM_getValue) === 'undefined' ? function() {return false;} : GM_getValue, // jshint ignore:line
    set: typeof(GM_setValue) === 'undefined' ? function() {return false;} : GM_setValue, // jshint ignore:line
    registerMenu: typeof(GM_registerMenuCommand) === 'undefined' ? function() {return false;} : GM_registerMenuCommand, // jshint ignore:line
    openTab: typeof(GM_openInTab) === 'undefined' ? function() {return false;} : GM_openInTab, // jshint ignore:line
    req: typeof(GM_xmlhttpRequest) === 'undefined' ? function() {return false;} : GM_xmlhttpRequest, // jshint ignore:line
};
