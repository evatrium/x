const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

/**
 * Assign properties from `props` to `obj`
 * @template O, P The obj and props types
 * @param {O} obj The object to copy properties to
 * @param {P} props The object to copy properties from
 * @returns {O & P}
 */
function assign(obj, props) {
    for (let i in props) obj[i] = props[i];

    return (
        /** @type {O & P} */
        obj
    );
}
/**
 * Remove a child node from its parent if attached. This is a workaround for
 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
 * is smaller than including a dedicated polyfill.
 * @param {Node} node The node to remove
 */

function removeNode(node) {
    let parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
}

/** @type {import('./internal').Options}  */
const options = {};

/**
 * Create an virtual node (used for JSX)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * constructor for this virtual node
 * @param {object | null | undefined} [props] The properties of the virtual node
 * @param {Array<import('.').ComponentChildren>} [children] The children of the virtual node
 * @returns {import('./internal').VNode}
 */

function createElement(type, props, children) {
    props = assign({}, props);

    if (arguments.length > 3) {
        children = [children]; // https://github.com/preactjs/preact/issues/1916

        for (let i = 3; i < arguments.length; i++) {
            children.push(arguments[i]);
        }
    }

    if (children != null) {
        props.children = children;
    } // "type" may be undefined during development. The check is needed so that
    // we can display a nice error message with our debug helpers


    if (type != null && type.defaultProps != null) {
        for (let i in type.defaultProps) {
            if (props[i] === undefined) props[i] = type.defaultProps[i];
        }
    }

    let ref = props.ref;
    let key = props.key;
    if (ref != null) delete props.ref;
    if (key != null) delete props.key;
    return createVNode(type, props, key, ref);
}
/**
 * Create a VNode (used internally by Preact)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object | string | number | null} props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @param {string | number | null} key The key for this virtual node, used when
 * diffing it against its children
 * @param {import('./internal').VNode["ref"]} ref The ref property that will
 * receive a reference to its created child
 * @returns {import('./internal').VNode}
 */

function createVNode(type, props, key, ref) {
    // V8 seems to be better at detecting type shapes if the object is allocated from the same call site
    // Do not inline into createElement and coerceToVNode!
    const vnode = {
        type,
        props,
        key,
        ref,
        _children: null,
        _parent: null,
        _depth: 0,
        _dom: null,
        _lastDomChild: null,
        _component: null,
        constructor: undefined
    };
    if (options.vnode) options.vnode(vnode);
    return vnode;
}
function createRef() {
    return {};
}

function Fragment(props) {
    return props.children;
}
/**
 * Check if a the argument is a valid Preact VNode.
 * @param {*} vnode
 * @returns {vnode is import('./internal').VNode}
 */

const isValidElement = vnode => vnode != null && vnode.constructor === undefined;
/**
 * Coerce an untrusted value into a VNode
 * Specifically, this should be used anywhere a user could provide a boolean, string, or number where
 * a VNode or Component is desired instead
 * @param {boolean | string | number | import('./internal').VNode} possibleVNode A possible VNode
 * @returns {import('./internal').VNode | null}
 */

function coerceToVNode(possibleVNode) {
    if (possibleVNode == null || typeof possibleVNode === 'boolean') return null;

    if (typeof possibleVNode === 'string' || typeof possibleVNode === 'number') {
        return createVNode(null, possibleVNode, null, null);
    } // Clone vnode if it has already been used. ceviche/#57


    if (possibleVNode._dom != null || possibleVNode._component != null) {
        let vnode = createVNode(possibleVNode.type, possibleVNode.props, possibleVNode.key, null);
        vnode._dom = possibleVNode._dom;
        return vnode;
    }

    return possibleVNode;
}

/**
 * Base Component class. Provides `setState()` and `forceUpdate()`, which
 * trigger rendering
 * @param {object} props The initial component props
 * @param {object} context The initial context from parent components'
 * getChildContext
 */

function Component(props, context) {
    this.props = props;
    this.context = context;
}
/**
 * Update component state and schedule a re-render.
 * @param {object | ((s: object, p: object) => object)} update A hash of state
 * properties to update with new values or a function that given the current
 * state and props returns a new partial state
 * @param {() => void} [callback] A function to be called once component state is
 * updated
 */

