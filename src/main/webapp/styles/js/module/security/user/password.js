/**
 * Created by imanon.net on 16/8/30.
 */
/**
 * Created by imanon.net on 16/8/30.
 */
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

            if ($("#newPlainPassword").val()!=$("#confirmPlainPassword").val()) {
                highlight_error($("#confirmPlainPassword"));
                $.scojs_message("新密码不一致", $ERROR);
                return false;
            }


            if ($("#plainPassword").val()==$("#newPlainPassword").val()) {
                highlight_error($("#confirmPlainPassword"));
                $.scojs_message("新密码与原密码一致,请输入不一样的密码", $ERROR);
                return false;
            }
            var $form = $(e.target);
            var params = $form.serialize();
            $.post(WEB_GLOBAL_CTX + "/console/security/user/passwordUpdate", params, function (rsp) {
                if (rsp.successful) {
                    $.scojs_message(rsp.msg, $OK);
                    $("#save").toggleClass("disabled");
                    setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/logout'", 2000);
                } else {
                    $.scojs_message(rsp.msg, $ERROR);
                }
            }).error(function () {
            });
            return true;

        });

    });

