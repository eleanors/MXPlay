define(['require', 'exports', 'module', 'request', '../module/helper', './nodeConfig'], function(require, exports, module, request, utils, config) {
	
        module.exports = function(req, res) {
                var hostname = config.mcmhost;
                if (req.cookies.mcmOpened == "1") {
                        var getModelListOptions = {
                                url: hostname + "/mxplay/data/getAppInfo.json",
                                method: "GET",
                                cache: false,
                                json: true,
                                headers: {
                                        'X-APICloud-AppId': req.cookies.curAppId
                                }
                        };
                        if (req && req.header) {
                                getModelListOptions.headers.Cookie = req.header('Cookie');
                        }
                        request(getModelListOptions,
                        function(error, response, body) {
                                var i18n_lang = req.cookies.i18next || "zh-CN";
                                i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN": "en-US");
                                if (body && body.status == 1) {
                                        return res.render('setting', {
                                                title: i18n.t("mainMenu.mcmbase"),
                                                obj: body.result,
                                                i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": ""
                                        });
                                }
                                return res.render(utils.getStatus(response.statusCode), {
                                        url: req.url,
                                        jsName: "error400"
                                });
                        });

                } else {
                        var options = {
                                url: hostname + "/mxplay/data/isTurnOver.json",
                                method: "POST",
                                cache: false,
                                json: true,
                                headers: {
                                        'X-APICloud-AppId': req.cookies.curAppId
                                }
                        }
                        if (req && req.header) {
                                options.headers.Cookie = req.header('Cookie');
                        }
                        request(options,
                        function(error, response, body) {
                                console.log(error);
								 var i18n_lang = req.cookies.i18next || "zh-CN";
                                i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN": "en-US");
                                if (body && body.status == 1) {
                                        return res.render('setting', {
                                                title: i18n.t("mainMenu.mcmapi"),
                                                i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "",
                                                jsName: "dataAuth",
                                                jsfunc: 'function getDataByTemplate() {' + '  return ' + JSON.stringify({
                                                        isTurnOver: body.result || false
                                                }) + '};'
                                        });
                                }
                                return res.render(utils.getStatus(response.statusCode), {
                                        url: req.url,
                                        jsName: "error400"
                                });
                        });
                }
        }
});