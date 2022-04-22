/*
*   入口js
* */
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
// import "antd/dist/antd.css"

import App from "./App"
import store from "./redux/store";
// import storageUtils from './utils/storageUtils'
// import memoryUtils from "./utils/memoryUtils";


// 读取local中保存的user，保存到内存中（使得用户只需登录一次下一次即可直接进入主页）
// const user = storageUtils.getUser()
// memoryUtils.user = user

// 将App组件标签渲染到index页面的div上
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root"))