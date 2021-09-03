import Mock from 'mockjs'

//模拟延迟
// Mock.setup({
//     timeout:500
// })

//生成随机数据
export const bar = Mock.mock("/bar",{
    "status":"0",
    "type":["product","销量","库存"],
    "data":[
        {
            "product":"衬衫",
            "销量|1-10000": 1,
            "库存|1-10000": 1
        },
        {
            "product":"羊毛衫",
            "销量|1-10000": 1,
            "库存|1-10000": 1
        },
        {
            "product":"雪纺山",
            "销量|1-10000": 1,
            "库存|1-10000": 1
        },
        {
            "product":"裤子",
            "销量|1-10000": 1,
            "库存|1-10000": 1
        },
        {
            "product":"高跟鞋",
            "销量|1-10000": 1,
            "库存|1-10000": 1
        },
        {
            "product":"袜子",
            "销量|1-10000": 1,
            "库存|1-10000": 1
        },
    ],

})

const Random = Mock.Random
export const line = Mock.mock("/line",{
    "status":"0",
    "type":["衬衫","羊毛衫","雪纺山","裤子","高跟鞋","袜子"],
    "allData":[
        {
            "name":"衬衫",
            "type": 'line',
            "stack": '总量',
            "data|7":[
                () => Random.integer(0,10000)
            ]
        },
        {
            "name":"羊毛衫",
            "type": 'line',
            "stack": '总量',
            "data|7":[
                () => Random.integer(0,10000)
            ]
        },
        {
            "name":"雪纺山",
            "type": 'line',
            "stack": '总量',
            "data|7":[
                () => Random.integer(0,10000)
            ]
        },
        {
            "name":"裤子",
            "type": 'line',
            "stack": '总量',
            "data|7":[
                () => Random.integer(0,10000)
            ]
        },
        {
            "name":"高跟鞋",
            "type": 'line',
            "stack": '总量',
            "data|7":[
                () => Random.integer(0,10000)
            ]
        },
        {
            "name":"袜子",
            "type": 'line',
            "stack": '总量',
            "data|7":[
                () => Random.integer(0,10000)
            ]
        },
    ]
})


export const pie = Mock.mock("/pie",{
    "status":"0",
    "salesTitle":"销量图",
    "inventoryTitle":"库存图",
    "sales":[
        {
            "value|1-10000": 1,
            "name":"衬衫"
        },{
            "value|1-10000":1,
            "name":"羊毛衫"
        },{
            "value|1-10000":1,
            "name":"雪纺衫"
        },{
            "value|1-10000":1,
            "name":"裤子"
        },{
            "value|1-10000":1,
            "name":"高跟鞋"
        },{
            "value|1-10000":1,
            "name":"袜子"
        }
    ],
    "inventory":[
        {
            "value|1-10000": 1,
            "name":"衬衫"
        },{
            "value|1-10000":1,
            "name":"羊毛衫"
        },{
            "value|1-10000":1,
            "name":"雪纺衫"
        },{
            "value|1-10000":1,
            "name":"裤子"
        },{
            "value|1-10000":1,
            "name":"高跟鞋"
        },{
            "value|1-10000":1,
            "name":"袜子"
        }
    ]
})

