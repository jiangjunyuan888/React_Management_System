import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'

/*
* 更新分类的form组件
* */

const Item = Form.Item

export default  class UpdateForm extends Component {

    formRef = React.createRef()

    //对props进行校验
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        //将form对象通过setForm()传递父组件
        this.props.setForm(this.formRef.current)
    }

    render() {
        const { categoryName } = this.props
        return (
            <Form ref={this.formRef}>
                <Item
                    name="categoryName"
                    initialValue={categoryName}
                    rules={[
                        { required: true, message: '分类名称必须输入' },
                    ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
            </Form>
        );
    }
}