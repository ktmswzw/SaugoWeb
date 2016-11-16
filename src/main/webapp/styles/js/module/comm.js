/**
 * Created by  moxz on 2015/1/21.
 */

function highlight_error(el) {
    if(el.val() == '') {
        el.parent().addClass('has-error');
    } else {
        el.parent().removeClass('has-error');
    }
}

function highlight_weui_error(el) {
    if(el.val() == '') {
        el.parent().parent().addClass('weui_cell_warn');
    } else {
        el.parent().parent().removeClass('weui_cell_warn');
    }
}
function doErrorMsg(msg,type) {
    $('#error_dialog').html(msg);
    if(type){
        $('#msgType').html('');
        $('#msgType').html('<i class="weui_icon_msg weui_icon_success"></i>');
    }
    else{
        $('#msgType').html('');
        $('#msgType').html('<i class="weui_icon_msg weui_icon_warn"></i>');
    }
    $('#toast').show();
    setTimeout(function () {
        $('#toast').hide();
    }, 1500);
}
function doLoadMsg(msg) {
    $('#loading_dialog').html(msg);
    $('#loadingToast').show();
    setTimeout(function () {
        $('#loadingToast').hide();
    }, 2000);
}
function randomKey(){
    $("#Kaptcha").attr("src", WEB_GLOBAL_CTX+"/captcha/captchaing?" + Math.floor(Math.random() * 100)).fadeIn();
}

function imgFormatter(value, row, index) {
    var temp = "";
    if (value !=null && value.length > 0 && value != undefined) {
        temp = '<img src="' + getSmallImgUrl(value) + '" class="img-rounded" style="width:50px;">';
    }
    return temp;
}

function imgFormatter2(value, row, index) {
    var temp = "";
    if (value !=null && value.length > 0 && value != undefined) {
        temp = '<img src="http://' + value + '" class="img-rounded" style="width:50px;">';
    }
    return temp;
}

function doMsg(msg,type)
{
    var typeMsg = '';
    switch(type)
    {
        case 1:
            typeMsg="alert-success";
            break;
        case 2:
            typeMsg="alert-warning";
            break;
        default:
            typeMsg="alert-info";
    }
    var divInfo = '<div class="alert '+typeMsg+'" role="alert" id="msg">'+
        '<button type="button" class="close" data-dismiss="alert">'+
        '<span aria-hidden="true">×</span>'+
        '<span class="sr-only">Close</span>'+
        '</button>'+
        '<h4>'+
        '<strong>'+msg+'</strong>'+
        '</h4>'+
        '</div>';
    $("#hiddenMsg").append(divInfo);
}


function setMain(url, a_this) {
    var inputArray = $("#accordion .list-group a");
    inputArray.each(//使用数组的循环函数 循环这个input数组
        function () {
            var a = $(this);//循环中的每一个input元素
            if (a.hasClass("active"))
                a.removeClass('active');
        }
    )
    $(a_this).toggleClass("active");
    $('#main').attr('src', url);
}



//初始化下拉框函数
function initSelect(id, ajaxUrl, ajaxDataParam, initData, sValue, sText,isQuery) {
    //同步
    $.ajax({
        async: false,
        cache: false,
        type: 'POST',
        url: ajaxUrl,
        data: ajaxDataParam,
        error: function () {// 请求失败处理函数
            //$.scojs_message("更新失败,请重新登录!", $ERROR);
        },
        success: function (result) {
            var options = "";
            $(result).each(function () {
                options += selectOption($(this), initData, sValue, sText);
            });
            //console.debug(options);
            $("#" + id).append(options);
            if(isQuery)
            addSearchBox(id);
        }
    });
}

//初始化下拉框函数
function initSelectOne(id, ajaxUrl, ajaxDataParam, initData, sValue, sText,isQuery) {
    //同步
    $.ajax({
        async: false,
        cache: false,
        type: 'POST',
        url: ajaxUrl,
        data: ajaxDataParam,
        error: function () {// 请求失败处理函数
            //$.scojs_message("更新失败,请重新登录!", $ERROR);
        },
        success: function (result) {
            var options = "";
            $(result).each(function () {
                options += selectOptionOne($(this), initData, sValue, sText);
            });
            //console.debug(options);
            $("#" + id).append(options);
            if(isQuery)
                addSearchBox(id);
        }
    });
}



