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
    IS_NON_DIMENSIONAL
} from "./utils";

// modified version of https://github.com/jorgebucaran/superfine

var removeChild = (parent, child) => parent.removeChild(child),
    insertBefore = (parent, node, targetNode) => parent.insertBefore(node, targetNode),
    RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map,

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
    checkForPx = (key, value) => typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value,
    setStyle = (style, key, value, noCheckNeeded) => {
        key[0] === '-' ? style.setProperty(key, value) :
            style[key] = !noCheckNeeded ? checkForPx(key, value) : value;
    },
    styleNode = (dom, newValue, oldValue) => {
        let _s = dom.style;
        if (isString(newValue)) return _s.cssText = newValue;
        if (isString(oldValue)) (_s.cssText = '', oldValue = null);
        if (oldValue) for (let i in oldValue) if (!(newValue && i in newValue)) setStyle(_s, i, '');
        if (newValue) for (let i in newValue) if (!oldValue || newValue[i] !== oldValue[i]) setStyle(_s, i, newValue[i]);
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
    parseClassList = value => (!value) ? [] : value.split(/\s+/).filter(c => c),
    getClassList = value => parseClassList(isObj(value) ? cnObj(value) : value),
    updateClassList = (node, value, action) =>
        getClassList(value).forEach(cls => node.classList[action](cls)),


    patchProperty = (node, key, oldValue, newValue, isSvg) => {
        if (key === "key" || key === 'children') {
        } else if (key.startsWith('on') && !(key in node)) {
            /*
                referencing stencil's set accessor functionality for many kinds of 'on'-event names
                cuz "custom" event names defined by the user within web components may also start with 'on' like onMyCustomEvent
                https://github.com/ionic-team/stencil/blob/master/src/runtime/vdom/set-accessor.ts
             */
            let eventType = (toLowerCase(key) in node)
                ? toLowerCase(key.slice(2))
                : toLowerCase(key[2]) + key.substring(3);
            // console.log(key, eventType)
            if (newValue) {
                if (!oldValue) addListener(node, eventType, listener);
                (node.handlers || (node.handlers = {}))[eventType] = newValue
            } else removeListener(node, eventType, listener)

        } else if (key === 'ref' && isFunc(newValue)) newValue(node);

        else if (key === 'style') styleNode(node, newValue, oldValue);

        else if (key === 'className' || key === 'class') {

            updateClassList(node, oldValue, 'remove');
            updateClassList(node, newValue, 'add');

        } else if (!isSvg && key !== "list" && (key in node)) node[key] = newValue == null ? "" : newValue;
        else {

            updateAttribute(node, key, newValue)
        }
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

        for (var k in props) node.nodeName !== HOST_TYPE && patchProperty(node, k, null, props[k], isSvg);
        for (var i = 0, len = vnode.children.length; i < len; i++) appendChild(node, createNode(vnode.children[i], isSvg));
        return (vnode.node = node)
    },

    getKey = (vnode) => vnode == null ? null : vnode.key,
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
            oldVNode != null &&
            oldVNode.type === TEXT_NODE &&
            newVNode.type === TEXT_NODE
        ) {
            if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
        } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
            node = insertBefore(parent, createNode(newVNode, isSvg), node)
            if (oldVNode != null) removeChild(parent, destroy(oldVNode.node))
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
                    newVNode.name !== HOST_TYPE && patchProperty(node, key, _old, _new, isSvg)
                }
            }

            while (newHead <= newTail && oldHead <= oldTail) {
                if (
                    (oldKey = getKey(oldVKids[oldHead])) == null ||
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
                    (oldKey = getKey(oldVKids[oldTail])) == null ||
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
                    if ((oldKey = oldVKids[i].key) != null) {
                        keyed[oldKey] = oldVKids[i]
                    }
                }

                while (newHead <= newTail) {
                    oldKey = getKey((oldVKid = oldVKids[oldHead]))
                    newKey = getKey(newVKids[newHead])

                    if (
                        newKeyed[oldKey] ||
                        (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
                    ) {
                        if (oldKey == null) removeChild(node, destroy(oldVKid.node))
                        oldHead++
                        continue
                    }

                    if (newKey == null || oldVNode.type === RECYCLED_NODE) {
                        if (oldKey == null) {
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
                            if ((tmpVKid = keyed[newKey]) != null) {
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
                                    null,
                                    newVKids[newHead],
                                    isSvg
                                )
                            }
                        }
                        newHead++
                    }
                }

                while (oldHead <= oldTail)
                    if (getKey((oldVKid = oldVKids[oldHead++])) == null) removeChild(node, destroy(oldVKid.node));

                for (var i in keyed) if (newKeyed[i] == null) removeChild(node, destroy(keyed[i].node))
            }
        }
        return (newVNode.node = node)
    },

    createVNode = (name, props, children, node, key, type) => ({name, props, children, node, type, key}),

    createTextVNode = (value, node) => createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE),

    recycleNode = (node) => {
        let results = node.nodeType === TEXT_NODE
            ? createTextVNode(node.nodeValue, node)
            : createVNode(
                toLowerCase(node.nodeName),
                EMPTY_OBJ,
                map.call(node.childNodes, recycleNode),
                node,
                null,
                RECYCLED_NODE
            );
        return results;
    },

    patch = (node, vdom) => {
        //using template as a workaround since template tags have a document fragment as first child
        if (!node.__mountPoint) appendChild(node, (node.__mountPoint = createElement(vdom.name === HOST_TYPE ? 'template' : vdom.name)));
        let nodeToPatch = (vdom.name === HOST_TYPE && node.nodeName === HOST_TYPE) ? node : node.__mountPoint;
        (node = node.__mountPoint = patchNode(
            nodeToPatch.parentNode, //parent
            nodeToPatch, // node
            nodeToPatch.vdom || recycleNode(nodeToPatch), //oldVNode
            vdom // newVNode
        )).vdom = vdom;
        return node
    },


    h = function (name, props) {
        for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) rest.push(arguments[i]);
        if ((props = props == null ? {} : props).children != null) {
            if (rest.length <= 0) rest.push(props.children);
            delete props.children;
        }
        while (rest.length > 0) {
            if (isArray((vnode = rest.pop()))) {
                for (var i = vnode.length; i-- > 0;) rest.push(vnode[i])
            } else if (vnode === false || vnode === true || vnode == null) {
            } else children.push(typeof vnode === 'object' ? vnode : createTextVNode(vnode));
        }
        return isFunc(name)
            ? (props.children = props.children || children) && name(props)
            : createVNode(name, props, children, null, props.key)
    };


export {patch, h, Fragment, removeHandlers, HOST_TYPE, patchProperty, merge, parseClassList, cnObj, styleNode, setStyle}
