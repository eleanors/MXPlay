define(function (require, exports, module) {
	
    exports.init = function(){
	console.log('appoverview module')
	
	/*****
    var $ = require("jquery");
    var util = require('./utils.js');
    var errors=require("msmErrors");
    require('jqui');
    require('validate');
    exports.init = function(){

        // appType 关系 代码页
        $.cookie('appType',$('#app-info').attr('apptype'),{ expires: 7 });

        //////
        $('#CADAppInfo .detail a.del').on('click', function(event) {
            if (confirm(i18n.t('appInfo.delConfirm'))) {
                $(this).addClass('deleapp').html('');
                $.ajax({
                    url: '/delApp',
                    type: 'POST',
                    data: {
                        appId: $.cookie('curAppId'),
                        timepicker:new Date().getTime()
                    }
                })
                .done(function(data) {
                    if (data.status == 1) {
                        $.removeCookie('curAppId');
                        $.removeCookie('curAppName');
                        location.reload();
                    } else{
                        alert(errors.msmTip[data.code]);
                    }
                })
                .fail(function(data) {
                });
                
            } else{
            }
            event.preventDefault();
        });
        // appstatus
        var statInfo = $('#stat-info');
        var statInfoTds = statInfo.find('td');
        var setAppStatus = function(){
            var info = statInfo.attr('stat-info');
            //修改过，去掉了icon状态的显示
            var tempArr = info.split('');
            var arr = [];
            if (tempArr[0] == 1 || tempArr[1] == 1) {
                arr.push(1);
            } else {
                arr.push(0);
            }
            for (var j = 2,k = tempArr.length; j < k; j++) {
                arr.push(tempArr[j]);
            }
            info = arr.join('');
            for (var i = 0; i < info.length; i++) {
                if(info.charAt(i) == 1){
                    statInfoTds.eq(i).addClass('active');
                    statInfoTds.eq(i+5).addClass('active');
                }else{
                    statInfoTds.eq(i).removeClass('active');
                    statInfoTds.eq(i+5).removeClass('active');
                }
            }
        };
        setAppStatus();

        // set smAuthority_manuAuth
        ////////////// 添加了eq，可以考虑删除 /////////////////
        var smAuthorityManuAuth = $('#smAuthority_manuAuth');
        var setAuthorityManuAuth = function(){
            var info = smAuthorityManuAuth.attr('manuauth');
            if (info == 1) {
                smAuthorityManuAuth.text(i18n.t('common.manual'));
            } else if (info == 2) {
                smAuthorityManuAuth.text(i18n.t('appInfo.auto'));
            } else {
                smAuthorityManuAuth.text(i18n.t('common.close'));
            }
        };
        setAuthorityManuAuth();

        // set memberList
        // 成员列表 成员管理，暂时不用这个展示方式
        // var setMemberList = function(){
        //     var memberList = '';
        //     var members = [];
        //     // var mamUsers = eval('('+$('#members_mam').attr('mam')+')');
        //     // var cadUsers = eval('('+$('#members_cad').attr('cad')+')');
        //     // var msmUsers = eval('('+$('#members_msm').attr('msm')+')');
        //     // var mcmUsers = eval('('+$('#members_mcm').attr('mcm')+')');
        //     members[0] = $('#members_mam').attr('mam').split(',');
        //     members[1] = $('#members_cad').attr('cad').split(',');
        //     members[2] = $('#members_msm').attr('msm').split(',');
        //     members[3] = $('#members_mcm').attr('mcm').split(',');
        //     var maxLength = 0;
        //     for (var i = members.length - 1; i >= 0; i--) {
        //         if (members[i].length >maxLength){
        //             maxLength = members[i].length;
        //         }
        //     };
        //     for (var j = 0; j < maxLength; j++) {
        //         if (j == 0) {
        //             $('#project-info .member .tr0').html('<td>'+(members[0][j]||'')+'</td><td>'+(members[1][j]||'')+'</td><td>'+(members[2][j]||'')+'</td><td>'+(members[3][j]||'')+'</td>');
        //         } else if (j == 1) {
        //             $('#project-info .member .tr1').html('<td>'+(members[0][j]||'')+'</td><td>'+(members[1][j]||'')+'</td><td>'+(members[2][j]||'')+'</td><td>'+(members[3][j]||'')+'</td>');
        //         } else {
        //             memberList+= '<tr><td>'+(members[0][j]||'')+'</td><td>'+(members[1][j]||'')+'</td><td>'+(members[2][j]||'')+'</td><td>'+(members[3][j]||'')+'</td></tr>';
        //         }
                
        //     };
        //     $('#project-info .member .detail').html(memberList);
        // };
        // setMemberList();
        //toggle app description
        $('#app-info').on('click','a.toggleDes',function(){
            var $this = $(this);
            var $summary = $this.prevAll('.summary');
            var pos = $summary.position();
            var $detail = $this.prev('.detail');
            $detail.css({
                top: pos.top+ 'px'
            });
            $detail.animate({'height':'show'},'fast');
            $('.wrapper').on('hideDetail',function(e){
                $detail.animate({'height':'hide'},'fast');
            });
            return false;
        });
        //toggle code note
        $('#code-info').on('click','a.toggleNote',function(){
            var $this = $(this);
            var pos = $this.position();
            var top = pos.top-37;
            var $detail = $('#code-info').find('.detail');
            $detail.css({
                top: top+ 'px'
            });
            // $this.animate({'height':'hide'},'fast');
            $detail.animate({'height':'show'},'fast');
            $('.wrapper').on('hideDetail',function(e){
                $this.animate({'height':'show'},'fast');
                $detail.animate({'height':'hide'},'fast');
            });
            return false;
        });

        //toggle member table
        $('#project-info').on('click','a.toggleMember',function(){
            var $this = $(this);
            var $detail = $('#project-info').find('.detail');
            var $section = $this.closest('.section');
            $detail.animate({'height':'show'}, 'fast');
            $this.animate({'height':'hide'}, 'fast');
            $section.css('height','auto');
            $('.wrapper').on('hideDetail',function(e){
                $this.animate({'height':'show'}, 'fast');
                $section.height(140);
                $detail.animate({'height':'hide'}, 'fast');
            });
            return false;
        });
        $('p.detail').on('click', '.toggleDesUp', function(event) {
            var $this = $(this);
            $this.closest('p.detail').animate({'height':'hide'},'fast');
            event.preventDefault();
        });
        $(document.body).on('click',function(e){
            // if(!$(e.target).hasClass('detail')){
            //     $('.wrapper').trigger('hideDetail');
            // }
            if (($(e.target).hasClass('detail')) || ($(e.target).parents('.detail').length > 0)) {
                
            } else {
                $('.wrapper').trigger('hideDetail');
            }
        });
        $('.toPackageHistory').on('click', function(event) {
            $.cookie('ifPackageList','true',{ expires: 7 });
        });
        //成员列表展开
        $('#overviewMemberPanel-btn').on('click', function(event) {
            // if ($('#overviewMemberPanel').hasClass('active')) {
            //     $('#overviewMemberPanel').animate({
            //         height: '140px'
            //     },'fast', function() {
            //         $('#overviewMemberPanel-btn').removeClass('active');
            //     });
            // } else{
            //     $('#overviewMemberPanel').addClass('active');
            //     $('#overviewMemberPanel').animate({
            //         height: '100%'
            //     },'fast', function() {
            //         $('#overviewMemberPanel-btn').addClass('active');
            //     });
            // }
            $('#overviewMemberPanel-btn').toggleClass('active');
            $('#overviewMemberPanel').toggleClass('active');
            event.preventDefault();
        });

        //移交应用
        var $transfer = $('#CADAppInfo .profile-desk a.transfer');
        var $transferDialog;
        $transfer.on('click', function(){
            $transferDialog = $('#transfer-dialog');
            var options = {
                appendTo: '.mainWrap',
                dialogClass: 'transfer-dialog',
                title: i18n.t('appInfo.transferApp'),
                resizable: false,
                maxHeight: 400,
                minWidth: 500,
                modal: true
            };
            if (!$transferDialog.get(0)) {
                var htmlStr = '<div id="transfer-dialog">'+
                    '<form role="form" class="form-horizontal" id="transfer-app" method="post">'+
                        '<p class="note">'+ i18n.t('appInfo.transferNote') +'</p>'+
                        '<div class="form-group accepter-con">'+
                            '<label for="accepter" class="col-sm-3 control-label">'+ i18n.t('appInfo.accepter') +': </label>'+
                            '<div class="col-sm-9 accepter-input">'+
                                '<input type="text" class="form-control" name="accepter" id="accepter">'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<div class="btns">'+
                                '<button type="submit" class="btn transfer">'+ i18n.t('appInfo.transfer') +'</button>'+
                                '<button type="button" class="btn cancel">'+ i18n.t('global.Cancel') +'</button>'+
                            '</div>'+
                        '</div>'+
                    '</form>'+
                '</div>';
                $transferDialog = $(htmlStr);
                $transferDialog.dialog(options);
            }else{
                $transferDialog.dialog(options);
            }

            //transfer
            var $transferAppFrm = $('#transfer-app');
            var $transErr = $transferAppFrm.find('.error');
            $transferAppFrm.validate({
                rules: {
                    accepter: {
                        required: true
                    }
                },
                messages: {
                    accepter: {
                        required: i18n.t('appInfo.transferErr')
                    }
                },
                submitHandler: function(form){
                    var accepter = $('#accepter').val();
                    var $submit = $transferAppFrm.find('.transfer');
                    $submit.attr('disabled', 'disabled');
                    $.ajax({
                        url: '/api/cooperator/appmove',
                        type: 'POST',
                        data: {
                            email: accepter,
                            appId: $.cookie('curAppId')
                        },
                        success: function(data, sta, xhr){
                            if(data.status){
                                alert(i18n.t('appInfo.transferSucc'));
                                $.removeCookie('curAppId');
                                $.removeCookie('curAppName');
                                location.reload();
                            }else{
                                var errMsg = errors.msmTip[data.code];
                                if(errMsg){
                                    alert(errMsg);
                                }
                            }
                            $submit.removeAttr('disabled');
                        }
                    });
                }
            });

            //cancel
            $transferDialog.find('.cancel').on('click', function () {
                $transferDialog.dialog('close');
            });
        });

    };*/
};
});