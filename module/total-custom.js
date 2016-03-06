define(['require', 'exports', 'module', 'Handlebars', './helper', 'jquery', 'cookie', 'echarts-map', 'pagination', '../libs/daterangepicker/picker'], function(require, exports, module, Handlebars, utils) {
      
        function init() {
                var data = getDataByTemplate() || {};
                $('#text-picker').daterangepicker({
                        format: 'YYYY-M-D',
                        opens: 'left'
                },
                function(start, end, label) {
                        // console.log(start.toISOString(), end.toISOString(), label);
                });
                $('#text-picker').on('apply.daterangepicker',
                function(ev, picker) {
                        // console.log("apply event fired, start/end dates are " 
                        //   + picker.startDate.format('MMMM D, YYYY') 
                        //   + " to " 
                        //   + picker.endDate.format('MMMM D, YYYY')
                        // ); 
                });
                var tab1template = '{{#each details}}' + '<tr>' + '    <td>{{eventId}}</td>' + '    <td>{{eventName}}</td>' + '    <td>{{todayMessageCount}}</td>' + '    <td>{{yestdayMessageCount}}</td>' + '    <td>{{customMessageCount}}</td>' + '    <td><span data-value="{{id}}" class="listeditor">编辑</span><span data-value="{{id}}" class="listdelete">删除</span></td>' + '</tr>' + '{{/each}}';
                function pageselectCallback(page_index) {
                        if (data.details.length > 10) {
                                var start = page_index * 10,
                                len = data.details.length;
                                var arr = [];
                                for (var i = 0; i < 10; i++) {
                                        if ((start + i) < len) arr.push(data.details[start + i]);
                                }
                                var template = Handlebars.compile(tab1template);
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
                var flag = true;
                $("#newEvent").on("click",
                function() {
                        if (flag) {
                                $(".newEventBox").slideDown();
                                flag = false;
                        } else {
                                $(".newEventBox").slideUp();
                                flag = true;
                        }
                });

                $('#detailsTable').on('click', '.listeditor',
                function() {
                        var that = this;
                        var $this = $(this);

                        //spread footer
                        if ($this.hasClass('last')) {
                                utils.spreadFooter(70);
                        }

                        var pos = $this.position();
                        var tpl = '<div class="form-group">' + '   <label class="col-md-3 control-label">事件ID</label>' + '  <div class="col-md-9">' + '       <input class="form-control"></input>' + '  </div>' + '</div>' + '<div class="form-group">' + '   <label class="col-md-3 control-label">事件名称</label>' + '   <div class="col-md-9">' + '       <input class="form-control"></input>' + '   </div>' + '</div>';
                        tpl += '<div class="btns text-right"><a href="javascript:void(0)" class="btn btn-default cancel">取消</a>' + '<a href="javascript:void(0)" class="btn btn-blue sure">确定</a></div>';

                        utils.singlePopover({
                                placement: 'bottom',
                                content: tpl,
                                target: that,
                                left: pos.left - 256,
                                top: pos.top + 16,
                                init: function() {
                                        //cancel
                                        var $singlePop = $('#single-popover');
                                        $singlePop.find('a.cancel').on('click',
                                        function() {
                                                $singlePop.trigger('close');
                                        });
                                        //sure
                                        $singlePop.find('a.sure').on('click',
                                        function() {
                                                alert('sure');

                                                $singlePop.trigger('close');
                                        });
                                },
                                close: function() {
                                        $('footer:last').trigger('recover');
                                }
                        });

                        return false;
                });
        }
        exports.init = init;
});