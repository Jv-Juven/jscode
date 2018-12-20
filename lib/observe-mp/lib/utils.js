export const noop = function () {};
// 定义一个对象的属性值
export const def = function (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
};
// 解析字符串，只支持点(.)分隔符表达式
const bailRE = /[^\w.$]/;
export function parsePath (path) {
    if (bailRE.test(path)) {
        return;
    }
    const segments = path.split('.');
    // obj一般情况下初始的obj是指vm实例
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]];
        }
        return obj;
    }
}
// 是否对象
export function isObject (obj) {
    return obj != null && typeof obj === 'object';
};
// 异步执行函数
let callbacks = [];
let pending = false; // 是否等待
export function nextTick (cb, ctx) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            } catch (e) {
                console.error(e, ctx, 'nextTick');
            }
        } else if (_resolve) {
            // 应对无cb的情况
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        // 执行队列
        Promise
            .resolve()
            .then(() => {
                pending = false; // 因为下面代码中队列被复制，原队列被清空
                const copies = callbacks.slice(0);
                callbacks.length = 0;
                for (let i = 0; i < copies.length; i++) {
                    copies[i]();
                }
            });
            // if (isIOS) setTimeout(noop)
    }
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        });
    }
};
// 对象是否有指定属性
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
};
// 判断数据是否为指定类型
export const isType = function (data, type) {
    type = type.replace(/^\w/, (match) => match.toUpperCase() );
    return Object.prototype.toString.call(data) === `[object ${type}]`;
};
// 移除数组中的object
export const remove = function (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
};
