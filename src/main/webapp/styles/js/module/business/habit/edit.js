//加载插件
requirejs(['jquery', 'bootstrap', 'fuelux', 'switchs', 'select', 'selectCN', 'validator', 'vb', 'validatorLAG', 'comm', 'form', 'message',
        'summernote', 'summernote_lang', 'codemirrorxml', 'codemirrormin', 'codemirrorformatting', 'highlight'],
    function ($, _) {

        //富文本框
        $('.summernote').summernote({
            height: 556,
            lang: 'zh-CN',
            onImageUpload: function (files, editor, welEditable) {
                //console.log('image upload:', files, editor, welEditable);
                sendFile(files[0], editor, $('.summernote'));
            },
            codemirror: { // codemirror options
                mode: 'text/html',
                htmlMode: true,
                lineNumbers: true,
                theme: 'monokai'
            }
        });

        setHeightSelf(400);
        //富文本结束

        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;

        $("#remind").val(0);//不设置无法提交

        if (habit != undefined && habit != null && habit != "" && (habit.id != null )) {
            //初始化页面
            meForm($('#formSubmit'), habit);


            //初始化下拉框 //可做异步下拉框选择
            //$('.selectpicker').selectpicker('val', habit.typeName);
            $('.selectpicker').selectpicker(habit.typeName);
            $('.selectpicker').selectpicker('refresh');

            delete habit["habitCatalogList"];
            var initList = habit.habitCatalogString.split(",");
            initSelect("habitCatalogString", WEB_GLOBAL_CTX + "/habit/habit/findHabitCatalog", '', initList, "id", "name", true);

            if (habit.type == "TIMING") {
                $("#remindTiming").css('display', 'block');
            }
            else {
                $("#remindTiming").css('display', 'none');
            }
            $('.summernote').code(habit.richInfo);
        }
        else {
            initSelect("habitCatalogString", WEB_GLOBAL_CTX + "/habit/habit/findHabitCatalog", '', '', "id", "name", true);
        }
        //修改页面结束
        var selected = "";
        $('.selectpicker').on('change', function () {
            selected = $(this).find("option:selected").val();
            if (selected == "TIMING") {
                $("#remindTiming").css('display', 'block');
            }
            else {
                $("#remindTiming").css('display', 'none');
            }
        });


        parent.Loading.modal('hide');

        //提交
        var habitCatalogString = $('#habitCatalogString');


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
                //data.fv.disableSubmitButtons(true);
            }
        })
            .on('success.form.fv', function (e) {
                e.preventDefault()

                if (habitCatalogString.val() == '') {
                    highlight_error(habitCatalogString);
                    return false;
                } else if (($("#img").val() == '' ) && ( $("#file").val() == '')) {
                    highlight_error($("#file"));
                    return false;
                }
                else if ($("#file").val() != '') {

                    var $form = $(e.target),
                        formData = new FormData(),
                        params = $form.serializeArray(),
                        files = $form.find('[name="file"]')[0].files;

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
                                $("#save").toggleClass("disabled");
                                if (selected == "RECORD") {
                                    $.scojs_message("操作成功，记录型需要维度配置", $OK);
                                    setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/recordList/" + rsp.data + "'", 1000);
                                }
                                else {
                                    $.scojs_message(rsp.msg, $OK);
                                    setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/list'", 1000);
                                }
                            } else {
                                $.scojs_message(rsp.msg, $ERROR);
                            }
                        }
                    });
                    return true;
                }
                else {
                    var $form = $(e.target);
                    var params = $form.serialize();
                    $.post(WEB_GLOBAL_CTX + "/habit/habit/update", params, function (rsp) {
                        if (rsp.successful) {
                            $.scojs_message(rsp.msg, $OK);
                            $("#save").toggleClass("disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/habit/list'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }).error(function () {
                    });
                    return true;
                }
            });


    });