Component.prototype.setState = function (update, callback) {
    // only clone state when copying to nextState the first time.
    let s = this._nextState !== this.state && this._nextState || (this._nextState = assign({}, this.state)); // if update() mutates state in-place, skip the copy:

    if (typeof update !== 'function' || (update = update(s, this.props))) {
        assign(s, update);
    } // Skip update if updater function returned null


    if (update == null) return;

    if (this._vnode) {
        this._force = false;
        if (callback) this._renderCallbacks.push(callback);
        enqueueRender(this);
    }
};
/**
 * Immediately perform a synchronous re-render of the component
 * @param {() => void} [callback] A function to be called after component is
 * re-rendered
 */


Component.prototype.forceUpdate = function (callback) {
    if (this._vnode) {
        // Set render mode so that we can differentiate where the render request
        // is coming from. We need this because forceUpdate should never call
        // shouldComponentUpdate
        this._force = true;
        if (callback) this._renderCallbacks.push(callback);
        enqueueRender(this);
    }
};
/**
 * Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
 * Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
 * @param {object} props Props (eg: JSX attributes) received from parent
 * element/component
 * @param {object} state The component's current state
 * @param {object} context Context object, as returned by the nearest
 * ancestor's `getChildContext()`
 * @returns {import('./index').ComponentChildren | void}
 */


Component.prototype.render = Fragment;
/**
 * @param {import('./internal').VNode} vnode
 * @param {number | null} [childIndex]
 */

function getDomSibling(vnode, childIndex) {
    if (childIndex == null) {
        // Use childIndex==null as a signal to resume the search from the vnode's sibling
        return vnode._parent ? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1) : null;
    }

    let sibling;

    for (; childIndex < vnode._children.length; childIndex++) {
        sibling = vnode._children[childIndex];

        if (sibling != null && sibling._dom != null) {
            // Since updateParentDomPointers keeps _dom pointer correct,
            // we can rely on _dom to tell us if this subtree contains a
            // rendered DOM node, and what the first rendered DOM node is
            return sibling._dom;
        }
    } // If we get here, we have not found a DOM node in this vnode's children.
    // We must resume from this vnode's sibling (in it's parent _children array)
    // Only climb up and search the parent if we aren't searching through a DOM
    // VNode (meaning we reached the DOM parent of the original vnode that began
    // the search)


    return typeof vnode.type === 'function' ? getDomSibling(vnode) : null;
}
/**
 * Trigger in-place re-rendering of a component.
 * @param {import('./internal').Component} c The component to rerender
 */

function renderComponent(component) {
    let vnode = component._vnode,
        oldDom = vnode._dom,
        parentDom = component._parentDom;

    if (parentDom) {
        let mounts = [];
        let newDom = diff(parentDom, vnode, assign({}, vnode), component._context, parentDom.ownerSVGElement !== undefined, null, mounts, oldDom == null ? getDomSibling(vnode) : oldDom);
        commitRoot(mounts, vnode);

        if (newDom != oldDom) {
            updateParentDomPointers(vnode);
        }
    }
}
/**
 * @param {import('./internal').VNode} vnode
 */


function updateParentDomPointers(vnode) {
    if ((vnode = vnode._parent) != null && vnode._component != null) {
        vnode._dom = vnode._component.base = null;

        for (let i = 0; i < vnode._children.length; i++) {
            let child = vnode._children[i];

            if (child != null && child._dom != null) {
                vnode._dom = vnode._component.base = child._dom;
                break;
            }
        }

        return updateParentDomPointers(vnode);
    }
}
/**
 * The render queue
 * @type {Array<import('./internal').Component>}
 */


let q = [];
/**
 * Asynchronously schedule a callback
 * @type {(cb) => void}
 */

const defer = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
/*
 * The value of `Component.debounce` must asynchronously invoke the passed in callback. It is
 * important that contributors to Preact can consistently reason about what calls to `setState`, etc.
 * do, and when their effects will be applied. See the links below for some further reading on designing
 * asynchronous APIs.
 * * [Designing APIs for Asynchrony](https://blog.izs.me/2013/08/designing-apis-for-asynchrony)
 * * [Callbacks synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)
 */

