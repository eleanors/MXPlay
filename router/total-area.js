define(['require', 'exports', 'module', './nodeConfig', 'request', '../module/helper', 'async'], function(require, exports, module, config, request, utils, async) {
	
        module.exports = function(req, res) {
                var hostname = config.mamhost;
                var appid = req.cookies.curAppId;
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 6);
                async.waterfall([

                function(callback) {
                        var options = {
                                url: hostname + '/mxplay/data/total/getpkgversionlist.json',
                                method: "POST",
                                json: {
                                        curAppId: appid
                                },
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options, function(error, response, body) {
                                if (!error && response.statusCode == 200 && body.st) {
                                        return callback(null, body.msg);
                                } else {
                                        return callback(response.statusCode);
                                }
                        });
                },
                function(versionList, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/total/getV2GeoStatisticDataByAblumId.json',
                                method: "POST",
                                json: {
                                        appId: appid,
                                        startDate: utils.toFormat(startDate, "yyyy-MM-dd"),
                                        endDate: utils.toFormat(new Date(), "yyyy-MM-dd"),
                                        temptick: new Date().getTime()
                                },
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options, function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                        if (body && body.st == 1) {
                                                var data = body.msg;
                                                var regUser = {},
                                                regTotalUserCount = 0,
                                                devUser = {},
                                                startup = {};
                                                var allDevicesCount = 0;
                                                var versionCodeList = [];
                                                var lastDate;
                                                if (data.length > 0) {
                                                        lastDate = utils.Format(new Date(data[0].reportDate), 'yyyy-MM-dd');
                                                }
                                                for (var i = 0,
                                                len = data.length; i < len; i++) {

                                                        var version = data[i];
                                                        var reportDate = utils.Format(new Date(version.reportDate), 'yyyy-MM-dd');
                                                        if (versionCodeList.indexOf(version.versionCode) == -1) {
                                                                versionCodeList.push(version.versionCode);
                                                        }
                                                        var geoNewRegsResult = JSON.parse(version.geoNewRegsResult);
                                                        for (var r = 0,
                                                        rlen = geoNewRegsResult.length; r < rlen; r++) {
                                                                var reg = geoNewRegsResult[r];
                                                                regTotalUserCount += (reg.count || 0);
                                                                if (regUser[reg.city]) {
                                                                        regUser[reg.city] = regUser[reg.city] + (reg.count || 0);
                                                                } else {
                                                                        regUser[reg.city] = (reg.count || 0);
                                                                }
                                                        }
                                                        //只获取最后一天的数据
                                                        if (lastDate == reportDate) {
                                                                var geoDevicesCountResult = JSON.parse(version.geoDevicesCountResult);
                                                                for (var d = 0,
                                                                dlen = geoDevicesCountResult.length; d < dlen; d++) {
                                                                        var dev = geoDevicesCountResult[d];
                                                                        allDevicesCount += (dev.count || 0);
                                                                        if (devUser[dev.city]) {
                                                                                devUser[dev.city] = devUser[dev.city] + (dev.count || 0);
                                                                        } else {
                                                                                devUser[dev.city] = (dev.count || 0);
                                                                        }
                                                                }
                                                        }

                                                        var geoStartupCountResult = JSON.parse(version.geoStartupCountResult);
                                                        for (var s = 0,
                                                        slen = geoStartupCountResult.length; s < slen; s++) {
                                                                var start = geoStartupCountResult[s];
                                                                if (startup[start.city]) {
                                                                        startup[start.city] = startup[start.city] + (start.count || 0);
                                                                } else {
                                                                        startup[start.city] = (start.count || 0);
                                                                }
                                                        }
                                                }
                                                var detailsData = [],
                                                startupMap = [],
                                                newUserMap = [],
                                                activeUserMap = [];
                                                for (var key in devUser) {
                                                        var devicesCount = regTotalUserCount; //devUser[key] || 0;
                                                        var regsCount = regUser[key] || 0;
                                                        var startupCount = startup[key] || 0;
                                                        var obj = {
                                                                area: key,
                                                                newUserCount: regsCount,
                                                                newUserCountRatio: (devicesCount > 0 ? Math.floor(regsCount / devicesCount * 100) : 0) + "%",
                                                                startupCount: startupCount
                                                        }
                                                        if (regsCount > 0 || startupCount > 0) detailsData.push(obj);
                                                        if (regsCount > 0) newUserMap.push({
                                                                name: key,
                                                                value: regsCount
                                                        });
                                                        if (startupCount > 0) startupMap.push({
                                                                name: key,
                                                                value: startupCount
                                                        });
                                                }

                                                var totalData = {
                                                        details: detailsData,
                                                        startupMap: startupMap,
                                                        newUserMap: newUserMap,
                                                        pagetotal: Math.ceil(detailsData.length / 10)
                                                };
                                                var json = {
                                                        versionCodeList: versionList,
                                                        i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                                                        jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify(totalData) + '};'
                                                };

                                                return callback(null, json);
                                        }
                                } else {
                                        return callback(response.statusCode);
                                }
                                return callback(null, {
                                        i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                                        jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify({}) + '};'
                                });
                        })
                }],
                function(err, result) {
                        var i18n_lang = req.cookies.i18next || "zh-CN";
                        i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN": "en-US");
                        if (err) {
                                return res.render(utils.getStatus(err), {
                                        url: req.url,
                                        jsName: "error400"
                                });
                        }
                        result.title = i18n.t("Total.LocationDistribution");
                        return res.render('total-area', result);
                });
        }
});