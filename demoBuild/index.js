const e = {}, t = [], n = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

function o(e, t) {
    for (let n in t) e[n] = t[n];
    return e
}

function l(e) {
    let t = e.parentNode;
    t && t.removeChild(e)
}

const r = {};

function i(e, t, n) {
    if (t = o({}, t), arguments.length > 3) {
        n = [n];
        for (let e = 3; e < arguments.length; e++) n.push(arguments[e])
    }
    if (null != n && (t.children = n), null != e && null != e.defaultProps) for (let n in e.defaultProps) void 0 === t[n] && (t[n] = e.defaultProps[n]);
    let l = t.ref, r = t.key;
    return null != l && delete t.ref, null != r && delete t.key, s(e, t, r, l)
}

function s(e, t, n, o) {
    return {
        type: e,
        props: t,
        key: n,
        ref: o,
        _children: null,
        _parent: null,
        _depth: 0,
        _dom: null,
        _lastDomChild: null,
        _component: null,
        constructor: void 0
    }
}

function a(e) {
    return e.children
}

function c(e, t) {
    this.props = e, this.context = t
}

function u(e, t) {
    if (null == t) return e._parent ? u(e._parent, e._parent._children.indexOf(e) + 1) : null;
    let n;
    for (; t < e._children.length; t++) if (null != (n = e._children[t]) && null != n._dom) return n._dom;
    return "function" == typeof e.type ? u(e) : null
}

function d(e) {
    let t = e._vnode, n = t._dom, l = e._parentDom;
    if (l) {
        let r = [], i = S(l, t, o({}, t), e._context, void 0 !== l.ownerSVGElement, null, r, null == n ? u(t) : n);
        w(r), i != n && function e(t) {
            if (null != (t = t._parent) && null != t._component) {
                t._dom = t._component.base = null;
                for (let e = 0; e < t._children.length; e++) {
                    let n = t._children[e];
                    if (null != n && null != n._dom) {
                        t._dom = t._component.base = n._dom;
                        break
                    }
                }
                return e(t)
            }
        }(t)
    }
}

c.prototype.setState = function (e, t) {
    let n = this._nextState !== this.state && this._nextState || (this._nextState = o({}, this.state));
    ("function" != typeof e || (e = e(n, this.props))) && o(n, e), null != e && this._vnode && (this._force = !1, t && this._renderCallbacks.push(t), m(this))
}, c.prototype.forceUpdate = function (e) {
    this._vnode && (this._force = !0, e && this._renderCallbacks.push(e), m(this))
}, c.prototype.render = a;
let h = [];
const p = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
let f = r.debounceRendering;

function m(e) {
    (!e._dirty && (e._dirty = !0) && 1 === h.push(e) || f !== r.debounceRendering) && (f = r.debounceRendering, p(y))
}

function y() {
    let e;
    for (h.sort((e, t) => t._vnode._depth - e._vnode._depth); e = h.pop();) e._dirty && d(e)
}

function g(n, o, r, i, s, a, c, d, h) {
    let p, f, m, y, g, b, x, v = r && r._children || t, w = v.length;
    if (d == e && (d = null != a ? a[0] : w ? u(r, 0) : null), p = 0, o._children = _(o._children, t => {
        if (null != t) {
            if (t._parent = o, t._depth = o._depth + 1, null === (m = v[p]) || m && t.key == m.key && t.type === m.type) v[p] = void 0; else for (f = 0; f < w; f++) {
                if ((m = v[f]) && t.key == m.key && t.type === m.type) {
                    v[f] = void 0;
                    break
                }
                m = null
            }
            if (y = S(n, t, m = m || e, i, s, a, c, d, h), (f = t.ref) && m.ref != f && (x || (x = [])).push(f, t._component || y, t), null != y) {
                if (null == b && (b = y), null != t._lastDomChild) y = t._lastDomChild, t._lastDomChild = null; else if (a == m || y != d || null == y.parentNode) {
                    e:if (null == d || d.parentNode !== n) n.appendChild(y); else {
                        for (g = d, f = 0; (g = g.nextSibling) && f < w; f += 2) if (g == y) break e;
                        n.insertBefore(y, d)
                    }
                    "option" == o.type && (n.value = "")
                }
                d = y.nextSibling, "function" == typeof o.type && (o._lastDomChild = y)
            }
        }
        return p++, t
    }), o._dom = b, null != a && "function" != typeof o.type) for (p = a.length; p--;) null != a[p] && l(a[p]);
    for (p = w; p--;) null != v[p] && C(v[p], v[p]);
    if (x) for (p = 0; p < x.length; p++) k(x[p], x[++p], x[++p])
}