let prevDebounce = options.debounceRendering;
/**
 * Enqueue a rerender of a component
 * @param {import('./internal').Component} c The component to rerender
 */

function enqueueRender(c) {
    if (!c._dirty && (c._dirty = true) && q.push(c) === 1 || prevDebounce !== options.debounceRendering) {
        prevDebounce = options.debounceRendering;
        (options.debounceRendering || defer)(process);
    }
}
/** Flush the render queue by rerendering all queued components */

function process() {
    let p;
    q.sort((a, b) => b._vnode._depth - a._vnode._depth);

    while (p = q.pop()) {
        // forceUpdate's callback argument is reused here to indicate a non-forced update.
        if (p._dirty) renderComponent(p);
    }
}

/**
 * Diff the children of a virtual node
 * @param {import('../internal').PreactElement} parentDom The DOM element whose
 * children are being diffed
 * @param {import('../internal').VNode} newParentVNode The new virtual
 * node whose children should be diff'ed against oldParentVNode
 * @param {import('../internal').VNode} oldParentVNode The old virtual
 * node whose children should be diff'ed against newParentVNode
 * @param {object} context The current context object
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {Array<import('../internal').PreactElement>} excessDomChildren
 * @param {Array<import('../internal').Component>} mounts The list of components
 * which have mounted
 * @param {Node | Text} oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 * @param {boolean} isHydrating Whether or not we are in hydration
 */

