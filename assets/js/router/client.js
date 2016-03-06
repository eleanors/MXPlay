define(function (require, exports, module) {
    module.exports = function (req, res) {
        var i18n_lang = req.cookies.i18next || "zh-CN";
        i18n.setLng(i18n_lang == "zh-CN" ? "zh-CN" : "en-US");
        res.render('./standalone/client', {
            layout: "./standalone/homeLayout",
            i18nlng: req.cookies.i18next && req.cookies.i18next == "en-US" ? "en" : "",
            title: i18n.t("feTitle.ClientAPI"),
            metakeywords: 'APP开发,APP开发工具,APP软件开发,WEB APP,移动应用开发,移动应用开发工具,HTML5 APP开发,hybrid app,phonegap',
            metadescription: 'APICloud是中国首个“云端一体”的移动应用云服务提供商，APICloud是中国领先的APP软件开发服务商。我们提供积木拼装式跨平台APP开发，包括APP开发工具、APP软件开发、APP开发技术、WEB APP开发、移动应用开发、移动应用开发工具、HTML5 APP开发等全方位服务。拥有详尽hybrid app教程、phonegap教程，APICloud致力成为中国领先的移动垂直领域云服务商。'
        });
    };
});