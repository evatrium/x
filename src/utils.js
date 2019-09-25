//


/*------------------ TYPE CHECKING -------------------------- */


export const isArray = Array.isArray;
export const isObj = (thing) => Object.prototype.toString.call(thing) === '[object Object]';
export const isFunc = (thing) => typeof thing === 'function';
export const isString = (thing) => typeof thing === 'string';
export const isNum = (thing) => !isNaN(parseFloat(thing)) && !isNaN(thing - 0);


/*------------------ DOM -------------------------- */
const w = window;
export const d = document;
export const createElement = (elem) => d.createElement(elem);
export const appendChild = (node, child) => node.appendChild(child);
export const createTextNode = (text) => d.createTextNode(text);
export const toLowerCase = (toLower) => toLower.toLowerCase();
export const toUpperCase = (toUpper) => toUpper.toUpperCase();
export const addListener = (to, ev, cb) => to.addEventListener(ev, cb);
export const removeListener = (from, ev, cb) => from.removeEventListener(ev, cb);
export const eventListener = (to, ev, cb) => {
    if (!isArray(to)) return addListener(to, ev, cb), () => removeListener(to, ev, cb);
    let unListenAll = [];
    to.forEach(l => {
        addListener(l[0], l[1], l[2]);
        unListenAll.push(() => removeListener(l[0], l[1], l[2]));
    });
    return () => unListenAll.forEach(f => f());
};

export const is_ie_or_old_edge = () => navigator.userAgent.indexOf("MSIE") !== -1 || !!w.StyleMedia || !!d.documentMode === true;

export const ScrollStopper = (_stopScroll, _xscroll, _yscroll, _w) => {
    _w = _w || w;
    addListener(_w, 'scroll', () => _stopScroll && _w.scrollTo(_xscroll, _yscroll));
    return {
        stop: () => {
            _stopScroll = true;
            _xscroll = _w.pageXOffset;// || window.document.documentElement.scrollLeft
            _yscroll = _w.pageYOffset;// || window.document.documentElement.scrollTop;
        },
        go: () => (_stopScroll = false)
    }
};

/*------------------ STYLES -------------------------- */

export const CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE = "adoptedStyleSheets" in document;

/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
export const headStyleTag = (mount) => {
    let style = createElement('style');
    appendChild(style, createTextNode(""));
    appendChild(mount || d.head, style);
    return (css) => (appendChild(style, createTextNode(css)), style);
};
export const globalStyles = headStyleTag();
export const webComponentVisibilityStyleSheet = headStyleTag();

export const webComponentVisibility = (tag) => webComponentVisibilityStyleSheet(`${tag} {visibility:hidden}`);

export const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

export const pixelfyValue = (key, value) => typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value;

export const toCssVarsFromJsThemeObj = (themeObj) =>
    Object.keys(themeObj).reduce((acc, curr) => ((acc[curr] = `var(--${curr},${themeObj[curr]})`), acc), {});

export const convertThemeToCssVars = (vars, selector) =>
    `${selector || ':root'}{${Object.keys(vars).map((key) => `--${key}:${vars[key]};`).join('')}}`;

export const raf = (fn) => requestAnimationFrame(fn);


export const CSSTextToObj = cssText => {
    var style = {},
        cssToJs = s => s.startsWith('-') ? s : s.replace(/\W+\w/g, match => toUpperCase(match.slice(-1))),
        properties = cssText.split(";").map(o => o.split(":").map(x => x && x.trim()));
    for (var [property, value] of properties) {
        let prop = cssToJs(property);
        if (prop) style[prop] = value;
    }
    return style
};

export const tagStyleCache = {}; // cache the instance css to the tagName

export const createStyleSheet = (cssText, async) => {
    let sheet = false;
    if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) {
        sheet = new CSSStyleSheet();
        sheet[async ? 'replace' : 'replaceSync'](cssText);
    }
    return [sheet, cssText];
};


