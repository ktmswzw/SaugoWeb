requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'base64', 'comm', 'message'],
    function () {
        var listAction = "";
        if($("#habitId").val()!="")listAction = '/habit/stickers/stickersList/'+$("#habitId").val();
        if($("#catalogId").val()!="")listAction = '/habit/stickers/stickersList2/'+$("#catalogId").val();

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
            queryParams: 'queryParamsF',
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEditV2($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEditV2($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200 * number / 10);
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
                $.post(WEB_GLOBAL_CTX + "/habit/stickers/delete/" + this.id, function (rsp) {
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

            if($("#habitId").val()!="")
                self.location = WEB_GLOBAL_CTX + "/habit/stickers/add/"+$("#habitId").val();
            if($("#catalogId").val()!="")
                self.location = WEB_GLOBAL_CTX + "/habit/stickers/add2/"+$("#catalogId").val();
        });

        //回退
        $('#back').click(function () {
            parent.Loading.modal('show');
            if($("#habitId").val()!="")
                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/list'", 500);
            if($("#catalogId").val()!="")
                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/catalog/list'", 500);

        });

        //修改
        $('#modify').click(function () {
            parent.Loading.modal('show');
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/habit/stickers/edit/" + this.id;
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
