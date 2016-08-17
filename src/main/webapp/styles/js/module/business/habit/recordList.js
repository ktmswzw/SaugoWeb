/**
 * Created by  moxz
 * User: 224911261@qq.com
 * 2015/9/17-10:13
 * HabitServer.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'base64', 'comm', 'message'],
    function () {

        var listAction = '/habit/habit/getRecordList/' + $("#habitId").val();
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
            showRefresh: true,
            showColumns: true,
            toolbar: '#custom-toolbar',
            toolbarAlign: 'left',
            sidePagination: 'server',
            clickToSelect: true,
            singleSelect: true,
            smartDisplay: false
        }).on('check.bs.table', function (e, row) {
            showEditV2($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEditV2($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200 * number / 10);
        });


        //删除
        $('#delete').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                $.post(WEB_GLOBAL_CTX + "/habit/habit/recordDelete/" + this.name+"/"+$("#habitId").val(), function (rsp) {
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

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/recordAdd/" +$("#habitId").val()+"'", 1000);
        });

        //回退
        $('#back').click(function () {
            parent.Loading.modal('show');
            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/list'", 500);
        });

        //修改
        $('#modify').click(function () {
            parent.Loading.modal('show');
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/recordEdit/" + this.name+"/"+$("#habitId").val()+"'", 1000);
            });
        });

        parent.Loading.modal('hide');
    });


//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_select").val();
    var value = $("#search").val();
    var str = "{\"" + name + "\":\"" + value + "\"}";
    var data = eval('(' + str + ')');
    params.sortName = "";
    params.sortOrder = "";
    return $.extend({}, params, data);
}
