define(['require', 'exports', 'module', 'Handlebars', './helper', 'jquery', 'cookie', 'echarts-map', 'pagination', '../libs/daterangepicker/picker'], function(require, exports, module, Handlebars, utils) {

        function init() {
                var data = getDataByTemplate() || {};
                var endDate = utils.Format(new Date(), 'yyyy-MM-dd');
                var sDate = new Date();
                sDate.setDate(sDate.getDate() - 6);
                var startDate = utils.Format(sDate, 'yyyy-MM-dd');
                var tableId = "mostTable";
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
                $("#versionlist").on("click", 'a',
                function() {
                        $("#versionText").text($(this).text());
                        $("#versionCode").val($(this).attr("data-value"));
                        loadData();
                });
                var trtemplate = '{{#each details}}' + '<tr>' + '    <td>{{description}}</td>' + '    <td>{{newUserCount}}</td>' + '    <td>{{newUserCountRatio}}</td>' + '</tr>' + '{{/each}}';
                var otherTemplate = '{{#each details}}' + '<tr>' + '    <td>{{description}}</td>' + '    <td>{{startupCount}}</td>' + '    <td>{{startupCountRatio}}</td>' + '</tr>' + '{{/each}}';
                function pageselectCallback(page_index) {
                        if (true) {
                                var start = page_index * 10,
                                len = data.details.length;
                                var arr = [];
                                for (var i = 0; i < 10; i++) {
                                        if ((start + i) < len) arr.push(data.details[start + i]);
                                }
                                var temp = trtemplate;
                                if (tableId == "otherTable") temp = otherTemplate;
                                var template = Handlebars.compile(temp);
                                var tpl = template({
                                        details: arr
                                });
                                $("#" + tableId + " tbody").html(tpl);
                        } else {

}
                        return false;
                }
                data.details = data.typeDetails;
                $("#Pagination").pagination(data.typepagetotal, {
                        num_display_entries: 10,
                        callback: pageselectCallback,
                        items_per_page: 1
                });
                var myChart = echarts.init(document.getElementById('myCharts'));
                var option = {
                        tooltip: {
                                show: true,
                                formatter: "{b}<br/>{a}:{c}"
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
                                axisLabel: {
                                        show: true,
                                        interval: 0
                                }
                        }],
                        yAxis: [{
                                type: 'value',
                                axisLine: {
                                        show: false
                                },
                                splitArea: {
                                        show: false
                                }
                        }],
                        series: [{
                                name: "新增用户",
                                "type": "bar",
                                barWidth: 20,
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
                if (data.xtype.length == 0) {
                        data.xtype = ['iPhone 5s', 'iPhone 5', 'iPhone 4s', 'iPhone 4', 'Galaxy Note3'];
                        data.typeData = [0, 0, 0, 0, 0];
                }
                option.xAxis[0].data = data.xtype;
                setOptionData(data.typeData, option, myChart);
                $("button[id$='top']").on("click",
                function() {
                        $(this).addClass("active");
                        $("button[id$='top']").not(this).removeClass("active");
                });
                $("#typetop").on("click", function() {
                        if (data.xtype.length == 0) {
                                data.xtype = ['iPhone 5s', 'iPhone 5', 'iPhone 4s', 'iPhone 4', 'Galaxy Note3'];
                                data.typeData = [0, 0, 0, 0, 0];
                        }
                        option.xAxis[0].data = data.xtype;
                        option.series[0].name = i18n.t("Total.NewUsers");
                        setOptionData(data.typeData, option, myChart);
                        tableId = "mostTable";
                        $("#mostTable").show();
                        $("#otherTable").hide();
                        $("#detailsTable thead th:first").text(i18n.t("Total.DeviceModel"));
                        data.details = data.typeDetails;
                        $("#Pagination").pagination(data.typepagetotal, {
                                num_display_entries: 10,
                                callback: pageselectCallback,
                                items_per_page: 1
                        });
                });
                $("#resolutiontop").on("click",
                function() {
                        if (data.xresolution.length == 0) {
                                data.xresolution = ['1136*640', '960*640', '1920*1080', '2048*1536'];
                                data.resolutionData = [0, 0, 0, 0];
                        }
                        option.xAxis[0].data = data.xresolution;
                        option.series[0].name = i18n.t("Total.NewUsers");
                        setOptionData(data.resolutionData, option, myChart);
                        tableId = "mostTable";
                        $("#mostTable").show();
                        $("#otherTable").hide();
                        $("#detailsTable thead th:first").text(i18n.t("Total.Resolution"));
                        data.details = data.resolutionDetails;
                        $("#Pagination").pagination(data.resolutionpagetotal, {
                                num_display_entries: 10,
                                callback: pageselectCallback,
                                items_per_page: 1
                        });
                });
                $("#ostop").on("click",
                function() {
                        if (data.xos.length == 0) {
                                data.xos = ['ios 7.1', 'ios 6.1.4', 'android 4.2.2'];
                                data.osData = [0, 0, 0];
                        }
                        option.xAxis[0].data = data.xos;
                        option.series[0].name = i18n.t("Total.NewUsers");
                        setOptionData(data.osData, option, myChart);
                        tableId = "mostTable";
                        $("#mostTable").show();
                        $("#otherTable").hide();
                        $("#detailsTable thead th:first").text(i18n.t("Total.OS"));
                        data.details = data.osDetails;
                        $("#Pagination").pagination(data.ospagetotal, {
                                num_display_entries: 10,
                                callback: pageselectCallback,
                                items_per_page: 1
                        });
                });
                $("#nettop").on("click",
                function() {
                        var arrType = ['WIFI', '2G', '3G', '4G'];
                        for (var i = 0,
                        len = arrType.length; i < len; i++) {
                                var dstr = arrType[i];
                                if (data.xnet.indexOf(dstr) == -1) {
                                        data.xnet.splice(i, 0, dstr);
                                        data.netData.splice(i, 0, 0);
                                }
                        }
                        option.xAxis[0].data = data.xnet;
                        option.series[0].name = i18n.t("Total.Sessions");
                        setOptionData(data.netData, option, myChart);
                        tableId = "otherTable";
                        $("#mostTable").hide();
                        $("#otherTable").show();
                        data.details = data.netDetails;
                        $("#Pagination").pagination(data.netpagetotal, {
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
                                detailsflag = false;
                        } else {
                                $(this).removeClass("active");
                                $(this).find("img").attr("src", "../assets/images/arr_b.png");
                                $("#detailsTable").hide();
                                detailsflag = true;
                        }
                });
                function sortNumber(a, b) {
                        return b.value - a.value;
                }
                function sortTable1(a, b) {
                        return b.newUserCount - a.newUserCount;
                }

                function sortTable2(a, b) {
                        return b.connTypeCount - a.connTypeCount;
                }
                function loadData() {
                        $.ajax({
                                url: '/getV2DeviceStatisticDataByAppIdAndDate',
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
                                        var regType = {},
                                        totalType = {},
                                        totalTypeCount = 0,
                                        regTypeCount = 0;
                                        var regResolution = {},
                                        totalResolution = {},
                                        totalResolutionCount = 0,
                                        regResolutionCount = 0;
                                        var regOs = {},
                                        totalOs = {},
                                        totalOsCount = 0,
                                        regOsCount = 0;
                                        var connTypeNet = {},
                                        totalNet = {},
                                        totalNetCount = 0,
                                        connTypeNetCount = 0;
                                        var versionCodeList = [];
                                        var lastDate;
                                        if (bgdata.length > 0) {
                                                lastDate = utils.Format(new Date(bgdata[0].reportDate), 'yyyy-MM-dd');
                                        }
                                        for (var x = 0,
                                        xlen = bgdata.length; x < xlen; x++) {

                                                var version = bgdata[x];
                                                var reportDate = utils.Format(new Date(version.reportDate), 'yyyy-MM-dd');
                                                if (versionCodeList.indexOf(version.versionCode) == -1) {
                                                        versionCodeList.push(version.versionCode);
                                                }
                                                var modelNewRegsResult = JSON.parse(version.modelNewRegsResult);
                                                for (var i = 0,
                                                len = modelNewRegsResult.length; i < len; i++) {
                                                        var item = modelNewRegsResult[i];
                                                        regTypeCount += (item.count || 0);
                                                        if (regType[item.model]) {
                                                                regType[item.model] = regType[item.model] + (item.count || 0);
                                                        } else {
                                                                regType[item.model] = (item.count || 0);
                                                        }
                                                }

                                                var resolutionNewRegsResult = JSON.parse(version.resolutionNewRegsResult);
                                                for (var i = 0,
                                                len = resolutionNewRegsResult.length; i < len; i++) {
                                                        var item = resolutionNewRegsResult[i];
                                                        regResolutionCount += (item.count || 0);
                                                        if (regResolution[item.resolution]) {
                                                                regResolution[item.resolution] = regResolution[item.resolution] + (item.count || 0);
                                                        } else {
                                                                regResolution[item.resolution] = (item.count || 0);
                                                        }
                                                }

                                                var osNewRegsResult = JSON.parse(version.osNewRegsResult);
                                                for (var i = 0,
                                                len = osNewRegsResult.length; i < len; i++) {
                                                        var item = osNewRegsResult[i];
                                                        regOsCount += (item.count || 0);
                                                        if (regOs[item.os]) {
                                                                regOs[item.os] = regOs[item.os] + (item.count || 0);
                                                        } else {
                                                                regOs[item.os] = (item.count || 0);
                                                        }
                                                }

                                                var connTypeResult = JSON.parse(version.connTypeResult);
                                                for (var i = 0,
                                                len = connTypeResult.length; i < len; i++) {
                                                        var item = connTypeResult[i];
                                                        var connType = item.connType.toUpperCase();
                                                        connTypeNetCount += (item.count || 0);
                                                        if (connTypeNet[connType]) {
                                                                connTypeNet[connType] = connTypeNet[connType] + (item.count || 0);
                                                        } else {
                                                                connTypeNet[connType] = (item.count || 0);
                                                        }
                                                }

                                                //只获取最后一天的数据
                                                if (lastDate == reportDate) {
                                                        var modelTotalResult = JSON.parse(version.modelTotalResult);
                                                        for (var i = 0,
                                                        len = modelTotalResult.length; i < len; i++) {
                                                                var item = modelTotalResult[i];
                                                                totalTypeCount += (item.count || 0);
                                                                if (totalType[item.model]) {
                                                                        totalType[item.model] = totalType[item.model] + (item.count || 0);
                                                                } else {
                                                                        totalType[item.model] = (item.count || 0);
                                                                }
                                                        }
                                                        var resolutionTotalResult = JSON.parse(version.resolutionTotalResult);
                                                        for (var i = 0,
                                                        len = resolutionTotalResult.length; i < len; i++) {
                                                                var item = resolutionTotalResult[i];
                                                                totalResolutionCount += (item.count || 0);
                                                                if (totalResolution[item.resolution]) {
                                                                        totalResolution[item.resolution] = totalResolution[item.resolution] + (item.count || 0);
                                                                } else {
                                                                        totalResolution[item.resolution] = (item.count || 0);
                                                                }
                                                        }
                                                        var osTotalResult = JSON.parse(version.osTotalResult);
                                                        for (var i = 0,
                                                        len = osTotalResult.length; i < len; i++) {
                                                                var item = osTotalResult[i];
                                                                totalOsCount += (item.count || 0);
                                                                if (totalOs[item.os]) {
                                                                        totalOs[item.os] = totalOs[item.os] + (item.count || 0);
                                                                } else {
                                                                        totalOs[item.os] = (item.count || 0);
                                                                }
                                                        }
                                                        var connTypeTotalResult = JSON.parse(version.connTypeTotalResult);
                                                        for (var i = 0,
                                                        len = connTypeTotalResult.length; i < len; i++) {
                                                                var item = connTypeTotalResult[i];
                                                                totalNetCount += (item.count || 0);
                                                                var connType = item.connType.toUpperCase();
                                                                if (totalNet[connType]) {
                                                                        totalNet[connType] = totalNet[connType] + (item.count || 0);
                                                                } else {
                                                                        totalNet[connType] = (item.count || 0);
                                                                }
                                                        }
                                                }
                                        }
                                        var xtype = [],
                                        xresolution = [],
                                        xos = [],
                                        xnet = [];
                                        var typeData = [],
                                        resolutionData = [],
                                        osData = [],
                                        netData = [];
                                        var typeDetailsData = [],
                                        resolutionDetailsData = [],
                                        osDetailsData = [],
                                        netDetailsData = [];
                                        var tempType = [],
                                        tempResolution = [],
                                        tempOs = [],
                                        tempNet = [];
                                        //机型
                                        for (var key in totalType) {
                                                var regCount = regType[key] || 0;
                                                if (regCount < 1) continue;
                                                var totalCount = regTypeCount; //totalType[key]||0;
                                                var obj = {
                                                        description: key,
                                                        newUserCount: regCount,
                                                        newUserCountRatio: (totalCount > 0 ? Math.floor(regCount / totalCount * 100) : 0) + "%"
                                                }

                                                typeDetailsData.push(obj);
                                                tempType.push({
                                                        key: key,
                                                        value: regCount
                                                });
                                        }
                                        typeDetailsData.sort(sortTable1);
                                        if (typeDetailsData.length > 30) {
                                                typeDetailsData = typeDetailsData.slice(0, 30);
                                        }
                                        //分辨率
                                        for (var key in totalResolution) {
                                                var regCount = regResolution[key] || 0;
                                                if (regCount < 1) continue;
                                                var totalCount = regResolutionCount; //totalResolution[key]||0;
                                                var obj = {
                                                        description: key,
                                                        newUserCount: regCount,
                                                        newUserCountRatio: (totalCount > 0 ? Math.floor(regCount / totalCount * 100) : 0) + "%"
                                                }

                                                resolutionDetailsData.push(obj);
                                                tempResolution.push({
                                                        key: key,
                                                        value: regCount
                                                });
                                        }
                                        resolutionDetailsData.sort(sortTable1);
                                        if (resolutionDetailsData.length > 30) {
                                                resolutionDetailsData = resolutionDetailsData.slice(0, 30);
                                        }
                                        //操作系统
                                        for (var key in totalOs) {
                                                var regCount = regOs[key] || 0;
                                                if (regCount < 1) continue;
                                                var totalCount = regOsCount; //totalOs[key]||0;
                                                var obj = {
                                                        description: key,
                                                        newUserCount: regCount,
                                                        newUserCountRatio: (totalCount > 0 ? Math.floor(regCount / totalCount * 100) : 0) + "%"
                                                }

                                                osDetailsData.push(obj);
                                                tempOs.push({
                                                        key: key,
                                                        value: regCount
                                                });
                                        }
                                        osDetailsData.sort(sortTable1);
                                        if (osDetailsData.length > 30) {
                                                osDetailsData = osDetailsData.slice(0, 30);
                                        }
                                        //联网方式
                                        for (var key in totalNet) {
                                                var connTypeCount = connTypeNet[key] || 0;
                                                if (connTypeCount < 1) continue;
                                                var totalCount = connTypeNetCount; //totalNet[key]||0;
                                                var obj = {
                                                        description: key,
                                                        startupCount: connTypeCount,
                                                        startupCountRatio: (totalCount > 0 ? Math.floor(connTypeCount / totalCount * 100) : 0) + "%"
                                                }

                                                netDetailsData.push(obj);
                                                tempNet.push({
                                                        key: key,
                                                        value: connTypeCount
                                                });
                                        }
                                        netDetailsData.sort(sortTable2);
                                        if (netDetailsData.length > 30) {
                                                netDetailsData = netDetailsData.slice(0, 30);
                                        }
                                        tempType.sort(sortNumber);
                                        tempResolution.sort(sortNumber);
                                        tempOs.sort(sortNumber);
                                        tempNet.sort(sortNumber);
                                        if (tempType.length > 10) {
                                                tempType = tempType.slice(0, 10);
                                        }
                                        if (tempResolution.length > 10) {
                                                tempResolution = tempResolution.slice(0, 10);
                                        }
                                        if (tempOs.length > 10) {
                                                tempOs = tempOs.slice(0, 10);
                                        }
                                        if (tempNet.length > 10) {
                                                tempNet = tempNet.slice(0, 10);
                                        }
                                        for (var i = 0,
                                        len = tempType.length; i < len; i++) {
                                                xtype.push(tempType[i].key);
                                                typeData.push(tempType[i].value);
                                        }
                                        for (var i = 0,
                                        len = tempResolution.length; i < len; i++) {
                                                xresolution.push(tempResolution[i].key);
                                                resolutionData.push(tempResolution[i].value);
                                        }
                                        for (var i = 0,
                                        len = tempOs.length; i < len; i++) {
                                                xos.push(tempOs[i].key);
                                                osData.push(tempOs[i].value);
                                        }
                                        for (var i = 0,
                                        len = tempNet.length; i < len; i++) {
                                                xnet.push(tempNet[i].key);
                                                netData.push(tempNet[i].value);
                                        }

                                        data.xtype = xtype;
                                        data.typeData = typeData;
                                        data.xresolution = xresolution;
                                        data.resolutionData = resolutionData;
                                        data.xos = xos;
                                        data.osData = osData;
                                        data.xnet = xnet;
                                        data.netData = netData;
                                        data.typeDetails = typeDetailsData;
                                        data.resolutionDetails = resolutionDetailsData;
                                        data.osDetails = osDetailsData;
                                        data.netDetails = netDetailsData;
                                        data.typepagetotal = Math.ceil(typeDetailsData.length / 10);
                                        data.resolutionpagetotal = Math.ceil(resolutionDetailsData.length / 10);
                                        data.ospagetotal = Math.ceil(osDetailsData.length / 10);
                                        data.netpagetotal = Math.ceil(netDetailsData.length / 10);
                                        $("button[id$='top'].active").trigger("click");
                                }
                        })
                }
        }
        function setOptionData(d, option, myChart) {
                option.series[0].data = d;
                myChart.clear();
                myChart.setOption(option);
        }
        exports.init = init;
});