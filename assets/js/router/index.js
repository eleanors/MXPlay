define(function (require, exports, module) {
    module.exports = function (req, res) {
alert()
        // var appid, appname;
        var config = require('./nodeConfig.js');
        var hostname = config.host;
        var i18n_lang = req.cookies.i18next || "zh-CN";
        i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN" : "en-US");
        //最新应用信息
		console.log(res)
        res.render('./standalone/index', {
            layout: false,
            i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en" : "",
            title: i18n.t("feTitle.indexTitle"),
            metakeywords: 'APP开发,APP开发工具,APP软件开发,WEB APP,移动应用开发,移动应用开发工具,HTML5 APP开发,hybrid app,phonegap',
            metadescription: 'APICloud是中国首个“云端一体”的移动应用云服务提供商。APICloud为开发者从“云”和“端”两个方向提供API，简化移动应用开发技术，让移动应用的开发周期从一个月缩短到7天。AAPICloud是中国首个“云端一体”的移动应用云服务提供商，APICloud是中国领先的APP开发、移动应用开发服务商。APICloud提供APP开发工具、APP开发技术、WEB APP开发、移动应用开发等全方位HTML5 APP开发服务。APICloud致力成为中国领先的移动垂直领域云服务商，hybrid app教程，phonegap教程， APP开发尽在APICloud。'
        });

    };
});