//加载插件
requirejs(['jquery','bootstrap','fuelux','switchs','select','selectCN','maskedInput','validator','vb','validatorLAG','comm','form','message'],
    function ($,_) {

        //返回
        $("#back").bind("click",function(){
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        //状态插件
        $("#state").bootstrapSwitch()
            .on('switchChange.bootstrapSwitch', function(event, state) {
                if(state) {
                    $("#payType").val("0");

                }
                else {
                    $("#payType").val("1");
                }
                $("#alipayDiv").toggleClass("hiddeDiv");
                $("#bankDiv").toggleClass("hiddeDiv");
            });

        $("#superAgent").bootstrapSwitch()
            .on('switchChange.bootstrapSwitch', function(event, state) {
                    $("#superAgent").val(state);
            });

        if(user!=undefined&&user!=null&&user!=""&&(user.id != null )) {
            //初始化页面
            meForm($('#formSubmit'), user);


            $("#href1").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsFront);
            $("#href1").append('<button type="button" class="btn btn-link">下载</button>');


            $("#href2").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsBack);
            $("#href2").append('<button type="button" class="btn btn-link">下载</button>');

            $("#state").bootstrapSwitch('state', user.payType == 0);

            $("#superAgent").bootstrapSwitch('state', user.superAgent);
        }
        else{
            $("#payType").val("0");
            $("#status").val("enabled");
            $("#state").bootstrapSwitch('state', true);
            $("#superAgent").bootstrapSwitch('state', false);
        }
        //修改页面结束
        // $("#bankAccount").mask("9999 9999 9999 9999");
        // $("#bankAccount").dblclick(function() {
        //     // $(this).unmask();
        // });

        //页面特殊要求
        $("#username").val(($("#phone").val()));
        $("#phone").change(function(){
            $("#username").val(($("#phone").val()));
        });

        $("#realname").change(function(){
            $("#bankName").val(($("#realname").val()));
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
        meTreeInit('myTree',new Array(user.parentId+""),"/console/security/user/findJsonById/",false,true,1);


        //提交
        var valid = $('#formSubmit').formValidation({
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
            if ($("#parentId").val() == $("#id").val() ) {
                highlight_error($("#parentId"));
                $.scojs_message("上级代理不能是自己", $ERROR);
                return false;
            }
            if (($("#parentId").val() == '' )) {
                highlight_error($("#parentId"));
                $.scojs_message("上级代理必须选择一个", $ERROR);
                return false;
            }
/*            if ((user.id == null) && ( $("#plainPassword").val() == '')) {
                highlight_error($("#plainPassword"));
                $.scojs_message("密码为空", $ERROR);
                return false;
            }*/
            if (($("#payType").val() == 0 ) && ( $("#bank").val() == '' || $("#bankAccount").val() == '' || $("#bankName").val() == ''  )) {
                highlight_error($("#bank"));
                $.scojs_message("银行信息不完整", $ERROR);
                return false;
            }
            if (($("#payType").val() == 1 ) && ( $("#alipayAccount").val() == '' || $("#alipayName").val() == ''  )) {
                highlight_error($("#alipayAccount"));
                $.scojs_message("支付宝信息不完整", $ERROR);
                return false;
            }
            if (($("#cardsFront").val() == '' ) && ( $("#file1").val() == '')) {
                highlight_error($("#file1"));
                $.scojs_message("身份证照片必须双面上传", $ERROR);
                return false;
            }
            else if (($("#cardsBack").val() == '' ) && ( $("#file2").val() == '')) {
                highlight_error($("#file2"));
                $.scojs_message("身份证照片必须双面上传", $ERROR);
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
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 3000);
                            return true;
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }
                });
            }
            else {
                params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/console/security/user/saveAgentUser", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 3000);
                        return true;
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {

                });
            }
        });

        $("#phone").bind("change",function(){removeDis();});
        $("#identityCards").bind("change",function(){removeDis();});
        $("#bank").bind("change",function(){removeDis();});
        $("#bankAccount").bind("change",function(){removeDis();});
        $("#bankName").bind("change",function(){removeDis();});
        $("#alipayAccount").bind("change",function(){removeDis();});
        $("#alipayName").bind("change",function(){removeDis();});
        $("#file1").bind("change",function(){removeDis();});
        $("#file2").bind("change",function(){removeDis();});
        $("#parentId").bind("change",function(){removeDis();});


    });

function removeDis() {

    $("#save").removeAttr("disabled");
    $("#save").toggleClass("disabled");
}