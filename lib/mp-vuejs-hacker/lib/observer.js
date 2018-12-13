import { def } from './utils';
import { arrayMethods } from './array';
class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        def(value, '__ob__', this);
        if (Array.isArray(value)) {
            // 数组继承部分修改过的方法
            protoAugment(value, arrayMethods);
            this.observerArray(value);
        } else {
            this.walk(value);
        }
    }
    // 使值的属性值改变都是响应的
    walk(value) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]]);
        }
    }
};
function protoAugment (target, src) {
    target.__proto__ = src;
};
export function defineReactive (obj, key, val, customSetter, shallow) {
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    // 若不可配置，则直接返回
    if (property && property.configurable === false) {
        return;
    }
    // 保存原有的getter和setter
    const getter = property && property.get;
    const setter = property && property.set;
    let childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
        enumberable: true,
        configurable: true,
        get: function reactiveGetter () {
            const value = getter ? getter.call(obj) : val;
            // 属性值的依赖收集
            if (Dep.target) {
                dep.depend();
                // 涉及属性改动的依赖收集
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter (newVal) {
            const value = getter ? getter.call(obj) : val;
            // 后面括号的是判断是否isNaN
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return;
            }
            if (customSetter) {
                customSetter();
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            // 修改过后，新的childOb
            childOb = !shallow && observe(newVal);
            // 触发更新
            dep.notify();
        }
    });
};
// 数组收集依赖
function dependArray (value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}
