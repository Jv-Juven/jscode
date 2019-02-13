# popupDialog

> `vue-cli@2.0`脚手架下载的项目模板，使用`element-ui@2.4.9`的项目，封装了调用[**Dialog 对话框**](http://element-cn.eleme.io/#/zh-CN/component/dialog)的调用。简化调用弹窗的步骤和代码，便于后期维护。

## 使用

### 新建一个调用函数
```js
// path/to/main.js
import index from 'path/to/index.vue'; // 使用el-dialog组件的vue文件
import popupDialog from 'path/to/popupDialog';
export default popupDialog(index);
```
```js
// path/to/index.vue
<template>
    <el-dialog
        :visible.sync="isShowDialog"
    >
    content
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                isShowDialog: false
            };
        }
    };
</script>
```
业务调用：
```js
import pop from 'path/to/main';
pop({
    // 监听的事件
    events: {
        // 事件名称
        someEvent: (val) => {
            // 这里使用箭头函数，this指向当前调用的函数作用域
            this.somedata = val;
        }
    },
    // 传入的数据，同vuejs的props
    props: {
        propA: true,
        propB: 'popupDialog.js'
    }
});
```
