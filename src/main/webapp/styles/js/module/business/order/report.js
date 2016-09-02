/**
 * Created by vincent on 16/9/2.
 */
var temp_parentid,Report_produceId,Report_begin,Report_end;
requirejs(['jquery', 'bootstrap', 'fuelux', 'table', 'tablezn','select', 'selectCN', 'base64','form', 'comm', 'message', 'validator', 'vb', 'validatorLAG'],
    function () {

        var listAction = '/business/report/reportList';
        //导出编码
        $.base64.utf8encode = true;
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //初始树
        meTreeInit('myTree',new Array(1+""),"/console/security/user/findJsonById/",false,true,1);

        //动态调整ifream页面高度
        $('#myTree').on('loaded.fu.tree', function (e) {
            //console.log('Loaded');
            setHeight();
        });

        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", true);

        //同步值
        $('#myTree').on('selected.fu.tree', function (e, info) {
            asyncTreeValue("myTree","parentId");
        });


        //同步值
        $('#myTree').on('updated.fu.tree', function (e, selected) {
            asyncTreeValue("myTree","parentId");
            console.log($("#parentId").val());
            temp_parentid = $("#parentId").val();
            if(temp_parentid!=""){//更新右边
                query();
            }
            else{//清空右边
                // $('#formSubmit').val();
            }
        });


        //列表
        var $table = $('#tableReport').bootstrapTable({
            url: '',
            dataType: 'json',
            cache: false,
            showToggle: true,
            showExport: true,
            showRefresh: true,
            showColumns: true,
            exportTypes: "['excel']",
            toolbar: '#custom-toolbar',
            toolbarAlign: 'left',
            sidePagination: 'server',
            clickToSelect: true,
            singleSelect: true,
            smartDisplay: false,
            queryParams: 'reportParamsOrder'
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200 * number / 10);
        });


        //查询动作
        $('#query').click(function () {
            query();
        });

        function query() {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + listAction,
                queryParams: 'reportParamsOrder'
            });
        }

    });

