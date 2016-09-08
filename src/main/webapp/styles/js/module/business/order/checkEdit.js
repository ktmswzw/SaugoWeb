/**
 * Created by imanon.net on 16/8/30.
 */
//加载插件
requirejs(['jquery', 'bootstrap', 'fuelux','validator', 'vb', 'validatorLAG', 'comm', 'form', 'message'],
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
        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
            $("#href").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+order.url);
            $("#href").append('<img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+order.url+'" alt="银行水单" style="height: 400px" class="img-thumbnail img-responsive">');

        }

        setHeightSelf(600);
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
            var params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/business/order/checkSave", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/order/check'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;
        });

        parent.Loading.modal('hide');
    });


