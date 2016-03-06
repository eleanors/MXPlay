define(['require', 'exports', 'module', 'request', '../module/helper', './nodeConfig'], function(require, exports, module, request, utils, config) {

        module.exports = function(req, res) {
                var hostname = config.mamhost;
                var appid = req.cookies.curAppId;
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 6);
                var options = {
                        url: hostname + '/mxplay/data/getStatisticDataByAlbumAndDate.json',
                        method: "POST",
                        json: {
                                appId: appid,
                                startDate: utils.toFormat(startDate, "yyyy-MM-dd"),
                                endDate: utils.toFormat(new Date(), "yyyy-MM-dd"),
                                temptick: new Date().getTime()
                        },
                        headers: {}
                };
                var i18n_lang = req.cookies.i18next || "zh-CN";
                if (req && req.header) {
                        options.headers.Cookie = req.header('Cookie');
                }
                request(options, function(error, response, body) {

                        if (!error && response.statusCode == 200) {
                                if (body && body.st == 1) {
                                        var backdata = body.msg;
                                        var totalData = {
                                                totalUsersCount: 0,
                                                activeUsersCountRatioBySeven: 0,
                                                activeUsersCountBySeven: 0,
                                                activeUsersCountRatioByThirty: 0,
                                                activeUsersCountByThirty: 0,
                                                avgOnceUseTim6eBySeven: 0,
                                                avgOnceUseTimeByDay: 0
                                        }
                                        var xdate = [],
                                        totalUser = [],
                                        newUser = [],
                                        activeUser = [],
                                        activeUserRatio = [],
                                        startupCount = [],
                                        avgUseTime = [],
                                        detailsData = [];
                                        var todaydata, yestdaydata;
                                        var today = {
                                                newUsersCount: 0,
                                                newUsersRadioVsYestdayUp: false,
                                                newUsersRadioVsYestdayDown: false,
                                                newUsersRadioVsYestday: "0%",
                                                activeUsersCount: 0,
                                                activeUsersVsYestdayUp: false,
                                                activeUsersVsYestdayDown: false,
                                                activeUsersVsYestday: "0%",
                                                newUsersRadio: "0%",
                                                startupCount: 0,
                                                avgOnceUseTime: "00:00"
                                        }
                                        var total = {
                                                totalUsersCount: 0,
                                                totalStartupCount: 0,
                                                totalStartupAvgByUserCount: 0,
                                                totalUseAvgByUserCount: 0
                                        }
                                        if (backdata.length > 0) {
                                                todaydata = backdata[0];
                                                today.newUsersCount = todaydata.newRegsCount;
                                                today.activeUsersCount = todaydata.activeCountInToday;
                                                today.newUsersRadio = (today.activeUsersCount == 0 ? 0 : utils.toFixed(todaydata.newRegsCount / today.activeUsersCount * 100, 1)) + "%";
                                                today.startupCount = todaydata.todayOperationCount;
                                                today.avgOnceUseTime = todaydata.todayOperationCount ? utils.getTime(Math.floor(todaydata.todayUsingTime / todaydata.todayOperationCount)) : "00:00"

                                                total.totalUsersCount = todaydata.devicesCount;
                                                total.totalStartupCount = todaydata.todayOperationCount;
                                                total.totalStartupAvgByUserCount = (todaydata.devicesCount ? Math.floor(todaydata.todayOperationCount / todaydata.devicesCount) : 0) || 0;

                                                totalData.totalUsersCount = todaydata.devicesCount;
                                                totalData.activeUsersCountRatioBySeven = todaydata.devicesCount ? Math.floor(todaydata.activeCountInSevenDays / todaydata.devicesCount * 100) : 0;
                                                totalData.activeUsersCountBySeven = todaydata.activeCountInSevenDays;
                                                totalData.activeUsersCountRatioByThirty = todaydata.devicesCount ? Math.floor(todaydata.activeCountInThirtyDays / todaydata.devicesCount * 100) : 0;
                                                totalData.activeUsersCountByThirty = todaydata.activeCountInThirtyDays;
                                        }
                                        if (backdata.length > 1) {
                                                yestdaydata = backdata[1];
                                                if (yestdaydata.newRegsCount > todaydata.newRegsCount) {
                                                        today.newUsersRadioVsYestdayUp = false;
                                                        today.newUsersRadioVsYestdayDown = true;
                                                } else if (yestdaydata.newRegsCount < todaydata.newRegsCount) {
                                                        today.newUsersRadioVsYestdayUp = true;
                                                        today.newUsersRadioVsYestdayDown = false;
                                                }
                                                today.newUsersRadioVsYestday = (todaydata.devicesCount ? utils.toFixed(Math.abs(yestdaydata.newRegsCount - todaydata.newRegsCount) / todaydata.devicesCount * 100, 1) : 0) + "%";
                                                if (yestdaydata.activeCountInToday > todaydata.activeCountInToday) {
                                                        today.activeUsersVsYestdayUp = false;
                                                        today.activeUsersVsYestdayDown = true;
                                                } else if (yestdaydata.activeCountInToday < todaydata.activeCountInToday) {
                                                        today.activeUsersVsYestdayUp = true;
                                                        today.activeUsersVsYestdayDown = false;
                                                }
                                                today.activeUsersVsYestday = (todaydata.devicesCount ? utils.toFixed(Math.abs(yestdaydata.activeCountInToday - todaydata.activeCountInToday) / todaydata.devicesCount * 100, 1) : 0) + "%";
                                        } else if (backdata.length == 1) {
                                                if (todaydata.newRegsCount) {
                                                        today.newUsersRadioVsYestday = "100%";
                                                        today.newUsersRadioVsYestdayUp = true;
                                                        today.newUsersRadioVsYestdayDown = false;
                                                }
                                                if (todaydata.activeCountInToday) {
                                                        today.activeUsersVsYestday = "100%";
                                                        today.activeUsersVsYestdayUp = true;
                                                        today.activeUsersVsYestdayDown = false;
                                                }
                                        }
                                        var sevenUseTime = 0,
                                        sevenStartupCount = 0;
                                        for (var i = 0,
                                        len = backdata.length; i < len; i++) {
                                                var dt = utils.toFormat(backdata[i].reportDate, "MM-dd");
                                                xdate.unshift(dt);
                                                newUser.unshift(backdata[i].newRegsCount);
                                                totalUser.unshift(backdata[i].devicesCount);
                                                activeUser.unshift(backdata[i].activeCountInToday);
                                                activeUserRatio.unshift(backdata[i].devicesCount == 0 ? 0 : Math.floor(backdata[i].activeCountInToday / backdata[i].devicesCount * 100));
                                                startupCount.unshift(backdata[i].todayOperationCount);
                                                avgUseTime.unshift(backdata[i].todayOperationCount ? Math.floor(backdata[i].todayUsingTime / backdata[i].todayOperationCount) : 0);
                                                sevenUseTime += (backdata[i].todayUsingTime || 0);
                                                sevenStartupCount += (backdata[i].todayOperationCount || 0);
                                        }
                                        //7天
                                        total.totalUseAvgByUserCount = totalData.avgOnceUseTimeBySeven = sevenStartupCount ? utils.toFixed(sevenUseTime / sevenStartupCount / 60, 2) : 0;
                                        totalData.avgOnceUseTimeByDay = totalData.activeUsersCountBySeven ? utils.toFixed((sevenUseTime / (totalData.activeUsersCountBySeven * 7 * 60)), 2) : 0;

                                        for (var i = 0,
                                        len = xdate.length; i < len; i++) {
                                                var obj = {
                                                        date: xdate[i],
                                                        newUserCount: newUser[i],
                                                        totalUserCount: totalUser[i],
                                                        activeUserCount: activeUser[i],
                                                        activeUserCountRatio: activeUserRatio[i] + "%",
                                                        startupCount: startupCount[i],
                                                        userTime: utils.getTime(avgUseTime[i])
                                                };
                                                detailsData.unshift(obj);
                                        }
                                        var preseven = new Date();
                                        preseven.setDate(preseven.getDate() - 7);
                                        for (var i = 1; i <= 7; i++) {
                                                var dstr = utils.getAddDate(preseven, 1);
                                                if (xdate.indexOf(dstr) == -1) {
                                                        xdate.splice(i - 1, 0, dstr);
                                                        newUser.splice(i - 1, 0, 0);
                                                        totalUser.splice(i - 1, 0, 0);
                                                        activeUser.splice(i - 1, 0, 0);
                                                        activeUserRatio.splice(i - 1, 0, 0);
                                                        startupCount.splice(i - 1, 0, 0);
                                                        avgUseTime.splice(i - 1, 0, 0);
                                                }
                                        }
                                        totalData.xdate = xdate;
                                        totalData.newUser = newUser;
                                        totalData.activeUser = activeUser;
                                        totalData.activeUserRatio = activeUserRatio;
                                        totalData.startupCount = startupCount;
                                        totalData.avgUseTime = avgUseTime;
                                        totalData.totalUser = totalUser;
                                        totalData.details = detailsData;
                                        totalData.pagetotal = Math.ceil(detailsData.length / 10);
                                        i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN": "en-US");
                                        var json = {
                                                title: i18n.t("Total.AppData"),
                                                today: today,
                                                total: total,
                                                i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                                                jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify(totalData) + '};'
                                        };
                                        return res.render('./total', json);
                                }
                        }
                        return res.render(utils.getStatus(response.statusCode), {
                                url: req.url,
                                jsName: "../error400"
                        });
                });
        }
});