function _(e, t, n) {
    if (null == n && (n = []), null == e || "boolean" == typeof e) t && n.push(t(null)); else if (Array.isArray(e)) for (let o = 0; o < e.length; o++) _(e[o], t, n); else n.push(t ? t(function (e) {
        if (null == e || "boolean" == typeof e) return null;
        if ("string" == typeof e || "number" == typeof e) return s(null, e, null, null);
        if (null != e._dom || null != e._component) {
            let t = s(e.type, e.props, e.key, null);
            return t._dom = e._dom, t
        }
        return e
    }(e)) : e);
    return n
}

function b(e, t, o) {
    "-" === t[0] ? e.setProperty(t, o) : e[t] = "number" == typeof o && !1 === n.test(t) ? o + "px" : null == o ? "" : o
}

function x(e, t, n, o, l) {
    if ("key" === (t = l ? "className" === t ? "class" : t : "class" === t ? "className" : t) || "children" === t) ; else if ("style" === t) {
        const t = e.style;
        if ("string" == typeof n) t.cssText = n; else {
            if ("string" == typeof o && (t.cssText = "", o = null), o) for (let e in o) n && e in n || b(t, e, "");
            if (n) for (let e in n) o && n[e] === o[e] || b(t, e, n[e])
        }
    } else if ("o" === t[0] && "n" === t[1]) {
        let l = t !== (t = t.replace(/Capture$/, "")), r = t.toLowerCase();
        t = (r in e ? r : t).slice(2), n ? (o || e.addEventListener(t, v, l), (e._listeners || (e._listeners = {}))[t] = n) : e.removeEventListener(t, v, l)
    } else "list" !== t && "tagName" !== t && "form" !== t && !l && t in e ? e[t] = null == n ? "" : n : "function" != typeof n && "dangerouslySetInnerHTML" !== t && (t !== (t = t.replace(/^xlink:?/, "")) ? null == n || !1 === n ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), n) : null == n || !1 === n ? e.removeAttribute(t) : e.setAttribute(t, n))
}

function v(e) {
    return this._listeners[e.type](e)
}

