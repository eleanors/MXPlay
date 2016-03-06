define(['require', 'exports', 'module', 'request', 'async', '../module/helper', './nodeConfig'], function(require, exports, module, request, async, utils, config) {
	
        module.exports = function(req, res) {
                var appid = req.cookies.curAppId;
                var appname = req.cookies.curAppName;
                var hostname = config.mamhost;
				
                async.waterfall([
                function(callback) {
                        var options = {
                                url: hostname + '/mxplay/data/queryVerByCondition.json',
                                json: true,
                                method: 'POST',
                                jar: true,
                                form: {
                                        appId: appid,
                                        queryType: 3,
                                        startPos: 0,
                                        queryCount: 5
                                },
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options,
                        function(error, response, body) {
                                if (!error && response.statusCode == 200) {} else {
                                        return callback(response.statusCode, []);
                                }
                                callback(null, body);
                        });

                },
                function(arg, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/getpkgversionlist.json',
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
                                if (!error && response.statusCode == 200) {
                                        arg.list = body;
                                } else {
                                        return callback(response.statusCode, []);
                                }
                                callback(null, arg);
                        });

                },
                /*get channel ,if result is empty then hidden channel*/

                function(arg, callback) {
                        var options = {
                                url: hostname + '/mxplay/data/getChannel.json?appId=' + appid,
                                json: true,
                                method: 'get',
                                jar: true,
                                headers: {}
                        };
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options,
                        function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                        if (body.status) {
                                                arg.channel = body.result;
                                        };
                                } else {
                                        return callback(response.statusCode, []);
                                }
                                callback(null, arg);
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
                        var data = result || {};
                        data.title = i18n.t("mainMenu.version");
                        data.i18nlng = req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "";
                        console.log('--------------', data);
                        res.render('total-version', data);
                });
        };

});