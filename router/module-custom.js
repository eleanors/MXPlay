define(['require', 'exports', 'module', 'request', '../module/helper', './nodeConfig'], function(require, exports, module, request, utils, config) {
	
        module.exports = function(req, res) {
                var appid = req.cookies.curAppId;
                var hostname = config.host;

                var reqUrl = hostname + '/mxplay/data/getModule.json?appId=' + appid + '&startNum=0&size=32&platform=-1&type=6&timepicker=' + new Date().getTime();
                var options = {
                        url: reqUrl,
                        json: true,
                        headers: {}
                };
                if (req && req.header) {
                        options.headers.Cookie = req.header('Cookie');
                }

                request(options, function(error, response, body) {
                        var i18n_lang = req.cookies.i18next || "zh-CN";
                        i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN": "en-US");
                        if (!error && response.statusCode == 200) {
                                var json = body || {};
                                json.i18nlng = req.cookies.i18next && req.cookies.i18next == "en-US" ? "en": "";
                                json.title = i18n.t("cadModule.cusMod");
                                res.render('module-custom', json);
                        } else {
                                return res.render(utils.getStatus(response.statusCode), {
                                        url: req.url,
                                        jsName: "error400"
                                });
                        }
                });

        };
});