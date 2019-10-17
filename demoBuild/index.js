const e = Array.isArray, t = e => "function" == typeof e, l = e => "string" == typeof e,
    n = e => !isNaN(parseFloat(e)) && !isNaN(e - 0), o = e => "boolean" == typeof e, r = window, s = document,
    i = (e, t) => e.appendChild(t), a = e => s.createTextNode(e), d = e => e.toUpperCase(),
    h = (((e, t, l, n) => (((o, r, s) => o.addEventListener("scroll", () => e && n.scrollTo(t, l)))(n = n || r), {
        lock: () => {
            e = !0, t = n.pageXOffset, l = n.pageYOffset
        }, letGo: () => e = !1
    }))(), "adoptedStyleSheets" in document), u = (e => {
        let t = (e => s.createElement("style"))();
        return i(t, a("")), i(s.head, t), e => (i(t, a(e)), t)
    })(), c = e => requestAnimationFrame(e), p = e => {
        var t = {}, l = e => e.startsWith("-") ? e : e.replace(/\W+\w/g, e => d(e.slice(-1))),
            n = e.split(";").map(e => e.split(":").map(e => e && e.trim()));
        for (var [o, r]of n) {
            let e = l(o);
            e && (t[e] = r)
        }
        return t
    }, f = {}, g = (e, t) => {
        t = t || String;
        try {
            if (t == Boolean ? e = [!0, 1, "", "1", "true"].includes(e) : "string" == typeof e && (e = t == Number ? Number(e) : t == Object || t == Array ? JSON.parse(e) : e), {}.toString.call(e) == `[object ${t.name}]`) return {
                value: e,
                error: t == Number && Number.isNaN(e)
            }
        } catch (e) {
        }
        return {value: e, error: !0}
    }, b = (t, l, n) => {
        null === n || !1 === n ? t.removeAttribute(l) : t.setAttribute(l, ((e, t) => !(!e.getAttribute || !e.localName) && (t = e.getAttribute("is"), e.localName.includes("-") || t && t.includes("-")))(t) && ((e => "[object Object]" === Object.prototype.toString.call(e))(n) || e(n)) ? JSON.stringify(n) : n)
    }, m = e => (e => e.toLowerCase())(e.replace(/([A-Z])/g, "-$1")), y = e => e.replace(/-(\w)/g, (e, t) => d(t)),
    x = (e, t) => {
        for (let l in t) e[l] = t[l];
        return e
    }, w = e => 0 === Object.keys(e || {}).length;
window.chrome;
var v = window.navigator;
v.vendor, window.opr, v.userAgent.indexOf("Edge"), v.userAgent.match("CriOS");
const S = (e, t, l) => Object.defineProperty(e, t, l), _ = {}, k = [],
    C = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i, N = e => e.children;

function E(e, t) {
    for (let l in t) e[l] = t[l];
    return e
}

function A(e) {
    let t = e.parentNode;
    t && t.removeChild(e)
}