function S(n, l, i, s, u, d, h, p, f) {
    let m, y = l.type;
    if (void 0 !== l.constructor) return null;
    (m = r._diff) && m(l);
    try {
        e:if ("function" == typeof y) {
            let e, t, b, x, v, S, w = l.props, k = (m = y.contextType) && s[m._id],
                C = m ? k ? k.props.value : m._defaultValue : s;
            if (i._component ? S = (e = l._component = i._component)._processingException = e._pendingError : ("prototype" in y && y.prototype.render ? l._component = e = new y(w, C) : (l._component = e = new c(w, C), e.constructor = y, e.render = E), k && k.sub(e), e.props = w, e.state || (e.state = {}), e.context = C, e._context = s, t = e._dirty = !0, e._renderCallbacks = []), null == e._nextState && (e._nextState = e.state), null != y.getDerivedStateFromProps && o(e._nextState == e.state ? e._nextState = o({}, e._nextState) : e._nextState, y.getDerivedStateFromProps(w, e._nextState)), t) null == y.getDerivedStateFromProps && null != e.componentWillMount && e.componentWillMount(), null != e.componentDidMount && h.push(e); else {
                if (null == y.getDerivedStateFromProps && null == e._force && null != e.componentWillReceiveProps && e.componentWillReceiveProps(w, C), !e._force && null != e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(w, e._nextState, C)) {
                    for (e.props = w, e.state = e._nextState, e._dirty = !1, e._vnode = l, l._dom = i._dom, l._children = i._children, m = 0; m < l._children.length; m++) l._children[m] && (l._children[m]._parent = l);
                    break e
                }
                null != e.componentWillUpdate && e.componentWillUpdate(w, e._nextState, C)
            }
            b = e.props, x = e.state, e.context = C, e.props = w, e.state = e._nextState, (m = r._render) && m(l), e._dirty = !1, e._vnode = l, e._parentDom = n;
            let N = null != (m = e.render(e.props, e.state, e.context)) && m.type == a && null == m.key;
            l._children = _(N ? m.props.children : m), null != e.getChildContext && (s = o(o({}, s), e.getChildContext())), t || null == e.getSnapshotBeforeUpdate || (v = e.getSnapshotBeforeUpdate(b, x)), g(n, l, i, s, u, d, h, p, f), e.base = l._dom, m = e._renderCallbacks, e._renderCallbacks = [], m.some(t => {
                t.call(e)
            }), t || null == b || null == e.componentDidUpdate || e.componentDidUpdate(b, x, v), S && (e._pendingError = e._processingException = null), e._force = null
        } else l._dom = function (n, o, l, r, i, s, a, c) {
            let u, d = l.props, h = o.props;
            if (i = "svg" === o.type || i, null == n && null != s) for (u = 0; u < s.length; u++) {
                const e = s[u];
                if (null != e && (null === o.type ? 3 === e.nodeType : e.localName === o.type)) {
                    n = e, s[u] = null;
                    break
                }
            }
            if (null == n) {
                if (null === o.type) return document.createTextNode(h);
                n = i ? document.createElementNS("http://www.w3.org/2000/svg", o.type) : document.createElement(o.type), s = null
            }
            if (null === o.type) null != s && (s[s.indexOf(n)] = null), d !== h && (n.data = h); else if (o !== l) {
                null != s && (s = t.slice.call(n.childNodes));
                let u = (d = l.props || e).dangerouslySetInnerHTML, p = h.dangerouslySetInnerHTML;
                if (!c) {
                    if (d === e) {
                        d = {};
                        for (let e = 0; e < n.attributes.length; e++) d[n.attributes[e].name] = n.attributes[e].value
                    }
                    (p || u) && (p && u && p.__html == u.__html || (n.innerHTML = p && p.__html || ""))
                }
                !function (e, t, n, o, l) {
                    let r;
                    for (r in n) r in t || x(e, r, null, n[r], o);
                    for (r in t) l && "function" != typeof t[r] || "value" === r || "checked" === r || n[r] === t[r] || x(e, r, t[r], n[r], o)
                }(n, h, d, i, c), o._children = o.props.children, p || g(n, o, l, r, "foreignObject" !== o.type && i, s, a, e, c), c || ("value" in h && void 0 !== h.value && h.value !== n.value && (n.value = null == h.value ? "" : h.value), "checked" in h && void 0 !== h.checked && h.checked !== n.checked && (n.checked = h.checked))
            }
            return n
        }(i._dom, l, i, s, u, d, h, f);
        (m = r.diffed) && m(l)
    } catch (e) {
        r._catchError(e, l, i)
    }
    return l._dom
}

function w(e, t) {
    let n;
    for (; n = e.pop();) try {
        n.componentDidMount()
    } catch (e) {
        r._catchError(e, n._vnode)
    }
}

function k(e, t, n) {
    try {
        "function" == typeof e ? e(t) : e.current = t
    } catch (e) {
        r._catchError(e, n)
    }
}

function C(e, t, n) {
    let o, i;
    if ((o = e.ref) && k(o, null, t), n || "function" == typeof e.type || (n = null != (i = e._dom)), e._dom = e._lastDomChild = null, null != (o = e._component)) {
        if (o.componentWillUnmount) try {
            o.componentWillUnmount()
        } catch (e) {
            r._catchError(e, t)
        }
        o.base = o._parentDom = null
    }
    if (o = e._children) for (let e = 0; e < o.length; e++) o[e] && C(o[e], t, n);
    null != i && l(i)
}

function E(e, t, n) {
    return this.constructor(e, n)
}

r._catchError = function (e, t, n) {
    let o;
    for (; t = t._parent;) if ((o = t._component) && !o._processingException) try {
        if (o.constructor && null != o.constructor.getDerivedStateFromError) o.setState(o.constructor.getDerivedStateFromError(e)); else {
            if (null == o.componentDidCatch) continue;
            o.componentDidCatch(e)
        }
        return m(o._pendingError = o)
    } catch (t) {
        e = t
    }
    throw e
};
const N = e;

function U(n, o, l) {
    let r = l === N, s = r ? null : l && l._children || o._children;
    n = i(a, null, [n]);
    let c = [];
    S(o, r ? o._children = n : (l || o)._children = n, s || e, e, void 0 !== o.ownerSVGElement, l && !r ? [l] : s ? null : t.slice.call(o.childNodes), c, l || e, r), w(c)
}

