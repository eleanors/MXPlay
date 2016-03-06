define(['require', 'exports', 'module', 'jquery', 'jqueryui', 'cookie', 'Handlebars', './utils', './module_utils', '../assets/js/cadErrors', '../libs/jquery/jquery.bxslider.min'], function(require, exports, module, jquery, jqueryui, cookie, Handlebars, util, module_util, errors) {
	
	
console.log(module_util)



        exports.init = function() {
                var appid = $.cookie('curAppId') || 1000;
                var startNum = 0;
                var i18nlng = $.cookie("i18next") == "en-US" ? "en": "";
                //是否滚动加载数据
                var reqLock = false;

                var $modulesOuterBox = $('#modules-outer-box');
                var $platformSearch = $('#pf-text');
                //请求模块数据
                var $modCon = $('.module-box');
                // var $modTpl = $('#mod-template');
                //移除模块
                // 已添加中移除模块
                $modCon.on('click', '.status-group.del', function() {
                        var $this = $(this);
                        var $mod = $this.closest('.module-container');
                        var mid = $this.attr('mdid');
                        $.post('/mxplay/data/removeModule.json', {
                                appId: appid,
                                mdId: mid
                        },
                        function(data, textStatus, xhr) {
                                if (data && data.status) {
                                        $mod.remove();
                                }
                        });
                });
                // price-group 授权
                $('#module').on('click', '.price-group .btn-buy', function(event) {
                        var $this = $(this);
                        var $thisForm = $this.parents('.module-container-inner').find('.module-auth-form');
                        $thisForm.find('label.error').remove();
                        $thisForm.find('.module-auth-input').val('');
                        $thisForm.validate({
                                ignore: '',
                                // errorPlacement: function(error, element) {
                                // if(element.attr("name") === "module-auth-input"){
                                //     $('#md-name-err').html(error);
                                // }
                                // },
                                rules: {
                                        'module-auth-input': {
                                                required: true,
                                                minlength: 10
                                        }
                                },
                                messages: {
                                        'module-auth-input': {
                                                minlength: i18n.t('moduleStore.note2_1'),
                                                required: i18n.t('moduleStore.note2_2')
                                        }
                                },
                                submitHandler: function(form) {

                                        $thisForm.find('.btn-submit').attr('disabled', 'disabled');
                                        var license_key = $thisForm.find('.module-auth-input').val();
                                        var mdId = $this.parents('.module-container').attr('mdid');
                                        var appId = appid;
                                        // console.log(license_key,mdId,appId);
                                        $.ajax({
                                                url: '/useKey',
                                                type: 'POST',
                                                abort: true,
                                                data: {
                                                        appId: appId,
                                                        mdId: mdId,
                                                        license_key: license_key
                                                },
                                                success: function(data) {
                                                        if (data && data.status) {
                                                                $thisForm.parents('.module-auth-form-box').removeClass('active');
                                                                $thisForm.parents('.module-container-inner').find('.price-group').addClass('bought');
                                                                // alert('授权成功');
                                                                util.alertMessage(1, i18n.t('moduleStore.note2_3'));
                                                        } else {
                                                                util.alertMessage(0, data.msg);
                                                        }
                                                },
                                                error: function(data) {},
                                                complete: function() {
                                                        $thisForm.find('.btn-submit').removeAttr('disabled');
                                                }
                                        });

                                        return false;
                                }
                        });
                        $this.parents('.price-group').next('.module-auth-form-box').addClass('active');
                        event.preventDefault();
                });
                $('#module').on('click', '.module-auth-form-box .btn-cancel', function(event) {
                        var $this = $(this);
                        $this.parents('.module-auth-form-box').removeClass('active');
                        event.preventDefault();
                });

                //滚动加载
                $(window).on('scroll',  function() {
                        if ($(window).scrollTop() == $(document).height() - $(window).height()) {

                                if (reqLock) {
                                        return false;
                                }
                                if ($('.panel-body.introduction').length > 0) {
                                        return false;
                                }
                                $(".butterbar").addClass("active").removeClass("hide");
                                startNum += 32;
                                var type = 7;
                                var size = 32;
                                var reqUrl = '/mxplay/data/getModule.json?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=-1&type=' + type;
                                $.get(reqUrl,  function(data, textStatus, xhr) {
                                        $(".butterbar").removeClass("active").addClass("hide");
                                        if (data && data.status) {

                                                var source = $('#mod-template').html();
                                                var template = Handlebars.compile(source);
                                                data.i18nlng = i18nlng;
                                                var htm = template(data);
                                                $modCon.append(htm);

                                                if (data.body.length < 32) {
                                                        reqLock = true;
                                                        return false;
                                                }

                                        }

                                });

                        }
                });
				
				
                module_util.moduleStoreDetail();

                // 是否显示小贴士
                var hideModuleTips = function() {
                        if ($.cookie('closeModuleTips')) {
                                return
                        }
                        $('.bind-module-notice').fadeIn();
                };
                setTimeout(function() {
                        hideModuleTips();
                },
                500);
                $('.bind-module-notice').on('click', '.module-notice-close', function(event) {
                        $.cookie('closeModuleTips', 'true', {
                                expires: 0
                        });
                        $('.bind-module-notice').fadeOut();
                        event.preventDefault();
                });
        };
});