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

        var dataArray = [];
        var dayArray = [];
        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: WEB_GLOBAL_CTX+"/report/executeList",
            data: "",
            error: function () {// 请求失败处理函数

            },
            success: function (result) {
                for(var i=0;i<result.length;i++){
                    var obj = result[i];
                    dataArray[i]=obj.execute;
                    dayArray[i]=obj.date;
                }
            }
        });

        var option = {
            tooltip: {
                show: true
            },
            legend: {
                data:['近30天习惯日执行总数']
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
                    type : 'value'
                }
            ],
            series : [
                {
                    "name":"日执行",
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


        var ecConfig = require('echarts/config');
        function eConsole(param) {
            console.info(param);
            setTimeout("window.location.href='" + WEB_GLOBAL_CTX + "/report/habit/"+param.name+"'", 500);
            console.info( WEB_GLOBAL_CTX + "/report/habit/"+param.name+"'");
        }
        myChart.on(ecConfig.EVENT.CLICK, eConsole);

        // 为echarts对象加载数据
        myChart.setOption(option);
    }
);