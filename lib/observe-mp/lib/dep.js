import { remove } from "./utils";

let uid = 0;
/**
 * 这是一个收集依赖的框，每个对象都拥有它，每个对象的属性都闭包拥有它
 */
export default class Dep {
    constructor () {
        this.id = uid++;
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        remove(this.subs, sub);
    }
    // 收集依赖
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    // 触发更新
    notify() {
        const subs = this.subs.slice(); // 复制观察则队列数组
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
};
// 全局
Dep.target = null;
const targetStack = [];

export function pushTarget (_target) {
    if (Dep.target) {
        targetStack.push(Dep.target);
    }
    Dep.target = _target;
}
export function popTarget() {
    Dep.target = targetStack.pop();
}