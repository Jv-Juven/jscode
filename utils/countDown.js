
/**
 * 倒计时
 * @param  {String}   minutes 分
 * @param  {String}   seconds 秒
 * @param  {Function} cb      回调函数
 * @return {null}           无
 */
export const countDown = function (minutes, seconds, cb) {
    // 小于10的数字补0
    const supplement = function (num) {
        num = parseInt(num);
        if (num < 10 && num >= 0) {
            return '0' + num;
        } else {
            return num;
        }
    };
    minutes = supplement(minutes);
    seconds = supplement(seconds);
    const count = function () {
        if (parseInt(seconds) === 0) {
            if (parseInt(minutes) === 0) {
                typeof cb === 'function' && cb({
                    isEnd: true,
                    minutes,
                    seconds
                });
            } else {
                typeof cb === 'function' && cb({
                    isEnd: false,
                    minutes,
                    seconds
                });
                minutes = supplement(--minutes);
                seconds = 59;
                setTimeout(count, 1000);
            }
        } else {
            typeof cb === 'function' && cb({
                isEnd: false,
                minutes,
                seconds
            });
            seconds = supplement(--seconds);
            setTimeout(count, 1000);
        }
    };
    count();
};