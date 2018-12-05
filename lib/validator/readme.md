# Validator 校验策略类
> 鉴于在编写业务过程中会带有不同的数据校验代码，写`Validator`类的主要目的是规范和减少不必要的校验代码。

# 使用方法
## 引用并使用
```js
// 你可以：
import { validator } from 'path/to/validator';
// 或者
import { Validate } from 'path/to/validator';
const validator = new Validate();
// min 和 max 规则已内置，这里做示例用
// rules = [{
//     min(value = '', minLength = 0) {
//         return value.length >= minLength;
//     },
//     max(value = '', maxLength = 0) {
//         return value.length <= maxLength;
//     }
// }];
// const validator = new Validate(rules);
// 普通用法
const errorMsgs = validator.check('666aaa', 'isNumber', '非数字');
console.log(errorMsgs); // ['非数字']
```
```js
// 多规则
const errorMsgs = validator.check('aaa', 'isNumber|validateURL', {
    isNumber: '非数字',
    validateURL: '非合法uri'
});
console.log(errorMsgs); // ['非数字', '非合法uri']
const errMsgs = validator.check({
    value: '666',
    rules: 'isString|max:16|min:6', // `${策略名1}:${参数1},${参数2}|${策名2}:${参数1}|${策略名3}`
    errorMsgs: {
       max: '不多于16',
       min: '不少于6',
       isString: '不是字符串'
    }
});
```
```js
// 校验规则为函数
const errorMsgs = validator.check(9, function (value) {
    return value > 6;
}, '必须大于6');
// 或者
const errorMsgs = validator.check(9, function (value) {
    return {
        valid: value > 6,
        errorMsg: '必须大于6'
    };
});
```
```js
// 入参为对象形式
const errorMsgs = validator.check({
    value: 'ddd',
    rules: 'isNumber',
    errorMsgs: '非数字'
});
// 或者
const errorMsgs = validator.check({
    value: 9,
    rules: function (value) {
        return value > 6;
    },
    errorMsgs: '必须大于6'
});
// 或者
const errorMsgs = validator.check({
    value: 9,
    rules: function (value) {
        return {
            valid: value > 6,
            errorMsg: '必须大于6'
        };
    }
});
```
```js
// 入参为对象数组
const errorMsgs = validator.check([
    {
        value: '666aaa', 
        rules: 'isNumber',
        errorMsgs: '非数字'
    },
    {
        value: 'AA', 
        rules: 'validateLowerCase',
        errorMsgs: '必须小写字母'
    },
    {
        value: 'https://npmjs.org', 
        rules: 'validateURL',
        errorMsgs: '非法uri'
    },
    {
        value: 100,
        rules: function (value) {
            return value < 100;
        },
        errorMsgs: '必须小于100'
    },
    {
        value: 99,
        rules: function (value) {
            return value < 100;
        },
        errorMsgs: '必须小于100'
    },
    {
        value: 101,
        rules: function (value) {
            return {
                valid: value <= 100,
                errorMsg: '不可大于100'
            }
        },
        errorMsgs: '必须小于等于100'
    },
    {
        value: 100,
        rules: function (value) {
            return {
                valid: value <= 100,
                errorMsg: '不可大于100'
            }
        },
        errorMsgs: '必须小于等于100'
    }
]);
console.log(errorMsgs); // ['非数字', '必须小写字母', '必须小于100', '不可大于100']
```
# api

## `isType` 判断值是否为指定的类型

### params
- `value` `{Any}` 校验的值 必填
- `type`  `{String}` 校验的值是否该类型 必填，开头字符可为大小写其他小写

### return
- `true`/`false` `{Boolean}` 值是否为指定的类型

### 用法
```js
import { validator } from 'path/to/validator';
if (validator.isType('333', 'isString')) {
    // do something
}

```

## `addStrategy` 为该实例添加校验策略

### params 
- `{Object}`
    - `key` 策略键名
    - `value` `{function}` 策略函数，返回布尔值，函数入参第一个为`value`，即校验的值，后面的参数为可选的校验时的入参

### 用法
```js
import { validator } from 'path/to/validator';
validator.addStrategy({
    min(value = '', minLength = 0) {
        return value.length >= minLength;
    },
    max(value = '', maxLength = 0) {
        return value.length <= maxLength;
    }
});
```

## `check` 实例触发校验函数
### params {Any} 上述说明中几种形式的入参
### return {Array} 所有校验失败的结果

# 内置实例规则
```js
// 当以下引用方式时，内置
import { validator } from 'path/to/validator';
```
默认第一个参数为需要校验的值，其余参数在第二个参数起
- `validateURL` 是否合法uri
- `validateLowerCase` 是否小写字母
- `validateUpperCase` 是否大写字母
- `validatAlphabets` 是否大小写字母
- `isValidPhone` 是否1开头的十一位手机号码
- `isValidCode` 是否指定长度的数字验证码 可选参数：`length` `{Number}` 默认为6
- `isNumber` 是否数字或者字符串类型的数字
- `isAmount` 是否为精确到两位小数的数字
- `hasOwn` 判断一个属性是定义在对象本身而不是继承自原型链 必填参数：`key` `{String}` 键名称
- `isEmptyObject` 判断对象是否空对象