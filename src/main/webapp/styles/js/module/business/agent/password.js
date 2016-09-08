/**
 * Created by imanon.net on 16/9/4.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {


        $('#formSubmit').submit(function (e) {

            if ($("#newPlainPassword").val()!=$("#confirmPlainPassword").val()) {
                highlight_weui_error($("#confirmPlainPassword"));
                doErrorMsg("新密码不一致", false);
                return false;
            }

            if ($("#plainPassword").val()==$("#newPlainPassword").val()) {
                highlight_weui_error($("#confirmPlainPassword"));
                doErrorMsg("新密码与原密码一致,请输入不一样的密码", false);
                return false;
            }

            var $form = $(e.target);
            var params = $form.serialize();

            $.post(WEB_GLOBAL_CTX + "/console/security/user/passwordUpdate", params, function (rsp) {
                if (rsp.successful) {
                    $("#save").toggleClass("weui_btn_disabled");
                    doErrorMsg(rsp.msg, true);
                    setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agentLogin'", 3000);
                } else {
                    doErrorMsg(rsp.msg, false);
                }
            }).error(function () {
            });
            return false;
        });

        $("#back").bind("click", function () {
            window.history.go(-1);
        });


    });

