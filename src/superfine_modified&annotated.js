import {isFunc, isObj, isArray, removeListener } from "@iosio/util";

// modified version of superfine https://github.com/jorgebucaran/superfine


var RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map;

/*ADDITION*/
export const FRAGMENT_TYPE = '#document-fragment';

/*ADDITION -- have not implemented this */
export const Host = (_, children) => {
    return h(FRAGMENT_TYPE, _ || {}, children);
};
/*ADDITION*/
export const Fragment = (_, children) => {
    return h(FRAGMENT_TYPE, {}, children);
};

/*ADDITION*/
function isCustomElement(el) {
    if (!el.getAttribute || !el.localName) return false;
    const isAttr = el.getAttribute('is');
    return el.localName.includes('-') || isAttr && isAttr.includes('-');
}

/*ADDITION*/
const cnObj = (obj, out) => {
    out = "";
    for (let k in obj) if (obj[k]) out += (out && " ") + k;
    return out;
};

/*ADDITION*/
const makeClassName = (value) => isObj(value) ? cnObj(value) : value;
/*ADDITION*/
const parseClassList = (value) => (!value) ? [] : value.split(/\s+/).filter(c => c);

export const propsChanged = (a, b) => {
    a = a || {};
    b = b || {}
    for (var k in a) if (a[k] !== b[k]) return true;
    for (var k in b) if (a[k] !== b[k]) return true;
    return false
};

const merge = (a, b, out) => {
    out = {};
    for (var k in a) out[k] = a[k];
    for (var k in b) out[k] = b[k];
    return out
};
export const listener = function (event) {
    this.handlers[event.type](event)
};

/*ADDITION --- used inside web component disconnect callback*/
export const removeHandlers = (dom) => {
    [].concat(...dom.childNodes).forEach(c => {
        if (c.handlers) for (let k in c.handlers) removeListener(c, k, listener);
        removeHandlers(c);
    });
};

const patchProperty = (node, key, oldValue, newValue, isSvg) => {
    if (key === "key") {
    }
    /*
       START - ALTERATIONS
       referencing stencil's set accessor functionality for many kinds of 'on'-event names
       cuz "custom" event names defined by the user within web components may also start with 'on' like onMyCustomEvent
       https://github.com/ionic-team/stencil/blob/master/src/runtime/vdom/set-accessor.ts
     */
    else if (isFunc(newValue) && key.startsWith('on') && !(key in node)) {

        let eventType = (key.toLowerCase() in node)
            ? key.slice(2).toLowerCase()
            : key[2].toLowerCase() + key.substring(3);
        if (!((node.handlers || (node.handlers = {}))[(key = eventType)] = newValue)) {
            node.removeEventListener(key, listener);
        } else if (!oldValue) {
            node.addEventListener(key, listener);
        }

    } else if (key === 'ref' && isFunc(newValue)) newValue(node);
    else if (key === 'className') {
        /*
          In order to prevent initial style flashing/reflow of undefined web components
          a style tag that is embedded in the html contains a class for all the custom element tags
          which sets them to visibility hidden initially. Once the web component has rendered
          it adds a class to its own classList to make it visibility inherit.
          The following actually works great for avoiding the already defined class names that exist
          on the component or defined by other means / internally or by some other component.
        */
        // if (isObj(newValue) && !propsChanged(oldValue, newValue)) return;
        let classList = node.classList;
        // console.log(makeClassName(oldValue), makeClassName(newValue))
        parseClassList(makeClassName(oldValue)).forEach(cls => node.classList.remove(cls));
        parseClassList(makeClassName(newValue)).forEach(cls => node.classList.add(cls));
    }
    // else if (key === 'style' && isObj(newValue) && propsChanged(oldValue, newValue)) Object.assign(node.style, newValue); // no worky
    else if (!isSvg && key !== "list" && key in node) {
        node[key] = newValue == null ? "" : newValue;
    } else if (newValue == null || newValue === false) node.removeAttribute(key);
    else node.setAttribute(key, !isCustomElement(node)
            ? newValue : (typeof newValue === "object" ? JSON.stringify(newValue) : newValue));
    // if arr/obj and its a web component, then stringify the array or object (typeof [] === 'object')
};
/*END - ALTERATIONS */


