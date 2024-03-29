// import {isFunc, isBool, isString, isNum} from "./utils";
//
// const EMPTY_OBJ = {};
// const EMPTY_ARR = [];
// const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;
//
// const Fragment = props => props.children;
//
// function assign(obj, props) {
//     for (let i in props) obj[i] = props[i];
//     return (obj);
// }
//
// function removeNode(node) {
//     let parentNode = node.parentNode;
//     if (parentNode) parentNode.removeChild(node);
// }
//
// const createVNode = (type, props, key, ref) => ({
//     type,
//     props,
//     key,
//     ref,
//     _children: null,
//     _parent: null,
//     _depth: 0,
//     _dom: null,
//     _lastDomChild: null,
//     _component: null,
//     constructor: undefined
// });
//
//
// const applyRef = (ref, value) => isFunc(ref) ? ref(value) : (ref.current = value),
//
//     coerceToVNode = (possibleVNode) => {
//         if (possibleVNode == null || isBool(possibleVNode)) return null;
//         if (isString(possibleVNode) || isNum(possibleVNode)) {
//             return createVNode(null, possibleVNode, null, null);
//         }
//         if (possibleVNode._dom != null || possibleVNode._component != null) {
//             let vnode = createVNode(possibleVNode.type, possibleVNode.props, possibleVNode.key, null);
//             vnode._dom = possibleVNode._dom;
//             return vnode;
//         }
//         return possibleVNode;
//     },
//
//     toChildArray = (children, callback, flattened) => {
//         if (flattened == null) flattened = [];
//         if (children == null || isBool(children)) {
//             if (callback) flattened.push(callback(null));
//         } else if (Array.isArray(children)) {
//             for (let i = 0; i < children.length; i++) toChildArray(children[i], callback, flattened);
//         } else flattened.push(callback ? callback(coerceToVNode(children)) : children);
//         return flattened;
//     },
//
//     getDomSibling = (vnode, childIndex) => {
//         if (childIndex == null) {
//             return vnode._parent ? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1) : null;
//         }
//         let sibling;
//         for (; childIndex < vnode._children.length; childIndex++) {
//             sibling = vnode._children[childIndex];
//             if (sibling != null && sibling._dom != null) return sibling._dom;
//         }
//         return isFunc(vnode.type) ? getDomSibling(vnode) : null;
//     },
//     eventProxy = function (e) {
//         return this._listeners[e.type](e);
//     },
//
//     diffProps = (dom, newProps, oldProps, isSvg, hydrate) => {
//         let i;
//         for (i in oldProps) if (!(i in newProps)) setProperty(dom, i, null, oldProps[i], isSvg);
//         for (i in newProps) {
//             if ((!hydrate || typeof newProps[i] == 'function') && i !== 'value' && i !== 'checked' && oldProps[i] !== newProps[i]) {
//                 setProperty(dom, i, newProps[i], oldProps[i], isSvg);
//             }
//         }
//     },
//
//     setStyle = (style, key, value) => {
//         if (key[0] === '-') style.setProperty(key, value);
//         else style[key] = isNum(value)
//         && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value == null ? '' : value;
//     },
//
//     setProperty = (dom, name, value, oldValue, isSvg) => {
//         name = isSvg ? name === 'className' ? 'class' : name : name === 'class' ? 'className' : name;
//         if (name === 'key' || name === 'children') {
//         } else if (name === 'style') {
//             const s = dom.style;
//             if (isString(value)) s.cssText = value;
//             else {
//                 if (isString(oldValue)) (s.cssText = '', oldValue = null);
//                 if (oldValue) for (let i in oldValue) if (!(value && i in value)) setStyle(s, i, '');
//                 if (value) for (let i in value) if (!oldValue || value[i] !== oldValue[i]) setStyle(s, i, value[i]);
//             }
//         } else if (name[0] === 'o' && name[1] === 'n') {
//             let useCapture = name !== (name = name.replace(/Capture$/, ''));
//             let nameLower = name.toLowerCase();
//             name = (nameLower in dom ? nameLower : name).slice(2);
//             if (value) {
//                 if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
//                 (dom._listeners || (dom._listeners = {}))[name] = value;
//             } else dom.removeEventListener(name, eventProxy, useCapture);
//         } else if (name !== 'list' && name !== 'tagName'
//             && name !== 'form' && !isSvg && name in dom) {
//             dom[name] = value == null ? '' : value;
//         } else if (!isFunc(value) && name !== 'dangerouslySetInnerHTML') {
//             if (name !== (name = name.replace(/^xlink:?/, ''))) {
//                 if (value == null || value === false) dom.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
//                 else dom.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
//             } else if (value == null || value === false) dom.removeAttribute(name);
//             else dom.setAttribute(name, value);
//         }
//     },
//     unmount = (vnode, parentVNode, skipRemove) => {
//         let r;
//         if (r = vnode.ref) applyRef(r, null, parentVNode);
//         let dom;
//         if (!skipRemove && !isFunc(vnode.type)) skipRemove = (dom = vnode._dom) != null;
//         vnode._dom = vnode._lastDomChild = null;
//         if ((r = vnode._component) != null) {
//             r.base = r._parentDom = null;
//         }
//         if (r = vnode._children) for (let i = 0; i < r.length; i++) if (r[i]) unmount(r[i], parentVNode, skipRemove);
//         if (dom != null) removeNode(dom);
//     },
//     diffChildren = (parentDom, newParentVNode, oldParentVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating) => {
//         let i, j, oldVNode, newDom, sibDom, firstChildDom, refs;
//         let oldChildren = oldParentVNode && oldParentVNode._children || EMPTY_ARR;
//         let oldChildrenLength = oldChildren.length;
//
//         if (oldDom == EMPTY_OBJ) {
//             if (excessDomChildren != null) oldDom = excessDomChildren[0];
//             else if (oldChildrenLength) oldDom = getDomSibling(oldParentVNode, 0);
//             else oldDom = null;
//         }
//
//         i = 0;
//         newParentVNode._children = toChildArray(newParentVNode._children, childVNode => {
//             if (childVNode != null) {
//                 childVNode._parent = newParentVNode;
//                 childVNode._depth = newParentVNode._depth + 1;
//                 oldVNode = oldChildren[i];
//                 if (oldVNode === null || oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
//                     oldChildren[i] = undefined;
//                 } else {
//                     for (j = 0; j < oldChildrenLength; j++) {
//                         oldVNode = oldChildren[j];
//                         if (oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
//                             oldChildren[j] = undefined;
//                             break;
//                         }
//                         oldVNode = null;
//                     }
//                 }
//                 oldVNode = oldVNode || EMPTY_OBJ;
//                 newDom = diff(parentDom, childVNode, oldVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating);
//
//                 if ((j = childVNode.ref) && oldVNode.ref != j) (refs || (refs = [])).push(j, newDom, childVNode);
//
//                 if (newDom != null) {
//                     if (firstChildDom == null) firstChildDom = newDom;
//                     if (childVNode._lastDomChild != null) {
//                         newDom = childVNode._lastDomChild;
//                         childVNode._lastDomChild = null;
//                     } else if (excessDomChildren == oldVNode || newDom != oldDom || newDom.parentNode == null) {
//
//                         outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
//                             parentDom.appendChild(newDom);
//                         } else {
//                             for (sibDom = oldDom, j = 0; (sibDom = sibDom.nextSibling) && j < oldChildrenLength; j += 2) {
//                                 if (sibDom == newDom) {
//                                     break outer;
//                                 }
//                             }
//                             parentDom.insertBefore(newDom, oldDom);
//                         }
//                         if (newParentVNode.type == 'option') parentDom.value = '';
//                     }
//                     oldDom = newDom.nextSibling;
//                     if (isFunc(newParentVNode.type)) newParentVNode._lastDomChild = newDom;
//                 }
//             }
//             i++;
//             return childVNode;
//         });
//
//         newParentVNode._dom = firstChildDom;
//
//         if (excessDomChildren != null && isFunc(newParentVNode.type))
//             for (i = excessDomChildren.length; i--;) if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]);
//         for (i = oldChildrenLength; i--;) if (oldChildren[i] != null)
//             unmount(oldChildren[i], oldChildren[i]);
//
//         if (refs) for (i = 0; i < refs.length; i++) applyRef(refs[i], refs[++i], refs[++i]);
//     },
//
//     diffElementNodes = (dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, isHydrating) => {
//         let i,
//             oldProps = oldVNode.props,
//             newProps = newVNode.props,
//             newVNodeType = newVNode.type;
//
//         isSvg = newVNodeType === 'svg' || isSvg;
//         if (dom == null && excessDomChildren != null) {
//             for (i = 0; i < excessDomChildren.length; i++) {
//                 const child = excessDomChildren[i];
//                 if (child != null && (newVNodeType === null ? child.nodeType === 3 : child.localName === newVNodeType)) {
//                     dom = child;
//                     excessDomChildren[i] = null;
//                     break;
//                 }
//             }
//         }
//         if (dom == null) {
//
//             if (newVNodeType === null) return document.createTextNode(newProps);
//             dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', newVNodeType) : document.createElement(newVNodeType);
//             excessDomChildren = null;
//         }
//
//         if (newVNodeType === null) {
//             if (excessDomChildren != null) excessDomChildren[excessDomChildren.indexOf(dom)] = null;
//             if (oldProps !== newProps) dom.data = newProps;
//         } else if (newVNode !== oldVNode) {
//             if (excessDomChildren != null) excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
//             oldProps = oldVNode.props || EMPTY_OBJ;
//             let oldHtml = oldProps.dangerouslySetInnerHTML;
//             let newHtml = newProps.dangerouslySetInnerHTML;
//             if (!isHydrating) {
//                 if (oldProps === EMPTY_OBJ) {
//                     oldProps = {};
//                     for (let i = 0; i < dom.attributes.length; i++) oldProps[dom.attributes[i].name] = dom.attributes[i].value;
//                 }
//                 if (newHtml || oldHtml) {
//                     if (!newHtml || !oldHtml || newHtml.__html != oldHtml.__html) dom.innerHTML = newHtml && newHtml.__html || '';
//                 }
//             }
//             diffProps(dom, newProps, oldProps, isSvg, isHydrating);
//             newVNode._children = newVNode.props.children;
//             if (!newHtml) {
//                 diffChildren(
//                     dom, newVNode, oldVNode, context, newVNodeType === 'foreignObject' ? false : isSvg,
//                     excessDomChildren, mounts, EMPTY_OBJ, isHydrating
//                 );
//             }
//             if ('value' in newProps && newProps.value !== undefined && newProps.value !== dom.value) dom.value = newProps.value == null ? '' : newProps.value;
//             if ('checked' in newProps && newProps.checked !== undefined && newProps.checked !== dom.checked) dom.checked = newProps.checked;
//
//         }
//         return dom;
//     },
//     diff = (parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating) => {
//         let tmp, newType = newVNode.type;
//         if (newVNode.constructor !== undefined) return null;
//         if (isFunc(newType)) {
//             let newProps = newVNode.props;
//             newVNode._component = newType;
//             tmp = newType(newProps);
//             let isTopLevelFragment = tmp != null && tmp.type == Fragment && tmp.key == null;
//             newVNode._children = toChildArray(isTopLevelFragment ? tmp.props.children : tmp);
//             diffChildren(parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, oldDom, isHydrating);
//         } else {
//             newVNode._dom = diffElementNodes(oldVNode._dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, isHydrating);
//         }
//         return newVNode._dom;
//     }
//
// function createElement(type, props, children) {
//     props = assign({}, props);
//     if (arguments.length > 3) {
//         children = [children];
//         for (let i = 3; i < arguments.length; i++) children.push(arguments[i]);
//     }
//     if (children != null) props.children = children;
//     let ref = props.ref, key = props.key;
//     if (ref != null) delete props.ref;
//     if (key != null) delete props.key;
//     return createVNode(type, props, key, ref);
// }
//
// function render(vnode, parentDom) {
//     let oldVNode = parentDom._children;
//     vnode = createElement(Fragment, null, [vnode]);
//     let mounts = [];
//     diff(
//         parentDom,
//         parentDom._children = vnode,
//         oldVNode || EMPTY_OBJ,
//         EMPTY_OBJ,
//         parentDom.ownerSVGElement !== undefined,
//         oldVNode ? null : EMPTY_ARR.slice.call(parentDom.childNodes),
//         mounts,
//         EMPTY_OBJ,
//     );
// }
//
// export {Fragment, createElement as h, render, toChildArray, setProperty};