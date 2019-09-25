import { isArray, isObj, createElement, appendChild, extend} from "./utils";
import {obi} from "./obi";

export const createRouting = () => {
    let w = window,
        toValue = (mix) => {
            if (!mix) return '';
            var str = decodeURIComponent(mix);
            if (str === 'false') return false;
            if (str === 'true') return true;
            return (+str * 0 === 0) ? (+str) : str;
        },
        getParams = (str) => {
            let tmp, k, out = {}, indi;
            str = str || w.location.search;
            indi = str.indexOf("?");
            if (indi < 0) return;
            str = str.substr(indi + 1);
            let arr = str.split('&');
            while (tmp = arr.shift()) {
                tmp = tmp.split('=');
                k = tmp.shift();
                if (out[k] !== void 0) out[k] = [].concat(out[k], toValue(tmp.shift()));
                else out[k] = toValue(tmp.shift());
            }
            return out;
        },
        stringifyParams = (obj) => {
            var enc = encodeURIComponent, k, i, tmp, str = '';
            for (k in obj) {
                if ((tmp = obj[k]) !== void 0) {
                    if (isArray(tmp)) {
                        for (i = 0; i < tmp.length; i++) {
                            str && (str += '&');
                            str += enc(k) + '=' + enc(tmp[i]);
                        }
                    } else {
                        str && (str += '&');
                        str += enc(k) + '=' + enc(tmp);
                    }
                }
            }
            return '?' + str;
        },
        getLocation = () => {
            let {pathname, search} = w.location;
            return {url: pathname + search, pathname, search, params: getParams()}
        },
        setUrl = (path, search, type) => {
            search = isObj(search) ? stringifyParams(search) : search;
            w.history[type + 'State'](null, null, path + search)
        },

        initLoc = getLocation(),

        {url: _lastUrl, pathname: _lastPathname} = initLoc;

    let routing = obi({
        // pre-pending with $ ignores updates when setting them
        $lastUrl: _lastUrl,
        $lastPathname: _lastPathname,
        $lastType: 'initial',
        ...initLoc,
        getParams,
        stringifyParams,
        getLocation,
        route(path, search, type) {
            type = type || 'push';
            path = path || location.pathname;
            search = search || '';
            const {pathname, url} = getLocation();
            if (type !== 'replace') (_lastUrl = url, _lastPathname = pathname);
            setUrl(path, search, type);
            type === 'replace'
                ? setTimeout(() => updateLocation({type}))
                : updateLocation({type});
        }
    });

    routing.routerSwitch = ({root, pathMap, noMatch}) => {
        let next = null, toLast = false,
            {pathname, $lastPathname, $lastUrl, $lastType, url} = routing,
            noChange = url === $lastUrl;
        noMatch = noMatch || '/';
        if (root) next = pathMap['/' + pathname.split('/')[1]] || pathMap[noMatch];
        else if (pathMap[pathname]) next = pathMap[pathname];
        else if ($lastPathname !== pathname && pathMap[$lastPathname]) {
            routing.route($lastUrl, location.search, 'replace');
            next = pathMap[$lastPathname];
            toLast = true;
        } else if (noMatch && pathMap[noMatch]) {
            routing.route(noMatch, location.search, 'replace');
            next = pathMap[noMatch];
        }
        return {next, toLast, noChange, replacedLast: $lastType === 'replace'};
    };

    var updateLocation = (e) => {
        routing.$merge({
            ...getLocation(),
            $lastUrl: e.type === 'popstate' ? routing.url : _lastUrl,
            $lastPathname: e.type === 'popstate' ? routing.pathname : _lastPathname,
            $lastType: e.type
        })
    };

    w.addEventListener("popstate", updateLocation);

    return routing;
};

export const routing = createRouting();


export const CustomElementsRouter = ({transition, pathMap, noMatch, loadingIndicator, lazyMap}) => {

    transition = typeof transition === 'number'
        ? transition : transition === true ? 150 : 0;

    var initial = true, elem, getMountPoint, timeout,
        unsub, transitionStyle = `opacity ${transition}ms ease-in-out`,
        {routerSwitch} = routing, CE = customElements,
        clearMountingPoint = (e) => {
            let child = e.lastElementChild;
            while (child) (e.removeChild(child), child = e.lastElementChild)
        },
        m = (parentNode, elem) => (clearMountingPoint(parentNode), appendChild(parentNode, elem)),
        mount = (elementName, parentNode) => {
            clearTimeout(timeout);
            elem = createElement(elementName);
            if (initial || !transition) return m(parentNode, elem);
            extend(parentNode.style, {transition: transitionStyle, opacity: 0});
            timeout = setTimeout(() => {
                m(parentNode, elem);
                extend(parentNode.style, {transition: transitionStyle, opacity: 1})
            }, transition ? transition + 10 : 0);
        },
        mountLazy = (elementName, to) => {
            loadingIndicator && mount(loadingIndicator, to);
            lazyMap && lazyMap[elementName] && lazyMap[elementName]().then(() =>
                CE.whenDefined(elementName).then(() =>
                    // in case of slow network and the user decides to locate somewhere else before
                    // the request has finished, check that the pathMap matches the element name before exec the mount
                    // so that the previously requested element doesn't mount over the current
                    pathMap[location.pathname] === elementName && mount(elementName, to)));
        },
        doRoute = () => {
            let {next, toLast, noChange, replacedLast} = routerSwitch({pathMap, noMatch}),
                parentNode = getMountPoint && getMountPoint();
            if (!(parentNode && parentNode.nodeName) || toLast || replacedLast || (noChange && !initial)) return;
            next && CE.get(next) ? mount(next, parentNode) : mountLazy(next, parentNode);
        };

    return {
        mountTo: getNodeToMountToFunction => {
            unsub && unsub(); // you didn't follow directions!!!
            getMountPoint = getNodeToMountToFunction;
            doRoute();
            initial = false;
            unsub = routing.$onChange(doRoute);
            return unsub;
        }
    }
};


/*


let router = CustomElementsRouter({
    transition: 150,
    loadingIndicator: 'x-circle-loader',
    noMatch: '/0',
    pathMap: {
        '/0': 'intro-0',
        '/1': 'page-1',
    },
    lazyMap: {
        'intro-0': () => import('./pages/intro-0'),
        'page-1': () => import('./pages/page-1'),
    },
});



...

 lifeCycle() {
        return router.mountTo(() => this.page_ref);
 }

...




 */



