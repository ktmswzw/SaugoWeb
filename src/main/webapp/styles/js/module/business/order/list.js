
/**
 * Created by xecoder on Sun Aug 21 15:24:09 CST 2016.
 */

requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'comm', 'message'],
    function () {



        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //列表
        var $table = $('#tableB').bootstrapTable({
            url: WEB_GLOBAL_CTX + '/business/order/list',
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
                url: WEB_GLOBAL_CTX + '/business/order/list',
                queryParams: 'queryParamsF'
            });
        });

        //撤销
        $('#delete').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                if(this.status!=9) {
                    $.post(WEB_GLOBAL_CTX + "/business/order/delete/" + this.id, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            flashTable('tableB', '/business/order/list');
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                        $.scojs_message("更新失败,请重新登录!", $ERROR);
                    });
                }
                else{
                    $.scojs_message("[已撤销] 状态订单无法再次撤销!", $ERROR);
                }
            });
        });

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            self.location = WEB_GLOBAL_CTX + "/business/order/add";
        });

        //修改
        $('#modify').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                if(this.status==1) {
                    parent.Loading.modal('show');
                    self.location = WEB_GLOBAL_CTX + "/business/order/edit/" + this.id;
                }
                else{
                    $.scojs_message("非 [待确认] 状态订单无法修改!", $ERROR);
                }
            });
        });

        parent.Loading.modal('hide');

    });

var orderStatusList = [{id: 1, name: '未确认'}, {id: 2, name: '已确认'}, {id: 9, name: '已撤销'}];
function orderStateFormatter(value, row, index) {
    for (var i = 0; !(i >= orderStatusList.length); i++) {
        if (orderStatusList[i].id == value) return orderStatusList[i].name;
    }
    return value;
}


//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_select").val();
    var value = $("#search").val();
    var str = "{\"" + name + "\":\"" + value + "\"}";
    var data = eval('(' + str + ')');
    params.sortName = "input_time";
    params.sortOrder = "desc";
    return $.extend({}, params, data);
}


