/**
 * Created by vincent on 16/9/3.
 */
/**
 * Created by  moxz on 2015/1/21.
 */

if (top != self) {
    if (top.location != self.location)
        top.location = self.location;
}

requirejs(['jquery', 'ie10', 'comm'],
    function () {
        $('#formLogin').submit(function (e) {
            var username = $('#username');
            var password = $('#password');
            var captcha = $('#captcha');
            if (username.val() == '' || password.val() == '' || captcha.val() == '') {
                highlight_error(username);
                highlight_error(password);
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
                                setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/index'", 2000);
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

        function doErrorMsg(msg,type) {
            $('#error_dialog').html(msg);
            if(type){
                $('#msgType').html('');
                $('#msgType').html('<i class="weui_icon_msg weui_icon_success"></i>');
            }
            else{
                $('#msgType').html('');
                $('#msgType').html('<i class="weui_icon_msg weui_icon_warn"></i>');
            }
            $('#toast').show();
            setTimeout(function () {
                $('#toast').hide();
            }, 2000);
        }

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

