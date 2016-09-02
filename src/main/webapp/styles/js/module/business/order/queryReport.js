/**
 * Created by vincent on 16/8/30.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS','comm'],
    function () {
        //列表
        var $table = $('#tableS').bootstrapTable({
            url: WEB_GLOBAL_CTX + '/business/order/list',
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
            queryParams: 'reportParamsOrderQuery',
            pagination: false
        });


    });


//本页查询拼装
function reportParamsOrderQuery(params) {
    var agentId = order.agentId;
    var begin = order.beginDate;
    var end = order.endDate;
    var produceId = order.produceId;
    var str = "";
    if(begin!="")
        str = "\"search_beginDate\":\"" + begin+"\"";
    if(end!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_endDate\":\"" + end+ "\"";
    }
    if(agentId!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_agentId\":\"" + agentId+ "\"";
    }
    if(produceId!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_produceId\":\"" + produceId+ "\"";
    }
    var data = eval('({' + str.replace(new RegExp("/", 'g'),"-") + '})');
    params.sortName = "agent_id";
    params.sortOrder = "asc";
    return $.extend({}, params, data);
}

