/**
 * Created by vincent on 16/8/30.
 */
requirejs(['jquery', 'bootstrap', 'table', 'tablezn', 'tExport', 'tExportS','comm'],
    function () {
        //列表
        var $table = $('#tableS').bootstrapTable({
            url: WEB_GLOBAL_CTX + '/business/order/list',
            dataType: 'json',
            cache:false,
            showExport:true,
            exportTypes:"['excel']",
            sidePagination:'server',
            singleSelect:true,
            queryParams: 'reportParamsOrder',
            pagination: false
        });

        parent.Loading.modal('hide');

    });


//本页查询拼装
function reportParamsOrder(params) {
    var name = agentName;
    var agentId = agentId;
    var begin = start;
    var end = end;
    var produceId = produceId;
    var status = status;
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

