# 日历日期选择控件
## 输出指定范围内的日期数据
> _业务场景_：酒店预订入住和离店时间日历时间输出；
> _思路_：确定`初始日期`（没有指定日期格式的默认为`时间戳`）和`可选择天数`，计算出：可选的最后日期、第一天所在月份的1号、最后一天所在月份的最后日期，使用for循环将所有的日期遍历输出相关的数据。
## 使用方法
### npm
```
npm i -S jv-calendar
```
```js
import calendar from 'jv-calendar';
const calendarDate = calendar.allDates;
```
### 直接引用
```html
<script src="path/to/jv-calendar.js"></script>
```
```js
const calendarDate = calendar.allDates;
```
### `allDates`说明
```js
// {Array} calendar.allDates 日期对象数组列表
{
    active: 0, // 是否可选日期，0：不可选；1：可选
    date: Wed Jan 01 2019 00:00:00 GMT+0800 (中国标准时间), // 日期Date对象
    timestamp: 1546272000000 // 时间戳
}
```
## `api`
```js
/**
 * 日期格式化函数，返回指定格式的日期
 * @param  {DateString}  timestamp default: 当前时间
 * @param  {formatString} fmt  default: yyyy-mm-dd  y:年 m:月 d:日 w:星期 h:小时 M:分钟 s:秒
 */
// calendar.dateFormat(DateString, formatString);
calendar.dateFormat(1546272000000, 'yyyy-mm-dd'); // 2019-01-01
```
[github](https://github.com/Jv-Juven/jscode/tree/master/lib/calendar)