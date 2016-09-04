/**
 * Created by vincent on 16/9/3.
 */

requirejs(['jquery', 'ie10', 'comm'],
    function () {

        $('#formLogin').submit(function (e) {
            var username = $('#username');
            var password = $('#password');
            var captcha = $('#captcha');

            if (username.val() == '') {
                highlight_weui_error(username);
                doErrorMsg("手机为空",false);
                return false;
            }
            if ( password.val() == '' ) {
                highlight_weui_error(password);
                doErrorMsg("密码为空",false);
                return false;
            }
            if (captcha.val() =='') {
                highlight_weui_error(captcha);
                doErrorMsg("填写验证码",false);
                return false;
            }
            else {
                e.preventDefault();
                var params = $("#formLogin").serialize();
                $.ajax({
                    async: false,
                    cache: false,
                    data: params,
                    dataType: 'json',
                    type: 'POST',
                    url: WEB_GLOBAL_CTX + "/login/do",
                    error: function () {// 请求失败处理函数
                        doErrorMsg("错误",false);
                        return false;
                    },
                    success: function (result) {
                        if (result != null) {
                            if (result.successful) {
                                doErrorMsg(result.msg,true);
                                $("#but_login").toggleClass("weui_btn_disabled");
                                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agent/home'", 2000);
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

        // function doErrorMsg(msg) {
        //     $('#error_dialog').html(msg);
        //
        //     $('#dialog').show().on('click', '.weui_btn_dialog', function () {
        //         $('#dialog').off('click').hide();
        //     });
        //
        // }

        // function doNewMsg(msg){
        //     $('#js_tooltips').html(msg);
        //     $('#js_tooltips').show();
        //     setTimeout(function (){
        //         $('#js_tooltips').hide();
        //     }, 3000)
        // }


    });

