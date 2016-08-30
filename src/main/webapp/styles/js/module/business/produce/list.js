
/**
 * Created by xecoder on Sat Aug 20 17:41:38 CST 2016.
 */

requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS', 'comm', 'message'],
    function () {



        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //列表
        var $table = $('#tableB').bootstrapTable({
            url: WEB_GLOBAL_CTX + '/business/produce/list',
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
                url: WEB_GLOBAL_CTX + '/business/produce/list',
                queryParams: 'queryParamsF'
            });
        });

        //删除
        $('#delete').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                parent.Loading.modal('show');
                self.location = WEB_GLOBAL_CTX + "/business/remuneration/index/"+this.id;
            });
        });

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            self.location = WEB_GLOBAL_CTX + "/business/produce/add";
        });

        //修改
        $('#modify').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                parent.Loading.modal('show');
                self.location = WEB_GLOBAL_CTX + "/business/produce/edit/"+this.id;
            });
        });

        parent.Loading.modal('hide');

    });

var statusList = [{id: 'enabled', name: '可用'}, {id: 'disabled', name: '不可用'}];
function stateFormatter(value, row, index) {
    for (var i = 0; !(i >= statusList.length); i++) {
        if (statusList[i].id == value) return statusList[i].name;
    }
    return value;
}

//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_select").val();
    var value = $("#search").val();
    var str = "{\"" + name + "\":\"" + value + "\"}";
    var data = eval('(' + str + ')');
    //params.sortName = "";
    //params.sortOrder = "";
    return $.extend({}, params, data);
}


