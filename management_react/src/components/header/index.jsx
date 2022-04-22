import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'

import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api/index.js'
import {formateDate} from "../../utils/dateUtils";
import "./index.less"
import LinkButton from '../link-button'
import {logout} from '../../redux/actions'
// import storageUtils from "../../utils/storageUtils";
// import memoryUtils from "../../utils/memoryUtils";
// import weather from "../../assets/images/tianqi.jpg"

const { confirm } = Modal;

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    weather:'' // 天气的文本
  }

  // getTitle = () => {
  // //  得到当前请求路径
  //   const path = this.props.location.pathname
  //   let title
  //   menuList.forEach(item => {
  //     if(item.key === path){ //如果当前item对象的key与path一样，item的title就是需要显示的title
  //       title = item.title
  //     }else if(item.children){
  //     //  在所有子item中查找匹配的
  //       const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0 )
  //     //  如果有值才说明有匹配
  //       if(cItem){
  //       //  取出他的title
  //         title = cItem.title
  //       }
  //     }
  //   })
  //   return title
  // }

  getTime = () => {
  //  每隔一秒获取当前时间，并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  getWeather = async () => {
  //  调用接口请求异步获取数据
    const {weather} = await reqWeather('440100')
  //  更新状态
    this.setState({weather})
  }

  /*
  * 退出登录
  * */
  logout = () => {
    //显示对话框
    confirm({
      title: '确定要退出吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText:"确定",
      cancelText:"取消",
      onOk: () => {
        // console.log('确定');
        // console.log('OK',this)
      //  删除保存的user数据
        this.props.logout()
      //   storageUtils.removeUser()
      //   this.props.user = {}

      //  跳转到login
        this.props.history.replace('/login')
      },
      onCancel: () =>  {
        // console.log('返回');
      },
    });
  }

  /*
  * 每一次render()之后执行
  * 一般在此执行异步操作：发ajax请求/启动定时器
  * */
  componentDidMount(){
  //  获取当前时间
    this.getTime()
  //  获取当前天气
    this.getWeather()
  }

/*
  //不能这么做：不会更新显示
  componentWillMount() {
    this.title = this.getTitle()
  }
*/

  /*
  当前组件卸载之前调用
   */
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime,weather} = this.state
    const username = this.props.user.username
    //得到当前需要显示的title
    // const title = this.getTitle()
    const title = this.props.headTitle

    return (
        <div className="header">
          <div className="header-top">
            <span>欢迎，{username}</span>
            <LinkButton onClick={this.logout}>退出</LinkButton>
          </div>
          <div className="header-bottom">
            <div className="header-bottom-left">{title}</div>
            <div className="header-bottom-right">
              <span>{currentTime}</span>
              {/*<img src={weather} alt="weather" />*/}
              <span>{weather}</span>
              {/*<span>晴</span>*/}
            </div>
          </div>
        </div>
    );
  }
}

export default connect(
    state => ({
      headTitle: state.headTitle,
      user: state.user
    }),
    {logout}
)(withRouter(Header))
