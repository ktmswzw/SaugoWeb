/**
 * Created by vincent on 16/9/4.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        var produceId = "";

        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
            produceId = order.produceId;
            delete order["produceId"];

            $("#href").attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + order.url);
            $("#href").append('<button type="button" class="btn btn-link">下载</button>');
        }
        else {
            meForm($('#formSubmit'), order);
        }

        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", false);


        $('#formSubmit').submit(function (e) {
            var produceId = $('#produceId');
            var produceNumber = $('#produceNumber');
            var produceName = $('#produceId').find("option:selected").text();

            if (produceId.val() == '') {
                highlight_weui_error(produceId);
                doErrorMsg("产品未选", false);
                return false;
            }
            if (produceNumber.val() == '' || produceNumber.val() < 100 || produceNumber.val() > 200) {
                highlight_weui_error(produceNumber);
                doErrorMsg("数量不正确", false);
                return false;
            }
            if (($("#url").val() == '' ) && ( $("#file").val() == '')) {
                highlight_weui_error($("#file"));
                doErrorMsg("水单照片未上传", false);
                return false;
            }
            var $form = $(e.target);
            var params = $form.serializeArray();

            if ($("#file").val() != '') {

                e.preventDefault();
                var formData = new FormData(),
                    files = $form.find('[name="file"]')[0].files;
                $.each(files, function (i, file) {
                    formData.append('file', file);
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
                            $("#save").toggleClass("weui_btn_disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agent/orderOk/" + produceNumber.val() + "/" + produceName + "'", 1);
                            return true;
                        }
                        else{
                            doErrorMsg(result.msg,false);
                            return false;
                        }
                    }
                });
                return false;
            }
            else {
                params = $form.serialize();
                $.post(WEB_GLOBAL_CTX + "/business/order/update", params, function (rsp) {
                    if (rsp.successful) {
                        $("#save").toggleClass("weui_btn_disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agent/orderOk/" + produceNumber.val() + "/" + produceName + "'", 1);

                    } else {
                        doErrorMsg(rsp.msg, false);
                        return false;
                    }
                }).error(function () {
                });
                return true;
            }

        });

        $("#back").bind("click", function () {
            window.history.go(-1);
        });


    });
