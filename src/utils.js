let d = document,
    createElement = (elem) => d.createElement(elem),
    appendChild = (node, child) => node.appendChild(child),
    createTextNode = (text) => d.createTextNode(text),
    toLowerCase = (toLower) => toLower.toLowerCase(),
    toUpperCase = (toUpper) => toUpper.toUpperCase(),
    /**
     * creates a single style sheet. returns a function to update the same sheet
     * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
     * @returns {function} for adding styles to the same stylesheet
     */
    styleSheet = (mount) => {
        let style = createElement('style');
        appendChild(style, createTextNode(""));
        appendChild(mount || d.head, style);
        return (css) => (appendChild(style, createTextNode(css)), style);
    },
    globalStyles = styleSheet(),
    webComponentVisibilityStyleSheet = styleSheet(),
    webComponentVisibility = (tag) => webComponentVisibilityStyleSheet(`${tag} {visibility:hidden}`),


    /**
     * for parsing the incoming attributes into consumable props
     * @param value
     * @param type
     * @returns {{error: boolean, value: *}}
     */
    formatType = (value, type) => {
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
    },

    isCustomElement = (el, isAttr) => {
        if (!el.getAttribute || !el.localName) return false;
        isAttr = el.getAttribute('is');
        return el.localName.includes('-') || isAttr && isAttr.includes('-');
    },
    /**
     * will set or remove the attribute based on the truthyness of the value.
     * if the type of value is object or array and the node is a custom element, it will json stringify the value
     * @param node
     * @param attr
     * @param value
     */
    updateAttribute = (node, attr, value) => {
        (value === null || value === false)
            ? node.removeAttribute(attr)
            : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
    },


    propToAttr = (prop) => toLowerCase(prop.replace(/([A-Z])/g, "-$1")),
    attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => toUpperCase(letter)),




    isArray = Array.isArray,
    isObj = (thing) => Object.prototype.toString.call(thing) === '[object Object]',
    isFunc = (thing) => typeof thing === 'function',
    isString = (thing) => typeof thing === 'string',
    addListener = (to, ev, cb) => to.addEventListener(ev, cb),
    removeListener = (from, ev, cb) => from.removeEventListener(ev, cb),
    def = (obj, prop, handlers) => Object.defineProperty(obj, prop, handlers),
    extend = (obj, props) => {
        for (let i in props) obj[i] = props[i];
        return obj
    },
    propsChanged = (a, b) => {
        a = a || {};
        b = b || {};
        for (let i in a) if (!(i in b)) return true
        for (let i in b) if (a[i] !== b[i]) return true
        return false
    },
    objectIsEmpty = obj => Object.keys(obj || {}).length === 0,
    // CSSTextToObj = cssText => {
    //     var style = {},
    //         cssToJs = s => s.startsWith('-') ? s : s.replace(/\W+\w/g, match => toUpperCase(match.slice(-1))),
    //         properties = cssText.split(";").map(o => o.split(":").map(x => x && x.trim()));
    //     for (var [property, value] of properties){
    //         let prop = cssToJs(property);
    //         if(prop)style[prop] = value;
    //     }
    //     return style
    // },
    TEST_ENV = process.env.NODE_ENV === 'test',
    COMPONENT_VISIBLE_CLASSNAME = '___';


webComponentVisibilityStyleSheet(` .${COMPONENT_VISIBLE_CLASSNAME} {visibility: inherit;}`, true);

export {
    toLowerCase,
    createElement,
    createTextNode,
    appendChild,
    styleSheet,
    globalStyles,
    webComponentVisibility,
    formatType,
    updateAttribute,
    propToAttr,
    attrToProp,
    d,
    TEST_ENV,
    isArray,
    isObj,
    isFunc,
    isString,
    addListener,
    removeListener,
    def,
    extend,
    propsChanged,
    objectIsEmpty,
    // CSSTextToObj,
    COMPONENT_VISIBLE_CLASSNAME
};


/*
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