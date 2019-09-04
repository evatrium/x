import {def, extend, isFunc} from '@iosio/util'
import {
    formatType,
    updateAttribute,
    propToAttr,
    attrToProp,
    webComponentVisibility,
    createElement,
    appendChild,
    d
} from "../src/utils";
import {h, patch, removeHandlers, FRAGMENT_TYPE, patchProperty, merge} from "./vdom";

let
    PROPS = Symbol(),
    // PROPS = 'props',
    IGNORE_ATTR = Symbol(),
    context = {};

// let shady = window.ShadyCSS;
// --- yeah, prop not gonna even bother with internet explorer...
// styles can't be dynamically updated in the render func, the docs say to use custom properties only

/*  heavily inspired by atomico, stencil, preact and superfine */

class Xelement extends HTMLElement {

    context = context;

    _unsubs = [];

    _hostElementProps = {};

    state = {};

    constructor() {
        super();
        this[PROPS] = {};
        this.render = this.render.bind(this);
        this._mounted = new Promise(mount => (this._mount = mount));
        this.update();
        let {_initAttrs} = this.constructor;
        let length = _initAttrs.length;
        while (length--) _initAttrs[length](this);
    }

    Host = (props, children) => {
        this._usingFrag = true;
        for (let key in merge(props, this._hostElementProps)){
            patchProperty(this, key, this._hostElementProps[key], props[key]);
        }
        this._hostElementProps = props;
        return h(FRAGMENT_TYPE, {}, children);
    };

    connectedCallback() {
        if (this._has_mounted) return;
        // shady && shady.styleElement(this);
        this.attachShadow({mode: 'open'});
        this._root = (this.shadowRoot || this);
        this.state.$onChange && this._unsubs.push(this.state.$onChange(this.update));
        this.observe && this.observeObi(this.observe);
        this._mount();
    }

    setState = (nextState) => {
        extend(this.state, isFunc(nextState) ? nextState(this.state) : nextState || {});
        this.update();
    };

    observeObi = (...obis) =>
        obis.forEach(obi => obi.$onChange && this._unsubs.push(obi.$onChange(this.update)));

    update = () => {
        if (!this._process) {
            this._process = this._mounted.then((next) => {
                next = [extend({Host: this.Host}, this[PROPS]), this.state, this.context];
                !this._has_mounted
                    ? this._initialRender(...next)
                    : this._subsequentRender(...next);
                // shady && shady.styleSubtree(this);
                this._process = false;
            });
        }
        return this._process;
    };

    _initialRender = (...next) => {
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

    _subsequentRender = (...next) => {
        if (!(this.willRender())) {// returning true will prevent re render
            patch(this._usingFrag ? this._root : this._base, this.render(...next))
            this.didRender();
        }
    };
    emit = (name, detail, from) =>
        (from || this).dispatchEvent(
            new CustomEvent(name, {detail, bubbles: true, composed: true})
        );

    attributeChangedCallback(attr, oldValue, newValue) {
        if (attr === this[IGNORE_ATTR] || oldValue === newValue) return;
        this[attrToProp(attr)] = newValue;
    }

    static get observedAttributes() {
        let {propTypes, prototype} = this;
        this._initAttrs = [];
        if (!propTypes) return [];
        return Object.keys(propTypes).map(prop => {
            let attr = propToAttr(prop),
                schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
            if (!(prop in prototype)) {
                def(prototype, prop, {
                    get() {
                        return this[PROPS][prop]
                    },
                    set(nextValue) {
                        let {value, error} = formatType(nextValue, schema.type);
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
            schema.value && this._initAttrs.push(self => (self[prop] = schema.value));
            return attr;
        });
    };

    lifeCycle() {
    }

    willRender() {
    }

    render() {
    }

    didRender() {
    }

    disconnectedCallback() {
        !this._destroyed && this._destroy();
    }

    _destroy = (dom) => {
        dom && removeHandlers(dom);
        this._unsubs.forEach(fn => fn && fn());
        this._destroyed = true;
    };
}

const element = (tag, component, propTypes) => {
        webComponentVisibility(tag);
        customElements.define(tag,
            component.prototype instanceof Xelement ? component :
                class extends Xelement {
                    static propTypes = propTypes;
                    render = component;
                }
        );
        return (props, children) => h(tag, props, children);
    },
    x = (tag, component, propTypes) =>
        element('x-' + tag, component, propTypes);

export {Xelement, x, element, context}