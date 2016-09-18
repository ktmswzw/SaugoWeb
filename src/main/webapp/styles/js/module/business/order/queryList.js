/**
 * Created by imanon.net on 16/8/30.
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
            url: WEB_GLOBAL_CTX + '/business/order/list',
            dataType: 'json',
            cache:false,
            showToggle:true,
            showExport:true,
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
            height:600,
            pageSize: 10,
            pageList: [5, 10, 20, 100]
        });

        setHeightSelf(800);
        //查询动作
        $('#query').click(function () {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + '/business/order/list',
                queryParams: 'queryParamsOrder'
            });
        });

        parent.Loading.modal('hide');

    });
