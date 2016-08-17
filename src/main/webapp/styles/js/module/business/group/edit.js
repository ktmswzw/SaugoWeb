//加载插件
requirejs(['jquery', 'bootstrap', 'fuelux', 'switchs', 'select', 'select2', 'selectCN', 'validator', 'vb', 'validatorLAG', 'comm', 'form', 'message',
        'summernote', 'summernote_lang', 'codemirrorxml', 'codemirrormin', 'codemirrorformatting', 'highlight'],
    function ($, _) {

        //富文本框
        $('.summernote').summernote({
            height: 500,
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

        if (group != undefined && group != null && group != "" && (group.id != null )) {
            //初始化页面
            meForm($('#formSubmit'), group);

            //圈子习惯
            //var initList =   group.habitsString.split(",");
            //initSelect("habitsString", WEB_GLOBAL_CTX+"/habit/habit/findHabits", '',initList, "id", "name",true);
            //圈子分类
            var initGroupCatalogList = group.groupCatalogsString.split(",");
            initSelect("groupCatalogsString", WEB_GLOBAL_CTX + "/habit/groupCatalog/findGroupCatalog", '', initGroupCatalogList, "id", "name", true);


            $('.summernote').code(group.richInfo);
        }
        else {
            //圈子习惯
            //initSelect("habitsString", WEB_GLOBAL_CTX+"/habit/habit/findHabits", '','', "id", "name",true);
            //圈子分类
            initSelect("groupCatalogsString", WEB_GLOBAL_CTX + "/habit/groupCatalog/findGroupCatalog", '', '', "id", "name", true);
        }


        var url_me = WEB_GLOBAL_CTX + "/habit/habit/findHabits";
        $("#habitsStringTitle").select2({
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
            escapeMarkup: function (markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });

        function formatRepoSelection(repo) {
            return repo.name;
        }

        parent.Loading.modal('hide');

        //提交


        if (group.size == "") {
            $('#size').val(0);
        }

        $('#createTime').val(group.create_time);

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
        }).on('success.form.fv', function (e) {
            e.preventDefault();

            //$("#habitsString").val(habitIds.join(","));
            //$("#habitsName").val(habitNames.join(","));

            var habitsString = $('#habitsStringTitle');
            if (habitsString.val() == null && $("#habitsString").val() == "") {
                highlight_error(habitsString);
                return false;
            }
            else if (($("#avatar").val() == '' ) && ( $("#file").val() == '')) {
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
                            $.scojs_message(rsp.msg, $OK);
                            $("#save").toggleClass("disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/group/list'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }
                });
                return true;
            }
            else {
                var $form = $(e.target),
                    params = $form.serializeArray();

                $.post(WEB_GLOBAL_CTX + "/habit/group/update", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/habit/group/list'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;
            }
        });

    });

