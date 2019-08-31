import {context} from "./x";
import {obi} from "@iosio/obi";
import {isFunc, isObj} from "@iosio/util";

export const provide = (namespace, attach) => {
    let obj = isFunc(attach) ? obi(attach(context)) : (isObj(attach) ? obi(attach) : attach);
    return (context[namespace] = obj, obj);
};

