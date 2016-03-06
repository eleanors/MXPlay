define(['require', 'exports', 'module', 'Handlebars', './helper', 'jquery', 'cookie', 'echarts-map', 'pagination', '../libs/daterangepicker/picker'], function(require, exports, module, Handlebars, utils) {
      
        function init() {
                var data = getDataByTemplate() || {};
                var endDate = utils.Format(new Date(), 'yyyy-MM-dd');
                var sDate = new Date();
                var startDate = utils.Format(sDate, 'yyyy-MM-dd');
                $('#text-picker').daterangepicker({
                        format: 'YYYY-M-D',
                        opens: 'left'
                },
                function(start, end, label) {
                        // console.log(start.toISOString(), end.toISOString(), label);
                });
                $('#text-picker').data('daterangepicker').setStartDate(startDate);
                $('#text-picker').data('daterangepicker').setEndDate(endDate);
                $('#text-picker').on('apply.daterangepicker', function(ev, picker) {
                        loadData(0, picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
                });
                $('#text-picker').on('delete.daterangepicker', function(ddd) {
                        //$("#seventop").trigger("click");
                })

                var trtemplate = '{{#each details}}' + '<tr>' + '<td>{{versionCode}}</td>' + '<td>{{versionTotalUserCount}}</td>' + '<td>{{versionNewUserCount}}</td>' + '<td>{{versionUpdateUserCount}}</td>' + '    <td>{{versionNewOrUpdateUserCount}}</td>' + '<td>{{startupCount}}</td>' + '</tr>' + '{{/each}}';
                function pageselectCallback(page_index) {
                        if (true) {
                                var start = page_index * 10,
                                len = data.details.length;
                                var arr = [];
                                for (var i = 0; i < 10; i++) {
                                        if ((start + i) < len) arr.push(data.details[start + i]);
                                }
                                var template = Handlebars.compile(trtemplate);
                                var tpl = template({
                                        details: arr
                                });
                                $("#detailsTable tbody").html(tpl);
                        } else {

}
                        return false;
                }
                $("#Pagination").pagination(data.pagetotal, {
                        num_display_entries: 10,
                        callback: pageselectCallback,
                        items_per_page: 1
                });
                $("button[id$='top']").on("click", function() {
                        $(this).addClass("active");
                        $("button[id$='top']").not(this).removeClass("active");
                });
                $("#seventop").on("click", function() {
                        loadData(1);
                });
                $("#thirtytop").on("click", function() {
                        loadData(2);
                });
                function loadData(flag, startd, endd) {
                        $(".butterbar").removeClass("hide").addClass("active");
                        var sd, ed;
                        if (flag) {
                                var startDate = new Date();
                                startDate.setDate(startDate.getDate() - flag + 1);
                                var endDate = startDate;
                                sd = utils.Format(startDate, "yyyy-MM-dd");
                                ed = utils.Format(endDate, "yyyy-MM-dd");
                        } else {
                                sd = startd;
                                ed = endd;
                        }
                        $.ajax({
                                url: '/mxplay/data/getStatisticDataByAlbumAndDate.json',
                                method: "POST",
                                data: {
                                        'appId': $.cookie("curAppId"),
                                        'startDate': sd,
                                        'endDate': ed,
                                        'times': new Date().getTime()
                                }
                        }).done(function(body) {
                                $(".butterbar").removeClass("active").addClass("hide");
                                if (body && body.st == 1) {
                                        var detailsData = [],
                                        list;
                                        list = body.msg;
                                        var codeMap = {};
                                        for (var i = 0,
                                        len = list.length; i < len; i++) {
                                                var temp = list[i];
                                                var cm = codeMap[temp.versionCode];
                                                var obj = {
                                                        versionCode: temp.versionCode || "",
                                                        versionTotalUserCount: temp.devicesCount || 0,
                                                        versionNewUserCount: temp.newRegsCount || 0,
                                                        versionUpdateUserCount: temp.newUpdateCount || 0,
                                                        versionNewOrUpdateUserCount: (temp.newRegsCount || 0) + (temp.newUpdateCount || 0),
                                                        activeUserCount: temp.newActiveCount,
                                                        startupCount: temp.totalOperations
                                                };
                                                if (cm) {
                                                        obj.versionTotalUserCount = cm.versionTotalUserCount;
                                                        obj.versionNewUserCount += cm.versionNewUserCount;
                                                        obj.versionUpdateUserCount += cm.versionUpdateUserCount;
                                                        obj.versionNewOrUpdateUserCount += cm.versionNewOrUpdateUserCount;
                                                        obj.activeUserCount += cm.activeUserCount;
                                                        obj.startupCount += cm.startupCount;
                                                }
                                                codeMap[temp.versionCode] = obj;
                                        }
                                        for (var key in codeMap) {
                                                detailsData.push(codeMap[key]);
                                        }

                                        data.details = detailsData;
                                        data.pagetotal = Math.ceil(detailsData.length / 10);
                                        $("#Pagination").pagination(data.pagetotal, {
                                                num_display_entries: 10,
                                                callback: pageselectCallback,
                                                items_per_page: 1
                                        });
                                }
                        })
                }
        }
        exports.init = init;
});