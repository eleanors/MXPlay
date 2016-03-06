define(['require', 'exports', 'module', 'request', 'async', './nodeConfig', '../module/helper'], function(require, exports, module, request, async, config, utils) {
	
        module.exports = function(req, res) {
                var appid = req.cookies.curAppId;
                var appname = req.cookies.curAppName;
                var hostname = config.host;

                async.waterfall([

                function(callback) {
                        var options = {
                                url: hostname + '/mxplay/data/push/statistics.json?appId=' + appid,
                                method: 'GET',
                                json: true,
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options, function(error, response, body) {
                                if (!error && response.statusCode == 200) {} else {
                                        return callback(response.statusCode, []);
                                }
                                var arg = {
                                        devs: body.result
                                };
                                callback(null, arg);
                        });
                },
                function(result, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/push/messages.json?si=0&ps=5&appId=' + appid,
                                method: 'GET',
                                json: true,
                                jar: true,
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options, function(error, response, body) {
                                if (!error && response.statusCode == 200) {} else {
                                        return callback(response.statusCode, []);
                                }
                                result.messages = body.result.items;
                                callback(null, result);
                        });
                },
                function(result, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/push/getgrouplist.json',
                                json: true,
                                method: 'POST',
                                form: {
                                        curAppId: appid
                                },
                                jar: true,
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie'); //将用户的 Cookie 传递给后台服务器
                        }
                        //SVN log
                        request(options, function(error, response, body) {
                                if (!error && response.statusCode == 200) {} else {
                                        return callback(response.statusCode, []);
                                }
                                result.groups = body.msg;
                                callback(null, result);
                        });
                },
                function(result, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/push/pushsetting_select.json',
                                json: true,
                                method: 'POST',
                                form: {
                                        curAppId: appid
                                },
                                jar: true,
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options, function(error, response, body) {
                                if (!error && response.statusCode == 200) {} else {
                                        return callback(response.statusCode, []);
                                }
                                result.config = body.msg[0];
                                callback(null, result);
                        });
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
                        result.title = i18n.t("mainMenu.push");
                        result.i18nlng = req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "";
                        res.render('push', result);
                });
        };
});