function formatRepo (repo) {
    if (repo.loading) return repo.text;
    var image_url = "";
    var name = "";
    var description = "";
    if(type==1) {
        if (repo.customAvatar != "")
            image_url = repo.customAvatar;
        else
            image_url = repo.avatar;
    }
    else
    {
        image_url = repo.img;
    }
    name = repo.name;
    image_url = getSmallImgUrl(image_url);
    var markup = "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__avatar'><img src='" + image_url + "' /></div>" +
        "<div class='select2-result-repository__meta'>" +
        "<div class='select2-result-repository__title'>" + name + "</div>";

    if (repo.description) {
        markup += "<div class='select2-result-repository__description'>" + description + "</div>";
    }
    markup += "<div class='select2-result-repository__statistics'>" +
        "</div>" +
        "</div></div>";
    return markup;
}


function  getSmallImgUrl(urlP)
{
    return IMAGE_HREF + urlP +"/small";
}


function addSearchBox(id) {

    //增加搜索框
    var jObj = $('#' + id)
        .selectpicker({
            liveSearch: true
        });
    //使用移动选择
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        jObj.selectpicker('mobile');
    }
}
//下拉框选中及产生
//3,4

function selectOption(obj, initData, sValue, sText) {
    var text = (sText != undefined && sText != null && sText != "") ? sText : "name";
    var value = (sValue != undefined && sValue != null && sValue != "") ? sValue : "id";
    var selected = "";//默认不选择
    //判断是否是已存储的选择
    if (initData != undefined && initData != null && initData != "") {
        for(var i=0;i<initData.length;i++) {
            if (initData[i] == obj[0][value]) {
                selected = "selected";
                //console.debug(initData[i]+"==="+obj[0][value]);
                break;
            }
        }
    }
    return "<option " + selected + " value='" + obj[0][value] + "'>" + obj[0][text] + "</option>\n";
}

function selectOptionOne(obj, initData, sValue, sText) {
    var text = (sText != undefined && sText != null && sText != "") ? sText : "name";
    var value = (sValue != undefined && sValue != null && sValue != "") ? sValue : "id";
    var selected = "";//默认不选择
    //判断是否是已存储的选择
    if (initData != undefined && initData != null && initData != "") {
        if (initData == obj[0][value]) {
            selected = "selected";
        }
    }
    return "<option " + selected + " value='" + obj[0][value] + "'>" + obj[0][text] + "</option>\n";
}

//初始化fuelue树
function initTree(ajaxUrl, ajaxDataParam, initData) {
    //同步
    var temp_tree_data = {data:[]};
    $.ajax({
        async: false,
        cache: false,
        type: 'POST',
        url: ajaxUrl,
        data: ajaxDataParam,
        error: function () {// 请求失败处理函数
            //$.scojs_message("更新失败,请重新登录!", $ERROR);
        },
        success: function (result) {
            $(result.data).each(function () {
                var t = selectTreeOption(this,initData);
                temp_tree_data.data.push(t);
            });
            //temp_tree_data = result
        }
    });
    return temp_tree_data;
}


function getBean(param,url)
{

    var tempBean;
    $.ajax({
        async: false,
        cache: false,
        type: 'POST',
        url: WEB_GLOBAL_CTX+url,
        data: param,
        error: function () {// 请求失败处理函数

        },
        success: function (result) {
            tempBean = result
        }
    });
    return tempBean;
}

//下拉框选中及产生
var item_data_icon = 'icon-item glyphicon fueluxicon-bullet';
var selected_item_data_icon= 'glyphicon icon-item glyphicon-ok';
var select_class_name = 'tree-selected';
function selectTreeOption(obj, initData) {
    var selected = "";//默认不选择
    //判断是否是已存储的选择
    obj.attr.dataIcon=item_data_icon;
    if (initData != undefined && initData != null && initData != "") {
        for(var i=0;i<initData.length;i++){
            if (initData[i] == obj.attr.id) {
                obj.attr.className = select_class_name;
                obj.attr.dataIcon=selected_item_data_icon;
                return obj
            }
        }
    }
    return obj;
}

