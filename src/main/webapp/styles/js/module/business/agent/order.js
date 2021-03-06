/**
 * Created by imanon.net on 16/9/4.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        var produceId = "";

        var count = 1;
        if (order != undefined && order.id != null && order.id != "") {
            //初始化页面
            meForm($('#formSubmit'), order);
            produceId = order.produceId;
            delete order["produceId"];
            $("#href").attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + order.url);
            $("#href").append('<p><img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+order.url+'" alt="银行水单" style="height: 100px"></p>');



            if(order.status!=1||order.selfOrder=="0"){
                $("#save").remove();
                $("#bankImage").toggleClass("hiddeDiv");
                $("#bankId").remove();
                $("#title").html("查看订单");

                if(order.url2 != "" && order.url2 != null) {
                    count +=1;
                    editImage(order.url2,2);
                }
                if(order.url3!="" && order.url3 != null) {
                    count +=1;
                    editImage(order.url3,3);
                }
                if(order.url4!="" && order.url4 != null) {
                    count +=1;
                    editImage(order.url4,4);
                }
                if(order.url5!="" && order.url5 != null) {
                    count +=1;
                    editImage(order.url5,5);
                }
            }
            else {
                $("#delete").toggleClass("hiddeDiv");
                $("#title").html("修改订单");

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
        }
        else {
            meForm($('#formSubmit'), order);
        }


        function editUrl(url,cnt) {
            insertImageHtml(cnt);
            $("#href"+cnt).attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + url);
            $("#href"+cnt).append('<p><img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+url+'" alt="银行水单" style="height: 100px"></p>');
        }

        function editImage(url,cnt) {
            insertImageView(cnt);
            $("#href"+cnt).attr("href", WEB_GLOBAL_CTX + "/download/getImg?filePath=" + url);
            $("#href"+cnt).append('<p><img src="'+WEB_GLOBAL_CTX + "/download/getImg?filePath="+url+'" alt="银行水单" style="height: 100px"></p>');
        }


        $("#insertMore").click(function(){
            if(count<5){
                count +=1;
                insertImageHtml(count);
                if(count==5)
                    $("#insertMore").remove();
            }
        });

        function insertImageView(number) {
            $("#bankImage").after('<div class="weui_cell"><div class="weui_cell_hd"><label class="weui_label">水单'+number+'</label></div>' +
                '<div class="weui_cell_bd weui_cell_primary"><a href="" target="_blank" id="href'+number+'"></a></div></div>');
        }

        function insertImageHtml(number) {
            $("#bankImage").before('<div class="weui_cell"><div class="weui_cell_hd"><label class="weui_label">水单'+number+'</label></div>' +
                '<div class="weui_cell_bd weui_cell_primary"><input id="file'+number+'" name="file" placeholder="选择图片" type="file"></div></div>');
        }



        $("#produceId").change(function () {
            var v = $('#produceId').find("option:selected").text();
            $("#produceName").val(v);
        });


        //初始化下拉框 //可做异步下拉框选择
        initSelectOne("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", false);


        $('#formSubmit').submit(function (e) {
            var produceId = $('#produceId');
            var produceNumber = $('#produceNumber');

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

            doLoadMsg("照片上传中");

            var $form = $(e.target);
            var params = $form.serializeArray();

            if ($("#file").val() != '') {

                e.preventDefault();
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
                            $("#save").toggleClass("weui_btn_disabled");
                            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agent/orderOk/" + produceNumber.val() + "/" + $('#produceId').find("option:selected").text() + "'", 1);
                            return true;
                        }
                        else{
                            doErrorMsg(rsp.msg,false);
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
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agent/orderOk/" + produceNumber.val() + "/" + $('#produceId').find("option:selected").text() + "'", 1);
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

        $("#delete").bind("click", function () {
            if(order.status==1) {
                $.post(WEB_GLOBAL_CTX + "/business/order/delete/" + order.id, function (rsp) {
                    if (rsp.successful) {
                        doErrorMsg(rsp.msg, false);
                        $("#delete").toggleClass("weui_btn_disabled");
                        $("#save").toggleClass("weui_btn_disabled");
                        setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/agent/home'", 2000);

                    } else {
                        doErrorMsg(rsp.msg, false);
                    }
                }).error(function () {
                    doErrorMsg("更新失败,请重新登录!", false);
                });
            }
            else{
                doErrorMsg("非 [待确认] 状态订单无法撤销!", false);
            }
        });



    });

