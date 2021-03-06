
/**
 * Created by xecoder on Sat Aug 20 23:09:18 CST 2016.
 */

requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'comm', 'message'],
    function () {



        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //列表
        var $table = $('#tableB').bootstrapTable({
            url: WEB_GLOBAL_CTX + '/business/remuneration/list/'+produceId,
            dataType: 'json',
            cache:false,
            showToggle:true,
            showExport:true,
            showRefresh:true,
            showColumns:true,
            exportTypes:"['excel']",
            toolbar:'#custom-toolbar',
            toolbarAlign:'left',
            sidePagination:'server',
            clickToSelect:true,
            singleSelect:true,
            smartDisplay: false,
            queryParams: 'queryParamsF',
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200*number/10);
        });

        //查询动作
        $('#query').click(function () {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + '/business/remuneration/list/'+produceId,
                queryParams: 'queryParamsF'
            });
        });

        //删除
        $('#delete').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                $.post(WEB_GLOBAL_CTX + "/business/remuneration/delete/" + this.id, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        flashTable('tableB', '/business/remuneration/list/'+produceId);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                    $.scojs_message("更新失败,请重新登录!", $ERROR);
                });
            });
        });

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            self.location = WEB_GLOBAL_CTX + "/business/remuneration/add/"+produceId;
        });

        //修改
        $('#modify').click(function () {
            parent.Loading.modal('show');
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/business/remuneration/edit/"+this.id;
            });
        });

        //回退
        $('#back').click(function () {
            parent.Loading.modal('show');
            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/produce/index'", 500);

        });

        parent.Loading.modal('hide');

    });


//本页查询拼装
function queryParamsF(params) {
    var str = "{}";
    var data = eval('(' + str + ')');
    //params.sortName = "";
    //params.sortOrder = "";
    return $.extend({}, params, data);
}


