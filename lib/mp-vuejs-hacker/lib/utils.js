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
