define(['require', 'exports', 'module', 'request', 'async', '../module/helper', './nodeConfig'], function(require, exports, module, request, async, utils, config) {

        module.exports = function(req, res) {
                
                //最新应用信息
                var appid = req.cookies.curAppId;
                var appname = req.cookies.curAppName;

                // var appid, appname;
                var hostname = config.host;
                async.waterfall([

                        function(callback) {
                                if (appid) {
                                        return callback(null, appid);
                                }
                                //取最新专辑ID
                                var options = {
                                        url: hostname + '/mxplay/data/getFirstAlbum.json',
                                        json: true,
                                        headers: {}
                                };
                                if (req && req.header) {
                                        options.headers.Cookie = req.header('Cookie');
                                }
                                request(options, function(error, response, body) {
                                        console.log('gggggggggggggg', body)
                                        if (!error && response.statusCode == 200) {
                                                appid = body.body.appId;
                                                appname = body.body.appName;
                                        } else {
                                                // console.error('req first appid error', error);
                                        }
                                        callback(null, appid);
                                });

                        },
                        function(appid_temp, callback) {
                                var options1 = {
                                        url: hostname + '/mxplay/data/ablumInfo.json?appId=' + appid_temp,
                                        json: true,
                                        jar: true,
                                        headers: {}
                                };
                                if (req && req.header) {
                                        options1.headers.Cookie = req.header('Cookie'); //将用户的 Cookie 传递给后台服务器
                                }
                                request(options1, function(error, response, body) {
                                        var json;
                                       // console.log('1111111111111111', response)
                                        if (!error && response.statusCode == 200) {
                                                json = body.result || {};
                                                json.appid_temp = appid_temp;
                                        } else {
                                                return callback(response.statusCode, []);
                                        }
                                        callback(null, json);
                                });

                        },
                        function(arg, callback) {
                                var options2 = {
                                        url: hostname + '/mxplay/data/getIndexSVNLog.json?appId=' + arg.appid_temp,
                                        json: true,
                                        method: 'GET',
                                        jar: true,
                                        headers: {}
                                };
                                if (req && req.header) {
                                        options2.headers.Cookie = req.header('Cookie'); //将用户的 Cookie 传递给后台服务器
                                }
                                //SVN log
                                request(options2, function(error, response, body) {
                                        var json;
                                        if (!error && response.statusCode == 200) {
                                                json = arg;
                                                json.svn = body;
                                        } else {
                                                return callback(response.statusCode, []);
                                        }
                                        callback(null, json);
                                });
                        }
                ], function(err, result) {
                       // console.log(err);
						var i18n_lang = req.cookies.i18next || "zh-CN";
						i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN" : "en-US")
						
                        if (err) {
                                return res.render(utils.getStatus(err), {
                                        url: req.url,
                                        jsName: "error400"
                                });
                        }
                        result.i18nlng = req.cookies.i18next && req.cookies.i18next == "en-US" ? "en" : "";
                        result.title = i18n.t("mainMenu.overview");
                        //console.log('----------------', result)
                        res.render('appoverview', result);
                });
        };
});
