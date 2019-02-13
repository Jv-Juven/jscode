/* eslint-disable */
/**
 * 清理对象的空值
 */
export const rmEmptyProp = function (object) {
    for (var prop in object) {
        if (
            object[prop] === '' ||
            object[prop] === null ||
            object[prop] === undefined
        ) {
            delete object[prop];
        }
    }
    return object;
};
/**
 * 去重函数
 * @param {Array} arr 要做去重的数组
 * @return {Array} 去重处理后的数组
 */
export const delRepeat = function (arr) {
    const obj = Object.create(null);
    for (const item of arr) {
        obj[item] = item;
    }
    return Object.keys(obj);
};
/**
 *
 * @param {Any} data 要验证的数据
 * @param {String} type 数据类型字符串
 */
export const isType = function (data, type) {
    type = type.replace(/^\w/, match => match.toUpperCase());
    return Object.prototype.toString.call(data) === `[object ${type}]`;
};
/**
 * 计算简单的数组元素值的总和
 * @param  {Array} array 数组
 * @param  {String} attr  元素的属性名（适用于数组元素对象的一级属性）
 * @return {Number}       计算之后的总和结果
 */
export const getSum = (array = [], attr) => {
    let sum = 0;
    let type = Object.prototype.toString.call(array[0]);
    if (type !== '[object Object]') {
        array.forEach((item) => {
            sum += parseFloat(item);
        });
    } else if (!!attr && type === '[object Object]') {
        array.forEach((item) => {
            sum += parseFloat(item[attr] || 0);
            // sum += item[attr];
            // console.warn('计价', parseFloat(parseFloat(sum).toFixed(2)));
        });
    } else {
        console.error('计算总和的参数不对 %o %s', array, attr);
        sum = 0;
    }
    return parseFloat(parseFloat(sum).toFixed(2));
};
/**
 * 检验对于给定的链式引用是否有效
 * @param {Any} context 上下文
 * @param {Any} strOrArray 链式引用字符串或者数组
 * @return {Boolean} 是否有效
 */
// 有问题
export const getIn = (context, strOrArray) => {
    if (!isType(strOrArray, 'Array') && !isType(strOrArray, 'String')) {
        return;
    }
    let copes = [];
    let obj = context;
    if (isType(strOrArray, 'String')) {
        copes = strOrArray.split('.');
    } else {
        copes = strOrArray;
    }
    for (let name of copes) {
        console.warn(obj[name]);
        if (obj[name]) {
            obj = obj[name];
        } else {
            return false;
        }
    }
    return true;
};
/**
 * 提取大陆二代身份证号码生日日期
 * @param {String} idCardNo 大陆二代身份证号码
 * @return {String} 生日日期，1980-8-8格式
 */
export const getBirthday = function (idCardNo) {
    var reg = /\d{6}(\d{4})(\d{2})(\d{2}).*/;
    idCardNo = idCardNo + '';
    var year = parseInt(idCardNo.match(reg) ? idCardNo.match(reg)[1] : 0);
    var month = parseInt(idCardNo.match(reg) ? idCardNo.match(reg)[2] : 0);
    var date = parseInt(idCardNo.match(reg) ? idCardNo.match(reg)[3] : 0);
    var dateObj = new Date();
    if (
        year <= dateObj.getFullYear() &&
        year >= dateObj.getFullYear() - 150 &&
        month <= 12 &&
        month > 0 &&
        date <= 31 &&
        date > 0
    ) {
        return `${year}-${month}-${date}`;
    } else {
        return '';
    }
};
export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();
    const diff = (now - d) / 1000;
    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
    }
};
/**
 * 补全数字位数
 * @param {String|Numer} num 数字
 * @param {Numer} length 数字字符串长度 默认5位
 * @return {String} 补全位数之后的字符串
 */
export const supplementNo = function (num, length = 5) {
    if (isType(num, 'string') || isType(num, 'number')) {
        let str = num + '';
        let len = str.length;
        let diff = length - len;
        diff = diff > 0 ? diff : 0;
        for (let i = 0; i < diff; i++) {
            num = '0' + num;
        }
    }
    return num;
};
/**
 * 获取中文数字，如输入：“5201314” 输出：“五二零一三一四”
 * @param {Any} index 数字字符串或数字类型
 * @return {Any} 中文数字列表或者匹配的结果
 */
export const getcnNumber = function (index) {
    let result;
    let data = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (index === undefined) {
        result = data;
    } else {
        index += '';
        let arr = index.split('');
        arr = arr.map(num => {
            let n = '0123456789'.indexOf(num) > -1 ? parseInt(num) : 10;
            return data[n];
        });
        result = arr.join('');
    }
    return result;
};
/**
 * 英文字符串首字母转大写
 * @param {String} str 要转换的字符串 
 * @return {String} str 转换之后的字符串
 */
export const fstLtToUper = function (str) {
    if (/^[A-Za-z]/.test(str)) {
        str = /^[A-Z]/.test(str) ? str : str[0].toUpperCase() + str.substring(1);
    } else {
        console.warn('首字母转大写，传入的字符串首字符不是字母');
    }
    return str;
};
/**
 * 计算简单的数组元素值的总和
 * @param  {Array} array 数组
 * @param  {String} attr  元素的属性名（适用于数组元素对象的一级属性）
 * @return {Number}       计算之后的总和结果
 */
export const getSum = (array = [], attr) => {
    let sum = 0;
    let type = Object.prototype.toString.call(array[0]);
    if (type !== '[object Object]') {
        array.forEach((item) => {
            sum += parseFloat(item);
        });
    } else if (!!attr && type === '[object Object]') {
        array.forEach((item) => {
            sum += parseFloat(item[attr]);
        });
    } else {
        console.error('计算总和的参数不对 %o %s', array, attr);
        sum = 0;
    }
    return sum;
};
