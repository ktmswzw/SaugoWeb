requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'base64', 'comm', 'message'],
    function () {

        var listAction = '/habit/recommend/recommendList/'+type;
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

            if(objects.length!=1){
                $.scojs_message("请选择一个", $ERROR);
            }else {
                $.each(objects, function () {
                    $.post(WEB_GLOBAL_CTX + "/habit/recommend/delete/" + this.id, function (rsp) {
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
            }
        });

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            self.location = WEB_GLOBAL_CTX + "/habit/recommend/add/"+type;
        });

        //推送缓存
        $('#push').click(function () {
            $("#push").toggleClass("disabled",true);
                $.post(WEB_GLOBAL_CTX + "/habit/recommend/push/"+type, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        parent.Loading.modal('hide');
                        $("#push").toggleClass("disabled", false);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                        parent.Loading.modal('hide');
                    }
                }).error(function () {
                });

        });

        //修改
        $('#modify').click(function () {
            parent.Loading.modal('show');
            var objects = $table.bootstrapTable('getSelections');
            if(objects.length!=1){
                $.scojs_message("请选择一个", $ERROR);
            }else {
                $.each(objects, function () {
                    self.location = WEB_GLOBAL_CTX + "/habit/recommend/edit/" + this.id;
                });
            }
        });
        parent.Loading.modal('hide');
    });


//本页查询拼装
function queryParamsF(params) {
    var str = "{\"\":\"\"}";
    var data = eval('(' + str + ')');
    params.sortName = "";
    params.sortOrder = "";
    return $.extend({}, params, data);
}
