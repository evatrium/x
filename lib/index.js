'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var d = document,
    createElement = function createElement(elem) {
  return d.createElement(elem);
},
    appendChild = function appendChild(node, child) {
  return node.appendChild(child);
},
    createTextNode = function createTextNode(text) {
  return d.createTextNode(text);
},

/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
styleSheet = function styleSheet(mount) {
  var style = createElement('style');
  appendChild(style, createTextNode(""));
  appendChild(mount || d.head, style);
  return function (css) {
    return appendChild(style, createTextNode(css)), style;
  };
},
    globalStyles = styleSheet(),
    webComponentVisibilityStyleSheet = styleSheet(),
    webComponentVisibility = function webComponentVisibility(tag) {
  return webComponentVisibilityStyleSheet("".concat(tag, " {visibility:hidden}"));
},

/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
formatType = function formatType(value, type) {
  type = type || String;

  try {
    if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);else if (typeof value == "string") {
      value = type == Number ? Number(value) : type == Object || type == Array ? JSON.parse(value) : value;
    }
    if ({}.toString.call(value) == "[object ".concat(type.name, "]")) return {
      value: value,
      error: type == Number && Number.isNaN(value)
    };
  } catch (e) {}

  return {
    value: value,
    error: true
  };
},
    isCustomElement = function isCustomElement(el, isAttr) {
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
updateAttribute = function updateAttribute(node, attr, value) {
  value === null || value === false ? node.removeAttribute(attr) : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
},
    propToAttr = function propToAttr(prop) {
  return prop.replace(/([A-Z])/g, "-$1").toLowerCase();
},
    attrToProp = function attrToProp(attr) {
  return attr.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
},
    isArray = Array.isArray,
    isObj = function isObj(thing) {
  return Object.prototype.toString.call(thing) === '[object Object]';
},
    isFunc = function isFunc(thing) {
  return typeof thing === 'function';
},
    isString = function isString(thing) {
  return typeof thing === 'string';
},
    addListener = function addListener(to, ev, cb) {
  return to.addEventListener(ev, cb);
},
    removeListener = function removeListener(from, ev, cb) {
  return from.removeEventListener(ev, cb);
},
    def = function def(obj, prop, handlers) {
  return Object.defineProperty(obj, prop, handlers);
},
    extend = function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
},
    asdf = '!@#$!@#$!@#$!@#$!@#$';

console.log(asdf);
webComponentVisibilityStyleSheet(" .___ {visibility: inherit;}", true);

var removeChild = function removeChild(parent, child) {
  return parent.removeChild(child);
},
    insertBefore = function insertBefore(parent, node, targetNode) {
  return parent.insertBefore(node, targetNode);
},
    toLowerCase = function toLowerCase(toLower) {
  return toLower.toLowerCase();
},
    RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map,
    NULL = null,
    //fragment type for host node
HOST_TYPE = '#document-fragment',
    Fragment = function Fragment(props, children) {
  return children;
},
    merge = function merge(a, b, out) {
  out = {};

  for (var k in a) {
    out[k] = a[k];
  }

  for (var k in b) {
    out[k] = b[k];
  }

  return out;
},
    listener = function listener(event) {
  this.handlers[event.type](event);
},

/* used inside web component disconnect callback*/
removeHandlers = function removeHandlers(dom) {
  var _ref;

  (_ref = []).concat.apply(_ref, _toConsumableArray(dom.childNodes)).forEach(function (c) {
    if (c.handlers) for (var k in c.handlers) {
      removeListener(c, k, listener);
    }
    removeHandlers(c);
  });
},

/* ------------ preact's style property */
IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,
    setStyle = function setStyle(style, key, value) {
  key[0] === '-' ? style.setProperty(key, value) : style[key] = typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value;
},
    styleNode = function styleNode(dom, value, oldValue, _s) {
  _s = dom.style;
  if (isString(value)) return _s.cssText = value;
  if (isString(oldValue)) _s.cssText = '', oldValue = NULL;
  if (oldValue) for (var i in oldValue) {
    if (!(value && i in value)) setStyle(_s, i, '');
  }
  if (value) for (var _i in value) {
    if (!oldValue || value[_i] !== oldValue[_i]) setStyle(_s, _i, value[_i]);
  }
},

