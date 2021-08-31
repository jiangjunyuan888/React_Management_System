import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const {Item} = Form
const {Option} = Select

export default class UserForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {

        const {roles} = this.props
        const user = this.props.user || {}

        return (
            <Form
                ref={this.formRef}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 15 }}
            >
                <Item
                    label="用户名"
                    name="username"
                    initialValue={user.username}
                    rules={[
                        { required: true, message: '用户名称必须输入' }
                    ]}
                >
                    <Input placeholder="请输入用户名" />
                </Item>
                {
                    user._id ? null : (
                        <Item
                            label="密码"
                            name="password"
                            initialValue={user.password}
                            rules={[
                                {required: true, message: '密码必须输入'},
                                {min: 4, max: 12}
                            ]}
                        >
                            <Input type="password" placeholder="请输入密码且长度至少四位"/>
                        </Item>
                    )
                }
                <Item
                    label="手机号"
                    name="phone"
                    initialValue={user.phone}
                    rules={[
                        { required: true, message: '手机号必须输入' }
                    ]}
                >
                    <Input placeholder="请输入手机号" />
                </Item>
                <Item
                    label="邮箱"
                    name="email"
                    initialValue={user.email}
                    rules={[
                        { required: true, message: '邮箱必须输入' }
                    ]}
                >
                    <Input placeholder="请输入邮箱" />
                </Item>
                <Item
                    label="角色"
                    name="role_id"
                    initialValue={user.role_id}
                >
                    <Select placeholder="请选择角色">
                        {
                            roles.map(role => {
                                return <Option value={role._id} key={role._id}>{role.name}</Option>
                            })
                        }
                    </Select>
                </Item>
            </Form>
        );
    }
}