/*------------------ WEB COMPONENT -------------------------- */
export const COMPONENT_MOUNTED_ATTRIBUTE = 'x-mounted';
/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
export const formatType = (value, type) => {
    type = type || String;
    try {
        if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);
        else if (typeof value == "string") {
            value = type == Number ? Number(value)
                : type == Object || type == Array ? JSON.parse(value) : value;
        }
        if ({}.toString.call(value) == `[object ${type.name}]`)
            return {value, error: type == Number && Number.isNaN(value)};
    } catch (e) {
    }
    return {value, error: true};
};

export const isCustomElement = (el, isAttr) => {
    if (!el.getAttribute || !el.localName) return false;
    isAttr = el.getAttribute('is');
    return el.localName.includes('-') || isAttr && isAttr.includes('-');
};
/**
 * will set or remove the attribute based on the truthyness of the value.
 * if the type of value is object or array and the node is a custom element, it will json stringify the value
 * @param node
 * @param attr
 * @param value
 */
export const updateAttribute = (node, attr, value) => {
    (value === null || value === false)
        ? node.removeAttribute(attr)
        : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
};


export const propToAttr = (prop) => toLowerCase(prop.replace(/([A-Z])/g, "-$1"));
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => toUpperCase(letter));


/*------------------ MISC -------------------------- */


export const extend = (obj, props) => {
    for (let i in props) obj[i] = props[i];
    return obj
};

export const propsChanged = (a, b) => {
    a = a || {};
    b = b || {};
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false
};

export const objectIsEmpty = obj => Object.keys(obj || {}).length === 0;

export const arrayIncludesItemFromArray = (arr1, arr2) => {
    let len1 = arr1.length, len2 = arr2.length;
    if (!len1 && !len2 || len1 && !len2 || !len1 && len2) return false;
    for (let i = len1; i--;) if (arr2.includes(arr1[i])) return true;
    return false;
};


// const handler = {
//     set(target, key, value) {
//         console.log(`Setting value ${key} as ${value}`)
//         target[key] = value;
//     },
// };

// const proxyObj = new Proxy({hello: '123'}, handler);

export const Subie = () => {
    let subs = [],
        unsub = (sub, i) => {
            let out = [];
            for (i = subs.length; i--;) subs[i] === sub ? (sub = null) : (out.push(subs[i]));
            subs = out;
        };
    return {
        unsub,
        sub: sub => (subs.push(sub), () => unsub(sub)),
        notify: data => subs.forEach(s => s && s(data))
    }
};


export const def = (obj, prop, handlers) => Object.defineProperty(obj, prop, handlers);


/*------------------ CONSTANTS -------------------------- */

export const TEST_ENV = process.env.NODE_ENV === 'test';



/*


    CSSTextToObj = cssText => {
        var style = {},
            cssToJs = s => s.startsWith('-') ? s : s.replace(/\W+\w/g, match => toUpperCase(match.slice(-1))),
            properties = cssText.split(";").map(o => o.split(":").map(x => x && x.trim()));
        for (var [property, value] of properties){
            let prop = cssToJs(property);
            if(prop)style[prop] = value;
        }
        return style
    },


function CSSTextToObj(cssText) {
    var cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
    var style = {},
        [,ruleName,rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/)||[,,cssTxt];

    var cssToJs = s => s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase());

    var properties = rule.split(";").map(o => o.split(":").map(x => x && x.trim()));

    for (var [property, value] of properties) style[cssToJs(property)] = value;
    return {cssText, ruleName, style};
}



    addDash = attr => {
        while (attr.indexOf('-') > 0) { // - is in the attribute name, but is not the first character either
            var afterDash = attr.substring(attr.indexOf('-') + 1)
            afterDash = afterDash.substring(0, 1).toUpperCase() + afterDash.substring(1)
            attr = attr.substring(0, attr.indexOf('-')) + afterDash
        }
        return attr
    },
    cssStringToObj = (str) => {
        let _out = {};
        str = str || '';
        str.split(';').forEach(string => {
            if (string !== '') {
                var attr = string.split(':');
                let attrName;
                if (attr.length > 2) {
                    attrName = attr.shift();
                    attrName = addDash(attrName);
                    _out[attrName] = attr.join(':')
                } else {
                    attrName = addDash(attr[0]);
                    _out[attrName] = attr[1]
                }
            }
        });
        return _out;
    };

 */