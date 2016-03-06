define(['require', 'exports', 'module', 'jquery', '../module/utils', 'Handlebars', './helper', '../assets/js/cadErrors', 'webuploader', 'cookie', 'validate', '../libs/jquery/jquery.bxslider.min', '../libs/jquery/icheck.min'],
function(require, exports, module, jquery, utils, Handlebars, helper, errors, webuploader) {

        var i18nlng = $.cookie("i18next") == "en-US" ? "en": "";
        // 点击模块，调出模块详情模态弹窗 start //模块管理页面太多差异，不作处理
        var moduleStoreDetail = function() {
                var $modDetailModal = $('#mod_detail_modal');
                var bxsliderB = 0;
                $('#modulestore, .module-box, .module-auth-box').on('click', '.modulestore-module-name, .img-shadow, .modulestore-container-detail-box, .module-name, #module-carousel a.no_link, .module-auth-name',
                function(event) {
                        var $this = $(this);
                        var mdid = '';
                        if ($this.parents('.module-container').attr('mdid')) {
                                mdid = $this.parents('.module-container').attr('mdid');
                        }
                        if ($this.parents('.modulestore-module-container').attr('mdid')) {
                                mdid = $this.parents('.modulestore-module-container').attr('mdid');
                        }
                        if ($this.parents('.modulestore-new-module-container').attr('mdid')) {
                                mdid = $this.parents('.modulestore-new-module-container').attr('mdid');
                        }
                        if ($this.parents('.modulestore-list-li').attr('mdid')) {
                                mdid = $this.parents('.modulestore-list-li').attr('mdid');
                        }
                        if ($this.parents('.modulestore-select-li').attr('mdid')) {
                                mdid = $this.parents('.modulestore-select-li').attr('mdid');
                        }
                        // if ($this.parents('.module_history_container').attr('mdid')) {//,#module_history_list_box
                        //     mdid = $this.parents('.module_history_container').attr('mdid');
                        // }//, #module_history_list_box
                        if ($this.parents('.module-auth-container').attr('mdid')) {
                                mdid = $this.parents('.module-auth-container').attr('mdid');
                        }
                        if ($this.attr('mdid')) {
                                mdid = $this.attr('mdid');
                        }

                        var curAppId = $.cookie('curAppId');
                        // 取回模块详情，给模态框赋值
                        $.ajax({
                                url: '/mxplay/data/getMdInfo.json',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                        mdId: mdid,
                                        appId: curAppId
                                },
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        var _body = data.body;

                                        if (_body.icon_path) {
                                                $modDetailModal.find('.img').attr('src', _body.icon_path);
                                        } else {
                                                $modDetailModal.find('.img').attr('src', '/img/module_default.jpg');
                                        }
                                        $modDetailModal.find('.mod_detail_name').text(_body.mdName);
                                        $modDetailModal.find('.module-hot-count').text(i18n.t('moduleStore.used_in_apps1') + _body.num + i18n.t('moduleStore.used_in_apps2'));
                                        if (_body.mdPlatform == 0) {
                                                $modDetailModal.find('.icon-android').removeClass('active');
                                                $modDetailModal.find('.icon-apple').addClass('active');
                                                $modDetailModal.find('.mod_detail_platform').text(i18n.t('moduleStore.available_for_ios'));
                                        } else if (_body.mdPlatform == 1) {
                                                $modDetailModal.find('.icon-android').addClass('active');
                                                $modDetailModal.find('.icon-apple').removeClass('active');
                                                $modDetailModal.find('.mod_detail_platform').text(i18n.t('moduleStore.available_for_android'));
                                        } else {
                                                $modDetailModal.find('.icon-android').addClass('active');
                                                $modDetailModal.find('.icon-apple').addClass('active');
                                                $modDetailModal.find('.mod_detail_platform').text(i18n.t('moduleStore.available_for_android_and_ios'));
                                        }
                                        if (_body.isfree) {
                                                $modDetailModal.find('.price').addClass('free').text(i18n.t('moduleStore.free'));
                                        } else {
                                                $modDetailModal.find('.price').removeClass('free').text('￥' + _body.price);
                                        }
                                        if (_body.key_id || _body.isfree) {
                                                $modDetailModal.find('.go_tb_url').hide().attr('href', 'javascript:void(0)');
                                        } else {
                                                $modDetailModal.find('.go_tb_url').show().attr('href', _body.taobao_url);
                                        }
                                        $modDetailModal.find('.mod_detail_carousel').html('');
                                        var bxsliderStr = '<ul class="bxslider">';
                                        bxsliderB = 0;
                                        if (_body.icon1_path) {
                                                bxsliderStr += '<li><div class="prev_box">' + '<img src="' + _body.icon1_path + '" alt="" class="prev_page">' + '</div></li>';
                                                bxsliderB += 1;
                                        }
                                        if (_body.icon2_path) {
                                                bxsliderStr += '<li><div class="prev_box">' + '<img src="' + _body.icon2_path + '" alt="" class="prev_page">' + '</div></li>';
                                                bxsliderB += 1;
                                        }
                                        if (_body.icon3_path) {
                                                bxsliderStr += '<li><div class="prev_box">' + '<img src="' + _body.icon3_path + '" alt="" class="prev_page">' + '</div></li>';
                                                bxsliderB += 1;
                                        }
                                        if (bxsliderB == 0) {
                                                bxsliderStr += '<li><div class="prev_box">' + '<img src="/img/modulestore/no_img_found.png" alt="" class="no-prev" style="display: inline;position: relative;top: -4px;left: -10px;">' + '<span class="no-prev-text" style="font-size: 18px;color: #B3B3B3;">' + i18n.t('moduleStore.noPreviewAvailable') + '</span>'+'</div></li>';
                                                bxsliderB = 1;
                                        }
                                        bxsliderStr += '</ul>';

                                        $modDetailModal.find('.mod_detail_carousel').html(bxsliderStr);
                                        if ($.cookie('i18next').indexOf('en') != -1) {
                                                $modDetailModal.find('.mod_detail_details').text(_body.enInfo || '');
                                        } else {
                                                $modDetailModal.find('.mod_detail_details').text(_body.mdInfo);
                                        }
                                        if (_body.doc_url) {
                                                $modDetailModal.find('.go_mod_doc').attr('href', _body.doc_url).attr('target', '_blank');
                                        } else {
                                                $modDetailModal.find('.go_mod_doc').attr('href', 'javascript:void(0)').removeAttr('target');
                                        }
                                        $modDetailModal.find('.version').text('v' + _body.mdVer);
                                        $modDetailModal.find('.author').text(_body.userName);
                                        $modDetailModal.find('.update').text(utils.modStoreFormat(_body.mdUpdateDate));
                                        // mod_detail_details
                                        $('#mod_detail_modal').modal({
                                                show: true
                                        });
                                } else {

}
                        }).fail(function() {
                                console.log(arguments)
                        }).always(function() {});
                        event.preventDefault();
                });
                $('#mod_detail_modal').on('shown.bs.modal',
                function(event) {
                        utils.setBxSliderForModDetail(bxsliderB, $('#mod_detail_modal'));
                });
        };
        // 点击模块，调出模块详情模态弹窗 end
        // 模块store分类页公共部分 start
        var moduleStoreCommon = function(options) {
                var option = options;
                /*options: {
            hlIndex: //高亮导航栏,
            banner: {
                src: //广告栏图片,
                mdid: //广告栏模块id
            },
            curType: //本页模块type,与点击导航,搜索等相关,
            select: //精选页时true,其它false,
        }**/
                var pageInit = 12;
                helper.init();
                $('.header').find('a[href*="/modulestore"]').addClass('active');
                var i18nlng = $.cookie("i18next") == "en-US" ? "en": "";

                // 切换高亮状态 start ::option
                $('.modulestore-tabBar-inner').eq(option.hlIndex).addClass('active');
                // 切换高亮状态 end
                // 更换banner start ::option
                if (!option.select) {
                        $('#module-carousel img').attr('src', option.banner.src);
                        $('#module-carousel a').attr({
                                'mdid': option.banner.mdid
                        });
                }

                // 更换banner end
                // 搜索框搜索所需变量 start
                var searchByInput = false;
                var searchName = '';
                // 搜索框搜索所需变量 end
                // 面包屑导航 start
                function showBreadNav() {
                        if (searchByInput) {
                                $('.breadCrumbNav-group').hide();
                                $('.filter-message-back').show();
                                $('.modulestore-filter-right').hide();
                                $('#modulestore .module-main').removeClass('mod-select');
                        } else {
                                $('.breadCrumbNav-group').show();
                                $('.filter-message-back').hide();
                                $('.modulestore-filter-right').show();
                                $('#modulestore .module-main').addClass('mod-select');
                        }
                        // 面包屑第一级路径
                        $('.breadCrumbNav-group a').html($.cookie('data-first-text')).attr({
                                'data-first': $.cookie('data-first'),
                                'data-second': $.cookie('data-second')
                        });
                        if ($.cookie('data-second') > 0) {
                                // 如果有subclass的话
                                $('.breadCrumbNav-group .right-quo').show();
                                $('.breadCrumbNav-group .last-one').html($.cookie('data-second-text'));
                        } else {
                                $('.breadCrumbNav-group .right-quo').hide();
                                $('.breadCrumbNav-group .last-one').html('');
                        }
                };
                if (!option.select) {
                        showBreadNav();
                }
                // 面包屑导航 end
                // 面包屑点击 start
                $('.breadCrumbNav-group a').on('click',
                function(event) {
                        searchByInput = false;
                        var $this = $(this);
                        var type = $this.attr('data-first');
                        var subclass = $this.attr('data-second');
                        $.cookie('data-first', type);
                        $.cookie('data-second', 0);
                        curPageNum = 1;
                        showModTemplate({
                                type: type,
                                subclass: 0,
                                startNum: 0
                        });
                        $this.attr({
                                'data-second': 0
                        });
                        $('.breadCrumbNav-group .right-quo').hide();
                        $('.breadCrumbNav-group .last-one').html('');
                        event.preventDefault();
                });
                // 面包屑点击 end
                // 点击精选按钮 start
                var showSelect = function() {
                        searchByInput = false;
                        $('.module-main').addClass('select');
                        $('.breadCrumbNav-group').show();
                        $('.filter-message-back').hide();
                        $('.modulestore-filter-right').hide();
                        // 5个最新模块
                        // 8个免费，8个收费
                        // 只留精选
                        $.ajax({
                                url: '/getSelectedMd',
                                type: 'GET',
                                dataType: 'json',
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        var source = $('#mod-template').html();
                                        var template = Handlebars.compile(source);
                                        data.i18nlng = i18nlng;
                                        var htm = template(data);
                                        $('.modulestore-module-box').html(htm);
                                } else {}
                        }).fail(function() {}).always(function() {});
                };
                // 点击精选按钮 end
                // 切换分类或者切换分类页面 start ::option
                var curPageNum = 1;
                var pageCount = 0;
                $('#modulestore').on('click', '.modulestore-filter-list li,.modulestore-text-highlight',
                function(event) {
                        searchByInput = false;
                        var $this = $(this);
                        curPageNum = 1;
                        // 调用分类搜索
                        var type = $this.attr('data-first') || 0;
                        var subclass = $this.attr('data-second') || 0;

                        // 跳转至其他页
                        if (type > 0) {
                                $.cookie('data-first', type);
                                $.cookie('data-second', subclass);
                                $.cookie('data-first-text', $this.parents('.modulestore-tabBar-inner').find('.modulestore-text').text());
                                $.cookie('data-second-text', $this.text());
                                if (type == 3 && option.curType != type) {
                                        document.getElementById('mod-ui').click();
                                }
                                if (type == 4 && option.curType != type) {
                                        document.getElementById('mod-nav').click();
                                }
                                if (type == 5 && option.curType != type) {
                                        document.getElementById('mod-ext').click();
                                }
                                if (type == 8 && option.curType != type) {
                                        document.getElementById('mod-sdk').click();
                                }
                                if (type == 2 && option.curType != type) {
                                        document.getElementById('mod-dev').click();
                                }
                                if (type == 9 && option.curType != type) {
                                        document.getElementById('mod-cloud').click();
                                }
                        } else {
                                // 此处需要考虑
                                if (option.select) { //select,当在精选页面时,为true
                                        showSelect();
                                        // 切换是否为精选
                                        $('.module-main').removeClass('select');
                                } else {
                                        document.getElementById('mod-store').click();
                                }
                        }
                        showModTemplate({
                                type: type,
                                subclass: subclass
                        });
                        event.preventDefault();
                });
                // 切换分类或者切换分类页面 end
                // 分页显示 start ::option
                var showPages = function(num) {
                        var str = '';
                        pageCount = num;
                        if (num <= 7) {
                                for (var i = 0; i < num; i++) {
                                        if ((i + 1) == curPageNum) {
                                                str += '<span class="modulestore-btn active">' + (i + 1) + '</span>';
                                        } else {
                                                str += '<span class="modulestore-btn" data-index="' + i + '">' + (i + 1) + '</span>';
                                        }
                                };
                        } else {
                                if (curPageNum <= 2) {
                                        for (var j = 0; j < 7; j++) {
                                                if ((j + 1) == curPageNum) {
                                                        str += '<span class="modulestore-btn active">' + (j + 1) + '</span>';
                                                } else if (j == 6) {
                                                        str += '<span class="modulestore-btn" data-index="' + (num - 1) + '">' + num + '</span>';
                                                } else if (j == 5) {
                                                        str += '<span class="modulestore-btn more-page">...</span>';
                                                } else {
                                                        str += '<span class="modulestore-btn" data-index="' + j + '">' + (j + 1) + '</span>';
                                                }
                                        }
                                } else if (num - curPageNum <= 2) {
                                        for (var k = num - 7; k < num; k++) {
                                                if ((k + 1) == curPageNum) {
                                                        str += '<span class="modulestore-btn active">' + (k + 1) + '</span>';
                                                } else if (k == num - 7) {
                                                        str += '<span class="modulestore-btn" data-index="0">1</span>';
                                                } else if (k == num - 6) {
                                                        str += '<span class="modulestore-btn more-page">...</span>';
                                                } else {
                                                        str += '<span class="modulestore-btn" data-index="' + k + '">' + (k + 1) + '</span>';
                                                }
                                        }
                                } else {
                                        for (var l = 0; l < 7; l++) {
                                                if (l == 0) {
                                                        str += '<span class="modulestore-btn" data-index="0">1</span>';
                                                } else if (l == 1) {
                                                        str += '<span class="modulestore-btn more-page">...</span>';
                                                } else if (l == 6) {
                                                        str += '<span class="modulestore-btn" data-index="' + (num - 1) + '">' + num + '</span>';
                                                } else if (l == 5) {
                                                        str += '<span class="modulestore-btn more-page">...</span>';
                                                } else if (l == 3) {
                                                        str += '<span class="modulestore-btn active">' + curPageNum + '</span>';
                                                } else if (l == 2) {
                                                        str += '<span class="modulestore-btn" data-index="' + (curPageNum - 2) + '">' + (curPageNum - 1) + '</span>';
                                                } else if (l == 4) {
                                                        str += '<span class="modulestore-btn" data-index="' + curPageNum + '">' + (curPageNum + 1) + '</span>';
                                                } else {

}
                                        }
                                }
                        }
                        $('#modulestore-page-box .module-page-container').html(str);

                };
                if (!option.select) {
                        showPages(Math.ceil(initSearchNum / pageInit));
                }
                // 翻页
                $('#modulestore-page-box').on('click', '.module-page-container .modulestore-btn',
                function(event) {
                        var $this = $(this);
                        if ($this.hasClass('active') || $this.hasClass('more-page')) {
                                return;
                        } else {
                                var startNum = parseInt($this.attr('data-index')) * pageInit;
                                curPageNum = parseInt($this.attr('data-index')) + 1;
                                if (searchByInput) {
                                        showModTemplate({
                                                searchByName: true,
                                                searchName: searchName,
                                                startNum: startNum
                                        });
                                } else {
                                        showModTemplate({
                                                type: $('.breadCrumbNav-group a').attr('data-first') || 0,
                                                subclass: $('.breadCrumbNav-group a').attr('data-second') || 0,
                                                startNum: startNum
                                        });
                                }
                        }
                        aniToHeader(); 
						event.preventDefault();
                });
                $('#modulestore-page-box').on('click', '.btn-prev,.btn-next',
                function(event) {
                        var $this = $(this);
                        if (($this.hasClass('btn-prev') && curPageNum == 1) || ($this.hasClass('btn-next') && curPageNum == pageCount)) {
                                return;
                        } else {
                                if ($this.hasClass('btn-prev')) {
                                        curPageNum -= 1;
                                }
                                if ($this.hasClass('btn-next')) {
                                        curPageNum += 1;
                                }
                                var startNum = (curPageNum - 1) * pageInit;
                                if (searchByInput) {
                                        showModTemplate({
                                                searchByName: true,
                                                searchName: searchName,
                                                startNum: startNum
                                        });
                                } else {
                                        showModTemplate({
                                                type: $('.breadCrumbNav-group a').attr('data-first') || 0,
                                                subclass: $('.breadCrumbNav-group a').attr('data-second') || 0,
                                                startNum: startNum
                                        });
                                }

                        }
                        aniToHeader();
						event.preventDefault();
                });
                var aniToHeader = function() {
                        $('html,body').animate({
                                scrollTop: $('#modulestore_tabBar').offset().top
                        },
                        500)
                };
                // 分页显示 end
                // 获取平台 start
                var getPlatform = function() {

                        if ($('#module-platform .platform-ios').parents('.icheckbox_minimal-orange').hasClass('checked') && $('#module-platform .platform-android').parents('.icheckbox_minimal-orange').hasClass('checked')) {
                                return 2;
                        } else if (!$('#module-platform .platform-ios').parents('.icheckbox_minimal-orange').hasClass('checked') && !$('#module-platform .platform-android').parents('.icheckbox_minimal-orange').hasClass('checked')) {
                                return - 1;
                        } else {
                                if ($('#module-platform .platform-ios').parents('.icheckbox_minimal-orange').hasClass('checked')) {
                                        return 0;
                                }
                                if ($('#module-platform .platform-android').parents('.icheckbox_minimal-orange').hasClass('checked')) {
                                        return 1;
                                }
                        }
                };
                // 获取平台 end
                // 点击平台按钮,按平台过滤 start
                $('#module-platform input').iCheck({
                        checkboxClass: 'icheckbox_minimal-orange',
                        radioClass: 'iradio_minimal-orange',
                        increaseArea: '20%' // optional
                });
                $('#module-platform .platform-ios,#module-platform .platform-android').on('ifClicked',
                function(event) {
                        searchByInput = false;
                        var $this = $(this);
                        var type = $('.breadCrumbNav-group a').attr('data-first');
                        var subclass = $('.breadCrumbNav-group a').attr('data-second');
                        setTimeout(function() {
                                curPageNum = 1;
                                showModTemplate({
                                        type: type,
                                        subclass: subclass,
                                        startNum: 0
                                });
                        },
                        200);
                });
                // 点击平台按钮,按平台过滤 end
                // 按排序方式过滤 start
                $('#requestlist').on('click', 'li',
                function(event) {
                        var $this = $(this).find('a');
                        var value = $this.attr('data-value');
                        var name = $this.text();
                        var $requestText = $('#requestText');
                        $requestText.text(name).attr('data-value', value);
                        searchByInput = false;
                        var type = $('.breadCrumbNav-group a').attr('data-first');
                        var subclass = $('.breadCrumbNav-group a').attr('data-second');
                        var startNum = curPageNum * pageInit - pageInit;
                        showModTemplate({
                                type: type,
                                subclass: subclass,
                                startNum: startNum
                        });
                        event.preventDefault();
                });
                // 按排序方式过滤 end
                // 搜索框搜索 start
                // 搜索框
                var $searchGroupInner = $('.search-group-inner');
                var $searchInput = $('#modulestore-search-input');
                var searchAniLock = false;
                //支持点击搜索
                var clickToSearch = false;
                $('.search-group .modulestore-icon-search').on('click',
                function(event) {
                        // 点击放大镜调出搜索框
                        searchAniLock = false;
                        $searchGroupInner.animate({
                                left: 0
                        },
                        250,
                        function() {
                                searchAniLock = true;
                                clickToSearch = true;
                                $searchInput.focus();
                        });
                        if (clickToSearch) {
                                $searchGroupInner.trigger('submit');
                        }
                });
                var hideSearchInput = function() {
                        // 隐藏搜索框方法
                        var regTrim = /\s/g;
                        if ($searchInput.val().replace(regTrim, '') == '' && searchAniLock) {
                                $searchInput.val('');
                                $searchGroupInner.animate({
                                        left: 202
                                },
                                250,
                                function() {
                                        searchAniLock = true;
                                });
                        } else {}
                        clickToSearch = false;
                };

                $(document.body).on('click',
                function(e) {
                        // 点击body关闭搜索框
                        if (($(e.target).hasClass('modulestore-icon-search')) || ($(e.target).parents('.search-group').length > 0)) {

} else {
                                hideSearchInput();
                        }
                });
                $searchGroupInner.validate({
                        submitHandler: function(form) {
                                var regTrim = /\s/g;
                                searchByInput = true;
                                curPageNum = 1;
                                searchName = $searchInput.val().replace(regTrim, '');
                                showModTemplate({
                                        searchByName: true,
                                        searchName: searchName
                                });
                                $('.module-main').removeClass('select');
                        }
                });
                $('.clearBtn').on('click',
                function(event) {
                        $searchInput.val('');
                        $('.clearBtn').hide();
                        event.preventDefault();

                });
                // 搜索框搜索 end
                // 共找到n条信息前的返回 start
                $('.filter-message-back .btn-back').on('click',
                function(event) {
                        $('#modulestore-search-input').val('');
                        $('.clearBtn').hide();
                        if ($('.modulestore-tabBar-inner').eq(0).hasClass('active')) {
                                showSelect();
                        } else {
                                searchByInput = false;
                                curPageNum = 1;
                                showModTemplate({
                                        type: $('.breadCrumbNav-group a').attr('data-first'),
                                        subclass: $('.breadCrumbNav-group a').attr('data-second'),
                                        startNum: 0
                                });
                        }
                        event.preventDefault();
                });
                // 共找到n条信息前的返回 end   
                // 按条件搜索模块,并显示 start
                var showModTemplate = function(opts) {
                        if (searchByInput) {
                                pageInit = 15;
                        } else {
                                pageInit = 12;
                        }
                        var startNum = opts.startNum || 0;
                        var size = opts.size || pageInit;
                        var platform = opts.platform || getPlatform();
                        var type = opts.type || 0;
                        var subclass = opts.subclass || 0;
                        var searchByName = opts.searchByName || false;
                        var order = $('#requestText').attr('data-value');
                        var searchName = opts.searchName || '';
                        showBreadNav(); //调用面包屑导航
                        $.ajax({
                                url: '/getAllMdStore',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                        startNum: startNum,
                                        size: size,
                                        platform: platform,
                                        type: type,
                                        subclass: subclass,
                                        order: order,
                                        searchByName: searchByName,
                                        searchName: searchName
                                },
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        var source = $('#mod-template').html();
                                        var template = Handlebars.compile(source);
                                        data.i18nlng = i18nlng;
                                        var htm = template(data);
                                        $('.modulestore-module-box').html(htm);
                                        // allNum
                                        showPages(Math.ceil(data.searchNum / pageInit));
                                        // searchNum
                                        $('.filter-message-back .count').text(data.searchNum);
                                        if (subclass > 0) {
                                                $('.modulestore-tabBar-inner').eq(1).find('.modulestore-filter-list li').each(function(index, el) {
                                                        var $this = $(el);
                                                        if ($this.attr('data-second') == subclass) {
                                                                $this.addClass('active');
                                                        } else {
                                                                $this.removeClass('active');
                                                        }
                                                });
                                        } else {
                                                $('.modulestore-tabBar-inner').eq(1).find('.modulestore-filter-list li').each(function(index, el) {
                                                        var $this = $(el);
                                                        $this.removeClass('active');
                                                });
                                        }
                                } else {

}
                        }).fail(function() {}).always(function() {});
                }
                // 按条件搜索模块,并显示 end
                // 填充精选 start
                var showSelectList = function(type) {
                        $('.modulestore-select-span').html($.trim($.cookie('data-first-text')) + i18n.t('moduleStore.selectedMods'));
                        $.ajax({
                                url: '/getSelectedMdByType',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                        type: type
                                },
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        var source = $('#mod-list-template').html();
                                        var template = Handlebars.compile(source);
                                        data.i18nlng = i18nlng;
                                        var htm = template(data);
                                        $('.modulestore-select-list').html(htm);
                                } else {
                                        utils.alertMessage(0, data.msg);
                                }
                        }).fail(function() {}).always(function() {});

                };
                // showSelectList(3);
                // 填充精选 end
        };
        // 模块store分类页公共部分 end
        // 发布模块，编辑模块部分 start
        var moduleStorePub = function(options) {
                var option = options;
                /*options: {
            isHistory: true/false//模块store页false,模块管理页true
        }**/
                var mod_mdp = null;
                var mod_mdInfoIsFull = null;
                // 发布提示部分
                var pubNotice = function() {
                        if ($.cookie('closePubTips')) {
                                $('#mod_pub_modal').modal({
                                        backdrop: 'static',
                                        show: true
                                });
                        } else {
                                $('#pub_tip_modal').on('show.bs.modal',
                                function(event) {
                                        $('#pub_tip_modal input').iCheck({
                                                checkboxClass: 'icheckbox_minimal-orange',
                                                radioClass: 'iradio_minimal-orange',
                                                increaseArea: '20%' // optional
                                        });
                                });
                                $('#pub_tip_modal').on('hide.bs.modal',
                                function(event) {
                                        if ($('#pub_tip_modal .icheckbox_minimal-orange').hasClass('checked')) {
                                                $.cookie('closePubTips', 'true', {
                                                        expires: 7
                                                });
                                        } else {}
                                });
                                $('#pub_tip_modal').on('hidden.bs.modal',
                                function(event) {
                                        $('#mod_pub_modal').modal({
                                                backdrop: 'static',
                                                show: true
                                        });
                                        event.preventDefault();
                                });
                                $('#pub_tip_modal').modal({
                                        backdrop: 'static',
                                        show: true
                                });
                        }
                };
                var getMdInfoIsFull = function() {
                        if (mod_mdInfoIsFull) {
                                pubNotice();
                        } else {
                                $pubInfoModal.modal({
                                        backdrop: 'static',
                                        show: true
                                });
                        }
                };
                var getMdp = function() {
                        if (mod_mdp) {
                                getMdInfoIsFull();
                        } else {
                                $pubProtocolModal.modal({
                                        backdrop: 'static',
                                        show: true
                                });
                        }
                };
                // 协议模态弹窗
                var $pubProtocolModal = $('#pub_protocol_modal');
                $pubProtocolModal.on('click', '.refuse',
                function(event) {
                        $pubProtocolModal.modal('hide');
                        event.preventDefault();
                });
                $pubProtocolModal.on('click', '.agree',
                function(event) {
                        var $this = $(this);
                        $this.attr('disabled', 'disabled');
                        $.ajax({
                                url: '/api/user/module/developer/protocol/confirmation',
                                type: 'PUT',
                                dataType: 'json',
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        getMdInfoIsFull();
                                } else {
                                        utils.alertMessage(0, data.msg);
                                }
                        }).fail(function() {}).always(function() {
                                $pubProtocolModal.modal('hide');
                                $this.removeAttr('disabled');
                        });
                        event.preventDefault();
                });
                // 个人信息完整模态弹窗
                var $pubInfoModal = $('#pub_info_modal');
                $pubInfoModal.on('click', '.refuse',
                function(event) {
                        $pubProtocolModal.modal('hide');
                        event.preventDefault();
                });
                $pubInfoModal.on('click', '.agree',
                function(event) {
                        $pubInfoModal.modal('hide');
                        window.location.href = '/profile';
                        event.preventDefault();
                });
                // 发布提示部分 end
                // 点击发布，调出模态弹窗
                $('.pub-mod-btn').on('click',
                function(event) {
                        pubOrEdit = true;
                        $.ajax({
                                url: '/api/user/info',
                                type: 'GET',
                                dataType: 'json',
                                cache: false
                        }).done(function(data) {
                                if (data && data.status) {
                                        // 发布协议与资料补齐
                                        mod_mdp = data.result.mdp || null;
                                        mod_mdInfoIsFull = data.result.mdInfoIsFull || null;
                                        getMdp();
                                        // 相对于编辑
                                        $('#mod_pub_box1 .mod_pub_name').val('');
                                        $('#mod_pub_box1 .mod_pub_name').removeAttr('disabled');
                                        $('#mod_pub_box1 .mod_pub_name_group .word-limit').show();
                                } else {
                                        window.location.href = '/signin';
                                }
                        }).fail(function() {}).always(function() {});

                        event.preventDefault();
                });
                // 到第三页之后，调用轮播图插件
                var initPubBxSlider = false;

                var webUpload1 = false,
                webUpload2 = false,
                webUpload3 = false;
                // webuploader插件(待修改成img)
                var uploadAll = function(opts) {

                        opts = opts || {};
                        var picker = opts.picker;
                        var fileUrl;
                        var fnCb = opts.fnCb;
                        var fnError = opts.fnError;
                        var fnProgress = opts.fnProgress;
                        var fnCancel = opts.fnCancel;
                        var formData = opts.formData;
                        var regText = opts.regText;

                        var uploader = WebUploader.create({
                                pick: picker,
                                //触发上传元素
                                swf: '/libs/webuploader/Uploader.swf',
                                //垃圾IE用的flash
                                server: '/api2/upload',
                                //服务器接口
                                formData: formData,
                                auto: true //选完文件后，是否自动上传
                        });
                        uploader.on('beforeFileQueued',
                        function(file) {
                                fnCancel(uploader, file);
                                if (regText) {
                                        var upload_lock = false;
                                        for (var i = 0; i < regText.length; i++) {
                                                var reg = new RegExp('\\.' + regText[i] + '$', 'ig');
                                                if (!reg.test(file.name.toLowerCase())) {
                                                        upload_lock = false;
                                                } else {
                                                        upload_lock = true;
                                                        break;
                                                }
                                        };
                                        if (upload_lock) {
                                                uploader.upload();
                                        } else {
                                                alert(i18n.t('moduleStore.wrongUploadFormat'));
                                                // utils.alertMessage(0,'上传格式错误');
                                                return false;
                                        }
                                }
                        });
                        //进度条
                        uploader.on('uploadProgress',
                        function(file, percentage) {
                                var per = percentage * 100 + '%';
                                fnProgress(per);
                        });
                        //文件上传成功
                        uploader.on('uploadSuccess',
                        function(file, response) {
                                var res = response;
                                if (res && res.status) {
                                        fileUrl = res.result.path;
                                        fnCb && fnCb(fileUrl, file);
                                        uploader.removeFile(file);
                                } else {
                                        fnError && fnError(file);
                                        alert(res.msg);
                                        // utils.alertMessage(0,res.msg);
                                }
                        });
                        //文件上传失败
                        uploader.on('uploadError',
                        function(file) {
                                fnError && fnError(file);
                        });
                        //上传完成，不管成功失败
                        uploader.on('uploadComplete',
                        function(file) {
                                uploader.removeFile(file);
                        });
                };
                // 模块分类select触发
                var objSubclass = {};
                if (i18nlng.indexOf('en') != -1) {
                        objSubclass = {
                                3 : {
                                        1 : 'List',
                                        2 : 'Selector',
                                        3 : 'Chart',
                                        4 : 'Other'
                                },
                                5 : {
                                        1 : 'Local Storage',
                                        2 : 'Text Reader',
                                        3 : 'Network Communication',
                                        4 : 'Multi-media',
                                        5 : 'Other'
                                },
                                8 : {
                                        1 : 'Share and Login',
                                        2 : 'Push & Comm',
                                        3 : 'Payment',
                                        4 : 'Map',
                                        5 : 'Smart Identification',
                                        6 : 'Verif & Security',
                                        7 : 'Ads',
                                        8 : 'Other'
                                }
                        };
                } else {
                        objSubclass = {
                                3 : {
                                        1 : "列表",
                                        2 : "选择器",
                                        3 : "图表",
                                        4 : "其它"
                                },
                                5 : {
                                        1 : "本地存储",
                                        2 : "文本浏览",
                                        3 : "网络通信",
                                        4 : "多媒体",
                                        5 : "其它"
                                },
                                8 : {
                                        1 : "分享与登录",
                                        2 : "推送与通讯",
                                        3 : "支付",
                                        4 : "地图",
                                        5 : "智能识别",
                                        6 : "验证与安全",
                                        7 : "广告",
                                        8 : "其他"
                                }
                        };
                }
                $('#mod_pub_class1').on('change',
                function(event) {
                        var $this = $(this);
                        var obj = objSubclass[$this.val()];
                        var str = '';
                        if (obj) {
                                for (var i in obj) {
                                        str += '<option value="' + i + '" data-rel="">' + obj[i] + '</option>';
                                }
                                $('#mod_pub_class2').html(str);
                                $('#mod_pub_class2').show();
                        } else {
                                $('#mod_pub_class2').hide();
                        }

                });
                // 重置发布表单
                var pubForm1 = false,
                pubForm2 = false,
                pubForm3 = false;
                // 发布模块（或者编辑模块）所用的数据data
                var mod_pub_formData = {};
                // 是发布模块还是编辑模块 true是发布
                var pubOrEdit = true;
                $.validator.addMethod("maxCNLen",
                function(value, element, param) {
                        var cArr = value.match(/[^\x00-\xff]/ig);
                        var len = value.length + (cArr == null ? 0 : cArr.length);
                        return len <= param;
                },
                i18n.t('member.notice2'));
                $.validator.addMethod("version",
                function(value, element) {
                        // 只判断是否大于0.0.0
                        var prevVer = 0;
                        var newVer = 0;
                        $verArea.find('.version').each(function(index, el) {
                                var thisVal = $(el).val();
                                thisVal = parseInt(thisVal, 10) || 0;
                                if (index === 0) {
                                        newVer = newVer + thisVal * 10000;
                                } else if (index === 1) {
                                        newVer = newVer + thisVal * 100;
                                } else if (index === 2) {
                                        newVer = newVer + thisVal;
                                }
                        });
                        if (newVer > prevVer) {
                                return true;
                        } else {
                                return false;
                        }
                },
                i18n.t("cadPackage.warn_11"));
                $.validator.addMethod('validPkg',
                function(value, element, param) {
                        // 判断压缩包名是否一致，是否上传
                        var iosModName = $('#mod_pub_upload_text_i').val();
                        var andModName = $('#mod_pub_upload_text_a').val();
                        var valid = true;
                        if (!iosModName && !andModName) {
                                valid = false;
                                return valid;
                        }
                        if (iosModName && andModName) {
                                if (iosModName !== andModName) {
                                        valid = false;
                                        return valid;
                                }
                        }
                        return valid;
                },
                i18n.t('cadModule.notice'));
                $.validator.addMethod('validPkgName',
                function(value, element, param) {
                        // 判断模块名与压缩包名是否一致
                        var modName = mod_pub_formData.name;
                        var iosModName = $('#mod_pub_upload_text_i').val();
                        var andModName = $('#mod_pub_upload_text_a').val();
                        var valid = true;
                        if (iosModName) {
                                if (iosModName !== modName) {
                                        valid = false;
                                        return valid;
                                }
                        }
                        if (andModName) {

                                if (andModName !== modName) {
                                        valid = false;
                                        return valid;
                                }
                        }
                        return valid;
                },
                i18n.t('cadModule.notice1'));
                $.validator.addMethod('word',
                function(value, element, param) {
                        var reg = /[^a-zA-Z0-9_]/gi;
                        if (reg.test(value)) {
                                return false;
                        } else {
                                return true;
                        }
                },
                i18n.t('moduleStore.noticeFormat'));
                // 初始化表单1
                var initPubform1 = function(fnEnd) {
                        pubForm1 = true;
                        $('#mod_pub_modal .btn_next').attr('disabled', 'disabled');
                        $('#mod_pub_box1 .mod_pub_price_label1').iCheck({
                                checkboxClass: 'icheckbox_minimal-green',
                                radioClass: 'iradio_minimal-green',
                                increaseArea: '20%' // optional
                        });
                        $('#mod_pub_box1 .mod_pub_price_label2').iCheck({
                                checkboxClass: 'icheckbox_minimal-green',
                                radioClass: 'iradio_minimal-green',
                                increaseArea: '20%' // optional
                        });
                        $('.mod_pub_price_label1').on('ifClicked',
                        function(event) {
                                $('#mod_pub_box1 .mod_pub_price').attr('disabled', 'disabled');
                                $('#mod_pub_box1 .mod_pub_price').addClass('ignore');
                        });
                        $('.mod_pub_price_label2').on('ifClicked',
                        function(event) {
                                $('#mod_pub_box1 .mod_pub_price').removeAttr('disabled');
                                $('#mod_pub_box1 .mod_pub_price').removeClass('ignore');
                        });
                        $('#mod_pub_box1 .mod_pub_name').val('');
                        $('#mod_pub_box1 .version_num').val('');
                        $('#mod_pub_box1 .mod_pub_brief').val('');
                        //字数限制
                        utils.limitWord({
                                element: '#mod_pub_box1 .mod_pub_name_group .mod_pub_name',
                                maxLen: 30,
                                labelElement: '#mod_pub_box1 .mod_pub_name_group .word-limit em'
                        });
                        utils.limitWord({
                                element: '#mod_pub_box1 .mod_pub_brief_group .mod_pub_brief',
                                maxLen: 60,
                                labelElement: '#mod_pub_box1 .mod_pub_brief_group .word-limit em'
                        });
                        // 模块分类
                        $('#mod_pub_class1').val('3');
                        $('#mod_pub_class2').val('1');
                        // 添加表单验证
                        $('#mod_pub_box1').validate({
                                errorPlacement: function(error, element) {
                                        if (element.attr("name") === "mod_pub_ver1" || element.attr("name") === "mod_pub_ver2" || element.attr("name") === "mod_pub_ver3") {
                                                $('#pub_version_num_error').html(error);
                                        } else if (element.attr("name") === "mod_pub_price") {
                                                $('#pub_mod_price_error').html(error);
                                        } else {
                                                element.after(error);
                                        }
                                },
                                ignore: '.ignore',
                                rules: {
                                        mod_pub_name: {
                                                required: true,
                                                word: true,
                                                maxCNLen: [30]
                                        },
                                        mod_pub_brief: {
                                                required: true,
                                                maxCNLen: [60]
                                        },
                                        mod_pub_ver1: {
                                                required: true,
                                                digits: true,
                                                range: [0, 99]
                                        },
                                        mod_pub_ver2: {
                                                required: true,
                                                digits: true,
                                                range: [0, 99]
                                        },
                                        mod_pub_ver3: {
                                                required: true,
                                                digits: true,
                                                range: [0, 99]
                                        },
                                        mod_pub_price: {
                                                required: true,
                                                digits: true
                                        }
                                },
                                messages: {
                                        mod_pub_name: {
                                                required: i18n.t('moduleStore.pleaseEnterModuleName')
                                        },
                                        mod_pub_brief: {
                                                required: i18n.t('moduleStore.pleaseEnterModuleDescription')
                                        },
                                        mod_pub_ver1: {
                                                required: i18n.t('cadPackage.valid_ver_1'),
                                                range: i18n.t('cadPackage.valid_ver_2'),
                                                digits: i18n.t('error.A00010')
                                        },
                                        mod_pub_ver2: {
                                                required: i18n.t('cadPackage.valid_ver_1'),
                                                range: i18n.t('cadPackage.valid_ver_2'),
                                                digits: i18n.t('error.A00010')
                                        },
                                        mod_pub_ver3: {
                                                required: i18n.t('cadPackage.valid_ver_1'),
                                                range: i18n.t('cadPackage.valid_ver_2'),
                                                digits: i18n.t('error.A00010')
                                        },
                                        mod_pub_price: {
                                                required: i18n.t('moduleStore.pleaseEnterPrice'),
                                                digits: i18n.t('moduleStore.pleaseEnterInteger')
                                        }
                                },
                                highlight: function(element, errorClass) {},
                                unhighlight: function(element, errorClass) {},
                                submitHandler: function(form) {
                                        // 将数据放入mod_pub_formData中
                                        mod_pub_formData.name = $('#mod_pub_box1 .mod_pub_name').val();
                                        var ver = '';
                                        $('#mod_pub_box1 .version_num').each(function(index, el) {
                                                var thisVal = $(el).val();
                                                thisVal = parseInt(thisVal, 10) || 0;
                                                thisVal += '';
                                                if (index === 2) {
                                                        ver = ver + thisVal;
                                                } else {
                                                        ver = ver + thisVal + '.';
                                                }
                                        });
                                        mod_pub_formData.ver = ver;
                                        mod_pub_formData.type = $('#mod_pub_class1').val();
                                        if ($('#mod_pub_class2').get(0).style.display != 'none') {
                                                mod_pub_formData.subclass = $('#mod_pub_class2').val();
                                        } else {
                                                mod_pub_formData.subclass = '0';
                                        }
                                        if ($('#mod_pub_box1').find('.iradio_minimal-green.checked input').val() == '0') {
                                                mod_pub_formData.isfree = 1;
                                                mod_pub_formData.price = 0;
                                        } else {
                                                mod_pub_formData.isfree = 0;
                                                mod_pub_formData.price = $('#mod_pub_box1 .mod_pub_price').val();
                                        }
                                        mod_pub_formData.info = $('#mod_pub_box1 .mod_pub_brief').val();
                                        // console.log(mod_pub_formData);
                                        // 跳转至第二个表单
                                        resetPubForm(2);
                                }
                        });
                        fnEnd && fnEnd();
                        $('#mod_pub_modal .btn_next').removeAttr('disabled');
                }
                // 初始化表单2
                var initPubform2 = function(fnEnd) {
                        $('#mod_pub_modal .btn_next').attr('disabled', 'disabled');
                        pubForm2 = true;
                        uploadAll({
                                picker: $('#mod_pub_box2 .upload_i'),
                                fnCb: function(fileUrl, file) {
                                        $('#mod_pub_box2 .box_i').addClass('success').removeClass('active').removeClass('error');
                                        $('#mod_pub_box2 .upload_i .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                        var fileName = file.name.split('.zip')[0];
                                        $('#mod_pub_box2 .box_i .msg').text(file.name);
                                        mod_pub_formData.ios_size = file.size;
                                        mod_pub_formData.ios_path = fileUrl;
                                        $('#mod_pub_upload_text_i').val(fileName);
                                },
                                fnError: function() {
                                        $('#mod_pub_box2 .box_i').removeClass('active').addClass('error');
                                        $('#mod_pub_box2 .box_i .msg').text(i18n.t('moduleStore.uploadFailed'));
                                        $('#mod_pub_box2 .upload_i .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                },
                                fnProgress: function(per) {
                                        $('#mod_pub_box2 .box_i').removeClass('success').addClass('active').removeClass('error');
                                        $('#mod_pub_box2 .box_i .msg').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                        $('#mod_pub_box2 .upload_i .webuploader-pick').addClass('cancel').text(i18n.t('global.Cancel'));
                                },
                                fnCancel: function(uploader, file) {
                                        $('#mod_pub_box2 .upload_i .webuploader-pick').on('click',
                                        function(event) {
                                                // 取消上传
                                                if (mod_pub_formData.ios_path) {
                                                        $('#mod_pub_box2 .box_i').removeClass('active').addClass('success');
                                                        $('#mod_pub_box2 .box_i .msg').text(mod_pub_formData.name + '.zip');
                                                } else {
                                                        $('#mod_pub_box2 .box_i').removeClass('active');
                                                        $('#mod_pub_box2 .box_i .msg').text(i18n.t('moduleStore.iosModuleNotUploaded'));
                                                }
                                                $('#mod_pub_box2 .upload_i .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                                uploader.cancelFile(file);
                                                event.preventDefault();
                                        });
                                },
                                formData: {
                                        upload_type: 'zip'
                                },
                                regText: ['zip']
                        });
                        if (mod_pub_formData.ios_path) {
                                $('#mod_pub_upload_text_i').val(mod_pub_formData.name);
                        } else {
                                $('#mod_pub_upload_text_i').val('');
                        }
                        uploadAll({
                                picker: $('#mod_pub_box2 .upload_a'),
                                fnCb: function(fileUrl, file) {
                                        $('#mod_pub_box2 .box_a').addClass('success').removeClass('active').removeClass('error');
                                        $('#mod_pub_box2 .upload_a .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                        var fileName = file.name.split('.zip')[0];
                                        $('#mod_pub_box2 .box_a .msg').text(file.name);
                                        mod_pub_formData.android_size = file.size;
                                        mod_pub_formData.android_path = fileUrl;
                                        $('#mod_pub_upload_text_a').val(fileName);
                                },
                                fnError: function() {
                                        $('#mod_pub_box2 .box_a').removeClass('active').addClass('error');
                                        $('#mod_pub_box2 .box_a .msg').text(i18n.t('moduleStore.uploadFailed'));
                                        $('#mod_pub_box2 .upload_a .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                },
                                fnProgress: function(per) {
                                        $('#mod_pub_box2 .box_a').removeClass('success').addClass('active').removeClass('error');
                                        $('#mod_pub_box2 .box_a .msg').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                        $('#mod_pub_box2 .upload_a .webuploader-pick').addClass('cancel').text(i18n.t('global.Cancel'));
                                },
                                fnCancel: function(uploader, file) {
                                        $('#mod_pub_box2 .upload_a .webuploader-pick').on('click',
                                        function(event) {
                                                // 取消上传
                                                if (mod_pub_formData.android_path) {
                                                        $('#mod_pub_box2 .box_a').removeClass('active').addClass('success');
                                                        $('#mod_pub_box2 .box_a .msg').text(mod_pub_formData.name + '.zip');
                                                } else {
                                                        $('#mod_pub_box2 .box_a').removeClass('active');
                                                        $('#mod_pub_box2 .box_a .msg').text(i18n.t('moduleStore.androidModuleNotUploaded'));
                                                }
                                                $('#mod_pub_box2 .upload_a .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                                uploader.cancelFile(file);
                                                event.preventDefault();
                                        });
                                },
                                formData: {
                                        upload_type: 'zip'
                                },
                                regText: ['zip']
                        });
                        if (mod_pub_formData.android_path) {
                                $('#mod_pub_upload_text_a').val(mod_pub_formData.name);
                        } else {
                                $('#mod_pub_upload_text_a').val('');
                        }
                        uploadAll({
                                picker: $('#mod_pub_box2 .upload_f'),
                                fnCb: function(fileUrl, file) {
                                        $('#mod_pub_box2 .box_f').addClass('success').removeClass('active').removeClass('error');
                                        $('#mod_pub_box2 .upload_f .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                        $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.moduleDocProvided'));
                                        mod_pub_formData.word_path = fileUrl;
                                        $('#mod_pub_upload_text_f').val(fileUrl);
                                },
                                fnError: function() {
                                        $('#mod_pub_box2 .box_f').removeClass('active').addClass('error');
                                        $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.uploadFailed'));
                                        $('#mod_pub_box2 .upload_f .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                },
                                fnProgress: function(per) {
                                        $('#mod_pub_box2 .box_f').removeClass('success').addClass('active').removeClass('error');
                                        $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                        $('#mod_pub_box2 .upload_f .webuploader-pick').addClass('cancel').text(i18n.t('global.Cancel'));
                                },
                                fnCancel: function(uploader, file) {
                                        $('#mod_pub_box2 .upload_f .webuploader-pick').on('click',
                                        function(event) {
                                                // 取消上传
                                                if (mod_pub_formData.word_path) {
                                                        $('#mod_pub_box2 .box_f').removeClass('active').addClass('success');
                                                        $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.moduleDocProvided'));
                                                } else {
                                                        $('#mod_pub_box2 .box_f').removeClass('active');
                                                        $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.moduleDocNotProvided'));
                                                }
                                                $('#mod_pub_box2 .upload_f .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                                uploader.cancelFile(file);
                                                event.preventDefault();
                                        });
                                },
                                formData: {
                                        upload_type: 'word_path'
                                },
                                regText: ['md']
                        });
                        uploadAll({
                                picker: $('#mod_pub_box2 .upload_c'),
                                fnCb: function(fileUrl, file) {
                                        $('#mod_pub_box2 .box_c').addClass('success').removeClass('active').removeClass('error');
                                        $('#mod_pub_box2 .upload_c .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                        var fileName = file.name.split('.zip')[0];
                                        $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.CaseProvided'));
                                        mod_pub_formData.case_path = fileUrl;
                                        $('#mod_pub_upload_text_c').val(fileName);
                                },
                                fnError: function() {
                                        $('#mod_pub_box2 .box_c').removeClass('active').addClass('error');
                                        $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.uploadFailed'));
                                        $('#mod_pub_box2 .upload_c .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                },
                                fnProgress: function(per) {
                                        $('#mod_pub_box2 .box_c').removeClass('success').addClass('active').removeClass('error');
                                        $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                        $('#mod_pub_box2 .upload_c .webuploader-pick').addClass('cancel').text(i18n.t('global.Cancel'));
                                },
                                fnCancel: function(uploader, file) {
                                        $('#mod_pub_box2 .upload_c .webuploader-pick').on('click',
                                        function(event) {
                                                // 取消上传
                                                if (mod_pub_formData.case_path) {
                                                        $('#mod_pub_box2 .box_c').removeClass('active').addClass('success');
                                                        $('#mod_pub_box2 .box_c .msg').text(mod_pub_formData.name + '.zip');
                                                } else {
                                                        $('#mod_pub_box2 .box_c').removeClass('active');
                                                        $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.CaseNotFound'));
                                                }
                                                $('#mod_pub_box2 .upload_c .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                                uploader.cancelFile(file);
                                                event.preventDefault();
                                        });
                                },
                                formData: {
                                        upload_type: 'zip'
                                },
                                regText: ['zip']
                        });
                        // 点击更新，上传版本note部分
                        if ($('#mod_pub_modal').hasClass('for-update-note')) {
                                uploadAll({
                                        picker: $('#mod_pub_box2 .upload_n'),
                                        fnCb: function(fileUrl, file) {
                                                $('#mod_pub_box2 .box_n').addClass('success').removeClass('active').removeClass('error');
                                                $('#mod_pub_box2 .upload_n .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                                var fileName = file.name.split('.txt')[0];
                                                $('#mod_pub_box2 .box_n .msg').text(i18n.t('moduleStore.noteProvided'));
                                                mod_pub_formData.note_path = fileUrl;
                                                $('#mod_pub_upload_text_n').val(fileName);
                                        },
                                        fnError: function() {
                                                $('#mod_pub_box2 .box_n').removeClass('active').addClass('error');
                                                $('#mod_pub_box2 .box_n .msg').text(i18n.t('moduleStore.uploadFailed'));
                                                $('#mod_pub_box2 .upload_n .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                        },
                                        fnProgress: function(per) {
                                                $('#mod_pub_box2 .box_n').removeClass('success').addClass('active').removeClass('error');
                                                $('#mod_pub_box2 .box_n .msg').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                                $('#mod_pub_box2 .upload_n .webuploader-pick').addClass('cancel').text(i18n.t('global.Cancel'));
                                        },
                                        fnCancel: function(uploader, file) {
                                                $('#mod_pub_box2 .upload_n .webuploader-pick').on('click',
                                                function(event) {
                                                        // 取消上传
                                                        if (mod_pub_formData.note_path) {
                                                                $('#mod_pub_box2 .box_n').removeClass('active').addClass('success');
                                                                $('#mod_pub_box2 .box_n .msg').text(mod_pub_formData.name + '.txt');
                                                        } else {
                                                                $('#mod_pub_box2 .box_n').removeClass('active');
                                                                $('#mod_pub_box2 .box_n .msg').text(i18n.t('moduleStore.noteNotFound'));
                                                        }
                                                        $('#mod_pub_box2 .upload_n .webuploader-pick').removeClass('cancel').text(i18n.t('moduleStore.upload'));
                                                        uploader.cancelFile(file);
                                                        event.preventDefault();
                                                });
                                        },
                                        formData: {
                                                upload_type: 'txt'
                                        },
                                        regText: ['txt']
                                });
                        }
                        if (mod_pub_formData.case_path) {
                                $('#mod_pub_upload_text_c').val(mod_pub_formData.case_path);
                        } else {
                                $('#mod_pub_upload_text_c').val('');
                        }
                        if (mod_pub_formData.word_path) {
                                $('#mod_pub_upload_text_f').val(mod_pub_formData.word_path);
                        } else {
                                $('#mod_pub_upload_text_f').val('');
                        }
                        if (mod_pub_formData.note_path) {
                                $('#mod_pub_upload_text_n').val(mod_pub_formData.note_path);
                        } else {
                                $('#mod_pub_upload_text_n').val('');
                        }
                        $.validator.addMethod('update_required',
                        function(value, element, param) {
                                var result = true;
                                if ($('#mod_pub_modal').hasClass('for-update-note')) {
                                        if (value == '') {
                                                result = false;
                                        }
                                }
                                return result;
                        },
                        i18n.t('moduleStore.pleaseUploadNote'));
                        $('#mod_pub_box2').validate({
                                errorPlacement: function(error, element) {
                                        if (element.attr("name") === "mod_pub_upload_text_i" || element.attr("name") === "mod_pub_upload_text_a") {
                                                $('#mod_pub_upload_text_error1').html(error);
                                        } else if (element.attr("name") === "mod_pub_upload_text_f") {
                                                $('#mod_pub_upload_text_error2').html(error);
                                        } else if (element.attr("name") === "mod_pub_upload_text_c") {
                                                $('#mod_pub_upload_text_error3').html(error);
                                        } else if (element.attr("name") === "mod_pub_upload_text_n") {
                                                $('#mod_pub_upload_text_error4').html(error);
                                        } else {
                                                element.after(error);
                                        }
                                },
                                ignore: '',
                                rules: {
                                        mod_pub_upload_text_i: {
                                                validPkgName: true,
                                                validPkg: true
                                        },
                                        mod_pub_upload_text_a: {
                                                validPkgName: true,
                                                validPkg: true
                                        },
                                        mod_pub_upload_text_f: {
                                                required: true
                                        },
                                        mod_pub_upload_text_c: {
                                                required: true
                                        },
                                        mod_pub_upload_text_n: {
                                                update_required: true
                                        }
                                },
                                messages: {
                                        mod_pub_upload_text_f: {
                                                required: i18n.t('moduleStore.pleaseUploadGuideDoc')
                                        },
                                        mod_pub_upload_text_c: {
                                                required: i18n.t('moduleStore.pleaseUploadCase')
                                        },
                                        mod_pub_upload_text_n: {
                                                update_required: i18n.t('moduleStore.pleaseUploadNote')
                                        }
                                },
                                highlight: function(element, errorClass) {},
                                unhighlight: function(element, errorClass) {},
                                submitHandler: function(form) {
                                        // 跳转至第三个表单
                                        // console.log(mod_pub_formData);
                                        resetPubForm(3);
                                }

                        });

                        fnEnd && fnEnd();
                        $('#mod_pub_modal .btn_next').removeAttr('disabled');
                };
                // 初始化表单3
                // 添加或者更新或重提模块
                var addOrUpdate = function(index) {
                        var api = '';
                        var str = '';
                        if (index == 0) {
                                api = '/addMdStore';
                                str = i18n.t('moduleStore.addMod');
                        } else if (index == 1) {
                                api = '/updateMdStore';
                                str = i18n.t('moduleStore.updateMod');
                        } else {
                                // api = '/updateMdStore';
                                // str = '重新提交';
                        }
                        $.ajax({
                                url: api,
                                type: 'POST',
                                dataType: 'json',
                                data: mod_pub_formData
                        }).done(function(data) {
                                if (data && data.status) {
                                        utils.alertMessage(1, str + i18n.t('moduleStore.succ'));
                                        $('#mod_pub_modal').modal('hide');
                                        setTimeout(function() {
                                                window.location.reload();
                                        },
                                        2000);
                                } else {
                                        alert(data.msg);
                                        // utils.alertMessage(0,data.msg);
                                }
                        }).fail(function() {}).always(function() {});

                }

                var form3upload1 = false,
                form3upload2 = false,
                form3upload3 = false,
                form3upload4 = false;
                var initPubform3 = function(fnEnd) {
                        $('#mod_pub_modal .btn_next').attr('disabled', 'disabled');
                        pubForm3 = true;
                        $('#mod_pub_box3 .mod_pub_name').text(mod_pub_formData.name);
                        if (mod_pub_formData.isfree) {
                                $('#mod_pub_box3 .price').addClass('free').text(i18n.t('moduleStore.free'));
                        } else {
                                $('#mod_pub_box3 .price').removeClass('free').text('￥' + mod_pub_formData.price);
                        }
                        if (mod_pub_formData.use_times) {
                                $('#mod_pub_box3 .module-hot-count').text(mod_pub_formData.use_times);
                        } else {
                                $('#mod_pub_box3 .module-hot-count').text('0');
                        }
                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading .module_history_del').on('click',
                        function(event) {
                                if (confirm(i18n.t('moduleStore.sureToDel'))) {
                                        mod_pub_formData.icon_path = '';
                                        $('.mod_pub_cover_text').val('');
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading .img').attr('src', '/img/module_default.jpg');
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').fadeIn();
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').get(0).style.display = 'none';
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        bindUpload();
                                } else {

}
                                event.preventDefault();
                        });
                        var bindUpload = function() {
                                if (form3upload1) {} else {
                                        form3upload1 = true;
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').fadeIn();
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').get(0).style.display = 'none';
                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        // loading跟loaded写反了，就不改了
                                        uploadAll({
                                                picker: $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal .text-green'),
                                                fnCb: function(fileUrl, file) {
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .progress-bar').css('width', 0);
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                        mod_pub_formData.icon_path = fileUrl;
                                                        $('#mod_pub_box3 .mod_pub_cover_text').val(fileUrl);
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading .img').attr('src', fileUrl);
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').fadeIn();
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                },
                                                fnError: function() {
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').fadeIn();
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                },
                                                fnProgress: function(per) {
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'block';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .progress-bar').css('width', per);
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .uploaded').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                                },
                                                fnCancel: function(uploader, file) {
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .progress_btn_cancel').on('click',
                                                        function(event) {
                                                                // 取消上传
                                                                $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').fadeIn();
                                                                $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .progress-bar').css('width', 0);
                                                                $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                uploader.cancelFile(file);
                                                                event.preventDefault();
                                                        });
                                                },
                                                formData: {
                                                        upload_type: 'icon_path'
                                                },
                                                regText: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
                                        });
                                }
                        };
                        if (fnEnd) {

} else {
                                bindUpload();
                        }

                        $('#mod_pub_box3 .icon_path1 .module_history_del').on('click',
                        function(event) {
                                if (confirm(i18n.t('moduleStore.sureToDel'))) {
                                        mod_pub_formData.icon1_path = '';
                                        $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loading .prev_page').attr('src', '/img/module_default.jpg');
                                        $('#mod_pub_box3 .icon_path1 .mod_pub_prev').fadeIn();
                                        $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                        $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        if (option.isHistory) {
                                                uploadExtra(0);
                                        }

                                } else {

}
                                event.preventDefault();
                        });
                        $('#mod_pub_box3 .icon_path2 .module_history_del').on('click',
                        function(event) {
                                if (confirm(i18n.t('moduleStore.sureToDel'))) {
                                        mod_pub_formData.icon2_path = '';
                                        $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loading .prev_page').attr('src', '/img/module_default.jpg');
                                        $('#mod_pub_box3 .icon_path2 .mod_pub_prev').fadeIn();
                                        $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                        $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        if (option.isHistory) {
                                                uploadExtra(1);
                                        }

                                } else {

}
                                event.preventDefault();
                        });
                        $('#mod_pub_box3 .icon_path3 .module_history_del').on('click',
                        function(event) {
                                if (confirm(i18n.t('moduleStore.sureToDel'))) {
                                        mod_pub_formData.icon3_path = '';
                                        $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loading .prev_page').attr('src', '/img/module_default.jpg');
                                        $('#mod_pub_box3 .icon_path3 .mod_pub_prev').fadeIn();
                                        $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                        $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        if (option.isHistory) {
                                                uploadExtra(2);
                                        }

                                } else {

}
                                event.preventDefault();
                        });
                        var uploadExtra = function(index) {

                                switch (index) {
                                case 0:
                                        if (form3upload2 || mod_pub_formData.icon1_path) {

} else {
                                                form3upload2 = true;
                                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                // loading跟loaded写反了，就不改了
                                                uploadAll({
                                                        picker: $('#mod_pub_box3 .icon_path1 .text-green'),
                                                        fnCb: function(fileUrl, file) {
                                                                $('#mod_pub_box3 .icon_path1 .progress-bar').css('width', 0);
                                                                $('#mod_pub_box3 .icon_path1 .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                mod_pub_formData.icon1_path = fileUrl;
                                                                $('#mod_pub_box3 .icon_path1 .prev_page').attr('src', fileUrl);
                                                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'none';
                                                                // $('#mod_pub_box3 .icon_path1 .prev_box').fadeIn();
                                                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'table-cell';
                                                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        },
                                                        fnError: function() {
                                                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').fadeIn();
                                                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        },
                                                        fnProgress: function(per) {
                                                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'block';
                                                                $('#mod_pub_box3 .icon_path1 .progress-bar').css('width', per);
                                                                $('#mod_pub_box3 .icon_path1 .uploaded').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                                        },
                                                        fnCancel: function(uploader, file) {
                                                                $('#mod_pub_box3 .icon_path1 .progress_btn_cancel').on('click',
                                                                function(event) {
                                                                        // 取消上传
                                                                        $('#mod_pub_box3 .icon_path1 .mod_pub_prev').fadeIn();
                                                                        $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                                                        $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                                        $('#mod_pub_box3 .icon_path1 .progress-bar').css('width', 0);
                                                                        $('#mod_pub_box3 .icon_path1 .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                        uploader.cancelFile(file);
                                                                        event.preventDefault();
                                                                });
                                                        },
                                                        formData: {
                                                                upload_type: 'icon_path_extra'
                                                        },
                                                        regText: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
                                                });
                                        }
                                        if (mod_pub_formData.icon1_path) {
                                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'none';
                                                // $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'table-cell';
                                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        } else {
                                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        }
                                        break;
                                case 1:
                                        if (form3upload3 || mod_pub_formData.icon2_path) {

} else {
                                                form3upload3 = true;
                                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                // loading跟loaded写反了，就不改了
                                                uploadAll({
                                                        picker: $('#mod_pub_box3 .icon_path2 .text-green'),
                                                        fnCb: function(fileUrl, file) {
                                                                $('#mod_pub_box3 .icon_path2 .progress-bar').css('width', 0);
                                                                $('#mod_pub_box3 .icon_path2 .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                mod_pub_formData.icon2_path = fileUrl;
                                                                $('#mod_pub_box3 .icon_path2 .prev_page').attr('src', fileUrl);
                                                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'none';
                                                                // $('#mod_pub_box3 .icon_path2 .prev_box').fadeIn();
                                                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'table-cell';
                                                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        },
                                                        fnError: function() {
                                                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').fadeIn();
                                                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        },
                                                        fnProgress: function(per) {
                                                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'block';
                                                                $('#mod_pub_box3 .icon_path2 .progress-bar').css('width', per);
                                                                $('#mod_pub_box3 .icon_path2 .uploaded').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                                        },
                                                        fnCancel: function(uploader, file) {
                                                                $('#mod_pub_box3 .icon_path2 .progress_btn_cancel').on('click',
                                                                function(event) {
                                                                        // 取消上传
                                                                        $('#mod_pub_box3 .icon_path2 .mod_pub_prev').fadeIn();
                                                                        $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                                                        $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                                        $('#mod_pub_box3 .icon_path2 .progress-bar').css('width', 0);
                                                                        $('#mod_pub_box3 .icon_path2 .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                        uploader.cancelFile(file);
                                                                        event.preventDefault();
                                                                });
                                                        },
                                                        formData: {
                                                                upload_type: 'icon_path_extra'
                                                        },
                                                        regText: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
                                                });
                                        }
                                        if (mod_pub_formData.icon2_path) {
                                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'none';
                                                // $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'table-cell';
                                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        } else {
                                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        }
                                        break;
                                case 2:
                                        if (form3upload4 || mod_pub_formData.icon3_path) {

} else {
                                                form3upload4 = true;
                                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                // loading跟loaded写反了，就不改了
                                                uploadAll({
                                                        picker: $('#mod_pub_box3 .icon_path3 .text-green'),
                                                        fnCb: function(fileUrl, file) {
                                                                $('#mod_pub_box3 .icon_path3 .progress-bar').css('width', 0);
                                                                $('#mod_pub_box3 .icon_path3 .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                mod_pub_formData.icon3_path = fileUrl;
                                                                $('#mod_pub_box3 .icon_path3 .prev_page').attr('src', fileUrl);
                                                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'none';
                                                                // $('#mod_pub_box3 .icon_path3 .prev_box').fadeIn();
                                                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'table-cell';
                                                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        },

                                                        fnError: function() {
                                                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').fadeIn();
                                                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        },
                                                        fnProgress: function(per) {
                                                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'block';
                                                                $('#mod_pub_box3 .icon_path3 .progress-bar').css('width', per);
                                                                $('#mod_pub_box3 .icon_path3 .uploaded').text(i18n.t('moduleStore.uploaded') + parseInt(per) + '%');
                                                        },
                                                        fnCancel: function(uploader, file) {
                                                                $('#mod_pub_box3 .icon_path3 .progress_btn_cancel').on('click',
                                                                function(event) {
                                                                        // 取消上传
                                                                        $('#mod_pub_box3 .icon_path3 .mod_pub_prev').fadeIn();
                                                                        $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                                                        $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                                        $('#mod_pub_box3 .icon_path3 .progress-bar').css('width', 0);
                                                                        $('#mod_pub_box3 .icon_path3 .uploaded').text(i18n.t('moduleStore.uploaded') + '0%');
                                                                        uploader.cancelFile(file);
                                                                        event.preventDefault();
                                                                });
                                                        },
                                                        formData: {
                                                                upload_type: 'icon_path_extra'
                                                        },
                                                        regText: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
                                                });
                                        }
                                        if (mod_pub_formData.icon3_path) {
                                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'none';
                                                // $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'table-cell';
                                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        } else {
                                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'block';
                                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                        }
                                        break;
                                }
                        };

                        if (initPubBxSlider) {

} else {
                                uploadExtra(0);
                                var flipBxSlider = $('#mod_pub_modal .bxslider').bxSlider({
                                        preloadImages: 'visible',
                                        auto: false,
                                        infiniteLoop: false,
                                        // startSlide: 0,
                                        onSlideAfter: function($slideElement, oldIndex, newIndex) {
                                                // 当轮播图播放到当前页，调用webuploader
                                                uploadExtra(newIndex);
                                        }
                                });
                                $('#mod_pub_modal .bx-pager-link').eq(0).addClass('active');
                                $('#mod_pub_modal').on('click', '.bx-prev',
                                function(event) {
                                        var current = flipBxSlider.getCurrentSlide();
                                        if (current == 0) {
                                                flipBxSlider.goToSlide(2);
                                        } else {}
                                        event.preventDefault();
                                });
                                $('#mod_pub_modal').on('click', '.bx-next',
                                function(event) {
                                        var current = flipBxSlider.getCurrentSlide();
                                        if (current == 2) {
                                                flipBxSlider.goToSlide(0);
                                        } else {}
                                        event.preventDefault();
                                });
                                initPubBxSlider = true;
                        }
                        $('#mod_pub_box3').validate({
                                errorPlacement: function(error, element) {
                                        if (element.attr("name") === "mod_pub_cover_text") {
                                                $('#mod_pub_cover_error').html(error);
                                        } else {
                                                element.after(error);
                                        }
                                },
                                ignore: '',
                                rules: {
                                        mod_pub_cover_text: {
                                                required: true
                                        }
                                },
                                messages: {
                                        mod_pub_cover_text: {
                                                required: i18n.t('moduleStore.pleaseUploadCoverPic')
                                        }
                                },
                                highlight: function(element, errorClass) {},
                                unhighlight: function(element, errorClass) {},
                                submitHandler: function(form) {
                                        // console.log(mod_pub_formData);
                                        // 调用添加或者编辑模块接口，用formDate
                                        if (pubOrEdit) {
                                                addOrUpdate(0);
                                        } else {
                                                addOrUpdate(1);
                                        }
                                        return false;
                                }

                        });

                        fnEnd && fnEnd();
                        $('#mod_pub_modal .btn_next').removeAttr('disabled');
                };

                var resetPubForm = function(index, back) {
                        // $('#mod_pub_modal .btn_next').attr('disabled', 'disabled');
                        switch (index) {
                        case 1:
                                $('#mod_pub_modal .btn_prev').addClass('hide');
                                $('#mod_pub_modal .btn_next').text(i18n.t('moduleStore.continue'));
                                $('#mod_pub_modal .step_1').removeClass('pass').addClass('active');
                                $('#mod_pub_modal .step_2').removeClass('pass').removeClass('active').addClass('todo');
                                $('#mod_pub_modal .step_3').removeClass('pass').removeClass('active').addClass('todo');
                                $('#mod_pub_box1').fadeIn('0',
                                function() {});
                                $('#mod_pub_box2').get(0).style.display = "none";
                                $('#mod_pub_box3').get(0).style.display = "none";
                                if (option.isHistory) {
                                        $('#mod_pub_box1 .mod_pub_price_label').iCheck('enable');
                                }

                                $('#mod_pub_box1 label.error').remove();
                                if (pubForm1) {
                                        if (back) {} else {
                                                if (pubOrEdit) {
                                                        $('#mod_pub_box1 .mod_pub_name_group .mod_pub_name').val('');
                                                        $('#mod_pub_box1 .mod_pub_brief_group .mod_pub_brief').val('');
                                                        $('.version_num').val('');
                                                        $('#mod_pub_box1 .mod_pub_price').val('');
                                                        $('#mod_pub_box1 .mod_pub_name_group .word-limit em').text('0');
                                                        $('#mod_pub_box1 .mod_pub_brief_group .word-limit em').text('0');
                                                } else {
                                                        if (option.isHistory) {
                                                                setPubForm1();
                                                        }

                                                }
                                        }
                                } else {
                                        if (pubOrEdit) {
                                                initPubform1();
                                        } else {
                                                if (option.isHistory) {
                                                        initPubform1(setPubForm1);
                                                }

                                        }
                                }
                                break;
                        case 2:
                                $('#mod_pub_modal .btn_prev').removeClass('hide');
                                $('#mod_pub_modal .btn_next').text(i18n.t('moduleStore.continue'));
                                $('#mod_pub_modal .step_1').removeClass('active').addClass('pass');
                                $('#mod_pub_modal .step_2').removeClass('pass').removeClass('todo').addClass('active');
                                $('#mod_pub_modal .step_3').removeClass('pass').removeClass('active').addClass('todo');
                                $('#mod_pub_box1').get(0).style.display = "none";
                                $('#mod_pub_box2').fadeIn('0',
                                function() {});
                                $('#mod_pub_box3').get(0).style.display = "none";
                                $('#mod_pub_box2 label.error').remove();
                                if (pubForm2) {
                                        if (back) {

} else {
                                                if (pubOrEdit) {
                                                        if (mod_pub_formData.android_path) {

} else {
                                                                $('#mod_pub_box2 .box_a').removeClass('success').removeClass('active').removeClass('error');
                                                                $('#mod_pub_box2 .box_a .msg').text(i18n.t('moduleStore.androidModuleNotUploaded'));
                                                                mod_pub_formData.android_path = '';
                                                                mod_pub_formData.android_size = '';
                                                                $('#mod_pub_box2 #mod_pub_upload_text_a').val('');
                                                        }
                                                        if (mod_pub_formData.ios_path) {

} else {
                                                                $('#mod_pub_box2 .box_i').removeClass('success').removeClass('active').removeClass('error');
                                                                $('#mod_pub_box2 .box_i .msg').text(i18n.t('moduleStore.iosModuleNotUploaded'));
                                                                mod_pub_formData.ios_path = '';
                                                                mod_pub_formData.ios_size = '';
                                                                $('#mod_pub_box2 #mod_pub_upload_text_i').val('');
                                                        }
                                                        if (mod_pub_formData.word_path) {

} else {
                                                                $('#mod_pub_box2 .box_f').removeClass('success').removeClass('active').removeClass('error');
                                                                $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.moduleDocNotProvided'));
                                                                mod_pub_formData.word_path = '';
                                                                $('#mod_pub_box2 #mod_pub_upload_text_f').val('');
                                                        }
                                                        if (mod_pub_formData.case_path) {

} else {
                                                                $('#mod_pub_box2 .box_c').removeClass('success').removeClass('active').removeClass('error');
                                                                $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.CaseNotFound'));
                                                                mod_pub_formData.case_path = '';
                                                                $('#mod_pub_box2 #mod_pub_upload_text_c').val('');
                                                        }
                                                        $('#mod_pub_box2 .webuploader-pick').text(i18n.t('moduleStore.upload'));
                                                        $('#mod_pub_box2 label.error').remove();
                                                } else {
                                                        if (option.isHistory) {
                                                                setPubForm2();
                                                        }

                                                }
                                        }
                                } else {
                                        if (pubOrEdit) {
                                                initPubform2();
                                        } else {
                                                if (option.isHistory) {
                                                        initPubform2(setPubForm2);
                                                }

                                        }
                                }

                                break;
                        case 3:
                                $('#mod_pub_modal .btn_prev').removeClass('hide');
                                $('#mod_pub_modal .btn_next').text(i18n.t('moduleStore.submit'));
                                $('#mod_pub_modal .step_1').removeClass('active').addClass('pass');
                                $('#mod_pub_modal .step_2').removeClass('active').removeClass('todo').addClass('pass');
                                $('#mod_pub_modal .step_3').removeClass('pass').removeClass('todo').addClass('active');
                                $('#mod_pub_box1').get(0).style.display = "none";
                                $('#mod_pub_box2').get(0).style.display = "none";
                                $('#mod_pub_box3').fadeIn('0',
                                function() {});
                                if (pubForm3) {
                                        if (pubOrEdit) {
                                                if (mod_pub_formData.icon_path) {

} else {
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading .img').attr('src', '/img/module_default.jpg');
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_normal').get(0).style.display = 'block';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loading').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .mod_pub_cover_box .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .mod_pub_cover_text').val('');
                                                }
                                                if (mod_pub_formData.icon1_path) {

} else {
                                                        $('#mod_pub_box3 .icon_path1 .prev_page').attr('src', '');
                                                        $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'block';
                                                        $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                }
                                                if (mod_pub_formData.icon2_path) {

} else {
                                                        $('#mod_pub_box3 .icon_path2 .prev_page').attr('src', '');
                                                        $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'block';
                                                        $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                }
                                                if (mod_pub_formData.icon3_path) {

} else {
                                                        $('#mod_pub_box3 .icon_path3 .prev_page').attr('src', '');
                                                        $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'block';
                                                        $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                                        $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                                                }
                                                $('#mod_pub_box3 label.error').remove();
                                                $('#mod_pub_box3 .mod_pub_name').text(mod_pub_formData.name);
                                                if (mod_pub_formData.isfree) {
                                                        $('#mod_pub_box3 .price').addClass('free').text(i18n.t('moduleStore.free'));
                                                } else {
                                                        $('#mod_pub_box3 .price').removeClass('free').text('￥' + mod_pub_formData.price);
                                                }
                                                if (mod_pub_formData.use_times) {
                                                        $('#mod_pub_box3 .module-hot-count').text(mod_pub_formData.use_times);
                                                } else {
                                                        $('#mod_pub_box3 .module-hot-count').text('0');
                                                }
                                        } else {
                                                if (option.isHistory) {
                                                        setPubForm3();
                                                }
                                        }
                                } else {
                                        if (pubOrEdit) {
                                                initPubform3();
                                        } else {
                                                if (option.isHistory) {
                                                        initPubform3(setPubForm3);
                                                }
                                        }
                                }
                                break;
                        }
                };
                $('#mod_pub_modal').on('hidden.bs.modal',
                function(event) {
                        $('#mod_pub_modal').removeClass('for-update-note');
                });
                $('#mod_pub_modal').on('show.bs.modal',
                function(event) {
                        if (pubOrEdit) {
                                mod_pub_formData = {};
                        } else {

}
                        resetPubForm(1);
                });
                $('#mod_pub_modal .btn_next').on('click',
                function(event) {
                        var $this = $(this);

                        if ($this.attr('disabled') == "disabled") {

} else {
                                var index = $('#mod_pub_modal .modal-title').find('.active').attr('data-index');
                                if (index == 1) {
                                        $('#mod_pub_box1').submit();
                                } else if (index == 2) {
                                        $('#mod_pub_box2').submit();
                                } else {
                                        $('#mod_pub_box3').submit();
                                }
                        }
                        event.preventDefault();
                });
                $('#mod_pub_modal .btn_prev').on('click',
                function(event) {
                        var index = $('#mod_pub_modal .modal-title').find('.active').attr('data-index');
                        if (index == 1) {} else if (index == 2) {
                                resetPubForm(1, true);
                        } else {
                                resetPubForm(2, true);
                        }
                        event.preventDefault();
                });
                $('#mod_pub_modal').on('click', '.step_1.pass',
                function(event) {
                        resetPubForm(1, true);
                        event.preventDefault();
                });
                $('#mod_pub_modal').on('click', '.step_2.pass',
                function(event) {
                        resetPubForm(2, true);
                        event.preventDefault();
                });
                // 编辑表单 赋值阶段 start
                var setPubForm1 = function() {
                        var ver;
                        $('#mod_pub_box1 .mod_pub_name_group .mod_pub_name').val(mod_pub_formData.name).trigger('propertychange').trigger('input');
                        $('#mod_pub_box1 .mod_pub_brief_group .mod_pub_brief').val(mod_pub_formData.info).trigger('propertychange').trigger('input');
                        ver = mod_pub_formData.ver.split('.');
                        $('#mod_pub_box1 .version_num').each(function(index, el) {
                                var v = ver[index];
                                $(el).val(v);
                        });
                        $('#mod_pub_class1').val(mod_pub_formData.type);
                        setTimeout(function() {
                                if (mod_pub_formData.subclass) {
                                        $('#mod_pub_class2').val(mod_pub_formData.subclass);
                                } else {}
                        }, 300) 
						if (mod_pub_formData.isfree) {
                                $('#mod_pub_box1 .mod_pub_price_label').eq(0).trigger('click');
                                $('#mod_pub_box1 .mod_pub_price').val('');
                        } else {
                                $('#mod_pub_box1 .mod_pub_price_label').eq(1).trigger('click');
                                $('#mod_pub_box1 .mod_pub_price').val(mod_pub_formData.price);
                        }
                        // setTimeout(function(){
                        //     $('#mod_pub_box1 .mod_pub_price_label').iCheck('disable');
                        // },300);  
                };
                var setPubForm2 = function() {
                        // mod_pub_formData
                        if (mod_pub_formData.ios_path) {
                                $('#mod_pub_box2 .box_i').addClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_i .msg').text(mod_pub_formData.name + '.zip');
                                $('#mod_pub_box2 #mod_pub_upload_text_i').val(mod_pub_formData.name);
                        } else {
                                $('#mod_pub_box2 .box_i').removeClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_i .msg').text(i18n.t('moduleStore.iosModuleNotUploaded'));
                                $('#mod_pub_box2 #mod_pub_upload_text_i').val('');
                        }
                        if (mod_pub_formData.android_path) {
                                $('#mod_pub_box2 .box_a').addClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_a .msg').text(mod_pub_formData.name + '.zip');
                                $('#mod_pub_box2 #mod_pub_upload_text_i').val(mod_pub_formData.name);
                        } else {
                                $('#mod_pub_box2 .box_a').removeClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_a .msg').text(i18n.t('moduleStore.androidModuleNotUploaded'));
                                $('#mod_pub_box2 #mod_pub_upload_text_a').val('');
                        }

                        if (mod_pub_formData.word_path) {
                                $('#mod_pub_box2 .box_f').addClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.moduleDocProvided'));
                                $('#mod_pub_upload_text_f').val(mod_pub_formData.word_path);
                        } else {
                                $('#mod_pub_box2 .box_f').removeClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_f .msg').text(i18n.t('moduleStore.moduleDocNotProvided'));
                                $('#mod_pub_upload_text_f').val('');
                        }

                        if (mod_pub_formData.note_path) {
                                $('#mod_pub_box2 .box_n').addClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_n .msg').text(i18n.t('moduleStore.noteProvided'));
                                $('#mod_pub_upload_text_n').val(mod_pub_formData.note_path);
                        } else {
                                $('#mod_pub_box2 .box_n').removeClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_n .msg').text(i18n.t('moduleStore.noteNotFound'));
                                $('#mod_pub_upload_text_n').val('');
                        }

                        if (mod_pub_formData.case_path) {
                                $('#mod_pub_box2 .box_c').addClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.CaseProvided'));
                                $('#mod_pub_upload_text_c').val(mod_pub_formData.case_path);
                        } else {
                                $('#mod_pub_box2 .box_c').removeClass('success').removeClass('active').removeClass('error');
                                $('#mod_pub_box2 .box_c .msg').text(i18n.t('moduleStore.CaseNotFound'));
                                $('#mod_pub_upload_text_c').val('');
                        }
                };
                var setPubForm3 = function() {

                        $('#mod_pub_box3 .mod_pub_cover_normal').hide();
                        $('#mod_pub_box3 .mod_pub_cover_loaded').hide();
                        $('#mod_pub_box3 .mod_pub_cover_loading').show();
                        $('#mod_pub_box3 .mod_pub_cover_loading .img').attr('src', mod_pub_formData.icon_path);
                        $('#mod_pub_box3 .mod_pub_cover_text').val(mod_pub_formData.icon_path);
                        if (mod_pub_formData.icon1_path) {
                                $('#mod_pub_box3 .icon_path1 .prev_page').attr('src', mod_pub_formData.icon1_path);
                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'none';
                                // $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'block';
                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'table-cell';
                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                        } else {
                                $('#mod_pub_box3 .icon_path1 .mod_pub_prev').get(0).style.display = 'block';
                                $('#mod_pub_box3 .icon_path1 .prev_box').get(0).style.display = 'none';
                                $('#mod_pub_box3 .icon_path1 .mod_pub_cover_loaded').get(0).style.display = 'none';
                        }
                        if (mod_pub_formData.icon2_path) {
                                $('#mod_pub_box3 .icon_path2 .prev_page').attr('src', mod_pub_formData.icon2_path);
                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'none';
                                // $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'block';
                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'table-cell';
                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                        } else {
                                $('#mod_pub_box3 .icon_path2 .mod_pub_prev').get(0).style.display = 'block';
                                $('#mod_pub_box3 .icon_path2 .prev_box').get(0).style.display = 'none';
                                $('#mod_pub_box3 .icon_path2 .mod_pub_cover_loaded').get(0).style.display = 'none';
                        }
                        if (mod_pub_formData.icon3_path) {
                                $('#mod_pub_box3 .icon_path3 .prev_page').attr('src', mod_pub_formData.icon3_path);
                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'none';
                                // $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'block';
                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'table-cell';
                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                        } else {
                                $('#mod_pub_box3 .icon_path3 .mod_pub_prev').get(0).style.display = 'block';
                                $('#mod_pub_box3 .icon_path3 .prev_box').get(0).style.display = 'none';
                                $('#mod_pub_box3 .icon_path3 .mod_pub_cover_loaded').get(0).style.display = 'none';
                        }
                        $('#mod_pub_box3 .mod_pub_name').text(mod_pub_formData.name);
                        if (mod_pub_formData.isfree) {
                                $('#mod_pub_box3 .price').addClass('free').text(i18n.t('moduleStore.free'));
                        } else {
                                $('#mod_pub_box3 .price').removeClass('free').text('￥' + mod_pub_formData.price);
                        }
                        if (mod_pub_formData.use_times) {
                                $('#mod_pub_box3 .module-hot-count').text(mod_pub_formData.use_times);
                        } else {
                                $('#mod_pub_box3 .module-hot-count').text('0');
                        }
                };
                // 编辑表单 赋值阶段 end
                // 重发，删除，更新等操作 start
                // edit re_pub del
                $('#module_history_list_box').on('click', '.edit_list li',
                function(event) {
                        var $this = $(this);
                        var type = $this.get(0).className;
                        var mdId = $this.parents('.module_history_container').attr('editid');
                        // console.log(type,mdId);
                        if (type == 'edit' || type == 're_pub') {
                                $.ajax({
                                        url: '/getMdStore',
                                        type: 'GET',
                                        dataType: 'json',
                                        data: {
                                                id: mdId
                                        },
                                        cache: false
                                }).done(function(data) {
                                        if (data && data.status) {
                                                mod_pub_formData = data.body[0];
                                                pubOrEdit = false;
                                                $('#mod_pub_box1 .mod_pub_name').attr('disabled', 'disabled');
                                                $('#mod_pub_box1 .mod_pub_name_group .word-limit').hide();
                                                if (type == 'edit') {
                                                        $('#mod_pub_modal').addClass('for-update-note');
                                                }
                                                $('#mod_pub_modal').modal({
                                                        backdrop: 'static',
                                                        show: true
                                                });
                                        } else {
                                                util.alertMessage(0, data.msg);
                                        }
                                }).fail(function() {}).always(function() {});
                        }
                        if (type == 'del') {
                                if (confirm(i18n.t('moduleStore.sureToDel'))) {
                                        $.ajax({
                                                url: '/delMdStore',
                                                type: 'GET',
                                                dataType: 'json',
                                                data: {
                                                        id: mdId
                                                },
                                                cache: false
                                        }).done(function(data) {
                                                if (data && data.status) {
                                                        util.alertMessage(1, i18n.t('moduleStore.delete') + i18n.t('moduleStore.succ'));
                                                        setTimeout(function() {
                                                                window.location.reload();
                                                        },
                                                        2000);
                                                } else {
                                                        util.alertMessage(0, data.msg);
                                                }
                                        }).fail(function() {}).always(function() {});
                                } else {}
                        }
                        event.preventDefault();
                });
                // 重发，删除，更新等操作 end
        };
        // 发布模块，编辑模块部分 end
        module.exports = {
                moduleStoreDetail: moduleStoreDetail,
                moduleStoreCommon: moduleStoreCommon,
                moduleStorePub: moduleStorePub
        };
});