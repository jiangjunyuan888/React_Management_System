import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'

import "./login.less"
import logo from "../../assets/images/logo.jpg"
import {login} from '../../redux/actions'
// import {reqLogin} from '../../api'
// import memoryUtils from "../../utils/memoryUtils";
// import storageUtils from "../../utils/storageUtils";



const Item = Form.Item  //不能写在import之前

// 登录的路由组件
class Login extends Component {

    // onFinish = (values) => {
    //   console.log('提交的表单内容是: ', values);
    //请求登录（没有使用async和await）
    // const {username,password} = values
    // reqLogin(username,password).then(response => {
    //   console.log("成功了",response.data)
    // }).catch(error => {
    //   console.log("失败了",error)
    // })
    // }

  onFinish = async (values)=> {
    // console.log('提交的表单内容是: ', values);
    //请求登录（使用async和await）
    const {username, password} = values
    // const result = await reqLogin(username, password)

    //  调用分发异步action的函数 => 发登录的异步请求，有了结果后更新登录状态
    this.props.login(username, password)

    // console.log("请求成功", result)
    //  // 登录成功返回 {status:0,data:user} 登录失败返回{status:1,msg:'xxx'}
    // if(result.status === 0){
    // //提示登录成功
    //   message.success("登录成功")
    //
    // //保存user
    //   const user = result.data
    //   memoryUtils.user = user //将user数据保存在内存中
    //   storageUtils.saveUser(user) //保存到local中
    //
    // //  跳转到管理界面(不需要再回退到登录页所以用replace否则用push)
    //   this.props.history.replace('/home')
    //
    // }else{ //登录失败
    // //  提示错误信息
    //   message.error(result.msg)
    // }

  }

  /* v3版本的自定义校验规则写法 */
  // validatePwd = (rule,value,callback) => {
  //   console.log("validatePwd()",rule,value)
  //   if(!value){
  //     callback("必须输入密码！")
  //   }else if(value.length<4){
  //     callback("密码长度不能小于4位")
  //   }else if(value.length>12){
  //     callback("密码长度不能大于12位")
  //   }
  //   callback() //验证通过
  //   // callback("xxx") //验证失败，并指定提示文本
  // }

  render() {

    //判断用户是否已经登录，如果用户已经登录，自动跳转到管理界面
    const user = this.props.user
    if( user && user._id){
      return <Redirect to='/home'/>
    }

    const errorMsg = this.props.user.errorMsg

    return (
        <div className="login">
          <header className="login-header">
            <img src={logo} alt="logo"/>
            <h1 className="title">React项目：后台管理系统</h1>
          </header>
          <section className="login-content">
            <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
            <h2>用户登录</h2>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
            >

              {/*
                  用户名/密码的合法要求
                  （1）必须输入
                  （2）必须大于等于4位
                  （3）必须小于等于12位
                  （4）必须是英文、数字或下划线组成
              */}
              <Item
                  name="username"
                  rules={[
                    {/* 声明式验证：直接使用别人定义好的验证规则进行验证 */},
                    { required: true, whitespace: true, message: '请输入用户名!' },
                    { min: 4,message:"用户名至少4位" },
                    { max: 12,message:"用户名最多12位" },
                    { pattern: /^[a-zA-Z0-9_]+$/, message:"用户名必须是英文、数字或下划线组成" }
                  ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
              </Item>

              <Item
                  name="password"
                  rules={[
                    // {
                    //   required: true
                    // },

                    //  自定义验证规则
                    {
                      validator: (_, value) =>{
                        console.log(_,value)
                        if(!value){
                          return Promise.reject("请输入密码！")
                        }else if(value.length<4){
                          return Promise.reject("密码长度不能小于4位")
                        }else if(value.length>12){
                          return Promise.reject("密码长度不能大于12位")
                        }else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
                          return Promise.reject("密码必须是英文、数字或下划线组成")
                        }else{
                          return Promise.resolve()
                        }
                      }
                    },
                  ]}
              >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                />
              </Item>

              <Item>
                <Button type="primary" htmlType="submit" className="login-form-button" >
                  登录
                </Button>
              </Item>

            </Form>
          </section>
        </div>
    );
  }
}

export default connect(
    state => ({user:state.user}),
    {login}
)(Login)

/*
  async 和 await
  1.作用：
    简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
    以同步编码（没有回到函数） 方式实现异步流程
  2.哪里写await：
    在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功value数据
  3.哪里写await
    await所在函数（最近的）定义的左侧写async
*/