function diffChildren(parentDom, newParentVNode, oldParentVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating) {
    let i, j, oldVNode, newDom, sibDom, firstChildDom, refs; // This is a compression of oldParentVNode!=null && oldParentVNode != EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR
    // as EMPTY_OBJ._children should be `undefined`.

    let oldChildren = oldParentVNode && oldParentVNode._children || EMPTY_ARR;
    let oldChildrenLength = oldChildren.length; // Only in very specific places should this logic be invoked (top level `render` and `diffElementNodes`).
    // I'm using `EMPTY_OBJ` to signal when `diffChildren` is invoked in these situations. I can't use `null`
    // for this purpose, because `null` is a valid value for `oldDom` which can mean to skip to this logic
    // (e.g. if mounting a new tree in which the old DOM should be ignored (usually for Fragments).

    if (oldDom == EMPTY_OBJ) {
        if (excessDomChildren != null) {
            oldDom = excessDomChildren[0];
        } else if (oldChildrenLength) {
            oldDom = getDomSibling(oldParentVNode, 0);
        } else {
            oldDom = null;
        }
    }

    i = 0;
    newParentVNode._children = toChildArray(newParentVNode._children, childVNode => {
        if (childVNode != null) {
            childVNode._parent = newParentVNode;
            childVNode._depth = newParentVNode._depth + 1; // Check if we find a corresponding element in oldChildren.
            // If found, delete the array item by setting to `undefined`.
            // We use `undefined`, as `null` is reserved for empty placeholders
            // (holes).

            oldVNode = oldChildren[i];

            if (oldVNode === null || oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
                oldChildren[i] = undefined;
            } else {
                // Either oldVNode === undefined or oldChildrenLength > 0,
                // so after this loop oldVNode == null or oldVNode is a valid value.
                for (j = 0; j < oldChildrenLength; j++) {
                    oldVNode = oldChildren[j]; // If childVNode is unkeyed, we only match similarly unkeyed nodes, otherwise we match by key.
                    // We always match by type (in either case).

                    if (oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
                        oldChildren[j] = undefined;
                        break;
                    }

                    oldVNode = null;
                }
            }

            oldVNode = oldVNode || EMPTY_OBJ; // Morph the old element into the new one, but don't append it to the dom yet

            newDom = diff(parentDom, childVNode, oldVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating);

            if ((j = childVNode.ref) && oldVNode.ref != j) {
                (refs || (refs = [])).push(j, childVNode._component || newDom, childVNode);
            } // Only proceed if the vnode has not been unmounted by `diff()` above.


            if (newDom != null) {
                if (firstChildDom == null) {
                    firstChildDom = newDom;
                }

                if (childVNode._lastDomChild != null) {
                    // Only Fragments or components that return Fragment like VNodes will
                    // have a non-null _lastDomChild. Continue the diff from the end of
                    // this Fragment's DOM tree.
                    newDom = childVNode._lastDomChild; // Eagerly cleanup _lastDomChild. We don't need to persist the value because
                    // it is only used by `diffChildren` to determine where to resume the diff after
                    // diffing Components and Fragments.

                    childVNode._lastDomChild = null;
                } else if (excessDomChildren == oldVNode || newDom != oldDom || newDom.parentNode == null) {
                    // NOTE: excessDomChildren==oldVNode above:
                    // This is a compression of excessDomChildren==null && oldVNode==null!
                    // The values only have the same type when `null`.
                    outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
                        parentDom.appendChild(newDom);
                    } else {
                        // `j<oldChildrenLength; j+=2` is an alternative to `j++<oldChildrenLength/2`
                        for (sibDom = oldDom, j = 0; (sibDom = sibDom.nextSibling) && j < oldChildrenLength; j += 2) {
                            if (sibDom == newDom) {
                                break outer;
                            }
                        }

                        parentDom.insertBefore(newDom, oldDom);
                    } // Browsers will infer an option's `value` from `textContent` when
                    // no value is present. This essentially bypasses our code to set it
                    // later in `diff()`. It works fine in all browsers except for IE11
                    // where it breaks setting `select.value`. There it will be always set
                    // to an empty string. Re-applying an options value will fix that, so
                    // there are probably some internal data structures that aren't
                    // updated properly.
                    //
                    // To fix it we make sure to reset the inferred value, so that our own
                    // value check in `diff()` won't be skipped.


                    if (newParentVNode.type == 'option') {
                        parentDom.value = '';
                    }
                }

                oldDom = newDom.nextSibling;

                if (typeof newParentVNode.type == 'function') {
                    // At this point, if childVNode._lastDomChild existed, then
                    // newDom = childVNode._lastDomChild per line 101. Else it is
                    // the same as childVNode._dom, meaning this component returned
                    // only a single DOM node
                    newParentVNode._lastDomChild = newDom;
                }
            }
        }

        i++;
        return childVNode;
    });
    newParentVNode._dom = firstChildDom; // Remove children that are not part of any vnode.

    if (excessDomChildren != null && typeof newParentVNode.type !== 'function') for (i = excessDomChildren.length; i--;) if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]); // Remove remaining oldChildren if there are any.

    for (i = oldChildrenLength; i--;) if (oldChildren[i] != null) unmount(oldChildren[i], oldChildren[i]); // Set refs only after unmount


    if (refs) {
        for (i = 0; i < refs.length; i++) {
            applyRef(refs[i], refs[++i], refs[++i]);
        }
    }
}
/**
 * Flatten and loop through the children of a virtual node
 * @param {import('../index').ComponentChildren} children The unflattened
 * children of a virtual node
 * @param {(vnode: import('../internal').VNode) => import('../internal').VNode} [callback]
 * A function to invoke for each child before it is added to the flattened list.
 * @param {import('../internal').VNode[]} [flattened] An flat array of children to modify
 * @returns {import('../internal').VNode[]}
 */

function toChildArray(children, callback, flattened) {
    if (flattened == null) flattened = [];

    if (children == null || typeof children === 'boolean') {
        if (callback) flattened.push(callback(null));
    } else if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            toChildArray(children[i], callback, flattened);
        }
    } else {
        flattened.push(callback ? callback(coerceToVNode(children)) : children);
    }

    return flattened;
}

/**
 * Diff the old and new properties of a VNode and apply changes to the DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to apply
 * changes to
 * @param {object} newProps The new props
 * @param {object} oldProps The old props
 * @param {boolean} isSvg Whether or not this node is an SVG node
 * @param {boolean} hydrate Whether or not we are in hydration mode
 */

function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
    let i;

    for (i in oldProps) {
        if (!(i in newProps)) {
            setProperty(dom, i, null, oldProps[i], isSvg);
        }
    }

    for (i in newProps) {
        if ((!hydrate || typeof newProps[i] == 'function') && i !== 'value' && i !== 'checked' && oldProps[i] !== newProps[i]) {
            setProperty(dom, i, newProps[i], oldProps[i], isSvg);
        }
    }
}

