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
        var count=1;
        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
            $("#href").attr("href",WEB_GLOBAL_CTX + "/download/getImg?filePath="+order.url);
            $("#href").append('<img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+order.url+'" alt="银行水单" style="height: 400px" class="img-thumbnail img-responsive">');

            if(order.url2 != "" && order.url2 != null) {
                count +=1;
                editUrl(order.url2,2);
            }
            if(order.url3!="" && order.url3 != null) {
                count +=1;
                editUrl(order.url3,3);
            }
            if(order.url4!="" && order.url4 != null) {
                count +=1;
                editUrl(order.url4,4);
            }
            if(order.url5!="" && order.url5 != null) {
                count +=1;
                editUrl(order.url5,5);
            }
        }


        function editUrl(url,cnt) {
            insertImageHtml(cnt);
            $("#href"+cnt).attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + url);
            $("#href"+cnt).append('<img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+url+'" alt="银行水单" style="height: 400px" class="img-thumbnail img-responsive">');
        }



        function insertImageHtml(number) {
            $("#newImage").before('<div class="row control-group"><div class="col-sm-2 col-sm-offset-1"><label class="control-label" >水单'+number+'</label>' +
                '</div><div class="col-sm-8"><a href="" target="_blank" id="href'+number+'"></a></div></div>');
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


