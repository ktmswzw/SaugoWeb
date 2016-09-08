/**
 * Created by imanon.net on 16/9/7.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        $('#produceId').append("<option ></option>");

        //初始化下拉框 //可做异步下拉框选择
        initSelectOne("type", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'AGENT_LEVEL'}, type, "dicKey", "dicValue",false);

        initSelectOne("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", false);


        $('#agentId').append("<option ></option>");
        initSelectOne("agentId", WEB_GLOBAL_CTX + "/console/security/user/chooseListThree", {name: ''}, agentId, "id", "realname", false);


        $('#status').append("<option ></option>");
        initSelectOne("status", WEB_GLOBAL_CTX+"/business/dictionary/getDropDown", {dicName: 'ORDER_STATUS'}, status, "dicKey", "dicValue",false);


        $("#query").bind("click", function () {
            $("#formSubmit").submit();
        });

    });