const D = Array.isArray, A = e => "function" == typeof e, T = window, M = document, R = (e, t) => e.appendChild(t),
    O = e => M.createTextNode(e), z = e => e.toUpperCase(),
    L = (((e, t, n, o) => (((l, r, i) => l.addEventListener("scroll", () => e && o.scrollTo(t, n)))(o = o || T), {
        lock: () => {
            e = !0, t = o.pageXOffset, n = o.pageYOffset
        }, letGo: () => e = !1
    }))(), "adoptedStyleSheets" in document), F = e => {
        let t = (e => M.createElement("style"))();
        return R(t, O("")), R(e || M.head, t), e => (R(t, O(e)), t)
    }, W = F(), H = (F(), e => requestAnimationFrame(e)), P = e => {
        var t = {}, n = e => e.startsWith("-") ? e : e.replace(/\W+\w/g, e => z(e.slice(-1))),
            o = e.split(";").map(e => e.split(":").map(e => e && e.trim()));
        for (var [l, r]of o) {
            let e = n(l);
            e && (t[e] = r)
        }
        return t
    }, I = {}, j = (e, t) => {
        t = t || String;
        try {
            if (t == Boolean ? e = [!0, 1, "", "1", "true"].includes(e) : "string" == typeof e && (e = t == Number ? Number(e) : t == Object || t == Array ? JSON.parse(e) : e), {}.toString.call(e) == `[object ${t.name}]`) return {
                value: e,
                error: t == Number && Number.isNaN(e)
            }
        } catch (e) {
        }
        return {value: e, error: !0}
    }, B = (e, t, n) => {
        null === n || !1 === n ? e.removeAttribute(t) : e.setAttribute(t, ((e, t) => !(!e.getAttribute || !e.localName) && (t = e.getAttribute("is"), e.localName.includes("-") || t && t.includes("-")))(e) && ((e => "[object Object]" === Object.prototype.toString.call(e))(n) || D(n)) ? JSON.stringify(n) : n)
    }, $ = e => (e => e.toLowerCase())(e.replace(/([A-Z])/g, "-$1")), G = e => e.replace(/-(\w)/g, (e, t) => z(t)),
    V = (e, t) => {
        for (let n in t) e[n] = t[n];
        return e
    }, J = e => 0 === Object.keys(e || {}).length;
window.chrome;
var q = window.navigator;
q.vendor, window.opr, q.userAgent.indexOf("Edge"), q.userAgent.match("CriOS");
const X = (e, t, n) => Object.defineProperty(e, t, n);
let Y = "props", Z = Symbol(), K = ":host, *, *::before, *::after {box-sizing: border-box;} ", Q = {};
const ee = e => {
    for (; e.parentNode && (e = e.parentNode);) if (e instanceof ShadowRoot) return e;
    return document
};

