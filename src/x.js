import {def, extend, isFunc} from '@iosio/util'
import {formatType, setAttr, propToAttr, attrToProp, webComponentVisibility, d} from "../src/utils";
import {obi} from "@iosio/obi";
import {h, patch, removeHandlers} from "./vdom";

let PROPS = Symbol(),
    IGNORE_ATTR = Symbol(),
    context = {};

let shady = window.ShadyCSS;

/*
    heavily inspired by atomico, stencil, preact and superfine
 */

class X extends HTMLElement {

    context = context;

    _unsubs = [];

    constructor() {
        super();
        this[PROPS] = {};
        this.render = this.render.bind(this);
        this._mounted = new Promise(mount => (this._mount = mount));
        this.update();
        let {_initAttrs} = this.constructor;
        let length = _initAttrs.length;
        while (length--) _initAttrs[length](this);

        def(this, 'state', {
            set(state) {
                !this._state && (this._unsubs.push(
                    obi(state).$onChange(this.update)
                ), this._state = state);
            },
            get() {
                return this._state;
            }
        });
    }

    connectedCallback() {
        if (this._has_mounted) return;
        shady && shady.styleElement(this);
        this.attachShadow({mode: 'open'});
        this._root = (this.shadowRoot || this);
        this._mount();
    }

    _initialRender = (...next) => {

        /*

             been having issues trying to figure out how to use a fragment as the root element.
             checkout the vdom code (src/superfine_modified&annotated.js) to see how i am attempting to implement it

             superfine wont mount into the shadow root

             but, somehow, first appending a template element does the trick.

             having a hard time testing it though,

             when i run npm test, and try to access innerHTML of the shadow root, i just get the template element
         */
        this._root.appendChild(d.createElement('template'));

        let results = this.render(...next);// nothing rendered yet, just need to pass the host ref to render before calling willRender
        this.willRender(...next);

        if (isFunc(results)) {
            this._renderer = results; // if a function is returned then save it as the renderer
            patch(this._root,
                this._renderer(extend({host: this}, this[PROPS]), this.state, this.context)
            );//...spreading the args there again doesn't work for some reason
        } else patch(this._root, results);

        requestAnimationFrame(() => {
            this.classList.add('___');
            this.didRender(...next);
            this._unsubs.push(this.lifeCycle(...next));
        });

        this._has_mounted = true;
    };

    _subsequentRender = (...next) => {
        !this.willRender(...next) // returning true will prevent re render
        && patch(this._root,
            isFunc(this._renderer)
                ? this._renderer(...next)
                : this.render(...next)
        ) && this.didRender(...next);
    };

    update = () => {
        if (!this._process) {
            this._process = this._mounted.then((next) => {
                next = [extend({host: this}, this[PROPS]), this.state, this.context];
                !this._has_mounted
                    ? this._initialRender(...next)
                    : this._subsequentRender(...next);
                shady && shady.styleSubtree(this);
                this._process = false;
            });
        }
        return this._process;
    };

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
                                setAttr(this, attr, schema.type === Boolean && !value ? null : value);
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
        !this._destroyed && this._destroy()
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
            component.prototype instanceof X ? component :
                class extends X {
                    static propTypes = propTypes;
                    render = component;
                }
        );
        return (props, children) => h(tag, props, children);
    },
    x = (tag, RenderComponent, _propTypes, childrenConfig) =>
        element('x-' + tag, RenderComponent, _propTypes, childrenConfig);

export {X, x, element, context}