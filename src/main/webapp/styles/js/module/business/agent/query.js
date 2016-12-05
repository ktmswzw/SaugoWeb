/**
 * Created by imanon.net on 16/9/4.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        $('#produceId').append("<option value='0'></option>");

        //初始化下拉框 //可做异步下拉框选择
        initSelect("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", false);

        $('#status').append("<option ></option>");
        initSelectOne("status", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'ORDER_STATUS'}, status, "dicKey", "dicValue",false);

        $("#type,#produceId,#status,#beginDate,#endDate").change(function(){
            $("#formSubmit").submit();
        });

    });

