import {
    isType
} from './utils';
// timestamp : 日期时间戳 默认值：当前时间
// fmt 日期格式 y:年，m:月，d：日，h 时， M分 默认格式 yyyy-mm-dd hh:MM
// 示例 ：yyyy-mm-dd hh:MM:2015-11-10 12:00 yy年mm月dd日 周w：15年11月10日周五
export const formatDate = function (timestamp, fmt = '') {
    var D = new Date();
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    timestamp && D.setTime(timestamp);
    fmt = fmt || 'yyyy-mm-dd';

    var o = {
        'm+': D.getMonth() + 1,
        'd+': D.getDate(),
        'w+': week[D.getDay()],
        'h+': D.getHours(),
        'M+': D.getMinutes(),
        's+': D.getSeconds()
    };

    if ((/(y+)/).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (D.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};
/**
 * 日期时间字符串转为时间对象
 * @param {String} dateStr 日期时间字符串  yyyy-mm-dd hh:MM:ss 格式
 * @return {Date} Date实例
 */
export const strToDate = function (dateStr) {
    let validReg = /((\d+)-(\d+)-(\d+))?(\s(\d+):(\d+):(\d+))?/;
    let reg = /(\d+)?-?(\d+)?-?(\d+)?\s?(\d+)?:?(\d+)?:?(\d+)?/;
    if (isType(dateStr, 'string') && validReg.test(dateStr)) {
        let times = dateStr.replace(reg, '$1,$2,$3,$4,$5,$6').split(',');
        for (let i = 0, l = 6; i < l; i++) {
            if (i === 1) {
                // 月份减一
                times[1] -= 1;
            }
            times[i] = parseInt(times[i]) || 0;
        }
        // console.log('times', times);
        return new Date(...times);
    } else {
        return new Date();
    }
};
/**
 * 返回日期间相差天数的绝对值
 * @param  {Date} startDate 开始日期
 * @param  {Date} endDate   结束日期
 * @return {Number} 天数 绝对值
 */
export const getDays = function (startDate, endDate) {
    startDate = startDate ? new Date(startDate) : new Date();
    endDate = endDate ? new Date(endDate) : new Date();

    return Math.abs((startDate - endDate) / 24 / 60 / 60 / 1000);
};