function asyncTreeValue(treeId,id)
{
    var temp="";
    $($('#'+treeId).tree('selectedItems')).each(function () {
        temp+=","+this.attr.id;
    });
    $("#"+id).val(temp.substr(1,temp.length));
}


function flashTable(id,url)
{
    $('#'+id).bootstrapTable('refresh', {
        url: WEB_GLOBAL_CTX+url,
        dataType:'json'
    });
}

function serializeObject( formname )
{
    var o = {};
    var a = $("#"+formname).serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


var buttonArray = ["modify", "check", "delete", "close", "comment", "info", "force", "permission", "compressed", "back", "fix"];

function showEdit(obj, editDivId, appendDivId) {
    var objects = obj.bootstrapTable('getSelections');
    var temp = "";
    if (objects.length != 0 && $("#" + appendDivId + " button").children().length <= 1) {
        temp=appendDivId;
    }
    if (objects.length == 0) {
        temp = editDivId;
    }
    $.each(buttonArray,function(i,val){
        if($("#"+val)!=undefined)
            $("#" + temp).append($("#"+val));
    });
}


//调整父级高度
function setHeight()
{
    var now = document.body.clientHeight;
    $('#main', parent.document).attr("style","height:"+now+"px");
}

//调整父级高度l自定义
function setHeightSelf(height)
{
    var now = document.body.clientHeight + height;
    $('#main', parent.document).attr("style","height:"+now+"px");
}

//初始树
function meTreeInit(treeid,initData,url,multiSelect,folderSelect,rootid) {
    var tree = $('#'+treeid).tree({
        dataSource: function(parentData, callback){
            setTimeout(function () {
                rootid = (rootid==undefined||rootid==null)?1:rootid;
                var id = (parentData!=undefined&&parentData!=null&&parentData.attr!=undefined)?parentData.attr.id:rootid;
                var data = initTree(WEB_GLOBAL_CTX+url+id,"",initData);
                callback(data);
                parent.Loading.modal('hide');
            }, 200);
        },
        multiSelect: multiSelect,
        folderSelect: folderSelect
    });
    tree.tree('discloseAll');
}

//判断是哪个内置浏览器
var isWeixin = false, isWeibo = false, isQzone = false;

var ua = navigator.userAgent;
var isiOS = navigator.userAgent.match(/(iPhone|iPod|iPad);?/i),
    isAndroid = navigator.userAgent.match(/android/i),
    isDesktop = !isiOS && !isAndroid;
if (/MicroMessenger/.test(ua)) {
    isWeixin = true;
} else if (/Weibo/.test(ua)) {
    isWeibo = true;
} else if (/QQ\//i.test(ua)) {
    isQzone = true;
} else {
    ;
}

function sendFile(file, editor, obj) {
    data = new FormData();
    data.append("file", file);
    url = WEB_GLOBAL_CTX+"/habit/recommend/uploadImage";
    $.ajax({
        data: data,
        type: "POST",
        url: url,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            obj.summernote('editor.insertImage', data.msg);
        }
    });
}

function stringFormatJson(s)
{
    var newstr = "";
    for (var i=0, len=s.length; i<len; i++)
    {
        c = s.charAt(i);
        switch (c)
        {
            case '\"':
            {
                newstr+="\\\"";
                break;
            }
            case '\\':
            {
                newstr+="\\\\";
                break;
            }
            case '/':
            {
                newstr+="\\/";
                break;
            }
            case '\b':
            {
                newstr+="\\b";
                break;
            }
            case '\f':
            {
                newstr+="\\f";
                break;
            }
            case '\n':
            {
                newstr+="\\n";
                break;
            }
            case '\r':
            {
                newstr+="\\r";
                break;
            }
            case '\t':
            {
                newstr+="\\t";
                break;
            }
            default:
            {
                newstr+=c;
            }
        }
    }
    return newstr;
}

function exportToExcel(title,name){
    var htmls = "";
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    var base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    };

    var format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
        })
    };

    htmls = document.getElementById(name).innerHTML;

    var ctx = {
        worksheet : 'Worksheet',
        table : htmls
    }


    var link = document.createElement("a");
    link.download = title+".xls";
    link.href = uri + base64(format(template, ctx));
    link.click();
}


