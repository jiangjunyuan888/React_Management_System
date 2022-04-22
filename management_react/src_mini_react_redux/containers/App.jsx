import React, {Component} from 'react';
// import {connect} from 'react-redux'

import Counter from "../components/Counter";
import {increment,decrement,incrementAsync} from "../redux/actions";
import {connect} from '../lib/react-redux'

/*
* 容器组件：通过connect包装UI组件产生组件
* connect():高阶组件x   
* connect()返回的函数是一个高阶组  件：接收一个UI组件，生成一个容器组件
* 容器组件的责任：向UI组件传入特定的属性
* */

//指定向Counter传入哪些一般属性（属性值的来源就是store中的store）
const mapStateToProps = (state) => ({count: state.count})

//指定向Counter传入哪些函数属性
/*
* 如果是函数，会自动调用得到对象，将对象中的方法作为函数属性传入UI组件中
* */
/*const mapDispatchToProps = (dispatch) => ({
    increment: (number) => dispatch(increment(number)),
    decrement: (number) => dispatch(decrement(number)),
})*/

/*
* 如果是对象，将对象中的放啊发包装成一个新的函数，并传入UI组件
* */
const mapDispatchToProps = { increment , decrement }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)

/*
* 最终形式
* */
// export default connect(
//     state => ({count: state.count}),
//     {increment,decrement,incrementAsync}
// )(Counter)