function setStyle(style, key, value) {
    if (key[0] === '-') {
        style.setProperty(key, value);
    } else {
        style[key] = typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value == null ? '' : value;
    }
}
/**
 * Set a property value on a DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to modify
 * @param {string} name The name of the property to set
 * @param {*} value The value to set the property to
 * @param {*} oldValue The old value the property had
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
 */


export function setProperty(dom, name, value, oldValue, isSvg) {
    name = isSvg ? name === 'className' ? 'class' : name : name === 'class' ? 'className' : name;

    if (name === 'key' || name === 'children') {} else if (name === 'style') {
        const s = dom.style;

        if (typeof value === 'string') {
            s.cssText = value;
        } else {
            if (typeof oldValue === 'string') {
                s.cssText = '';
                oldValue = null;
            }

            if (oldValue) for (let i in oldValue) {
                if (!(value && i in value)) {
                    setStyle(s, i, '');
                }
            }
            if (value) for (let i in value) {
                if (!oldValue || value[i] !== oldValue[i]) {
                    setStyle(s, i, value[i]);
                }
            }
        }
    } // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
    else if (name[0] === 'o' && name[1] === 'n') {
        let useCapture = name !== (name = name.replace(/Capture$/, ''));
        let nameLower = name.toLowerCase();
        name = (nameLower in dom ? nameLower : name).slice(2);

        if (value) {
            if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
            (dom._listeners || (dom._listeners = {}))[name] = value;
        } else {
            dom.removeEventListener(name, eventProxy, useCapture);
        }
    } else if (name !== 'list' && name !== 'tagName' // HTMLButtonElement.form and HTMLInputElement.form are read-only but can be set using
        // setAttribute
        && name !== 'form' && !isSvg && name in dom) {
        dom[name] = value == null ? '' : value;
    } else if (typeof value !== 'function' && name !== 'dangerouslySetInnerHTML') {
        if (name !== (name = name.replace(/^xlink:?/, ''))) {
            if (value == null || value === false) {
                dom.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
            } else {
                dom.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
            }
        } else if (value == null || value === false) {
            dom.removeAttribute(name);
        } else {
            dom.setAttribute(name, value);
        }
    }
}
/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 * @private
 */


function eventProxy(e) {
    return this._listeners[e.type](options.event ? options.event(e) : e);
}

/**
 * Diff two virtual nodes and apply proper changes to the DOM
 * @param {import('../internal').PreactElement} parentDom The parent of the DOM element
 * @param {import('../internal').VNode} newVNode The new virtual node
 * @param {import('../internal').VNode} oldVNode The old virtual node
 * @param {object} context The current context object
 * @param {boolean} isSvg Whether or not this element is an SVG node
 * @param {Array<import('../internal').PreactElement>} excessDomChildren
 * @param {Array<import('../internal').Component>} mounts A list of newly
 * mounted components
 * @param {Element | Text} oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 * @param {boolean} isHydrating Whether or not we are in hydration
 */