function exportValue(value, row, index) {
    if (value != null)
        return '<div class="formatNumber" style="color: #3c4737; ">\'' + value + '</div>';
    else
        return "";
}
function idFormatter(value, row, index) {
    if (value.length > 0 && value != undefined ) {
        if(row.status == 2)
            return '<button type="button" class="btn btn-primary btn-sm" onclick="viewInfo(\''+row.id+'\')">查看</button>';
        else
            return '<button type="button" class="btn btn-danger btn-sm" onclick="viewInfo(\''+row.id+'\')">无效</button>';
    }
    return "";
}
function viewInfo(id)
{
    openWindow( WEB_GLOBAL_CTX+'/business/order/view/'+id);
}
function openWindow(url)
{
    window.open(url, '_blank');
    window.focus();
}


var orderStatusList = [{id: 1, name: '待确认'}, {id: 2, name: '已确认'}, {id: 9, name: '已撤销'}];
function orderStateFormatter(value, row, index) {
    for (var i = 0; !(i >= orderStatusList.length); i++) {
        if (orderStatusList[i].id == value) return orderStatusList[i].name;
    }
    return value;
}


var levelList = [{id: 1, name: '直代'}, {id: 2, name: '次代'}];
function levelFormatter(value, row, index) {
    for (var i = 0; !(i >= levelList.length); i++) {
        if (levelList[i].id == value) return levelList[i].name;
    }
    return value;
}

var statusList = [{id: 'enabled', name: '正常'}, {id: 'disabled', name: '注销'}, {id: 'check', name: '待确认'}];

function stateFormatter(value, row, index) {
    for (var i = 0; !(i >= statusList.length); i++) {
        if (statusList[i].id == value) return statusList[i].name;
    }
    return value;
}

//本页查询拼装
function queryParamsOrder(params) {
    var name = $("#search_agentName").val();
    var begin = $("#search_beginDate").val();
    var end = $("#search_endDate").val();
    var produceId = $("#produceId").val();
    var status = $('#status').val();
    var str = "";
    if(begin!="")
        str = "\"search_beginDate\":\"" + begin+"\"";
    if(end!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_endDate\":\"" + end+ "\"";
    }
    if(name!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_agentName\":\"" + name+ "\"";
    }
    if(produceId!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_produceId\":\"" + produceId+ "\"";
    }
    if(status!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_status\":\"" + status+ "\"";
    }
    var data = eval('({' + str.replace(new RegExp("/", 'g'),"-") + '})');
    params.sortName = "input_time";
    params.sortOrder = "desc";
    return $.extend({}, params, data);
}




//本页查询拼装
function reportParamsOrder(params) {
    Report_begin = $("#search_beginDate").val();
    Report_end = $("#search_endDate").val();
    Report_produceId = $("#produceId").val();

    var str = "";
    if(Report_begin!="")
        str = "\"search_beginDate\":\"" + Report_begin+"\"";
    if(Report_end!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_endDate\":\"" + Report_end+ "\"";
    }
    if(temp_parentid!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_agentId\":\"" + temp_parentid+ "\"";
    }
    if(Report_produceId!="") {
        if(str!="") {
            str += ",";
        }
        str += "\"search_produceId\":\"" + Report_produceId+ "\"";
    }
    var data = eval('({' + str.replace(new RegExp("/", 'g'),"-") + '})');
    params.sortName = "agent_id";
    params.sortOrder = "asc";
    return $.extend({}, params, data);
}

function reportFormatter(value, row, index) {
    var temp = "";
    if (value != undefined) {
        temp = '<button type="button" class="btn btn-primary btn-sm" onclick="viewReport(\''+value+'\')">查看</button>';
    }
    return temp;
}
function viewReport(id)
{
    openWindow( WEB_GLOBAL_CTX+'/business/order/queryReport?agentId='+id+"&condition="+Report_produceId+"|~"+Report_begin+"|~"+Report_end+"|");
}

if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    })
}

function logoutByError() {
    var localObj = window.location;
    if(isWeixin==undefined||(isWeixin!=undefined&&!isWeixin))
        parent.window.location = localObj.protocol + "//" + localObj.host + "/login";
    else {
        window.location = localObj.protocol + "//" + localObj.host + "/agentLogin"
    }
}