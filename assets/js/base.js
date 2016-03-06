define(function(require, exports, module) {
        //绑定全局事件标志,防止body上面重复绑定事件
        window.initGlobalDomEvt = false;

        require("ie/ie-shim.js").init();

        var page = require("page");
        var $ = require("jquery");
        require("bootstrap")($);
        var Handlebars = require("Handlebars");
        require("modernizr");
        require('cookie');
        require('jquery');
        require('validate');
        
		if (!window.i18n) {

                var i18nx = require("i18next");
                i18nx.init({
                        lng: $.cookie("i18next") || "zh-CN",
                        fallbackLng: false,
                        load: 'current'
                }, function(t) {
                        LoadContent();
                });
                window.i18n = i18nx;
        } else {
                LoadContent();
        }

        function LoadContent() {
                var lang = $.cookie('i18next');
                var errors = require("msmErrors");
                var userPhone = '';
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

                var utils = require('./utils.js');

                var helper = require('./helper.js');
                helper.init();
                //for IE
                if (utils.ltIE10()) {
                        require.async('ie/ie.js', function(mod) {
                                mod.init();
                        });
                }

                if (utils.ltIE10() && !utils.hasFlash()) {
                        alert(i18n.t('error.A00009'));
                }
                //global ajax error
                $(document).ajaxError(function(event, jqxhr, settings, exception) {
                        if (jqxhr.status == 400) {
                                utils.alertMessage(0, i18n.t('appInfo.your') + $.cookie('curAppName') + i18n.t('appInfo.authCancel'));
                                $.cookie('curAppId', '');
                                setTimeout(function() {
                                        window.location.href = '/console';
                                }, 3000);
                        }
                });
                //back-end render page
                window.backRender = true;
                $('.toIndex').on('click', function(event) {
                        window.location.href = '/';
                        event.preventDefault();
                });
                $('.toMember').on('click', function(event) {
                        window.location.href = '/member';
                        event.preventDefault();
                });
                $('.toProfile').on('click', function(event) {
                        window.location.href = '/profile';
                        event.preventDefault();
                });
                $('#toAbout').on('click', function(event) {
                        window.open("/about", "_blank")
                                // window.location.href = '/about';
                        event.preventDefault();
                });

                //init router
                if (Modernizr.history) {
                        page({
                                dispatch: false //首页为后端渲染
                        });
                }
                $('#toConsole').on('click', function(event) {
                        window.location.href = '/console';
                        event.preventDefault();
                });
                $('#toModStore').on('click', function(event) {
                        window.location.href = '/modulestore';
                        event.preventDefault();
                });
                $('#toModMgt').on('click', function(event) {
                        window.location.href = '/module_pub_history';
                        event.preventDefault();
                });

                //render template
                var renderTPL = function(pageName, router) {
                        var req = {};
                        req.cookies = {};
                        req.cookies.curAppId = $.cookie('curAppId');
                        req.cookies.curAppName = $.cookie('curAppName');
                        req.cookies.mcmOpened = $.cookie('mcmOpened');
                        req.cookies.appType = $.cookie('appType');
                        req.cookies.i18next = $.cookie('i18next');
                        req.cookies.username = $.cookie('username');
                        req.url = location.pathname;
                        var res = {
                                render: function(tplId, jsonData) {
                                        var tplPath = '/views/' + tplId + '.html';
                                        $.get(tplPath, function(data) {
                                                if (data) {
                                                        var template = Handlebars.compile(data);
                                                        var tpl = template(jsonData);
                                                        if (jsonData.layout == false) {
                                                                document.body.innerHTML = tpl;
                                                        } else {
                                                                var $wrapper = $('.wrapper');
                                                                $wrapper.fadeOut('200', function() {
                                                                        $wrapper.html(tpl);

                                                                        // $wrapper.i18n();

                                                                        //update page title
                                                                        if (jsonData && jsonData.title) {
                                                                                document.title = jsonData.title;
                                                                        }

                                                                        //高亮左侧菜单
                                                                        $('#menu').trigger('activeMenu');

                                                                        //exec script
                                                                        // 暂时用应用概览页面代替首页
                                                                        var jsName = pageName.slice(1);
                                                                        jsName = jsName || 'appoverview';
                                                                        if (jsonData.jsName) {
                                                                                jsName = jsonData.jsName;
                                                                        }
                                                                        require.async("{ENV}/" + jsName, function(module) {
                                                                                //等待页面渲染完成
                                                                                setTimeout(function() {
                                                                                        module.init();
                                                                                }, 400);

                                                                        });
                                                                });
                                                                $wrapper.fadeIn('200');
                                                                $(".butterbar").removeClass("active").addClass("hide");
                                                        }
                                                }
                                        });
                                }
                        };
                        router(req, res);
                };

                //router
                var routePage = function(path, router, fn) {
                        if (!Modernizr.history) {
                                return;
                        }

                        page(path, function(ctx) {
                                //防连击
                                var curPath = location.pathname;
                                if (curPath === path) {
                                        $(".butterbar").removeClass("active").addClass("hide");
                                        return false;
                                }

                                renderTPL(path, router);
                                fn && fn();
                        });

                };

                var app = {};
                app.get = function(path, routeFn) {
                        routePage(path, routeFn, function() {
                                window.backRender = false;

                        });
                };
                page("*", function(ctx, next) {
                        $(".butterbar").addClass("active").removeClass("hide");
                        next();
                });
                var r = require("{ENV}/routes/router.js");
                r(app);
                page("*", function(ctx, next) {
                        $(".butterbar").removeClass("active").addClass("hide");
                        next();
                });
                //load page exec script
                var pathname = location.pathname;
                var fun = pathname.slice(1);
                if (fun.lastIndexOf('/') > 1) {
                        fun = fun.replace('/', '');
                }
                fun = fun || 'appoverview';
                var jname = getJsName();
                if (jname) {
                        fun = jname;
                }
                require.async("{ENV}/" + fun, function(module) {
                        setTimeout(function() {
                                module.init();
                        }, 400);
                });

                var $menu = $('#menu');
                var clientWid = $(window).width();
                if (clientWid < 1260) {
                        $('body').addClass('shrink');
                        $menu.addClass('shrink');
                        $('#menu-shadow').addClass('shrink');
                        $(".mainWrap").css("maxWidth", clientWid - 50);
                } else {
                        $('body').removeClass('shrink');

                        $(".mainWrap").css("maxWidth", clientWid - 235);
                }

                //highlight menu by clicking
                $('#menu .innerWrap').on('click', 'a', function() {
                        var $menu = $('#menu .innerWrap');
                        $menu.find('.active').removeClass('active');
                        $(this).parent().addClass('active');
                });

                //toggle main menu
                $menu.on('click', '.toggle-menu', function() {
                        $(this).attr('title', i18n.t('appInfo.expandMenu'));
                        if ($('body').hasClass("shrink")) {
                                $(".mainWrap").css("maxWidth", clientWid - 235);
                        } else {
                                $(".mainWrap").css("maxWidth", clientWid - 50);
                        }
                        $menu.toggleClass('shrink');
                        $('body').toggleClass('shrink');
                        $('#menu-shadow').toggleClass('shrink');
                });

                //active menu
                $menu.on('activeMenu', function() {
                        var path = location.pathname;
                        var $inner = $menu.find('.innerWrap');
                        var $a;
                        if (/^\/total/.test(path)) {
                                $a = $inner.find('a[href="/total"]');
                        } else if (/^\/module/.test(path)) {
                                $a = $inner.find('a[href="/module"]');
                        } else {
                                $a = $inner.find('a[href="' + path + '"]');
                        }

                        $inner.find('.active').removeClass('active');
                        $a.parent().addClass('active');
                });
                $menu.trigger('activeMenu');

                //app list
                var $appList = $('#appList');
                $appList.on('click', '#getAll', function() {
                        //exclude IE 7
                        if (!utils.isIE7()) {
                                var $getlist = $('#getAllList');
                                var len = $('#getAllList li').length;
                                if (len / 4 > 2) {
                                        if (!$getlist.hasClass('wide')) {
                                                $getlist.addClass('wide');
                                        }
                                }
                        }
                });

                //common header
                //init user info
                var userName = $.cookie('username') || '';
                $('#userName span').eq(0).html(userName);
                $.ajax({
                                url: '/api/user/setting',
                                type: 'GET',
                                cache: false,
                                dataType: 'json'
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
                                                $.cookie('userIcon', '/img/favicon-30.png', {
                                                        expires: 7
                                                });
                                        }
                                        if (phone) {
                                                userPhone = phone;
                                        };
                                        var email = $.cookie('username') || '';
                                        if (data.result.userName) {
                                                $('#userName span').eq(0).html(data.result.userName);
                                                $.cookie('nickname', data.result.userName, {
                                                        expires: 7
                                                });
                                                // if ($.cookie('remMe')) {
                                                //     $.cookie('nickname', data.result.userName, {expires: 7});
                                                // } else {
                                                //     $.cookie('nickname', data.result.userName, {expires: 1});
                                                // }
                                        } else {
                                                $('#userName span').eq(0).html(email);
                                                $.removeCookie('nickname');
                                        }
                                        if (!data.result.state && $.cookie("VerfyEmail") != $.cookie('username')) {
                                                // if (true){
                                                var $str = $('<div id="errTopMiddle" class="err-top fail">' +
                                                        // '   <i class="err-close">' +
                                                        // '       <i class="icon-remove"></i>' +
                                                        // '   </i>' +
                                                        '   <div class="err-out">' +
                                                        '       <div class="err-switch">' +
                                                        '           <i class="err-switch-i icon-smile"></i>' +
                                                        '           <i class="err-switch-i icon-frown"></i>' +
                                                        '           <span class="err-content">' + i18n.t('appInfo.unActive') + '</span>' +
                                                        '       </div>' +
                                                        '   </div>' +
                                                        '</div>');

                                                $str.appendTo($("body"));
                                                $str.slideDown();
                                                $str.find(".icon-remove").on("click", function() {
                                                        $(this).slideUp(400, function() {
                                                                $str.remove();
                                                                $.cookie("VerfyEmail", $.cookie('username'), {
                                                                        expires: 7
                                                                });
                                                        });
                                                });
                                        }
                                } else {}
                        })
                        .fail(function(data) {})
                        .always(function() {});


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
                        }).done(function(data) {
                                if (data && data.status == 1) {
                                        var bbsFrm = $('#bbsLogin')[0].contentWindow.document.getElementById('bbsFrm3');
                                        bbsFrm.submit();
                                        setTimeout(function() {
                                                location.href = '/signin';
                                        }, 2000);
                                }
                        });

                        return false;
                });

                //get app list
                var applistTpl = '';
                $.post('/getAllAppByUser', function(data, sta, xhr) {
                        if (data && data.status) {
                                var data = data.body;
                                var curApp = data[0];

                                var curAppId = $.cookie('curAppId');
                                if (!curAppId) {
                                        //没有cookie，记录cookie
                                        var _appid = $('#CADAppInfo .usr-info .myAppName').attr('appid');
                                        var _appname = $('#CADAppInfo .usr-info .myAppNameSpan').text();
                                        $.cookie('curAppId', _appid, {
                                                expires: 7
                                        });
                                        $.cookie('curAppName', _appname, {
                                                expires: 7
                                        });
                                }
                                var curAppName = $.cookie('curAppName');

                                var cls = '';
                                if (data.length > 8) {
                                        cls = 'wide';
                                }
                                applistTpl = '<a data-toggle="dropdown" id="getAll" class="dropdown-toggle">' +
                                        '<span class="arr-b"></span><span class="AppText">' + curAppName + '</span>' +
                                        '</a>' +
                                        '<ul role="menu" id="getAllList" class="dropdown-menu ' + cls + '" style="overflow-y:auto;">' +
                                        '<li>' +
                                        '<a href="javascript:;" id="create-app" data-phone="' + userPhone + '">' +
                                        '<img src="/img/create.png" />' +
                                        '<span data-i18n="common.createApp"></span>' +
                                        '</a>' +
                                        '</li>';

                                for (var i = 0, len = data.length; i < len; i++) {
                                        var thisData = data[i];
                                        if (curAppId === thisData.appId) {
                                                $.cookie('mcmOpened', thisData.mcmOpened || 0, {
                                                        expires: 7
                                                });
                                                $.cookie('appType', thisData.appType || 0, {
                                                        expires: 7
                                                });
                                        }
                                        var appName = '';
                                        if (thisData.type === 2) {
                                                appName = thisData.appName + ' *';
                                        } else {
                                                appName = thisData.appName;
                                        }
                                        var appType = 0;
                                        if (thisData.appType == 1) {
                                                appType = 1;
                                        } else if (thisData.appType == -1) {
                                                appType = -1;
                                        }
                                        //default icon
                                        var appIcon = '/img/app.png';
                                        if (thisData.iconUrl) {
                                                appIcon = thisData.iconUrl;
                                        }
                                        applistTpl += '<li>' +
                                                '<a href="javascript:;" class="CADAppId" mcmOpened="' + thisData.mcmOpened + '" validstatus="' + thisData.validStatus + '" apptype="' + appType +
                                                '" appid="' + thisData.appId + '">' +
                                                '<img src="' + appIcon + '" title="' + appName + '" />' +
                                                '<span title="' + appName + '">' + appName + '</span>' +
                                                '</a>' +
                                                '</li>';
                                }
                                applistTpl += '</ul>';

                                $appList.html(applistTpl);

                        } else {

                        }
                });
                //切换应用
                $appList.on('click', '#getAllList .CADAppId', function(event) {
                        var $this = $(this);
                        var appId = $this.attr('appid');
                        var appName = $this.find('span').html();
                        var mcmOpened = $this.attr('mcmOpened');
                        var appType = $this.attr('apptype');
                        $.cookie('curAppId', appId, {
                                expires: 7
                        });
                        $.cookie('curAppName', appName, {
                                expires: 7
                        });
                        $.cookie('mcmOpened', mcmOpened, {
                                expires: 7
                        });
                        $.cookie('appType', appType, {
                                expires: 7
                        });
                        location.reload();
                });

                //创建APP
                $appList.on('click', '#create-app', function() {
                        var phone = $(this).attr('data-phone') || '';
                        if (!phone) {
                                changeCcap();
                                $('#mobileForm_modal').modal({
                                        backdrop: 'static',
                                        show: true
                                })
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
                                var html = '<div id="create-dialog">' +
                                        '<form role="form" class="form-horizontal" id="create-appfrm" method="post">' +
                                        '<div class="btn-group" id="app-type">' +
                                        '<input type="hidden" name="appType" value="0" />' +
                                        '<button type="button" class="first btn active">Native</button>' +
                                        // '<button type="button" class="btn tv">TV</button>' +
                                        '<button type="button" class="btn web">Web</button>' +
                                        '<button type="button" class="btn love">表白App</button>' +
                                        // '<button type="button" class="btn store">模版App</button>' +

                                        '</div>' +
                                        '<div class="btn-group" id="app-sub-type">' +
                                        '<span class="fake-check love1">向她告白</span>' +
                                        '<span class="fake-check love2">向他告白</span>' +
                                        '<span class="fake-check love3">向Ta告白</span>' +
                                        '</div>' +
                                        '<div id="nativeWeb">' +
                                        '<div class="form-group">' +
                                        '<label for="app-name" class="col-sm-2 control-label">' + i18n.t('common.name') + '</label>' +
                                        '<div class="col-sm-10 word-wrapper">' +
                                        '<input type="text" class="form-control" name="createAppName" id="app-name" placeholder="">' +
                                        '<label class="word-limit"><em>0</em>/20</label>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                        '<label for="app-intro" class="col-sm-2 control-label">' + i18n.t('common.explain') + '</label>' +
                                        '<div class="col-sm-10 word-wrapper">' +
                                        '<textarea class="form-control" name="createAppInfo" style="resize: none;" row="6" id="app-intro"></textarea>' +
                                        '<label class="word-limit"><em>0</em>/100</label>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="form-group web-input" style="display:none">' +
                                        '<label for="app-web" class="col-sm-2 control-label">' + i18n.t('common.webPage') + '</label>' +
                                        '<div class="col-sm-10">' +
                                        '<input type="text" name="createAppUrl" class="form-control" id="app-web" placeholder="">' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                        '<div class="col-sm-offset-2 col-sm-10 btns">' +
                                        '<button type="submit" class="btn create">' + i18n.t('common.create') + '</button>' +
                                        '<button type="button" class="btn cancel">' + i18n.t('common.cancel') + '</button>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="row" id="tplStore">' +
                                        '<div class="col-md-8">' +
                                        '<div class="form-group">' +
                                        '<label for="app-web" class="col-sm-2 control-label">模版</label>' +
                                        '<div class="col-sm-10">' +
                                        '<select id="tplApp" class="form-control"></select>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                        '<label for="app-name" class="col-sm-2 control-label">' + i18n.t('common.name') + '</label>' +
                                        '<div class="col-sm-10 word-wrapper">' +
                                        '<input type="text" class="form-control" name="createAppName" id="tpl-name" placeholder="">' +
                                        '<label class="word-limit"><em>0</em>/20</label>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="form-group">' +
                                        '<label for="app-intro" class="col-sm-2 control-label">' + i18n.t('common.explain') + '</label>' +
                                        '<div class="col-sm-10 word-wrapper">' +
                                        '<textarea class="form-control" name="createAppInfo" style="resize: none;" row="6" id="tpl-intro"></textarea>' +
                                        '<label class="word-limit"><em>0</em>/100</label>' +
                                        '</div>' +
                                        '</div>' +

                                        '<div class="form-group">' +
                                        '<div class="col-sm-offset-2 col-sm-10 btns">' +
                                        '<button type="submit" class="btn create">' + i18n.t('common.create') + '</button>' +
                                        '<button type="button" class="btn cancel">' + i18n.t('common.cancel') + '</button>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="col-md-3">' +
                                        '<div id="tplIcon">' +
                                        '<img src="">' +
                                        '</div>' +
                                        '<div class="tpl-look">' +
                                        '<a id="tplDetail" href="">详情</a>' +
                                        '<a class="tpl-more" href="/tpl-store">更多模版</a>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div id="loveApp">' +
                                        '<div class="form-group lovename">' +
                                        '<label for="app-name" class="col-sm-2 control-label">' + i18n.t('common.name') + '</label>' +
                                        '<div class="col-sm-10 word-wrapper">' +
                                        '<input type="text" class="form-control loveinput" name="createAppName" id="love-name" placeholder="">' +
                                        '<label class="word-limit lovelable"><em>0</em>/20</label>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="form-group lovebtn">' +
                                        '<div class="col-sm-offset-2 col-sm-10 btns">' +
                                        '<button type="submit" class="btn create">' + i18n.t('common.lovecreate') + '</button>' +
                                        '<button type="button" class="btn cancel">' + i18n.t('common.lovecancel') + '</button>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</form>' +
                                        '</div>';
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
                        $('.tpl-more').on('click', function(event) {
                                // window.open("/tpl-store", "_blank")
                                window.location.href = '/tpl-store';
                                event.preventDefault();
                        });
                        $('#tplApp').on('change', function() {
                                var id = $(this).find('option:selected').attr('data-id');
                                var url = 'tpl-detail?tlId=' + id;
                                $('#tplIcon img').hide();
                                $('#tplPic' + id).show();
                                $('#tplDetail').attr('href', url);
                        });
                        //选择类型
                        var $appType = $createDialog.find('#app-type');
                        var $appSubType = $createDialog.find('#app-sub-type');
                        var $webInput = $createDialog.find('.web-input');
                        var $type = $appType.find('[name="appType"]');
                        $appType.find('.btn').on('click', function() {
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
                                        })
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
                        $appSubType.find('.fake-check').on('click', function() {
                                $appSubType.find('.active').removeClass('active');
                                $(this).addClass('active');
                                if ($(this).hasClass('love1')) {
                                        $('#loveApp').show();
                                        $('#nativeWeb,#tplStore').hide();
                                        $createDialog.parent('div').css({
                                                'background': 'url(../../img/love11.jpg) center center no-repeat',
                                                'background-size': '100%'
                                        })
                                        $type.val('11');
                                } else if ($(this).hasClass('love2')) {
                                        $('#loveApp').show();
                                        $('#nativeWeb,#tplStore').hide();
                                        $createDialog.parent('div').css({
                                                'background': 'url(../../img/love12.jpg) center center no-repeat',
                                                'background-size': '100%'
                                        })
                                        $type.val('12');
                                } else if ($(this).hasClass('love3')) {
                                        $('#loveApp').show();
                                        $('#nativeWeb,#tplStore').hide();
                                        $createDialog.parent('div').css({
                                                'background': 'url(../../img/love13.jpg) center center no-repeat',
                                                'background-size': '100%'
                                        })
                                        $type.val('13');
                                }
                        });

                        function setTplWidth() {
                                if ($createDialog.find('#app-type .active').hasClass('store')) {
                                        $createDialog.parent().width(650);
                                } else {
                                        $createDialog.parent().width(500);
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
                        }, i18n.t('appInfo.notice'));
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
                                                        })
                                                        .done(function(data) {
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
                                                                                var html = '<div id="create-error-dialog" class="modal fade">' +
                                                                                        '<div class="modal-dialog">' +
                                                                                        '<div class="modal-content">' +
                                                                                        '<div class="modal-header">' +
                                                                                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                                                                        '<h4 class="modal-title">' + i18n.t('common.prompt') + '</h4>' +
                                                                                        '</div>' +
                                                                                        '<div class="modal-body">' +
                                                                                        '<p>' + i18n.t('cad.Error350') + '</p>' +
                                                                                        '</div>' +
                                                                                        '<div class="modal-footer">' +
                                                                                        '<a type="button" class="btn btn-primary" target="_blank" href="/reactive">' + i18n.t('common.ensure') + '</a>' +
                                                                                        '<button type="button" class="btn btn-default" data-dismiss="modal">' + i18n.t('common.cancel') + '</button>' +
                                                                                        '</div>' +
                                                                                        '</div>' +
                                                                                        '</div>' +
                                                                                        '</div>';
                                                                                $createErrorDialog = $(html);
                                                                                $(document.body).append($createErrorDialog);
                                                                                $('#create-error-dialog').modal('show');
                                                                        } else {
                                                                                $('#create-error-dialog').modal('show');
                                                                        }
                                                                }
                                                        })
                                                        .fail(function() {})
                                                        .always(function() {});
                                        }
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
                        var $appintro = $('#tpl-intro');
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
                /*
                 *未添加手机号用户，禁止创建应用
                 *添加，修改手机号 end
                 *获取短信验证码部分
                 */
                var addPhoneHtml = '<div id="mobileForm_modal" class="modal fade">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '<span class="sr-only">Close</span>' +
                        '</button>' +
                        '<span class="modal-title">' + i18n.t('common.bindingMobile') + '</span>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<form action="" id="mobileForm" class="clearfix">' +
                        '<div class="form-group forCodePhone">' +
                        '<input type="text" class="form-control" id="codePhoneNum" name="codePhoneNum" placeholder=' + i18n.t('error.A00012') + '>' +
                        '<i class="icon icon-mobile-phone"></i>' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<div class="form-left">' +
                        '<input type="text" class="form-control" id="ccap-text" name="' + 'ccap" placeholder=' + i18n.t('common.authCode') + '>' +
                        '<i class="icon icon-shield"></i>' +
                        '</div>' +
                        '<div class="form-right">' +
                        '<img class="ccap">' +
                        '</div>' +
                        '<div class="err-popover-out">' +
                        '<div class="err-popover">' +
                        '<div class="tri-right"></div>' +
                        '<div class="tri-right-in"></div>' +
                        '<div class="err-popover-content"></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group clearfix code-phone" style="margin-bottom: 30px;">' +
                        '<div class="form-left">' +
                        '<div class="form-group code-text">' +
                        '<input type="text" class="form-control" id="codePhoneText" name="codePhoneText" placeholder="' + i18n.t('appInfo.inputPhoneCode') + '">' +
                        '<i class="icon icon-shield"></i>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-right">' +
                        '<button class="code-phone-btn btn-blue btn">' +
                        '<span id="code_phone_count">40</span>' +
                        '<span id="codeText" class="codeText">' + i18n.t('error.A00013') + '</span>' +
                        '</button>' +
                        '</div>' +
                        '</div>' +
                        '<button type="submit" class="btn btn-blue ensure">' + i18n.t('common.bindingCreate') + '</button>' +
                        '</div>' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $(document.body).append(addPhoneHtml);
                var $codePhoneNum = $('#codePhoneNum');
                var $codePhoneCount = $('#code_phone_count');
                var $codeText = $('#codeText');
                /*get verification code*/
                var changeCcap = function() {
                        $('.ccap').attr('src', '/getccap?' + (Math.random() + '').replace('.', ''));
                };
                $('.ccap').on('click', function(event) {
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
                                })
                                .done(function(data) {
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
                                                }, 1000);
                                        } else {
                                                utils.alertMessage(0, errors.msmTip[data.code]);
                                                changeCcap();
                                                $this.removeAttr('disabled');
                                        }
                                })
                                .fail(function() {
                                        // utils.alertMessage(0, data.);
                                        $this.removeAttr('disabled');
                                })
                                .always(function() {});

                        event.preventDefault();
                });
                /*$('#modify_mobile').on('click', function(event) {
                    // modal show
                    $('#mobileForm_modal .modal-title').text(i18n.t('common.modifyMobile'));
                    $('#mobileForm_modal').modal({
                        backdrop: 'static',
                        show: true
                    });
                    event.preventDefault();
                });*/
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
                })
                $.validator.addMethod("checkPhone", function(value, element, param) {
                        var result = false;
                        var reg = /^1[3|4|5|7|8][0-9]\d{8}$/g;
                        if (!reg.test(value)) {
                                result = false;
                        } else {
                                result = true;
                        }
                        return result;
                }, i18n.t('error.A000028'));
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
                }, i18n.t('error.A000029'));
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
                                        })
                                        .done(function(data) {
                                                if (data && data.status) {
                                                        $('#create-app').attr('data-phone', phone);
                                                        $('#mobileForm_modal').modal('hide');
                                                } else if (data.code == 221) {
                                                        $('#codePhoneText').addClass('wran');
                                                        utils.alertMessage(0, errors.msmTip[data.code]);
                                                } else {
                                                        utils.alertMessage(0, errors.msmTip[data.code]);
                                                }
                                        })
                                        .fail(function() {})
                                        .always(function() {});
                        }
                });
                /*添加，修改手机号 end*/
        }
});
