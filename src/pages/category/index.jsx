import React, {Component} from 'react';
import { Card,Button,Table,message,Modal } from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';


import LinkButton from "../../components/link-button";
import {reqCategorys, reqUpdateCategory,reqAddCategory} from "../../api";
import AddForm from './add_form'
import UpdateForm from "./update_form";
import './index.less'

/*
* 品类管理路由
* */
export default class Category extends Component {

  state = {
    categorys: [], // 一级分类列表
    loading: false, //数据是否加载中
    parentId: '0', //当前需要显示的分类列表的父分类ID
    parentName: '',//当前需要显示的分类列表的父分类名称
    subCategorys:[], //二级分类列表
    showStatus: 0, // 标识添加/更新的确认框是否显示，0：都不显示，1：代表显示添加，2：显示更新
  }

  /*
  * 初始化Table所有列的数组
  * */
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => ( //返回需要显示的界面标签
            <span>
              <LinkButton onClick={() => {this.showUpdate(category)}}>修改分类</LinkButton>
              {/*如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理的函数并传入数据*/}
              { category.parentId === '0' ? <LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null }
            </span>
        ),
      }
    ]
  }

  /*
  * 异步获取一级/二级分类列表的数组
  * parentId: 如果没有指定根据状态中的parent请求，如果指定了根据指定请求
  * */
  getCategorys = async (parentId) => {
    parentId = parentId || this.state
    //  在发送请求前，显示loading
    this.setState({loading: true})
    // 发异步ajax请求，获取数据
    const result = await reqCategorys(parentId)
    // 在请求完成后，影藏loading
    this.setState({loading: false})
    if(result.status === 0){
      const categorys = result.data
      if (parentId === '0') {
        //  更新一级列表数据状态
        this.setState({
          categorys,
        })
      }else {
        //  更新二级列表数据状态
        this.setState({
          subCategorys: categorys
        })
      }
    }else{
      message.error("获取分类列表失败")
    }
  }

  /*
  * 显示一级分类列表下的二级子列表
  * */
  showSubCategorys = (category) => {
  //  更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    },() => {//在状态更新且重新render()后执行
      console.log("parentId",this.state.parentId)
    //  获取二级分类列表
      this.getCategorys()
    })
  //  setState()不能立即获取最新的状态：因为setState()是异步更新状态的
  //   console.log("parentId",this.state.parentId)
  }

  /*
  * 显示指定一级分类列表
  * */
  showCategorys = () => {
    //更新为显示一级列表破的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /*
  * 显示添加的对话框
  * */
  showAdd = (category) => {
    //更新状态
    this.setState({
      showStatus: 1
    })
  }

  /*
  * 添加分类
  * */
  addCategory = async () => {
    //form.validateFields() 触发表单验证
    this.form.validateFields().then(async (values) => {
      //隐藏确认框
      this.setState({
        showStatus: 0,
      })

      //准备数据
      const { parentId, categoryName } = values
      // console.log(parentId, categoryName);
      // debugger
      // const parentId = this.form.getFieldValue('parentId')
      // const categoryName = this.form.getFieldValue('categoryName')

      //清除输入数据
      this.form.resetFields()

      const result = await reqAddCategory(categoryName, parentId)

      if (result.status === 0) {
        //添加的分类就是当前分类列表下的分类
        if (parentId === this.state.parentId) {
          this.getCategorys()
        } else if (parentId === '0') { //在二级分类列表下添加一级分类列表
          //重新获取一级分类列表,但不需要显示以及列表
          this.getCategorys('0')
        }

      }
    })
        .catch((err) => {
          message.info('添加失败')
          console.log(err)
        })

  }

  /*
  * 显示更新分类的对话框
  * */
  showUpdate = (category) => {
    //保存分类对象
    this.category = category
    this.setState({
      showStatus: 2
    })
  }

  /*
  * 更新分类
  * */
  updateCategory = () => {
    //进行表单验证，只有通过了才处理
    this.form.validateFields().then(async (values) => {
      //1.隐藏确认框
      this.setState({
        showStatus: 0,
      })

      //准备数据
      const categoryId = this.category._id
      // const categoryName = this.form.getFieldValue('categoryName')
      const { categoryName } = values
      //清除输入数据
      this.form.resetFields()

      //2.发送请求更新分类
      const result = await reqUpdateCategory(categoryId, categoryName)
      console.log(result)

      if (result.status === 0) {
        //3.重新显示列表
        this.getCategorys()
      }
    })
    .catch((err) => {
      message.info("更新失败");
      console.log(err)
    })

  }

  /*
  * 取消添加/更新分类对话框操作（隐藏确认框）
  * */
  handleCancel = () => {
    //清除输入数据
    this.form.resetFields()
    //隐藏对话框
    this.setState({
      showStatus: 0
    })
  }

  /*
  * 为第一次render()准备数据
  * */
  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  /*
  * 执行异步任务： 发送异步ajax请求
  * */
  componentDidMount() {
    this.getCategorys()
  }


  render() {
    const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
    const category = this.category || { name: '' }//如果还没有数据，则指定一个空对象
    const title = parentId === '0' ? "一级分类列表" : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <ArrowRightOutlined style={{marginLeft: '10px'}} />
          <span style={{marginLeft: '15px',fontSize: '18px'}}>{parentName}</span>
        </span>
    )
    return (
        <Card title={title} extra={<Button type="primary" className="add-button" onClick={this.showAdd}><PlusOutlined/>添加</Button>} className="category">

          <Table
              dataSource={parentId==='0' ? categorys : subCategorys}
              columns={this.columns}
              bordered
              rowKey='_id'
              pagination={{pageSize:6,showQuickJumper:true}}
              loading={loading}
          />;

          {
            showStatus === 1 ? <Modal
                title="添加分类"
                visible={showStatus === 1}
                onOk={this.addCategory}
                onCancel={this.handleCancel}>
              <AddForm
                  categorys={categorys}
                  parentId={parentId}
                  setForm={form => this.form = form}
              />
            </Modal> : null
          }

          {showStatus === 2 ? <Modal
              title="更新分类"
              visible={showStatus === 2}
              onOk={this.updateCategory}
              onCancel={this.handleCancel}
          >
            <UpdateForm
                categoryName={category.name}
                setForm={form => this.form = form}
            />
          </Modal> : null}

        </Card>
    );
  }
}
