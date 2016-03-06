define(['require', 'exports', 'Handlebars', '../module/utils'], function(require, exports, Handlebars) {

        exports.init = function() {
                Handlebars.registerHelper('ver_pack_list', function(data, plat, options) {
                        var html = '';
                        var len = data.length;
                        var arr = [];
                        var json = {};
                        var arr2 = [];
                        if (len > 0) {

} else {
                                return new Handlebars.SafeString(html);
                        }
                        for (var i = 0; i < len; i++) {
                                if (plat == 3 || data[i].upkPlatform == plat || data[i].upkPlatform == 3) {
                                        if (plat == 3) {
                                                arr.push(data[i]);
                                        } else {
                                                if (((plat == 2) && (data[i].upkState == 1 && data[i].androidState == -3)) || ((plat == 2) && (data[i].androidState == 1))) {
                                                        arr.push(data[i]);
                                                } else if (((plat == 1) && (data[i].upkState == 1 && data[i].iosState == -3)) || ((plat == 1) && (data[i].iosState == 1))) {
                                                        arr.push(data[i]);
                                                } else {}
                                        }
                                } else {}
                        }
                        for (var j = arr.length - 1; j >= 0; j--) {
                                json[arr[j].upkVer] = arr[j];
                        }
                        for (var name in json) {
                                arr2.push(json[name]);
                        }
                        arr2.sort(function(a, b) {
                                return a.upkId - b.upkId;
                        });
                        for (var k = arr2.length - 1; k >= 0; k--) {
                                html += "<option value=" + arr2[k].upkVer + " platform=" + arr2[k].upkPlatform + ">V" + arr2[k].upkVer + "</option>";
                        }

                        return new Handlebars.SafeString(html);
                });
                Handlebars.registerHelper('pack_3', function(sta1, sta2, options) {
                        if (sta1 == -3 && sta2 == -3) {
                                return options.fn(this);
                        } else {
                                return options.inverse(this);
                        }
                });
                Handlebars.registerHelper('pack_1', function(sta1, sta2, options) {
                        if (sta1 == 1 || sta2 == 1) {
                                return options.fn(this);
                        } else {
                                return options.inverse(this);
                        }
                });
                Handlebars.registerHelper('pack_0', function(sta1, sta2, options) {
                        if (sta1 == 0 || sta2 == 0) {
                                return options.fn(this);
                        } else {
                                return options.inverse(this);
                        }
                });
                Handlebars.registerHelper('packing', function(status) {
                        var json = {
                                '-3': '',
                                '-2': i18n.t("cadPackage.-2"),
                                '-1': i18n.t("cadPackage.-1"),
                                '0': i18n.t("cadPackage.0"),
                                '1': i18n.t("cadPackage.1"),
                                '2': i18n.t("cadPackage.2"),
                                '3': i18n.t("cadPackage.3"),
                                '4': i18n.t("cadPackage.4"),
                                '5': i18n.t("cadPackage.5"),
                                '6': i18n.t("cadPackage.6"),
                                '7': i18n.t("cadPackage.7"),
                                '8': i18n.t("cadPackage.8"),
                                '9': i18n.t("cadPackage.9"),
                                '10': i18n.t("cadPackage.10"),
                                '11': i18n.t("cadPackage.11"),
                                '12': i18n.t("cadPackage.12"),
                                '13': i18n.t("cadPackage.13"),
                                '14': i18n.t("cadPackage.14"),
                                '15': i18n.t("cadPackage.15"),
                                '16': i18n.t("cadPackage.16")
                        };
                        return json[status];
                });
                Handlebars.registerHelper('t', function(i18n_key) {
                        var result = i18n.t(i18n_key);
                        return new Handlebars.SafeString(result);
                });
                Handlebars.registerHelper('getT', function(name) {
                        var result = i18n.t(name);
                        return new Handlebars.SafeString(result);
                });
                //custom helper
                Handlebars.registerHelper('percent', function(condition1, condition2, options) {
                        var num1 = parseInt(condition1);
                        var num2 = parseInt(condition2) * 1073741824;
                        return (100 - Math.round((num1 / num2) * 10000) / 100.00 + "%");
                });
                Handlebars.registerHelper('percent_2',
                function(condition1, condition2, options) {
                        var num1 = parseInt(condition1);
                        var num2 = parseInt(condition2);
                        return (Math.round((num1 / (num1 + num2)) * 10000) / 100.00 + "%");
                });
                Handlebars.registerHelper('and', function(condition1, condition2, options) {
                        if (condition1 && condition2) {
                                return options.fn(this);
                        } else {
                                return options.inverse(this);
                        }
                });
                Handlebars.registerHelper('neither', function(condition1, condition2, options) {
                        if (!condition1 && !condition2) {
                                return options.fn(this);
                        } else {
                                return options.inverse(this);
                        }
                });
                Handlebars.registerHelper('eq',
                function(condition1, condition2, options) {
                        if (condition1 == condition2) {
                                return options.fn(this);
                        } else {
                                return options.inverse(this);
                        }
                });
                Handlebars.registerHelper('versionToNum', function(version, condition2, options) {
                        var a = [];
                        var ver = version || '0.0.0';
                        a = ver.split('.');
                        for (var i = 0,
                        len = a.length; i < len; i++) {
                                if (a[i] < 10) {
                                        a[i] = '0' + a[i];
                                }
                        }
                        return a.join('');
                });
                Handlebars.registerHelper('or', function(condition1, condition2, options) {
                        if (condition1 || condition2) {
                                return options.fn(this);
                        }
                });
                // --------------------------
                Handlebars.registerHelper('do', function(condition1, condition2, condition3, condition4, condition5) {
                        var arr = [condition1, condition2, condition3, condition4, condition5];
                        var ret = '';
                        for (var i = 0,
                        j = 0; i < arr.length; i++) {
                                if (arr[i] && j < 3) {
                                        j++;
                                        ret += '<img src="' + arr[i] + '">';
                                };
                        };
                        return new Handlebars.SafeString(ret);;
                });
                // -------------------------------
                Handlebars.registerHelper('gt', function(context, val, options) {
                        if (context > val) {
                                return options.fn(this);
                        }
                });
                Handlebars.registerHelper('lt', function(context, val, options) {
                        if (context < val) {
                                return options.fn(this);
                        }
                });
                //分割数组生成table
                Handlebars.registerHelper('eachTR', function(arr, column, options) {
                        var html = '';
                        var len;
                        if (arr.length % column === 0) {
                                len = arr.length;
                        } else {
                                len = ((parseInt(arr.length / column) + 1) * column);
                        }
                        for (var i = 0; i < len; i++) {
                                if (i % column === 0) {
                                        html = html + '<tr>' + options.fn(arr[i]);
                                } else if (i % column === (column - 1)) {
                                        html = html + aaa.fn(arr[i]) + '</tr>';
                                } else {
                                        html = html + options.fn(arr[i]);
                                }
                        }
                        return new Handlebars.SafeString(html);
                });
                var preFormat = function(str) {
                        if (isNaN(str)) {
                                str = str + '';
                                if (/(T+)/.test(str)) {
                                        var parts = str.match(/\d+/g);
                                        var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
                                        str = new Date(isoTime);
                                } else {
                                        str = str.replace(/\-/g, '\/');
                                }
                        } else {

}
                        return new Date(str).customFormat('yyyy-MM-dd HH:mm:ss');
                };
                //日期格式化
                Handlebars.registerHelper('formatDate', function(date) {
                        var d = preFormat(date);
                        return new Handlebars.SafeString(d);
                });
                //常用日期格式化
                Handlebars.registerHelper('dateTemplate', function(date, delimiter) {
                        var d = new Date(date);
                        var yy = d.getFullYear(),
                        mm = d.getMonth() + 1,
                        dd = d.getDate();
                        delimiter = delimiter || '-';
                        var dateStr = [yy, mm, dd].join(delimiter);
                        return new Handlebars.SafeString(dateStr);
                });
                // 返回新的二维码地址
                Handlebars.registerHelper('newQrcode', function(url, ver, size) {
                        var newUrl = url + '&ver=' + ver + '&size=' + parseInt(size / (1024 * 1024) * 100) / 100 + 'M';
                        return newUrl;
                });
                // 返回邮箱前半段
                Handlebars.registerHelper('firstHalfEmail', function(fullEmail) {
                        function getRandom(len) {
                                var chars = 'abcdefghijkmnopqrstuvwxyz';
                                var str = "";
                                while (len > 0) {
                                        str += chars.charAt(Math.floor(Math.random() * chars.length));
                                        len--;
                                }
                                return str;
                        }
                        var email = fullEmail.split('@')[0];
                        var pkgName = email.replace(/\./g, "").replace(/-/g, "").replace(/_/g, "");

                        if (!isNaN(pkgName[0])) {
                                pkgName = getRandom(1) + pkgName;
                        }

                        return pkgName;
                });

        };
});