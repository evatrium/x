import {def, extend, isFunc, isObj, Subie} from "./utils";
import {h} from "./vdom";

export const obi = (suspect, branchNotify) => {
    const {sub, notify} = Subie();
    let makeObi = obj => {
        if (obj.$obi) return obj;
        def(obj, '$obi', {enumerable: false, value: true});
        def(obj, '$batching', {enumerable: false, value: {active: false}});
        def(obj, '$onChange', {enumerable: false, value: update => sub(update)});
        !branchNotify && def(obj, '$uniqueNotifiers', {enumerable: false, value: true});
        def(obj, '$getState', {
            enumerable: false,
            value: () => Object.keys(obj).reduce((acc, curr) =>
                !isFunc(obj[curr]) ? (acc[curr] = (isObj(obj[curr]) && obj[curr].$obi)
                    ? obj[curr].$getState() : obj[curr], acc) : acc, {})
        });
        def(obj, '$merge', {
            enumerable: false,
            value: (update, ignoreUpdate) => {
                obj.$batching.active = true;
                isFunc(update) ? update(suspect) : extend(suspect, update);
                obj.$batching.active = false;
                !ignoreUpdate && notify(suspect);
            }
        });
        for (let key in obj) {
            let internal = obj[key];
            if (isFunc(internal) || key.startsWith('$')) continue;
            if (isObj(internal)) internal = branchNotify ? makeObi(obj[key]) : obi(obj[key]);
            def(obj, key, {
                enumerable: true,
                get: () => internal,
                set(value) {
                    if (value === internal) return;
                    internal = value;
                    if (!suspect.$batching.active) notify(suspect);
                },
            });
        }
        return obj
    };
    return makeObi(suspect);
};

const setProps = (propsObj, target) => {
    for (let i in propsObj) target[i] = propsObj[i];
};

export const obiHOC = (Component_, obiObj, applyProps) => {
    let _ref, subscribed, observer, unsubs = [],
        update = () => {
            setTimeout(() => { // wait a tick till mounted
                if (subscribed) return;
                subscribed = true;
                observer = new MutationObserver(mutationsList => {
                    if ([...mutationsList[0].removedNodes].includes(ref)) {
                        observer.disconnect();
                        unsubs.forEach(s => s());
                        subscribed = false
                    }
                });
                let firstResults = applyProps(_ref, obiObj);
                if (isObj(firstResults)) setProps(firstResults, _ref);
                observer.observe(_ref.parentNode, {childList: true});
                [].concat(obiObj).forEach(o => {
                    unsubs.push(o.$onChange(data => {
                        let results = applyProps(_ref, data);
                        if (isObj(results)) setProps(results, _ref);
                    }))
                });
            })
        };
    return ({ref, children, ...props}) => {
        update();
        return <Component_ ref={r => (ref && ref(r), _ref = r)} {...props}>
            {children}
        </Component_>
    };
};

// const OverlayHoc = obiHOC(Overlay, overlay, () => ({
//     active: overlay.active
// }));

