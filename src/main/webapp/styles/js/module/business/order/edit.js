//加载插件
requirejs(['jquery',  'bootstrap', 'fuelux', 'switchs','select', 'selectCN', 'validator', 'vb', 'validatorLAG', 'comm', 'form', 'message'],
    function ($, _) {

        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;
        var produceId;
        var agentId;
        //状态插件
        $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch()
            .on('switchChange.bootstrapSwitch', function(event, state) {
                if(state)
                    $('#produceNumber').removeAttr("readonly");
                else
                    $('#produceNumber').attr("readonly","readonly")
            });

        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
                        $('.selectpicker').selectpicker('refresh');
            produceId = order.produceId;
        }
        else {
            meForm($('#formSubmit'), order);
        }
        //修改页面结束


        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX+"/business/produce/chooseList", {name: ''}, produceId, "id", "name",true);


        initSelect("agentId", WEB_GLOBAL_CTX+"/console/security/user/chooseList", {name: ''}, agentId, "id", "realname",true);


        parent.Loading.modal('hide');

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
        })
            .on('success.form.fv', function (e) {
                e.preventDefault()

                var $form = $(e.target);
                var params = $form.serialize();
                if (($("#url").val() == '' ) && ( $("#file").val() == '')) {
                    highlight_error($("#file"));
                    return false;
                }
                else if ($("#file").val() != '') {
                    var formData = new FormData(),
                        files = $form.find('[name="file"]')[0].files;
                    $.each(files, function (i, file) {
                        formData.append('file', file);
                    });
                    $.each(params, function (i, val) {
                        formData.append(val.name, val.value);
                    });
                    $.ajax({
                        url: WEB_GLOBAL_CTX + "/business/order/save",
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (rsp) {
                            if (rsp.successful) {
                                $("#save").toggleClass("disabled");
                                $.scojs_message(rsp.msg, $OK);
                                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/order/index'", 1000);
                            } else {
                                $.scojs_message(rsp.msg, $ERROR);
                            }
                        }
                    });
                    return true;
                }
                else {
                    $.post(WEB_GLOBAL_CTX + "/business/order/update", params, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            $("#save").toggleClass("disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/order/index'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                    });
                    return true;
                }
            });

    });


