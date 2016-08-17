/**
 * Created by  moxz
 * User: 224911261@qq.com
 * 2016/3/17-14:23
 * habit-team-server.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'base64', 'comm', 'message'],
    function () {

        var listAction = '/habit/user/userList?habitId='+habitId;
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
            singleSelect: true,
            smartDisplay: false,
            queryParams: 'queryParamsF',
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 20, 100]
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



function idFormatter(value, row, index) {
    var temp = "";
    if (value.length > 0 && value != undefined) {
        temp = '<button type="button" class="btn btn-primary btn-sm" onclick="viewInfo(\''+value+'\')">view</button>';
    }
    return temp;
}

