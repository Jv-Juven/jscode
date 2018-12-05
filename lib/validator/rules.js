/* 合法uri */
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
};

/* 小写字母 */
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
};

/* 大写字母 */
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
};

/* 大小写字母 */
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
};

/* 手机号码 */
export function isValidPhone(str) {
    str += '';
    const reg = /^1\d{10}$/;
    return reg.test(str);
}

/* 数字验证码 */
export function isValidCode(str, length = 6) {
    length = parseInt(length);
    const regStr = `\\d{${length}}`;
    const reg = new RegExp(regStr);
    return reg.test(str);
}

/* 数字 / 纯数字的字符串（部分接口需要用到） */
export function isNumber(num) {
    const regStr = `^[0-9]*$`;
    const reg = new RegExp(regStr);
    return reg.test(num);
}
/* 金额格式，数字，最多2位小数 */
export function isAmount(str) {
    return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(str);
}
/**
 * @method hasOwn  判断一个属性是定义在对象本身而不是继承自原型链
 * @param {Object} obj 对象
 * @param {String} key 键
 * @return {Boolean}
 */
export function hasOwn(obj, key) {
    return !!Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 判断对象是否空对象
 * @param  {[object]}  obj [被测元素]
 * @return {Boolean}     [是否为空对象]
 */
export function isEmptyObject(obj) {
    let attr;
    for (attr in obj) {
        if (hasOwn(obj, attr)) {
            return false;
        }
    }
    return true;
}