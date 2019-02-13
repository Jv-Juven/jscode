import Vue from 'vue'; // 引入vue
import store from '@/store'; // 引入store
const listen = function userGetter(vm, methods) {
    for (let name in methods) {
        vm.$on(name, methods[name]);
    }
};
const mapGetters = function (array) {
    if (array.length === 0) {
        return {};
    }
    let result = {};
    for (let val of array) {
        result[val] = function () {
            return store.getters[val];
        };
    }
    return result;
};
/**
 * 嵌入组件的弹出设置
 * @param {Object} tpl vue文件，即模板配置文件
 */
const ISSHOWNAMES = [];
export default function (tpl) {
    /**
     * 全局组件调用函数，可默认在computed注入store的getters数据，内部组件的显示与隐藏的字段名必须是isShowDialog
     * @param {Object} options 传入的配置
     * @param {vm} parentVm 方法调用的vue组件实例
     * 说明：options 子组件属性
     * - props 功能同子组件的props，直接传值即可
     * - events 父级组件监听子组件的函数，推荐使用箭头函数，否则this会指向子组件本身
     * - unique {Boolean} 是否唯一弹窗 默认：true
     */
    return function (options = {}, parentVm = null) {
        const Template = Vue.extend(Object.assign({}, tpl, {
            store: parentVm ? parentVm.$store : store
        }));
        options.unique = options.unique === undefined ? true : options.unique;
        const $vm = new Template({
            propsData: options.props || {},
            parent: parentVm,
            computed: Object.assign({}, {
                ...mapGetters([])
            }, tpl.computed)
        });
        // 一次只生成一个同名弹窗
        if (options.unique && ISSHOWNAMES.indexOf(tpl.name) > -1) {
            $vm.$destroy();
            return;
        }
        listen($vm, options.events || {});
        const el = $vm.$mount().$el;
        const id = tpl.name;
        const oldEl = document.getElementById(id);
        // 解决重复引入同一个组件的问题
        if (oldEl) {
            oldEl.remove();
        }
        el.id = id;
        document.body.appendChild(el);
        ISSHOWNAMES.push(tpl.name);
        // 修改组件内变量以显示组件
        $vm.isShowDialog = true;
        $vm.$watch('isShowDialog', function (value) {
            if (!value) {
                ISSHOWNAMES.splice(ISSHOWNAMES.indexOf(tpl.name), 1);
                setTimeout(function () {
                    $vm.$destroy();
                    // 被销毁之后移除对应的dom
                    el.remove();
                }, 600);
            }
        });
    };
};
