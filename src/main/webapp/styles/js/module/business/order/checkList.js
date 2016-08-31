/**
 * Created by vincent on 16/8/30.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn',  'select', 'selectCN','tExport', 'tExportS', 'comm', 'message'],
    function () {

        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;


        //初始化下拉框 //可做异步下拉框选择
        initSelect("status", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'ORDER_STATUS'}, "1", "dicKey", "dicValue",true);

        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, "", "id", "name", true);


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
            queryParams: 'queryParamsOrder',
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
        $('#confirm').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $('#myModal').modal('hide');
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

        //修改
        $('#check').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                if(this.status==1) {
                    parent.Loading.modal('show');
                    self.location = WEB_GLOBAL_CTX + "/business/order/check/" + this.id;
                }
                else{
                    $.scojs_message("非 [待确认] 状态订单无法确认!", $ERROR);
                }
            });
        });

        parent.Loading.modal('hide');

    });
