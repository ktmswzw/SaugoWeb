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

        if(stickers!=undefined&&stickers!=null&&stickers!="") {
            //初始化页面
            $("#habitId").val(stickers.habit_id);
            $("#catalogId").val(stickers.catalog_id);
            meForm($('#formSubmit'), stickers);
        }
        else
        {

        }
        //修改页面结束

        var listAction = "";
        if($("#habitId").val()!=undefined&&$("#habitId").val()!="")listAction = '/habit/stickers/list/'+$("#habitId").val();
        if($("#catalogId").val()!=""&&$("#catalogId").val()!=undefined)listAction = '/habit/stickers/list2/'+$("#catalogId").val();

        parent.Loading.modal('hide');

        //提交
        $('#formSubmit').formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            locale: 'zh_CN',
            excluded: ':disabled'
        }).on('success.field.fv', function(e, data) {
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                data.fv.disableSubmitButtons(true);
            }
        })
            .on('success.form.fv', function (e) {
                e.preventDefault();
                if (($("#url").val() == '' )&&( $("#file").val() == '')) {
                    highlight_error($("#file"));
                    return false;
                } else if($("#file").val() != ''){
                    var $form = $(e.target),
                        formData = new FormData(),
                        params = $form.serializeArray(),
                        files = $form.find('[name="file"]')[0].files;

                    $form.attr('enctype', 'multipart/form-data');

                    $.each(files, function (i, file) {
                        formData.append('file', file);
                    });

                    $.each(params, function (i, val) {
                        formData.append(val.name, val.value);
                    });

                    $.ajax({
                        url: $form.attr('action'),
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (rsp) {
                            if (rsp.successful) {
                                $.scojs_message(rsp.msg, $OK);
                                $("#save").toggleClass("disabled");
                                setTimeout("window.location.href='" +listAction+ "'", 1000);
                            } else {
                                $.scojs_message(rsp.msg, $ERROR);
                            }
                        }
                    });
                    return true;
                }else
                {
                    var $form = $(e.target);
                    var params = $form.serialize();
                    $.post(WEB_GLOBAL_CTX + "/habit/stickers/update", params, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            $("#save").toggleClass("disabled");
                            setTimeout("window.location.href='" + listAction+ "'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                    });
                    return true;
                }
            });

    });

