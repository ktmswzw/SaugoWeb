/**
 * Created by vincent on 16/9/11.
 */
// 路径配置
require.config({
    baseUrl: '/styles/js/libs/',
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist',
        jquery: '../libs/jquery-2.1.4'
    }
});

// 使用
require(
    [
        'jquery',
        'echarts',
        'echarts/theme/macarons',
        'echarts/chart/bar',
        'echarts/chart/line'
    ],
    function ($,ec,theme) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('main'),theme);
        var myUserChart = ec.init(document.getElementById('user'),theme);

        var dataArray = [];
        var dayArray = [];


        var dataArrayUser = [];
        var dayArrayUser = [];

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: WEB_GLOBAL_CTX+"/business/report/charLineList",
            data: "",
            error: function () {// 请求失败处理函数

            },
            success: function (result) {
                for(var i=0;i<result.length;i++){
                    var obj = result[i];
                    dataArray[i]=obj.agentSum;
                    dayArray[i]=obj.reportDate;
                }
            }
        });


        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: WEB_GLOBAL_CTX+"/console/security/user/reportChar",
            data: "",
            error: function () {// 请求失败处理函数

            },
            success: function (result) {
                for(var i=0;i<result.length;i++){
                    var obj = result[i];
                    dataArrayUser[i]=obj.orgId;
                    dayArrayUser[i]=obj.parentId;
                }
            }
        });

        var option = {
            tooltip: {
                show: true
            },
            legend: {
                data:['近30天出货统计']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                },
                enterable: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : dayArray
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '出货量',
                    axisLabel : {
                        formatter: '{value} 台'
                    }
                }
            ],
            series : [
                {
                    "name":"出货",
                    "type":"bar",
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{c}'
                            }
                        }
                    },
                    "data":dataArray
                }
            ]
        };

        var optionUser = {
            tooltip: {
                show: true
            },
            legend: {
                data:['近30天总代加盟情况']
            },
            toolbox: {
                show : true,
                feature : {
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                },
                enterable: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : dayArrayUser
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '数量',
                    axisLabel : {
                        formatter: '{value} 位'
                    }
                }
            ],
            series : [
                {
                    "name":"加盟",
                    "type":"bar",
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{c}'
                            }
                        }
                    },
                    "data":dataArrayUser
                }
            ]
        };


        var ecConfig = require('echarts/config');
        function eConsole(param) {
            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/business/report/lasagna/"+param.name+"'", 500);
        }
        myChart.on(ecConfig.EVENT.CLICK, eConsole);

        // 为echarts对象加载数据
        myChart.setOption(option);


        function eConsoleUser(param) {
            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/console/security/user/agentList'", 500);
        }
        myUserChart.on(ecConfig.EVENT.CLICK, eConsoleUser);



        myUserChart.setOption(optionUser);
    }
);