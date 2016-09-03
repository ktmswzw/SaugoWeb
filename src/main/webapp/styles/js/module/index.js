
var Loading;
var $OK;
var $ERROR;
requirejs(['jquery'],
    function () {
        requirejs(['bootstrap', 'ie10','comm','message'],
            function () {

                //提示框
                $OK = $.scojs_message.TYPE_OK;
                $ERROR = $.scojs_message.TYPE_ERROR;


                Loading = $('#myModal').modal({
                    show:false,
                    backdrop:true,
                    keyboard: false
                });
                $('[data-toggle="offcanvas"]').click(function () {
                    $('.row-offcanvas').toggleClass('active')
                    $('#left_memu').toggleClass('glyphicon-chevron-left');
                    $('#left_memu').toggleClass('glyphicon-chevron-right');
                });
                $('[data-toggle="collapse"]').click(function () {
                    $('#top_memu').toggleClass('glyphicon glyphicon-chevron-up');
                    $('#top_memu').toggleClass('glyphicon glyphicon-chevron-down');
                });

                $(window).resize(function () {
                    $(window).scroll(function () {
                        if ($(window).width() >= 751) {
                            if ($(window).scrollTop() > 50) {
                                if ($("#topNavBar").hasClass('resizeScroll'))
                                    $('#topNavBar').removeClass('resizeScroll');
                            }
                            else {
                                if (!$("#topNavBar").hasClass('resizeScroll'))
                                    $('#topNavBar').addClass('resizeScroll');
                            }
                        }
                    });
                });

                var temp  = getModuleString(1);
                $("#accordion").append(temp);
                Loading.modal('hide');
            });

    });


//初始化菜单
function getModuleList(id) {
    //同步
    var obj = {};
    $.ajax({
        async: false,
        cache: false,
        type: 'GET',
        url: WEB_GLOBAL_CTX + "/console/security/module/getModuleByP/"+id,
        error: function () {// 请求失败处理函数
            //$.scojs_message("更新失败,请重新登录!", $ERROR);
        },
        success: function (result) {
            obj = result;
        }
    });
    return obj;
}
var old_title = document.title;
//有需要确认用户的数据
function getAgentCheck() {
    //同步
    $.ajax({
        async: false,
        cache: false,
        type: 'GET',
        url: WEB_GLOBAL_CTX + "/console/security/user/alterAgentCheck",
        error: function () {// 请求失败处理函数
            //$.scojs_message("更新失败,请重新登录!", $ERROR);
        },
        success: function (result) {
            if(result!=0){
                $("#alterAgent").html(result);
                $(document).attr("title","提醒"+result+"条代理请求需要确认!!!");
                $.scojs_message("有新的代理需要确认!", $OK);
            }
            else{
                $("#alterAgent").html("");
                $(document).attr("title",old_title);
            }
           setInterval("scroll()",50);
        }
    });
}
//有需要确认订单的数据
function getOrderCheck() {
    //同步
    $.ajax({
        async: false,
        cache: false,
        type: 'GET',
        url: WEB_GLOBAL_CTX + "/business/order/alterOrderCheck",
        error: function () {// 请求失败处理函数
            //$.scojs_message("更新失败,请重新登录!", $ERROR);
        },
        success: function (result) {
            if(result!=0) {
                $("#alterOrder").html(result);
                $.scojs_message("有新的订单需要确认!", $OK);
            }
            else {
                $("#alterOrder").html("");
            }
            setInterval("scroll()",50);
        }
    });
}
function scroll(){
    var title=document.title ;
    var firstch=title.charAt (0);
    var leftstar=title.substring (1,title.length );
    document.title =leftstar +"      "+firstch ;
}


