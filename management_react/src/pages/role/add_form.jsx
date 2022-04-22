import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Input} from 'antd'

const {Item} = Form

/*
添加分类的form组件
 */
export default class AddForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    componentDidMount () {
        this.props.setForm(this.formRef.current)
    }

    render() {

        return (
            <Form
                ref={this.formRef}
                labelCol={{ span: 4 }} // 左侧label的宽度
                wrapperCol={{ span: 15 }}// 右侧包裹的宽度
            >
                    <Item
                        label="角色名称"
                        name="roleName"
                        rules={[
                            { required: true, message: '角色名称必须输入' }
                        ]}
                    >
                        <Input placeholder="请输入分类名称" />
                    </Item>
            </Form>
        )
    }
}