function diff(parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating) {
    let tmp,
        newType = newVNode.type; // When passing through createElement it assigns the object
    // constructor as undefined. This to prevent JSON-injection.

    if (newVNode.constructor !== undefined) return null;
    if (tmp = options._diff) tmp(newVNode);

    try {
        outer: if (typeof newType === 'function') {
            let c, isNew, oldProps, oldState, snapshot, clearProcessingException;
            let newProps = newVNode.props; // Necessary for createContext api. Setting this property will pass
            // the context value as `this.context` just for this component.

            tmp = newType.contextType;
            let provider = tmp && context[tmp._id];
            let cctx = tmp ? provider ? provider.props.value : tmp._defaultValue : context; // Get component and set it to `c`

            if (oldVNode._component) {
                c = newVNode._component = oldVNode._component;
                clearProcessingException = c._processingException = c._pendingError;
            } else {
                // Instantiate the new component
                if ('prototype' in newType && newType.prototype.render) {
                    newVNode._component = c = new newType(newProps, cctx); // eslint-disable-line new-cap
                } else {
                    newVNode._component = c = new Component(newProps, cctx);
                    c.constructor = newType;
                    c.render = doRender;
                }

                if (provider) provider.sub(c);
                c.props = newProps;
                if (!c.state) c.state = {};
                c.context = cctx;
                c._context = context;
                isNew = c._dirty = true;
                c._renderCallbacks = [];
            } // Invoke getDerivedStateFromProps


            if (c._nextState == null) {
                c._nextState = c.state;
            }

            if (newType.getDerivedStateFromProps != null) {
                assign(c._nextState == c.state ? c._nextState = assign({}, c._nextState) : c._nextState, newType.getDerivedStateFromProps(newProps, c._nextState));
            } // Invoke pre-render lifecycle methods


            if (isNew) {
                if (newType.getDerivedStateFromProps == null && c.componentWillMount != null) c.componentWillMount();
                if (c.componentDidMount != null) mounts.push(c);
            } else {
                if (newType.getDerivedStateFromProps == null && c._force == null && c.componentWillReceiveProps != null) {
                    c.componentWillReceiveProps(newProps, cctx);
                }

                if (!c._force && c.shouldComponentUpdate != null && c.shouldComponentUpdate(newProps, c._nextState, cctx) === false) {
                    c.props = newProps;
                    c.state = c._nextState;
                    c._dirty = false;
                    c._vnode = newVNode;
                    newVNode._dom = oldVNode._dom;
                    newVNode._children = oldVNode._children;

                    for (tmp = 0; tmp < newVNode._children.length; tmp++) {
                        if (newVNode._children[tmp]) newVNode._children[tmp]._parent = newVNode;
                    }

                    break outer;
                }

                if (c.componentWillUpdate != null) {
                    c.componentWillUpdate(newProps, c._nextState, cctx);
                }
            }

            oldProps = c.props;
            oldState = c.state;
            c.context = cctx;
            c.props = newProps;
            c.state = c._nextState;
            if (tmp = options._render) tmp(newVNode);
            c._dirty = false;
            c._vnode = newVNode;
            c._parentDom = parentDom;
            tmp = c.render(c.props, c.state, c.context);
            let isTopLevelFragment = tmp != null && tmp.type == Fragment && tmp.key == null;
            newVNode._children = toChildArray(isTopLevelFragment ? tmp.props.children : tmp);

            if (c.getChildContext != null) {
                context = assign(assign({}, context), c.getChildContext());
            }

            if (!isNew && c.getSnapshotBeforeUpdate != null) {
                snapshot = c.getSnapshotBeforeUpdate(oldProps, oldState);
            }

            diffChildren(parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating);
            c.base = newVNode._dom;
            tmp = c._renderCallbacks;
            c._renderCallbacks = [];
            tmp.some(cb => {
                cb.call(c);
            }); // Don't call componentDidUpdate on mount or when we bailed out via
            // `shouldComponentUpdate`

            if (!isNew && oldProps != null && c.componentDidUpdate != null) {
                c.componentDidUpdate(oldProps, oldState, snapshot);
            }

            if (clearProcessingException) {
                c._pendingError = c._processingException = null;
            }

            c._force = null;
        } else {
            newVNode._dom = diffElementNodes(oldVNode._dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, isHydrating);
        }

        if (tmp = options.diffed) tmp(newVNode);
    } catch (e) {
        options._catchError(e, newVNode, oldVNode);
    }

    return newVNode._dom;
}
function commitRoot(mounts, root) {
    let c;

    while (c = mounts.pop()) {
        try {
            c.componentDidMount();
        } catch (e) {
            options._catchError(e, c._vnode);
        }
    }

    if (options._commit) options._commit(root);
}
/**
 * Diff two virtual nodes representing DOM element
 * @param {import('../internal').PreactElement} dom The DOM element representing
 * the virtual nodes being diffed
 * @param {import('../internal').VNode} newVNode The new virtual node
 * @param {import('../internal').VNode} oldVNode The old virtual node
 * @param {object} context The current context object
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {*} excessDomChildren
 * @param {Array<import('../internal').Component>} mounts An array of newly
 * mounted components
 * @param {boolean} isHydrating Whether or not we are in hydration
 * @returns {import('../internal').PreactElement}
 */

