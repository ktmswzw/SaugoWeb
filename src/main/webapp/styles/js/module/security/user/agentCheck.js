/**
 * Created by vincent on 16/8/30.
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



        if(user!=undefined&&user!=null&&user!=""&&(user.id != null )) {
            //初始化页面
            meForm($('#formSubmit'), user);

            $("#href1").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsFront);
            $("#href1").append('<img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsFront+'" alt="正面" class="img-thumbnail img-responsive">');

            $("#href2").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsBack);
            $("#href2").append('<img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+user.cardsBack+'" alt="背面" class="img-thumbnail img-responsive">');
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
                $.post(WEB_GLOBAL_CTX + "/console/security/user/check", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;

        });

        parent.Loading.modal('hide');
    });

