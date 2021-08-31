/*
*   入口js
* */
import React from "react"
import ReactDOM from "react-dom"
// import "antd/dist/antd.css"

import App from "./containers/App";
import store from './redux/store'
import {Provider} from './lib/react-redux'

// 将App组件标签渲染到index页面的div上
ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>),
    document.getElementById("root"))
