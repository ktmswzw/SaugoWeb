//加载插件
requirejs(['jquery','bootstrap', 'fuelux', 'select2', 'select','selectCN','validator', 'vb', 'validatorLAG', 'comm', 'form', 'message','highlight'],
    function ($, _) {
        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        var url_me = WEB_GLOBAL_CTX+"/habit/habit/findHabits";
        if(type==1)
        {
            url_me = WEB_GLOBAL_CTX+"/habit/group/findGroups";
        }

        if (recommend.id!= null) {
            //初始化页面
            meForm($('#formSubmit'), recommend);
            $('.selectpicker').selectpicker(recommend.sort);
            $('.selectpicker').selectpicker('refresh')


            var initList =   recommend.habitId.split(",");
            //initSelect("habitId", WEB_GLOBAL_CTX+url_me, '',initList, "id", "name",true);
        }
        else {
            $("#type").val(type)
            //initSelect("habitId", WEB_GLOBAL_CTX+url_me, '','', "id", "name",true);
        }

        $("#selectName").select2({
            ajax: {
                url: url_me,
                dataType: 'json',
                delay: 350,
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;

                    return {
                        results: data,
                        pagination: {
                            more: (params.page * 30) < data.length
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });
        function formatRepoSelection (repo) {
            //return repo.id || repo.name;
            $("#habitId").val(repo.id);
            $("#habitName").val(repo.name);
            return repo.name;
        }
        //修改页面结束

        setHeightSelf(400);
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
        }).on('success.field.fv', function (e, data) {
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                data.fv.disableSubmitButtons(true);
            }
        })
            .on('success.form.fv', function (e) {
                e.preventDefault();
                var $form = $(e.target);
                var params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/habit/recommend/save", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/recommend/list/" + type+"'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {

                });
                return true;
            });
    });






