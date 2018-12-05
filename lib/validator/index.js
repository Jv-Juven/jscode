/** validator
 * Usage:
 * import validator from '@/utils/validator';
 * // 触发校验
 * const errMsgs = validator.check(666, 'isString|max:16|min:6', {
 *  max: '不多于16',
 *  min: '不少于6',
 *  isString: '不是字符串'
 * });
 * // 对象形式
 * const errMsgs = validator.check({
 *    value: '666',
 *    rules: 'isString|max:16|min:6', // `${策略名1}:${参数1},${参数2}|${策略名2}:${参数1}|${策略名3}`
 *    errorMsgs: {
 *      max: '不多于16',
 *      min: '不少于6',
 *      isString: '不是字符串'
 *    }
 * });
 * // 对象形式 —— 自定义验证规则 rules 可为 函数 或 (函数|字符串规则)数组
 * const errMsgs = validator.check({
 *    value: '666',
 *    rules: function ( value ) {
 *      return {
 *          valid: value.length > 0,
 *          errorMsg: '字符串长度必须大于零' // 优先获取此提示信息
 *      };
 *      // 或者 return value.length > 0
 *    },
 *    errorMsgs: '字符串长度必须大于零'
 * });
 * const errMsgs = validator.check(666, 'isString|max:16|min:6', '通用的每一个校验策略不通过提示');
 * // 数组形式
 * const errMsgs = validator.check([
 *  {
 *    value: '666',
 *    rules: 'isString|max:16|min:6', // `${策略名1}:${参数1},${参数2}|${策略名2}:${参数1}|${策略名3}`
 *    errorMsgs: {
 *      max: '不多于16',
 *      min: '不少于6',
 *      isString: '不是字符串'
 *    }
 *  }
 * ]);
 * console.log(errMsgs, validator.errMsgs, validator.getStrategies());
 */
import * as strategies from './rules';
class Validator {
    constructor(strategies = {}) {
        // 验证结果
        this.errMsgs = [];
        // 验证策略
        this.strategy = {
            min(value = '', minLength = 0) {
                return value.length >= minLength;
            },
            max(value = '', maxLength = 0) {
                return value.length <= maxLength;
            }
        };
        // 实例化时增加策略
        this.addStrategy(strategies);
    }
    // 初始化数据
    init() {
        this.errMsgs = [];
    }
    /**
     * 值是否为指定的类型
     * @param {Any} value 要校验的值
     * @param {String} type 校验的值是否该类型
     */
    isType(value, type) {
        type = type.replace(/^\w/, match => match.toUpperCase());
        return Object.prototype.toString.call(value) === `[object ${type}]`;
    }

    /**
     * 添加策略方法
     * @param {Object} strategies 策略方法对象
     */
    addStrategy(strategies = {}) {
        // console.log(strategies);
        // return;
        if (!this.isType(strategies, 'Object')) {
            console.error('添加策略参数必须为object对象');
            return;
        }
        for (const key in strategies) {
            const fn = strategies[key] || function () {};
            if (!this.isType(fn, 'Function')) {
                console.error('策略必须为函数');
                return;
            }
            if (this.strategy[key]) {
                console.warn(`${key}策略被覆盖`);
            }
            this.strategy[key] = fn;
        }
    }

    /**
     * 获取策略方法
     */
    getStrategies() {
        return this.strategy;
    }

    /**
     * 触发验证，每次校验的错误数据会叠加
     * @param {String or Object} value 验证的值
     * @param {String} rules 验证规则 "min:8|max:16"
     * @param {Object} errorMsgs 验证错误提示信息 { rule1: msg1, rule2: msg2 }
     */
    emit(value, rules, errorMsgs) {
        // this.init();
        if (this.isType(value, 'Array') && rules === undefined) {
            value.forEach((item) => {
                const {
                    value,
                    rules,
                    errorMsgs
                } = item;
                this.emit(value, rules, errorMsgs);
            });
        } else if (this.isType(value, 'Object') && rules === undefined) {
            const {
                rules,
                errorMsgs
            } = value;
            this.emit(value.value, rules, errorMsgs);
        } else {
            // 规则为数组
            if (this.isType(rules, 'array')) {
                for (let i = 0, l = rules.length; i < l; i++) {
                    this.emit(value, rules[i], errorMsgs);
                    if (this.errMsgs.length > 0) {
                        break;
                    }
                }
            }
            // 规则为字符串表示形式
            if (this.isType(rules, 'string')) {
                const ruleArray = rules.split('|');
                try {
                    for (let i = 0, length = ruleArray.length; i < length; i++) {
                        const validUnit = ruleArray[i].split(':');
                        const strategy = validUnit[0]; // 策略名称
                        const param = (validUnit[1] || '').split(','); // 参数
                        if (!this.strategy[strategy]) {
                            console.error(`[${strategy}]策略不存在`);
                            continue;
                        }
                        // 验证否失败
                        if (!this.strategy[strategy](value, ...param)) {
                            this.errMsgs.push(errorMsgs[strategy] || errorMsgs || '参数错误，请重试');
                        }
                    }
                } catch (e) {
                    console.error(`rules 格式不正确，您的rules：${rules}`);
                }
            }
            // 规则为函数
            if (this.isType(rules, 'function')) {
                // 验证是否失败
                let result = rules(value); // 返回：{ valid: false, errorMsg: '错误信息' }
                // console.log('rules', arguments, result);
                if (result === false || (this.isType(result, 'object') && !result.valid)) {
                    let msg = result === false ? errorMsgs : result.errorMsg;
                    this.errMsgs.push(msg);
                    // console.log('验证失败', this.errMsgs);
                }
            }
        }
    }
    /**
     * 业务校验，每次校验调用一次的方法
     * @param {Any} args 说明中几种形式的入参
     * @return {Array} 校验的错误信息数组，为空数组表示校验通过
     */
    check(...args) {
        validator.init();
        validator.emit(...args);
        return this.errMsgs;
    }
};
// 实例化
const validator = new Validator();
// 批量添加策略
validator.addStrategy(strategies);

export default validator;
// export {
//     Validator
// };
/**
 * // 实例一个校验对象
 * var v = new Validator();
 * // 添加策略
 * Validator.addStrategy({
 *  isString(value) {
 *      return Object.prototype.toString.call(value) === '[object String]';
 *  }
 *});
 */
