# Validator 校验策略类
> 鉴于在编写业务过程中会带有不同的数据校验代码，写`Validator`类的主要目的是规范和减少不必要的校验代码。

# 使用方法
## 只使用类
不带有任何内置的校验方法，实例化之后可自行扩展增加
```js
import { Validator } from 'path/to/validator';
const validator = new Validator();
```