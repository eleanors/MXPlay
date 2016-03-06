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
                }, function(start, end, label) {
					
					
				});
                $('#text-picker').data('daterangepicker').setStartDate(startDate);
                $('#text-picker').data('daterangepicker').setEndDate(endDate);
                $('#text-picker').on('apply.daterangepicker', function(ev, picker) {
                        startDate = picker.startDate.format('YYYY-MM-DD');
                        endDate = picker.endDate.format('YYYY-MM-DD');
                        loadData();
                });
                var tab1template = '{{#each details}}' + '<tr>'
                //                +'    <td><input type="checkbox" value="{{id}}"/></td>'
                + '    <td class="title">{{errorAbstract}}</td>' + '    <td>{{appCode}}</td>' + '    <td>{{errorCount}}</td>' + '    <td>{{happenTime}}</td>' + '    <td><span data-page="{{../page_index}}" data-value="{{@index}}" class="listdetails">' + i18n.t("Total.Details") + '</span></td>' + '</tr>' + '{{/each}}';
                var tab2template = '{{#each details}}' + '<tr>' + '    <td class="title">{{errorAbstract}}</td>' + '    <td>{{appCode}}</td>' + '    <td>{{errorCount}}</td>' + '    <td>{{happenTime}}</td>' + '    <td><span data-value="{{id}}" class="listdetails">' + i18n.t("Total.Details") + '</span></td>' + '</tr>' + '{{/each}}';
				
				
                function pageselectCallback1(page_index) {
                        if (true) {
                                var start = page_index * 10,
                                len = data.tab1details.length;
                                var arr = [];
                                for (var i = 0; i < 10; i++) {
                                        if ((start + i) < len) arr.push(data.tab1details[start + i]);
                                }
                                var template = Handlebars.compile(tab1template);
                                var tpl = template({
                                        details: arr,
                                        page_index: page_index
                                });
                                $("#tab1 tbody").html(tpl);
                        } else {

}
                        return false;
                }
                function pageselectCallback2(page_index) {
                        if (true) {
                                var start = page_index * 10,
                                len = data.tab2details.length;
                                var arr = [];
                                for (var i = 0; i < 10; i++) {
                                        if ((start + i) < len) arr.push(data.tab2details[start + i]);
                                }
                                var template = Handlebars.compile(tab2template);
                                var tpl = template({
                                        details: arr
                                });
                                $("#tab2 tbody").html(tpl);
                        } else {

}
                        return false;
                }
                $("#Pagination1").pagination(data.tab1pagetotal, {
                        num_display_entries: 10,
                        callback: pageselectCallback1,
                        items_per_page: 1
                });
                $("#Pagination2").pagination(data.tab2pagetotal, {
                        num_display_entries: 10,
                        callback: pageselectCallback2,
                        items_per_page: 1
                });
                var myChart = echarts.init(document.getElementById('myCharts'));
                var option = {
                        tooltip: {
                                show: true,
                                formatter: "{b}<br/>{c}"
                        },
                        grid: {
                                y: 30,
                                x2: 30,
                                y2: 30
                        },
                        xAxis: [{
                                type: 'category',
                                data: [],
                                splitLine: {
                                        show: false
                                },
                                axisLine: {
                                        show: false
                                },
                                boundaryGap: [0.1, 0.1]
                        }],
                        yAxis: [{
                                type: 'value',
                                axisLine: {
                                        show: false
                                },
                                splitArea: {
                                        show: false
                                },
                                boundaryGap: [0, 0.1]
                        }],
                        series: [{
                                "type": "line",
                                "symbol": "emptyCircle",
                                'symbolSize': 3,
                                itemStyle: {
                                        normal: {
                                                color: '#4096b5',
                                                lineStyle: {
                                                        width: 3,
                                                        type: "solid"
                                                },
                                                areaStyle: {
                                                        color: '#a6c5f5'
                                                }
                                        },
                                        emphasis: {
                                                borderWidth: 3
                                        }
                                },
                                "data": []
                        }]
                };
                var flag = 7;
                var preseven = new Date();
                preseven.setDate(preseven.getDate() - flag);
                for (var i = 1; i <= flag; i++) {
                        var dstr = utils.getAddDate(preseven, 1);
                        if (data.xdata.indexOf(dstr) == -1) {
                                data.xdata.splice(i - 1, 0, dstr);
                                data.chartdata.splice(i - 1, 0, 0);
                        }
                }
                option.xAxis[0].data = data.xdata;
                option.series[0].data = data.chartdata;
                // 为echarts对象加载数据
                myChart.setOption(option);

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

                $("#detailsTable .navTab th").on("click", function() {
                        $(this).addClass("active");
                        $(this).siblings().removeClass("active");
                        if ($(this).index() == 0) {
                                $("#tab1").show();
                                $("#tab2").hide();
                                $("#repair").show();
                                $("#unrepair").hide();
                        } else {
                                $("#tab1").hide();
                                $("#tab2").show();
                                $("#repair").hide();
                                $("#unrepair").show();
                        }
                });
                $("#errorDetails .navTab th").on("click", function() {
                        $(this).addClass("active");
                        $(this).siblings().removeClass("active");
                        if ($(this).index() == 0) {
                                $("#detailsError").show();
                                $("#detailsData").hide();
                        } else {
                                $("#detailsError").hide();
                                $("#detailsData").show();
                        }
                });
                $("#tab1 th input[type='checkbox']").click(function() {
                        if (this.checked) {
                                $("#tab1 td input[type='checkbox']").each(function() {
                                        this.checked = true;
                                });
                        } else {
                                $("#tab1 td input[type='checkbox']").each(function() {
                                        this.checked = false;
                                });
                        }
                })

                $("#tab1, #tab2").on("click", ".listdetails", function() {
                        $("#detailsTable").slideUp();
                        $("#errorDetails").slideDown();
                        var errorStr;
                        var cur = $(this).attr("data-value") || "0";
                        var page = $(this).attr("data-page") || "0";
                        var index = parseInt(page, 10) * 10 + parseInt(cur, 10);
                        var currentData = data.tab1details[index];

                        $.ajax({
                                url: '/getV2ExcepContentByTitle',
                                method: "POST",
                                data: {
                                        title: currentData.errorAbstract
                                }
                        }).done(function(resp) {
                                if (resp && resp.st == 1) {
                                        var kstr = "";
                                        for (var k = 0,
                                        len = resp.msg.length; k < len; k++) {
                                                kstr += resp.msg[k].content;
                                                kstr += "\n";
                                        }
                                        $("#kre").html(kstr);
                                        var arr = currentData.modalData || [];
                                        var temp = '{{#each errordetails}}' + '<tr>' + '    <td>{{deviceName}}</td>' + '    <td>{{OSCount}}</td>' + '    <td>{{errorCount}}</td>' + '</tr>' + '{{/each}}';
                                        var template = Handlebars.compile(temp);
                                        var tpl = template({
                                                errordetails: arr
                                        });
                                        $("#detailsData tbody").html(tpl);
                                }
                        })

                });
                $("#closeErrorDetails").on("click", function() {
                        $("#detailsTable").slideDown();
                        $("#errorDetails").slideUp();
                });
				
                function dateFromISO8601(isoDateString) {
                        var parts = isoDateString.match(/\d+/g);
                        var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
                        var isoDate = new Date(isoTime);

                        return isoDate;
                }
				
                function loadData() {
                        $.ajax({
                                url: '/mxplay/data/total/getV2ExcepStatisticDataByAblumId.json',
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
                                        var bgdata = body.msg;
                                        var excep = {};
                                        var chart = {};
                                        for (var i = 0,
                                        len = bgdata.length; i < len; i++) {
                                                var version = bgdata[i];
                                                var chartKey = utils.toFormat(dateFromISO8601(version.reportDate), 'MM-dd');
                                                if (chart[chartKey]) {
                                                        chart[chartKey] += version.excepCount;
                                                } else {
                                                        chart[chartKey] = version.excepCount
                                                }
                                                var key = version.excepTitle + version.versionCode;
                                                if (excep[key]) {
                                                        var temp = excep[key];
                                                        var modalKey = version.model + version.systemVersion;
                                                        if (temp.modalData[modalKey]) {
                                                                temp.modalData[modalKey].excepCount += version.excepCount;
                                                        } else {
                                                                temp.modalData[modalKey] = {
                                                                        'deviceName': version.model,
                                                                        'OSCount': version.systemVersion,
                                                                        'errorCount': version.excepCount
                                                                };
                                                        }
                                                        temp.errorCount += version.excepCount;
                                                        excep[key] = temp;
                                                } else {
                                                        var obj = {};
                                                        var modalKey = version.model + version.systemVersion;
                                                        obj[modalKey] = {
                                                                'deviceName': version.model,
                                                                'OSCount': version.systemVersion,
                                                                'errorCount': version.excepCount
                                                        };
                                                        excep[key] = {
                                                                'appCode': version.versionCode,
                                                                'errorAbstract': version.excepTitle,
                                                                'happenTime': utils.toFormat(dateFromISO8601(version.reportDate), 'yyyy-MM-dd hh:mm:ss'),
                                                                'errorCount': version.excepCount,
                                                                'modalData': obj
                                                        }
                                                }
                                        }
                                        var tab1DetailsData = [];
                                        for (var key in excep) {
                                                tab1DetailsData.push(excep[key]);
                                        }
                                        var xdata = [],
                                        chartdata = [];
                                        for (var key in chart) {
                                                xdata.unshift(key);
                                                chartdata.unshift(chart[key]);
                                        }

                                        data.xdata = xdata;
                                        data.chartdata = chartdata;
                                        data.tab1details = tab1DetailsData;
                                        data.tab2details = tab1DetailsData;
                                        data.tab1pagetotal = Math.ceil(tab1DetailsData.length / 10);
                                        data.tab2pagetotal = Math.ceil(tab1DetailsData.length / 10);
                                        var preStartDate = new Date(startDate.replace(/[-]/g, "/"));
                                        var preEndDate = new Date(endDate.replace(/[-]/g, "/"));
                                        var i = 0;
                                        while (preStartDate.getTime() < preEndDate.getTime()) {
                                                var dstr = utils.Format(preStartDate, 'MM-dd');
                                                if (data.xdata.indexOf(dstr) == -1) {
                                                        data.xdata.splice(i, 0, dstr);
                                                        data.chartdata.splice(i, 0, 0);
                                                }
                                                utils.getAddDate(preStartDate, 1);
                                                i++;
                                        }
                                        option.xAxis[0].data = data.xdata;
                                        setOptionData(data.chartdata, option, myChart); 
										$("#Pagination1").pagination(data.tab1pagetotal, {
                                                num_display_entries: 10,
                                                callback: pageselectCallback1,
                                                items_per_page: 1
                                        });
                                        $("#Pagination2").pagination(data.tab2pagetotal, {
                                                num_display_entries: 10,
                                                callback: pageselectCallback2,
                                                items_per_page: 1
                                        });
                                }
                        })
                }
        }
        function setOptionData(data, option, myChart) {
                option.series[0].data = data;
                myChart.clear();
                myChart.setOption(option);
        }
        exports.init = init;
});