/* ------------ */
// i like how stencil has this built in so i figured id try to include it here
// optionally pass objects to className for easy conditional classes ex: className={{activeClassName: someBooleanVariable}}
cnObj = function cnObj(obj, out) {
  out = "";

  for (var k in obj) {
    if (obj[k]) out += (out && " ") + k;
  }

  return out;
},
    // split the classNames up into an array and filter them
parseClassList = function parseClassList(value) {
  return !value ? [] : value.split(/\s+/).filter(function (c) {
    return c;
  });
},
    updateClassList = function updateClassList(node, value, action) {
  return parseClassList(isObj(value) ? cnObj(value) : value).forEach(function (cls) {
    return node.classList[action](cls);
  });
},
    patchProperty = function patchProperty(node, key, oldValue, newValue, isSvg) {
  if (key === "key") ; else if (isFunc(newValue) && key.startsWith('on') && !(key in node)) {
    /*
        referencing stencil's set accessor functionality for many kinds of 'on'-event names
        cuz "custom" event names defined by the user within web components may also start with 'on' like onMyCustomEvent
        https://github.com/ionic-team/stencil/blob/master/src/runtime/vdom/set-accessor.ts
     */
    var eventType = toLowerCase(key) in node ? toLowerCase(key.slice(2)) : toLowerCase(key[2]) + key.substring(3);
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
  } else if (!isSvg && key !== "list" && key in node) node[key] = newValue == NULL ? "" : newValue;else updateAttribute(node, key, newValue);
},
    createNode = function createNode(vnode, isSvg) {
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
  : vnode.name === HOST_TYPE ? d.createDocumentFragment() : createElement(vnode.name),
      props = vnode.props;

  for (var k in props) {
    patchProperty(node, k, NULL, props[k], isSvg);
  }

  for (var i = 0, len = vnode.children.length; i < len; i++) {
    appendChild(node, createNode(vnode.children[i], isSvg));
  }

  return vnode.node = node;
},
    getKey = function getKey(vnode) {
  return vnode == NULL ? NULL : vnode.key;
},

/*
   Looked at Atomico's code (which uses vdom in web components) and noticed the destroy method
   on the web component base component. Since its the shadow dom, it may be possible that the child
   nodes aren't being looked over???? checked the handlers and they were'nt being removed so i added
   this to clean things up.
 */
