/**
 * Created by vincent on 16/9/3.
 */
requirejs(['jquery', 'ie10', 'comm'],
    function () {

        $('#formLogin').submit(function (e) {
            var username = $('#username');
            var captcha = $('#captcha');
            if (username.val() == '' || captcha.val() == '') {
                highlight_error(username);
                highlight_error(captcha);
                return false;
            } else {
                e.preventDefault();
                var params = $("#formLogin").serialize();
                $.ajax({
                    async: false,
                    cache: false,
                    data: params,
                    dataType: 'json',
                    type: 'POST',
                    url: WEB_GLOBAL_CTX + "/forgetSend",
                    error: function () {// 请求失败处理函数
                        doErrorMsg("错误",false);
                        return false;
                    },
                    success: function (result) {
                        if (result != null) {
                            if (result.successful) {
                                doErrorMsg(result.msg,true);
                                $("#but_login").toggleClass("weui_btn_disabled");
                                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agentLogin'", 2000);
                            }
                            else
                            {
                                doErrorMsg(result.msg,false);
                            }
                        }
                        return true;
                    }
                });
            }
        });

        $("#Kaptcha, #refresh").click(function () {
            randomKey();
        });

        randomKey();


    });

