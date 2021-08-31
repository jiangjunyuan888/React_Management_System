import React, {Component} from 'react';
import {Card,List} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategory} from '../../api'


const Item = List.Item

/*
* Product的详情子路由组件
* */
export default class ProductDetail extends Component {

    state = {
        cName1:'',//一级分类名称
        cName2:'',//二级分类名称
    }

    async componentDidMount(){
    //    得到当前商品的分类ID
        const {pCategoryId,categoryId} = this.props.location.state.product
        if(pCategoryId === '0'){ //一级分类下的商品
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        }else{ //二级分类下的商品
            /*
            //通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送的
            const result1 = await reqCategory(pCategoryId) //获取一级分类列表
            const result2 = await reqCategory(categoryId) //获取二级分类列表
            console.log(result1,result2)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */

            //一次性发送多个请求，只有都成功，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name

            this.setState({
                cName1,
                cName2
            })

        }
    }

    render() {
        // 读取携带过来的state数据
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state
        const title = (
            <span>
                {/*<Link to='/product'>*/}
                {/*    <ArrowLeftOutlined style={{color:'#1da57a',marginRight:"10px", fontSize: '20px'}}/>*/}
                {/*</Link>*/}
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{marginRight:"10px", fontSize: '20px'}} />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List bordered>
                   <Item>
                       <span>
                            <span className="left">商品名称:</span>
                            <span>{name}</span>
                       </span>
                   </Item>
                   <Item>
                       <span>
                            <span className="left">商品描述:</span>
                            <span>{desc}</span>
                       </span>
                   </Item>
                    <Item>
                       <span>
                            <span className="left">商品价格:</span>
                            <span>{price}元</span>
                       </span>
                    </Item>
                    <Item>
                       <span>
                            <span className="left">所属分类:</span>
                            <span>{cName1}{cName2 ? '-->'+cName2 : ''}</span>
                       </span>
                    </Item>
                    <Item>
                       <span>
                            <span className="left">商品图片:</span>
                            <span>
                                {
                                    imgs.map( img => (
                                        <img
                                            key={img}
                                            src={BASE_IMG_URL+img}
                                            className="product-img"
                                            alt='img'
                                        />
                                    ))
                                }
                            </span>
                       </span>
                    </Item>
                    <Item>
                       <span>
                            <span className="left">商品详情:</span>
                            <span dangerouslySetInnerHTML={{__html:detail}} />
                       </span>
                    </Item>
                </List>
            </Card>
        );
    }
}
