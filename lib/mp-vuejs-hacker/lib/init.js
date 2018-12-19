import Watcher from "./watcher";
import { noop, isType } from './utils';
import Dep from "./dep";
import { observe } from "./observer";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};

export function initData (page) {
    let data = page.data || {};
    const keys = Object.keys(data);
    const props = page.properties || {};
    let i = keys.length;
    while(i--) {
        const key = keys[i];
        // if (key === 'data') {
        //     continue;
        // }
        // 处理与方法同名情况
        // if (page[key]) {}
        // 处理与properties同名情况
        if (props.hasOwnProperty(key)) {
            console.warn(`data中的${key}属性已存在于properties中，请更换其他名字`);
        }
    }
    observe(data);
};

const computedWatcherOptions = { lazy: true };
export function initComputed (page, computed) {
    const watchers = page._computedWatchers = Object.create(null);
    for (const key in computed) {
        const userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        if (getter === null) {
            console.warn(`computed 属性 ${key} 没有Getter方法`);
        }
        watchers[key] = new Watcher(page, getter || noop, noop, computedWatcherOptions);
        if (!(key in page)) {
            defineComputed(page, key, userDef);
        }
    }
};
export function defineComputed (target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key);
        sharedPropertyDefinition.set = noop;
    } else {
        sharedPropertyDefinition.get = userDef.get
            ? userDef.cache !== false
                ? createComputedGetter(key)
                : userDef.get
            : noop;
        sharedPropertyDefinition.set = userDef.set
            ? userDef.set
            : noop;
    }
    if (sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
            console.warn(`Computed属性${key}已经复制，但未指定setter`);
        };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
};
function createComputedGetter (key) {
    return function computedGetter () {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    };
};
// 初始化watcher
export function initWatch (page, watch) {
    for (const key in watch) {
        const handler = watch[key];
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(page, key, handler);
            }
        } else {
            createWatcher(page, key, handler);
        }
    }
};
function createWatcher (page, keyOrFn, handler, options = {}) {
    if (isType(handler, 'object')) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = page[handler];
    }
    return _watch(keyOrFn, handler, options, page);
};
export function _watch (expOrFn, cb, options, page) {
    if (isType(cb, 'object')) {
        return createWatcher(page, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    const watcher = new Watcher(page, expOrFn, cb, options);
    if (options.immediate) {
        cb.call(page, watcher.value);
    }
    return function unwatchFn () {
        watcher.teardown();
    }
};
