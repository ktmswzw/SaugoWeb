/**
 * Created by vincent on 16/8/30.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'select', 'selectCN','tExport', 'tExportS', 'comm', 'message'],
    function () {

        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        initSelect("status", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'ORDER_STATUS'}, "", "dicKey", "dicValue",true);
        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, "", "id", "name", true);


        //列表
        var $table = $('#tableB').bootstrapTable({
            url: '',
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

        parent.Loading.modal('hide');

    });
