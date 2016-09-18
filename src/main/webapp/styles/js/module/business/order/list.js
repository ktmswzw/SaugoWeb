
/**
 * Created by xecoder on Sun Aug 21 15:24:09 CST 2016.
 */

requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'select', 'selectCN','tExport', 'tExportS', 'comm', 'message'],
    function () {



        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        $('#do').append('<button type="button" class="btn btn-default" id="add" name="add" title="新增" ><span class="glyphicon glyphicon-plus"></span></button>');
        //初始化下拉框 //可做异步下拉框选择

        initSelect("status", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'ORDER_STATUS'}, "", "dicKey", "dicValue",true);
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
            height:500,
            singleSelect:true,
            smartDisplay: false,
            queryParams: 'queryParamsOrder',
            pagination: true,
            pageSize: 10,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
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
                if(this.status==1) {
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
                    $.scojs_message("非 [待确认] 状态订单无法撤销!", $ERROR);
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
