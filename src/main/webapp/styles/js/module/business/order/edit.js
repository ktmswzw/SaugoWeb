//加载插件
requirejs(['jquery', 'bootstrap', 'fuelux', 'switchs', 'select', 'selectCN', 'validator', 'vb', 'validatorLAG', 'comm', 'form', 'message'],
    function ($, _) {

        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;
        var produceId = "";
        var agentId = "";
        //状态插件
        $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch()
            .on('switchChange.bootstrapSwitch', function (event, state) {
                if (state)
                    $('#produceNumber').removeAttr("readonly");
                else
                    $('#produceNumber').attr("readonly", "readonly")
            });

        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
            produceId = order.produceId;
            delete order["produceId"];
            agentId = order.agentId;
            delete order["agentId"];
            $("#image").attr("src",WEB_GLOBAL_CTX + "/download/getImg"+order.url);
        }
        else {
            $("#inputId").val(order.inputId);
            $("#inputName").val(order.inputName);
            $('#produceId').append("<option ></option>");
            $('#agentId').append("<option ></option>");
        }

        $("#state").bootstrapSwitch('state', false);
        //修改页面结束


        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker').selectpicker('mobile');
        }

        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", true);


        $("#produceId").change(function () {
            var v = $('#produceId').find("option:selected").text();
            $("#produceNumber").val(v.split("||")[1]);
            $("#produceName").val(v.split("||")[0]);
        });

        initSelect("agentId", WEB_GLOBAL_CTX + "/console/security/user/chooseList", {name: ''}, agentId, "id", "realname", true);
        $("#agentId").change(function () {
            var v = $('#agentId').find("option:selected").text();
            $("#agentName").val(v.split("-上级")[0]);
        });

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
                params = $form.serialize();
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

        parent.Loading.modal('hide');
    });


