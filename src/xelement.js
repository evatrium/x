import {
    formatType,
    updateAttribute,
    propToAttr,
    attrToProp,
    webComponentVisibility,
    createElement,
    appendChild,
    TEST_ENV,
    def, extend, isFunc,
    COMPONENT_VISIBLE_CLASSNAME
} from "../src/utils";

import {h, patch, removeHandlers, HOST_TYPE, patchProperty, merge} from "./vdom";


let PROPS = Symbol(),
    // PROPS = 'props',
    IGNORE_ATTR = Symbol(),
    context = {},
    adoptedCSS = "adoptedStyleSheets" in document;

// let shady = window.ShadyCSS;
// --- yeah, prop not gonna even bother with internet explorer...
// styles can't be dynamically updated in the render func, the docs say to use custom properties only

/* inspiration driven by superfine, atomico, stencil, preact and open-wc */


class Xelement extends HTMLElement {

    context = context;

    _unsubs = [];

    state = {};

    constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});//  (this.shadowRoot || this) maybe eventually include the option to not use shadowDom
        this[PROPS] = {};
        this.render = this.render.bind(this);
        this._mounted = new Promise(mount => (this._mount = mount));
        this.update();
        let {_initAttrs, _rootSheet} = this.constructor;
        let length = _initAttrs.length;
        while (length--) _initAttrs[length](this);

        if (adoptedCSS) this._root.adoptedStyleSheets = [_rootSheet];

        this.CSS = ({updatable, css}, children) => {
            let cssText = css || children;
            if (!cssText) return null;
            if (!adoptedCSS) return <style>{cssText}</style>;
            else if (_rootSheet.cssRules.length === 0) _rootSheet.replaceSync(cssText);
            return null;
        }
    }

    Host = (selfProps, children) => {
        this._usingFrag = true;
        let hostNodeProps = {}, i = 0, a = this.attributes;
        for (i = a.length; i--;) {
            let attr = a[i].name;
            hostNodeProps[attr === 'class' ? 'className' : attr] = a[i].value;
        }
        // this._mounted.then(() => {
        for (let key in selfProps) {
            patchProperty(this, key, hostNodeProps[key], selfProps[key]);
        }
        // });
        return h(HOST_TYPE, {}, children);
    };

    connectedCallback() {
        if (this._has_mounted) return;
        this.state.$onChange && this._unsubs.push(this.state.$onChange(this.update));
        this.observe && this.observeObi(this.observe);
        this._mount();
    }

    setState = nextState => {
        extend(this.state, isFunc(nextState) ? nextState(this.state) : nextState || {});
        this.update();
    };

    observeObi = (...obis) =>
        obis.forEach(obi => obi.$onChange && this._unsubs.push(obi.$onChange(this.update)));

    update = () => {
        if (!this._process) {
            this._process = this._mounted.then(_ => {
                !this._has_mounted ? this._initialRender() : this._subsequentRender();
                this._process = false;
            });
        }
        return this._process;
    };

    _renderArgs = () => [extend({Host: this.Host, CSS: this.CSS, host: this}, this[PROPS]), this.state, this.context];

    /*adding visibility inherit next tick after render will prevent flash of un-styled content. (inspired by stencil.js)
     Removing this functionality during testing makes life easier  */
    _initialRender = () => {
        let next = this._renderArgs();
        this.willRender(...next);
        let results = this.render(...next);
        let mountPoint = createElement(this._usingFrag ? 'template' : results.name);
        appendChild(this._root, mountPoint);
        this._base = patch(this._usingFrag ? this._root : mountPoint, results);
        this.didRender(...next);
        this._has_mounted = true;
        let postInitial = () => {
            this._unsubs.push(this.lifeCycle());
            !TEST_ENV && this.classList.add(COMPONENT_VISIBLE_CLASSNAME);
        };
        !TEST_ENV ? requestAnimationFrame(postInitial) : postInitial();
    };

    _subsequentRender = () => {
        let next = this._renderArgs();
        let shouldRerender = this.willRender();// returning a falsy value other than undefined will prevent rerender
        if (!shouldRerender && shouldRerender !== undefined) return;
        patch(this._usingFrag ? this._root : this._base, this.render(...next));
        this.didRender(...next);
    };

    emit = (name, detail, from) => (from || this).dispatchEvent(
        new CustomEvent(name, {detail, bubbles: true, composed: true})
    );


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
        !this.isConnected && !this._destroyed && this.destroy();
    }

    destroy = (dom) => {
        if (!this._destroyed) {
            dom && removeHandlers(dom);
            this._unsubs.forEach(fn => isFunc(fn) && fn());
            this._destroyed = true;
        }
    };
}


const element = (tag, component, propTypes) => {

        webComponentVisibility(tag);

        const rootSheet = adoptedCSS && new CSSStyleSheet(),
            isXelment = component.prototype instanceof Xelement;
        if (isXelment) component._rootSheet = rootSheet;

        customElements.define(tag,
            isXelment ? component : class extends Xelement {
                static propTypes = propTypes;
                static _rootSheet = rootSheet;
                render = component
            }
        );
        return (props, children) => h(tag, props, children);
    },

    x = (tag, component, propTypes) =>
        element('x-' + tag, component, propTypes);

export {Xelement, x, element, context};


//
// if(key === 'style'){
//     let hostNodeStyleObj = CSSTextToObj(this.style.cssText);
//     let selfStyleObj = isObj(selfProps.style) ? selfProps.style : CSSTextToObj(selfProps.style);
//
//     console.log('host node style obj', hostNodeStyleObj);
//     console.log('selfStyleOjb', selfStyleObj)
//     newValue = extend(hostNodeStyleObj, selfStyleObj);
//     oldValue = hostNodeStyleObj;
//     console.log('merged style', newValue)
// }
// console.log('old value', oldValue);
// console.log('new value', newValue)