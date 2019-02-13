const no = function () {};
/**
 * 以jsonp的方式加载script文件
 * @param {String} url js文件地址
 * @param {Object} options 配置选项
 */
const loadScriptByJsonP = function (url, options = {}) {
    options = Object.assign({
        success: no, // 加载成功回调函数
        error: no, // 加载失败回调函数
        isRefresh: true // 是否不缓存文件
    }, options);
    let html = document.getElementsByTagName('html')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${url}?${ options.isRefresh ? new Date().getTime() : ''}`;
    script.async = true;
    script.onload = function () {
        html.removeChild && html.removeChild(script);
        typeof cb === 'function' && cb();
    };
    html.appendChild(script);
};
/**
 * 利用jsonp加载跨域文件，Promise实现方式
 * @param {String} url 加载文件的地址
 * @param {Boolean} nocache 是否不缓存
 */
export default function (url, options) {
    options = Object.assign({
        nocache: true,
        remove: true
    }, options);
    return new Promise((resolve, reject) => {
        let html = document.getElementsByTagName('html')[0];
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${url}?_t=${options.nocache ? new Date().getTime() : ''}`;
        script.async = true;
        script.onload = function () {
            resolve({
                isLoaded: true
            });
            options.remove && html.removeChild && html.removeChild(script);
        };
        script.onerror = reject;
        html.appendChild(script);
    });
};
