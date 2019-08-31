let d = document,
    styleSheet = (mount) => {
        let style = d.createElement('style');
        style.appendChild(d.createTextNode(""));
        (mount || d.head).appendChild(style);
        return (css, insertRule) => {
            // insertRule ? style.sheet.insertRule(css, style.sheet.cssRules.length) :
            style.appendChild(d.createTextNode(css));
            return style;
        }
    },
    globalStyles = styleSheet(),
    webComponentVisibilityStyleSheet = styleSheet(),
    webComponentVisibility = (tag) => {
        webComponentVisibilityStyleSheet(`${tag} {visibility:hidden}`, true)
    }, formatType = (value, type) => {
        type = type || String;
        try {
            if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);
            else if (typeof value == "string") {
                value = type == Number ? Number(value)
                    : type == Object || type == Array ? JSON.parse(value)
                        : type == Function ? window[value]
                            : type == Date ? new Date(value) : value;
            }
            if ({}.toString.call(value) == `[object ${type.name}]`)
                return {value, error: type == Number && Number.isNaN(value)};
        } catch (e) {
        }
        return {value, error: true};
    }, setAttr = (node, attr, value) => {
        value == null ? node.removeAttribute(attr)
            : node.setAttribute(attr, typeof value == "object" ? JSON.stringify(value) : value);
    },
    propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
    attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

webComponentVisibilityStyleSheet(` .___ {visibility: inherit;}`, true);

export {
    styleSheet,
    globalStyles,
    webComponentVisibility,
    formatType,
    setAttr,
    propToAttr,
    attrToProp,
    d
};