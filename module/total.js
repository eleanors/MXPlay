define(['require', 'exports', 'module', 'Handlebars', './helper', 'jquery', 'cookie', 'echarts-map', 'pagination'], function(require, exports, module, Handlebars, utils) {
      
        var labelTop = {
                normal: {
                        color: '#ff4f00',
                        label: {
                                show: false
                        },
                        labelLine: {
                                show: false
                        }
                }
        };
        var labelBottom = {
                normal: {
                        color: '#e7ebe3',
                        label: {
                                show: false
                        },
                        labelLine: {
                                show: false
                        }
                }
        };
        var labelBorder = {
                normal: {
                        color: '#85858b',
                        label: {
                                show: false
                        },
                        labelLine: {
                                show: false
                        }
                }
        }

        function init() {
                var data = getDataByTemplate() || {};
                var myChart = echarts.init(document.getElementById('visitors-container'));
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
                                "showAllSymbol": true,
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
                option.xAxis[0].data = data.xdate;
                option.series[0].data = data.newUser;
                // 为echarts对象加载数据
                myChart.setOption(option, true);
                var pieChart = echarts.init(document.getElementById('sevenPie'));
                var pieOptions = {
                        tooltip: {
                                formatter: "{b}<br/>{c}<br/>{d}%"
                        },
                        color: ["#a7c6f5", "#a7c6f5", "#79a3e3"],
                        series: [{
                                type: 'pie',
                                radius: '80%',
                                center: ['50%', '50%'],
                                itemStyle: {
                                        normal: {
                                                label: {
                                                        show: false
                                                },
                                                labelLine: {
                                                        show: false
                                                }
                                        }
                                },
                                clockWise: false,
                                data: [{
                                        name: 'no user',
                                        value: data.totalUsersCount > 0 && data.activeUsersCountBySeven > 0 ? 0 : 1
                                },
                                {
                                        name: 'other',
                                        value: data.totalUsersCount - data.activeUsersCountBySeven
                                },
                                {
                                        name: i18n.t("Total.ActiveUsers"),
                                        value: data.activeUsersCountBySeven
                                }]
                        }]
                }
                pieChart.setOption(pieOptions, true);
                drawClock(0, data.avgOnceUseTimeBySeven || 0);
                $(".avgusetime th").on("click", function() {
                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");
                        if ($(this).index() == 0) {
                                drawClock(0, data.avgOnceUseTimeBySeven || 0);
                                $(".toptip", $(".avgusetime").prev()).text(i18n.t("Total.AveragePerUse") + (data.avgOnceUseTimeBySeven || 0) + i18n.t("global.Minute"));
                        } else {
                                drawClock(0, data.avgOnceUseTimeByDay || 0);
                                $(".toptip", $(".avgusetime").prev()).text(i18n.t("Total.AverageDayUse") + (data.avgOnceUseTimeByDay || 0) + i18n.t("global.Minute"));
                        }
                });
                $(".tstuser th").on("click", function() {
                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");
                        if ($(this).index() == 0) {
                                pieOptions.series[0].data = [{
                                        name: 'no user',
                                        value: data.totalUsersCount > 0 && data.activeUsersCountBySeven > 0 ? 0 : 1
                                },
                                {
                                        name: 'other',
                                        value: data.totalUsersCount - data.activeUsersCountBySeven
                                },
                                {
                                        name: i18n.t("Total.ActiveUsers"),
                                        value: data.activeUsersCountBySeven
                                }]
                        } else {
                                pieOptions.series[0].data = [{
                                        name: 'no user',
                                        value: data.totalUsersCount > 0 && data.activeUsersCountBySeven > 0 ? 0 : 1
                                },
                                {
                                        name: 'other',
                                        value: data.totalUsersCount - data.activeUsersCountByThirty
                                },
                                {
                                        name: i18n.t("Total.ActiveUsers"),
                                        value: data.activeUsersCountByThirty
                                }]
                        }
                        pieChart.setOption(pieOptions, true);
                });
                $("button[id^='users']").on("click", function() {
                        $(this).addClass("active");
                        $("button[id^='users']").not(this).removeClass("active");
                        current = this.id;
                });
                $("#usersOne").on("click", function() {
                        option.series[0].type = "line";
                        option.tooltip.formatter = "{b}<br/>{c}";
                        option.yAxis[0].axisLabel = {
                                formatter: function(value) {
                                        return value;
                                }
                        };
                        delete option.yAxis[0].max;
                        delete option.yAxis[0].min;
                        setOptionData(data.newUser, option, myChart);
                });
                $("#usersTwo").on("click", function() {
                        option.series[0].type = "line";
                        option.tooltip.formatter = "{b}<br/>{c}";
                        option.yAxis[0].axisLabel = {
                                formatter: function(value) {
                                        return value;
                                }
                        };
                        delete option.yAxis[0].max;
                        delete option.yAxis[0].min;
                        setOptionData(data.totalUser, option, myChart);
                });
                $("#usersThree").on("click", function() {
                        option.series[0].type = "line";
                        option.tooltip.formatter = "{b}<br/>{c}";
                        option.yAxis[0].axisLabel = {
                                formatter: function(value) {
                                        return value;
                                }
                        };
                        delete option.yAxis[0].max;
                        delete option.yAxis[0].min;
                        setOptionData(data.activeUser, option, myChart);
                });
                $("#usersFour").on("click", function() {
                        option.series[0].type = "bar";
                        option.tooltip.formatter = "{b}<br/>{c}";
                        option.yAxis[0].axisLabel = {
                                formatter: function(value) {
                                        return value + "%";
                                }
                        };
                        option.yAxis[0].max = 100;
                        option.yAxis[0].min = 0;
                        setOptionData(data.activeUserRatio, option, myChart);
                });
                $("#usersFive").on("click",  function() {
                        option.series[0].type = "line";
                        option.tooltip.formatter = "{b}<br/>{c}";
                        option.yAxis[0].axisLabel = {
                                formatter: function(value) {
                                        return value;
                                }
                        };
                        delete option.yAxis[0].max;
                        delete option.yAxis[0].min;
                        setOptionData(data.startupCount, option, myChart);
                });
                $("#usersSix").on("click", function() {
                        option.series[0].type = "line";
                        option.tooltip.formatter = function(params, ticket, callback) {
                                return params[1] + "<br/>" + getTime(params[2]);
                        }
                        option.yAxis[0].axisLabel = {
                                formatter: function(value) {
                                        return getTime(value);
                                }
                        };
                        delete option.yAxis[0].max;
                        delete option.yAxis[0].min;
                        setOptionData(data.avgUseTime, option, myChart);
                });
                $("button[id$='top']").on("click", function() {
                        $(this).addClass("active");
                        $("button[id$='top']").not(this).removeClass("active");
                });
                $("#seventop").on("click", function() {
                        loadData(7);
                });
                $("#thirtytop").on("click", function() {
                        loadData(30);
                });
                $("#ninetytop").on("click", function() {
                        loadData(90);
                });
                var trtemplate = '{{#each details}}' + '<tr>' + '    <td>{{date}}</td>' + '   <td>{{newUserCount}}</td>' + '    <td>{{totalUserCount}}</td>' + '    <td>{{activeUserCount}}</td>' + '    <td>{{activeUserCountRatio}}</td>' + '    <td>{{startupCount}}</td>' + '    <td>{{userTime}}</td>' + '</tr>' + '{{/each}}';
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
                var detailsflag = true;
                $("#loading_more").on('click', function() {
                        if (detailsflag) {
                                $(this).addClass("active");
                                $(this).find("img").attr("src", "/img/arr_b_pull.png");
                                $("#detailsTable").show();
                                $("#hideup").show();
                                detailsflag = false;
                        } else {
                                $(this).removeClass("active");
                                $(this).find("img").attr("src", "/img/arr_b.png");
                                $("#detailsTable").hide();
                                $("#hideup").hide();
                                detailsflag = true;
                        }
                });
                $("#hideup").on("click", function() {
                        $("#loading_more").removeClass("active");
                        $("#loading_more").find("img").attr("src", "/img/arr_b.png");
                        $("#detailsTable").hide();
                        $("#hideup").hide();
                        detailsflag = true;
                })

                function loadData(flag) {
                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - flag + 1);
                        var endDate = new Date();
                        $.ajax({
                                url: '/mxplay/data/getStatisticDataByAlbumAndDate.json',
                                method: "POST",
                                data: {
                                        'appId': $.cookie("curAppId"),
                                        'startDate': ymdFormat(startDate),
                                        'endDate': ymdFormat(endDate),
                                        'times': new Date().getTime()
                                }
                        }).done(function(body) {
                                if (body && body.st == 1) {
                                        var backdata = body.msg;
                                        var xdate = [],
                                        totalUser = [],
                                        newUser = [],
                                        activeUser = [],
                                        activeUserRatio = [],
                                        startupCount = [],
                                        avgUseTime = [],
                                        detailsData = [];
                                        for (var i = 0, len = backdata.length; i < len; i++) {
                                                var dt = utils.toFormat(backdata[i].reportDate, "MM-dd");
                                                xdate.unshift(dt);
                                                newUser.unshift(backdata[i].newRegsCount);
                                                totalUser.unshift(backdata[i].devicesCount);
                                                activeUser.unshift(backdata[i].activeCountInToday);
                                                activeUserRatio.unshift(backdata[i].devicesCount == 0 ? 0 : Math.floor(backdata[i].activeCountInToday / backdata[i].devicesCount * 100));
                                                startupCount.unshift(backdata[i].todayOperationCount);
                                                avgUseTime.unshift(backdata[i].todayOperationCount ? Math.floor(backdata[i].todayUsingTime / backdata[i].todayOperationCount) : 0);
                                        }
                                        for (var i = 0, len = xdate.length; i < len; i++) {
                                                var obj = {
                                                        date: xdate[i],
                                                        newUserCount: newUser[i],
                                                        totalUserCount: totalUser[i],
                                                        activeUserCount: activeUser[i],
                                                        activeUserCountRatio: activeUserRatio[i] + "%",
                                                        startupCount: startupCount[i],
                                                        userTime: avgUseTime[i],
                                                        userTime: utils.getTime(avgUseTime[i])
                                                };
                                                detailsData.unshift(obj);
                                        }
                                        var preseven = new Date();
                                        preseven.setDate(preseven.getDate() - flag);
                                        for (var i = 1; i <= flag; i++) {
                                                var dstr = utils.getAddDate(preseven, 1);
                                                if (xdate.indexOf(dstr) == -1) {
                                                        xdate.splice(i - 1, 0, dstr);
                                                        newUser.splice(i - 1, 0, 0);
                                                        totalUser.splice(i - 1, 0, 0);
                                                        activeUser.splice(i - 1, 0, 0);
                                                        activeUserRatio.splice(i - 1, 0, 0);
                                                        startupCount.splice(i - 1, 0, 0);
                                                        avgUseTime.splice(i - 1, 0, 0);
                                                }
                                        }
                                        data.xdate = xdate;
                                        data.newUser = newUser;
                                        data.activeUser = activeUser;
                                        data.activeUserRatio = activeUserRatio;
                                        data.startupCount = startupCount;
                                        data.avgUseTime = avgUseTime;
                                        data.totalUser = totalUser;
                                        data.details = detailsData;
                                        data.pagetotal = Math.ceil(detailsData.length / 10);
                                        option.xAxis[0].data = data.xdate;
                                        $("button[id^='users'].active").trigger("click");
                                        $("#Pagination").pagination(data.pagetotal, {
                                                num_display_entries: 10,
                                                callback: pageselectCallback,
                                                items_per_page: 1
                                        });
                                }
                        })
                }
        }

        function setOptionData(d, option, myChart) {
                option.series[0].data = d;
                myChart.clear();
                myChart.setOption(option, true);
        }

        function drawClock(hou, min) {
                var clock = document.getElementById('clock');
                if (!clock.getContext) {
                        $("#useTimeOnce").show();
                        $("#userCanvas").hide();
                        return false;
                } else {
                        $("#useTimeOnce").hide();
                        $("#userCanvas").show();
                }
                var cxt = clock.getContext('2d');
                var width = 240,
                height = 240,
                centerx = 120,
                centery = 120;

                //清空画布
                cxt.clearRect(0, 0, width, height);
                //表盘
                cxt.fill();
                cxt.fillStyle = 'white';
                cxt.beginPath();
                cxt.arc(centerx, centery, 105, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
                //边框）
                cxt.strokeStyle = '#e7ebe3';
				cxt.lineWidth = 10;
                cxt.beginPath();
                cxt.arc(centerx, centery, 90, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.stroke();
                //画黄色扇形图
                cxt.save();
                cxt.beginPath();
                cxt.fillStyle = '#ffff00';
                cxt.moveTo(centerx, centery);
                cxt.arc(centerx, centery, 85, (hou / 6 - 0.5) * Math.PI, (min - 15) * 2 / 60 * Math.PI, false);
                cxt.lineTo(centerx, centery);
                cxt.fill();
                cxt.closePath();
                cxt.restore();
                //刻度 0/3/6/9
                //时刻度
                for (var i = 0; i < 4; i++) {
                        cxt.save();
                        cxt.lineWidth = 3;
                        cxt.strokeStyle = '#61685b';
                        //设置原点
                        cxt.translate(centerx, centery);
                        //设置旋转角度;
                        cxt.rotate(90 * i / 180 * Math.PI);
                        cxt.beginPath();
                        cxt.moveTo(0, 85);
                        cxt.lineTo(0, 75);
                        cxt.closePath();
                        cxt.stroke();
                        cxt.restore();
                }
                //其他小时刻度
                for (var i = 0; i < 12; i++) {
                        if (i % 3 != 0) {
                                cxt.save();
                                cxt.lineWidth = 2;
                                cxt.strokeStyle = '#878787';
                                //设置原点
                                cxt.translate(centerx, centery);
                                //设置旋转角度;
                                cxt.rotate(30 * i / 180 * Math.PI);
                                cxt.beginPath();
                                cxt.moveTo(0, 85);
                                cxt.lineTo(0, 80);
                                cxt.closePath();
                                cxt.stroke();
                                cxt.restore();
                        }
                }

                //指针（时分）
                //时针
                cxt.save();
                cxt.lineWidth = 4;
                cxt.strokeStyle = 'black';
                cxt.beginPath();
                cxt.translate(centerx, centery);
                cxt.rotate((hou * 30 + 180) / 180 * Math.PI);
                cxt.moveTo(0, -10);
                cxt.lineTo(0, 50);
                cxt.closePath();
                cxt.stroke(); 
				cxt.restore();
                //分针
                cxt.save();
                cxt.lineWidth = 4;
                cxt.strokeStyle = 'black';
                cxt.beginPath();
                cxt.translate(centerx, centery);
                cxt.rotate((min * 6 + 180) / 180 * Math.PI);
                cxt.moveTo(0, -10);
                cxt.lineTo(0, 70);
                cxt.closePath();
                cxt.stroke(); 
				cxt.restore();
        }
        function formatstr(str) {
                return str.toString().length == 2 ? str.toString() : "0" + str;
        }

        function getTime(utc) {
                return formatstr(Math.floor(utc / 3600)) + ":" + formatstr(Math.floor(utc % 3600 / 60)) + ":" + formatstr(Math.floor(utc % 60));
        }
        function ymdFormat(dt) {
                var year = dt.getFullYear();
                var month = dt.getMonth() + 1;
                var day = dt.getDate();
                return dt.getFullYear() + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day > 10 ? day: ("0" + day));
        }
        exports.init = init;
})