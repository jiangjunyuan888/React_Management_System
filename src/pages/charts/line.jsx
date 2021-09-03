// import React, {Component} from 'react';
// import * as echarts from 'echarts/core';
// import {GridComponent} from 'echarts/components';
// import {LineChart} from 'echarts/charts';
// import {CanvasRenderer} from 'echarts/renderers';
//
// /*
// * 折线图
// * */
// export default class Line extends Component {
//     componentDidMount(){
//         echarts.use(
//             [GridComponent, LineChart, CanvasRenderer]
//         );
//
//         var chartDom = document.getElementById('main');
//         var myChart = echarts.init(chartDom);
//         var option;
//
//         option = {
//             xAxis: {
//                 type: 'category',
//                 data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//             },
//             yAxis: {
//                 type: 'value'
//             },
//             series: [{
//                 data: [150, 230, 224, 218, 135, 147, 260],
//                 type: 'line'
//             }]
//         };
//
//         option && myChart.setOption(option);
//     }
//
//     render() {
//         return (
//             <div id="main" style={{width: 900, height:500 }}></div>
//         );
//     }
// }


import React, {Component} from 'react';
import * as echarts from 'echarts';
import { Button, Card } from "antd";
// import ReactECharts from 'echarts-for-react';

import {reqLine} from "../../api"
import {line} from "../../mock/mock"

/*
*   折线图路由
* */
export default class Line extends Component {

    state = {
        sales: [5, 20, 36, 10, 10, 20],
        stores: [6, 10, 25, 20, 15, 10]
    }

    getImage = async() => {

        const res = await reqLine()

        if(res.status == 0) {

            const {allData, type} = res

            var chartDom = document.getElementById('line');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: '销量图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: type
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: allData
            };

            option && myChart.setOption(option);
        }
    }


    /*
    * 更新图表
    * */
    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1 ),
            stores: state.stores.reduce((pre,store) => {
                pre.push(store - 1 )
                return pre
            },[])
        }))
    }

    componentDidMount(){
        this.getImage()
    }

    render() {
        const {sales,stores} = this.state
        return (
            <div>
                <Card style={{height: 80}}>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title="折线图">
                    <div id="line" style={{width: 900, height:500 ,margin: "0 auto"}}></div>
                </Card>
            </div>

        );
    }
}




