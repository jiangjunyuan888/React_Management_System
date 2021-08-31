import React, {Component} from 'react';
import {
    Card,
    Button,
    Table,
    message,
    Modal
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from "../../components/link-button";
import { formateDate } from '../../utils/dateUtils'
import {reqAddOrUpdateUser, reqDeleteUser, reqUsers} from "../../api";
import { PAGE_SIZE } from '../../utils/constants'
import UserForm from "./user_form";

/*
* 用户路由
* */
export default class User extends Component {

    state = {
        users: [], //所有的用户列表
        roles: [], //所有角色列表
        isShow: false, //是否显示列表
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册事件',
                dataIndex: 'create_time',
                render: formateDate //时间格式化
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => {
                //   const result = this.state.roles.find(role => role._id === role_id)
                //   return result.name
                // }
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => {
                    return (
                        <span>
              <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
                    )
                }
            },
        ]
    }

    //  根据role的数组生成包括所有角色名的对象（属性名用角色id值）
    initRoleNames = (roles) => {
        const roleNames =  roles.reduce((acc,role) => {
            acc[role._id] = role.name
            return acc
        },{})
        // 保存
        this.roleNames = roleNames
    }

  //  获取所有用户
    getUsers = async () => {
        const result = await reqUsers()
        if(result.status === 0){
            const { users,roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

  //  删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确定删除${user.username}吗？`,
            icon:<ExclamationCircleOutlined />,
            onOk: async () => {
                const result = reqDeleteUser(user._id)
                if(result.status === 0 ){
                    message.success("删除用户成功")
                    this.getUsers()
                }
            }
        })
    }

  // 显示修改页面
    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({
            isShow: true
        })
    }

  //  显示添加页面
    showAdd = () => {
        this.user = null // 去掉前面缓存的user
        this.setState({
            isShow: true
        })
    }

  //  添加或更新用户
    addOrUpdateUser = () => {
        this.form.validateFields().then(async values => {
            this.setState({
                isShow: false
            })
            this.form.resetFields()
            // console.log(values);

            //如果是更新，需要给user指定_id属性
            if (this.user) {
                values._id = this.user._id
            }
            const result = await reqAddOrUpdateUser(values)
            if (result.status === 0) {
                message.success(`${this.user ? '修改' : '添加'}用户成功`)
                this.getUsers()
            }
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }


    render() {

        const title = <Button type='primary' onClick={() => this.showAdd()}>创建用户</Button>
        const {users,roles,isShow} = this.state
        const user = this.user || {}

        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                />
                <Modal
                    title={user._id ? "修改用户" : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ isShow: false })
                        this.form.resetFields()
                    }}
                    destroyOnClose
                >
                    <UserForm setForm={form => this.form = form} roles={roles} user={this.user} />
                </Modal>
            </Card>
        );
  }
}