destroy = function destroy(dom) {
  return dom._destroy && dom._destroy(dom), dom;
},
    patchNode = function patchNode(parent, node, oldVNode, newVNode, isSvg) {
  if (oldVNode === newVNode) ; else if (oldVNode != NULL && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name;
  } else if (oldVNode == NULL || oldVNode.name !== newVNode.name) {
    node = insertBefore(parent, createNode(newVNode, isSvg), node);
    if (oldVNode != NULL) removeChild(parent, destroy(oldVNode.node));
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
      var _old = oldVProps[key],
          _new = newVProps[key];

      if ((['value', 'selected', 'checked'].includes(key) ? node[key] : _old) !== _new) {
        patchProperty(node, key, _old, _new, isSvg);
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldHead])) == NULL || oldKey !== getKey(newVKids[newHead])) {
        break;
      }

      patchNode(node, oldVKids[oldHead].node, oldVKids[oldHead++], newVKids[newHead++], isSvg);
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldTail])) == NULL || oldKey !== getKey(newVKids[newTail])) {
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
        if ((oldKey = oldVKids[i].key) != NULL) {
          keyed[oldKey] = oldVKids[i];
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey(oldVKid = oldVKids[oldHead]);
        newKey = getKey(newVKids[newHead]);

        if (newKeyed[oldKey] || newKey != NULL && newKey === getKey(oldVKids[oldHead + 1])) {
          if (oldKey == NULL) removeChild(node, destroy(oldVKid.node));
          oldHead++;
          continue;
        }

        if (newKey == NULL || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == NULL) {
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
            if ((tmpVKid = keyed[newKey]) != NULL) {
              patchNode(node, insertBefore(node, tmpVKid.node, oldVKid && oldVKid.node), tmpVKid, newVKids[newHead], isSvg);
              newKeyed[newKey] = true;
            } else {
              patchNode(node, oldVKid && oldVKid.node, NULL, newVKids[newHead], isSvg);
            }
          }

          newHead++;
        }
      }

      while (oldHead <= oldTail) {
        if (getKey(oldVKid = oldVKids[oldHead++]) == NULL) removeChild(node, destroy(oldVKid.node));
      }

      for (var i in keyed) {
        if (newKeyed[i] == NULL) removeChild(node, destroy(keyed[i].node));
      }
    }
  }

  return newVNode.node = node;
},
    createVNode = function createVNode(name, props, children, node, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    node: node,
    type: type,
    key: key
  };
},
    createTextVNode = function createTextVNode(value, node) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, NULL, TEXT_NODE);
},
    recycleNode = function recycleNode(node) {
  return node.nodeType === TEXT_NODE ? createTextVNode(node.nodeValue, node) : createVNode(toLowerCase(node.nodeName), EMPTY_OBJ, map.call(node.childNodes, recycleNode), node, NULL, RECYCLED_NODE);
},
    patch = function patch(node, vdom) {
  return (node = patchNode(node.parentNode, node, node.vdom || recycleNode(node), vdom)).vdom = vdom, node;
},
    h = function h(name, props) {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) {
    rest.push(arguments[i]);
  }

  while (rest.length > 0) {
    if (isArray(vnode = rest.pop())) {
      for (var i = vnode.length; i-- > 0;) {
        rest.push(vnode[i]);
      }
    } else if (vnode === false || vnode === true || vnode == NULL) ; else children.push(isObj(vnode) ? vnode : createTextVNode(vnode));
  }

  props = props || EMPTY_OBJ;
  return isFunc(name) ? name(props, children) : createVNode(name, props, children, NULL, props.key);
};

var PROPS = Symbol(),
    // PROPS = 'props',
IGNORE_ATTR = Symbol(),
    context = {}; // let shady = window.ShadyCSS;
// --- yeah, prop not gonna even bother with internet explorer...
// styles can't be dynamically updated in the render func, the docs say to use custom properties only

/*  inspiration driven by superfine, atomico, stencil, preact and open-wc */