const O = (e, t, l, n) => ({
    type: e,
    props: t,
    key: l,
    ref: n,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    _lastDomChild: null,
    _component: null,
    constructor: void 0
}), T = (e, l) => t(e) ? e(l) : e.current = l, z = (t, r, s) => {
    if (null == s && (s = []), null == t || o(t)) r && s.push(r(null)); else if (e(t)) for (let e = 0; e < t.length; e++) z(t[e], r, s); else s.push(r ? r((e => {
        if (null == e || o(e)) return null;
        if (l(e) || n(e)) return O(null, e, null, null);
        if (null != e._dom || null != e._component) {
            let t = O(e.type, e.props, e.key, null);
            return t._dom = e._dom, t
        }
        return e
    })(t)) : t);
    return s
}, L = (e, l) => {
    if (null == l) return e._parent ? L(e._parent, e._parent._children.indexOf(e) + 1) : null;
    let n;
    for (; l < e._children.length; l++) if (null != (n = e._children[l]) && null != n._dom) return n._dom;
    return t(e.type) ? L(e) : null
}, M = function (e) {
    return this._listeners[e.type](e)
}, U = (e, t, l) => {
    "-" === t[0] ? e.setProperty(t, l) : e[t] = n(l) && !1 === C.test(t) ? l + "px" : null == l ? "" : l
}, H = (e, n, o, r, s) => {
    if ("key" === (n = s ? "className" === n ? "class" : n : "class" === n ? "className" : n) || "children" === n) ; else if ("style" === n) {
        const t = e.style;
        if (l(o)) t.cssText = o; else {
            if (l(r) && (t.cssText = "", r = null), r) for (let e in r) o && e in o || U(t, e, "");
            if (o) for (let e in o) r && o[e] === r[e] || U(t, e, o[e])
        }
    } else if ("o" === n[0] && "n" === n[1]) {
        let t = n !== (n = n.replace(/Capture$/, "")), l = n.toLowerCase();
        n = (l in e ? l : n).slice(2), o ? (r || e.addEventListener(n, M, t), (e._listeners || (e._listeners = {}))[n] = o) : e.removeEventListener(n, M, t)
    } else "list" !== n && "tagName" !== n && "form" !== n && !s && n in e ? e[n] = null == o ? "" : o : t(o) || "dangerouslySetInnerHTML" === n || (n !== (n = n.replace(/^xlink:?/, "")) ? null == o || !1 === o ? e.removeAttributeNS("http://www.w3.org/1999/xlink", n.toLowerCase()) : e.setAttributeNS("http://www.w3.org/1999/xlink", n.toLowerCase(), o) : null == o || !1 === o ? e.removeAttribute(n) : e.setAttribute(n, o))
}, R = (e, l, n) => {
    let o, r;
    if ((o = e.ref) && T(o, null), n || t(e.type) || (n = null != (r = e._dom)), e._dom = e._lastDomChild = null, null != (o = e._component) && (o.base = o._parentDom = null), o = e._children) for (let e = 0; e < o.length; e++) o[e] && R(o[e], l, n);
    null != r && A(r)
}, I = (e, l, n, o, r, s, i, a) => {
    let d, h, u, c, p, f, g, b = n && n._children || k, m = b.length;
    if (i == _ && (i = null != s ? s[0] : m ? L(n, 0) : null), d = 0, l._children = z(l._children, n => {
        if (null != n) {
            if (n._parent = l, n._depth = l._depth + 1, null === (u = b[d]) || u && n.key == u.key && n.type === u.type) b[d] = void 0; else for (h = 0; h < m; h++) {
                if ((u = b[h]) && n.key == u.key && n.type === u.type) {
                    b[h] = void 0;
                    break
                }
                u = null
            }
            if (c = j(e, n, u = u || _, o, r, s, i, a), (h = n.ref) && u.ref != h && (g || (g = [])).push(h, c, n), null != c) {
                if (null == f && (f = c), null != n._lastDomChild) c = n._lastDomChild, n._lastDomChild = null; else if (s == u || c != i || null == c.parentNode) {
                    e:if (null == i || i.parentNode !== e) e.appendChild(c); else {
                        for (p = i, h = 0; (p = p.nextSibling) && h < m; h += 2) if (p == c) break e;
                        e.insertBefore(c, i)
                    }
                    "option" == l.type && (e.value = "")
                }
                i = c.nextSibling, t(l.type) && (l._lastDomChild = c)
            }
        }
        return d++, n
    }), l._dom = f, null != s && !t(l.type)) for (d = s.length; d--;) null != s[d] && A(s[d]);
    for (d = m; d--;) null != b[d] && R(b[d], b[d]);
    if (g) for (d = 0; d < g.length; d++) T(g[d], g[++d], g[++d])
}, j = (e, l, n, o, r, i, a, d) => {
    let h, u = l.type;
    if (void 0 !== l.constructor) return null;
    if (t(u)) {
        let t = l.props;
        l._component = u;
        let s = null != (h = u(t)) && h.type == N && null == h.key;
        l._children = z(s ? h.props.children : h), I(e, l, n, o, r, i, a, d)
    } else l._dom = ((e, l, n, o, r, i, a) => {
        let d, h = n.props, u = l.props, c = l.type;
        if (r = "svg" === c || r, null == e && null != i) for (d = 0; d < i.length; d++) {
            const t = i[d];
            if (null != t && (null === c ? 3 === t.nodeType : t.localName === c)) {
                e = t, i[d] = null;
                break
            }
        }
        if (null == e) {
            if (null === c) return s.createTextNode(u);
            e = r ? s.createElementNS("http://www.w3.org/2000/svg", c) : s.createElement(c), i = null
        }
        if (null === c) null != i && (i[i.indexOf(e)] = null), h !== u && (e.data = u); else if (l !== n) {
            null != i && (i = k.slice.call(e.childNodes));
            let s = (h = n.props || _).dangerouslySetInnerHTML, d = u.dangerouslySetInnerHTML;
            if (!a) {
                if (h === _) {
                    h = {};
                    for (let t = 0; t < e.attributes.length; t++) h[e.attributes[t].name] = e.attributes[t].value
                }
                (d || s) && (d && s && d.__html == s.__html || (e.innerHTML = d && d.__html || ""))
            }
            ((e, l, n, o, r) => {
                let s;
                for (s in n) s in l || H(e, s, null, n[s], o);
                for (s in l) r && !t(l[s]) || "value" === s || "checked" === s || n[s] === l[s] || H(e, s, l[s], n[s], o)
            })(e, u, h, r, a), l._children = l.props.children, d || I(e, l, n, o, "foreignObject" !== l.type && r, i, _, a), "value" in u && void 0 !== u.value && u.value !== e.value && (e.value = null == u.value ? "" : u.value), "checked" in u && void 0 !== u.checked && u.checked !== e.checked && (e.checked = u.checked)
        }
        return e
    })(n._dom, l, n, o, r, i, d);
    return l._dom
}, D = function (e, t, l) {
    if (t = E({}, t), arguments.length > 3) {
        l = [l];
        for (let e = 3; e < arguments.length; e++) l.push(arguments[e])
    }
    null != l && (t.children = l);
    let n = t.ref, o = t.key;
    return null != n && delete t.ref, null != o && delete t.key, O(e, t, o, n)
}, F = (e, t) => {
    let l = t._children;
    e = D(N, null, [e]), j(t, t._children = e, l || _, _, void 0 !== t.ownerSVGElement, l ? null : k.slice.call(t.childNodes), _)
};
let $ = "props", B = Symbol(), W = ":host, *, *::before, *::after {box-sizing: border-box;} ", G = {};
const P = e => {
    for (; e.parentNode && (e = e.parentNode);) if (e instanceof ShadowRoot) return e;
    return document
};

