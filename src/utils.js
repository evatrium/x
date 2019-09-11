let d = document,
    createElement = (elem) => d.createElement(elem),
    appendChild = (node, child) => node.appendChild(child),
    createTextNode = (text) => d.createTextNode(text),
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
     * if the type of value === object (accounts for array) and the node is a custom element, it will json stringify the value
     * @param node
     * @param attr
     * @param value
     */
    updateAttribute = (node, attr, value) => {
        (value === null || value === false)
            ? node.removeAttribute(attr)
            : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
    },


    propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
    attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase()),

    TEST_ENV = process.env.NODE_ENV === 'test',


    isArray = Array.isArray,
    isObj = (thing) => !isArray(thing) && typeof thing === 'object',
    isFunc = (thing) => typeof thing === 'function',
    isString = (thing) => typeof thing === 'string',
    addListener = (to, ev, cb) => to.addEventListener(ev, cb),
    removeListener = (from, ev, cb) => from.removeEventListener(ev, cb),
    def = (obj, prop, handlers) => Object.defineProperty(obj, prop, handlers),
    extend = (obj, props) => {
        for (let i in props) obj[i] = props[i];
        return obj
    },
    asdf = '!@#$!@#$!@#$!@#$!@#$',
    test = (derp) => derp[asdf];

    console.log(asdf);

webComponentVisibilityStyleSheet(` .___ {visibility: inherit;}`, true);

export {
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
    test
};
