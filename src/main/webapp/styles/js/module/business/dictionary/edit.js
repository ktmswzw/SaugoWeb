//加载插件
requirejs(['jquery', , 'bootstrap', 'fuelux', 'switchs', 'select', 'selectCN', 'validator', 'vb', 'validatorLAG', 'comm', 'form', 'message'],
    function ($, _) {

        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        if (dictionary != undefined && dictionary != null && dictionary != "") {
            //初始化页面
            meForm($('#formSubmit'), dictionary);
        }
        else {
            $("#formSubmit~input").val("");
        }
        //修改页面结束

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
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/dictionary/list/'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;
            });

    });

