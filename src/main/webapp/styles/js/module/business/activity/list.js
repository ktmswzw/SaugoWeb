requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'base64', 'comm', 'message'],
    function () {

        var listAction = '/habit/activity/activityList?userHabitId='+userHabitId;
        //导出编码
        $.base64.utf8encode = true;
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //列表
        var $table = $('#tableB').bootstrapTable({
            url: WEB_GLOBAL_CTX + listAction,
            dataType: 'json',
            cache: false,
            showToggle: true,
            showExport: true,
            showRefresh: true,
            showColumns: true,
            exportTypes: "['doc', 'excel']",
            toolbar: '#custom-toolbar',
            toolbarAlign: 'left',
            sidePagination: 'server',
            clickToSelect: true,
            singleSelect: true,
            smartDisplay: false,
            queryParams: 'queryParamsS',
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(1000 * number / 10);
        });

        //查询动作
        $('#query').click(function () {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + listAction,
                queryParams: 'queryParamsF'
            });
        });

        //删除
        $('#delete').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            console.debug('Selected values: ' + objects.length);
            $.each(objects, function () {
                $.post(WEB_GLOBAL_CTX + "/habit/activity/delete/" + this.id, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        flashTable('tableB', listAction);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                    $.scojs_message("更新失败,请重新登陆!", $ERROR);
                });
            });
        });

        //屏蔽
        $('#close').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            console.debug('Selected values: ' + objects.length);
            $.each(objects, function () {
                $.post(WEB_GLOBAL_CTX + "/habit/activity/close/" + this.id, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        flashTable('tableB', listAction);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                    $.scojs_message("更新失败,请重新登陆!", $ERROR);
                });
            });
        });

        //查看动态
        $('#back').click(function () {
            window.history.go(-1);
        });
        //查看动态
        $('#comment').click(function () {
            parent.Loading.modal('show');
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/habit/comment/list/" + this.id;
            });
        });
        parent.Loading.modal('hide');
    });


//本页查询拼装
function queryParamsS(params) {
    var begin = $("#search_beginDate").val();
    var end = $("#search_endDate").val();
    var str = "";
    if(begin!="")
        str = "\"search_beginDate\":\"" + begin+"\"";
    if(end!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_endDate\":\"" + end+ "\"";
    }
    var data = eval('({' + str.replace(new RegExp("/", 'g'),"-") + '})');
    params.sortName = "";
    params.sortOrder = "";
    return $.extend({}, params, data);
}


function stateFormatter(value, row, index) {
    var temp = "checked";
    if (row.status == 5) {
        temp = "";
    }
    temp = '<input type="checkbox" ' + temp +'>';
    return temp;
}