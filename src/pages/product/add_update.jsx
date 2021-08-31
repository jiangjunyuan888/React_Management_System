import React, {Component} from 'react';
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message
} from 'antd'

import LinkButton from "../../components/link-button";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategorys,reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./pictures_wall";
import RichTextEditor from "./rich_text-editor";

/*
* Product的添加和更新的子路由组件
* */

const {Item} = Form
const {TextArea} = Input

export default class ProductAddUpdate extends Component {

    state = {
        options:[]
    }

    constructor() {
        super();
    //    创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    formRef = React.createRef()

    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: false, //一开始设置为不是叶子
        }))

        //如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            // 找到当前商品对应的一级options对象
            const targetOption = options.find(option => option.value===pCategoryId)

            // 关联对应的一级option上
            targetOption.children = childOptions
        }

    //    更新options状态
        this.setState({
            options
        })
    }

    /*
    * 异步获取一级/二级分类列表，并显示
    * async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    * */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId) //{status: 0,data: categorys}
        if(result.status === 0){
            const categorys = result.data
            // 如果是一级分类列表
            if(parentId === '0' ){
                this.initOptions(categorys)
            }else{ // 二级列表
                return categorys // 返回二级列表 => 当前async函数返回的promise就会成功且value为categorys
            }
        }
    }

    /*
    * 进行提交时的表单验证
    * */
    sumbit = () => {
        console.log(this.formRef)
        this.formRef.current.validateFields().then(
            async values => {
                // 1.收集数据，并封装成promise对象
                const {name,desc,price,categoryIds} = values
                console.log(name, desc, price, categoryIds)
                let categoryId,pCategoryId
                if(categoryIds.length === 1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {
                    name,desc,price,imgs,detail,pCategoryId,categoryId
                }
                // 如果是更新需要添加_id
                if(this.isUpdate){
                    product._id = this.product._id
                }

                //2.调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)

                //3.根据结果提示
                if(result.status === 0 ){
                    message.success(`${this.isUpdate ? '更新':'添加'}商品成功！`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate ? '更新':'添加'}商品失败！`)
                }
            }
        )
    }

    /*
    * 自定义价格校验规则
    * */
    validatePrice = (rule, value) => {
        // 此处 *1 ,是为了让value变成数字类型
        if(value * 1 > 0){
            return Promise.resolve()
        }else{
            return Promise.reject(new Error("价格必须大于0"))
        }
    }

    /*
    * 选择分类异步加载展开效果
    * 用于加载下一级列表的回调函数
    * */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        //显示loading
        targetOption.loading = true
        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false
        //二级分类数组有数据
        if(subCategorys && subCategorys.length > 0){
            //生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        }else{ //当前选中分类没有二级分类
            targetOption.isLeaf = true
        }

        // 模拟请求异步获取二级列表数据,并更新
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `${targetOption.label} Dynamic 1`,
                    value: 'dynamic1',
                },
                {
                    label: `${targetOption.label} Dynamic 2`,
                    value: 'dynamic2',
                },
            ];

            //更新options状态
            this.setState({
                options:[...this.state.options]
            })
        }, 1000);
    }

    //指定Item布局的配置对象
    UNSAFE_componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state //如果是添加没值，否则有值
        // 保存是否是更新新的标识
        this.isUpdate = !!product  //!!强制转换成布尔类型
        // 保存商品（如果没有，保存的是{}）
        this.product = product || {}
    }

    render() {

        const {isUpdate,product} = this
        const options = this.setState.options
        const {pCategoryId,categoryId} = product
        //用于接收级联商品分类ID的数组
        const categoryIds = []
        //如果是修改商品数据
        if(isUpdate){
        //  商品是一个一级分类的商品
            if(pCategoryId === '0'){
                categoryIds.push(categoryId)
            }else{
            //    商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined style={{marginRight:"10px", fontSize: '20px'}} />
                </LinkButton>
                <span>{isUpdate ? "修改商品" : "添加商品" }</span>
            </span>

        )
        return (
            <Card title={title} style={{ width: "100%" }}>
                <Form
                    ref={this.formRef}
                    name="basic"
                    labelCol={{ span: 3 }}//左侧label的宽度
                    wrapperCol={{ span: 8 }}//右侧包裹的宽度
                    initialValues={{ remember: true }}
                >
                    <Item
                        label="商品名称"
                        name="name"
                        rules={[{ required: true, message: '必须输入商品名称' }]}
                        initialValue={product.name}
                    >
                        <Input placeholder='请输入商品名称'/>
                    </Item>

                    <Item
                        label="商品描述"
                        name="desc"
                        initialValue={product.desc}
                        rules={[
                            { required: true, message: '必须输入商品描述' }
                        ]}
                    >
                        <Input.TextArea placeholder='请输入商品描述' />
                    </Item>

                    <Item
                        label="商品价格"
                        name="price"
                        initialValue={product.price}
                        rules={[
                            { required: true, message: '必须输入商品价格' },
                            { validator: this.validatePrice }
                        ]}
                    >
                        <Input type="number" placeholder='请输入商品价格' addonAfter='元'/>
                    </Item>

                    <Item
                        label="商品分类"
                        name="categoryIds"
                        initialValue={categoryIds}
                        rules={[
                            { required: true, message: '必须指定商品分类' },
                        ]}
                    >
                        <Cascader
                            placeholder="请指定商品分类"
                            options={options}
                            loadData={this.loadData}
                        />
                    </Item>

                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={product.imgs}/>
                    </Item>

                    <Item
                        label="商品详情"
                        labelCol={{span:2}}
                        wrapperCol={{span: 20}}
                    >
                        <RichTextEditor ref={this.editor} detail={product.detail}/>
                    </Item>

                    <Item>
                        <Button type="primary" onClick={this.submit}>
                            确定
                        </Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}


/*
*  1.子组件调用父组件的方法： 将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
*  2.父组件调用子组件的方法： 在父组件中通过ref得到子组件标签对象（也可以是组件对象），调用其方法
* */
