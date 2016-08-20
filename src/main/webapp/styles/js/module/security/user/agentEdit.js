//加载插件
requirejs(['jquery',,'bootstrap','fuelux','switchs','select','selectCN','validator','vb','validatorLAG','comm','form','message'],
    function ($,_) {

        //返回
        $("#back").bind("click",function(){
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;


        var rolesVal='',parentIdVal='';


        if(user!=undefined&&user!=null&&user!=""&&(user.id != null )) {
            rolesVal = user.roles;
            delete user["roles"];
            //初始化页面
            meForm($('#formSubmit'), user);
            parentIdVal=user.parentId+"";
        }
        else{
            $("#status").val("enabled");
        }
        //修改页面结束

        //页面特殊要求
        $("#username").val(($("#phone").val()));
        $("#phone").change(function(){
            $("#username").val(($("#phone").val()));
        });

        //动态调整ifream页面高度
        $('#myTree').on('loaded.fu.tree', function (e) {
            //console.log('Loaded');
            setHeight();
        });

        //同步值
        $('#myTree').on('updated.fu.tree', function (e, selected) {
            asyncTreeValue("myTree","parentId");
        });
        $('#myTree').on('selected.fu.tree', function (e, info) {
            asyncTreeValue("myTree","parentId");
        });

        //初始树
        meTreeInit('myTree',parentIdVal.split(""),"/console/security/user/findJsonById/",false,true,1);


        //提交
        var roles = $('#roles');
        var parentId = $('#parentId');


        $('#formSubmit').formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            locale: 'zh_CN',
            excluded: ':disabled'
        }).on('success.field.fv', function(e, data) {
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                data.fv.disableSubmitButtons(true);
            }
        })
            .on('success.form.fv', function (e) {
                e.preventDefault();
                var $form = $(e.target);
                if (parentId.val() == '' || parentId.val() == null) {
                    highlight_error(parentId);
                    return false;
                } else {
                    var params = $form.serialize();
                    $.post(WEB_GLOBAL_CTX + "/console/security/user/saveUser", params, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            $("#save").toggleClass("disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                    });
                    return true;
                }
            });

    });

