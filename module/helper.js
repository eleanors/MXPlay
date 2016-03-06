define(function(require, exports, module) {
        if (!Date.prototype.toISOString) {
                Date.prototype.toISOString = function() {
                        function pad(n) {
                                return n < 10 ? '0' + n: n
                        }
                        return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + '.' + pad(this.getUTCMilliseconds()) + 'Z';
                }
        }

        function getAddDate(dt, add) {
                var temp = dt;
                temp.setDate(temp.getDate() + add);
                return Format(temp, "MM-dd");
        }

        function toFixed(num, len) {
                var str = num.toString();
                if (len == 0) {
                        return Math.floor(num);
                }
                var reg = /\d+\.\d+/g
                if (reg.test(str)) {
                        return str.substring(0, str.indexOf('.') + len + 1);
                }
                str = str.replace('.0', '');
                return str;
        }

        function toFormat(dt, format) {
                if (format != undefined && format != "" && format != null) return Format(new Date(dt), format);
                return Format(new Date(dt), 'yyyy-MM-dd HH:mm:ss');
        }

        function Format(dt, fmt) {
                var o = {
                        "M+": dt.getMonth() + 1,
                        //月份
                        "d+": dt.getDate(),
                        //日
                        "h+": dt.getHours() % 12 == 0 ? 12 : dt.getHours() % 12,
                        //小时
                        "H+": dt.getHours(),
                        //小时
                        "m+": dt.getMinutes(),
                        //分
                        "s+": dt.getSeconds(),
                        //秒
                        "q+": Math.floor((dt.getMonth() + 3) / 3),
                        //季度
                        "S": dt.getMilliseconds() //毫秒
                };
                var week = {
                        "0": "/u65e5",
                        "1": "/u4e00",
                        "2": "/u4e8c",
                        "3": "/u4e09",
                        "4": "/u56db",
                        "5": "/u4e94",
                        "6": "/u516d"
                };
                if (/(y+)/.test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f": "/u5468") : "") + week[dt.getDay() + ""]);
                }
                for (var k in o) {
                        if (new RegExp("(" + k + ")").test(fmt)) {
                                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        }
                }
                return fmt;
        }

        function formatstr(str) {
                return str.toString().length == 2 ? str.toString() : "0" + str;
        }

        function getTime(utc) {
                return formatstr(Math.floor(utc / 3600)) + ":" + formatstr(Math.floor(utc % 3600 / 60)) + ":" + formatstr(Math.floor(utc % 60));
        }

        function getStatus(statusCode) {
                var path = 'error/400';
                switch (statusCode) {
                case 400:
                        path = "error/400";
                        break;
                case 401:
                        path = "users/signin";
                        break;
                case 404:
                        path = "error/404";
                        break;
                case 500:
                        path = "error/500";
                        break;
                }
                return path;
        }
        module.exports = {
                getAddDate: getAddDate,
                toFixed: toFixed,
                toFormat: toFormat,
                Format: Format,
                formatstr: formatstr,
                getTime: getTime,
                getStatus: getStatus
        };
});