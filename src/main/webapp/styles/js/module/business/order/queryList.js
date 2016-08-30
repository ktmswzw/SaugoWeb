/**
 * Created by vincent on 16/8/30.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'select', 'selectCN','tExport', 'tExportS', 'comm', 'message'],
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
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200*number/10);
        });

        $('#produceId').append("<option ></option>");
        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, "", "id", "name", true);


        //查询动作
        $('#query').click(function () {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + '/business/order/list',
                queryParams: 'queryParamsF'
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

var orderStatusList = [{id: 1, name: '未确认'}, {id: 2, name: '已确认'}, {id: 9, name: '已撤销'}];
function orderStateFormatter(value, row, index) {
    for (var i = 0; !(i >= orderStatusList.length); i++) {
        if (orderStatusList[i].id == value) return orderStatusList[i].name;
    }
    return value;
}

//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_agentName").val();
    var begin = $("#search_beginDate").val();
    var end = $("#search_endDate").val();
    var produceId = $('#produceId').find("option:selected").val();
    var status = $('#status').find("option:selected").val();
    var str = "";
    if(begin!="")
        str = "\"search_beginDate\":\"" + begin+"\"";
    if(end!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_endDate\":\"" + end+ "\"";
    }
    if(name!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_agentName\":\"" + name+ "\"";
    }
    if(produceId!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_produceId\":\"" + produceId+ "\"";
    }
    if(status!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_status\":\"" + status+ "\"";
    }
    var data = eval('({' + str.replace(new RegExp("/", 'g'),"-") + '})');
    params.sortName = "input_time";
    params.sortOrder = "desc";
    return $.extend({}, params, data);
}