class J extends HTMLElement {
    constructor() {
        super(), this.context = G, this.unsubs = [], this.state = {};
        let {initAttrs: l, shadow: n, rootSheet: o, noRerender: r, tag: s} = this.constructor,
            i = n ? this.attachShadow({mode: ["open", "closed"].includes(n) ? n : "open"}) : this;
        this[$] = {}, this.render = this.render.bind(this), this.mounted = new Promise(e => this._mount = e);
        const a = (t, l) => {
            let o = n ? i : P(this), r = "";
            return [].concat(t).forEach(t => {
                if (h && !l) {
                    let l = e(t) ? t[0] : t;
                    l && ![].concat(o.adoptedStyleSheets).includes(l) && (o.adoptedStyleSheets = [...o.adoptedStyleSheets, l])
                } else e(t) && t[1] && (r += t[1])
            }), r
        };
        let d = "", g = 0, b = !1;
        const m = ({css: e, noResets: t, globalFallback: l, useStyleTag: r, styleSheets: i, children: c}) => {
            if (g > 0) return console.error("<css/> should only be used once. Use a style tag to include additional styles."), null;
            if (g++, !1 !== b) return b;
            let p = e || c || "";
            return !t && n && (p = W + p), h && !r ? (a([o]), 0 === o.cssRules.length && o.replaceSync(p), i && a(i), b = null) : (d = p + a([o], !0) + (i ? a(i, !0) : ""), l && !f[s] ? (f[s] = !0, u(d), b = null) : b = D("style", null, d)), b
        };
        let y;
        const v = ({children: e, ...t}) => {
            if (!this.hasMounted && w(t)) return y = !0, e;
            if (y && w(t)) return e;
            y = !1;
            let l = {}, n = 0, o = this.attributes;
            for (n = o.length; n--;) {
                let e = o[n].name;
                l["class" === e ? "className" : e] = o[n].value
            }
            for (let e in t) H(this, e, t[e], l[e], !1);
            return e
        };
        this.setState = e => (x(this.state, t(e) ? e(this.state) : e || {}), this.update()), this.observeObi = e => [].concat(e).forEach(e => e.$onChange && this.unsubs.push(e.$onChange(this.update)));
        const S = () => (this._watchesForStyleUpdates && (this[$].style = p(this.style.cssText)), [x({
            Host: v,
            CSS: m,
            host: this
        }, this[$]), this.state, this.context]), _ = () => {
            let e = S();
            this.willMount(...e), this.willRender(...e), F(this.render(...e), i), g = 0, c(() => {
                this.unsubs.push(this.lifeCycle(...e)), this.didRender(...e), this.didMount(...e), this.hasMounted = !0
            })
        }, k = () => {
            let e = S(), t = this.willRender(...e);
            this.willUpdate(...e), this.shouldUpdate && (t = this.shouldUpdate(...e)), r || !t && void 0 !== t || (F(this.render(...e), i), g = 0, this.didUpdate(...e), this.didRender(...e))
        };
        let C;
        this.update = () => (this.processing || (this.processing = this.mounted.then(e => {
            this.hasMounted ? k() : _(), this.processing = !1
        })), this.processing), this.emit = (e, t, l, n) => (l || this).dispatchEvent(new CustomEvent(e, x({
            detail: t,
            bubbles: !0,
            composed: !0
        }, n || {}))), this.destroy = () => {
            C || (F(null, i), this.unsubs.forEach(e => t(e) && e()), C = !0)
        };
        let N = l.length;
        for (; N--;) l[N](this);
        this.update()
    }

