import React, {Component} from 'react';
import {Switch,Route,Redirect} from "react-router-dom";

import ProductDetail from "./detail";
import ProductHome from "./home";
import ProductAddUpdate from "./add_update";

/*
*   商品路由
* */
export default class Product extends Component {
  render() {
    return (
        <Switch>
            <Route path='/product' component={ProductHome} exact/> {/* 路径完全匹配 exact */}
            <Route path='/product/addupdate' component={ProductAddUpdate}/>
            <Route path='/product/detail' component={ProductDetail}/>
            <Redirect to='/product'/>
        </Switch>
    );
  }
}
