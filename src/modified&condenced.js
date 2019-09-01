import {isFunc, isObj, isArray, removeListener, addListener} from "@iosio/util";

import {d} from "./utils";

// modified version of https://github.com/jorgebucaran/superfine

var createElem = (elem) => d.createElement(elem),
    removeChild = (parent, child) => parent.removeChild(child),
    insertBefore = (parent, node, targetNode) => parent.insertBefore(node, targetNode),
    toLowerCase = (toLower) => toLower.toLowerCase(),
    RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map,
    FRAGMENT_TYPE = '#document-fragment',
    Fragment = (_, children) => {
        return h(FRAGMENT_TYPE, {}, children);
    },
    isCustomElement = (el, isAttr) => {
        if (!el.getAttribute || !el.localName) return false;
        isAttr = el.getAttribute('is');
        return el.localName.includes('-') || isAttr && isAttr.includes('-');
    },
    cnObj = (obj, out) => {
        out = "";
        for (let k in obj) if (obj[k]) out += (out && " ") + k;
        return out;
    },
    makeClassName = (value) => isObj(value) ? cnObj(value) : value,
    parseClassList = (value) => (!value) ? [] : value.split(/\s+/).filter(c => c),
    merge = (a, b, out) => {
        out = {};
        for (var k in a) out[k] = a[k];
        for (var k in b) out[k] = b[k];
        return out
    },
    listener = function (event) {
        this.handlers[event.type](event)
    },
    removeHandlers = (dom) => {
        [].concat(...dom.childNodes).forEach(c => {
            if (c.handlers) for (let k in c.handlers) removeListener(c, k, listener);
            removeHandlers(c);
        });
    },
    patchProperty = (node, key, oldValue, newValue, isSvg) => {
        if (key === "key") {
        } else if (isFunc(newValue) && key.startsWith('on') && !(key in node)) {
            let eventType = (toLowerCase(key) in node)
                ? toLowerCase(key.slice(2))
                : toLowerCase(key[2]) + key.substring(3);
            if (!((node.handlers || (node.handlers = {}))[(key = eventType)] = newValue))
                removeListener(node, key, listener);
            else if (!oldValue) addListener(node, key, listener);
        } else if (key === 'ref' && isFunc(newValue)) newValue(node);
        else if (key === 'className' || key === 'class') {
            let classList = node.classList;
            parseClassList(makeClassName(oldValue)).forEach(cls => classList.remove(cls));
            parseClassList(makeClassName(newValue)).forEach(cls => classList.add(cls));
        } else if (!isSvg && key !== "list" && key in node) {
            node[key] = newValue == null ? "" : newValue;
        } else if (newValue == null || newValue === false) node.removeAttribute(key);
        else node.setAttribute(key, !isCustomElement(node)
                ? newValue : (typeof newValue === "object" ? JSON.stringify(newValue) : newValue));
    },
    createNode = (vnode, isSvg) => {
        var node = vnode.type === TEXT_NODE
            ? d.createTextNode(vnode.name)
            : (isSvg = isSvg || vnode.name === "svg")
                ? d.createElementNS("http://www.w3.org/2000/svg", vnode.name)
                : vnode.name === '#document-fragment'
                    ? d.createDocumentFragment()
                    : createElem(vnode.name),
            props = vnode.props;
        for (var k in props) patchProperty(node, k, null, props[k], isSvg);
        for (var i = 0, len = vnode.children.length; i < len; i++) node.appendChild(createNode(vnode.children[i], isSvg));
        return (vnode.node = node)
    },
    getKey = (vnode) => vnode == null ? null : vnode.key,
    destroy = (dom) => (dom._destroy && dom._destroy(dom), dom),
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

            for (var i in merge(oldVProps, newVProps)) {
                let _old = oldVProps[i], _new = newVProps[i];
                if ((['value', 'selected', 'checked'].includes(i) ? node[i] : _old) !== _new) {
                    patchProperty(node, i, _old, _new, isSvg)
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
                    if (getKey((oldVKid = oldVKids[oldHead++])) == null)
                        removeChild(node, destroy(oldVKid.node));

                for (var i in keyed) if (newKeyed[i] == null) removeChild(node, destroy(keyed[i].node))
            }
        }
        return (newVNode.node = node)
    },
    createVNode = (name, props, children, node, key, type) => ({name, props, children, node, type, key}),
    createTextVNode = (value, node) => createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE),
    recycleNode = (node) =>
        node.nodeType === TEXT_NODE
            ? createTextVNode(node.nodeValue, node)
            : createVNode(
            toLowerCase(node.nodeName),
            EMPTY_OBJ,
            map.call(node.childNodes, recycleNode),
            node,
            null,
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
            } else if (vnode === false || vnode === true || vnode == null) {
            } else children.push(isObj(vnode) ? vnode : createTextVNode(vnode));
        }
        props = props || EMPTY_OBJ
        return isFunc(name)
            ? name(props, children)
            : createVNode(name, props, children, null, props.key)
    };

export {patch, h, Fragment, removeHandlers, FRAGMENT_TYPE}
