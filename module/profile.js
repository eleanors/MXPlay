define(['require', 'exports', 'module', 'regTest', 'jquery', 'bootstrap', 'placeholder', 'validate', 'cookie', 'jqueryui', '', '../jquery/jcrop/jquery.Jcrop'], function(require, exports, module, regTest) {

        require('ie-shim').init();

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
                require('./console_com.js');
                var errors = require("msmErrors");
                var utils = require('./utils.js');
                var lang = $.cookie('i18next');
                if (lang) {
                        if ($("#langSelect")[0]) {
                                $("#langSelect").find('option:selected')[0].selected = false;
                                $("#langSelect").find('option[value="' + lang + '"]')[0].selected = true;
                        }
                }
                //切换语言
                $("#langSelect").on("change",
                function() {
                        i18n.setLng($(this).val());
                        location.reload();
                });

                var WebUploader = require('webuploader');
                var Handlebars = require('Handlebars');
                var helper = require('./helper.js');
                helper.init();

                // exports.init = function(){
                var $imgBig = $('#img-big-profile');
                var $imgMiddle = $('#img-middle-profile');
                var $imgSmall = $('#img-small-profile');
                var $preview = $('#upload-photo-profile');
                var $imageGroups = $('#imageGroups').find('div.img-inner-container');
                var jcrop_api, boundx = 250,
                boundy = 250,
                imgC;
                var changeSrc = function(c) {
                        if (c) {
                                var src = $preview.attr('src');
                                $imgBig.attr('src', src);
                                $imgMiddle.attr('src', src);
                                $imgSmall.attr('src', src);
                                $imageGroups.each(function(index, el) {
                                        $(el).addClass('active');
                                });
                                // img-inner-container active
                        } else {
                                $preview.attr('src', '/img/profile-middle.png');
                                $imageGroups.each(function(index, el) {
                                        $(el).addClass('active');
                                });
                        }

                };
                var setJcrop = function() {
                        if (jcrop_api) {
                                $coverProfile.removeClass('active');
                                jcrop_api.destroy();
                                $preview.show();
                        }
                        // destroy();
                        var showImg = function(c) {
                                imgC = c;
                                if (parseInt(c.w) > 0) {
                                        var rxb = 180 / c.w;
                                        var ryb = 180 / c.h;
                                        var rxm = 65 / c.w;
                                        var rym = 65 / c.h;
                                        var rxs = 30 / c.w;
                                        var rys = 30 / c.h;

                                        $imgBig.css({
                                                width: Math.round(rxb * boundx) + 'px',
                                                height: Math.round(ryb * boundy) + 'px',
                                                marginLeft: '-' + Math.round(rxb * c.x) + 'px',
                                                marginTop: '-' + Math.round(ryb * c.y) + 'px'
                                        });
                                        $imgMiddle.css({
                                                width: Math.round(rxm * boundx) + 'px',
                                                height: Math.round(rym * boundy) + 'px',
                                                marginLeft: '-' + Math.round(rxm * c.x) + 'px',
                                                marginTop: '-' + Math.round(rym * c.y) + 'px'
                                        });
                                        $imgSmall.css({
                                                width: Math.round(rxs * boundx) + 'px',
                                                height: Math.round(rys * boundy) + 'px',
                                                marginLeft: '-' + Math.round(rxs * c.x) + 'px',
                                                marginTop: '-' + Math.round(rys * c.y) + 'px'
                                        });
                                }
                        };
                        jcrop_api = $.Jcrop('#upload-photo-profile');
                        jcrop_api.setOptions({
                                onSelect: showImg,
                                onChange: showImg,
                                aspectRatio: 1,
                                bgColor: 'transparent',
                                setSelect: [50, 50, 200, 200]
                        });
                };
                var $coverProfile = $('#cover_profile');
                //上传图标
                var bindUploader = function() {
                        var uploadIcon = WebUploader.create({
                                pick: '#upload-label-profile',
                                swf: '/libs/webuploader/Uploader.swf',
                                server: '/api2/upload',
                                resize: false,
                                auto: true,
                                accept: {
                                        extensions: 'jpg,jpeg,png'
                                },
                                formData: {
                                        upload_type: 'user_icon'
                                }
                        });
                        uploadIcon.on('beforeFileQueued',
                        function(file) {
                                var reg = /\.png$/;
                                var reg2 = /\.jpg$/;
                                var size = Math.round(file.size / 1024 / 1024 * 100) / 100;
                                if (!reg.test(file.name.toLowerCase()) && !reg2.test(file.name.toLowerCase())) {
                                        alert(i18n.t('error.A000016'));
                                        return false;
                                } else if (size > 2) {
                                        alert(i18n.t('error.A000017'));
                                        return false;
                                } else {
                                        // uploader.upload();
                                }
                        });
                        uploadIcon.on('fileQueued',
                        function(file) {
                                $coverProfile.addClass('active');

                        });
                        uploadIcon.on('uploadProgress',
                        function(file, percentage) {
                                var per = percentage * 100 + '%';
                                $coverProfile.html(per);
                        });
                        //文件上传成功
                        uploadIcon.on('uploadSuccess',
                        function(file, response) {
                                var res = response;
                                var picUrl;
                                if (res && res.status) {
                                        picUrl = res.result.path;
                                        $preview.attr('src', picUrl);
                                        $preview.attr('url', picUrl);
                                        changeSrc(1);
                                        setJcrop();
                                } else {
                                        alert(errors.msmTip[res.code]);
                                }

                        });
                        //文件上传失败
                        uploadIcon.on('uploadError',
                        function(file) {});
                        //上传完成，不管成功失败
                        uploadIcon.on('uploadComplete',
                        function(file) {
                                var $this = $(this);
                                $coverProfile.removeClass('active');
                                $coverProfile.html('0%');
                                uploadIcon.removeFile(file);
                        });
                        uploadIcon.on('uploadBeforeSend',
                        function(block, data) {
                                // data.appId = $.cookie('curAppId');
                        });
                };
                var countToBind = function(num) {
                        var num = num || 100;
                        setTimeout(function() {
                                bindUploader();
                        },
                        num);
                };
                countToBind(500);

                //表单验证
                $.validator.addMethod("maxCNrange",
                function(value, element, param) {
                        var cArr = value.match(/[^\x00-\xff]/ig);
                        var len = value.length + (cArr == null ? 0 : cArr.length);
                        if (len >= param[0] && len <= param[1]) {
                                return true;
                        }
                        return false;
                },
                i18n.t('error.A000018'));
                $("#profile-save-form").validate({
                        ignore: "",
                        rules: {
                                oldPwd: {
                                        required: true,
                                        maxCNrange: [6, 16]
                                },
                                newPwd: {
                                        required: true,
                                        maxCNrange: [6, 16]
                                },
                                confirmPwd: {
                                        equalTo: "#newPwd"
                                }
                        },
                        messages: {
                                oldPwd: {
                                        required: i18n.t('member.notice3')
                                },
                                newPwd: {
                                        required: i18n.t('member.notice3'),
                                        maxCNrange: i18n.t('error.A00006')
                                },
                                confirmPwd: {
                                        equalTo: i18n.t('error.A000019')
                                }
                        },
                        submitHandler: function(form) {
                                var data = {
                                        passwordold: $("#oldPwd").val(),
                                        password: $("#newPwd").val(),
                                        'timepicker': new Date().getTime()
                                };
                                $.ajax({
                                        url: '/updateEnterUserPass',
                                        type: 'POST',
                                        data: data
                                }).done(function(data) {
                                        if (data && data.status == 1) {
                                                utils.alertMessage(1, i18n.t('error.A000020'));
                                                setTimeout(function() {
                                                        location.reload();
                                                },
                                                2000);
                                        } else {
                                                alert(errors.msmTip[data.code]);
                                        }
                                }).fail(function(data) {}).always(function() {});

                        }
                });
                $.validator.addMethod("ajaxNicknameCheck",
                function(value, element, param) {
                        var result = false;
                        $.ajax({
                                url: '/api/user/name/check',
                                type: 'GET',
                                cache: false,
                                dataType: 'json',
                                data: {
                                        name: value,
                                        exceptMe: 1
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
                i18n.t('appInfo.notice9'));
                $.validator.addMethod("phoneNum",
                function(value, element, param) {
                        var reg = /[^0-9\-]/g;
                        if (reg.test(value)) {
                                return false;
                        }
                        return true;
                },
                i18n.t('error.A000027'));
                $('#profile-basic-form').validate({
                        onkeyup: false,
                        rules: {
                                profile_userName: {
                                        'required': true,
                                        maxCNrange: [4, 24],
                                        ajaxNicknameCheck: true
                                },
                                profile_realName: {

},
                                profile_qq: {
                                        digits: true,
                                        maxlength: 20
                                },
                                profile_phone: {
                                        maxlength: 20,
                                        phoneNum: true
                                },
                                profile_enterName: {
                                        maxCNrange: [0, 50]
                                },
                                profile_alipay_account: {

}
                        },
                        messages: {
                                profile_userName: {
                                        required: i18n.t('error.A000021'),
                                        maxCNrange: i18n.t('error.A000022')
                                },
                                profile_realName: {

},
                                profile_qq: {
                                        digits: i18n.t('error.A000023'),
                                        maxlength: i18n.t('error.A000024')
                                },
                                profile_phone: {
                                        maxlength: i18n.t('error.A000025'),
                                        phoneNum: i18n.t('error.A000027')
                                },
                                profile_enterName: {
                                        maxCNrange: i18n.t('error.A000026')
                                },
                                profile_alipay_account: {

}
                        },
                        submitHandler: function(form) {
                                var data;
                                var tempPhone = $('#profile_phone').val();
                                var reg = /^1[3|4|5|7|8][0-9]\d{8}$/g;
                                if (tempPhone == '') {
                                        utils.alertMessage(0, i18n.t('profile.error1-3'));
                                        return;
                                }
                                if (!reg.test(tempPhone)) {
                                        utils.alertMessage(0, i18n.t('error.A000028'));
                                        return;
                                }
                                var alipay = $('#profile_alipay_account').val();
                                if (alipay != '') {
                                        var regPhone = regTest.phone;
                                        var regEmail = regTest.email;
                                        if (regPhone.test(alipay) || regEmail.test(alipay)) {} else {
                                                regPhone.lastIndex = 0;
                                                regEmail.lastIndex = 0;
                                                utils.alertMessage(0, i18n.t('profile.error1_4'));
                                                return;
                                        }
                                }
                                data = {
                                        userName: $('#profile_userName').val(),
                                        qq: $('#profile_qq').val(),
                                        phone: $('#profile_phone').val(),
                                        enterName: $('#profile_enterName').val(),
                                        realName: $('#profile_realName').val(),
                                        alipay: $('#profile_alipay_account').val(),
                                        'timepicker': new Date().getTime()
                                };
                                // realName,alipay发布模块必填
                                if ($preview.attr('url') !== '') {
                                        var scaleX = $preview[0].width / 250;
                                        var scaleY = $preview[0].height / 250;
                                        data.x = parseInt((imgC.x) * scaleX);
                                        data.y = parseInt((imgC.y) * scaleY);
                                        data.width = parseInt((imgC.w) * scaleX);
                                        data.height = parseInt((imgC.h) * scaleY);
                                        data.icon_url = $preview.attr('url');
                                }
                                $.ajax({
                                        url: '/api/user/setting',
                                        type: 'PUT',
                                        data: data
                                }).done(function(data) {
                                        if (data && data.status == 1) {
                                                if (data.result.icon1) {
                                                        $('#my_photo_icon').attr('src', data.result.icon1);
                                                } else {
                                                        $('#my_photo_icon').attr('src', '/img/favicon.png');
                                                }
                                                utils.alertMessage(1, i18n.t('error.A000020'));
                                                setTimeout(function() {
                                                        location.reload();
                                                },
                                                2000);
                                        } else {
                                                alert(errors.msmTip[data.code]);
                                        }
                                }).fail(function(data) {}).always(function() {});

                        }
                });
                // 如果有图片，则上传其坐标，用以截图
                /*// 修改手机号 start
        // 获取短信验证码部分
            $('#mobileForm .cancel').on('click', function(event) {
                $('#mobileForm_modal').modal('hide');
                event.preventDefault();
            });
            var $codePhoneNum = $('#codePhoneNum');
            var $codePhoneCount = $('#code_phone_count');
            var $codeText = $('#codeText');
            function checkPhoneNum(){
                var result = false;
                var value = $codePhoneNum.val();
                $.ajax({
                    url: '/api/user/phone/check',
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    data: {phone: value},
                    async: false,
                    success: function(data){
                        if (data.status == 1) {
                            if(data.result.count == 0){
                                result = true;
                            } else {
                            }  
                        } else{
                        }
                    }
                });
                return result;
            };
            $('.code-phone-btn').on('click', function(event) {
                var $this = $(this);
                $this.attr('disabled', true);
                $codePhoneCount.html('');
                $codeText.html(i18n.t('error.A00013'));
                var thisTimer,thisTimeCount = 90;
                var phoneNum = $codePhoneNum.val();
                var reg = /^1[3|4|5|7|8][0-9]\d{8}$/g;
                if (phoneNum == '') {
                    $this.removeAttr('disabled');
                    return;
                }
                if (!reg.test(phoneNum)) {
                    $this.removeAttr('disabled');
                    return;
                }
                if (!checkPhoneNum()) {
                    $this.removeAttr('disabled');
                    return;
                }
                
                $.ajax({
                    url: '/api/user/signup/phone/code',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        phone: phoneNum
                    }
                })
                .done(function(data) {
                    if (data && data.status) {
                        thisTimeCount = parseInt(data.result.remain);
                        $codePhoneCount.html(thisTimeCount);
                        $codeText.html(i18n.t('common.remains'));
                        thisTimer = setInterval(function(){
                            thisTimeCount--;
                            $codePhoneCount.html(thisTimeCount);
                            if (thisTimeCount <= 0) {
                                $this.removeAttr('disabled');
                                $codeText.html(i18n.t('profile.info1_8'));
                                clearInterval(thisTimer);
                            }
                        },1000);
                    } else{
                        utils.alertMessage(0, errors.msmTip[data.code]);
                        $this.removeAttr('disabled');
                    }
                })
                .fail(function() {
                    // utils.alertMessage(0, data.);
                    $this.removeAttr('disabled');
                })
                .always(function() {
                });

                event.preventDefault();
            });
        // 
            $('#modify_mobile').on('click', function(event) {
                // modal show
                $('#mobileForm_modal').modal({
                    backdrop: 'static',
                    show: true
                });
                event.preventDefault();
            });
            $('#mobileForm_modal').on('show.bs.modal', function(event) {
                $('#codePhoneNum').val('');
                $('#codePhoneText').val('');
                $('.code-phone-btn').removeAttr('disabled');
                $codePhoneCount.html('');
                $codeText.html(i18n.t('error.A00013'));
                $('#mobileForm_modal').find('label.error').remove();
            });
            var mobileForm = $('#mobileForm');
            function clearMobileForm(){

            };
            $.validator.addMethod("checkPhone", function (value, element, param) {
                var result = false;
                var reg = /^1[3|4|5|7|8][0-9]\d{8}$/g;
                if (!reg.test(value)) {
                    result = false;
                } else {
                    result = true;
                }
                return result;
            }, i18n.t('error.A000028'));
            $.validator.addMethod("ajaxPhoneCheck", function (value, element, param) {
                // 可用remote
                var result = false;
                $.ajax({
                    url: '/api/user/phone/check',
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    data: {phone: value},
                    async: false,
                    success: function(data){
                        if (data.status == 1) {
                            if(data.result.count == 0){
                                result = true;
                            } else {
                            }  
                        } else{
                        }
                    },
                    error: function(data){
                    }
                });
                return result;
            }, i18n.t('error.A000029'));
            mobileForm.validate({
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
                        required: i18n.t('error.A00012'),
                        checkPhone: i18n.t('error.A000028'),
                        ajaxPhoneCheck: i18n.t('error.A000029')
                    },
                    codePhoneText: {
                        required: i18n.t('appInfo.inputPhoneCode')
                    }
                },
                submitHandler: function(form){
                    var phone = $('#codePhoneNum').val();
                    var phoneCode = $('#codePhoneText').val();
                    var email = $('#my_userId').html();
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
                            $('#profile_phone').val(phone);
                        } else{
                            utils.alertMessage(0,errors.msmTip[data.code]);
                        }
                    })
                    .fail(function() {
                    })
                    .always(function() {
                        $('#mobileForm_modal').modal('hide');
                    });
                    
                    
                }
            });
    // 修改手机号 end*/
                $('#my_userId').text($.cookie('username') || '');
        }

        // };
});