import React, {Component} from 'react';
import {connect} from 'react-redux'

import Counter from "../components/Counter";
import {increment,decrement,incrementAsync} from "../redux/actions";

/*
* 容器组件：通过connect包装UI组件产生组件
* connect():高阶组件x   
* connect()返回的函数是一个高阶组  件：接收一个UI组件，生成一个容器组件
* 容器组件的责任：向UI组件传入特定的属性
* */

export default connect(
    state => ({count: state.count}),
    {increment,decrement,incrementAsync}
)(Counter)
/*
* 最终形式
* */