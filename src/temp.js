import {
    formatType,
    updateAttribute,
    propToAttr,
    attrToProp,
    webComponentVisibility,
    createElement,
    appendChild,
    TEST_ENV,
    def, extend, isFunc
} from "../src/utils";
import {h, patch, removeHandlers, HOST_TYPE, patchProperty, merge} from "./vdom";

let PROPS = Symbol(),
    // PROPS = 'props',
    IGNORE_ATTR = Symbol(),
    context = {};

// let shady = window.ShadyCSS;
// --- yeah, prop not gonna even bother with internet explorer...
// styles can't be dynamically updated in the render func, the docs say to use custom properties only

/*  inspiration driven by superfine, atomico, stencil, preact and open-wc */


class Xelement extends HTMLElement {

    context = context;

    _unsubs = [];

    _hostProps = {};

    state = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._root = (this.shadowRoot || this);
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
        let merged = merge(this._hostProps, props);
        if (Object.keys(merged).length) {
            for (let key in merged) patchProperty(this, key, this._hostProps[key], props[key]);
        }
        this._hostProps = props;
        return h(HOST_TYPE, {}, children);
    };

    connectedCallback() {
        console.log('ive connected!!!', this._has_mounted, this.isConnected)
        if (this._has_mounted) return;
        // shady && shady.styleElement(this);
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

    adoptedCallback(){
        console.log('ive been adopted!!')
    }

    _initialRender = (...next) => {

        this.willRender(...next);

        let results = this.render(...next),

            mountPoint = createElement(this._usingFrag ? 'template' : results.name);

        appendChild(this._root, mountPoint);

        this._base = patch(this._usingFrag ? this._root : mountPoint, results);

        this.didRender(...next);

        this._has_mounted = true;

        let postInitial = () => {
            this._unsubs.push(this.lifeCycle());
            /*
             inspired by stencil.js - adding visibility inherit next tick after render will prevent flash of un-styled content.
             Removing this functionality during testing makes life easier
            */
            !TEST_ENV && this.classList.add('___');
        };

        !TEST_ENV ? setTimeout(postInitial) : postInitial();
    };


    _subsequentRender = (...next) => {
        let shouldRerender = this.willRender();// returning a falsy value other than undefined will prevent rerender
        if (!shouldRerender && shouldRerender !== undefined) return;
        patch(this._usingFrag ? this._root : this._base, this.render(...next));
        this.didRender();
    };
    //
    // emit = (name, detail, from) =>
    //     (from || this).dispatchEvent(
    //         new CustomEvent(name, {detail, bubbles: true, composed: true})
    //     );

    attributeChangedCallback(attr, oldValue, newValue) {
        if (attr === this[IGNORE_ATTR] || oldValue === newValue) return;
        this[attrToProp(attr)] = newValue;
    }

    /* inspired by atomico  */
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