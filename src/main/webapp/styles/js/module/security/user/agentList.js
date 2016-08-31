requirejs(['jquery', 'bootstrap','table', 'tablezn', 'tExport', 'tExportS', 'comm', 'message'],
    function () {
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

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
            smartDisplay: false,
            queryParams: 'queryParamsF',
            pagination: true,
            pageSize: 10,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200*number/10);
        });
        setHeightSelf(800);
        //查询动作
        $('#query').click(function () {
            $table.bootstrapTable('refresh', {
                url: WEB_GLOBAL_CTX + '/console/security/user/agentUserList',
                queryParams: 'queryParamsF'
            });
        });

        //删除
        $('#confirm').click(function () {
            var objects = $table.bootstrapTable('getSelections');
            $('#myModal').modal('hide');
            $.each(objects, function () {
                var state = this.status;
                if(state=="disabled")
                {
                    $.scojs_message("已注销无法启用,请重新注册", $ERROR);
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


var statusList = [{id: 'enabled', name: '可用'}, {id: 'disabled', name: '注销'}, {id: 'check', name: '代审核'}];
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
    params.sortName = "create_time";
    params.sortOrder = "desc";
    return $.extend({}, params, data);
}