requirejs(['jquery', 'bootstrap', 'fuelux', 'table', 'tablezn', 'base64','form', 'comm', 'message', 'validator', 'vb', 'validatorLAG'],
    function () {

        var listAction = '/habit/dictionary/dictionaryList';
        //导出编码
        $.base64.utf8encode = true;
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //初始树
        meTreeInit('myTree',"","/habit/dictionary/findJsonById/",false,true,"564e960339e0a5ed5bdfd66f");

        //动态调整ifream页面高度
        $('#myTree').on('loaded.fu.tree', function (e) {
            //console.log('Loaded');
            setHeight();
        });

        var temp_parentid;
        //同步值
        $('#myTree').on('updated.fu.tree', function (e, selected) {
            asyncTreeValue("myTree","parentId");
            console.log($("#parentId").val());
            temp_parentid = $("#parentId").val();
            if(id!=""){//更新右边
                var dictionaryNow = getBean("","/habit/dictionary/get/"+temp_parentid)
                meForm($('#formSubmit'), dictionaryNow);
            }
            else{//清空右边
                $('#formSubmit').val();
            }
        });


        //列表
        var $table = $('#tableB').bootstrapTable({
            url: WEB_GLOBAL_CTX + listAction,
            dataType: 'json',
            cache: false,
            showToggle: true,
            showExport: true,
            showRefresh: true,
            showColumns: true,
            exportTypes: "['doc', 'excel']",
            toolbar: '#custom-toolbar',
            toolbarAlign: 'left',
            sidePagination: 'server',
            clickToSelect: true,
            singleSelect: true,
            smartDisplay: false,
            queryParams: 'queryParamsF',
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 20, 100]
        }).on('check.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('uncheck.bs.table', function (e, row) {
            showEdit($table, 'to', 'do', 'in');
        }).on('page-change.bs.table', function (e, size, number) {
            setHeightSelf(200 * number / 10);
        });

        //添加
        $('#save').click(function () {
            //var id = $("#id").val();
            if(temp_parentid!="") {
                $("#parentId").val(temp_parentid);
                $("#id").val("");
                $('#formSubmit').submit();
            }
            else
            {
                $.scojs_message("选择上级", $ERROR);
            }
        });

        //修改
        $('#update').click(function () {
            var id = $("#parentId").val();
            if(id!="") {
                $('#formSubmit').submit();
            }
            else
            {
                $.scojs_message("选择上级", $ERROR);
            }
        });

        //删除
        $('#delete').click(function () {
            var id = $("#id").val();
            if(id!="") {
                $.post(WEB_GLOBAL_CTX + "/habit/dictionary/delete/" + id, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/dictionary/list/'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                    $.scojs_message("更新失败,请重新登陆!", $ERROR);
                });
            }
            else
            {
                $.scojs_message("选择上级", $ERROR);
            }
        });

        //提交
        $('#formSubmit').formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            locale: 'zh_CN',
            excluded: ':disabled'
        }).on('success.field.fv', function (e, data) {
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                data.fv.disableSubmitButtons(true);
            }
        })
            .on('success.form.fv', function (e) {
                e.preventDefault();
                var $form = $(e.target);
                var params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/habit/dictionary/save", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        //$("#save").toggleClass("disabled");
                        //setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/dictionary/list/'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;
            });

        parent.Loading.modal('hide');
    });


//本页查询拼装
function queryParamsF(params) {
    var name = $("#search_select").val();
    var value = $("#search").val();
    var str = "{\"" + name + "\":\"" + value + "\"}";
    var data = eval('(' + str + ')');
    params.sortName = "";
    params.sortOrder = "";
    return $.extend({}, params, data);
}
