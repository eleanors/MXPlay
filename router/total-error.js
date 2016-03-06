define(['require', 'exports', 'module', './nodeConfig', 'request', '../module/helper'], function(require, exports, module, config, request, utils) {
        module.exports = function(req, res) {
                var hostname = config.mamhost;
                var appid = req.cookies.curAppId;
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 6);
                var options = {
                        url: hostname + '/mxplay/data/total/getV2ExcepStatisticDataByAblumId.json',
                        method: "POST",
                        json: {
                                appId: appid,
                                startDate: utils.toFormat(startDate, "yyyy-MM-dd"),
                                endDate: utils.toFormat(new Date(), "yyyy-MM-dd"),
                                versionCode: "",
                                temptick: new Date().getTime()
                        },
                        headers: {}
                };
                if (req && req.header) {
                        options.headers.Cookie = req.header('Cookie');
                }

                function isTrue(dt) {
                        if (dt && dt != "0000-00-00 00:00:00") {
                                return true;
                        } else {
                                return false;
                        }
                }
                request(options, function(error, response, body) {
                        var i18n_lang = req.cookies.i18next || "zh-CN";
                        i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN": "en-US");
                        if (!error && response.statusCode == 200) {
                                if (body && body.st == 1) {
                                        var data = body.msg;
                                        var excep = {};
                                        var chart = {};
                                        for (var i = 0,
                                        len = data.length; i < len; i++) {
                                                var version = data[i];
                                                var chartKey = utils.toFormat(new Date(version.reportDate), 'MM-dd');
                                                if (chart[chartKey]) {
                                                        chart[chartKey] += version.excepCount;
                                                } else {
                                                        chart[chartKey] = version.excepCount
                                                }
                                                var key = version.excepTitle + version.versionCode;
                                                if (excep[key]) {
                                                        var temp = excep[key];
                                                        var modalKey = version.model + version.systemVersion;
                                                        if (temp.modalData[modalKey]) {
                                                                temp.modalData[modalKey].errorCount += version.excepCount;
                                                        } else {
                                                                temp.modalData[modalKey] = {
                                                                        'deviceName': version.model,
                                                                        'OSCount': version.systemVersion,
                                                                        'errorCount': version.excepCount
                                                                };
                                                        }
                                                        temp.errorCount += version.excepCount;
                                                        excep[key] = temp;
                                                } else {
                                                        var obj = {};
                                                        var modalKey = version.model + version.systemVersion;
                                                        obj[modalKey] = {
                                                                'deviceName': version.model,
                                                                'OSCount': version.systemVersion,
                                                                'errorCount': version.excepCount
                                                        };
                                                        excep[key] = {
                                                                'appCode': version.versionCode,
                                                                'errorAbstract': version.excepTitle,
                                                                'happenTime': isTrue(version.excepLastDate) ? utils.toFormat(new Date(version.excepLastDate), 'yyyy-MM-dd hh:mm:ss') : "",
                                                                'errorCount': version.excepCount,
                                                                'modalData': obj
                                                        }
                                                }
                                        }
                                        var tab1DetailsData = [];
                                        for (var key in excep) {
                                                tab1DetailsData.push(excep[key]);
                                        }
                                        var xdata = [],
                                        chartdata = [];
                                        for (var key in chart) {
                                                xdata.unshift(key);
                                                chartdata.unshift(chart[key]);
                                        }
                                        var totalData = {
                                                xdata: xdata,
                                                chartdata: chartdata,
                                                tab1details: tab1DetailsData,
                                                tab2details: tab1DetailsData,
                                                tab1pagetotal: Math.ceil(tab1DetailsData.length / 10),
                                                tab2pagetotal: Math.ceil(tab1DetailsData.length / 10)
                                        };
                                        var json = {
                                                title: i18n.t("Total.ErrorReport"),
                                                i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                                                jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify(totalData) + '};'
                                        };
                                        return res.render('total-error', json);
                                }
                        }
                        return res.render(utils.getStatus(response.statusCode), {
                                url: req.url,
                                jsName: "error400"
                        });
                })
        }
});