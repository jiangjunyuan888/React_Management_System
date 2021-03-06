import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
}from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import {PAGE_SIZE} from '../../utils/constants'
import {reqProducts, reqSearchProducts, reqUpdateCategory, reqUpdateStatus} from '../../api'
import LinkButton from "../../components/link-button";
import './product.less'

/*
* Product的默认子路由组件
* */

const { Option } = Select;

export default class ProductHome extends Component {

    state = {
        total: 0, //商品的总数量
        products:[], //商品数组
        loading: false, //数据加载状态
        searchName: '',//搜索的关键字
        searchType:'productName',//根据哪个字段搜索
    }

    /*
    * 初始化table的列数据
    * */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) =>  '￥' + price  //当前指定了对应的属性，所以传入的是对应的属性
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status,_id} = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={ () => this.updateStatus(_id,newStatus) }
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render:(product) => {
                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/detail',product)}>修改</LinkButton>
                        </span>
                    );
                }
            },
        ];
    }

    /*
    * 获取指定页码的列表数据显示
    * */
    getProducts = async(pageNum) => {
        this.pageNum = pageNum //保存pageNum，让其他方法可以看到
        //显示loading
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        //如果搜索关键字有值，说明我们要做搜索分页
        let result
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        //隐藏loading
        this.setState({loading:false})
        if (result.status === 0 ){
            const {total,list} = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    /*
    * 更新指定商品的状态
    * */
    updateStatus = async (productId,status) => {
        const result = await reqUpdateStatus(productId,status)
        if(result.status === 0){
            message.success("更新商品成功")
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        //取出状态数据
        const {products,total,loading,searchName,searchType} = this.state

        const title = (
            <span>
                <Select
                    defaultValue={searchType}
                    className="product-card-select"
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    className="product-card-input"
                    placeholder="关键字"
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type="primary"
                        style={{height:'39px'}}
                        onClick={() => this.getProducts(1)}
                >
                    搜索
                </Button>
            </span>
        )
        return (
            <Card title={title} extra={<Button type="primary" style={{height:'39px'}} onClick={() => this.props.history.push('/product/addupdate')}><PlusOutlined/>添加商品</Button>} style={{ width:'100%',hieght: '100%'}}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    border
                    pagination={{
                        total ,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper:true,
                        current:this.pageNum,  //跳转
                        onChange : this.getProducts
                    }}
                    loading={loading}
                />
            </Card>
        );
    }
}
