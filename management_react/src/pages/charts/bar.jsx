// import React, {Component} from 'react';
// import * as echarts from 'echarts/core';
// import {GridComponent} from 'echarts/components';
// import {BarChart} from 'echarts/charts';
// import {CanvasRenderer} from 'echarts/renderers';
// import { Button, Card } from "antd";
//
// /*
// * 柱状图
// * */
// export default class Bar extends Component {
//
//     componentDidMount(){
//
//         // 注册必须的组件
//         echarts.use(
//             [GridComponent, BarChart, CanvasRenderer]
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
//                 data: [120, 200, 150, 80, 70, 110, 130],
//                 type: 'bar',
//                 showBackground: true,
//                 backgroundStyle: {
//                     color: 'rgba(180, 180, 180, 0.2)'
//                 }
//             }]
//         };
//
//         option && myChart.setOption(option);
//     }
//
//     render() {
//         return (
//             <div>
//                 <Card>
//                     <Button type='primary' onClick={() => this.update()} style={{backgroundColor: "red"}}></Button>
//                     <div style={{backgroundColor: 'red'}}></div>
//                 </Card>
//                 <Card title="柱状图">
//                     <div id="main" style={{width: 600, height:500 }}></div>
//                 </Card>
//             </div>
//         );
//     }
// }

import React, {Component} from 'react';
import { Button, Card } from "antd";
import * as echarts from 'echarts';
// import ReactECharts from 'echarts-for-react';

import {reqBar} from "../../api"
import {bar} from "../../mock/mock"


/*
*   柱形图路由
* */
export default class Bar extends Component {

    state = {
        sales: [], //销量
        inventory: [] //库存
    }


    getImage = async () => {
        const res = await reqBar()

        if(res.status == 0) {
            const {data,type} = res

            var app = {};

            var chartDom = document.getElementById('bar');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                legend: {},
                tooltip: {},
                dataset: {
                    dimensions: type,
                    // source: [
                    //     {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                    //     {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                    //     {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                    //     {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                    // ]
                    source: data
                },
                xAxis: {type: 'category'},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                    {type: 'bar'},
                    {type: 'bar'},
                ]
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
    return (
        <div>
            <Card style={{height: 80}}>
                <Button type='primary' onClick={() => this.update()}>更新</Button>
                {/*<Button type='primary' onClick={() => this.getNums()}>点击查看mock.js数据</Button>*/}
            </Card>
            <Card title="柱状图">
                <div id="bar" style={{width: 900, height:500 ,margin: "0 auto"}}></div>
            </Card>
        </div>

    );
  }
}



