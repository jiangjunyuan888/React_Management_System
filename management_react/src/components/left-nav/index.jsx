import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom'
import {Menu} from 'antd';
import {connect} from 'react-redux'

import "./index.less"
import logo from '../../assets/images/logo.jpg'
import menuList from "../../config/menuConfig";
import {setHeadTitle} from "../../redux/actions";
// import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

/*
* 左侧导航的组件
* */

class LeftNav extends Component {

  /*
  * 根据menu的数据数组生成对应的标签数组
  * 使用map() + 递归调用
  * */
  // getMenuNodes_map = (menuList) => {
  //   return menuList.map(item => {
  //     /*
  //                 {
  //                   title: '首页', // 菜单标题名称
  //                   key: '/home', // 对应的path
  //                   icon: 'home', // 图标名称
  //                   children: [], // 可能有, 也可能没有
  //                 }
  //
  //                 <Menu.Item key="/home">
  //               <Link to='/home'>
  //                 <Icon type="pie-chart"/>
  //                 <span>首页</span>
  //               </Link>
  //             </Menu.Item>
  //
  //             <SubMenu
  //               key="sub1"
  //               title={
  //                 <span>
  //                   <Icon type="mail"/>
  //                   <span>商品</span>
  //                 </span>
  //               }
  //             >
  //               <Menu.Item/>
  //               <Menu.Item/>
  //             </SubMenu>
  //             */
  //     if(!item.children){
  //       return (
  //           <Menu.Item key={item.key} icon={item.icon}>
  //             <Link to={item.key}>
  //               {item.title}
  //             </Link>
  //           </Menu.Item>
  //       )
  //     }else{
  //       return(
  //           <SubMenu key={item.key} title={item.title} icon={item.icon}>
  //             {this.getMenuNodes_map(item.children)}
  //           </SubMenu>
  //       )
  //     }
  //   })
  //
  //
  //     }

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) => {

        const {key,isPublic} = item.key
        const menus = this.props.user.role.menus
        const username = this.props.user.username

        /*
        * 1.如果当前用户是admin
        * 2.如果当前item是公开的
        * 3.当前用户有此item的权限： key有没有menus中
        * */
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){//4.如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key)!==-1) // !! 强制转换成布尔类型
        }
        return false
    }

  /*
  * 根据menu的数据数组生成对应的标签数组
  * 使用reduce() + 递归调用
  * */
  getMenuNodes = (menuList) => {
    //得到当前请求的路由路径
    const path = this.props.location.pathname
    //pre为上一次的结果，初始值为最后定义的空数组[]
    return menuList.reduce((pre,item) => {

        // 如果当前用户有item对应的权限，才需要显示对应的菜单项
        if(this.hasAuth(item)){

            //  向pre添加<Menu.Item>
            if(!item.children){
                //判断item是否是当前对应的item
                if(item.key === path || path.indexOf(item.key) === 0){
                    // 更新redux中的headerTitle状态
                    this.props.setHeadTitle(item.title)
                }
                pre.push(
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            }else{
                //  查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //  如果存在，说明当前item的子列表需要打开
                if(cItem) {
                    this.openKey = item.key
                }

                //  向pre添加<SubMenu>
                pre.push(
                    <SubMenu key={item.key} title={item.title} icon={item.icon}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        }
        return pre
    },[])
  }

      /*
      * 在第一次render()之前执行一次
      * 为第一次render()准备数据（必须同步的）
      * */
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
      }

      render() {
        // debugger
        // 得到当前请求的路由组件
        let path = this.props.location.pathname
        console.log('render()'+path)

        if(path.indexOf('/product')===0){ //当前请求的是商品或其子路由界面
            path='/product'
        }

        //得到需要打开菜单项的key
        const openKey = this.openKey

        return (
            <div className="left-nav">
              <Link to='/' className="left-nav-header">
                <img src={logo} alt="logo" />
                <h1>PG后台</h1>
              </Link>

              <Menu
                  selectedKeys={[path]}
                  defaultOpenKeys={[openKey]}
                  mode="inline"
                  theme="dark"
              >
                {
                  this.menuNodes
                }
              </Menu>

              {/*<Menu*/}
              {/*    defaultSelectedKeys={['1']}*/}
              {/*    defaultOpenKeys={['sub1']}*/}
              {/*    mode="inline"*/}
              {/*    theme="dark"*/}
              {/*>*/}
              {/*  <Menu.Item key="/home" icon={<PieChartOutlined />}>*/}
              {/*    <Link to='/home'>*/}
              {/*      首页*/}
              {/*    </Link>*/}
              {/*  </Menu.Item>*/}
              {/*  <SubMenu key="sub1" icon={<MailOutlined />} title="商品">*/}
              {/*    <Menu.Item key="/category">*/}
              {/*      <Link to='/category'>*/}
              {/*        品类管理*/}
              {/*      </Link>*/}
              {/*    </Menu.Item>*/}
              {/*    <Menu.Item key="/product">*/}
              {/*      <Link to='/product'>*/}
              {/*        商品管理*/}
              {/*      </Link>*/}
              {/*    </Menu.Item>*/}
              {/*  </SubMenu>*/}
              {/*  <Menu.Item key="/user" icon={<ContainerOutlined />}>*/}
              {/*    <Link to='/user'>*/}
              {/*      用户管理*/}
              {/*    </Link>*/}
              {/*  </Menu.Item>*/}
              {/*  <Menu.Item key="/role" icon={<ContainerOutlined />}>*/}
              {/*    <Link to='/role'>*/}
              {/*      角色管理*/}
              {/*    </Link>*/}
              {/*  </Menu.Item>*/}
              {/*  <SubMenu key="sub2" icon={<AppstoreOutlined />} title="图形图表">*/}
              {/*    <Menu.Item key="/charts/bar">*/}
              {/*      <Link to='/charts/bar'>*/}
              {/*        柱形图*/}
              {/*      </Link>*/}
              {/*    </Menu.Item>*/}
              {/*    <Menu.Item key="/charts/line">*/}
              {/*      <Link to='/charts/line'>*/}
              {/*        折线图*/}
              {/*      </Link>*/}
              {/*    </Menu.Item>*/}
              {/*    <Menu.Item key="/charts/pie">*/}
              {/*      <Link to='/charts/pie'>*/}
              {/*        饼图*/}
              {/*      </Link>*/}
              {/*    </Menu.Item>*/}
              {/*  </SubMenu>*/}
              {/*</Menu>*/}
        </div>
    );
  }
}

/*
*   withRouter高阶组件
*   包装非路由组件，返回一个新的组件
*   新的组件向非路由组件传递3个属性： history/location/match
* */
export default connect(
    state => ({user: state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))