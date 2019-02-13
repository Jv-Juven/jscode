/**
 * 利用Object key的唯一性去重
 * @param {Array} arr 要做去重的数组
 * @return {Array} 去重处理后的数组
 */
export const delRepeat = function (arr) {
    if (!Array.isArray(arr)) {
        console.warn(arr + ' is not an Array');
        return arr;
    }
    const obj = Object.create(null);
    for (const item of arr) {
        obj[item] = item;
    }
    return Object.keys(obj);
};
/**
 * 利用Set集合的唯一性去重
 * @param {Array} arr 要做去重的数组
 * @return {Array} 去重处理后的数组
 */
export const delBySet = function (arr) {
    if (!Array.isArray(arr)) {
        console.warn(arr + ' is not an Array');
        return arr;
    }
    let s = new Set(arr);
    return Array.from(s);
};
/**
 * 利用indexOf检验是否有相同元素去重
 * @param {Array} arr 要做去重的数组
 * @return {Array} 去重处理后的数组
 */
export const delByIndexOf = function (arr) {
    if (!Array.isArray(arr)) {
        console.warn(arr + ' is not an Array');
        return arr;
    }
    let result = [];
    arr.forEach(item => {
        if (result.indexOf(item) === -1) {
            result.push(item)
        }
    });
    return result;
};