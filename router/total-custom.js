define(function(require, exports, module) {
        module.exports = function(req, res) {
                var DetailsData = [{
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                },
                {
                        id: 1,
                        eventId: "play",
                        eventName: "点击播放音乐",
                        todayMessageCount: 20,
                        yestdayMessageCount: 90,
                        customMessageCount: 100
                }];

                var totalData = {
                        details: DetailsData,
                        pagetotal: Math.ceil(DetailsData.length / 10)
                };
                var json = {
                        title: i18n.t("Total.CustomEvent"),
                        i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                        jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify(totalData) + '};'
                };
                res.render('total-custom', json);
        }
});