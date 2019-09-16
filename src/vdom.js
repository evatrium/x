import {
    d,
    updateAttribute,
    appendChild,
    createElement,
    createTextNode,
    isFunc,
    isObj,
    isString,
    isArray,
    removeListener,
    addListener,
    objectIsEmpty,
    toLowerCase,
    COMPONENT_VISIBLE_CLASSNAME
} from "./utils";

// modified version of https://github.com/jorgebucaran/superfine

var removeChild = (parent, child) => parent.removeChild(child),
    insertBefore = (parent, node, targetNode) => parent.insertBefore(node, targetNode),
    RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map,
    NULL = null,

    //fragment type for host node
    HOST_TYPE = '#document-fragment',

    Fragment = (props, children) => children,

    merge = (a, b, out) => {
        out = {};
        for (var k in a) out[k] = a[k];
        for (var k in b) out[k] = b[k];
        return out
    },

    listener = function (event) {
        this.handlers[event.type](event)
    },

    remHandle = node => {
        if (!objectIsEmpty(node.handlers)) {
            for (let k in node.handlers) {
                removeListener(node, k, listener);
                delete node.handlers[k]
            }
        }
    },
    /* used inside web component disconnect callback*/
    removeHandlers = dom => {
        remHandle(dom);
        [].concat(...dom.childNodes).forEach(child => {
            remHandle(child)
            removeHandlers(child);
        });
    },

    /* ------------ preact's style property */

    IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,

    setStyle = (style, key, value) => {
        key[0] === '-' ? style.setProperty(key, value) :
            style[key] = typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value;
    },
    styleNode = (dom, value, oldValue, _s) => {
        _s = dom.style;
        if (isString(value)) return _s.cssText = value;
        if (isString(oldValue)) (_s.cssText = '', oldValue = NULL);
        if (oldValue) for (let i in oldValue) if (!(value && i in value)) setStyle(_s, i, '');
        if (value) for (let i in value) if (!oldValue || value[i] !== oldValue[i]) setStyle(_s, i, value[i]);
    },

    /* ------------ */

    // i like how stencil has this built in so i figured id try to include it here
    // optionally pass objects to className for easy conditional classes ex: className={{activeClassName: someBooleanVariable}}
    cnObj = (obj, out) => {
        out = "";
        for (let k in obj) if (obj[k]) out += (out && " ") + k;
        return out;
    },

    // split the classNames up into an array and filter them
    parseClassList = (value) => (!value) ? [] : value.split(/\s+/).filter(c => c),

    updateClassList = (node, value, action) =>
        parseClassList(isObj(value) ? cnObj(value) : value).forEach(cls => {
            COMPONENT_VISIBLE_CLASSNAME !== cls && node.classList[action](cls)
        }),


    patchProperty = (node, key, oldValue, newValue, isSvg) => {
        if (key === "key") {
        } else if (key.startsWith('on') && !(key in node)) {
            /*
                referencing stencil's set accessor functionality for many kinds of 'on'-event names
                cuz "custom" event names defined by the user within web components may also start with 'on' like onMyCustomEvent
                https://github.com/ionic-team/stencil/blob/master/src/runtime/vdom/set-accessor.ts
             */
            let eventType = (toLowerCase(key) in node)
                ? toLowerCase(key.slice(2))
                : toLowerCase(key[2]) + key.substring(3);
            if (newValue) {
                if (!oldValue) addListener(node, eventType, listener);
                (node.handlers || (node.handlers = {}))[eventType] = newValue
            } else removeListener(node, eventType, listener)

        } else if (key === 'ref') isFunc(newValue) ? newValue(node) : newValue = node;
        else if (key === 'style') styleNode(node, newValue, oldValue);
        else if (key === 'className' || key === 'class') {
            updateClassList(node, oldValue, 'remove');
            updateClassList(node, newValue, 'add');
            /*
               In order to prevent initial style flashing/reflow of undefined web components
               a style tag that is embedded in the html contains a class for all the custom element tags
               which sets them to visibility hidden initially. Once the web component has rendered
               it adds a class to its own classList to make it visibility inherit.
               The following actually works great for avoiding the already defined class names that exist
               on the component or defined by other means / internally or by some other component.
            */
        } else if (!isSvg && key !== "list" && (key in node)) node[key] = newValue == NULL ? "" : newValue;
        else updateAttribute(node, key, newValue)
    },

    createNode = (vnode, isSvg) => {
        var node = vnode.type === TEXT_NODE
            ? createTextNode(vnode.name)
            : (isSvg = isSvg || vnode.name === "svg")
                ? d.createElementNS("http://www.w3.org/2000/svg", vnode.name)

                /*
                    implements the use of a document fragment as a pseudo host element
                    * works with the root element in a web component
                    return(
                        <Host> // uses #document-fragment as the h.name
                            <my-element/>
                            <my-box/>
                        </Host>
                     )
                */
                : (vnode.name === HOST_TYPE)
                    ? d.createDocumentFragment()
                    : createElement(vnode.name),

            props = vnode.props;

        for (var k in props) patchProperty(node, k, NULL, props[k], isSvg);
        for (var i = 0, len = vnode.children.length; i < len; i++) appendChild(node, createNode(vnode.children[i], isSvg));
        return (vnode.node = node)
    },

    getKey = (vnode) => vnode == NULL ? NULL : vnode.key,
    /*
       Looked at Atomico's code (which uses vdom in web components) and noticed the destroy method
       on the web component base component. Since its the shadow dom, it may be possible that the child
       nodes aren't being looked over???? checked the handlers and they were'nt being removed so i added
       this to clean things up.
     */
    destroy = (dom) => {
        removeHandlers(dom);
        dom.destroy && dom.destroy(dom);
        return dom;
    },

    patchNode = (parent, node, oldVNode, newVNode, isSvg) => {


        if (oldVNode === newVNode) {
        } else if (
            oldVNode != NULL &&
            oldVNode.type === TEXT_NODE &&
            newVNode.type === TEXT_NODE
        ) {
            if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
        } else if (oldVNode == NULL || oldVNode.name !== newVNode.name) {
            node = insertBefore(parent, createNode(newVNode, isSvg), node)
            if (oldVNode != NULL) removeChild(parent, destroy(oldVNode.node))
        } else {
            var tmpVKid,
                oldVKid,
                oldKey,
                newKey,
                oldVProps = oldVNode.props,
                newVProps = newVNode.props,
                oldVKids = oldVNode.children,
                newVKids = newVNode.children,
                oldHead = 0,
                newHead = 0,
                oldTail = oldVKids.length - 1,
                newTail = newVKids.length - 1;
            isSvg = isSvg || newVNode.name === "svg";

            for (var key in merge(oldVProps, newVProps)) {
                var _old = oldVProps[key], _new = newVProps[key];

                if ((['value', 'selected', 'checked'].includes(key) ? node[key] : _old) !== _new) {
                    patchProperty(node, key, _old, _new, isSvg)
                }
            }

            while (newHead <= newTail && oldHead <= oldTail) {
                if (
                    (oldKey = getKey(oldVKids[oldHead])) == NULL ||
                    oldKey !== getKey(newVKids[newHead])
                ) {
                    break
                }

                patchNode(
                    node,
                    oldVKids[oldHead].node,
                    oldVKids[oldHead++],
                    newVKids[newHead++],
                    isSvg
                )
            }

            while (newHead <= newTail && oldHead <= oldTail) {
                if (
                    (oldKey = getKey(oldVKids[oldTail])) == NULL ||
                    oldKey !== getKey(newVKids[newTail])
                ) {
                    break
                }

                patchNode(
                    node,
                    oldVKids[oldTail].node,
                    oldVKids[oldTail--],
                    newVKids[newTail--],
                    isSvg
                )
            }

            if (oldHead > oldTail) {
                while (newHead <= newTail) {
                    insertBefore(node,
                        createNode(newVKids[newHead++], isSvg),
                        (oldVKid = oldVKids[oldHead]) && oldVKid.node
                    )
                }
            } else if (newHead > newTail) {
                while (oldHead <= oldTail) {
                    removeChild(node, destroy(oldVKids[oldHead++].node))
                }
            } else {
                for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
                    if ((oldKey = oldVKids[i].key) != NULL) {
                        keyed[oldKey] = oldVKids[i]
                    }
                }

                while (newHead <= newTail) {
                    oldKey = getKey((oldVKid = oldVKids[oldHead]))
                    newKey = getKey(newVKids[newHead])

                    if (
                        newKeyed[oldKey] ||
                        (newKey != NULL && newKey === getKey(oldVKids[oldHead + 1]))
                    ) {
                        if (oldKey == NULL) removeChild(node, destroy(oldVKid.node))
                        oldHead++
                        continue
                    }

                    if (newKey == NULL || oldVNode.type === RECYCLED_NODE) {
                        if (oldKey == NULL) {
                            patchNode(
                                node,
                                oldVKid && oldVKid.node,
                                oldVKid,
                                newVKids[newHead],
                                isSvg
                            )
                            newHead++
                        }
                        oldHead++
                    } else {
                        if (oldKey === newKey) {
                            patchNode(node, oldVKid.node, oldVKid, newVKids[newHead], isSvg)
                            newKeyed[newKey] = true
                            oldHead++
                        } else {
                            if ((tmpVKid = keyed[newKey]) != NULL) {
                                patchNode(
                                    node,
                                    insertBefore(node, tmpVKid.node, oldVKid && oldVKid.node),
                                    tmpVKid,
                                    newVKids[newHead],
                                    isSvg
                                )
                                newKeyed[newKey] = true
                            } else {
                                patchNode(
                                    node,
                                    oldVKid && oldVKid.node,
                                    NULL,
                                    newVKids[newHead],
                                    isSvg
                                )
                            }
                        }
                        newHead++
                    }
                }

                while (oldHead <= oldTail)
                    if (getKey((oldVKid = oldVKids[oldHead++])) == NULL) removeChild(node, destroy(oldVKid.node));

                for (var i in keyed) if (newKeyed[i] == NULL) removeChild(node, destroy(keyed[i].node))
            }
        }
        return (newVNode.node = node)
    },
    createVNode = (name, props, children, node, key, type) => ({name, props, children, node, type, key}),
    createTextVNode = (value, node) => createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, NULL, TEXT_NODE),
    recycleNode = (node) =>
        node.nodeType === TEXT_NODE
            ? createTextVNode(node.nodeValue, node)
            : createVNode(
            toLowerCase(node.nodeName),
            EMPTY_OBJ,
            map.call(node.childNodes, recycleNode),
            node,
            NULL,
            RECYCLED_NODE
            ),

    patch = (node, vdom) => (
        ((node = patchNode(
            node.parentNode,
            node,
            node.vdom || recycleNode(node),
            vdom
        )).vdom = vdom),
            node
    ),
    h = function (name, props) {
        for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) rest.push(arguments[i]);
        while (rest.length > 0) {
            if (isArray((vnode = rest.pop()))) {
                for (var i = vnode.length; i-- > 0;) rest.push(vnode[i])
            } else if (vnode === false || vnode === true || vnode == NULL) {
            } else children.push(isObj(vnode) ? vnode : createTextVNode(vnode));
        }
        props = props || EMPTY_OBJ
        return isFunc(name)
            ? name(props, children)
            : createVNode(name, props, children, NULL, props.key)
    };

export {patch, h, Fragment, removeHandlers, HOST_TYPE, patchProperty, merge}