function diffElementNodes(dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, isHydrating) {
    let i;
    let oldProps = oldVNode.props;
    let newProps = newVNode.props; // Tracks entering and exiting SVG namespace when descending through the tree.

    isSvg = newVNode.type === 'svg' || isSvg;

    if (dom == null && excessDomChildren != null) {
        for (i = 0; i < excessDomChildren.length; i++) {
            const child = excessDomChildren[i];

            if (child != null && (newVNode.type === null ? child.nodeType === 3 : child.localName === newVNode.type)) {
                dom = child;
                excessDomChildren[i] = null;
                break;
            }
        }
    }

    if (dom == null) {
        if (newVNode.type === null) {
            return document.createTextNode(newProps);
        }

        dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', newVNode.type) : document.createElement(newVNode.type); // we created a new parent, so none of the previously attached children can be reused:

        excessDomChildren = null;
    }

    if (newVNode.type === null) {
        if (excessDomChildren != null) excessDomChildren[excessDomChildren.indexOf(dom)] = null;

        if (oldProps !== newProps) {
            dom.data = newProps;
        }
    } else if (newVNode !== oldVNode) {
        if (excessDomChildren != null) {
            excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
        }

        oldProps = oldVNode.props || EMPTY_OBJ;
        let oldHtml = oldProps.dangerouslySetInnerHTML;
        let newHtml = newProps.dangerouslySetInnerHTML; // During hydration, props are not diffed at all (including dangerouslySetInnerHTML)
        // @TODO we should warn in debug mode when props don't match here.

        if (!isHydrating) {
            if (oldProps === EMPTY_OBJ) {
                oldProps = {};

                for (let i = 0; i < dom.attributes.length; i++) {
                    oldProps[dom.attributes[i].name] = dom.attributes[i].value;
                }
            }

            if (newHtml || oldHtml) {
                // Avoid re-applying the same '__html' if it did not changed between re-render
                if (!newHtml || !oldHtml || newHtml.__html != oldHtml.__html) {
                    dom.innerHTML = newHtml && newHtml.__html || '';
                }
            }
        }

        diffProps(dom, newProps, oldProps, isSvg, isHydrating);
        newVNode._children = newVNode.props.children; // If the new vnode didn't have dangerouslySetInnerHTML, diff its children

        if (!newHtml) {
            diffChildren(dom, newVNode, oldVNode, context, newVNode.type === 'foreignObject' ? false : isSvg, excessDomChildren, mounts, EMPTY_OBJ, isHydrating);
        } // (as above, don't diff props during hydration)


        if (!isHydrating) {
            if ('value' in newProps && newProps.value !== undefined && newProps.value !== dom.value) dom.value = newProps.value == null ? '' : newProps.value;
            if ('checked' in newProps && newProps.checked !== undefined && newProps.checked !== dom.checked) dom.checked = newProps.checked;
        }
    }

    return dom;
}
/**
 * Invoke or update a ref, depending on whether it is a function or object ref.
 * @param {object|function} ref
 * @param {any} value
 * @param {import('../internal').VNode} vnode
 */


function applyRef(ref, value, vnode) {
    try {
        if (typeof ref == 'function') ref(value);else ref.current = value;
    } catch (e) {
        options._catchError(e, vnode);
    }
}
/**
 * Unmount a virtual node from the tree and apply DOM changes
 * @param {import('../internal').VNode} vnode The virtual node to unmount
 * @param {import('../internal').VNode} parentVNode The parent of the VNode that
 * initiated the unmount
 * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
 * current element is already detached from the DOM.
 */

function unmount(vnode, parentVNode, skipRemove) {
    let r;
    if (options.unmount) options.unmount(vnode);

    if (r = vnode.ref) {
        applyRef(r, null, parentVNode);
    }

    let dom;

    if (!skipRemove && typeof vnode.type !== 'function') {
        skipRemove = (dom = vnode._dom) != null;
    }

    vnode._dom = vnode._lastDomChild = null;

    if ((r = vnode._component) != null) {
        if (r.componentWillUnmount) {
            try {
                r.componentWillUnmount();
            } catch (e) {
                options._catchError(e, parentVNode);
            }
        }

        r.base = r._parentDom = null;
    }

    if (r = vnode._children) {
        for (let i = 0; i < r.length; i++) {
            if (r[i]) unmount(r[i], parentVNode, skipRemove);
        }
    }

    if (dom != null) removeNode(dom);
}
/** The `.render()` method for a PFC backing instance. */

