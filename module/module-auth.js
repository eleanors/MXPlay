define(function(require, exports, module) {
        var $ = require('jquery');
        require('jqueryui');
        require('cookie');
        var Handlebars = require('Handlebars');
        var util = require('./utils.js');
        require('../libs/jquery/jquery.bxslider.min');
        var errors = require("../assets/js/cadErrors");
        var module_util = require('./module_utils.js');
		
		
        exports.init = function() {
                var appid = $.cookie('curAppId');
                var startNum = 0;
                var i18nlng = $.cookie("i18next") == "en-US" ? "en": "";
                //是否滚动加载数据
                var reqLock = false;

                //滚动加载
                $(window).on('scroll', function() {
                        if ($(window).scrollTop() == $(document).height() - $(window).height()) {

                                if (reqLock) {
                                        return false;
                                }
                                $(".butterbar").addClass("active").removeClass("hide");
                                startNum += 10;
                                var reqUrl = '/mxplay/data/getMyAuthMd.json?&startNum=' + startNum + '&size=10&';
                                $.get(reqUrl, function(data, textStatus, xhr) {
                                        $(".butterbar").removeClass("active").addClass("hide");
                                        if (data && data.status) {
                                                if (data.body) {

} else {
                                                        return false;
                                                }
                                                var source = $('#mod-auth-template').html();
                                                var template = Handlebars.compile(source);
                                                data.i18nlng = i18nlng;
                                                var htm = template(data);
                                                $('.module-auth-box').append(htm);

                                                if (data.body.length < 10) {
                                                        reqLock = true;
                                                        return false;
                                                }

                                        }

                                });

                        }
                });
                module_util.moduleStoreDetail();
        };
});