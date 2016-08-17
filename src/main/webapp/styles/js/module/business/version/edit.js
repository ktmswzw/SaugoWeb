//加载插件
requirejs(['jquery',,'bootstrap','fuelux','switchs','select','selectCN','validator','vb','validatorLAG','comm','form','message'],
    function ($, _) {

        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        $("#remind").val(0);//不设置无法提交

        //初始化页面
        console.debug("------" + version);
        if (version != undefined && version != null && version != "" && (version.id != null )) {
            meForm($('#formSubmit'), version);
            console.debug("-------" + version.device);
            $('.selectpicker').selectpicker(version.device);
            $('.selectpicker').selectpicker('refresh');

            $("#mandatoryUpgrade").val(version.mandatoryUpgrade);
            $('#content').val(version.content);
        }


        //状态插件
        $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch()
            .on('switchChange.bootstrapSwitch', function(event, state) {
                $("#mandatoryUpgrade").val(state);
            });


        parent.Loading.modal('hide');

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
            console.debug("data-----" + data);
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                data.fv.disableSubmitButtons(true);
            }
        })
            .on('success.form.fv', function (e) {
                e.preventDefault();
                var $form = $(e.target),
                    formData = new FormData(),
                    params = $form.serializeArray();
                console.debug("params-----" + params);

                $.each(params, function (i, val) {
                    formData.append(val.name, val.value);
                });
                $.ajax({
                    url: $form.attr('action'),
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            $("#save").toggleClass("disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/version/list'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }
                });
                return true;
            });
    });

