import React,{ Component } from "react"
import {HashRouter, Route, Switch} from "react-router-dom"
import './App.less';

import Login from "./pages/login/login"
import Admin from "./pages/admin/admin"

/*
*   应用的根组件
* */
export default class App extends Component{

  render(){
    return(
        <HashRouter>
          {/*配置路由*/}
          <Switch>{/*只匹配其中一个*/}
            <Route path='/login' component={Login} />
            <Route path='/' component={Admin} />
          </Switch>
        </HashRouter>
    )
  }
}
