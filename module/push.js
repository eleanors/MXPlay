define(['require', 'exports', 'module', './msmErrors', 'webuploader', './utils', 'Handlebars', 'jquery', 'jqueryui', '../libs/jquery/icheck.min', '../libs/jquery/placeholder', '../libs/daterangepicker/picker', 'validate', 'switchbutton'], function(require, exports, module, errors, WebUploader, util, Handlebars) {
		
        exports.init = function() {
                var $pushLog = $('#push-log');
                var $loadingMore = $('.load-more');
                if ($pushLog.find('table tbody tr').length == 5) {
                        $loadingMore.show();
                }
                var bytesCount = 168;
                /*bytes*/
                $('#ios').on('ifChecked', function() {
                        setMaxLen(true);
                }).on('ifUnchecked', function() {
                        setMaxLen(false);
                });
                function setMaxLen(ischeck) {
                        if (ischeck) {
                                bytesCount = 168;
                        } else {
                                bytesCount = 216;

                        };
                        util.setUtf8Bytes({
                                ele1: '#notice-title',
                                ele2: '#notice-content',
                                maxLen: bytesCount,
                                labelElement: '#notice-content-span'
                        });
                        $('#bytesNum').text(bytesCount);

                }
                $('#bytesNum').text(bytesCount);
                // input,rangepicker
                //日期区间，插件
                $('#text-picker').daterangepicker({
                        format: i18n.t("PushNotification.DateFormat"),
                        opens: 'left'
                },
                function(start, end, label) {});
                // $('#time-choose').daterangepicker({
                //     format: 'YYYY/M/D HH:mm',
                //     opens: 'left',
                //     singleDatePicker: true,
                //     timePicker: true,
                //     timePickerIncrement: 10,
                //     timePicker12Hour: false,
                //     startDate: new Date()
                // },function(start, end, label){
                // });
                $('#time-choose').on('show.daterangepicker', function(ev, picker) {});
                $('#time-choose').on('apply.daterangepicker', function(ev, picker) {
                        // console.log(picker.startDate);
                });
                $('#text-picker').on('show.daterangepicker', function() {});
                $('#text-picker').on('delete.daterangepicker', function() {
                        $('#text-picker').attr({
                                'data-range-start': '',
                                'data-range-end': ''
                        });
                        var value = $pushLog.find('.platform-btn-group a.active').attr('value');
                        var postData = {
                                si: 0,
                                ps: 5
                        };
                        if (value == -1) {

} else {
                                postData.status = value;
                        }
                        // 调用 查询推送 函数 
                        getPushMessages(postData);
                });
                // 
                // $('#date-picker-push').on('click', function(event) {
                //     var sTime = $('#text-picker').attr('data-range-start');
                //     var eTime = $('#text-picker').attr('data-range-end');
                //     var value = $pushLog.find('.platform-btn-group a.active').attr('value');
                //     var postData = {
                //         si: 0,
                //         ps: 5,
                //     };
                //     if (value == -1) {
                //     } else {
                //         postData.status = value;
                //     }
                //     if (sTime && eTime) {
                //         postData.bt = sTime;
                //         postData.et = eTime;
                //     } else{
                //     }
                //     // 调用 查询推送 函数 
                //     getPushMessages(postData);
                //     event.preventDefault();
                // });
                var setTimeChoose = function(param) {
                        // if (param == 1) {
                        //     $('#time-choose').attr('disabled', 'disabled');
                        // } else{
                        //     $('#time-choose').removeAttr('disabled');
                        // }
                };
                $('#text-picker').on('apply.daterangepicker', function(ev, picker) {
                        // console.log("apply event fired, start/end dates are "+
                        //   picker.startDate.format('MMMM D, YYYY')+
                        //   " to "+
                        //   picker.endDate.format('MMMM D, YYYY')
                        // ); 
                        $('#text-picker').attr({
                                'data-range-start': picker.startDate.format('YYYY/M/D'),
                                'data-range-end': picker.endDate.format('YYYY/M/D')
                        });
                        /////////////////
                        var value = $pushLog.find('.platform-btn-group a.active').attr('value');
                        var postData = {
                                bt: picker.startDate.format('YYYY/M/D'),
                                et: picker.endDate.format('YYYY/M/D'),
                                si: 0,
                                ps: 5
                        };
                        if (value == -1) {

} else {
                                postData.status = value;
                        }
                        // 调用 查询推送 函数 
                        getPushMessages(postData);
                });
                $('#clear-daterange').on('click', function(event) {
                        var getPush = $('#text-picker').val();
                        $('#text-picker').val('');
                        $('#text-picker').attr({
                                'data-range-start': '',
                                'data-range-end': ''
                        });
                        ///////////////
                        var value = $pushLog.find('.platform-btn-group a.active').attr('value');
                        var postData = {
                                si: 0,
                                ps: 5
                        };
                        if (value == -1) {

} else {
                                postData.status = value;
                        }
                        // 调用 查询推送 函数 
                        if (getPush) {
                                getPushMessages(postData);
                        } else {}
                        event.preventDefault();
                });
                // 推送查询函数
                var getPushMessages = function(postData, append) {
                        // postData = {
                        //     appId：appid
                        //     si：起始位置
                        //     ps：分页条数
                        //     bt：开始时间
                        //     et：结束时间
                        //     status：0:待发送，1：发送中，2：发送完毕
                        //     mt：message type , 1:消息，2：通知
                        // }
                        postData.appId = $.cookie('curAppId');
                        // console.log(postData);
                        // return;
                        $.ajax({
                                url: '/mxplay/data/push/messages.json',
                                type: 'GET',
                                cache: false,
                                dataType: 'json',
                                data: postData
                        }).done(function(data) {
                                if (data.status == 1) {
                                        var json = {};
                                        json.messages = data.result.items;
                                        var $tpl = $('#more-push');
                                        var tpl = $tpl.html();
                                        var template = Handlebars.compile(tpl);
                                        var html = template(json);
                                        if (append) {
                                                $pushLog.find('.table .tbody').append(html);
                                        } else {
                                                $pushLog.find('.table .tbody').html(html);
                                        }
                                        if (json.messages.length < 5) {
                                                $loadingMore.hide();
                                        } else {
                                                $loadingMore.show();
                                        }
                                        if (json.messages.length < 5) {
                                                siTemp = siTemp - 5 + json.messages.length;
                                        }
                                } else {
                                        if (append) {
                                                siTemp -= 5;
                                        }
                                }
                        }).fail(function(data) {
                                if (append) {
                                        siTemp -= 5;
                                } else {

}
                                $loadingMore.show();
                        }).always(function(data) {
                                if (append) {

} else {
                                        siTemp = 0;
                                }
                        });

                };
                // 查看推送的群组，用户列表 2015-1-21
                $('#push-log').on('click', '.group-btn', function(event) {
                        var position = {};
                        var $this = $(this);
                        position = $this.position();
                        var width = $this.width();
                        var dataStr = $this.attr('data');
                        var nameArr = dataStr.split(',');
                        var htmlStr = '';
                        if (nameArr.length > 0) {
                                for (var i = 0,
                                len = nameArr.length; i < len; i++) {
                                        htmlStr += '<li>' + nameArr[i] + '</li>';
                                }
                        }
                        $('#push-to-list').html(htmlStr);
                        $('#push-to-container').css({
                                left: (position.left - 30 + width / 2),
                                top: (position.top + 20)
                        }).show();

                        event.preventDefault();
                });
                // 查看推送的群组，用户列表 end
                var $hoursChoose = $('#hours-choose');
                var $sliderRange = $('#hours-range');
                $sliderRange.slider({
                        range: 'min',
                        min: 0,
                        max: 48,
                        values: 0,
                        step: 2,
                        slide: function(event, ui) {
                                // console.log(ui.value);
                                $hoursChoose.val(ui.value);
                                var $handle = $sliderRange.find('.ui-slider-handle');
                                if (!$handle.get(0)) {
                                        return;
                                }
                        }
                });
                // //////////////////////////////////////
                // 当前活跃用户数
                $('#push-platform-num').on('input', function(event) {
                        var $this = $(this);
                        changeCurActivePerson(1);
                        event.preventDefault();
                });
                var changeCurActivePerson = function(num) {
                        var curAppId = $.cookie('curAppId');
                        var strIcheckBoxInput = '';
                        var strPushIDText = '';
                        var data = {
                                appId: curAppId
                        };
                        if (num == 1) {
                                data.platform = $('#push-platform-num').val();
                        }
                        if (num == 2) {
                                var aIcheckBoxInput = $('#push-group').find('.icheckbox_minimal-green.checked input');
                                for (var i = 0,
                                len = aIcheckBoxInput.length; i < len; i++) {
                                        strIcheckBoxInput += "," + aIcheckBoxInput.eq(i).val();
                                }
                                strIcheckBoxInput = strIcheckBoxInput.replace(',', '');
                                data.platform = '';
                                data.groupId = strIcheckBoxInput;
                        }
                        if (num == 3) {
                                var aPushIDText = $('#push-id-container').find('.push-id-box .inner-text');
                                for (var i = 0,
                                len = aPushIDText.length; i < len; i++) {
                                        strPushIDText += ',' + aPushIDText.eq(i).text();
                                }
                                strPushIDText = strPushIDText.replace(',', '');
                                data.platform = '';
                                data.userIds = strPushIDText;
                        }
                        $.ajax({
                                url: '/mxplay/data/push/onlineCount.json',
                                type: 'GET',
                                cache: false,
                                dataType: 'json',
                                data: data
                        }).done(function(data) {
                                if (data.status == 1) {
                                        // $('#how-many .num-active').text(data.result.count);
                                        $('#how-many').text(data.result.count);
                                } else {
                                        // $('#how-many .num-active').text('0');
                                        $('#how-many').text('0');
                                }
                        }).fail(function() {}).always(function() {});

                        $('#how-many .num-active').text();
                };
                // /////// //
                $.fn.placeholder();
                ////////////////////////////////////////////////////////////////////////
                //新建推送
                var $pushBox = $('#push-box');
                //切换推送类型
                $pushBox.find('.btn.cancel').on('click', function(event) {
                        $('#create-new-push').trigger('click');
                        event.preventDefault();
                });
                // $pushBox.find('.nav-tabs li').on('click', function(event) {
                //     var $this = $(this);
                //     if ($this.attr('value') == 'message') {
                //         $pushBox.find('.notice-innerBox').hide();
                //     } else if ( $this.attr('value') == 'notice'){
                //         $pushBox.find('.notice-innerBox').show();
                //     } else {}
                // });
                ;
                // 选择平台
                var $pushPlatform = $('#push-platform');
                var $pushPlatformNum = $('#push-platform-num');
                var $pushTiming = $('#push-timing');
                $pushPlatform.find('input[type="checkbox"]').on('ifClicked', function(event) {
                        setTimeout(function() {
                                var $num = $pushPlatform.find('.icheckbox_minimal-green.checked');
                                if ($num.length == 0) {
                                        $pushPlatformNum.attr('value', '');
                                } else if ($num.length == 1) {
                                        $pushPlatformNum.attr('value', $num.find('input').attr('value'));
                                } else {
                                        $pushPlatformNum.attr('value', '0');
                                }
                                $pushPlatformNum.trigger('input');
                        },
                        100);
                        event.preventDefault();
                });
                // 自定义验证方法
                $.validator.addMethod("maxCNrange", function(value, element, param) {
                        var cArr = value.match(/[^\x00-\xff]/ig);
                        var len = value.length + (cArr == null ? 0 : cArr.length);
                        if (len >= param[0] && len <= param[1]) {
                                return true;
                        }
                        return false;
                },
                i18n.t("PushNotification.maxCNrange"));
                $.validator.addMethod("maxCNLen", function(value, element, param) {
                        var cArr = value.match(/[^\x00-\xff]/ig);
                        var len = value.length + (cArr == null ? 0 : cArr.length);
                        return len <= param;
                },
                i18n.t("PushNotification.maxCNLen"));
                $.validator.addMethod('pushRequired', function(value, element, param) {
                        if ($('#push-to').find('.iradio_minimal-green.checked input').val() != 2) {
                                return true;
                        }
                        var aIcheckBox = $('#push-group').find('.icheckbox_minimal-green.checked');
                        if (aIcheckBox.length) {
                                return true;
                        } else {
                                return false;
                        }
                },
                '请选择要推送的分组');
                $.validator.addMethod('pushID', function(value, element, param) {
                        if ($('#push-to').find('.iradio_minimal-green.checked input').val() != 3) {
                                return true;
                        }
                        var aPushID = $('#push-id-container').find('.push-id-box');
                        if (aPushID.length) {
                                return true;
                        } else {
                                return false;
                        }
                },
                '请填写要推送的用户ID');

                $.validator.addMethod('platformRequired', function(value, element, param) {
                        if ($('#push-to').find('.iradio_minimal-green.checked input').val() != 1) {
                                return true;
                        }
                        if (value !== '') {
                                return true;
                        } else {
                                return false;
                        }
                },
                '');
                /*util.limitWord({
					element: '#notice-title',
					maxLen: 40,
					labelElement: '#notice-title-span'
				});*/
						/*util.limitWord({
					element: '#notice-content',
					maxLen: 88,
					labelElement: '#notice-content-span'
				});*/
                util.setUtf8Bytes({
                        ele1: '#notice-title',
                        ele2: '#notice-content',
                        maxLen: bytesCount,
                        labelElement: '#notice-content-span'
                });
                var preFormat = function(str) {
                        if (isNaN(str)) {
                                str = str + '';
                                if (/(T+)/.test(str)) {
                                        var parts = str.match(/\d+/g);
                                        var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
                                        str = new Date(isoTime);
                                } else {
                                        str = str.replace(/\-/g, '\/');
                                }
                        } else {

}
                        return new Date(str).customFormat('yyyy-MM-dd HH:mm:ss');
                };
                $('#push-box-out').on('shown.bs.collapse',  function() {
                        $('#create-new-push .arr-b').removeClass('active');
                        $('#notice-title').val('').trigger('input');
                        $('#notice-content').val('').trigger('input');
                        $('#push-to label').eq(0).trigger('click');
                        $('#time-choose').val('');
                        $('#push-id-input').val('');
                        $('#push-id-container').find('.push-id-box').remove();
                        $('#push-box-out label.error').each(function(index, el) {
                                $(el).remove();
                        });
                        var $num = $pushPlatform.find('.icheckbox_minimal-green.checked');
                        if ($num.length == 0) {
                                $pushPlatformNum.attr('value', '');
                        } else if ($num.length == 1) {
                                $pushPlatformNum.attr('value', $num.find('input').attr('value'));
                        } else {
                                $pushPlatformNum.attr('value', '0');
                        }
                        $('#create-new-push .arr-b').addClass('active');
                        if ($('.iradio_minimal-green.checked input').val() == 1) {
                                setTimeChoose(1);
                        } else {
                                setTimeChoose(2);
                        }
                        $pushBox.validate({
                                // debug: true,
                                ignore: '',
                                errorPlacement: function(error, element) {
                                        if (element.attr('name') === 'push-platform-num') {
                                                $('.push-platform-err').html(error);
                                        } else if (element.attr('name') === 'notice-title') {
                                                $('.push-title-err').html(error);
                                        } else if (element.attr('name') === 'notice-content') {
                                                $('.push-message-err').html(error);
                                        } else {
                                                error.appendTo(element.parent());
                                        }
                                },
                                rules: {
                                        'push-platform-num': {
                                                platformRequired: true
                                        },
                                        'notice-title': {
                                                maxCNrange: [4, bytesCount]
                                        },
                                        'notice-content': {
                                                maxCNrange: [1, bytesCount]
                                        },
                                        // 'group-push': {
                                        //     required: true
                                        // },
                                        'push-group': {
                                                pushRequired: true
                                        },
                                        'push-id': {
                                                pushID: true
                                        }
                                        // ,
                                        // 'time-choose': {
                                        //     required: {
                                        //         depends: function () {
                                        //             if ($pushTiming.find(".iradio_minimal-green.checked input[type='radio']").val() == 2) {
                                        //                 return ($('#time-choose').val() == '');
                                        //             }
                                        //             return false;
                                        //         }
                                        //     }
                                        // }
                                },
                                messages: {
                                        'push-platform-num': {
                                                platformRequired: i18n.t("PushNotification.SelectPushPlatform")
                                        }
                                        // 'time-choose': {
                                        //     required: '请选择定时推送时间'
                                        // }
                                },
                                submitHandler: function(form) {
                                        var $pushTo = $('#push-to');
                                        if ($('#new-push-form').find('.switch-button-background').hasClass('checked')) {} else {
                                                util.alertMessage(0, i18n.t("PushNotification.switchBtn"));
                                                return;
                                        }
                                        var savedUrl = $chooseUploadSt.attr('saved-url');

                                        var curAppId = $.cookie('curAppId');
                                        $('#push-box-submit').attr('disabled', 'disabled');
                                        var postData = {};
                                        var sendTitle, sendContent, platform, sendType, sendTime, state, taskType, sendCount, successCount, totalCount, selectPlatform, groupId = '';
                                        sendTitle = $('#notice-title').val();
                                        sendContent = $('#notice-content').val();
                                        //sendType
                                        // sendType = $pushTiming.find(".iradio_minimal-green.checked input[type='radio']").val();   
                                        //sendType = 1;//1- sending immediately 2- sending in time   -- not use.
                                        // if (sendType == '1') {
                                        //     sendTime = new Date().customFormat('YYYY-MM-DD');
                                        // } else if (sendType == '2') {
                                        //     sendTime = $('#time-choose').val() + ':00';
                                        //     if (new Date(sendTime) < new Date()) {
                                        //         util.alertMessage(0,'推送日期小于当前日期！');
                                        //         return;
                                        //     }
                                        // } else {
                                        //     sendTime = new Date().customFormat('YYYY-MM-DD');
                                        // }
                                        ////////////////////////////
                                        state = 0; //0-ready 1-sending 2-finished
                                        taskType = 1; //1-message 2-notice
                                        sendCount = 0;
                                        successCount = 0;
                                        totalCount = 0;
                                        if ($('#push-box-out').find('.nav-tabs li.active').attr('value') == 'notice') {
                                                taskType = 2;
                                        } else {

}
                                        //platform 
                                        selectPlatform = $pushPlatformNum.val();
                                        postData.appId = curAppId;
                                        postData.taskType = taskType;
                                        // 用户问题 2015-1-19
                                        var targetType = 0;
                                        var pushToValue = $pushTo.find('.iradio_minimal-green.checked input').val();
                                        if (pushToValue == 1) {
                                                // 全部用户
                                                targetType = 0;
                                                postData.platform = selectPlatform;

                                        }
                                        var strIcheckBoxInput = '';
                                        if (pushToValue == 2) {
                                                var aIcheckBoxInput = $('#push-group').find('.icheckbox_minimal-green.checked input');

                                                for (var i = 0,
                                                len = aIcheckBoxInput.length; i < len; i++) {
                                                        strIcheckBoxInput += "," + aIcheckBoxInput.eq(i).val();
                                                }
                                                strIcheckBoxInput = strIcheckBoxInput.replace(',', '');
                                                postData.platform = '';
                                                targetType = 1;
                                        }
                                        postData.groupId = strIcheckBoxInput;
                                        var strPushIDText = '';
                                        if (pushToValue == 3) {
                                                var aPushIDText = $('#push-id-container').find('.push-id-box .inner-text');

                                                for (var i = 0,
                                                len = aPushIDText.length; i < len; i++) {
                                                        strPushIDText += ',' + aPushIDText.eq(i).text();
                                                }
                                                strPushIDText = strPushIDText.replace(',', '');
                                                postData.platform = '';
                                                targetType = 2;
                                        }
                                        postData.userIds = strPushIDText;
                                        postData.targetType = targetType;
                                        // 用户问题 2015-1-19 end
                                        // 推送证书问题
                                        if (selectPlatform == 0 || selectPlatform == 1) {
                                                if ((pushToValue == 1) && (!savedUrl)) {
                                                        util.alertMessage(0, i18n.t("PushNotification.SelectIOSCer"));
                                                        $('#push-box-submit').removeAttr('disabled', 'disabled');
                                                        return;
                                                }
                                        }
                                        // 推送证书问题 end
                                        // console.log(sendTime,groupId);
                                        // return false;
                                        //check aviable devices
                                        $.ajax({
                                                url: '/mxplay/data/push/uzmappush_chkdevice.json',
                                                type: 'post',
                                                data: postData,
                                                success: function(foo) {
                                                        if (foo.st == 1) {
                                                                if ((foo.msg).length > 0) {
                                                                        //param data object
                                                                        var data = {};
                                                                        data.curAppId = curAppId;
                                                                        if (pushToValue == 1) {
                                                                                data.platform = selectPlatform;
                                                                        } else {
                                                                                data.platform = '';
                                                                        }
                                                                        data.sendType = sendType;
                                                                        // data.sendTime = sendTime;
                                                                        data.state = state;
                                                                        data.taskType = taskType;
                                                                        data.sendCount = sendCount;
                                                                        data.successCount = successCount;
                                                                        data.totalCount = totalCount;
                                                                        data.sendContent = sendContent;
                                                                        data.sendTitle = sendTitle;
                                                                        data.api = 'uzampush_insert';
                                                                        data.groupId = strIcheckBoxInput;
                                                                        data.userIds = strPushIDText;
                                                                        data.targetType = targetType;
                                                                        addPushMsg(data);
                                                                } else {
                                                                        util.alertMessage(0, i18n.t("PushNotification.GroupNoUser"));
                                                                        $('#push-box-submit').removeAttr('disabled', 'disabled');
                                                                }
                                                        } else {
                                                                $('#push-box-submit').removeAttr('disabled', 'disabled');
                                                        }
                                                },
                                                error: function(XmlHttpRequest, textStatus, errorThrown) {
                                                        $('#push-box-submit').removeAttr('disabled', 'disabled');
                                                        alert("Add push msg - chk devices failure:" + XmlHttpRequest.responseText);
                                                }
                                        }); //ajax end
                                }
                        });
                });
                $('#push-box-out').on('hidden.bs.collapse', function() {
                        $('#create-new-push .arr-b').removeClass('active');
                        $('#notice-title').val('').trigger('input');
                        $('#notice-content').val('').trigger('input');
                        $('#time-choose').val('');
                        $('#push-box-out label.error').each(function(index, el) {
                                $(el).remove();
                        });
                });
                $('#create-new-push').on('click', function(event) {
                        if ($pushBox.hasClass('in')) {
                                $('#push-box').collapse('toggle');
                        } else {
                                if ($('#new-push-form').find('.switch-button-background').hasClass('checked')) {
                                        $('#push-box').collapse('toggle');
                                } else {
                                        util.alertMessage(0, i18n.t("PushNotification.switchBtn"));
                                }
                        }
                        event.preventDefault();
                });
                // 推送function
                var addPushMsg = function(postData) {
                        //invoke push insert url.
                        $.ajax({
                                url: '/mxplay/data/push/uzampush_insert.json',
                                type: 'post',
                                data: postData,
                                success: function(foo) {
                                        //refresh
                                        util.alertMessage(1, i18n.t("PushNotification.AddPushSucc"));
                                        setTimeout(function() {
                                                window.location.reload();
                                        },
                                        2000);
                                },
                                error: function(XmlHttpRequest, textStatus, errorThrown) {
                                        window.alert("Add push msg failure:" + XmlHttpRequest.responseText);
                                },
                                complete: function() {
                                        $('#push-box-submit').removeAttr('disabled', 'disabled');
                                }
                        }); //ajax end
                };
                //////////////////////////////////////////////////////////////////
                // 推送个人群组 2015-1-19
                $('#push-to input').iCheck({
                        checkboxClass: 'icheckbox_minimal-green',
                        radioClass: 'iradio_minimal-green',
                        increaseArea: '20%' // optional
                });
                $('#push-group input').iCheck({
                        checkboxClass: 'icheckbox_minimal-green',
                        radioClass: 'iradio_minimal-green',
                        increaseArea: '20%' // optional
                });
                $('#push-to input').on('ifClicked',
                function(event) {
                        var $this = $(this).eq(0);
                        var value = $this.val();
                        if (value == 1) {
                                $('#push-platform').show();
                                $('#row-group-push').hide();
                                $('#row-push-id').hide();
                                changeCurActivePerson(1);
                        }
                        if (value == 2) {
                                $('#push-platform').hide();
                                $('#row-group-push').show();
                                $('#row-push-id').hide();
                                changeCurActivePerson(2);
                        }
                        if (value == 3) {
                                $('#push-platform').hide();
                                $('#row-group-push').hide();
                                $('#row-push-id').show();
                                changeCurActivePerson(3);
                        }
                        event.preventDefault();
                });
                var setUserSpan = function(obj) {
                        var $this = obj;
                        var reg = /^.*,/;
                        var regTrim = /\s/g;
                        var str = $this.val().replace(regTrim, '');
                        var spanStr = '';
                        if (str && reg.test(str)) {
                                str = str.match(reg);
                                var strTmp = str[0].replace(/,/g, '');
                                if (strTmp == '') {
                                        return;
                                }
                                spanStr = '<span class="push-id-box"><span class="inner-text">' + strTmp + '</span><i class="close">×</i></span>';
                                $this.before(spanStr);
                                $this.val('');
                                changeCurActivePerson(3);
                        }
                };
                $('#push-id-input').on('input', function(event) {
                        var $this = $(this);
                        setUserSpan($this);
                        event.preventDefault();
                });
                $('#push-id-input').on('propertychange', function(event) {
                        var $this = $(this);
                        setUserSpan($this);
                        event.preventDefault();
                });
                $('#row-push-id').on('click', '.close', function(event) {
                        var $this = $(this);
                        var $span = $this.parents('.push-id-box');
                        $span.remove();
                        changeCurActivePerson(3);
                        event.preventDefault();
                });
                $('#push-group').on('ifClicked', 'input', function(event) {
                        setTimeout(function() {
                                changeCurActivePerson(2);
                        },
                        100);
                        event.preventDefault();
                });
                // row-group-push hidden
                // 推送个人群组 2015-1-19 end
                ////////////////////////////////////////////////////////////
                $('#push-platform input').iCheck({
                        checkboxClass: 'icheckbox_minimal-green',
                        radioClass: 'iradio_minimal-green',
                        increaseArea: '20%' // optional
                });
                $('#push-timing input').iCheck({
                        checkboxClass: 'icheckbox_minimal-green',
                        radioClass: 'iradio_minimal-green',
                        increaseArea: '20%' // optional
                });
                $('#timingRadios1').on('ifClicked', function(event) {
                        $('#time-choose').val('');
                        setTimeChoose(1);
                        event.preventDefault();
                });
                $('#timingRadios2').on('ifClicked', function(event) {
                        setTimeChoose(2);
                        event.preventDefault();
                });
                // $('#new-push-form input').iCheck({
                //     checkboxClass: 'icheckbox_minimal-green',
                //     radioClass: 'iradio_minimal-green',
                //     increaseArea: '20%' // optional
                // });
                var $newPushForm = $('#new-push-form');
                var $newConfigSubmit = $newPushForm.find('input:submit');
                var $chooseUploadSt = $('#choose-upload-st');
                // 提交设置
                $('#cert-pwd input').on('propertychange', function(event) {
                        if ($('#cert-pwd').hasClass('active')) {
                                if ($('#cert-pwd input').val() === '') {
                                        $newPushForm.find('input[type="submit"]').attr('disabled', 'disabled');
                                } else {
                                        $newPushForm.find('input[type="submit"]').removeAttr('disabled');
                                }
                        } else {

}
                        event.preventDefault();
                });
                $('#cert-pwd input').on('input', function(event) {
                        if ($('#cert-pwd').hasClass('active')) {
                                if ($('#cert-pwd input').val() === '') {
                                        $newPushForm.find('input[type="submit"]').attr('disabled', 'disabled');
                                } else {
                                        $newPushForm.find('input[type="submit"]').removeAttr('disabled');
                                }
                        } else {

}
                        event.preventDefault();
                });
                $newPushForm.validate({
                        // debug: true,
                        ignore: '',
                        submitHandler: function(form) {
                                var curAppId = $.cookie('curAppId');
                                $newConfigSubmit.attr('disabled', 'disabled');
                                var _status = $('#push-service').attr('value');
                                var _offlineMsgKeepHours = $hoursChoose.val();
                                var postData = {
                                        curAppId: curAppId,
                                        status: _status,
                                        offlineMsgKeepHours: _offlineMsgKeepHours
                                };
                                var _iosDisCerPath = $chooseUploadSt.attr('temp-url');
                                if (_iosDisCerPath) {
                                        postData.iosDisCerPass = $('#cert-pwd input').val();
                                        postData.iosDisCerPath = _iosDisCerPath;
                                }
                                // console.log(postData);
                                $.ajax({
                                        url: '/mxplay/data/push/pushsetting_update.json',
                                        type: 'post',
                                        data: postData,
                                        success: function(foo) {
                                                if (foo && foo.status) {
                                                        util.alertMessage(1, i18n.t("PushNotification.SettingSaveSucc"));
                                                        if (_iosDisCerPath) {
                                                                $chooseUploadSt.attr('saved-url', _iosDisCerPath);
                                                        }
                                                        $chooseUploadSt.attr('saved-switch', _status);
                                                        $chooseUploadSt.attr('saved-hours', _offlineMsgKeepHours);
                                                        $chooseUploadSt.attr('temp-url', '');
                                                        setConfigForm('hide');
                                                } else {
                                                        alert(errors.msmTip[foo.code]);
                                                }
                                        },
                                        error: function(XmlHttpRequest, textStatus, errorThrown) {
                                                $('#push-box-submit').removeAttr('disabled', 'disabled');
                                                alert("Add push config - failure:" + XmlHttpRequest.responseText);
                                        },
                                        complete: function() {
                                                $newConfigSubmit.removeAttr('disabled', 'disabled');
                                        }
                                }); //ajax end
                        }
                });
                //新建设置
                $('#push-config').on('click', function(event) {
                        if ($newPushForm.hasClass('active')) {
                                // $newPushForm.removeClass('active');
                                setConfigForm('hide');
                        } else {
                                // $newPushForm.addClass('active');
                                setConfigForm('show');
                        }
                        event.preventDefault();
                });
                // 设置显示隐藏初始化函数
                var $uploadPushImgbox = $('.upload-push-imgbox');
                var setConfigForm = function(st) {
                        var $newPushForm = $('#new-push-form');

                        $('#cert-pwd input').val('');
                        $('#cert-pwd').removeClass('active');
                        $newPushForm.find('input[type="submit"]').removeAttr('disabled');
                        var savedUrl = $chooseUploadSt.attr('saved-url');
                        var savedSwitch = $chooseUploadSt.attr('saved-switch');
                        var savedHours = $chooseUploadSt.attr('saved-hours');
                        $chooseUploadSt.attr('temp-url', '');
                        if (st === 'show') {
                                $newPushForm.addClass('active');
                                $hoursChoose.val(savedHours);
                                $sliderRange.slider('value', savedHours);
                                if (savedSwitch == 1) {
                                        $('#push-service:checkbox').switchButton({
                                                checked: true
                                        });
                                } else if (savedSwitch == 0) {
                                        $('#push-service:checkbox').switchButton({
                                                checked: false
                                        });
                                } else {
                                        $('#push-service:checkbox').switchButton({
                                                checked: false
                                        });
                                }
                                if (savedUrl) {

                                        $uploadPushImgbox.find('.push-imgbox-inner').removeClass('active');
                                        $uploadPushImgbox.find('.upload-push-label-d').removeClass('active');
                                        $newPushForm.find('.upload-push-uploaded').addClass('active');
                                        // $uploadPushImgbox.find('.upload-push-labels').removeClass('active');
                                } else {
                                        $uploadPushImgbox.find('.push-imgbox-inner').addClass('active');
                                        $uploadPushImgbox.find('.upload-push-label-d').addClass('active');
                                        $newPushForm.find('.upload-push-uploaded').removeClass('active');
                                        // $uploadPushImgbox.find('.upload-push-labels').addClass('active');
                                }
                                uploadCert();
                        } else if (st === 'hide') {
                                $newPushForm.removeClass('active');
                        } else {}
                };
                //上传推送证书
                var ifUploaded = false;
                var uploadCert = function() {
                        if (ifUploaded) {
                                return;
                        }
                        ifUploaded = true;
                        var uploader = WebUploader.create({
                                pick: '#upload-span',
                                //触发上传元素
                                swf: '/libs/webuploader/Uploader.swf',
                                //垃圾IE用的flash
                                server: '/api2/upload',
                                //服务器接口
                                formData: {
                                        upload_type: 'cert'
                                },
                                auto: true //选完文件后，是否自动上传
                        });
                        //文件上传成功
                        uploader.on('uploadSuccess', function(file, response) {
                                var res = response;
                                if (res && res.status) {
                                        $chooseUploadSt.attr('temp-url', res.result.path);
                                        $uploadPushImgbox.find('.push-imgbox-inner').removeClass('active');
                                        $newPushForm.find('.upload-push-uploaded').addClass('active');
                                        $('#cert-pwd').addClass('active');
                                        $newPushForm.find('input[type="submit"]').attr('disabled', 'disabled');
                                }
                        });
                        //文件加入队列之前
                        uploader.on('beforeFileQueued', function(file) {
                                var reg = /\.p12$/;
                                if (!reg.test(file.name.toLowerCase())) {
                                        alert(i18n.t("PushNotification.P12Format"));
                                        return false;
                                } else {
                                        uploader.upload();
                                }
                        });
                        //文件上传失败
                        uploader.on('uploadError', function(file) {
                                // console.log('upload icon error');
                        });
                        //上传完成，不管成功失败
                        uploader.on('uploadComplete',
                        function(file) {
                                uploader.removeFile(file);
                        });
                };
                // 推送设置，开关插件
                $('#push-service:checkbox').switchButton({
                        show_labels: false,
                        on_callback: function() {
                                // console.log('on');
                                $('#push-service').attr('value', '1');
                        },
                        off_callback: function() {
                                // console.log('off');
                                $('#push-service').attr('value', '0');
                        }
                });

                // $AndroidCertForm.find('.input-text-cert').removeAttr('disabled');
                // $AndroidCertForm.find('.upload-cert-labels').addClass('active');
                // $AndroidCertForm.find('.upload-cert-btns').addClass('active');
                //关闭推送设置弹出框
                var mainCallback = function(e) {
                        var $newPushForm = $('#new-push-form');
                        var $pushToContainer = $('#push-to-container');
                        if (!$newPushForm[0]) {
                                return;
                        }
                        var target = $(e.target);
                        if (!$.contains($newPushForm.get(0), e.target) && !target.is('#push-config') && !target.is('#new-push-form')) {
                                setConfigForm('hide');

                                // $newPushForm.removeClass('active');
                        }
                        if (!$.contains($pushToContainer.get(0), e.target) && !target.is('#push-to-container') && !target.is('#push-log .group-btn')) {
                                $pushToContainer.hide();
                        }
                };
                if (!initGlobalDomEvt) {
                        $('.mainWrap').on('click', mainCallback);
                        initGlobalDomEvt = true;
                }

                $newPushForm.on('click', 'input[type="button"]', function(event) {
                        $newPushForm.removeClass('active');
                        event.preventDefault();
                });

                // 字数限制
                // 按条件过滤消息历史
                var $pushLogBtns = $('#push-log .platform-btn-group').find('.btn');
                $pushLogBtns.on('click', function(event) {
                        var $this = $(this);
                        $pushLogBtns.each(function(index, el) {
                                $(el).removeClass('active');
                        });
                        $this.addClass('active');
                        var value = $this.attr('value');
                        var postData = {
                                si: 0,
                                ps: 5
                        };
                        var sTime = $('#text-picker').attr('data-range-start');
                        var eTime = $('#text-picker').attr('data-range-end');
                        if (value == -1) {

} else {
                                postData.status = value;
                        }
                        if (sTime && eTime) {
                                postData.bt = sTime;
                                postData.et = eTime;
                        } else {

}
                        getPushMessages(postData);
                        event.preventDefault();
                });
                // table内操作
                $pushLog.on('click', '.resend-push', function(event) {
                        if (confirm(i18n.t("PushNotification.RightRePush"))) {
                                var $tr = $(this).closest('tr');
                                var curAppId = $.cookie('curAppId');
                                var platform = $tr.find('.td4').attr('platform');
                                var sendType = '';
                                if ($tr.find('.td5').attr('is-tm') == 1) {
                                        sendType = 2;
                                } else {
                                        sendType = 1;
                                }
                                var taskType = $tr.find('.td1').attr('tasktype');
                                var sendTitle = $tr.find('.td2').html();
                                var sendContent = $tr.find('.td2').attr('messages-sendcontent');
                                var sendTime = $tr.find('.td5').attr('timer');
                                var groupId = $tr.find('.td3').attr('groupid');
                                var postData = {
                                        curAppId: curAppId,
                                        sendTitle: sendTitle,
                                        sendContent: sendContent,
                                        taskType: taskType,
                                        platform: platform,
                                        sendType: sendType,
                                        groupId: groupId
                                };
                                if (sendType == 2) {
                                        sendTime = parseInt(sendTime);
                                        postData.sendTime = sendTime;
                                }
                                addPushMsg(postData);
                                event.preventDefault();
                        } else {

}
                        event.preventDefault();
                });
                $pushLog.on('click', '.delete-push', function(event) {
                        var $this = $(this);
                        var id = $this.attr('del-id');
                        if (confirm(i18n.t("global.delConfirm"))) {
                                var curAppId = $.cookie('curAppId');
                                $.ajax({
                                        url: '/mxplay/data/push/uzampush_del.json',
                                        type: 'POST',
                                        data: {
                                                id: id,
                                                curAppId: curAppId
                                        }
                                }).done(function(data) {
                                        if (data.st == 1) {
                                                $this.closest('tr').animate({
                                                        'height': 'hide'
                                                },
                                                200);
                                        } else {
                                                alert(errors.msmTip[data.code]);
                                        }
                                        // console.log("success");
                                }).fail(function(data) {
                                        // console.log(data);
                                        // console.log("error");
                                }).always(function(data) {
                                        // console.log("complete");
                                });
                        } else {

}
                        event.preventDefault();
                });
                var siTemp = 0;
                $loadingMore.on('click', 'a', function(event) {
                        $loadingMore.hide();
                        loadingMore();
                });
                var loadingMore = function() {
                        siTemp += 5;
                        var sTime = $('#text-picker').attr('data-range-start');
                        var eTime = $('#text-picker').attr('data-range-end');
                        var value = $pushLog.find('.platform-btn-group a.active').attr('value');
                        var postData = {
                                si: siTemp,
                                ps: 5
                        };
                        if (value == -1) {} else {
                                postData.status = value;
                        }
                        if (sTime && eTime) {
                                postData.bt = sTime;
                                postData.et = eTime;
                        } else {}
                        getPushMessages(postData, 1);
                };

        };
});