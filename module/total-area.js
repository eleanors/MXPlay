define(['require', 'exports', 'module', 'Handlebars', './helper', 'jquery', 'cookie', 'echarts-map', 'pagination', '../libs/daterangepicker/picker'], function(require, exports, module, Handlebars, utils) {
      
        function init() {
                var data = getDataByTemplate() || {};
                var endDate = utils.Format(new Date(), 'yyyy-MM-dd');
                var sDate = new Date();
                sDate.setDate(sDate.getDate() - 6);
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
                $('#text-picker').on('apply.daterangepicker',
                function(ev, picker) {
                        startDate = picker.startDate.format('YYYY-MM-DD');
                        endDate = picker.endDate.format('YYYY-MM-DD');
                        loadData();
                });
                var trtemplate = '{{#each details}}' + '<tr>' + '    <td>{{area}}</td>' + '   <td>{{newUserCount}}</td>' + '    <td>{{newUserCountRatio}}</td>' + '    <td>{{startupCount}}</td>' + '</tr>' + '{{/each}}';
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
                data.details = data.details.sort(sortReg);
                $("#Pagination").pagination(data.pagetotal, {
                        num_display_entries: 10,
                        callback: pageselectCallback,
                        items_per_page: 1
                });
                var myChart = echarts.init(document.getElementById('areaMap'));
                var option = {
                        tooltip: {
                                show: true,
                                formatter: "{b}:{c}"
                        },
                        dataRange: {
                                min: 0,
                                max: 2500,
                                text: ['高', '低'],
                                calculable: true
                        },
                        series: [{
                                name: 'iphone3',
                                type: 'map',
                                mapType: 'china',
                                itemStyle: {
                                        normal: {
                                                label: {
                                                        show: true
                                                }
                                        },
                                        emphasis: {
                                                label: {
                                                        show: true
                                                }
                                        }
                                },
                                data: []
                        }]
                };
                setOptionData(data.newUserMap, option, myChart);
                $("button[id$='top']").on("click",
                function() {
                        $(this).addClass("active");
                        $("button[id$='top']").not(this).removeClass("active");
                });
                $("#newtop").on("click",
                function() {
                        data.details = data.details.sort(sortReg);
                        setOptionData(data.newUserMap, option, myChart);
                        $("#Pagination").pagination(data.pagetotal, {
                                num_display_entries: 10,
                                callback: pageselectCallback,
                                items_per_page: 1
                        });
                });

                $("#setuptop").on("click",
                function() {
                        data.details = data.details.sort(sortStartUp);
                        setOptionData(data.startupMap, option, myChart);
                        $("#Pagination").pagination(data.pagetotal, {
                                num_display_entries: 10,
                                callback: pageselectCallback,
                                items_per_page: 1
                        });
                });

                var detailsflag = true;
                $("#loading_more").on('click', function() {
                        if (detailsflag) {
                                $(this).addClass("active");
                                $(this).find("img").attr("src", "../assets/images/arr_b_pull.png");
                                $("#detailsTable").show();
                                $("#hideup").show();
                                detailsflag = false;
                        } else {
                                $(this).removeClass("active");
                                $(this).find("img").attr("src", "../assets/images/arr_b.png");
                                $("#detailsTable").hide();
                                $("#hideup").hide();
                                detailsflag = true;
                        }
                });
                $("#versionlist").on("click", 'a', function() {
                        $("#versionText").text($(this).text());
                        $("#versionCode").val($(this).attr("data-value"));
                        loadData();
                });
                function loadData() {
                        $.ajax({
                                url: '/getV2GeoStatisticDataByAppIdAndVersion',
                                method: "POST",
                                data: {
                                        'appId': $.cookie("curAppId"),
                                        'startDate': startDate,
                                        'endDate': endDate,
                                        'versionCode': $("#versionCode").val(),
                                        'times': new Date().getTime()
                                }
                        }).done(function(body) {
                                if (body && body.st == 1) {
                                        var xdata = body.msg;
                                        var regUser = {},
                                        regTotalUserCount = 0,
                                        devUser = {},
                                        startup = {};
                                        var allDevicesCount = 0;
                                        var lastDate;
                                        if (xdata.length > 0) {
                                                lastDate = utils.Format(new Date(xdata[0].reportDate), 'yyyy-MM-dd');
                                        }
                                        for (var i = 0,
                                        len = xdata.length; i < len; i++) {

                                                var version = xdata[i];
                                                var reportDate = utils.Format(new Date(version.reportDate), 'yyyy-MM-dd');
                                                var geoNewRegsResult = JSON.parse(version.geoNewRegsResult);
                                                for (var r = 0,
                                                rlen = geoNewRegsResult.length; r < rlen; r++) {
                                                        var reg = geoNewRegsResult[r];
                                                        regTotalUserCount += (reg.count || 0);
                                                        if (regUser[reg.city]) {
                                                                regUser[reg.city] = regUser[reg.city] + (reg.count || 0);
                                                        } else {
                                                                regUser[reg.city] = (reg.count || 0);
                                                        }
                                                }
                                                //只获取最后一天的数据
                                                if (lastDate == reportDate) {
                                                        var geoDevicesCountResult = JSON.parse(version.geoDevicesCountResult);
                                                        for (var d = 0,
                                                        dlen = geoDevicesCountResult.length; d < dlen; d++) {
                                                                var dev = geoDevicesCountResult[d];
                                                                allDevicesCount += (dev.count || 0);
                                                                if (devUser[dev.city]) {
                                                                        devUser[dev.city] = devUser[dev.city] + (dev.count || 0);
                                                                } else {
                                                                        devUser[dev.city] = (dev.count || 0);
                                                                }
                                                        }
                                                }

                                                var geoStartupCountResult = JSON.parse(version.geoStartupCountResult);
                                                for (var s = 0,
                                                slen = geoStartupCountResult.length; s < slen; s++) {
                                                        var start = geoStartupCountResult[s];
                                                        if (startup[start.city]) {
                                                                startup[start.city] = startup[start.city] + (start.count || 0);
                                                        } else {
                                                                startup[start.city] = (start.count || 0);
                                                        }
                                                }
                                        }
                                        var detailsData = [],
                                        startupMap = [],
                                        newUserMap = [];
                                        for (var key in devUser) {
                                                var devicesCount = regTotalUserCount; //devUser[key]||0;
                                                var regsCount = regUser[key] || 0;
                                                var startupCount = startup[key] || 0;
                                                var obj = {
                                                        area: key,
                                                        newUserCount: regsCount,
                                                        newUserCountRatio: (devicesCount > 0 ? Math.floor(regsCount / devicesCount * 100) : 0) + "%",

                                                        startupCount: startupCount
                                                }
                                                if (regsCount > 0 || startupCount > 0) detailsData.push(obj);
                                                if (regsCount > 0) newUserMap.push({
                                                        name: key,
                                                        value: regsCount
                                                });
                                                if (startupCount > 0) startupMap.push({
                                                        name: key,
                                                        value: startupCount
                                                });
                                        }
                                        data.details = detailsData;
                                        data.startupMap = startupMap;
                                        data.newUserMap = newUserMap;
                                        data.pagetotal = Math.ceil(detailsData.length / 10);
                                        $("button[id$='top'].active").trigger("click");
                                        $("#Pagination").pagination(data.pagetotal, {
                                                num_display_entries: 10,
                                                callback: pageselectCallback,
                                                items_per_page: 1
                                        });
                                }
                        })
                }
        }
        function sortReg(a, b) {
                return b.newUserCount - a.newUserCount;
        }
        function sortStartUp(a, b) {
                return b.startupCount - a.startupCount;
        }
        function setOptionData(d, option, myChart) {
                option.series[0].data = d;
                myChart.clear();
                myChart.setOption(option);
        }
        exports.init = init;
});