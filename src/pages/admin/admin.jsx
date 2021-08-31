import React, {Component} from 'react';
import {Redirect,Route,Switch} from 'react-router-dom'
import {Layout} from 'antd'
import {connect} from 'react-redux'

// import memoryUtils from "../../utils/memoryUtils";
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from "../home/index";
import Category from "../category";
import Bar from "../charts/bar";
import Line from "../charts/line"
import Pie from "../charts/pie"
import Product from "../product";
import Role from "../role";
import User from "../user";
import NotFound from "../not_found/not_found";

const { Footer,Sider,Content } = Layout

// 后台管理的路由组件
class Admin extends Component {
  render() {
    const user = this.props.user
    //如果内存没有存储user ==> 当前没有登录
    if(!user || !user._id){
    //  自动跳转到登录页（在render中）
      return <Redirect to='/login' />
    }
    return (
        <Layout style={{minHeight:'100%'}}>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content style={{margin:"20px",backgroundColor: "white"}}>
              <Switch>
                <Redirect exact={true} from='/' to='/home' />
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/role' component={Role}/>
                <Route path='/user' component={User}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Route component={NotFound}></Route>{/*上面没有一个怕匹配，直接显示*/}
              </Switch>
            </Content>
            <Footer style={{textAlign:"center",color: "#c5c6c7"}}>推荐使用谷歌浏览器,可以获取更佳页面操作体验</Footer>
          </Layout>
        </Layout>
    );
  }
}

export default connect(
    state => ({user:state.user}),
    {}
)(Admin)
