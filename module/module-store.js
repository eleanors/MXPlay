define(function(require, exports, module) {
        var $ = require('jquery');
        require('jqueryui');
        require('cookie');
        require('../libs/jquery/icheck.min');
        var Handlebars = require('Handlebars');
        var util = require('./utils.js');
        var WebUploader = require('webuploader');
        require('validate');
        require('../libs/jquery/jquery.bxslider.min');
        var errors = require("../assets/js/cadErrors");
        var module_util = require('./module_utils.js');
        exports.init = function() {
                var appid = $.cookie('curAppId');
                var startNum = 0;
                var i18nlng = $.cookie("i18next") == "en-US" ? "en": "";
                //  二级列表部分
                var modMultiTypes = {};
                if (i18nlng.indexOf('en') != -1) {
                        modMultiTypes = {
                                0 : {
                                        'All': {

}
                                },
                                5 : {
                                        'Function Extension': {
                                                1 : 'Local Storage',
                                                2 : 'Text Reader',
                                                3 : 'Network Communication',
                                                4 : 'Multi-media',
                                                5 : 'Other'
                                        }
                                },
                                3 : {
                                        'UI': {
                                                1 : 'List',
                                                2 : 'Selector',
                                                3 : 'Chart',
                                                4 : 'Other'
                                        }
                                },
                                4 : {
                                        'Nav Menu': {

}
                                },
                                8 : {
                                        'Open SDK': {
                                                1 : 'Share and Login',
                                                2 : 'Push & Comm',
                                                3 : 'Payment',
                                                4 : 'Map',
                                                5 : 'Smart Identification',
                                                6 : 'Verif & Security',
                                                7 : 'Ads',
                                                8 : 'Other'
                                        }
                                },
                                2 : {
                                        'Device Access': {

}
                                },
                                9 : {
                                        'Cloud Service': {

}
                                }
                        };
                } else {
                        modMultiTypes = {
                                0 : {
                                        "全部": {

}
                                },
                                5 : {
                                        "功能扩展": {
                                                1 : "本地存储",
                                                2 : "文本浏览",
                                                3 : "网络通信",
                                                4 : "多媒体",
                                                5 : "其他"
                                        }
                                },
                                3 : {
                                        "界面布局": {
                                                1 : "列表",
                                                2 : "选择器",
                                                3 : "图表",
                                                4 : "其他"
                                        }
                                },
                                4 : {
                                        "导航菜单": {

}
                                },
                                8 : {
                                        "开放SDK": {
                                                1 : "分享与登录",
                                                2 : "推送与通讯",
                                                3 : "支付",
                                                4 : "地图",
                                                5 : "智能识别",
                                                6 : "验证与安全",
                                                7 : "广告",
                                                8 : "其他"
                                        }
                                },
                                2 : {
                                        "设备访问": {

}
                                },
                                9 : {
                                        "云服务对接": {

}
                                }
                        };
                }
                var showModMultiTypes = function(modMultiTypes) {
                        var str = '';
                        for (var first in modMultiTypes) {
                                var firstTypeObj = modMultiTypes[first];
                                for (var firstModTypeName in firstTypeObj) {
                                        var secondTypeObj = firstTypeObj[firstModTypeName];
                                        str += '<li><a data-first="' + first + '" data-second="0" class="title" href="javascript:void(0)">' + firstModTypeName + '</a>';
                                        for (var second in secondTypeObj) {
                                                if (secondTypeObj[second]) {
                                                        str += '<a data-first="' + first + '" data-second="' + second + '" class="detail" href="javascript:void(0)">' + secondTypeObj[second] + '</a>';
                                                }
                                        }
                                }
                                str += '</li>';
                        }
                        $('#requestlist').html(str);
                };
                showModMultiTypes(modMultiTypes);
                // 二级列表部分 end
                // 模块冲突部分
                // 有冲突的模块ID start
                var arrConflict = [1830, 2288, 1786, 340, 382, 1119, 1240, 2144];
                // baiduNavigation-1830, maketionCardReader-2288, pingpp-1786, alipay-340, weiXin-382, adsMogoDomob-1119, adsDomob-1240, ipaynow-2144, baiduMap-729
                var arrAddedMod = [];
                var getConflictGroup = function(id) {
                        var mdId = parseInt(id);
                        switch (mdId) {
                        case 1830:
                                return [2288];
                                break;
                        case 2288:
                                return [1830];
                                break;
                        case 1786:
                                return [2144];
                                break;
                        case 340:
                                return [2144];
                                break;
                        case 382:
                                return [2144];
                                break;
                        case 2144:
                                return [340, 382, 1786];
                                break;
                        case 1119:
                                return [1240];
                                break;
                        case 1240:
                                return [1119];
                                break;
                        default:
                                return false;
                                break;
                        };
                };
                var setConflictMod = function(obj) {
                        var data = obj;
                        for (var i = 0,
                        len = arrConflict.length; i < len; i++) {
                                if (data.mdId == arrConflict[i]) {
                                        arrAddedMod.push(data);
                                } else {

}
                        }
                };
                // 有冲突的模块ID end
				
				
                // 已绑定了哪些模块 start
                var getAddedMod = function() {
                        $.ajax({
                                url: '/mxplay/data/getBindMd.json',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                        appId: appid
                                },
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        arrAddedMod = [];
                                        for (var i = 0,
                                        len = data.body.length; i < len; i++) {
                                                setConflictMod(data.body[i]);
                                        }
                                } else {

}
                        }).fail(function() {}).always(function() {});

                };
                getAddedMod();
                // 已绑定了哪些模块 end
                // 
                // 
                // 模块冲突部分 end
                //是否滚动加载数据
                var reqLock = false;
                // 加载数据类型（按名字搜索或者按条件搜索）
                var reqType = false;

                var $modulesOuterBox = $('#modules-outer-box');
                var $platformSearch = $('#pf-text');
                //请求模块数据
                var $modCon = $('.module-box');
                var $modTpl = $('#mod-store-template');
                // if (window.propertychange) { //IE6/IE7/IE8
                // $('#search-txt').on('propertychange', function(event) {
                // var $this = $(this);
                // if ($this.val() == '') {
                // $('.clearBtn').hide();
                // } else {
                // $('.clearBtn').show();
                // }
                // event.preventDefault();
                // });
                // } else {
                $('#search-txt').on('input', function(event) {
                        var $this = $(this);
                        if ($this.val() == '') {
                                $('.clearBtn').hide();
                        } else {
                                $('.clearBtn').show();
                        }
                        event.preventDefault();
                });
                // }
                $('#module-platform input').iCheck({
                        checkboxClass: 'icheckbox_minimal-green',
                        radioClass: 'iradio_minimal-green',
                        increaseArea: '20%' // optional
                });
                $('.clearBtn').on('click', function(event) {
                        $('#search-txt').val('');
                        $('.clearBtn').hide();
                        event.preventDefault();

                        //点叉搜索全部
                        $('#search-mod').trigger('click');
                });
                $('.filter-message-back .btn-back').on('click',
                function(event) {
                        $('#search-txt').val('');
                        $('.clearBtn').hide();
                        event.preventDefault();
                        $('#search-mod').trigger('click');
                });
                ////////////////////////////////////
                var getPlatform = function() {
                        if ($('#module-platform .platform-ios').parents('.icheckbox_minimal-green').hasClass('checked') && $('#module-platform .platform-android').parents('.icheckbox_minimal-green').hasClass('checked')) {
                                return 2;
                        } else if (!$('#module-platform .platform-ios').parents('.icheckbox_minimal-green').hasClass('checked') && !$('#module-platform .platform-android').parents('.icheckbox_minimal-green').hasClass('checked')) {
                                return - 1;
                        } else {
                                if ($('#module-platform .platform-ios').parents('.icheckbox_minimal-green').hasClass('checked')) {
                                        return 0;
                                }
                                if ($('#module-platform .platform-android').parents('.icheckbox_minimal-green').hasClass('checked')) {
                                        return 1;
                                }
                        }
                };
                ////////////////////////////////////
                var reqMod = function(opts) {
                        $(".butterbar").addClass("active").removeClass("hide");
                        opts = opts || {};
                        var disableSearch = opts.disableSearch || false;
                        var sTxt = '';
                        if (!disableSearch) {
                                sTxt = $('#search-txt').val();
                                sTxt = $.trim(sTxt);
                        }
                        var pf = opts.platform || getPlatform();
                        var startNum = opts.startNum || 0;
                        var size = opts.size || 32;
                        var searchName = sTxt || '';
                        var platform = pf;
                        var type = opts.type || 0;
                        var subclass = opts.subclass || 0;
                        var searchByName = opts.searchByName || false;
                        var reqUrl = '';
                        if (searchByName) {
                                reqUrl = '/getModule?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=-1&type=0&subclass=0&searchName=' + searchName;
                                reqType = true;
                        } else {
                                reqUrl = '/getModule?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=' + platform + '&type=' + type + '&subclass=' + subclass;
                                reqType = false;
                        }
                        var success = opts.success;

                        $.get(reqUrl,
                        function(data, textStatus, xhr) {
                                if (data && data.status) {
                                        $('.filter-message-normal .count').text(data.allNum);
                                        if (searchByName && searchName) {
                                                $('.filter-message-normal').hide();
                                                $('.filter-message-back').addClass('active');
                                                $('.filter-message-back .count').text(data.searchNum);
                                        } else {
                                                $('.filter-message-normal').show();
                                                $('.filter-message-back').removeClass('active');
                                                $('.filter-message-back .count').text(data.searchNum);
                                        }

                                        var source = $('#mod-store-template').html();
                                        var template = Handlebars.compile(source);
                                        data.i18nlng = i18nlng;
                                        var htm = template(data);
                                        $modCon.html(htm);
                                        success && success(type);
                                }
                                $(".butterbar").removeClass("active").addClass("hide");
                        });
                };
                // 依据平台搜索
                $('#module-platform .platform-ios,#module-platform .platform-android').on('ifClicked',
                function(event) {
                        var $this = $(this);
                        var type = $('#requestText').attr('first-type');
                        var subclass = $('#requestText').attr('second-type');
                        setTimeout(function() {
                                reqLock = false;
                                startNum = 0;
                                reqMod({
                                        type: type,
                                        subclass: subclass,
                                        disableSearch: true
                                });
                        },
                        300);
                });

                //添加模块
                $modCon.on('click', '.status-group.add', function() {
                        var $this = $(this);
                        var mdid = $this.attr('mdid');
                        var $con = $this.closest('.module-container');
                        var $mdName = $con.find('.module-name');
                        var conflictGroup = getConflictGroup(mdid);
                        if (conflictGroup) {
                                for (var i = 0,
                                len = arrAddedMod.length; i < len; i++) {
                                        var _this = arrAddedMod[i];
                                        for (var j = 0,
                                        lenJ = conflictGroup.length; j < lenJ; j++) {
                                                if (_this.mdId == conflictGroup[j]) {
                                                        var str = i18n.t('cadModule.note3_1') + $mdName.text() + i18n.t('cadModule.note3_2') + _this.mdName + i18n.t('cadModule.note3_3');
                                                        alert(str);
                                                        return;
                                                } else {
                                                        // 
                                                }
                                        }
                                }
                        } else {
                                // 
                        }

                        $.post('/bingModule', {
                                appId: appid,
                                mdId: mdid
                        },
                        function(data, textStatus, xhr) {
                                if (data && data.status) {
                                        getAddedMod();
                                        $this.removeClass('active');
                                        $this.parent('.module-container-name-group').find('.status-group.added').addClass('active');
                                        $this.parent('.module-container-name-group').find('.status-group.add').removeClass('active');
                                }
                        });
                });

                // 搜索框搜索模块
                var $searchBtn = $('#search-mod');
                $searchBtn.on('click', function() {
                        reqLock = false;
                        startNum = 0;
                        reqMod({
                                searchByName: true
                        });

                        return false;
                });
                var searchFormSubmit = function() {
                        $('.input-group-filter').validate({
                                submitHandler: function(form) {
                                        reqLock = false;
                                        startNum = 0;
                                        reqMod({
                                                searchByName: true
                                        });
                                }
                        });
                };
                searchFormSubmit();

                // 2014-12-12新分类筛选
                $('#requestlist').on('click', 'a', function(event) {
                        var $this = $(this);
                        var first = $this.attr('data-first');
                        var second = $this.attr('data-second');
                        $('#requestText').text($this.text());
                        $('#requestText').attr({
                                'first-type': first,
                                'second-type': second
                        });
                        reqLock = false;
                        startNum = 0;

                        reqMod({
                                type: first,
                                subclass: second,
                                disableSearch: true,
                                success: function(type) {
                                        //重置滚动加载
                                        reqLock = false;

                                }
                        });

                });

                //滚动加载
                $(window).on('scroll',
                function() {
                        if ($(window).scrollTop() == $(document).height() - $(window).height()) {

                                if (reqLock) {
                                        return false;
                                }
                                if ($('.panel-body.introduction').length > 0) {
                                        return false;
                                }
                                $(".butterbar").addClass("active").removeClass("hide");
                                startNum += 32;
                                var type = $('#requestText').attr('first-type');
                                var subclass = $('#requestText').attr('second-type');
                                var platform = getPlatform();
                                var size = 32;
                                var reqUrl = '';
                                var searchName = $('#search-txt').val();
                                if (reqType) {
                                        reqUrl = '/getModule?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=-1&type=0&subclass=0&searchName=' + searchName;
                                } else {
                                        reqUrl = '/getModule?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=' + platform + '&type=' + type + '&subclass=' + subclass;
                                }
                                if (type == undefined) {
                                        return false;
                                }
                                $.get(reqUrl, function(data, textStatus, xhr) {
                                        $(".butterbar").removeClass("active").addClass("hide");
                                        if (data && data.status) {

                                                var source = $('#mod-store-template').html();
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

        };
});