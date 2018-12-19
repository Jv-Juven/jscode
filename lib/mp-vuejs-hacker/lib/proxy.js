const noop = function () {};
// 定义对象的属性值
export const define = function (target, key, descriptor) {
    return Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        // value: descriptor.value,
        get: descriptor.get || noop,
        set: descriptor.set || noop
        // writable: true
    });
};
// 代理小程序实例的属性
export const proxyMPdata = function (target, src) {
    // var value; // 保存在闭包中的每个属性的值
    for (let key in src) {
        // console.log('key', key);
        // if (key === 'data') {
        //     proxyKey = '$' + key;
        // } else {
        //     proxyKey = key;
        // }
        // 因小程序中 target.data === src 在代理target的data属性时会有冲突，故 data 不做代理
        if (key === 'data') {
            continue;
        }
        // value = src[key];
        // console.log('value', value);
        define(target, key, {
            get: function () {
                // val = src[key];
                // console.log('key', key);
                return src[key];
            },
            set: function (val) {
                // value = val;
                return target.setData({
                    [key]: val
                });
            }
        });
    }
}