var createNode = function (vnode, isSvg) {
    var node =
        vnode.type === TEXT_NODE
            ? document.createTextNode(vnode.name)
            : (isSvg = isSvg || vnode.name === "svg")
            ? document.createElementNS("http://www.w3.org/2000/svg", vnode.name)
            /*
              START - ALTERATIONS
              implements the use of document fragments (* if first rendering to a template element * )
              * works with the root element in a web component
              * haven't extensively tested much else

              return(
                <Fragment>
                  <my-element/>
                  <my-box/>
                </Fragment>
              )
           */
            : vnode.name === '#document-fragment'
                ? document.createDocumentFragment()
                : document.createElement(vnode.name);
    /*END - ALTERATIONS */

    var props = vnode.props

    for (var k in props) {
        patchProperty(node, k, null, props[k], isSvg)
    }

    for (var i = 0, len = vnode.children.length; i < len; i++) {
        node.appendChild(createNode(vnode.children[i], isSvg))
    }

    return (vnode.node = node)
}

var getKey = function (vnode) {
    return vnode == null ? null : vnode.key
}

/*
would be cool to skip diffing on an element with something like this
else if(newVNode.props.noDiff && oldVNode)...
*/


/*
   ADDITION
   Looked at Atomico's code (which uses vdom in web components) and noticed the destroy method
   on the web component base component. Since its the shadow dom, it may be possible that the child
   nodes aren't being looked over???? checked the handlers and they were'nt being removed so i added
   this to clean things up.
 */
const destroy = (dom) => {
    dom._destroy && dom._destroy(dom);
    return dom;
};
/*END - ADDITION */

var patchNode = (parent, node, oldVNode, newVNode, isSvg) => {


    if (oldVNode === newVNode) {
    } else if (
        oldVNode != null &&
        oldVNode.type === TEXT_NODE &&
        newVNode.type === TEXT_NODE
    ) {
        if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
    } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
        node = parent.insertBefore(createNode(newVNode, isSvg), node)
        if (oldVNode != null) {
            /*ALTERATION - cleanup if web component*/
            parent.removeChild(destroy(oldVNode.node))
        }
    } else {
        var tmpVKid
        var oldVKid

        var oldKey
        var newKey

        var oldVProps = oldVNode.props
        var newVProps = newVNode.props

        var oldVKids = oldVNode.children
        var newVKids = newVNode.children

        var oldHead = 0
        var newHead = 0
        var oldTail = oldVKids.length - 1
        var newTail = newVKids.length - 1

        isSvg = isSvg || newVNode.name === "svg"


        for (var i in merge(oldVProps, newVProps)) {
            let _old = oldVProps[i], _new = newVProps[i];
            if ((i === "value" || i === "selected" || i === "checked" ? node[i] : _old) !== _new) {
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
                node.insertBefore(
                    createNode(newVKids[newHead++], isSvg),
                    (oldVKid = oldVKids[oldHead]) && oldVKid.node
                )
            }
        } else if (newHead > newTail) {
            while (oldHead <= oldTail) {
                /*ALTERATION - cleanup if web component*/
                node.removeChild(destroy(oldVKids[oldHead++].node))
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
                    if (oldKey == null) {
                        /*ALTERATION - cleanup if web component*/
                        node.removeChild(destroy(oldVKid.node))
                    }
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
                                node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
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

            while (oldHead <= oldTail) {
                if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
                    /*ALTERATION - cleanup if web component*/
                    node.removeChild(destroy(oldVKid.node))
                }
            }


            for (var i in keyed) {
                if (newKeyed[i] == null) {
                    /*ALTERATION - cleanup if web component*/
                    node.removeChild(destroy(keyed[i].node))
                }
            }


        }
    }

    return (newVNode.node = node)
};


var createVNode = function (name, props, children, node, key, type) {
    return {
        name: name,
        props: props,
        children: children,
        node: node,
        type: type,
        key: key
    }
}

var createTextVNode = function (value, node) {
    return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE)
}

export var recycleNode = function (node) {
    return node.nodeType === TEXT_NODE
        ? createTextVNode(node.nodeValue, node)
        : createVNode(
            node.nodeName.toLowerCase(),
            EMPTY_OBJ,
            map.call(node.childNodes, recycleNode),
            node,
            null,
            RECYCLED_NODE
        )
}

export var patch = function (node, vdom) {
    return (
        ((node = patchNode(
            node.parentNode,
            node,
            node.vdom || recycleNode(node),
            vdom
        )).vdom = vdom),
            node
    )
}

export var h = function (name, props) {
    for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) {
        rest.push(arguments[i])
    }
    while (rest.length > 0) {
        if (isArray((vnode = rest.pop()))) {
            for (var i = vnode.length; i-- > 0;) {
                rest.push(vnode[i])
            }
        } else if (vnode === false || vnode === true || vnode == null) {
        } else {
            children.push(typeof vnode === "object" ? vnode : createTextVNode(vnode))
        }
    }
    props = props || EMPTY_OBJ
    return typeof name === "function"
        ? name(props, children)
        : createVNode(name, props, children, null, props.key)
}