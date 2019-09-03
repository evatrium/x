import { isObj, isArray, isFunc, removeListener, addListener, isString, extend, def } from '@iosio/util';
import { obi } from '@iosio/obi';

let d = document,
    createElement = elem => d.createElement(elem),
    appendChild = (node, child) => node.appendChild(child),
    createTextNode = text => d.createTextNode(text),

/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
styleSheet = mount => {
  let style = createElement('style');
  appendChild(style, createTextNode(""));
  appendChild(mount || d.head, style);
  return css => (appendChild(style, createTextNode(css)), style);
},
    globalStyles = styleSheet(),
    webComponentVisibilityStyleSheet = styleSheet(),
    webComponentVisibility = tag => webComponentVisibilityStyleSheet(`${tag} {visibility:hidden}`),

/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
formatType = (value, type) => {
  type = type || String;

  try {
    if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);else if (typeof value == "string") {
      value = type == Number ? Number(value) : type == Object || type == Array ? JSON.parse(value) : value;
    }
    if ({}.toString.call(value) == `[object ${type.name}]`) return {
      value,
      error: type == Number && Number.isNaN(value)
    };
  } catch (e) {}

  return {
    value,
    error: true
  };
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
  value === null || value === false ? node.removeAttribute(attr) : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
},
    propToAttr = prop => prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
    attrToProp = attr => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

webComponentVisibilityStyleSheet(` .___ {visibility: inherit;}`, true);

var removeChild = (parent, child) => parent.removeChild(child),
    insertBefore = (parent, node, targetNode) => parent.insertBefore(node, targetNode),
    toLowerCase = toLower => toLower.toLowerCase(),
    RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map,
    //fragment type for host node
FRAGMENT_TYPE = '#document-fragment',
    Fragment = (props, children) => children,
    merge = (a, b, out) => {
  out = {};

  for (var k in a) out[k] = a[k];

  for (var k in b) out[k] = b[k];

  return out;
},
    listener = function (event) {
  this.handlers[event.type](event);
},

/* used inside web component disconnect callback*/
removeHandlers = dom => {
  [].concat(...dom.childNodes).forEach(c => {
    if (c.handlers) for (let k in c.handlers) removeListener(c, k, listener);
    removeHandlers(c);
  });
},

