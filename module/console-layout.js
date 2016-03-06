define(function(require, exports, module) {
        // validate里的提醒，需要i18n，confirm，alert里需要i18n;
        require('ie-shim').init();
        var $ = require('jquery');
        require("bootstrap");

        require('validate');
        require('cookie');
        require('jqueryui');
        var Handlebars = require('Handlebars');
        require('./console_com');
        var errors = require("./msmErrors");
        var helper = require('./helper');
        var utils = require('./utils');
        require('../libs/jquery/placeholder');
        // var buyModal = require('./tpl-buy-modal.js');
        if (!window.i18n) {

                var i18nx = require("i18next");
                i18nx.init({
                        lng: $.cookie("i18next") || "zh-CN",
                        fallbackLng: false,
                        load: 'current'
                },
                function(t) {
                        LoadContent();
                });
                window.i18n = i18nx;
        } else {
                LoadContent();
        }

        function LoadContent() {
                var lang = $.cookie('i18next');
                if (lang) {
                        if ($("#langSelect")[0]) {
                                $("#langSelect").find('option:selected')[0].selected = false;
                                $("#langSelect").find('option[value="' + lang + '"]')[0].selected = true;
                        }
                }

                //切换语言
                $("#langSelect").on("change", function() {
                        i18n.setLng($(this).val());
                        location.reload();
                });

                // 个人信息
                $.ajax({
                        url: '/api/user/setting',
                        type: 'GET',
                        dataType: 'json',
                        cache: false
                }).done(function(data) {
                        if (data.status == 1) {
                                var phone = data.result.phone || '';
                                if (data.result.icon1) {
                                        $('#my_photo_icon').attr('src', data.result.icon1);
                                        $.cookie('userIcon', data.result.icon1, {
                                                expires: 7
                                        });
                                } else {
                                        $('#my_photo_icon').attr('src', '/img/favicon-30.png');
                                        $.cookie('nickname', data.result.userName, {
                                                expires: 7
                                        });
                                }
                                if (phone) {
                                        /*force add phone*/
                                        $('.main-applist-out #createApp').attr('data-phone', phone);
                                }
                                var email = $.cookie('username') || '';
                                if (data.result.userName) {
                                        $('#userName span').eq(0).html(data.result.userName);
                                        if ($.cookie('remMe')) {
                                                $.cookie('nickname', data.result.userName, {
                                                        expires: 7
                                                });
                                        } else {
                                                $.cookie('nickname', data.result.userName, {
                                                        expires: 1
                                                });
                                        }
                                } else {
                                        $('#userName span').eq(0).html(email);
                                        $.removeCookie('nickname', {
                                                expires: 1
                                        });
                                }
                                if (!data.result.state && $.cookie("VerfyEmail") != $.cookie('username')) {
                                        var $str = $('<div id="errTopMiddle" class="err-top fail">' +
                                        // '   <i class="err-close">'+
                                        // '       <i class="icon-remove"></i>'+
                                        // '   </i>'+
                                        '   <div class="err-out">' + '       <div class="err-switch">' + '           <i class="err-switch-i icon-smile"></i>' + '           <i class="err-switch-i icon-frown"></i>' + '           <span class="err-content">' + i18n.t('appInfo.unActive') + '</span>' + '       </div>' + '   </div>' + '</div>');

                                        $str.appendTo($("body"));
                                        $str.slideDown();
                                        $str.find(".icon-remove").on("click",
                                        function() {
                                                $(this).slideUp(400,
                                                function() {
                                                        $str.remove();
                                                        $.cookie("VerfyEmail", $.cookie('username'), {
                                                                expires: 7
                                                        });
                                                });
                                        });
                                }
                        } else {
                                // console.log(data);
                        }
                }).always(function() {});

                $('.main-applist-out').on('click', '.tpl-accredit', function() {
                        var taobao = $(this).attr('data-url');
                        var parent = $(this).parents('.dd-right');
                        var name = parent.find('h5').text();
                        var info = parent.find('h5').attr('data-info');
                        $('#tpl-app-name').val(name).trigger('input');
                        $('#tpl-intro').val(info).trigger('input');
                        $('.buy-at-once').attr('href', taobao);
                        buyModal.createApp();
                });
                $('.main-applist-out').on('click', '.tpl-dele', function() {
                        var id = $(this).parents('dd').attr('temid');
                        var parent = $(this).parents('dd.clearfix');
                        $.ajax({
                                url: '/deleteNotPayTem',
                                type: 'POSt',
                                dataType: 'json',
                                data: {
                                        id: id
                                },
                                success: function(data) {
                                        if (data.status) {
                                                parent.remove();
                                                utils.alertMessage(1, data.msg);
                                        } else if (data.code) {
                                                alert(i18n.t("tplStore.err_" + data.code));
                                        } else {
                                                alert(data.msg);
                                        };
                                },
                                error: function(data) {

}
                        });
                });
                $('.main-applist-out').on('click', 'dd.app',
                function(event) {
                        var $this = $(this);
                        var appId = $this.attr('appid');
                        var appname = $this.find('h5').html();
                        $.cookie('curAppId', appId, {
                                expires: 7
                        });
                        $.cookie('curAppName', appname, {
                                expires: 7
                        });
                        window.location.href = '/appoverview';
                });
                $('.loading-more').on('click',
                function(event) {
                        $('.main-applist-out').addClass('all');
                        event.preventDefault();
                });

                //退出登录
                $('#sign_out').one('click',
                function() {
                        $.removeCookie('curAppId');
                        $.removeCookie('curAppName');
                        $.removeCookie('username');
                        $.removeCookie('nickname');
                        $.removeCookie('ul_token');
                        //BBS login
                        $.ajax({
                                url: '/api/user/signout',
                                type: 'GET',
                                cache: false,
                                async: false
                        }).done(function() {
                                var bbsFrm = $('#bbsLogin')[0].contentWindow.document.getElementById('bbsFrm3');
                                bbsFrm.submit();
                                setTimeout(function() {
                                        location.href = '/signin';
                                },
                                2000);

                        });
                        return false;
                });

                //load page exec script
                var pathname = location.pathname;
                var fun = pathname.slice(1);
                fun = fun || 'appoverview';
                var jname = getJsName();
                if (jname) {
                        fun = jname;
                }
                //require.async("{ENV}/" + fun, function (module) {
                // setTimeout(function () {
                //     module.init();
                // }, 400);
                // });
                helper.init();

        }

        // exports.init = function(){
        // };
});