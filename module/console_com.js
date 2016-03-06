define(function(require, exports, module) {
        // validate里的提醒，需要i18n，confirm，alert里需要i18n;
        // require('../ie/ie-shim.js').init();
        var $ = require('jquery');
        // require("bootstrap")($);
        // require('placeholder');
        // require('validate');
        // require('cookie');
        // require('jqui');
        // if (!window.i18n) {
        //     var i18nx = require("i18next");
        //     i18nx.init({
        //         lng: $.cookie("i18next") || "zh-CN",
        //         fallbackLng: false,
        //         load: 'current'
        //     }, function (t) {
        //         LoadContent();
        //     });
        //     window.i18n = i18nx;
        // } else {
        //     LoadContent();
        // }
        // function LoadContent(){
        var utils = require('./utils.js');
        var errors = require("./msmErrors");
        var lang = $.cookie('i18next');
        var Handlebars = require('Handlebars');
        // var utils = require('./utils.js');
        // var buyModal = require('./tpl-buy-modal.js');
        if (lang) {
                if ($("#langSelect")[0]) {
                        $("#langSelect").find('option:selected')[0].selected = false;
                        $("#langSelect").find('option[value="' + lang + '"]')[0].selected = true;
                }
        }

        // var ss=$('.no-accredit').attr('data_url');
        // console.log(ss);
        //切换语言
        $("#langSelect").on("change", function() {
                i18n.setLng($(this).val());
                location.reload();
        });

        var showApplist = function(options) {
                var opt = options || {};
                var json = {};
                var ele = opt.element || '';
                json.applist = opt.data || '';
                if (ele == '#applist-tpl') {
                        if (json.applist[0]) {
                                $.cookie('curAppId', json.applist[0].appId, {
                                        expires: 7
                                });
                                $.cookie('curAppName', json.applist[0].appName, {
                                        expires: 7
                                });
                        } else {
                                utils.alertMessage(0, i18n.t('appInfo.nonAppInfo'));
                                return;
                        }
                };
                var $tpl = $(ele);
                var tpl = $tpl.html();
                var template = Handlebars.compile(tpl);
                var html = template(json);
                $('.isLoading').remove();
                $('.main-applist-out dl').append(html);
                if ($('.main-applist-out dl .clearfix').length < 5) {
                        $('.main-applist-out').addClass('all');
                } else {
                        $('.main-applist-out').removeClass('all');
                }
        };
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
        $('.main-applist-out').on('click', 'dd.app', function(event) {
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
        $('.loading-more').on('click', function(event) {
                $('.main-applist-out').addClass('all');
                event.preventDefault();
        });
        // 未授权模版添加
        // $.ajax({
        //     url: '/getUnauthorizedTlStore',
        //     type: 'GET',
        //     dataType: 'json',
        //     cache: false
        // }).done(function(data) {
        //     if(data && data.status){
        //         showApplist({
        //             element:'#noAccrediTpl',
        //             data:data.body
        //         });
        //     } else{
        //         utils.alertMessage(0,errors.msmTip[data.code]);
        //     }
        // }).fail(function(data) {
        // });
        $.ajax({
                url: '/api/apps',
                type: 'GET',
                dataType: 'json',
                cache: false
        }).done(function(data) {
                if (data && data.status) {
                        // showApplist({
                        //     element:'#applist-tpl',
                        //     data:data.result
                        // });
                } else {
                        utils.alertMessage(0, errors.msmTip[data.code]);
                }
        }).fail(function(data) {});
        //创建APP
        $('.main-applist-out .btn').on('click', function() {
                var phone = $(this).attr('data-phone') || '';
                if (!phone) {
                        $('#mobileForm_modal .modal-title').text(i18n.t('common.bindingMobile'));
                        changeCcap();
                        $('#mobileForm_modal').modal({
                                backdrop: 'static',
                                show: true
                        }); 
						return;
                };
                var $createDialog = $('#create-dialog');
                var options = {
                        dialogClass: 'create-dialog',
                        resizable: false,
                        maxHeight: 400,
                        minWidth: 500,
                        modal: true
                };

                if (!$createDialog.get(0)) {
                        var html = '<div id="create-dialog">' + '<form role="form" class="form-horizontal" id="create-appfrm" method="post">' + '<div class="btn-group" id="app-type">' + '<input type="hidden" name="appType" value="0" />' + '<button type="button" class="first btn active">Native</button>' +
                        // '<button type="button" class="btn tv">TV</button>' +
                        '<button type="button" class="btn web">Web</button>' + '<button type="button" class="btn love">表白App</button>' +
                        // '<button type="button" class="btn store">模版App</button>' +
                        '</div>' + '<div class="btn-group" id="app-sub-type">' + '<span class="fake-check love1">向她告白</span>' + '<span class="fake-check love2">向他告白</span>' + '<span class="fake-check love3">向Ta告白</span>' + '</div>' + '<div id="nativeWeb">' + '<div class="form-group">' + '<label for="app-name" class="col-sm-2 control-label">' + i18n.t('common.name') + '</label>' + '<div class="col-sm-10 word-wrapper">' + '<input type="text" class="form-control" name="createAppName" id="app-name" placeholder="">' + '<label class="word-limit"><em>0</em>/20</label>' + '</div>' + '</div>' + '<div class="form-group">' + '<label for="app-intro" class="col-sm-2 control-label">' + i18n.t('common.explain') + '</label>' + '<div class="col-sm-10 word-wrapper">' + '<textarea class="form-control" name="createAppInfo" style="resize: none;" row="6" id="app-intro"></textarea>' + '<label class="word-limit"><em>0</em>/100</label>' + '</div>' + '</div>' + '<div class="form-group web-input" style="display:none">' + '<label for="app-web" class="col-sm-2 control-label">' + i18n.t('common.webPage') + '</label>' + '<div class="col-sm-10">' + '<input type="text" name="createAppUrl" class="form-control" id="app-web" placeholder="">' + '</div>' + '</div>' + '<div class="form-group">' + '<div class="col-sm-offset-2 col-sm-10 btns">' + '<button type="submit" class="btn create">' + i18n.t('common.create') + '</button>' + '<button type="button" class="btn cancel">' + i18n.t('common.cancel') + '</button>' + '</div>' + '</div>' + '</div>' + '<div class="row" id="tplStore">' + '<div class="col-md-8">' + '<div class="form-group">' + '<label for="app-web" class="col-sm-2 control-label">模版</label>' + '<div class="col-sm-10">' + '<select id="tplApp" class="form-control"></select>' + '</div>' + '</div>' + '<div class="form-group">' + '<label for="app-name" class="col-sm-2 control-label">' + i18n.t('common.name') + '</label>' + '<div class="col-sm-10 word-wrapper">' + '<input type="text" class="form-control" name="createAppName" id="tpl-name" placeholder="">' + '<label class="word-limit"><em>0</em>/20</label>' + '</div>' + '</div>' + '<div class="form-group">' + '<label for="app-intro" class="col-sm-2 control-label">' + i18n.t('common.explain') + '</label>' + '<div class="col-sm-10 word-wrapper">' + '<textarea class="form-control" name="createAppInfo" style="resize: none;" row="6" id="tpl-intro"></textarea>' + '<label class="word-limit"><em>0</em>/100</label>' + '</div>' + '</div>' +

                        '<div class="form-group">' + '<div class="col-sm-offset-2 col-sm-10 btns">' + '<button type="submit" class="btn create">' + i18n.t('common.create') + '</button>' + '<button type="button" class="btn cancel">' + i18n.t('common.cancel') + '</button>' + '</div>' + '</div>' + '</div>' + '<div class="col-md-3">' + '<div id="tplIcon">' + '<img src="">' + '</div>' + '<div class="tpl-look">' + '<a id="tplDetail" href="">详情</a>' + '<a class="tpl-more" href="/tpl-store">更多模版</a>' + '</div>' + '</div>' + '</div>' + '<div id="loveApp">' + '<div class="form-group lovename">' + '<label for="app-name" class="col-sm-2 control-label">' + i18n.t('common.name') + '</label>' + '<div class="col-sm-10 word-wrapper">' + '<input type="text" class="form-control loveinput" name="createAppName" id="love-name" placeholder="">' + '<label class="word-limit lovelable"><em>0</em>/20</label>' + '</div>' + '</div>' + '<div class="form-group lovebtn">' + '<div class="col-sm-offset-2 col-sm-10 btns">' + '<button type="submit" class="btn create">' + i18n.t('common.lovecreate') + '</button>' + '<button type="button" class="btn cancel">' + i18n.t('common.lovecancel') + '</button>' + '</div>' + '</div>' + '</div>' + '</div>' + '</form>' + '</div>';
                        $createDialog = $(html);
                        $(document.body).append($createDialog);
                        $createDialog.dialog(options);
                } else {
                        $createDialog.dialog(options);
                        $createDialog.find('label.error').remove();
                        $createDialog.find('input[type="text"]').val('');
                        $createDialog.find('em').html('0');
                        $createDialog.find('textarea').val('');
                        setTplWidth();
                }
                var str = '',
                picStr = '';
                // $.ajax({
                //     url:'/getDefaultTlStore',
                //     method:'get',
                //     dataType:'json',
                //     success:function(data){
                //         if (data.status == 1) {
                //             var result = data.body;
                //             for (var i = 0; i < result.length; i++) {
                //                 str += '<option data-id="'+result[i].tlId+'" value="'+result[i].tlId+'">'+result[i].tlName+'</option>';
                //                 picStr += '<img id="tplPic'+result[i].tlId+'" src="'+result[i].icon1_path+'">'
                //             };
                //             $('#tplApp').append(str);
                //             $('#tplIcon').append(picStr);
                //         };
                //     },
                //     error:function(data){
                //     }
                // });
                $('#tplApp').on('change', function() {
                        var id = $(this).find('option:selected').attr('data-id');
                        var url = 'tpl-detail?tlId=' + id;
                        $('#tplIcon img').hide();
                        $('#tplPic' + id).show();
                        $('#tplDetail').attr('href', url);
                })
                //选择类型
                var $appType = $createDialog.find('#app-type');
                var $appSubType = $createDialog.find('#app-sub-type');
                var $webInput = $createDialog.find('.web-input');
                var $type = $appType.find('[name="appType"]');
                $appType.find('.btn').on('click',
                function() {
                        $appType.find('.active').removeClass('active');
                        $(this).addClass('active');
                        setTplWidth();
                        if ($(this).hasClass('web')) {
                                $('#loveApp,#tplStore').hide();
                                $('#nativeWeb').show();
                                $appSubType.hide();
                                $createDialog.parent('div').css('background', '#fff');
                                $webInput.show();
                                $type.val('1');
                        } else if ($(this).hasClass('tv')) {
                                $('#loveApp,#tplStore').hide();
                                $webInput.hide();
                                $('#nativeWeb').show();
                                $appSubType.hide();
                                $createDialog.parent('div').css('background', '#fff');
                                $type.val('4');
                        } else if ($(this).hasClass('love')) {
                                $('#loveApp').show();
                                $('#nativeWeb,#tplStore').hide();
                                $appSubType.show();
                                $createDialog.parent('div').css({
                                        'background': 'url(../../img/love11.jpg) center center no-repeat',
                                        'background-size': '100%'
                                }); 
								$appSubType.find('.active').removeClass('active');
                                $appSubType.find('.love1').addClass('active');
                                $type.val('11');
                        } else if ($(this).hasClass('store')) {
                                $appSubType.hide();
                                $('#tplStore').show();
                                $('#loveApp,#nativeWeb').hide();
                                $createDialog.parent('div').css('background', '#fff');
                                $('#tplApp').trigger('change');
                                $type.val('5');
                        } else {
                                $appSubType.hide();
                                $('#loveApp,#tplStore').hide();
                                $('#nativeWeb').show();
                                $createDialog.parent('div').css('background', '#fff');
                                $webInput.hide();
                                $type.val('0');
                        }
                });
                $appSubType.find('.fake-check').on('click',
                function() {
                        $appSubType.find('.active').removeClass('active');
                        $(this).addClass('active');
                        if ($(this).hasClass('love1')) {
                                $('#loveApp').show();
                                $('#nativeWeb,#tplStore').hide();
                                $createDialog.parent('div').css({
                                        'background': 'url(../../img/love11.jpg) center center no-repeat',
                                        'background-size': '100%'
                                }); 
								$type.val('11');
                        } else if ($(this).hasClass('love2')) {
                                $('#loveApp').show();
                                $('#nativeWeb,#tplStore').hide();
                                $createDialog.parent('div').css({
                                        'background': 'url(../../img/love12.jpg) center center no-repeat',
                                        'background-size': '100%'
                                }); 
								$type.val('12');
                        } else if ($(this).hasClass('love3')) {
                                $('#loveApp').show();
                                $('#nativeWeb,#tplStore').hide();
                                $createDialog.parent('div').css({
                                        'background': 'url(../../img/love13.jpg) center center no-repeat',
                                        'background-size': '100%'
                                }); 
								$type.val('13');
                        }
                });
                function setTplWidth() {
                        var width = $createDialog.dialog("option", "width");
                        if ($createDialog.find('#app-type .active').hasClass('store')) {
                                $createDialog.dialog("option", "width", 650);
                        } else {
                                $createDialog.dialog("option", "width", 500);
                        };
                }
                //创建APP表单验证
                var $creatAppFrm = $('#create-appfrm');
                var regTest = require('./regTest.js');
                $.validator.addMethod('addAppName', function(value, element, param) {
                        if (regTest.appName.test(value)) {
                                return true;
                        } else {
                                return false;
                        }
                },
                i18n.t('appInfo.notice'));
                $creatAppFrm.validate({
                        rules: {
                                createAppName: {
                                        required: true,
                                        addAppName: true
                                },
                                createAppUrl: {
                                        required: true,
                                        url: true
                                }
                        },
                        messages: {
                                createAppName: {
                                        required: i18n.t('cadPackage.valid_appname')
                                },
                                createAppUrl: {
                                        required: i18n.t('appInfo.notice1'),
                                        url: i18n.t('appInfo.notice2')
                                }
                        },
                        submitHandler: function(form) {
                                var name = $creatAppFrm.find('#app-name').val();
                                if ($appType.find('.love').hasClass('active')) {
                                        name = $creatAppFrm.find('#love-name').val();
                                }

                                var info = $creatAppFrm.find('[name="createAppInfo"]').val();
                                var type = $creatAppFrm.find('[name="appType"]').val();
                                var appWebUrl = $('#app-web').val();
                                var $submit = $creatAppFrm.find('button.create');
                                $submit.attr('disabled', 'disabled');
                                var postData = {
                                        'appName': name,
                                        'appInfo': info,
                                        'appMsmControl': 0,
                                        'appType': type,
                                        timepicker: new Date().getTime()
                                };
                                if (type == 1) {
                                        postData.appWebUrl = appWebUrl;
                                }
                                /* loveApp*/
                                if (type == 3) {
                                        postData = {
                                                'appType': type
                                        };
                                        postData.appName = $creatAppFrm.find('#love-name').val();
                                }
                                if (type == 5) {
                                        /*create template app*/
                                        $.ajax({
                                                url: '/createAppByTemplets',
                                                type: 'POST',
                                                data: {
                                                        'appName': $creatAppFrm.find('#tpl-name').val(),
                                                        'appInfo': $creatAppFrm.find('#tpl-intro').val(),
                                                        'tl_id': $creatAppFrm.find('#tplApp').val()
                                                }
                                        }).done(function() {
                                                //清除原cookie
                                                $.removeCookie('curAppId');
                                                $.removeCookie('curAppName');
                                                $.removeCookie('mcmOpened');
                                                location.href = '/appoverview';
                                        }).fail(function() {})
                                } else {
                                        $.ajax({
                                                url: '/addApp',
                                                type: 'POST',
                                                data: postData
                                        }).done(function(data) {
                                                if (data && data.status) {
                                                        //清除原cookie
                                                        $.removeCookie('curAppId');
                                                        $.removeCookie('curAppName');
                                                        $.removeCookie('mcmOpened');
                                                        location.href = '/appoverview';
                                                } else if (data.code == 350) {
                                                        $createDialog.dialog('close');
                                                        $createDialog.find('.create').removeAttr('disabled');
                                                        var $createErrorDialog = $('#create-error-dialog');
                                                        if (!$createErrorDialog.get(0)) {
                                                                var html = '<div id="create-error-dialog" class="modal fade">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + '<h4 class="modal-title">' + i18n.t('common.prompt') + '</h4>' + '</div>' + '<div class="modal-body">' + '<p>' + i18n.t('cad.Error350') + '</p>' + '</div>' + '<div class="modal-footer">' + '<a type="button" class="btn btn-primary" target="_blank" href="/reactive">' + i18n.t('common.ensure') + '</a>' + '<button type="button" class="btn btn-default" data-dismiss="modal">' + i18n.t('common.cancel') + '</button>' + '</div>' + '</div>' + '</div>' + '</div>';
                                                                $createErrorDialog = $(html);
                                                                $(document.body).append($createErrorDialog);
                                                                $('#create-error-dialog').modal('show');
                                                        } else {
                                                                $('#create-error-dialog').modal('show');
                                                        }
                                                }
                                        }).fail(function() {}).always(function() {});
                                };

                                return false;
                        }
                });

                //cancel
                $createDialog.find('.cancel').on('click', function() {
                        $createDialog.dialog('close');
                });

                //字数限制
                var appname = '#app-name';
                var $appname = $('#create-dialog #app-name');
                var $appnameLabel = $appname.next('.word-limit').find('em');
                utils.limitWord({
                        element: $appname,
                        maxLen: 20,
                        labelElement: $appnameLabel
                });

                var appintro = '#app-intro';
                var $appintro = $('#app-intro');
                var $appintroLabel = $appintro.next('.word-limit').find('em');
                utils.limitWord({
                        element: $appintro,
                        maxLen: 100,
                        labelElement: $appintroLabel
                });
                //  模版App 名称字数限制
                var appname = '#tpl-name';
                var $appname = $('#create-dialog #tpl-name');
                var $appnameLabel = $appname.next('.word-limit').find('em');
                utils.limitWord({
                        element: $appname,
                        maxLen: 20,
                        labelElement: $appnameLabel
                });
                //  模版App 说明字数限制
                var appintro = '#tpl-intro';
                var $appintro = $('#create-dialog #tpl-intro');
                var $appintroLabel = $appintro.next('.word-limit').find('em');
                utils.limitWord({
                        element: $appintro,
                        maxLen: 100,
                        labelElement: $appintroLabel
                });

                /* loveApp 字数限制*/
                var $lovename = $('#love-name');
                var $loveappnameLabel = $lovename.next('.word-limit').find('em');
                utils.limitWord({
                        element: $lovename,
                        maxLen: 20,
                        labelElement: $loveappnameLabel
                });

        });
        //退出登录
        $('#sign_out').one('click', function() {
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

        /*
        *未添加手机号用户，禁止创建应用
        *添加，修改手机号 end
        *获取短信验证码部分
        */
        var addPhoneHtml = '<div id="mobileForm_modal" class="modal fade">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal">' + '<span aria-hidden="true">&times;</span>' + '<span class="sr-only">Close</span>' + '</button>' + '<span class="modal-title">' + i18n.t('common.bindingMobile') + '</span>' + '</div>' + '<div class="modal-body">' + '<form action="" id="mobileForm" class="clearfix">' + '<div class="form-group forCodePhone">' + '<input type="text" class="form-control" id="codePhoneNum" name="codePhoneNum" placeholder=' + i18n.t('error.A00012') + '>' + '<i class="icon icon-mobile-phone"></i>' + '</div>' + '<div class="form-group clearfix">' + '<div class="form-left">' + '<input type="text" class="form-control" id="ccap-text" name="' + 'ccap" placeholder=' + i18n.t('common.authCode') + '>' + '<i class="icon icon-shield"></i>' + '</div>' + '<div class="form-right">' + '<img class="ccap">' + '</div>' + '<div class="err-popover-out">' + '<div class="err-popover">' + '<div class="tri-right"></div>' + '<div class="tri-right-in"></div>' + '<div class="err-popover-content"></div>' + '</div>' + '</div>' + '</div>' + '<div class="form-group clearfix code-phone" style="margin-bottom: 30px;">' + '<div class="form-left">' + '<div class="form-group code-text">' + '<input type="text" class="form-control" id="codePhoneText" name="codePhoneText" placeholder="' + i18n.t('appInfo.inputPhoneCode') + '">' + '<i class="icon icon-shield"></i>' + '</div>' + '</div>' + '<div class="form-right">' + '<button class="code-phone-btn btn-blue btn">' + '<span id="code_phone_count">40</span>' + '<span id="codeText" class="codeText">' + i18n.t('error.A00013') + '</span>' + '</button>' + '</div>' + '</div>' + '<button type="submit" class="btn btn-blue ensure">' + i18n.t('common.bindingCreate') + '</button>' + '</div>' + '</form>' + '</div>' + '</div>' + '</div>' + '</div>';
        $('#console').append(addPhoneHtml);
        var $codePhoneNum = $('#codePhoneNum');
        var $codePhoneCount = $('#code_phone_count');
        var $codeText = $('#codeText');
        /*get verification code*/
        var changeCcap = function() {
                $('.ccap').attr('src', '/getccap?' + (Math.random() + '').replace('.', ''));
        };
        $('.ccap').on('click',  function(event) {
                changeCcap();
                event.preventDefault();
        });
        function checkPhoneNum() {
                var result = false;
                var value = $codePhoneNum.val();
                $.ajax({
                        url: '/api/user/phone/check',
                        type: 'GET',
                        cache: false,
                        dataType: 'json',
                        data: {
                                phone: value
                        },
                        async: false,
                        success: function(data) {
                                if (data.status == 1) {
                                        if (data.result.count == 0) {
                                                result = true;
                                        } else {}
                                } else {}
                        }
                });
                return result;
        };
        $('.code-phone-btn').on('click', function(event) {
                var $this = $(this);
                $this.attr('disabled', true);
                $codePhoneCount.html('');
                $codeText.html(i18n.t('error.A00013'));
                var thisTimer, thisTimeCount = 90;
                var phoneNum = $codePhoneNum.val();
                var reg = /^1[3|4|5|7|8][0-9]\d{8}$/g;
                var captcha = $('#ccap-text').val() || '';
                if (phoneNum == '') {
                        $this.removeAttr('disabled');
                        return;
                }
                if (!reg.test(phoneNum)) {
                        $this.removeAttr('disabled');
                        return;
                }
                if (captcha == '') {
                        $this.removeAttr('disabled');
                        utils.alertMessage(0, '请输入验证码');
                        return;
                };
                if (!checkPhoneNum()) {
                        $this.removeAttr('disabled');
                        return;
                }

                $.ajax({
                        url: '/api/user/signup/phone/code',
                        type: 'POST',
                        dataType: 'JSON',
                        headers: {
                                "X-APICloud-sms": '1'
                        },
                        data: {
                                phone: phoneNum,
                                captcha: captcha
                        }
                }).done(function(data) {
                        if (data && data.status) {
                                thisTimeCount = parseInt(data.result.remain);
                                $codePhoneCount.html(thisTimeCount);
                                $codeText.html(i18n.t('common.remains'));
                                thisTimer = setInterval(function() {
                                        thisTimeCount--;
                                        $codePhoneCount.html(thisTimeCount);
                                        if (thisTimeCount <= 0) {
                                                $this.removeAttr('disabled');
                                                $codeText.html(i18n.t('profile.info1_8'));
                                                clearInterval(thisTimer);
                                        }
                                },
                                1000);
                        } else {
                                utils.alertMessage(0, errors.msmTip[data.code]);
                                changeCcap();
                                $this.removeAttr('disabled');
                        }
                }).fail(function() {
                        // utils.alertMessage(0, data.);
                        $this.removeAttr('disabled');
                }).always(function() {});

                event.preventDefault();
        });
        $('#modify_mobile').on('click', function(event) {
                // modal show
                $('#mobileForm_modal .modal-title').text(i18n.t('common.modifyMobile'));
                changeCcap();
                $('#mobileForm_modal').modal({
                        backdrop: 'static',
                        show: true
                });
                event.preventDefault();
        });
        $('#mobileForm_modal').on('show.bs.modal', function(event) {
                $('#codePhoneNum,#codePhoneText,#ccap-text').val('');
                $('.code-phone-btn').removeAttr('disabled');
                $codePhoneCount.html('');
                $codeText.html(i18n.t('error.A00013'));
                $('#mobileForm_modal').find('label.error').remove();
        });
        var mobileForm = $('#mobileForm');
        $('#mobileForm_modal .close').on('click', function() {
                mobileForm.find('#codePhoneNum,#codePhoneText').removeClass('wran');
        }); 
		$.validator.addMethod("checkPhone", function(value, element, param) {
                var result = false;
                var reg = /^1[3|4|5|7|8][0-9]\d{8}$/g;
                if (!reg.test(value)) {
                        result = false;
                } else {
                        result = true;
                }
                return result;
        },
        i18n.t('error.A000028'));
        $.validator.addMethod("ajaxPhoneCheck", function(value, element, param) {
                // 可用remote
                var result = false;
                $.ajax({
                        url: '/api/user/phone/check',
                        type: 'GET',
                        cache: false,
                        dataType: 'json',
                        data: {
                                phone: value
                        },
                        async: false,
                        success: function(data) {
                                if (data.status == 1) {
                                        if (data.result.count == 0) {
                                                result = true;
                                        } else {}
                                } else {}
                        },
                        error: function(data) {}
                });
                return result;
        },
        i18n.t('error.A000029'));
        mobileForm.validate({
                onkeyup: false,
                onsubmit: true,
                focusInvalid: false,
                onfocusout: true,
                focusCleanup: true,
                onfocusout: function(element, error) {
                        if ($(element).valid()) {
                                $(element).removeClass('wran');
                        } else {
                                $(element).addClass('wran');
                        };
                },
                unhighlight: function(element, errorClass) {
                        $(element).removeClass('wran');
                },
                rules: {
                        codePhoneNum: {
                                required: true,
                                checkPhone: true,
                                ajaxPhoneCheck: true
                        },
                        codePhoneText: {
                                required: true
                        }
                },
                messages: {
                        codePhoneNum: {
                                required: i18n.t('error.A000030'),
                                checkPhone: i18n.t('error.A000030'),
                                ajaxPhoneCheck: i18n.t('error.A000029')
                        },
                        codePhoneText: {
                                // required: i18n.t('appInfo.inputPhoneCode')
                                required: ''
                        }
                },
                submitHandler: function(form) {
                        var phone = $('#codePhoneNum').val();
                        var phoneCode = $('#codePhoneText').val();
                        var email = $.cookie('username');
                        // return;
                        $.ajax({
                                url: '/api/user/update/phone',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                        phone: phone,
                                        phoneCode: phoneCode,
                                        email: email
                                }
                        }).done(function(data) {
                                if (data && data.status) {
                                        if ($('#profile_phone').length > 0) {
                                                $('#profile_phone').val(phone);
                                        };
                                        $('#createApp').attr('data-phone', phone);
                                        $('#mobileForm_modal').modal('hide');
                                } else if (data.code == 221) {
                                        $('#codePhoneText').addClass('wran');
                                        utils.alertMessage(0, errors.msmTip[data.code]);
                                } else {
                                        utils.alertMessage(0, errors.msmTip[data.code]);
                                }
                        }).fail(function() {}).always(function() {
                                // $('#mobileForm_modal').modal('hide');
                        });
                }
        });
        /*添加，修改手机号 end*/

        // }
});