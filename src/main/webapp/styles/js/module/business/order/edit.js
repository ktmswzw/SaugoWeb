//加载插件
requirejs(['jquery', 'bootstrap', 'fuelux',  'select', 'selectCN', 'validator', 'vb', 'validatorLAG', 'comm', 'form', 'message'],
    function ($, _) {

        //返回
        $("#back").bind("click", function () {
            window.history.go(-1);
        });

        //提示框
        var $OK = $.scojs_message.TYPE_OK;
        var $ERROR = $.scojs_message.TYPE_ERROR;
        var produceId = "1";
        var agentId = "";

        var count = 1,edit_count=1;
        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
            produceId = order.produceId;
            delete order["produceId"];
            agentId = order.agentId;
            delete order["agentId"];
            if(order.url!="") {
                $("#href").attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + order.url);
                $("#href").append('<button type="button" class="btn btn-link">下载</button>');
            }
            if(order.url2!="") {
                edit_count +=1;
                editUrl(order.url2,edit_count);
            }
            if(order.url3!="") {
                edit_count +=1;
                editUrl(order.url3,edit_count);
            }
            if(order.url4!="") {
                edit_count +=1;
                editUrl(order.url4,edit_count);
            }
            if(order.url5!="") {
                edit_count +=1;
                editUrl(order.url5,edit_count);
            }

        }
        else {
            $("#inputId").val(order.inputId);
            $("#inputName").val(order.inputName);
            $('#produceId').append("<option ></option>");
            $('#agentId').append("<option ></option>");
        }

        function editUrl(url,count) {
            insertImageHtml(count);
            $("#href"+count).attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + url);
            $("#href"+count).append('<button type="button" class="btn btn-link">下载</button>');
        }



        function insertImageHtml(number) {
            $("#newImage").after('<div class="row control-group" ><div class="col-sm-2 col-sm-offset-1"><label class="control-label" for="file'+number+'">水单'+number+'</label></div>' +
                '<div class="col-sm-8 controls" ><input type="file" class="form-control" id="file'+number+'" name="file" size="100" /></div>'+
                '<div class="col-sm-1"><a href="" target="_blank" id="href'+number+'"></a></div></div>');
        }


        // $("#state").bootstrapSwitch('state', false);
        //修改页面结束


        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker').selectpicker('mobile');
        }

        //初始化下拉框 //可做异步下拉框选择
        initSelectOne("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", true);


        $("#produceId").change(function () {
            var v = $('#produceId').find("option:selected").text();
            $("#produceName").val(v);
        });

        initSelectOne("agentId", WEB_GLOBAL_CTX + "/console/security/user/chooseList", {name: ''}, agentId, "id", "realname", true);
        $("#agentId").change(function () {
            var v = $('#agentId').find("option:selected").text();
            $("#agentName").val(v.split("-上级")[0]);
        });

        $("#insertMore").click(function(){
            if(count<5){
                count +=1;
                insertImageHtml(count);
            }
        });

        function insertImageHtml(number) {
            $("#newImage").after('<div class="row control-group" ><div class="col-sm-2 col-sm-offset-1"><label class="control-label" for="file'+number+'">水单'+number+'</label></div>' +
                '<div class="col-sm-8 controls" ><input type="file" class="form-control" id="file'+number+'" name="file" size="100" /></div>'+
            '<div class="col-sm-1"><a href="" target="_blank" id="href'+number+'"></a></div></div>');
        }


        setHeightSelf(1000);
        var valid = $('#formSubmit').formValidation({
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
            var params = $form.serializeArray();
            if (($("#url").val() == '' ) && ( $("#file").val() == '')) {
                highlight_error($("#file"));
                return false;
            }
            else if ($("#file").val() != '') {
                var formData = new FormData(),
                    files = $form.find('[name="file"]');
                $.each(files, function (i, file) {
                    if(i==0)
                    formData.append('file', file.files[0]);
                    if(i==1)
                    formData.append('file2', file.files[0]);
                    if(i==2)
                    formData.append('file3', file.files[0]);
                    if(i==3)
                    formData.append('file4', file.files[0]);
                    if(i==4)
                    formData.append('file5', file.files[0]);
                });

                $.each(params, function (i, val) {
                    formData.append(val.name, val.value);
                });
                $.ajax({
                    url: WEB_GLOBAL_CTX + "/business/order/save",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (rsp) {
                        if (rsp.successful) {
                            $("#save").toggleClass("disabled");
                            $.scojs_message(rsp.msg, $OK);
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/order/index'", 1000);
                        } else {
                            $.scojs_message(rsp.msg, $ERROR);
                        }
                    }
                });
                return true;
            }
            else {
                params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/business/order/update", params, function (rsp) {
                    if (rsp.successful) {
                        $.scojs_message(rsp.msg, $OK);
                        $("#save").toggleClass("disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/order/index'", 1000);
                    } else {
                        $.scojs_message(rsp.msg, $ERROR);
                    }
                }).error(function () {
                });
                return true;
            }
        });


        $("#file").change(function () {
            $("#save").removeAttr("disabled");
            $("#save").removeAttr("disabled");
        });

        parent.Loading.modal('hide');
    });


