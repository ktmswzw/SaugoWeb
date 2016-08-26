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


            $("#href1").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsFront);
            $("#href1").append('<button type="button" class="btn btn-link">下载</button>');


            $("#href2").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsBack);
            $("#href2").append('<button type="button" class="btn btn-link">下载</button>');
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
        }).on('success.field.fv', function (e, data) {
            if (data.fv.getInvalidFields().length > 0) {

            }
        }).on('success.form.fv', function (e) {
            e.preventDefault();

            var $form = $(e.target);
            var params = $form.serializeArray();
            if (($("#cardsFront").val() == '' ) && ( $("#file1").val() == '')) {
                highlight_error($("#file1"));
                return false;
            }
            else if (($("#cardsBack").val() == '' ) && ( $("#file2").val() == '')) {
                highlight_error($("#file2"));
                return false;
            }
            else if ($("#file1").val() != '' && $("#file2").val() != '') {
                var formData = new FormData(),
                    files1 = $form.find('[name="file"]')[0].files,
                    files2 = $form.find('[name="file"]')[1].files;

                $.each(files1, function (i, file) {
                    formData.append('file1', file);
                });

                $.each(files2, function (i, file) {
                    formData.append('file2', file);
                });
                $.each(params, function (i, val) {
                    formData.append(val.name, val.value);
                });
                $.ajax({
                    url: WEB_GLOBAL_CTX + "/console/security/user/save",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (rsp) {
                        if (rsp.successful) {
                            $("#save").toggleClass("disabled");
                            $.scojs_message(rsp.msg, $OK);
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }
                });
                return true;
            }
            else {
                params = $form.serialize();
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

