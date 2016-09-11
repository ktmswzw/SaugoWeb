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
        'echarts/chart/pie',
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
            url: WEB_GLOBAL_CTX+"/business/report/lasagnaData/"+dateV,
            data: "",
            error: function () {// 请求失败处理函数

            },
            success: function (result) {
                for(var i=0;i<result.length;i++){
                    var obj = result[i];
                    dataArray.push({value:obj.agentSum,name:obj.agentName});
                    dayArray[i]=obj.agentName;
                }
            }
        });

        option = {
            title : {
                text: dateV+'当日出货',
                subtext: '实时数据',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:dayArray
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'出货',
                    type:'pie',
                    radius : [30, 110],
                    center : ['50%', 200],
                    roseType : 'area',
                    x: '100%',               // for funnel
                    max: 40,                // for funnel
                    sort : 'ascending',     // for funnel
                    data:dataArray
                }
            ]
        };

        myChart.setOption(option);
    }
);