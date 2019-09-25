import {def, extend, isFunc, isObj, Subie} from "./utils";

export const obi = suspect => {
    const {sub, notify} = Subie();
    let makeObi = obj => {
        if (obj.$obi) return obj;
        def(obj, '$obi', {enumerable: false, value: true});
        def(obj, '$batching', {enumerable: false, value: {active: false}});
        def(obj, '$onChange', {enumerable: false, value: update => sub(update)});
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
            if (isObj(internal)) internal = makeObi(obj[key]);
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

export const obiHOC = (component, obiObj, applyProps) => {
    let ref, subscribed, unsubscribe, observer,
        update = () => {
            setTimeout(() => { // wait a tick till mounted
                if (subscribed) return;
                subscribed = true;
                observer = new MutationObserver(mutationsList => {
                    if ([...mutationsList[0].removedNodes].includes(ref)) {
                        observer.disconnect();
                        unsubscribe();
                        subscribed = false
                    }
                });
                observer.observe(ref.parentNode, {childList: true});
                applyProps(ref, obiObj);
                unsubscribe = obiObj.$onChange((data) => applyProps(ref, data));
            })
        };
    return (props, children) => {
        update();
        return component(extend(props, {ref: r => ref = r}), children)
    }
};
