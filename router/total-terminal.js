define(['require', 'exports', 'module', './nodeConfig.js', 'request', '../module/helper', 'async'], function(require, exports, module, config, request, utils, async) {
        module.exports = function(req, res) {
			
                var hostname = config.mamhost;
                var appid = req.cookies.curAppId;
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 6);

                function sortNumber(a, b) {
                        return b.value - a.value;
                }

                function sortTable1(a, b) {
                        return b.newUserCount - a.newUserCount;
                }

                function sortTable2(a, b) {
                        return b.connTypeCount - a.connTypeCount;
                }
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
                        request(options,
                        function(error, response, body) {
                                if (!error && response.statusCode == 200 && body.st) {
                                        return callback(null, body.msg);
                                } else {
                                        return callback(response.statusCode, []);
                                }
                        });
                },
                function(versionList, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/total/getV2DeviceStatisticDataByAblumId.json',
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
                        request(options,  function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                        if (body && body.st == 1) {
                                                var data = body.msg;
                                                var regType = {},
                                                totalType = {},
                                                totalTypeCount = 0,
                                                regTypeCount = 0;
                                                var regResolution = {},
                                                totalResolution = {},
                                                totalResolutionCount = 0,
                                                regResolutionCount = 0;
                                                var regOs = {},
                                                totalOs = {},
                                                totalOsCount = 0,
                                                regOsCount = 0;
                                                var connTypeNet = {},
                                                totalNet = {},
                                                totalNetCount = 0,
                                                connTypeNetCount = 0;
                                                var versionCodeList = [];
                                                var lastDate;
                                                if (data.length > 0) {
                                                        lastDate = utils.Format(new Date(data[0].reportDate), 'yyyy-MM-dd');
                                                }
                                                for (var x = 0,
                                                xlen = data.length; x < xlen; x++) {
                                                        var version = data[x];
                                                        var reportDate = utils.Format(new Date(version.reportDate), 'yyyy-MM-dd');
                                                        if (versionCodeList.indexOf(version.versionCode) == -1) {

                                                                versionCodeList.push(version.versionCode);
                                                        }
                                                        var modelNewRegsResult = JSON.parse(version.modelNewRegsResult);
                                                        for (var i = 0,
                                                        len = modelNewRegsResult.length; i < len; i++) {
                                                                var item = modelNewRegsResult[i];
                                                                regTypeCount += (item.count || 0);
                                                                if (regType[item.model]) {
                                                                        regType[item.model] = regType[item.model] + (item.count || 0);
                                                                } else {
                                                                        regType[item.model] = (item.count || 0);
                                                                }
                                                        }

                                                        var resolutionNewRegsResult = JSON.parse(version.resolutionNewRegsResult);
                                                        for (var i = 0,
                                                        len = resolutionNewRegsResult.length; i < len; i++) {
                                                                var item = resolutionNewRegsResult[i];
                                                                regResolutionCount += (item.count || 0);
                                                                if (regResolution[item.resolution]) {
                                                                        regResolution[item.resolution] = regResolution[item.resolution] + (item.count || 0);
                                                                } else {
                                                                        regResolution[item.resolution] = (item.count || 0);
                                                                }
                                                        }

                                                        var osNewRegsResult = JSON.parse(version.osNewRegsResult);
                                                        for (var i = 0,
                                                        len = osNewRegsResult.length; i < len; i++) {
                                                                var item = osNewRegsResult[i];
                                                                regOsCount += (item.count || 0);
                                                                if (regOs[item.os]) {
                                                                        regOs[item.os] = regOs[item.os] + (item.count || 0);
                                                                } else {
                                                                        regOs[item.os] = (item.count || 0);
                                                                }
                                                        }

                                                        var connTypeResult = JSON.parse(version.connTypeResult);
                                                        for (var i = 0,
                                                        len = connTypeResult.length; i < len; i++) {
                                                                var item = connTypeResult[i];
                                                                var connType = item.connType.toUpperCase();
                                                                connTypeNetCount += (item.count || 0);
                                                                if (connTypeNet[connType]) {
                                                                        connTypeNet[connType] = connTypeNet[connType] + (item.count || 0);
                                                                } else {
                                                                        connTypeNet[connType] = (item.count || 0);
                                                                }
                                                        }

                                                        //只获取最后一天的数据
                                                        if (lastDate == reportDate) {
                                                                var modelTotalResult = JSON.parse(version.modelTotalResult);
                                                                for (var i = 0,
                                                                len = modelTotalResult.length; i < len; i++) {
                                                                        var item = modelTotalResult[i];
                                                                        totalTypeCount += (item.count || 0);
                                                                        if (totalType[item.model]) {
                                                                                totalType[item.model] = totalType[item.model] + (item.count || 0);
                                                                        } else {
                                                                                totalType[item.model] = (item.count || 0);
                                                                        }
                                                                }
                                                                var resolutionTotalResult = JSON.parse(version.resolutionTotalResult);
                                                                for (var i = 0,
                                                                len = resolutionTotalResult.length; i < len; i++) {
                                                                        var item = resolutionTotalResult[i];
                                                                        totalResolutionCount += (item.count || 0);
                                                                        if (totalResolution[item.resolution]) {
                                                                                totalResolution[item.resolution] = totalResolution[item.resolution] + (item.count || 0);
                                                                        } else {
                                                                                totalResolution[item.resolution] = (item.count || 0);
                                                                        }
                                                                }
                                                                var osTotalResult = JSON.parse(version.osTotalResult);
                                                                for (var i = 0, len = osTotalResult.length; i < len; i++) {
                                                                        var item = osTotalResult[i];
                                                                        totalOsCount += (item.count || 0);
                                                                        if (totalOs[item.os]) {
                                                                                totalOs[item.os] = totalOs[item.os] + (item.count || 0);
                                                                        } else {
                                                                                totalOs[item.os] = (item.count || 0);
                                                                        }
                                                                }
                                                                var connTypeTotalResult = JSON.parse(version.connTypeTotalResult);
                                                                for (var i = 0, len = connTypeTotalResult.length; i < len; i++) {
                                                                        var item = connTypeTotalResult[i];
                                                                        totalNetCount += (item.count || 0);
                                                                        var connType = item.connType.toUpperCase();
                                                                        if (totalNet[connType]) {
                                                                                totalNet[connType] = totalNet[connType] + (item.count || 0);
                                                                        } else {
                                                                                totalNet[connType] = (item.count || 0);
                                                                        }
                                                                }
                                                        }
                                                }
                                                var xtype = [],
                                                xresolution = [],
                                                xos = [],
                                                xnet = [];
                                                var typeData = [],
                                                resolutionData = [],
                                                osData = [],
                                                netData = [];
                                                var typeDetailsData = [],
                                                resolutionDetailsData = [],
                                                osDetailsData = [],
                                                netDetailsData = [];
                                                var tempType = [],
                                                tempResolution = [],
                                                tempOs = [],
                                                tempNet = [];
                                                //机型
                                                for (var key in totalType) {
                                                        var regCount = regType[key] || 0;
                                                        if (regCount < 1) continue;
                                                        var totalCount = regTypeCount; //totalType[key]||0;
                                                        var obj = {
                                                                description: key,
                                                                newUserCount: regCount,
                                                                newUserCountRatio: (totalCount > 0 ? Math.floor(regCount / totalCount * 100) : 0) + "%"
                                                        };

                                                        typeDetailsData.push(obj);
                                                        tempType.push({
                                                                key: key,
                                                                value: regCount
                                                        });
                                                }
                                                typeDetailsData.sort(sortTable1);
                                                if (typeDetailsData.length > 30) {
                                                        typeDetailsData = typeDetailsData.slice(0, 30);
                                                }
                                                //分辨率
                                                for (var key in totalResolution) {
                                                        var regCount = regResolution[key] || 0;
                                                        if (regCount < 1) continue;
                                                        var totalCount = regResolutionCount; //totalResolution[key]||0;
                                                        var obj = {
                                                                description: key,
                                                                newUserCount: regCount,
                                                                newUserCountRatio: (totalCount > 0 ? Math.floor(regCount / totalCount * 100) : 0) + "%"
                                                        }

                                                        resolutionDetailsData.push(obj);
                                                        tempResolution.push({
                                                                key: key,
                                                                value: regCount
                                                        });
                                                }
                                                resolutionDetailsData.sort(sortTable1);
                                                if (resolutionDetailsData.length > 30) {
                                                        resolutionDetailsData = resolutionDetailsData.slice(0, 30);
                                                }
                                                //操作系统
                                                for (var key in totalOs) {
                                                        var regCount = regOs[key] || 0;
                                                        if (regCount < 1) continue;
                                                        var totalCount = regOsCount; //totalOs[key]||0;
                                                        var obj = {
                                                                description: key,
                                                                newUserCount: regCount,
                                                                newUserCountRatio: (totalCount > 0 ? Math.floor(regCount / totalCount * 100) : 0) + "%"
                                                        }

                                                        osDetailsData.push(obj);
                                                        tempOs.push({
                                                                key: key,
                                                                value: regCount
                                                        });
                                                }
                                                osDetailsData.sort(sortTable1);
                                                if (osDetailsData.length > 30) {
                                                        osDetailsData = osDetailsData.slice(0, 30);
                                                }
                                                //联网方式
                                                for (var key in totalNet) {
                                                        var connTypeCount = connTypeNet[key] || 0;
                                                        if (connTypeCount < 1) continue;
                                                        var totalCount = connTypeNetCount; //totalNet[key]||0;
                                                        var obj = {
                                                                description: key,
                                                                startupCount: connTypeCount,
                                                                startupCountRatio: (totalCount > 0 ? Math.floor(connTypeCount / totalCount * 100) : 0) + "%"
                                                        }

                                                        netDetailsData.push(obj);
                                                        tempNet.push({
                                                                key: key,
                                                                value: connTypeCount
                                                        });
                                                }
                                                netDetailsData.sort(sortTable2);
                                                if (netDetailsData.length > 30) {
                                                        netDetailsData = netDetailsData.slice(0, 30);
                                                }
                                                tempType.sort(sortNumber);
                                                tempResolution.sort(sortNumber);
                                                tempOs.sort(sortNumber);
                                                tempNet.sort(sortNumber);
                                                if (tempType.length > 10) {
                                                        tempType = tempType.slice(0, 10);
                                                }
                                                if (tempResolution.length > 10) {
                                                        tempResolution = tempResolution.slice(0, 10);
                                                }
                                                if (tempOs.length > 10) {
                                                        tempOs = tempOs.slice(0, 10);
                                                }
                                                if (tempNet.length > 10) {
                                                        tempNet = tempNet.slice(0, 10);
                                                }
                                                for (var i = 0,
                                                len = tempType.length; i < len; i++) {
                                                        xtype.push(tempType[i].key);
                                                        typeData.push(tempType[i].value);
                                                }
                                                for (var i = 0,
                                                len = tempResolution.length; i < len; i++) {
                                                        xresolution.push(tempResolution[i].key);
                                                        resolutionData.push(tempResolution[i].value);
                                                }
                                                for (var i = 0,
                                                len = tempOs.length; i < len; i++) {
                                                        xos.push(tempOs[i].key);
                                                        osData.push(tempOs[i].value);
                                                }
                                                for (var i = 0,
                                                len = tempNet.length; i < len; i++) {
                                                        xnet.push(tempNet[i].key);
                                                        netData.push(tempNet[i].value);
                                                }

                                                var totalData = {
                                                        xtype: xtype,
                                                        typeData: typeData,
                                                        xresolution: xresolution,
                                                        resolutionData: resolutionData,
                                                        xos: xos,
                                                        osData: osData,
                                                        xnet: xnet,
                                                        netData: netData,
                                                        typeDetails: typeDetailsData,
                                                        resolutionDetails: resolutionDetailsData,
                                                        osDetails: osDetailsData,
                                                        netDetails: netDetailsData,
                                                        typepagetotal: Math.ceil(typeDetailsData.length / 10),
                                                        resolutionpagetotal: Math.ceil(resolutionDetailsData.length / 10),
                                                        ospagetotal: Math.ceil(osDetailsData.length / 10),
                                                        netpagetotal: Math.ceil(netDetailsData.length / 10)
                                                };
                                                var json = {
                                                        i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                                                        versionCodeList: versionList,
                                                        jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify(totalData) + '};'
                                                };
                                                return callback(null, json);
                                        }
                                }
                                return callback(response.statusCode, []);
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
                        result.title = i18n.t("Total.DeviceData");
                        res.render('total-terminal', result);
                });
        }
});