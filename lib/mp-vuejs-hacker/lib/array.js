import { def } from './utils';
const arrayProto = Array.prototype;
// 继承Array的原型，继承拦截的方式拦截部分方法
export const arrayMethods = Object.create(arrayProto);
// 改变原数组的方法
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];
// 代理改变原数组方法，先求值，后观测改动的新的部分数据
methodsToPatch.forEach(function (method) {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator (...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observeArray(inserted);
        // 触发更新
        ob.dep.notify();
        // 返回最终结果
        return result;
    });
});
