// import React, {Component} from 'react';
// import ReactECharts from 'echarts-for-react';
// import { Button, Card } from "antd";
//
// /*
// *   柱形图路由
// * */
// export default class Bar extends Component {
//
//     state = {
//         sales: [5, 20, 36, 10, 10, 20],
//         stores: [6, 10, 25, 20, 15, 10]
//     }
//
//     /*
//     * 返回柱状图的配置对象
//     * */
//     getOption = (sales,stores) => {
//         return {
//             title: {
//                 text: 'ECharts 入门示例'
//             },
//             tooltip: {},
//             legend: {
//                 data:['销量']
//             },
//             xAxis: {
//                 data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
//             },
//             yAxis: {},
//             series: [{
//                 name: '销量',
//                 type: 'bar',
//                 data: sales
//             },{
//                 name: '库存',
//                 type: 'bar',
//                 data: stores
//             }]
//         }
//     }
//
//     /*
//     * 更新图表
//     * */
//     update = () => {
//         this.setState(state => ({
//             sales: state.sales.map(sale => sale + 1 ),
//             stores: state.stores.reduce((pre,store) => {
//                 pre.push(store - 1 )
//                 return pre
//             },[])
//         }))
//     }
//
//   render() {
//       const {sales,stores} = this.state
//     return (
//         <div>
//             <Card>
//                 <Button type='primary' onClick={() => this.update()}></Button>
//             </Card>
//             <Card title="柱状图">
//                 <ReactECharts option={this.getOption(sales,stores)} />
//             </Card>
//         </div>
//
//     );
//   }
// }

import React, {Component} from 'react';

export default class Bar extends Component {
    render() {
        return (
            <div>
                bar
            </div>
        );
    }
}

