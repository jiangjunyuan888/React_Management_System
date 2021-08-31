/*
* redux 最核心的管理对象： store
* */
// import {applyMiddleware} from "redux";
// import thunk from 'redux-thunk' //用来实现redux异步的redux中间插件
// import {composeWithDevTools} from "redux-devtools-extension";

import {createStore} from '../lib/redux/index'

import reducer from './reducer'

export default createStore(reducer)//创建store对象内部会第一次调用reducer()得到初始值

