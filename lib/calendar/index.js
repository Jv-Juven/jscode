const CALENDAR = (function () {
    // 一天的时间戳
    var _oneDay = 24 * 60 * 60 * 1000;
    // 可选的第一天（今天）
    var _startTime = new Date().getTime();
    var _startDay = parseInt(_startTime - _startTime % _oneDay - 8 * 60 * 60 * 1000);
    // 可选总长度
    var activeLength = 90;
    // 可选的最后一天
    var _endDay = 0;
    // 第一天所在月份的1号
    var _startDayFirst = 0;
    // 最后一天所在月份的最后一天
    var _endDayLast = 0;
    // 设置可选的最后一天
    var _setLastDay = function (length) {
        let l = length || activeLength; // 可选长度
        _endDay = _startDay + l * _oneDay;
    };
    // 全部日期
    var allDates = [];
    // 设置第一个月的第一天
    var _setFirstMonthDate = function () {
        var year = new Date(_startDay).getFullYear();
        var month = new Date(_startDay).getMonth();
        _startDayFirst = new Date(year, month, 1).getTime();
    };
    // 设置最后一个月的最后一天
    var _setLastMonthDate = function () {
        var year = new Date(_endDay).getFullYear();
        var month = new Date(_endDay).getMonth();
        console.log('最后一个月', month);
        var nextMonth = month + 1;
        if (nextMonth == 12) {
            month = nextMonth - 12;
            year++;
        }
        var nextMonthFristDate = new Date(year, nextMonth, 1);
        _endDayLast = nextMonthFristDate.getTime() - _oneDay;
    };
    // 设置全部日期数据
    var _setAllDates = function () {
        for (var date = _startDayFirst; date < _endDayLast; date = date + _oneDay) {
            var dateObj = {
                timestamp: date,
                date: new Date(date)
            };
            if (date >= _startDay && date <= _endDay) {
                dateObj.active = 1;
            } else {
                dateObj.active = 0;
            }
            allDates.push(dateObj);
        }
    };
    // 检查是否同一天
    var checkSomeDate = function () {
        return parseInt(new Date().getTime() / 100000) * 100000 === _startDay; 
    };
    /**
     * 日期格式化函数
     * @param  {DateString}  timestamp default: 当前时间
     * @param  {formatString} fmt  default: yyyy-mm-dd  y:年 m:月 d:日 w:星期 h:小时 M:分钟 s:秒
     */
    var dateFormat = function (timestamp, fmt) {
        let D = new Date();
        let week = '日一二三四五六';
        timestamp && D.setTime(timestamp);
        fmt = fmt || 'yyyy-mm-dd';
        let d = {
            'm+': D.getMonth() + 1,
            'd+': D.getDate(),
            'w+': week.charAt(D.getDay()),
            'h+': D.getHours(),
            'M+': D.getMinutes(),
            's+': D.getSeconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (D.getFullYear() + '').slice(-RegExp.$1.length));
        }
        Object.keys(d).forEach((key) => {
            if (new RegExp(`(${key})`).test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? d[key] : (`00${d[key]}`).slice(('' + d[key]).length));
            }
        });
        return fmt;
    };
    /**
     * options
     *  - activeLength Number 有效期长度，单位：天，默认90
     */
    return function (options) {
        if (allDates.length === 0 || !checkSomeDate()) {
            _setLastDay(options.activeLength);
            _setFirstMonthDate();
            _setLastMonthDate();
            _setAllDates();
        }
        // console.log(new Date(_startDay), new Date(_endDay), new Date(_startDayFirst), new Date(_endDayLast));
        console.log('_endDayLast', _endDayLast);
        return {
            dateFormat,
            allDates
        };
    }
})();

var calendar = CALENDAR();
console.log(calendar.allDates);
// console.log(calendar.allDates.map(dateObj => calendar.dateFormat(dateObj.timestamp)));