    connectedCallback() {
        this.hasMounted || (this.state.$onChange && this.unsubs.push(this.state.$onChange(this.update)), this.observe && this.observeObi(this.observe), this._mount())
    }

    disconnectedCallback() {
        this.isConnected || (this.destroy(), this.willUnmount())
    }

    attributeChangedCallback(e, t, l) {
        this[B] !== e && t !== l && ("style" === e && this._watchesForStyleUpdates ? this.update() : this[y(e)] = l)
    }

    static get observedAttributes() {
        let {propTypes: e, prototype: t} = this;
        if (this.initAttrs = [], !e) return [];
        let l = Object.keys(e).map(l => {
            let n = m(l), o = e[l].name ? {type: e[l]} : e[l];
            return l in t || S(t, l, {
                get() {
                    return this[$][l]
                }, set(e) {
                    let {value: t, error: r} = g(e, o.type);
                    r && null != t && console.error(`[${l}] must be type [${o.type.name}]`), t !== this[$][l] && (o.reflect && this.mounted.then(() => {
                        this[B] = n, b(this, n, o.type !== Boolean || t ? t : null), this[B] = !1
                    }), this[$][l] = t, this.update())
                }
            }), o.value && this.initAttrs.push(e => e[l] = o.value), n
        });
        return this.prototype._watchesForStyleUpdates = l.includes("style"), l
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

const q = (e, t, l = {}) => {
    var n, o;
    let r, s = t.prototype instanceof J;
    return h && (r = new CSSStyleSheet), s && (t.rootSheet = r, t.tag = e), customElements.define(e, s ? t : (o = n = class extends J {
        constructor(...e) {
            super(...e), this.render = t
        }
    }, n.rootSheet = r, n.tag = e, n.propTypes = l.propTypes, n.shadow = l.shadow, n.noRerender = l.noRerender, o)), t => D(e, t)
};
var V, X;
q("x-root", ({Host: e, CSS: t}) => D(e, null, D(t, {globalFallback: !0}, ':root{--primary1:#485be4;--primary2:#4cd0e1;--primary3:#673AB7;--error:#ff3058;--warning:#ffb231;--success:#13caab;--bg1:#fff;--bg2:#fff;--shade1:#fbfdfe;--shade2:#fafcfd;--shade3:#f8fafb;--shade4:#f2f6fa;--shade5:#e9f1f7;--shade6:#e0ebf3;--shade7:#dae6f1;--shade8:#d3e2ee;--shade9:#cedfec;--shade10:#c8dae9;--zIndexToast:9000;--zIndexDropdown:8000;--zIndexModal:7000;--zIndexNav:6000;--zIndexDrawer:5000;--zIndexOverlay:4000;--shadow1:0px 4px 19px 1px rgba(150, 160, 229, 0.18);--shadow2:0px 6px 19px 2px rgba(150, 160, 229, 0.28);--shadow3:1px 7px 12px 1px rgba(142, 151, 219, 0.54);--spacing:20px;--navHeight:56px;--containerWidth:1280px;--gridGutter:10px;--drawerWidth:320px;--dropDownListMaxHeight:25vh;--dropDownListWidth:100%;--lazyImgBlurDuration:600ms;--avatarSize:50px;--fallbackAvatarIconColor:white;--textFieldBackground:transparent;--overlayRgba:rgba(250, 252, 255, 0.65);--toastWidth:365px;--inkOpacity:0.3;--inkColor:#c8dae9;--fontFamily:\'Montserrat\',"Helvetica Neue",-apple-system,"Segoe UI","Roboto",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";--fontSize:17px;--fontWeight:500;--fontColor:#070737;--fontLighter:rgba(7, 7, 55, 0.53);--lineHeight:120%;--textFieldLineHeight:22px;--paragraphLineHeight:1.5;--letterSpacing:0.3px;--contrast:white;--fontWeightBold:700;--iconColor:#070737;--borderRadius:10px;--duration1:300ms;--transition:all 300ms cubic-bezier(0.19, 1, 0.22, 1)}html{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;overflow-x:hidden}html,body{height:100%;width:100%;margin:0;padding:0;display:flex;flex-direction:column;flex:1 0 auto;background:var(--bg1);font-family:var(--fontFamily);letter-spacing:var(--letterSpacing);color:var(--fontColor);font-size:var(--fontSize)}*,*::before,*::after{box-sizing:border-box}x-root{display:flex;flex-direction:column;width:100%;min-height:100%;-webkit-overflow-scrolling:touch;flex:1 0 auto}::-webkit-scrollbar{width:12px;background-color:var(--shade2)}::-webkit-scrollbar-thumb{border-radius:20px;background-color:var(--shade4)}*{flex-shrink:1}.w100{width:100%}'))), q("x-box", (X = V = class extends J {
    constructor(...e) {
        super(...e), this.count = 0
    }

    componentDidMount() {
    }

    render({Host: e, CSS: t, style: l}) {
        return D(e, {
            style: {
                ...l,
                border: "3px solid blue",
                height: 300
            }
        }, D(t, null, ":host{display:block;height:500px;width:500px;background:#f0f8ff}"), D("button", {
            onClick: () => {
                console.log("click", this.count), this.emit("testEvent", "heyyooo: " + this.count++)
            }
        }, " emit"), D("button", {
            onClick: () => {
                console.log("click", this.count), this.emit("testEvent", "heyyooo: " + this.count++)
            }
        }, " emit"), D("button", {
            onClick: () => {
                console.log("click", this.count), this.emit("testEvent", "heyyooo: " + this.count++)
            }
        }, " emit"))
    }
}, V.shadow = !0, V.propTypes = {style: String}, X)), q("x-app", class extends J {
    constructor() {
        super(), this.logEvent = ({detail: e}) => {
            console.log("event detail", e)
        }, this.state = {bool: !0}
    }

    render({Host: e, CSS: t}, {bool: l}) {
        return D("host", null, D("css", null), D("button", {
            onClick: () => {
                console.log("clicky click"), this.setState(({bool: e}) => ({bool: !e}))
            }
        }, "toggle bool"), l && D("x-box", {ontestEvent: this.logEvent, style: {border: "2px solid red"}}))
    }
}), document.getElementsByTagName("x-root")[0].appendChild(document.createElement("x-app"));
