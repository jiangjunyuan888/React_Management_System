/*
*   要求：能根据接口文档定义接口请求
*   包含应用中所有接口请求函数的模块
*   每个函数的返回值都是promise
* */
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'
import axios from "axios"
// const BASE = 'http://120.55.193.14:5000'
// const BASE = 'http://39.100.225.255:5000' //账号：admin 密码：admin
const BASE = 'http://localhost:3000'

//登录
/*
export function reqLogin(username,password){
  return ajax('/login',{username,password},'POST')
}
*/
export const reqLogin = (username,password) => ajax(BASE +'/api/login',{username,password},'POST')
//添加用户
export const reqAddUser = (user) => ajax(BASE +'/manage/user/add',user,'POST')
// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE +'/manage/category/add',{categoryName,parentId},'POST')
//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE +'/manage/category/update',{categoryId,categoryName},'POST')
//商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE + '/manage/product/list',{pageNum,pageSize})
//获取一个分类
export const reqCategory =  (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})
//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST')
//删除商品图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete',{name},'POST')
//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id?'update':'date') ,product,'POST')
//修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update',product,'POST')
//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName},'POST')
//更新角色权限,形参role为对象
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
//获取所有用户
export const reqUsers = () => ajax(BASE + '/manage/user/list')
//删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId},"POST")
//添加/修改用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'),user,"POST")
//柱状图
export const reqBar = () => ajax("/bar")//接口地址与拦截地址要一致
//饼图
export const reqPie = () => ajax("/pie")
//折线图
export const reqLine = () => ajax("/line")

/*
* 搜索商品分页列表(根据商品名称/商品描述)
* searchType:搜索的类型，productName,productDesc
* */
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName, //变量作为属性时要加 []
})

/*
* json请求的接口请求函数
* */
export const reqWeather = (city) => {
  return new Promise((resolve,reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=87015161509852d5d94b4b7118d8bee3&city=${city}`
    jsonp(url,{},(err,data) => {
      console.log('jsonp()',err,data)
      //  如果成功了
      if(!err && data.lives.length !== 0){
        // 取出需要的数据
        const {weather,reporttime} = data.lives[0]
        // console.log(weather,reporttime)
        resolve({weather,reporttime})
      }else{
        //  如果失败了
        message.error("获取天气信息失败")
      }
    })
  })
}



// reqWeather('440100') //高德地图提供的广州序号

/*
* jsonp解决ajax跨域的问题
*  （1）jsonp只能解决GET类型的ajax请求跨域问题
*  （2）jsonp请求不是ajax请求，而是一般的get请求
*  （3）基本原理
*     浏览器端：
*       动态生成<script>来请求后台接口（src就是接口的url）
*       定义好用于接收响应数据的函数（fn）,并将函数名通过请求参数提交给后台（如：callback=fn）
*     服务器端：
*        接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
*     浏览器端：
*        收到响应自动执行函数调用js代码，也就是执行了提前定义好的回调函数，并得到了需要的结果数据
* */