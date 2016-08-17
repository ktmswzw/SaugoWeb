//加载插件
requirejs(['jquery','bootstrap','fuelux','validator','vb','validatorLAG','comm','form','message'],
    function ($,_) {

        //返回
        $("#back").bind("click",function(){
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        if(record!=undefined&&record!=null&&record!=""&&(record.name != null )) {
            //初始化页面
            delete record["list"];
            meForm($('#formSubmit'), record);
        }
        else
        {

        }
        //修改页面结束

        $("#habitId").val(habitId);

        //增加一行
        $('[name="optionListButton"]').click(function () {
            $("#btn").append('<div class="row control-group"><div id="optionNameBegin" class="col-sm-offset-3 col-sm-8 controls"><input class="form-control" type="text" placeholder="输入维度"  name="list" required></div></div>');
        });


        parent.Loading.modal('hide');

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
                e.preventDefault()
                var $form = $(e.target);
                var params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/habit/habit/recordSave", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/recordList/"+habitId+"'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;
            });

    });