/* ------------preact's style property */
IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,
    setStyle = (style, key, value) => {
  key[0] === '-' ? style.setProperty(key, value) : style[key] = typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value;
},
    styleNode = (dom, value, oldValue, _s) => {
  _s = dom.style;
  if (isString(value)) return _s.cssText = value;
  if (isString(oldValue)) _s.cssText = '', oldValue = null;
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
parseClassList = value => !value ? [] : value.split(/\s+/).filter(c => c),
    updateClassList = (node, value, action) => parseClassList(isObj(value) ? cnObj(value) : value).forEach(cls => node.classList[action](cls)),
    patchProperty = (node, key, oldValue, newValue, isSvg) => {
  if (key === "key") ; else if (isFunc(newValue) && key.startsWith('on') && !(key in node)) {
    /*
        referencing stencil's set accessor functionality for many kinds of 'on'-event names
        cuz "custom" event names defined by the user within web components may also start with 'on' like onMyCustomEvent
        https://github.com/ionic-team/stencil/blob/master/src/runtime/vdom/set-accessor.ts
     */
    let eventType = toLowerCase(key) in node ? toLowerCase(key.slice(2)) : toLowerCase(key[2]) + key.substring(3);
    if (!((node.handlers || (node.handlers = {}))[key = eventType] = newValue)) removeListener(node, key, listener);else if (!oldValue) addListener(node, key, listener);
  } else if (key === 'ref' && isFunc(newValue)) newValue(node);else if (key === 'style') styleNode(node, newValue, oldValue);else if (key === 'className' || key === 'class') {
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
  } else if (!isSvg && key !== "list" && key in node) node[key] = newValue == null ? "" : newValue;else updateAttribute(node, key, newValue);
},
    createNode = (vnode, isSvg) => {
  var node = vnode.type === TEXT_NODE ? createTextNode(vnode.name) : (isSvg = isSvg || vnode.name === "svg") ? d.createElementNS("http://www.w3.org/2000/svg", vnode.name)
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
  : vnode.name === '#document-fragment' ? d.createDocumentFragment() : createElement(vnode.name),
      props = vnode.props;

  for (var k in props) patchProperty(node, k, null, props[k], isSvg);

  for (var i = 0, len = vnode.children.length; i < len; i++) appendChild(node, createNode(vnode.children[i], isSvg));

  return vnode.node = node;
},
    getKey = vnode => vnode == null ? null : vnode.key,

/*
   Looked at Atomico's code (which uses vdom in web components) and noticed the destroy method
   on the web component base component. Since its the shadow dom, it may be possible that the child
   nodes aren't being looked over???? checked the handlers and they were'nt being removed so i added
   this to clean things up.
 */
destroy = dom => (dom._destroy && dom._destroy(dom), dom),
    patchNode = (parent, node, oldVNode, newVNode, isSvg) => {
  if (oldVNode === newVNode) ; else if (oldVNode != null && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name;
  } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
    node = insertBefore(parent, createNode(newVNode, isSvg), node);
    if (oldVNode != null) removeChild(parent, destroy(oldVNode.node));
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
      let _old = oldVProps[key],
          _new = newVProps[key];

      if ((['value', 'selected', 'checked'].includes(key) ? node[key] : _old) !== _new) {
        patchProperty(node, key, _old, _new, isSvg);
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldHead])) == null || oldKey !== getKey(newVKids[newHead])) {
        break;
      }

      patchNode(node, oldVKids[oldHead].node, oldVKids[oldHead++], newVKids[newHead++], isSvg);
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldTail])) == null || oldKey !== getKey(newVKids[newTail])) {
        break;
      }

      patchNode(node, oldVKids[oldTail].node, oldVKids[oldTail--], newVKids[newTail--], isSvg);
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        insertBefore(node, createNode(newVKids[newHead++], isSvg), (oldVKid = oldVKids[oldHead]) && oldVKid.node);
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        removeChild(node, destroy(oldVKids[oldHead++].node));
      }
    } else {
      for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey(oldVKid = oldVKids[oldHead]);
        newKey = getKey(newVKids[newHead]);

        if (newKeyed[oldKey] || newKey != null && newKey === getKey(oldVKids[oldHead + 1])) {
          if (oldKey == null) removeChild(node, destroy(oldVKid.node));
          oldHead++;
          continue;
        }

        if (newKey == null || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            patchNode(node, oldVKid && oldVKid.node, oldVKid, newVKids[newHead], isSvg);
            newHead++;
          }

          oldHead++;
        } else {
          if (oldKey === newKey) {
            patchNode(node, oldVKid.node, oldVKid, newVKids[newHead], isSvg);
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patchNode(node, insertBefore(node, tmpVKid.node, oldVKid && oldVKid.node), tmpVKid, newVKids[newHead], isSvg);
              newKeyed[newKey] = true;
            } else {
              patchNode(node, oldVKid && oldVKid.node, null, newVKids[newHead], isSvg);
            }
          }

          newHead++;
        }
      }

      while (oldHead <= oldTail) if (getKey(oldVKid = oldVKids[oldHead++]) == null) removeChild(node, destroy(oldVKid.node));

      for (var i in keyed) if (newKeyed[i] == null) removeChild(node, destroy(keyed[i].node));
    }
  }

  return newVNode.node = node;
},
    createVNode = (name, props, children, node, key, type) => ({
  name,
  props,
  children,
  node,
  type,
  key
}),
    createTextVNode = (value, node) => createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE),
    recycleNode = node => node.nodeType === TEXT_NODE ? createTextVNode(node.nodeValue, node) : createVNode(toLowerCase(node.nodeName), EMPTY_OBJ, map.call(node.childNodes, recycleNode), node, null, RECYCLED_NODE),
    patch = (node, vdom) => ((node = patchNode(node.parentNode, node, node.vdom || recycleNode(node), vdom)).vdom = vdom, node),
    h = function (name, props) {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) rest.push(arguments[i]);

  while (rest.length > 0) {
    if (isArray(vnode = rest.pop())) {
      for (var i = vnode.length; i-- > 0;) rest.push(vnode[i]);
    } else if (vnode === false || vnode === true || vnode == null) ; else children.push(isObj(vnode) ? vnode : createTextVNode(vnode));
  }

  props = props || EMPTY_OBJ;
  return isFunc(name) ? name(props, children) : createVNode(name, props, children, null, props.key);
};

let PROPS = Symbol(),
    // PROPS = 'props',
IGNORE_ATTR = Symbol(),
    context = {}; // let shady = window.ShadyCSS;
// --- yeah, prop not gonna even bother with internet explorer...
// styles can't be dynamically updated in the render func, the docs say to use custom properties only

/*  heavily inspired by atomico, stencil, preact and superfine */

