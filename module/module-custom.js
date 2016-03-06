define(function(require, exports, module) {
        var $ = require('jquery');
        require('jqueryui');
        require('cookie');
        require('../libs/jquery/icheck.min');
        var Handlebars = require('Handlebars');
        var WebUploader = require('webuploader');
        var util = require('./utils.js');
        require('validate');
        require('../libs/jquery/jquery.bxslider.min');
        var errors = require("../assets/js/cadErrors");
        var module_util = require('./module_utils.js');
        exports.init = function() {
                var appid = $.cookie('curAppId');
                var startNum = 0;
                var i18nlng = $.cookie("i18next") == "en-US" ? "en": "";
                //是否滚动加载数据
                var reqLock = false;

                var $modulesOuterBox = $('#modules-outer-box');
                var $platformSearch = $('#pf-text');
                //请求模块数据
                var $modCon = $('.module-box');
                var $modTpl = $('#mod-template');

                var reqMod = function(opts) {
                        $(".butterbar").addClass("active").removeClass("hide");
                        opts = opts || {};
                        var pf = opts.platform || $platformSearch.find('option:selected').attr('data-rel');
                        var startNum = opts.startNum || 0;
                        var size = opts.size || 32;
                        var platform = pf || -1;
                        var type = opts.type || 0;
                        var reqUrl = '/mxplay/data/getModule.json?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=' + platform + '&type=' + type;
                        var success = opts.success;

                        $.get(reqUrl, function(data, textStatus, xhr) {
                                if (data && data.status) {
                                        var source = $modTpl.html();
                                        var template = Handlebars.compile(source);
                                        data.i18nlng = i18nlng;
                                        var htm = template(data);
                                        $modCon.html(htm);
                                        success && success(type);
                                }
                                $(".butterbar").removeClass("active").addClass("hide");
                        });
                };

                //添加模块
                $modCon.on('click', '.status-group.add', function() {
                        var $this = $(this);
                        var mdid = $this.attr('mdid');
                        var $con = $this.closest('.module-container');
                        var $mdName = $con.find('.module-name');
                        $.post('/bingModule', {
                                appId: appid,
                                mdId: mdid
                        },
                        function(data, textStatus, xhr) {
                                if (data && data.status) {
                                        $this.removeClass('active');
                                        $this.parent('.module-container-name-group').find('.status-group.added').addClass('active');
                                        $this.parent('.module-container-name-group').find('.status-group.add').removeClass('active');
                                }
                        });
                });

                var $addCustomModuleForm = $('#addCustomModule-form');

                //删除模块
                $modCon.on('click', '.btn-del', function() {
                        var $thisMod = $(this).closest('.module-container');
                        var mdid = $(this).attr('mdid');
                        if (confirm(i18n.t('cadModule.delConfirm'))) {
                                $.post('/mxplay/data/removeModule.json', {
                                        'mdId': mdid
                                },
                                function(data, textStatus, xhr) {
                                        if (data && data.status) {
                                                $thisMod.remove();
                                        }
                                });
                        }
                });

                // 详情页弹出框
                var detailModal = $('#detail-modal-module').dialog({
                        autoOpen: false,
                        width: 630,
                        modal: true,
                        resizable: false,
                        dialogClass: 'module-dialog',
                        close: function(event, ui) {
                                $('.title-div-modal').remove();
                        }
                });
                //拼接模态框的title
                var createTitle = function(data) {
                        data = data || {};
                        var mdName = data.mdName || '';
                        var mdVer = data.mdVer || '';
                        var mdInfo = data.mdInfo || '';
                        var mdPlatform = data.mdPlatform;

                        var titleBoxModal = document.createElement('div');
                        titleBoxModal.className = 'title-div-modal clearfix';

                        var platformHtm = '';
                        if (mdPlatform === '0') {
                                platformHtm = '<i class="module-icon icon-apple"></i>';
                        }
                        if (mdPlatform === '1') {
                                platformHtm = '<i class="module-icon icon-android"></i>';
                        }
                        if (mdPlatform === '2') {
                                platformHtm = '<i class="module-icon icon-apple"></i>' + '<i class="module-icon icon-android"></i>';
                        }
                        var str = '<div class="row clearfix">' + '<h4>' + mdName + '</h4>' + '<label class="verson-modal">' + mdVer + '</label>' + '</div>' + '<label class="describe-modal">' + mdInfo + '</label>' + platformHtm;

                        $(titleBoxModal).html(str);
                        return $(titleBoxModal);
                };
                $('#modules-outer-box').on('click', '.btn-detail', function(event) {
                        detailModal.dialog('open');

                        var $this = $(this);
                        var data = {
                                mdName: $this.attr('md-name') || '',
                                mdVer: $this.attr('md-ver') || '',
                                mdInfo: $this.attr('md-info') || '',
                                mdPlatform: $this.attr('md-platform') || ''
                        };
                        var $titleBoxModal = createTitle(data);
                        var desc = $this.attr('md-des');
                        $titleBoxModal.insertBefore('.ui-dialog-titlebar-close');
                        $('#detail-modal-module pre').html(desc);
                        event.preventDefault();
                });
                // 隐藏详情页
                //字数限制
                util.limitWord({
                        element: '#addModule-title',
                        maxLen: 30,
                        labelElement: '#mod-name'
                });
                util.limitWord({
                        element: '#addModule-summary',
                        maxLen: 30,
                        labelElement: '#mod-sum'
                });

                var $upModIos = $('#up-mod-ios');
                var $upModAnd = $('#up-mod-and');
                // var uploader;
                var ifUpload = false;
                var uploadMod = function(opts) {
                        // if (ifUpload) {
                        //     return;
                        // }
                        // ifUpload = true;
                        opts = opts || {};
                        var picker = opts.picker;
                        var codeUrl;
                        var callback = opts.callback;
                        var error = opts.error;

                        var $progress = $(picker).prev('.progress-bar');

                        var uploader = WebUploader.create({
                                pick: picker,
                                //触发上传元素
                                swf: '/libs/webuploader/Uploader.swf',
                                //垃圾IE用的flash
                                server: '/mxplay/upload/upload.php',
                                //服务器接口
                                formData: {
                                        upload_type: 'zip'
                                },
                                accept: {
                                        extensions: 'zip'
                                },
                                auto: true //选完文件后，是否自动上传
                        });

                        uploader.on('beforeFileQueued', function(file) {
                                var reg = /\.zip$/;
                                if (!reg.test(file.name.toLowerCase())) {
                                        util.alertMessage(0, i18n.t('cadCode.notice1'));
                                        return false;
                                } else {
                                        uploader.upload();
                                }
                        });
                        //进度条
                        uploader.on('uploadProgress', function(file, percentage) {
                                var per = percentage * 100 + '%';
                                $progress.css('width', per);
                        });
                        //文件上传成功
                        uploader.on('uploadSuccess', function(file, response) {
                                var res = response;
                                if (res && res.status) {
                                        $(picker).find('em').text(i18n.t('cadModule.upSucc'));
                                        codeUrl = res.result.path;
                                        callback && callback(codeUrl, file);
                                        uploader.removeFile(file);
                                }
                        });
                        //文件上传失败
                        uploader.on('uploadError', function(file) {
                                $progress.addClass('failed');
                                $(picker).find('em').text(i18n.t('cadCode.notice3'));

                                error && error(file);
                                // console.log('upload icon error');
                        });
                        //上传完成，不管成功失败
                        uploader.on('uploadComplete', function(file) {
                                uploader.removeFile(file);
                        });
                };

                //上传自定义模块
                var $addCustomBtn = $('#addCustomModule-toggle-btn');
                var $custFrm = $('#addCustomModule-form-form');
                var initMark = false;
                //模块地址
                var iosModUrl = '',
                andModUrl = '';
                //模块名称
                var iosModName = '',
                andModName = '';
                var $iosModName = $custFrm.find('[name="iosPkgName"]');
                var $andModName = $custFrm.find('[name="andPkgName"]');
                //模块大小
                var iosModSize = '0.00M',
                andModSize = '0.00M';

                //保存，取消
                var $modSaveBtn = $('#btn-module-save');
                var $modCancelBtn = $('#btn-module-cancel');

                //重置表单
                var resetFrm = function() {
                        var $frm = $('#addCustomModule-form-form');
                        var $mdName = $frm.find('[name="mdName"]');
                        $mdName.val('');
                        $mdName.trigger('input');
                        $mdInfo = $frm.find('[name="mdInfo"]');
                        $mdInfo.val('');
                        $mdInfo.trigger('input');
                        $frm.find('#addModule-detail').val('');
                        $frm.find('.verson-num').val('');
                        // if(uploader){
                        // uploader.reset();
                        $('#up-mod-ios em').text(i18n.t('cadModule.clickToUp'));
                        $('#up-mod-and em').text(i18n.t('cadModule.clickToUp'));
                        $('#uploadModule-i .progress-bar').css('width', '0px');
                        $('#uploadModule-a .progress-bar').css('width', '0px');
                        $iosModName.val('');
                        $andModName.val('');
                        iosModName = '';
                        andModName = '';
                        iosModUrl = '';
                        andModUrl = '';
                        iosModSize = '0.00M';
                        andModSize = '0.00M';
                        // }
                };
                //取消
                $modCancelBtn.on('click', function() {
                        $custFrm.removeClass('active');
                        $('#addCustomModule-toggle-btn').removeClass('active');
                        resetFrm();
                });
                //绑定上传组件
                $addCustomBtn.on('click', function() {
                        $custFrm.toggleClass('active');
                        $addCustomBtn.toggleClass('active');
                        if (!initMark) {
                                uploadMod({
                                        picker: '#up-mod-ios',
                                        callback: function(url, file) {
                                                var fileName = file.name.split('.zip')[0];
                                                iosModName = fileName;
                                                $iosModName.val(fileName);
                                                iosModUrl = url;
                                                var size = Math.round(file.size / 1024 / 1024 * 100) / 100;
                                                iosModSize = size + 'M';
                                        },
                                        error: function() {
                                                iosModName = '';
                                                $iosModName.val('');
                                                iosModUrl = '';
                                                iosModSize = '0.00M';
                                        }
                                });
                                uploadMod({
                                        picker: '#up-mod-and',
                                        callback: function(url, file) {
                                                var fileName = file.name.split('.zip')[0];
                                                andModName = fileName;
                                                $andModName.val(fileName);
                                                andModUrl = url;
                                                var size = Math.round(file.size / 1024 / 1024 * 100) / 100;
                                                andModSize = size + 'M';
                                        },
                                        error: function() {
                                                andModName = '';
                                                $andModName.val('');
                                                andModUrl = '';
                                                andModSize = '0.00M';
                                        }
                                });

                                initMark = true;
                        }

                        return false;
                });

                //上传表单验证
                $.validator.addMethod('validPkg', function(value, element, param) {
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
                $.validator.addMethod('validPkgName', function(value, element, param) {
                        var modName = $('#addModule-title').val();
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
                $.validator.addMethod('word', function(value, element, param) {
                        var reg = /[^a-zA-Z0-9_]/gi;
                        if (reg.test(value)) {
                                return false;
                        } else {
                                return true;
                        }
                },
                i18n.t('moduleStore.error1_1'));
                $addCustomModuleForm.validate({
                        ignore: "",
                        errorPlacement: function(error, element) {
                                if (element.attr("name") === "mdName") {
                                        $('#md-name-err').html(error);
                                }
                                if (element.attr("name") === "iosPkgName" || element.attr("name") === "andPkgName") {
                                        $('#pkg-err').html(error);
                                }
                                if (element.attr("name") === "addVer1" || element.attr("name") === "addVer2" || element.attr("name") === "addVer3") {
                                        $('#mod-ver-err').html(error);
                                }
                        },
                        rules: {
                                mdName: {
                                        required: true,
                                        word: true,
                                        validPkgName: true
                                },
                                iosPkgName: {
                                        validPkg: true
                                },
                                andPkgName: {
                                        validPkg: true
                                },
                                addVer1: {
                                        required: true,
                                        digits: true,
                                        range: [0, 99]
                                },
                                addVer2: {
                                        required: true,
                                        digits: true,
                                        range: [0, 99]
                                },
                                addVer3: {
                                        required: true,
                                        digits: true,
                                        range: [0, 99]
                                }
                        },
                        messages: {
                                mdName: {
                                        required: i18n.t('cadModule.notice2')
                                },
                                addVer1: {
                                        required: i18n.t('cadPackage.valid_ver_1'),
                                        range: i18n.t('cadPackage.valid_ver_2'),
                                        digits: i18n.t('error.A00010')
                                },
                                addVer2: {
                                        required: i18n.t('cadPackage.valid_ver_1'),
                                        range: i18n.t('cadPackage.valid_ver_2'),
                                        digits: i18n.t('error.A00010')
                                },
                                addVer3: {
                                        required: i18n.t('cadPackage.valid_ver_1'),
                                        range: i18n.t('cadPackage.valid_ver_2'),
                                        digits: i18n.t('error.A00010')
                                }
                        },
                        submitHandler: function(form) {

                                $modSaveBtn.attr('disabled', 'disabled');

                                var mdName = $('#addModule-title').val();
                                mdName = $.trim(mdName);
                                //自定义类
                                var mdType = 6;
                                var mdVer = '';
                                var verArr = [];
                                $addCustomModuleForm.find('.verson-group input').each(function(index, el) {
                                        var v = $(el).val();
                                        v = parseInt(v, 10);
                                        verArr.push(v);
                                });
                                mdVer = verArr.join('.');
                                if (mdVer == '0.0.0') {
                                        util.alertMessage(0, i18n.t('error.A00011'));
                                        $modSaveBtn.removeAttr('disabled');
                                        return;
                                }
                                var mdInfo = $('#addModule-summary').val();
                                mdInfo = $.trim(mdInfo);
                                var mdDescription = $('#addModule-detail').val();
                                mdDescription = $.trim(mdDescription);
                                var mdPlatform;
                                if (andModUrl) {
                                        mdPlatform = 1;
                                }
                                if (iosModUrl) {
                                        mdPlatform = 0;
                                }
                                if (andModUrl && iosModUrl) {
                                        mdPlatform = 2;
                                }
                                $.ajax({
                                        url: '/addModule',
                                        type: 'POST',
                                        abort: true,
                                        data: {
                                                'mdName': mdName,
                                                'mdType': mdType,
                                                'mdVer': mdVer,
                                                'mdApkSize': andModSize,
                                                'mdIpaSize': iosModSize,
                                                'mdInfo': mdInfo,
                                                'mdDescription': mdDescription,
                                                'mdApkUrl': andModUrl,
                                                'mdIpaUrl': iosModUrl,
                                                'mdPlatform': mdPlatform,
                                                'timepicker': new Date().getTime()
                                        },
                                        success: function(data) {
                                                if (data && data.status) {
                                                        reqMod({
                                                                type: 6
                                                        });
                                                        resetFrm();
                                                        $custFrm.removeClass('active');
                                                        util.alertMessage(1, i18n.t('cadModule.notice3'));
                                                } else {
                                                        alert(errors.cadTip[data.code])
                                                }
                                        },
                                        error: function(data) {
                                                // console.log(data);
                                        },
                                        complete: function() {
                                                $modSaveBtn.removeAttr('disabled');
                                        }
                                });

                                return false;
                        }
                });

                // 编辑自定义模块，弹出框
                var initEditBox = false;
                var $editCustomModuleForm = $('#editCustomModule-form');

                //模块地址
                var editIosModUrl = '',
                editAndModUrl = '';
                //模块名称
                var editIosModName = '',
                editAndModName = '';
                var $editIosModName = $editCustomModuleForm.find('[name="editIosPkgName"]');
                var $editAndModName = $editCustomModuleForm.find('[name="editAndPkgName"]');
                var editIosModSize = '0.00M';
                var editAndModSize = '0.00M';

                // 编辑自定义模块，弹出框
                var editMdid = ''; //编辑模块ID
                // 计算弹框左上坐标
                var getLeftAndTop = function(obj) {
                        var left = 0;
                        var top = 0;
                        while (!obj.hasClass('module-box')) {
                                left += obj.position().left;
                                top += obj.position().top;
                                obj = obj.offsetParent();
                        }
                        return {
                                left: left,
                                top: top
                        }
                }
                $modCon.on('click', '.status-group.edit', function(event) {
                        event.preventDefault();
                        var $this = $(this);
                        // console.log(getLeftAndTop($this));
                        var pos = getLeftAndTop($this);
                        $editCustomModuleForm.show().css({
                                'left': pos.left - 168,
                                'top': pos.top + 200
                        });

                        //读取模块信息
                        var $mod = $this.closest('.module-container');
                        var mdId = $this.attr('mdid');
                        editMdid = mdId;
                        var api = '/getModule/' + mdId;

                        var $mdName = $editCustomModuleForm.find('[name="mdName"]');
                        var $mdVer = $editCustomModuleForm.find('.verson-num');
                        var $mdInfo = $editCustomModuleForm.find('[name="mdInfo"]');
                        var $mdDescription = $editCustomModuleForm.find('#editModule-detail');

                        $.post(api, function(data) {
                                if (data && data.status) {
                                        var json = data.body;
                                        var mdName = json.mdName || '';
                                        var mdApkUrl = json.mdApkUrl || '';
                                        var mdIpaUrl = json.mdIpaUrl || '';
                                        var mdDescription = json.mdDescription || '';
                                        var mdInfo = json.mdInfo || '';
                                        var mdVer = json.mdVer || '';

                                        $mdName.val(mdName);
                                        $mdName.trigger('input');

                                        if (mdIpaUrl) {
                                                $editIosModName.val(mdName);
                                                editIosModName = mdName;
                                                editIosModUrl = mdIpaUrl;
                                                $('#uploadModule-i .progress-bar').css('width', '1000%');
                                                $('#uploadModule-i .webuploader-pick em').text(i18n.t('cadModule.upSucc'));
                                        } else {
                                                $('#uploadModule-i .progress-bar').css('width', '0%');
                                                $('#uploadModule-i .webuploader-pick em').text(i18n.t('cadModule.clickToUp'));
                                        }
                                        if (mdApkUrl) {
                                                $editAndModName.val(mdName);
                                                editAndModName = mdName;
                                                editAndModUrl = mdApkUrl;
                                                $('#uploadModule-a .progress-bar').css('width', '100%');
                                                $('#uploadModule-a .webuploader-pick em').text(i18n.t('cadModule.upSucc'));
                                        } else {
                                                $('#uploadModule-a .progress-bar').css('width', '0%');
                                                $('#uploadModule-a .webuploader-pick em').text(i18n.t('cadModule.clickToUp'));
                                        }

                                        $mdInfo.val(mdInfo);
                                        $mdInfo.trigger('input');

                                        $mdDescription.val(mdDescription);

                                        mdVer = mdVer.split('.');
                                        $mdVer.each(function(index, el) {
                                                var v = mdVer[index];
                                                $(el).val(v);
                                        });

                                }
                        });

                        //字数限制
                        util.limitWord({
                                element: '#edit-mod-title',
                                maxLen: 30,
                                labelElement: '#edit-mod-name'
                        });
                        util.limitWord({
                                element: '#editModule-summary',
                                maxLen: 30,
                                labelElement: '#edit-mod-sum'
                        });

                        //初始化上传
                        if (!initEditBox) {
                                uploadMod({
                                        picker: '#edit-mod-ios',
                                        callback: function(url, file) {
                                                var fileName = file.name.split('.zip')[0];
                                                editIosModName = fileName;
                                                $editIosModName.val(fileName);
                                                editIosModUrl = url;
                                                var size = Math.round(file.size / 1024 / 1024 * 100) / 100;
                                                editIosModSize = size + 'M';
                                        },
                                        error: function() {
                                                editIosModName = '';
                                                $editIosModName.val('');
                                                editIosModUrl = '';
                                                editIosModSize = '0.00M';
                                        }
                                });
                                uploadMod({
                                        picker: '#edit-mod-and',
                                        callback: function(url, file) {
                                                var fileName = file.name.split('.zip')[0];
                                                editAndModName = fileName;
                                                $editAndModName.val(fileName);
                                                editAndModUrl = url;
                                                var size = Math.round(file.size / 1024 / 1024 * 100) / 100;
                                                editAndModSize = size + 'M';
                                        },
                                        error: function() {
                                                editAndModName = '';
                                                $editAndModName.val('');
                                                editAndModUrl = '';
                                                editAndModSize = '';
                                        }
                                });
                                initEditBox = true;
                        }
                });
                // 隐藏编辑自定义模块
                $(document.body).on('click', function(e) {
                        // 应该改一下，要点关闭才可以关闭表单
                        var target = $(e.target);
                        if (!$.contains($editCustomModuleForm.get(0), e.target) && (!target.is('.edit')) && (!target.is('#editCustomModule-form'))) {
                                $editCustomModuleForm.hide();

                                //重置iOS,Android模块地址
                                editIosModUrl = '';
                                editAndModUrl = '';
                        }
                });

                //编辑自定义模块
                $.validator.addMethod('validEditPkg', function(value, element, param) {
                        var valid = true;

                        if (!editIosModName && !editAndModName) {
                                valid = false;
                                return valid;
                        }
                        if (editIosModName && editAndModName) {
                                if (editIosModName !== editAndModName) {
                                        valid = false;
                                        return valid;
                                }
                        }
                        return valid;
                },
                i18n.t('cadModule.notice'));
                $.validator.addMethod('validEditPkgName', function(value, element, param) {
                        var modName = $('#edit-mod-title').val();
                        var valid = true;
                        if (editIosModName) {
                                if (editIosModName !== modName) {
                                        valid = false;
                                        return valid;
                                }
                        }
                        if (editAndModName) {
                                if (editAndModName !== modName) {
                                        valid = false;
                                        return valid;
                                }
                        }
                        return valid;
                },
                i18n.t('cadModule.notice1'));
                $editCustomModuleForm.validate({
                        ignore: "",
                        errorPlacement: function(error, element) {
                                if (element.attr("name") === "mdName") {
                                        $editCustomModuleForm.find('.md-name-err').html(error);
                                }
                                if (element.attr("name") === "editIosPkgName" || element.attr("name") === "editAndPkgName") {
                                        $editCustomModuleForm.find('.editPkgErr').html(error);
                                }
                                if (element.attr("name") === "editVer1" || element.attr("name") === "editVer2" || element.attr("name") === "editVer3") {
                                        $editCustomModuleForm.find('.editVersionErr').html(error);
                                }
                        },
                        rules: {
                                mdName: {
                                        required: true,
                                        word: true,
                                        validEditPkgName: true
                                },
                                iosPkgName: {
                                        validEditPkg: true
                                },
                                andPkgName: {
                                        validEditPkg: true
                                },
                                editVer1: {
                                        required: true,
                                        digits: true,
                                        range: [0, 99]
                                },
                                editVer2: {
                                        required: true,
                                        digits: true,
                                        range: [0, 99]
                                },
                                editVer3: {
                                        required: true,
                                        digits: true,
                                        range: [0, 99]
                                }
                        },
                        messages: {
                                mdName: {
                                        required: i18n.t('cadModule.notice2')
                                },
                                editVer1: {
                                        required: i18n.t('cadPackage.valid_ver_1'),
                                        range: i18n.t('cadPackage.valid_ver_2'),
                                        digits: i18n.t('error.A00010')
                                },
                                editVer2: {
                                        required: i18n.t('cadPackage.valid_ver_1'),
                                        range: i18n.t('cadPackage.valid_ver_2'),
                                        digits: i18n.t('error.A00010')
                                },
                                editVer3: {
                                        required: i18n.t('cadPackage.valid_ver_1'),
                                        range: i18n.t('cadPackage.valid_ver_2'),
                                        digits: i18n.t('error.A00010')
                                }
                        },
                        submitHandler: function(form) {

                                var $editSave = $('#edit-btns .edit-save');
                                $editSave.attr('disabled', 'disabled');

                                var mdName = $('#edit-mod-title').val();
                                mdName = $.trim(mdName);
                                //自定义类
                                var mdType = 6;
                                var mdVer = '';
                                var verArr = [];
                                $editCustomModuleForm.find('.verson-num').each(function(index, el) {
                                        var v = $(el).val();
                                        v = parseInt(v, 10);
                                        verArr.push(v);
                                });

                                mdVer = verArr.join('.');
                                if (mdVer == '0.0.0') {
                                        util.alertMessage(0, i18n.t('error.A00011'));
                                        $modSaveBtn.removeAttr('disabled');
                                        return;
                                }
                                var mdInfo = $('#editModule-summary').val();
                                mdInfo = $.trim(mdInfo);
                                var mdDescription = $('#editModule-detail').val();
                                mdDescription = $.trim(mdDescription);
                                var mdPlatform;
                                if (editAndModUrl) {
                                        mdPlatform = 1;
                                }

                                if (editIosModUrl) {
                                        mdPlatform = 0;
                                }
                                if (editAndModUrl && editIosModUrl) {
                                        mdPlatform = 2;
                                }
                                $.ajax({
                                        url: '/updateModule',
                                        type: 'POST',
                                        abort: true,
                                        data: {
                                                'mdId': editMdid,
                                                'mdName': mdName,
                                                'mdType': mdType,
                                                'mdVer': mdVer,
                                                'mdApkSize': editAndModSize,
                                                'mdIpaSize': editIosModSize,
                                                'mdInfo': mdInfo,
                                                'mdDescription': mdDescription,
                                                'mdApkUrl': editAndModUrl,
                                                'mdIpaUrl': editIosModUrl,
                                                'mdPlatform': mdPlatform,
                                                'timepicker': new Date().getTime()
                                        },
                                        success: function(data) {
                                                if (data && data.status) {
                                                        $editCustomModuleForm.hide();

                                                        //重置iOS,Android模块地址
                                                        editIosModUrl = '';
                                                        editAndModUrl = '';

                                                        reqMod({
                                                                type: 6
                                                        });
                                                        util.alertMessage(1, i18n.t('cadModule.notice4'));
                                                } else {
                                                        alert(errors.cadTip[data.code]);
                                                }
                                        },
                                        error: function(data) {
                                                // console.log(data);
                                        },
                                        complete: function() {
                                                $editSave.removeAttr('disabled');
                                        }
                                });

                                return false;
                        }
                });

                //取消编辑
                $('#edit-btns .cancel').on('click', function() {
                        $editCustomModuleForm.hide();

                        //重置iOS,Android模块地址
                        editIosModUrl = '';
                        editAndModUrl = '';
                        return false;
                });

                // 没有模块，点击添加
                $('.no-data .btn-default').on('click', function(event) {
                        $('#addCustomModule-toggle-btn').trigger('click');
                        event.preventDefault();
                });
                module_util.moduleStoreDetail();
                //滚动加载
                $(window).on('scroll', function() {
                        if ($(window).scrollTop() == $(document).height() - $(window).height()) {

                                if (reqLock) {
                                        return false;
                                }
                                $(".butterbar").addClass("active").removeClass("hide");
                                startNum += 32;
                                var size = 32;
                                var reqUrl = '/getModule?appId=' + appid + '&startNum=' + startNum + '&size=' + size + '&platform=-1&type=6&subclass=0';
                                if ($('#addCustomModule-form') == undefined) {
                                        return false;
                                }
                                $.get(reqUrl, function(data, textStatus, xhr) {
                                        $(".butterbar").removeClass("active").addClass("hide");
                                        if (data && data.status) {

                                                var source = $modTpl.html();
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
        };
});