class te extends HTMLElement {
    constructor() {
        super(), this.context = Q, this.unsubs = [], this.state = {};
        let {initAttrs: e, shadow: t, rootSheet: n, noRerender: o, tag: l} = this.constructor,
            r = t ? this.attachShadow({mode: ["open", "closed"].includes(t) ? t : "open"}) : this;
        this[Y] = {}, this.render = this.render.bind(this), this.mounted = new Promise(e => this._mount = e);
        const s = (e, n) => {
            let o = t ? r : ee(this), l = "";
            return [].concat(e).forEach(e => {
                if (L && !n) {
                    let t = D(e) ? e[0] : e;
                    t && ![].concat(o.adoptedStyleSheets).includes(t) && (o.adoptedStyleSheets = [...o.adoptedStyleSheets, t])
                } else D(e) && e[1] && (l += e[1])
            }), l
        };
        let a = "", c = 0, u = !1;
        const d = ({css: e, noResets: o, globalFallback: r, useStyleTag: d, styleSheets: h, children: p}) => {
            if (c > 0 && console.error("<CSS/> should only be used once. Use a style tag to include additional styles."), c++, !1 !== u) return u;
            let f = e || p || "";
            return !o && t && (f = K + f), L && !d ? (s([n]), 0 === n.cssRules.length && n.replaceSync(f), h && s(h), u = null) : (a = f + s([n], !0) + (h ? s(h, !0) : ""), r && !I[l] ? (I[l] = !0, W(a), u = null) : u = i("style", null, a)), u
        };
        let h;
        const p = ({children: e, ...t}) => {
            let n = e;
            if (!this.hasMounted && J(t)) return h = !0, n;
            if (h && J(t)) return n;
            h = !1;
            let o = {}, l = 0, r = this.attributes;
            for (l = r.length; l--;) {
                let e = r[l].name;
                o["class" === e ? "className" : e] = r[l].value
            }
            for (let e in t) x(this, e, t[e], o[e], !1);
            return n
        };
        this.setState = e => (V(this.state, A(e) ? e(this.state) : e || {}), this.update()), this.observeObi = e => [].concat(e).forEach(e => e.$onChange && this.unsubs.push(e.$onChange(this.update)));
        const f = () => (this._watchesForStyleUpdates && (this[Y].style = P(this.style.cssText)), [V({
            Host: p,
            CSS: d,
            host: this
        }, this[Y]), this.state, this.context]);
        let m;
        const y = () => {
            let e = f();
            this.willMount(...e), this.willRender(...e), m = this.render(...e), c = 0, m && U(m, r), H(() => {
                this.unsubs.push(this.lifeCycle(...e)), this.didRender(...e), this.didMount(...e), this.hasMounted = !0
            })
        }, g = () => {
            let e = f(), t = this.willRender(...e);
            this.willUpdate(...e), this.shouldUpdate && (t = this.shouldUpdate(...e)), o || !t && void 0 !== t || (m = this.render(...e), c = 0, m && U(m, r), this.didUpdate(...e), this.didRender(...e))
        };
        let _;
        this.update = () => (this.processing || (this.processing = this.mounted.then(e => {
            this.hasMounted ? g() : y(), this.processing = !1
        })), this.processing), this.emit = (e, t, n, o) => (n || this).dispatchEvent(new CustomEvent(e, V({
            detail: t,
            bubbles: !0,
            composed: !0
        }, o || {}))), this.destroy = () => {
            _ || (U(null, r), this.unsubs.forEach(e => A(e) && e()), _ = !0)
        };
        let b = e.length;
        for (; b--;) e[b](this);
        this.update()
    }

    connectedCallback() {
        this.hasMounted || (this.state.$onChange && this.unsubs.push(this.state.$onChange(this.update)), this.observe && this.observeObi(this.observe), this._mount())
    }

    disconnectedCallback() {
        this.isConnected || (this.destroy(), this.willUnmount())
    }

    attributeChangedCallback(e, t, n) {
        this[Z] !== e && t !== n && ("style" === e && this._watchesForStyleUpdates ? this.update() : this[G(e)] = n)
    }

    static get observedAttributes() {
        let {propTypes: e, prototype: t} = this;
        if (this.initAttrs = [], !e) return [];
        let n = Object.keys(e).map(n => {
            let o = $(n), l = e[n].name ? {type: e[n]} : e[n];
            return n in t || X(t, n, {
                get() {
                    return this[Y][n]
                }, set(e) {
                    let {value: t, error: r} = j(e, l.type);
                    r && null != t && console.error(`[${n}] must be type [${l.type.name}]`), t !== this[Y][n] && (l.reflect && this.mounted.then(() => {
                        this[Z] = o, B(this, o, l.type !== Boolean || t ? t : null), this[Z] = !1
                    }), this[Y][n] = t, this.update())
                }
            }), l.value && this.initAttrs.push(e => e[n] = l.value), o
        });
        return this.prototype._watchesForStyleUpdates = n.includes("style"), n
    }

    willMount() {
    }

    willRender() {
    }

    render() {
    }

    didRender() {
    }

    willUpdate() {
    }

    didUpdate() {
    }

    didMount() {
    }

    lifeCycle() {
    }

    willUnmount() {
    }
}

