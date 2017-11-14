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

export function appendCSS(styles, el) {
    if (!el) {
        el = document.head || document.getElementsByTagName('head')[0];
    }

    const style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = styles;
    } else {
        style.appendChild(document.createTextNode(styles));
    }

    el.appendChild(style);
}
