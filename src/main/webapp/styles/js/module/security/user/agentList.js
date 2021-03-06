var sortSelf = true;
requirejs(['jquery', 'bootstrap','table', 'tablezn', 'select', 'selectCN', 'tExport', 'tExportS', 'comm', 'message'],
    function () {
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        initSelectOne("status", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'USER-STATUS'}, "", "dicKey", "dicValue",true);

        //列表
        var $table = $('#tableB').bootstrapTable({
            url: WEB_GLOBAL_CTX + '/console/security/user/agentUserList',
            dataType: 'json',
            cache:false,
            showToggle:true,
            showExport:true,
            showRefresh:true,
            showColumns:true,
            toolbar:'#custom-toolbar',
            toolbarAlign:'left',
            sidePagination:'server',
            clickToSelect:true,
            singleSelect:true,
            customSort:'customSort',
            smartDisplay: false,
            queryParams: 'queryParamsF',
            pagination: true,
            height:500,
            pageSize: 10,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('sort.bs.table', function (name,order) {
            queryParamsB();
            sortSelf = !sortSelf;
        });
        //查询动作
        $('#query').click(function () {
            queryParamsB();
        });


        function queryParamsB() {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + '/console/security/user/agentUserList',
                queryParams: 'queryParamsF'
            });
        }

        //删除
        $('#confirm').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $('#myModal').modal('hide');
            $.each(objects, function () {
                var state = this.status;
                if(state=="disabled")
                {
                    $.scojs_message("已注销无法启用,请重新注册", $ERROR);
                    // setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 3000);
                }
                else{
                    $.post(WEB_GLOBAL_CTX + "/console/security/user/deleteInfo/" + this.id, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            flashTable('tableB', '/console/security/user/agentUserList');
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                        $.scojs_message("更新失败,请重新登录!", $ERROR);
                    });
                }
            });
        });

        //添加
        $('#add').click(function () {
            parent.Loading.modal('show');
            self.location = WEB_GLOBAL_CTX + "/console/security/user/agentUserEdit";
        });

        //修改
        $('#modify').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                var state = this.status;
                if(state=="disabled")
                {
                    $.scojs_message("已注销无法修改,请重新注册", $ERROR);
                }
                else{
                    parent.Loading.modal('show');
                    self.location = WEB_GLOBAL_CTX + "/console/security/user/editAgentUser/"+this.id;
                }
            });

        });

        //审核
        $('#check').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $.each(objects, function () {
                var state = this.status;
                if(state!="check")
                {
                    $.scojs_message("审核状态不可用", $ERROR);
                }
                else{
                    parent.Loading.modal('show');
                    self.location = WEB_GLOBAL_CTX + "/console/security/user/agentCheck/"+this.id;
                }
            });

        });



        parent.Loading.modal('hide');

    });


//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_select").val();
    var value = $("#search").val();
    var status = $('#status').val();
    var str = "";
    if(name!="") {
        if(str!="") {
            str += ",";
        }
        str += "\""+name+"\":\"" + value+ "\"";
    }
    if(status!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_status\":\"" + status+ "\"";
    }
    var data = eval('({' + str.replace(new RegExp("/", 'g'),"-") + '})');

    params.sortName = "create_time";
    params.sortOrder = sortSelf?"desc":"asc";
    return $.extend({}, params, data);
}

function superAgent(value, row, index) {
    if(value){
        return '<span class="glyphicon glyphicon-ok"></span>';
    }else
        return "";
}


