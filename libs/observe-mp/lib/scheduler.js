import { nextTick } from './utils';
// 最大更新数量
export const MAX_UPDATE_COUNT = 100;
// 更新队列
const queue = [];
// 记录已进队列的watcher的id
let has = {};
// 循环队列
let circular = {};
// 是否在执行队列中（被冲洗）
let flushing = false;
// 执行队列的当前被执行的watcher队列索引
let index = 0;
// 是否等待
let waiting = false;

function resetSchedulerState () {
    index = queue.length = 0;
    has = {};
    circular = {};
    waiting = flushing = false;
};

function flushSchedulerQueue () {
    flushing = true;
    let watcher, id;
    // 在队列执行之前对队列从小到大进行排序
    // 这样保证：（原Vuejs的注释大意）
    // 1. 组件的更新是从父组件到子组件。（因为父组件总是在子组件之前创建的）
    // 2. 一个组件的 user watchers 在渲染watcher之前执行（因为 user watchers 总是在渲染watcher之前创建）
    // 3. 如果一个组件在父组件的watchers执行时被销毁了，那么该组件的watchers将会被跳过
    queue.sort((a, b) => a.id - b.id);
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run();
        if (has[id] != null) {
            circular[id] = (circular[id] || 0) + 1; // 记录当前watcher对应的所在的队列长度
            if (circular[id] > MAX_UPDATE_COUNT) {
                console.warn(
                    'You may have an infinite update loop ' + (
                        watcher.user
                          ? `in watcher with expression "${watcher.expression}"`
                          : `in a component render function.`
                      ),
                      watcher.page
                );
                break;
            }
        }
    }
    // 重置任务队列的状态
    resetSchedulerState();
};

export function queueWatcher (watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
            // 不在执行队列时
            queue.push(watcher);
        } else {
            // 若正在执行队列，将此watcher根据id的顺序插入队列中
            // 若已经过了id，此watcher将立即执行
            let i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            // 插入队列
            queue.splice(i + 1, 0, watcher);
        }
        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue);
        }
    }
};
