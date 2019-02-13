/**
 * 异步请求
 * 用法：
 *  let axios1 = ajaxFetch();
    let axios2 = ajaxFetch();
    axios1 = axios1.setAsync(true); // 强制异步，即请求在同一时间内只能发送一次，默认false
    let rq1 = axios1.ajax('http://dev.9dtech.cn/ops/user/query', {
        id: 1
    }); // 默认是post方法
    let rq2 = axios1.ajax('http://dev.9dtech.cn/ops/user/query', {
        id: 2
    }, 'post');
    let rq3 = axios2.ajax('http://dev.9dtech.cn/ops/user/del', {
        id: 3
    }, 'get');
    console.log(rq1, rq2, rq3);
 */
// 需要引入axios，当时是基于0.17.1版本，地址：https://github.com/axios/axios
// import http from 'common/http';
class Ajax {
    constructor() {
        this._lock = 0; // 请求锁
        this._forceAsync = false; // 是否强制异步，即请求是否在同一时间内只能发送一次
        this._cachedData = {}; // 缓存数据
        // this.url = url; // 地址
        // this.params = params; // 入参
        // this._method = method;
        // this.ajax = this.ajax();
        // return this.ajax;
    }
    _get(...args) {
        let url = args[0];
        let params = args[1];
        return http.get(url, {
            params
        });
    }
    _post(...args) {
        let url = args[0];
        let params = args[1];
        return http.post(url, params);
    }
    ajax(url, params = {}, method = 'post', cached = false) {
        // console.log('[ Ajax 请求方法 method]：', method);
        if (this._lock && this._forceAsync) {
            // console.warn('this._lock', this._lock);
            console.warn(`强制同步请求，${url}正在请求中`);
            return;
        }
        // 缓存键
        let cachedKey = `${url}${JSON.stringify(params)}`;
        // 取缓存数据
        if (cached && this._cachedData[cachedKey]) {
            return Promise.resolve(...this._cachedData[cachedKey]);
        }
        this._lock = 1;
        return new Promise((resolve, reject) => {
            this[`_${method}`](url, params)
                .then((res) => {
                    // res = res.data;
                    if (res.msgCode == 0) {
                        resolve(res.data, res);
                        // 缓存数据
                        if (cached) {
                            this._cachedData[cachedKey] = [res.data, res];
                        }
                    } else {
                        reject(res);
                    }
                })
                .catch((reason) => {
                    console.error(`${this.url}请求错误`);
                    reject(reason);
                })
                .finally(() => {
                    this._lock = 0;
                });
        });
    }
    // 设置强制异步开关
    setAsync(bool) {
        this._forceAsync = !!bool;
        return this;
    }
};
// 直接返回一个axios实例
// Ajax.make = function (url, params) {
//     return ;
// };
const ajaxFetch = (function () {
    return new Ajax();
})();
export default ajaxFetch;
