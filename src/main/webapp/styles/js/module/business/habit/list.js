requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'base64', 'comm', 'message'],
    function () {

        var listAction = '/habit/habit/habitsList';
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
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(1000 * number / 10);
        });

        //查询动作
        $('#query').click(function () {
            query();
        });

        function query() {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + listAction,
                queryParams: 'queryParamsF'
            });
        }

        //删除
        $('#delete').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                if(this.id=="56838ad2848ec2c669e321b8"){
                    $.scojs_message("默认习惯不允许删除!", $ERROR);
                }
                else {
                    $.post(WEB_GLOBAL_CTX + "/habit/habit/delete/" + this.id, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            flashTable('tableB', listAction);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                        $.scojs_message("更新失败,请重新登陆!", $ERROR);
                    });
                }
            });
        });

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            self.location = WEB_GLOBAL_CTX + "/habit/habit/add";
        });

        //图文
        $('#stickers').click(function () {
            parent.Loading.modal('show');

            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/habit/stickers/list/" + this.id;
            });
        });

        //通知
        $('#notice').click(function () {
            parent.Loading.modal('show');

            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/habit/notice/list/" + this.id;
            });
        });
        //排序
        $('#order').click(function () {
            sortName = "member_count";
            query();
        });


        //维度
        $('#record').click(function () {
            parent.Loading.modal('show');

            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/habit/habit/recordList/" + this.id;
            });
        });

        //修改
        $('#modify').click(function () {
            parent.Loading.modal('show');
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                self.location = WEB_GLOBAL_CTX + "/habit/habit/edit/" + this.id;
            });
        });
        parent.Loading.modal('hide');
    });

var sortName = "";
//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_select").val();
    var value = $("#search").val();
    var str = "{\"" + name + "\":\"" + value + "\"}";
    var data = eval('(' + str + ')');
    params.sortName = sortName;
    params.sortOrder = "";
    return $.extend({}, params, data);
}