var Xelement =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(Xelement, _HTMLElement);

  function Xelement() {
    var _this;

    _classCallCheck(this, Xelement);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Xelement).call(this));
    _this.context = context;
    _this._unsubs = [];
    _this._hostProps = {};
    _this.state = {};

    _this.Host = function (props, children) {
      _this._usingFrag = true;
      var merged = merge(_this._hostProps, props);

      if (Object.keys(merged).length) {
        for (var key in merged) {
          patchProperty(_assertThisInitialized(_this), key, _this._hostProps[key], props[key]);
        }
      }

      _this._hostProps = props;
      return h(HOST_TYPE, {}, children);
    };

    _this.setState = function (nextState) {
      extend(_this.state, isFunc(nextState) ? nextState(_this.state) : nextState || {});

      _this.update();
    };

    _this.observeObi = function () {
      for (var _len = arguments.length, obis = new Array(_len), _key = 0; _key < _len; _key++) {
        obis[_key] = arguments[_key];
      }

      return obis.forEach(function (obi) {
        return obi.$onChange && _this._unsubs.push(obi.$onChange(_this.update));
      });
    };

    _this.update = function () {
      if (!_this._process) {
        _this._process = _this._mounted.then(function (next) {
          var _this2, _this3;

          next = [extend({
            Host: _this.Host
          }, _this[PROPS]), _this.state, _this.context];
          !_this._has_mounted ? (_this2 = _this)._initialRender.apply(_this2, _toConsumableArray(next)) : (_this3 = _this)._subsequentRender.apply(_this3, _toConsumableArray(next)); // shady && shady.styleSubtree(this);

          _this._process = false;
        });
      }

      return _this._process;
    };

    _this._initialRender = function () {
      var _this4, _this5, _this6;

      (_this4 = _this).willRender.apply(_this4, arguments);

      var results = (_this5 = _this).render.apply(_this5, arguments),
          mountPoint = createElement(_this._usingFrag ? 'template' : results.name);

      appendChild(_this._root, mountPoint);
      _this._base = patch(_this._usingFrag ? _this._root : mountPoint, results);

      (_this6 = _this).didRender.apply(_this6, arguments);

      _this._has_mounted = true;

      var postInitial = function postInitial() {
        _this._unsubs.push(_this.lifeCycle());
        /*
         inspired by stencil.js - adding visibility inherit next tick after render will prevent flash of un-styled content.
         Removing this functionality during testing makes life easier
        */


         _this.classList.add('___');
      };

       setTimeout(postInitial) ;
    };

    _this._subsequentRender = function () {
      var _this7;

      var shouldRerender = _this.willRender(); // returning a falsy value other than undefined will prevent rerender


      if (!shouldRerender && shouldRerender !== undefined) return;
      patch(_this._usingFrag ? _this._root : _this._base, (_this7 = _this).render.apply(_this7, arguments));

      _this.didRender();
    };

    _this._destroy = function (dom) {
      dom && removeHandlers(dom);

      _this._unsubs.forEach(function (fn) {
        return fn && fn();
      });

      _this._destroyed = true;
    };

    _this.attachShadow({
      mode: 'open'
    });

    _this._root = _this.shadowRoot || _assertThisInitialized(_this);
    _this[PROPS] = {};
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this._mounted = new Promise(function (mount) {
      return _this._mount = mount;
    });

    _this.update();

    var _initAttrs = _this.constructor._initAttrs;
    var length = _initAttrs.length;

    while (length--) {
      _initAttrs[length](_assertThisInitialized(_this));
    }

    return _this;
  }

  _createClass(Xelement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      console.log('ive connected!!!', this._has_mounted, this.isConnected);
      if (this._has_mounted) return; // shady && shady.styleElement(this);

      this.state.$onChange && this._unsubs.push(this.state.$onChange(this.update));
      this.observe && this.observeObi(this.observe);

      this._mount();
    }
  }, {
    key: "adoptedCallback",
    value: function adoptedCallback() {
      console.log('ive been adopted!!');
    }
  }, {
    key: "attributeChangedCallback",
    //
    // emit = (name, detail, from) =>
    //     (from || this).dispatchEvent(
    //         new CustomEvent(name, {detail, bubbles: true, composed: true})
    //     );
    value: function attributeChangedCallback(attr, oldValue, newValue) {
      if (attr === this[IGNORE_ATTR] || oldValue === newValue) return;
      this[attrToProp(attr)] = newValue;
    }
    /* inspired by atomico  */

  }, {
    key: "lifeCycle",
    value: function lifeCycle() {}
  }, {
    key: "willRender",
    value: function willRender() {}
  }, {
    key: "render",
    value: function render() {}
  }, {
    key: "didRender",
    value: function didRender() {}
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      !this._destroyed && this._destroy();
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      var _this8 = this;

      var propTypes = this.propTypes,
          prototype = this.prototype;
      this._initAttrs = [];
      if (!propTypes) return [];
      return Object.keys(propTypes).map(function (prop) {
        var attr = propToAttr(prop),
            schema = propTypes[prop].name ? {
          type: propTypes[prop]
        } : propTypes[prop];

        if (!(prop in prototype)) {
          def(prototype, prop, {
            get: function get() {
              return this[PROPS][prop];
            },
            set: function set(nextValue) {
              var _this9 = this;

              var _formatType = formatType(nextValue, schema.type),
                  value = _formatType.value,
                  error = _formatType.error;

              if (error && value != null) throw "[".concat(prop, "] must be type [").concat(schema.type.name, "]");
              if (value === this[PROPS][prop]) return;

              if (schema.reflect) {
                this._mounted.then(function () {
                  _this9[IGNORE_ATTR] = attr;
                  updateAttribute(_this9, attr, schema.type === Boolean && !value ? null : value);
                  _this9[IGNORE_ATTR] = false;
                });
              }

              this[PROPS][prop] = value;
              this.update();
            }
          });
        }

        schema.value && _this8._initAttrs.push(function (self) {
          return self[prop] = schema.value;
        });
        return attr;
      });
    }
  }]);

  return Xelement;
}(_wrapNativeSuper(HTMLElement));

