/**
 * Created by vincent on 16/9/4.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        $('#produceId').append("<option value='0'></option>");

        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", false);

        $("#query").bind("click", function () {
            $("#formSubmit").submit();
        });

    });

