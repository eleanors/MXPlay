define(['require', 'exports', 'module', 'jquery', 'jqueryui', 'switchbutton', './utils', './mcmErrors', 'validate'], function(require, exports, module, jQuery, utils, errors) {

        exports.init = function() {
                var flag = true;
                var app3cAppId = $.cookie("curAppId"),
                curAppName = $.cookie("curAppName");
                var openOrCloseSms = $('#openOrCloseSMS').switchButton({
                        show_labels: false,
                        on_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setSMSVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needSMS': 1
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                location.reload();
                                        } else {
                                                $('#openOrCloseSMS').switchButton({
                                                        checked: false
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(openOrCloseSms).removeAttr("disabled");
                                });
                        },
                        off_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setSMSVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needSMS': 0
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                $("#baichuan").fadeOut();
                                        } else {
                                                $('#openOrCloseSMS').switchButton({
                                                        checked: true
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(openOrCloseSms).removeAttr("disabled");
                                });
                        }
                });
                var openOrCloseEmail = $('#openOrCloseEmail').switchButton({
                        show_labels: false,
                        on_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setGlobalEmailVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needEmail': 1
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                location.reload();
                                        } else {
                                                $('#openOrCloseEmail').switchButton({
                                                        checked: false
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(openOrCloseEmail).removeAttr("disabled");
                                });
                        },
                        off_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setGlobalEmailVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needEmail': 0
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                $(".slipanel").fadeOut();
                                        } else {
                                                $('#openOrCloseEmail').switchButton({
                                                        checked: true
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(openOrCloseEmail).removeAttr("disabled");
                                });
                        }
                });
                var openOrClose = $('#openOrClose').switchButton({
                        show_labels: false,
                        on_callback: function() {},
                        off_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/closeApp.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'appId': app3cAppId
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                $.cookie("mcmOpened", 0);
                                                location.reload();
                                        } else {
                                                $('#openOrClose').switchButton({
                                                        checked: true
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(openOrClose).removeAttr("disabled");
                                });
                        }
                });
                var validationEmail = $('#validationEmail').switchButton({
                        show_labels: false,
                        on_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setEmailVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needVerify': 1
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                $("#emailPanel").fadeIn();
                                        } else {
                                                $('#validationEmail').switchButton({
                                                        checked: false
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(validationEmail).removeAttr("disabled");
                                });

                        },
                        off_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setEmailVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needVerify': 0
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                $("#emailPanel").fadeOut();
                                                util.alertMessage(SUCCESSSTATUS, i18n.t("mcm.SaveSuccessful"));
                                        } else {
                                                $('#validationEmail').switchButton({
                                                        checked: true
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(validationEmail).removeAttr("disabled");
                                });
                        }
                });
                var validationImageCode = $('#validationImageCode').switchButton({
                        show_labels: false,
                        on_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setImageCodeVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needImageCode': 1
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                $("#emailPanel").fadeIn();
                                        } else {
                                                $('#validationEmail').switchButton({
                                                        checked: false
                                                });
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(validationEmail).removeAttr("disabled");
                                });

                        },
                        off_callback: function() {
                                if (flag) {
                                        return;
                                }
                                var options = {
                                        url: '/mxplay/data/setImageCodeVerify.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'needImageCode': 0
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {

} else {
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $(validationImageCode).removeAttr("disabled");
                                });
                        }
                });
                $("#emailSetting").on("blur",
                function() {
                        var email = $(this).val(),
                        reg = new Regex("[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?");
                        if (email && reg.test(email)) {
                                $(this).removeClass("errorSolid");
                        } else {
                                $(this).addClass("errorSolid");
                                return;
                        }

                        var options = {
                                url: '/mxplay/data/setSenderEmail.json',
                                method: "POST",
                                headers: {
                                        'X-APICloud-AppId': app3cAppId
                                },
                                data: {
                                        'senderEmail': email,
                                        'timepicker': new Date().getTime()
                                }
                        };
                        $("#emailSaveLoad").show();
                        $.ajax(options).done(function(data) {
                                if (data.status == 1) {
                                        util.alertMessage(SUCCESSSTATUS, i18n.t("mcm.SaveSuccessful"));
                                } else {
                                        util.alertMessage(0, errors.mcmTip[data.code]);
                                }
                        }).fail(function() {
                                util.alertMessage(0);
                        }).always(function() {
                                $("#emailSaveLoad").hide();
                        });
                });
                $("#baichuan").validate({
                        ignore: "",
                        errorPlacement: function(error, element) {
                                $(element).addClass("errorSolid");
                        },
                        rules: {
                                bcAppKey: {
                                        required: true
                                },
                                bcAppSecret: {
                                        required: true
                                }
                        },
                        messages: {},
                        submitHandler: function(form) {
                                var bcAppKey = $("#bcAppKey").val(),
                                bcAppSecret = $("#bcAppSecret").val();
                                var options = {
                                        url: '/mxplay/data/setSMS.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'app_key': bcAppKey,
                                                'secret': bcAppSecret,
                                                'supplier': 'baichuan'
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                util.alertMessage(SUCCESSSTATUS, i18n.t("mcm.SaveSuccessful"));
                                        } else {
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $("#emailSaveLoad").hide();
                                });
                        }
                });
                $("#emailTemplateForm").validate({
                        ignore: "",
                        errorPlacement: function(error, element) {
                                $(element).addClass("errorSolid");
                        },
                        rules: {
                                emailTitle: {
                                        required: true
                                },
                                emailContent: {
                                        required: true
                                }
                        },
                        messages: {},
                        submitHandler: function(form) {
                                var emailTitle = $("#emailTitle").val(),
                                emailContent = $("#emailContent").val();
                                var options = {
                                        url: '/mxplay/data/setVerifyInfo.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'verifySubject': emailTitle,
                                                'verifyContent': emailContent,
                                                'timepicker': new Date().getTime()
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                util.alertMessage(SUCCESSSTATUS, i18n.t("mcm.SaveSuccessful"));
                                        } else {
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $("#emailSaveLoad").hide();
                                });
                        }
                });
                $("#passwordTemplateForm").validate({
                        ignore: "",
                        errorPlacement: function(error, element) {
                                $(element).addClass("errorSolid");
                        },
                        rules: {
                                pwdTitle: {
                                        required: true
                                },
                                pwdContent: {
                                        required: true
                                }
                        },
                        messages: {},
                        submitHandler: function(form) {
                                var pwdTitle = $("#pwdTitle").val(),
                                pwdContent = $("#pwdContent").val();
                                var options = {
                                        url: '/mxplay/data/setResetInfo.json',
                                        method: "POST",
                                        headers: {
                                                'X-APICloud-AppId': app3cAppId
                                        },
                                        data: {
                                                'resetSubject': pwdTitle,
                                                'resetContent': pwdContent,
                                                'timepicker': new Date().getTime()
                                        }
                                };
                                $.ajax(options).done(function(data) {
                                        if (data.status == 1) {
                                                util.alertMessage(SUCCESSSTATUS, i18n.t("mcm.SaveSuccessful"));
                                        } else {
                                                util.alertMessage(0, errors.mcmTip[data.code]);
                                        }
                                }).fail(function() {
                                        util.alertMessage(0);
                                }).always(function() {
                                        $("#emailSaveLoad").hide();
                                });
                        }
                });
                var ERRORSTATUS = 0,
                SUCCESSSTATUS = 1,
                INFOSTATUS = 2,
                WARNSTATUS = 3;
                flag = false;
        }
})