import React, {Component} from 'react';
import { Button, Card } from "antd";
import * as echarts from 'echarts';

import {reqPie} from "../../api";
import {pie} from "../../mock/mock"

/*
*   柱形图路由
* */
export default class Pie extends Component {

    state = {
        sales: [],//销量图
        inventory: [],//库存图
    }

    getImage = async() => {

        const res = await reqPie()
        console.log(res)
        if (res.status == 0) {
            const {sales, inventory} = res

            //销量饼图
            var chartDom = document.getElementById('pie1');
            var myChart = echarts.init(chartDom);
            var option1;

            option1 = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: sales
                    }
                ]
            };

            option1 && myChart.setOption(option1);

            // 库存饼图
            var chartDom = document.getElementById('pie2');
            var myChart = echarts.init(chartDom);
            var option2;

            option2 = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: inventory
                    }
                ]
            };

            option2 && myChart.setOption(option2);
        }
    }

    componentDidMount(){

        this.getImage()

    }

    render() {
        return (
            <div>
                <Card title="销量图">
                    <div id="pie1" style={{width: 900, height:500 ,margin: "0 auto"}}></div>
                </Card>
                <Card title="库存图">
                    <div id="pie2" style={{width: 900, height:500, margin: "0 auto" }}></div>
                </Card>
            </div>

        );
    }
}