const ne = (e, t, n = {}) => {
    var o, l;
    let r, s = t.prototype instanceof te;
    return L && (r = new CSSStyleSheet), s && (t.rootSheet = r, t.tag = e), customElements.define(e, s ? t : (l = o = class extends te {
        constructor(...e) {
            super(...e), this.render = t
        }
    }, o.rootSheet = r, o.tag = e, o.propTypes = n.propTypes, o.shadow = n.shadow, o.noRerender = n.noRerender, l)), t => i(e, t)
};
var oe, le;
ne("x-root", ({Host: e, CSS: t}) => i(e, null, i(t, {globalFallback: !0}, ':root{--primary1:#485be4;--primary2:#4cd0e1;--primary3:#673AB7;--error:#ff3058;--warning:#ffb231;--success:#13caab;--bg1:#fff;--bg2:#fff;--shade1:#fbfdfe;--shade2:#fafcfd;--shade3:#f8fafb;--shade4:#f2f6fa;--shade5:#e9f1f7;--shade6:#e0ebf3;--shade7:#dae6f1;--shade8:#d3e2ee;--shade9:#cedfec;--shade10:#c8dae9;--zIndexToast:9000;--zIndexDropdown:8000;--zIndexModal:7000;--zIndexNav:6000;--zIndexDrawer:5000;--zIndexOverlay:4000;--shadow1:0px 4px 19px 1px rgba(150, 160, 229, 0.18);--shadow2:0px 6px 19px 2px rgba(150, 160, 229, 0.28);--shadow3:1px 7px 12px 1px rgba(142, 151, 219, 0.54);--spacing:20px;--navHeight:56px;--containerWidth:1280px;--gridGutter:10px;--drawerWidth:320px;--dropDownListMaxHeight:25vh;--dropDownListWidth:100%;--lazyImgBlurDuration:600ms;--avatarSize:50px;--fallbackAvatarIconColor:white;--textFieldBackground:transparent;--overlayRgba:rgba(250, 252, 255, 0.65);--toastWidth:365px;--inkOpacity:0.3;--inkColor:#c8dae9;--fontFamily:\'Montserrat\',"Helvetica Neue",-apple-system,"Segoe UI","Roboto",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";--fontSize:17px;--fontWeight:500;--fontColor:#070737;--fontLighter:rgba(7, 7, 55, 0.53);--lineHeight:120%;--textFieldLineHeight:22px;--paragraphLineHeight:1.5;--letterSpacing:0.3px;--contrast:white;--fontWeightBold:700;--iconColor:#070737;--borderRadius:10px;--duration1:300ms;--transition:all 300ms cubic-bezier(0.19, 1, 0.22, 1)}html{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;overflow-x:hidden}html,body{height:100%;width:100%;margin:0;padding:0;display:flex;flex-direction:column;flex:1 0 auto;background:var(--bg1);font-family:var(--fontFamily);letter-spacing:var(--letterSpacing);color:var(--fontColor);font-size:var(--fontSize)}*,*::before,*::after{box-sizing:border-box}x-root{display:flex;flex-direction:column;width:100%;min-height:100%;-webkit-overflow-scrolling:touch;flex:1 0 auto}::-webkit-scrollbar{width:12px;background-color:var(--shade2)}::-webkit-scrollbar-thumb{border-radius:20px;background-color:var(--shade4)}*{flex-shrink:1}.w100{width:100%}'))), ne("x-box", (le = oe = class extends te {
    constructor(...e) {
        super(...e), this.count = 0
    }

    didMount() {
        this.getAttribute("class")
    }

    render({Host: e, CSS: t, style: n}) {
        return console.log(n), i(e, {
            style: {
                ...n,
                border: "3px solid blue"
            }
        }, i(t, {useStyleTag: !0}, ":host{display:block;height:500px;width:500px;background:#f0f8ff}"), i("button", {
            onClick: () => {
                console.log("click", this.count), this.emit("testEvent", "heyyooo: " + this.count++)
            }
        }, " emit "), i("button", {
            onClick: () => {
                console.log("click", this.count), this.emit("testEvent", "heyyooo: " + this.count++)
            }
        }, " emit "), i("button", {
            onClick: () => {
                console.log("click", this.count), this.emit("testEvent", "heyyooo: " + this.count++)
            }
        }, " emit "))
    }
}, oe.shadow = !0, oe.propTypes = {style: String}, le)), ne("x-app", class extends te {
    constructor(...e) {
        super(...e), this.logEvent = ({detail: e}) => {
            console.log("event detail", e)
        }
    }

    render({Host: e, CSS: t}, {bool: n = !0}) {
        return i(e, null, i(t, null), i("button", {onClick: () => this.setState({bool: !n})}, "toggle bool"), i("h1", null, " hellooo "), n && i("x-box", {
            ontestEvent: this.logEvent,
            style: {border: "2px solid red"}
        }))
    }
}), document.getElementsByTagName("x-root")[0].appendChild(document.createElement("x-app"));
