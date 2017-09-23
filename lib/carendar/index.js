const CARENDAR = (function () {
    // 可选的第一天（今天）
    var _startDay = parseInt(new Date().getTime() / 100000) * 100000;
    // 可选总长度
    var activeLength = 90;
    // 可选的最后一天
    var _endDay = 0;
    // 一天的时间戳
    var _oneDay = 24 * 60 * 60 * 1000;
    // 第一天所在月份的1号
    var _startDayFirst = 0;
    // 最后一天所在月份的最后一天
    var _endDayLast = 0;
    // 设置可选的最后一天
    var _setLastDay = function () {
        _endDay = _startDay + 90 * _oneDay;
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
        var nextMonth = month + 1;
        if (nextMonth == 12) {
            month = nextMonth - 12;
            year++;
        }
        var nextMonthFristDate = new Date(year, month, 1);
        _endDayLast = nextMonthFristDate.getTime() - _oneDay;
    };
    // 设置全部日期数据
    var _setAllDates = function () {
        for (var date = _startDayFirst; date < _endDayLast + _oneDay; date = date + _oneDay) {
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
    return function () {
        if (allDates.length === 0 || !checkSomeDate()) {
            _setLastDay();
            _setFirstMonthDate();
            _setLastMonthDate();
            _setAllDates();
        }
        console.log(new Date(_startDay), new Date(_endDay), new Date(_startDayFirst), new Date(_endDayLast));
        return {
            allDates
        };
    }
})();

var carendar = CARENDAR();
carendar.allDates;