import { isObject } from "./utils";

const seenObjects = new Set();
export function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
};
function _traverse (val, seen) {
    let i, keys;
    const isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
        return;
    }
    // 记录每个进来的被观测的对象
    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
         // 已经收集依赖的dep实例，不需要重复收集，防止子孙级别的对象引用循环重复收集依赖
        if (seen.has(depId)) {
            return;
        }
        // 深度遍历时，记录已收集依赖的框（dep）
        seen.add(depId);
    }
    if (isA) {
        i = val.length;
        while (i--) _traverse(val[i], seen);
    } else {
        keys = Object.keys(val);
        i = keys.length;
        // 每次访问val[keys[i]]都会触发对应的getter函数，收集watcher实例依赖
        while (i--) _traverse(val[keys[i]], seen);
    }
};