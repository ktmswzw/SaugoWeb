/**
 * Created by  moxz on 2015/1/21.
 */

if (top != self) {
    if (top.location != self.location)
        top.location = self.location;
}

function GoApp() {
   /* var msg,appUrl = "weixin://";


    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        msg = "iphone url";
    }
    else if (navigator.userAgent.match(/android/i)) {
        msg = "android url";
    }
    else
    {
        msg = "who are u";
    }
    window.location=appUrl;//打开某手机上的某个app应用
    setTimeout(function(){
        //window.location=the_href;//如果超时就跳转到app下载页
        alert(msg);
    },500);
*/

    var openUrl = window.location.search,appOpen = "weixin://";
    try {
        openUrl = openUrl.substring(1, openUrl.length);
    } catch (e) {}
    var isiOS = navigator.userAgent.match(/(iPhone|iPod|iPad);?/i),
        isAndroid = navigator.userAgent.match(/android/i),
        isDesktop = !isiOS && !isAndroid;
    if (isiOS) {
        setTimeout(function () {
            //window.location = "itms-apps://itunes.apple.com/app/[name]/[id]?mt=8"; ios 下载地址
            alert("去下载ios");
        }, 1000);
        //window.location = "[scheme]://[host]?url=" + openUrl; 直接打开
        window.location = appOpen;
    } else if (isAndroid) {
        setTimeout(function () {
            //window.location = "intent://[host]/" + "url=" + openUrl + "#Intent;scheme=[scheme];package=[package_name];end"; 下载地址
            alert("去下载android");
        }, 1000);
        //window.location = "[scheme]://[host]?url=" + openUrl; 直接打开
        window.location = appOpen;
    } else {
        //window.location.href = openUrl;//pc or mac
        alert("我是电脑，我自豪");
    }

}

requirejs(['jquery', 'ie10', 'comm'],
    function () {
        requirejs(['bootstrap', 'switchs', 'hideShowPassword'], function () {
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
                            doMsg("错误", 2);
                            return false;
                        },
                        success: function (result) {
                            if (result != null) {
                                doMsg(result.msg, result.successful ? 1 : 2);
                                if (result.successful) {
                                    $("#but_login").toggleClass("disabled");
                                    setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/index'", 100);
                                }
                            }
                            return true;
                        }
                    });
                }
            });

            $("#captcha").focus(function () {
                if ($("#captcha").val().length == 0)
                    randomKey();
                return false;
            });

            $("#Kaptcha, #refresh").click(function () {
                randomKey();
                return false;
            });

            $('#show-password').on('switchChange.bootstrapSwitch', function (event, state) {
                $('#password').hideShowPassword(state);
            });

            // 点击登录
            $('#but_login').click(function (e) {
                if ($("#msg") != undefined)
                    $("#msg").alert('close');
            });


            $('#username, #password, #captcha').on('keyup', function () {
                highlight_error($(this));
                /*
                 }).focus(function(){
                 highlight_error($(this));*/
            }).blur(function () {
                highlight_error($(this));
            });

            $("#rememberMe").bootstrapSwitch();
            $("#show-password").bootstrapSwitch();

        });


    });