function doRender(props, state, context) {
    return this.constructor(props, context);
}
/**
 * Find the closest error boundary to a thrown error and call it
 * @param {object} error The thrown value
 * @param {import('../internal').VNode} vnode The vnode that threw
 * the error that was caught (except for unmounting when this parameter
 * is the highest parent that was being unmounted)
 * @param {import('../internal').VNode} oldVNode The oldVNode of the vnode
 * that threw, if this VNode threw while diffing
 */


options._catchError = function (error, vnode, oldVNode) {
    /** @type {import('../internal').Component} */
    let component;

    for (; vnode = vnode._parent;) {
        if ((component = vnode._component) && !component._processingException) {
            try {
                if (component.constructor && component.constructor.getDerivedStateFromError != null) {
                    component.setState(component.constructor.getDerivedStateFromError(error));
                } else if (component.componentDidCatch != null) {
                    component.componentDidCatch(error);
                } else {
                    continue;
                }

                return enqueueRender(component._pendingError = component);
            } catch (e) {
                error = e;
            }
        }
    }

    throw error;
};

const IS_HYDRATE = EMPTY_OBJ;
/**
 * Render a Preact virtual node into a DOM element
 * @param {import('./index').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * render into
 * @param {Element | Text} [replaceNode] Attempt to re-use an
 * existing DOM tree rooted at `replaceNode`
 */

function render(vnode, parentDom, replaceNode) {
    if (options._root) options._root(vnode, parentDom);
    let isHydrating = replaceNode === IS_HYDRATE;
    let oldVNode = isHydrating ? null : replaceNode && replaceNode._children || parentDom._children;
    vnode = createElement(Fragment, null, [vnode]);
    let mounts = [];
    diff(parentDom, isHydrating ? parentDom._children = vnode : (replaceNode || parentDom)._children = vnode, oldVNode || EMPTY_OBJ, EMPTY_OBJ, parentDom.ownerSVGElement !== undefined, replaceNode && !isHydrating ? [replaceNode] : oldVNode ? null : EMPTY_ARR.slice.call(parentDom.childNodes), mounts, replaceNode || EMPTY_OBJ, isHydrating);
    commitRoot(mounts, vnode);
}
/**
 * Update an existing DOM element with data from a Preact virtual node
 * @param {import('./index').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * update
 */

function hydrate(vnode, parentDom) {
    render(vnode, parentDom, IS_HYDRATE);
}

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {import('./internal').VNode} vnode The virtual DOM element to clone
 * @param {object} props Attributes/props to add when cloning
 * @param {Array<import('./index').ComponentChildren>} rest Any additional arguments will be used as replacement children.
 */

function cloneElement(vnode, props) {
    props = assign(assign({}, vnode.props), props);
    if (arguments.length > 2) props.children = EMPTY_ARR.slice.call(arguments, 2);
    return createVNode(vnode.type, props, props.key || vnode.key, props.ref || vnode.ref);
}

let i = 0;
/**
 *
 * @param {any} defaultValue
 */

function createContext(defaultValue) {
    const ctx = {};
    const context = {
        _id: '__cC' + i++,
        _defaultValue: defaultValue,

        Consumer(props, context) {
            return props.children(context);
        },

        Provider(props) {
            if (!this.getChildContext) {
                const subs = [];

                this.getChildContext = () => {
                    ctx[context._id] = this;
                    return ctx;
                };

                this.shouldComponentUpdate = _props => {
                    if (props.value !== _props.value) {
                        subs.some(c => {
                            // Check if still mounted
                            if (c._parentDom) {
                                c.context = _props.value;
                                enqueueRender(c);
                            }
                        });
                    }
                };

                this.sub = c => {
                    subs.push(c);
                    let old = c.componentWillUnmount;

                    c.componentWillUnmount = () => {
                        subs.splice(subs.indexOf(c), 1);
                        old && old.call(c);
                    };
                };
            }

            return props.children;
        }

    };
    context.Consumer.contextType = context;
    return context;
}

export { Component, Fragment, unmount as _unmount, cloneElement, createContext, createElement, createRef, createElement as h, hydrate, isValidElement, options, render, toChildArray };
