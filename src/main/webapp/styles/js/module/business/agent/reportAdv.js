/**
 * Created by vincent on 16/9/7.
 */
requirejs(['jquery', 'ie10', 'comm', 'form'],
    function () {

        $('#produceId').append("<option ></option>");

        initSelectOne("produceId", WEB_GLOBAL_CTX + "/business/produce/chooseList", {name: ''}, produceId, "id", "name", false);


        $('#agentId').append("<option ></option>");
        initSelectOne("agentId", WEB_GLOBAL_CTX + "/console/security/user/chooseListThree", {name: ''}, agentId, "id", "realname", false);


        $("#query").bind("click", function () {
            $("#formSubmit").submit();
        });

    });