var element = function element(tag, component, propTypes) {
  var _class, _temp;

  webComponentVisibility(tag);
  customElements.define(tag, component.prototype instanceof Xelement ? component : (_temp = _class =
  /*#__PURE__*/
  function (_Xelement) {
    _inherits(_class, _Xelement);

    function _class() {
      var _getPrototypeOf2;

      var _this10;

      _classCallCheck(this, _class);

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this10 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this10.render = component;
      return _this10;
    }

    return _class;
  }(Xelement), _class.propTypes = propTypes, _temp));
  return function (props, children) {
    return h(tag, props, children);
  };
},
    x = function x(tag, component, propTypes) {
  return element('x-' + tag, component, propTypes);
};
/**
 *
 *  abandoning the use of superfine (above) in favor of preact... see the pwc repo
 *  bellow verifies that preact works
 *  will be continuing dev in my pwc (preact web component) repo
 */
//
// import {
//     formatType,
//     updateAttribute,
//     propToAttr,
//     attrToProp,
//     webComponentVisibility,
//     createElement,
//     appendChild,
//     TEST_ENV,
//     def, extend, isFunc
// } from "../src/utils";
// import {h, render, Fragment, Component} from "preact";
//
// import { patch, removeHandlers, HOST_TYPE, patchProperty, merge} from "./vdom";
//
// let PROPS = Symbol(),
//     // PROPS = 'props',
//     IGNORE_ATTR = Symbol(),
//     context = {};
//
//
// class Xelement extends HTMLElement {
//
//     context = context;
//
//     _unsubs = [];
//
//     _hostProps = {};
//
//     state = {};
//
//     constructor() {
//         super();
//         this.attachShadow({mode: 'open'});
//         this._root = (this.shadowRoot || this);
//         this[PROPS] = {};
//         this.render = this.render.bind(this);
//         this._mounted = new Promise(mount => (this._mount = mount));
//         this.update();
//         let {_initAttrs} = this.constructor;
//         let length = _initAttrs.length;
//         while (length--) _initAttrs[length](this);
//     }
//
//     Host = ({children, ...props}) => {
//         // this._usingFrag = true;
//         // let merged = merge(this._hostProps, props);
//         // if (Object.keys(merged).length) {
//         //     for (let key in merged) patchProperty(this, key, this._hostProps[key], props[key]);
//         // }
//         // this._hostProps = props;
//         // // return h(HOST_TYPE, {}, props.children);
//         return <Fragment>{children}</Fragment>;
//     };
//
//     connectedCallback() {
//         // console.log('ive connected!!!', this._has_mounted, this.isConnected)
//         if (this._has_mounted) return;
//         // shady && shady.styleElement(this);
//         this.state.$onChange && this._unsubs.push(this.state.$onChange(this.update));
//         this.observe && this.observeObi(this.observe);
//         this._mount();
//     }
//
//     setState = (nextState) => {
//         extend(this.state, isFunc(nextState) ? nextState(this.state) : nextState || {});
//         this.update();
//     };
//
//     observeObi = (...obis) =>
//         obis.forEach(obi => obi.$onChange && this._unsubs.push(obi.$onChange(this.update)));
//
//     update = () => {
//         if (!this._process) {
//             this._process = this._mounted.then((next) => {
//                 next = [extend({Host: this.Host}, this[PROPS]), this.state, this.context];
//                 // console.log('has mounted', this._has_mounted);
//                 !this._has_mounted
//                     ? this._initialRender(...next)
//                     : this._subsequentRender(...next);
//                 // shady && shady.styleSubtree(this);
//                 this._process = false;
//             });
//         }
//         return this._process;
//     };
//
//     adoptedCallback(){
//         console.log('ive been adopted!!')
//     }
//
//     _initialRender = (...next) => {
//
//         this.willRender(...next);
//
//         let results =this.render(...next);
//
//
//             render(results, this.shadowRoot);
//
//         // console.log('results', results)
//         this.didRender(...next);
//
//         this._has_mounted = true;
//
//         let postInitial = () => {
//             this._unsubs.push(this.lifeCycle());
//             /*
//              inspired by stencil.js - adding visibility inherit next tick after render will prevent flash of un-styled content.
//              Removing this functionality during testing makes life easier
//             */
//             !TEST_ENV && this.classList.add('___');
//         };
//
//         !TEST_ENV ? requestAnimationFrame(postInitial) : postInitial();
//     };
//
//
//     _subsequentRender = (...next) => {
//         let shouldRerender = this.willRender();// returning a falsy value other than undefined will prevent rerender
//         if (!shouldRerender && shouldRerender !== undefined) return;
//         render(this.render(...next), this._root);
//         this.didRender();
//     };
//     //
//     // emit = (name, detail, from) =>
//     //     (from || this).dispatchEvent(
//     //         new CustomEvent(name, {detail, bubbles: true, composed: true})
//     //     );
//
//     attributeChangedCallback(attr, oldValue, newValue) {
//         if (attr === this[IGNORE_ATTR] || oldValue === newValue) return;
//         this[attrToProp(attr)] = newValue;
//     }
//
//     /* inspired by atomico  */
//     static get observedAttributes() {
//         let {propTypes, prototype} = this;
//         this._initAttrs = [];
//         if (!propTypes) return [];
//         return Object.keys(propTypes).map(prop => {
//             let attr = propToAttr(prop),
//                 schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
//             if (!(prop in prototype)) {
//                 def(prototype, prop, {
//                     get() {
//                         return this[PROPS][prop]
//                     },
//                     set(nextValue) {
//                         let {value, error} = formatType(nextValue, schema.type);
//                         if (error && value != null) throw `[${prop}] must be type [${schema.type.name}]`;
//                         if (value === this[PROPS][prop]) return;
//                         if (schema.reflect) {
//                             this._mounted.then(() => {
//                                 this[IGNORE_ATTR] = attr;
//                                 updateAttribute(this, attr, schema.type === Boolean && !value ? null : value);
//                                 this[IGNORE_ATTR] = false;
//                             });
//                         }
//                         this[PROPS][prop] = value;
//                         this.update();
//                     }
//                 });
//             }
//             schema.value && this._initAttrs.push(self => (self[prop] = schema.value));
//             return attr;
//         });
//     };
//
//     lifeCycle() {
//     }
//
//     willRender() {
//     }
//
//     render() {
//     }
//
//     didRender() {
//     }
//
//     disconnectedCallback() {
//         render(() => null, this._root);
//         this._unsubs.forEach(fn => fn && fn());
//     }
//
//     _destroy = (dom) => {
//         // // dom && removeHandlers(dom);
//         // this._unsubs.forEach(fn => fn && fn());
//         // this._destroyed = true;
//         // render(() => null, this._root);
//     };
// }
//
// const element = (tag, component, propTypes) => {
//         webComponentVisibility(tag);
//         customElements.define(tag,
//             component.prototype instanceof Xelement ? component :
//                 class extends Xelement {
//                     static propTypes = propTypes;
//                     render = component;
//                 }
//         );
//         return (props, children) => h(tag, props, children);
//     },
//
//     x = (tag, component, propTypes) =>
//         element('x-' + tag, component, propTypes);
//
// export {Xelement, x, element, context}

exports.Fragment = Fragment;
exports.Xelement = Xelement;
exports.context = context;
exports.element = element;
exports.globalStyles = globalStyles;
exports.h = h;
exports.x = x;
