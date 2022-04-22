import React, {Component} from 'react';
import PropTypes from "prop-types";
import {
    Form,
    Input,
    Tree
} from "antd";

import menuList from "../../config/menuConfig";

const {Item} = Form

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props);
        // 根据传入角色menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //为父组件的提交获取最新menus数据
    getMenus = () => this.state.checkedKeys

    getTreeNodes(menuList){
        return menuList.reduce((acc,item) => {
            acc.push({
                title: item.title,
                key: item.key,
                children: item.children ? this.getTreeNodes(item.children) : null
            })
            return acc
        },[])
    }

    //选中某个treenode时的回调
    onCheck = (checkedKeys,info) => {
        // console.log('onCheck', checkedKeys, info);
        this.setState({
            checkedKeys
        })
    }

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    //根据新传入的role来更新checkedKeys状态
    //当组件接收到新的属性时自动调用
    UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    render() {

        const {role} = this.props
        const {checkedKeys} = this.state

        return (
            <Form
                ref={this.formRef}
                labelCol={{ span: 4 }} // 左侧label的宽度
                wrapperCol={{ span: 15 }}// 右侧包裹的宽度
            >
                <Item label="角色名称">
                    <Input value={role.name} disabled/>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true} //展开所有节点
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck} //点击复选框触发
                    treeData={this.treeNodes} //组件数据
                />
            </Form>
        )
    }
}