class Xelement extends HTMLElement {
  constructor() {
    super();
    this.context = context;
    this._unsubs = [];
    this._hostElementProps = {};
    this.state = {};

    this.Host = (props, children) => {
      this._usingFrag = true;

      for (let key in merge(props, this._hostElementProps)) patchProperty(this, key, this._hostElementProps[key], props[key]);

      this._hostElementProps = props;
      return h(FRAGMENT_TYPE, {}, children);
    };

    this.setState = nextState => {
      extend(this.state, isFunc(nextState) ? nextState(this.state) : nextState || {});
      this.update();
    };

    this.observeObi = (...obis) => obis.forEach(obi => obi.$onChange && this._unsubs.push(obi.$onChange(this.update)));

    this.update = () => {
      if (!this._process) {
        this._process = this._mounted.then(next => {
          next = [extend({
            Host: this.Host
          }, this[PROPS]), this.state, this.context];
          !this._has_mounted ? this._initialRender(...next) : this._subsequentRender(...next); // shady && shady.styleSubtree(this);

          this._process = false;
        });
      }

      return this._process;
    };

    this._initialRender = (...next) => {
      this.willRender(...next);
      let results = this.render(...next),
          mountPoint = createElement(this._usingFrag ? 'template' : results.name);
      appendChild(this._root, mountPoint);
      this._base = patch(this._usingFrag ? this._root : mountPoint, results);
      setTimeout(() => {
        this.classList.add('___');
        this.didRender(...next);

        this._unsubs.push(this.lifeCycle(...next));
      });
      this._has_mounted = true;
    };

    this._subsequentRender = (...next) => {
      if (!this.willRender()) {
        // returning true will prevent re render
        patch(this._usingFrag ? this._root : this._base, this.render(...next));
        this.didRender();
      }
    };

    this.emit = (name, detail, from) => (from || this).dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));

    this._destroy = dom => {
      dom && removeHandlers(dom);

      this._unsubs.forEach(fn => fn && fn());

      this._destroyed = true;
    };

    this[PROPS] = {};
    this.render = this.render.bind(this);
    this._mounted = new Promise(mount => this._mount = mount);
    this.update();
    let {
      _initAttrs
    } = this.constructor;
    let length = _initAttrs.length;

    while (length--) _initAttrs[length](this);
  }

  connectedCallback() {
    if (this._has_mounted) return; // shady && shady.styleElement(this);

    this.attachShadow({
      mode: 'open'
    });
    this._root = this.shadowRoot || this;
    this.state.$onChange && this._unsubs.push(this.state.$onChange(this.update));
    this.observe && this.observeObi(this.observe);

    this._mount();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === this[IGNORE_ATTR] || oldValue === newValue) return;
    this[attrToProp(attr)] = newValue;
  }

  static get observedAttributes() {
    let {
      propTypes,
      prototype
    } = this;
    this._initAttrs = [];
    if (!propTypes) return [];
    return Object.keys(propTypes).map(prop => {
      let attr = propToAttr(prop),
          schema = propTypes[prop].name ? {
        type: propTypes[prop]
      } : propTypes[prop];

      if (!(prop in prototype)) {
        def(prototype, prop, {
          get() {
            return this[PROPS][prop];
          },

          set(nextValue) {
            let {
              value,
              error
            } = formatType(nextValue, schema.type);
            if (error && value != null) throw `[${prop}] must be type [${schema.type.name}]`;
            if (value === this[PROPS][prop]) return;

            if (schema.reflect) {
              this._mounted.then(() => {
                this[IGNORE_ATTR] = attr;
                updateAttribute(this, attr, schema.type === Boolean && !value ? null : value);
                this[IGNORE_ATTR] = false;
              });
            }

            this[PROPS][prop] = value;
            this.update();
          }

        });
      }

      schema.value && this._initAttrs.push(self => self[prop] = schema.value);
      return attr;
    });
  }

  lifeCycle() {}

  willRender() {}

  render() {}

  didRender() {}

  disconnectedCallback() {
    !this._destroyed && this._destroy();
  }

}

const element = (tag, component, propTypes) => {
  var _class, _temp;

  webComponentVisibility(tag);
  customElements.define(tag, component.prototype instanceof Xelement ? component : (_temp = _class = class extends Xelement {
    constructor(...args) {
      super(...args);
      this.render = component;
    }

  }, _class.propTypes = propTypes, _temp));
  return (props, children) => h(tag, props, children);
},
      x = (tag, component, propTypes) => element('x-' + tag, component, propTypes);

const provide = (namespace, attach) => {
  let obj = isFunc(attach) ? obi(attach(context)) : isObj(attach) ? obi(attach) : attach;
  return context[namespace] = obj, obj;
};

export { Fragment, Xelement, context, element, globalStyles, h, provide, x };