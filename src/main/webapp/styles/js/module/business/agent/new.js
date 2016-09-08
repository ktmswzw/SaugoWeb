/**
 * Created by imanon.net on 16/9/4.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        $("#state").change(function() {
            if($("#state").is(':checked')){
                $("#payType").val("0");
            }
            else{
                $("#payType").val("1");
            }
            $("#alipayDiv").toggleClass("hiddeDiv");
            $("#bankDiv").toggleClass("hiddeDiv");
        });

        if(user!=undefined&&user!=null&&user!=""&&(user.id != null )) {
            //初始化页面
            meForm($('#formSubmit'), user);
            $('#identityCards').attr("readonly","readonly");
            $("#state").attr("checked",""+user.payType == 0);
        }
        else{
            $("#payType").val("0");
        }

        $('#formSubmit').submit(function (e) {
            if ($("#realname").val() == '') {
                highlight_weui_error($("#realname"));
                doErrorMsg("姓名为空", false);
                return false;
            }
            if ($("#phone").val() == '') {
                highlight_weui_error($("#phone"));
                doErrorMsg("手机为空", false);
                return false;
            }
            if ($("#identityCards").val() == '') {
                highlight_weui_error($("#identityCards"));
                doErrorMsg("身份证为空", false);
                return false;
            }
            if ($("#file1").val() == '' && user.cardsFront == '') {
                highlight_weui_error($("#file1"));
                doErrorMsg("正面照片为空", false);
                return false;
            }
            if ($("#file2").val() == '' && user.cardsBack == '') {
                highlight_weui_error($("#file2"));
                doErrorMsg("背面照片为空", false);
                return false;
            }

            // if ($("#bank").val() == '') {
            //     highlight_weui_error($("#bank"));
            //     doErrorMsg("开户银行为空", false);
            //     return false;
            // }
            // if ($("#bankName").val() == '') {
            //     highlight_weui_error($("#bankName"));
            //     doErrorMsg("户名为空", false);
            //     return false;
            // }
            // if ($("#bankAccount").val() == '') {
            //     highlight_weui_error($("#bankAccount"));
            //     doErrorMsg("银行帐号为空", false);
            //     return false;
            // }
            if (($("#payType").val() == 0 ) && ( $("#bank").val() == '' || $("#bankAccount").val() == '' || $("#bankName").val() == ''  )) {
                highlight_weui_error($("#bank"));
                doErrorMsg("银行信息不完整", false);
                return false;
            }
            if (($("#payType").val() == 1 ) && ( $("#alipayAccount").val() == '' || $("#alipayName").val() == ''  )) {
                highlight_weui_error($("#alipayAccount"));
                doErrorMsg("支付宝信息不完整", false);
                return false;
            }
            if ($("#address").val() == '') {
                highlight_weui_error($("#address"));
                doErrorMsg("收货地址为空", false);
                return false;
            }
            var afterUrl = "window.location.href='"+WEB_GLOBAL_CTX;
            if(user.id == null ) {
                afterUrl = afterUrl + "/agent/newOk/" + $("#realname").val() + "/" + $("#phone").val()+"'";
            }
            else
            {
                afterUrl =  afterUrl + "/agentLogin"+"'";
            }
            var $form = $(e.target);
            if ($("#file1").val() != '' && $("#file2").val() != '') {
                var params = $form.serializeArray();

                var formData = new FormData(),
                    files1 = $form.find('[name="file"]')[0].files,
                    files2 = $form.find('[name="file"]')[1].files;

                $.each(files1, function (i, file) {
                    formData.append('file1', file);
                });

                $.each(files2, function (i, file) {
                    formData.append('file2', file);
                });
                $.each(params, function (i, val) {
                    formData.append(val.name, val.value);
                });
                $.ajax({
                    url: WEB_GLOBAL_CTX + "/console/security/user/saveWexin",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (rsp) {
                        if (rsp.successful) {
                            $("#save").toggleClass("weui_btn_disabled");
                            setTimeout(afterUrl, 1000);
                            return true;
                        }
                        else {
                            doErrorMsg(rsp.msg, false);
                            return false;
                        }
                    }
                });
            } else {
                var params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/console/security/user/saveAgentWexinUser", params, function (rsp) {
                    if (rsp.successful) {
                        doErrorMsg(rsp.msg, true);
                        $("#save").toggleClass("disabled");
                        setTimeout(afterUrl, 1000);
                    } else {
                        doErrorMsg(rsp.msg, false);
                    }
                }).error(function () {
                    doErrorMsg(rsp.msg, false);
                    return false;
                });
            }
            return false;
        });

        $("#back").bind("click", function () {
            window.history.go(-1);
        });


    });

