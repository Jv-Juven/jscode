// const noop = function () {};
// class Watch {
//     constructor(exOrFn, cb, options) {
//         // 求值函数
//         this.expression = noop;
//         // 值
//         this.value = '';
//         // id
//         this.id = uid++;
//         if (typeof exOrFn === 'function') {
//             this.expression = exOrFn;
//         } else {
//             this.expression = function () {
//                 return this.evaluate(exOrFn);
//             };
//         }
//         // 获取值
//         this.value = this.get();
        
//     }
//     // 非函数计算求值
//     evaluate(expression) {
//         // return 
//     }
//     // 求值并收集依赖
//     get() {
//         let value;
//         value = this.expression();
//         return value;
//     }
// };
import { parsePath } from './utils';
import { pushTarget, popTarget } from './dep';
import { traverse } from './traverse';
var uid = 0;
export default class Watcher {
    constructor(page, expOrFn, cb, options) {
        this.page = page; // 页面实例
        page._watchers.push(this);
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        // 观察到变化的回调函数
        this.cb = cb;
        // watcher的唯一标记
        this.id = ++uid;
        this.active = true;
        // 非同步情况下，此值表示是否需要重新求值
        this.dirty = this.lazy;
        // 被收集的依赖的框的集合，主要用于避免重复收集依赖
        // 避免重复收集：1、当次求值；2、每次求值（主要判断当次和上次）
        // 也同样在被其他watchers依赖的时候通知改当前watcher依赖的deps收集依赖，“B依赖A，C依赖B，即C依赖A”
        this.deps = [];
        // 当次求值被收集依赖的框的集合
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.expression = '';
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
        }
        this.value = this.lazy
            ? undefined
            : this.get();
    }
    // 执行getter函数求值，重新收集依赖
    get () {
        // 将此watcher赋值到全局以便收集依赖
        pushTarget(this);
        let value;
        const page = this.page; // 小程序页面实例
        try {
            value = this.getter.call(page, page);
        } catch (e) {
            if (this.user) {
                console.error(e, page, `getter for watcher "${this.expression}"`);
            } else {
                throw e;
            }
        } finally {
            // 触及到求值依赖下所有的子孙级数据，以子孙级数据可以收集到此依赖
            if (this.deep) {
                // 深度遍历收集依赖
                traverse(value);
            }
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }
    
};