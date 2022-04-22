import React, {Component} from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles,reqAddRole,reqUpdateRole} from "../../api";
import AddForm from "./add_form";
import AuthForm from "./auth_form"
import storageUtils from "../../utils/storageUtils";
import {logout} from '../../redux/actions'
// import memoryUtils from "../../utils/memoryUtils";

/*
*   角色管理路由
* */
class Role extends Component {

  state={
      roles:[],//所有角色的列表
      role: {},//选中的role
      isShowAdd: false,//是否显示添加界面
      isShowAuth: false,//是否显示角色权限界面
  }

  constructor(props) {
      super(props);
      this.auth = React.createRef()
  }

  initColum = () => {
      this.columns = [
          {
              title: '角色名称',
              dataIndex: 'name'
          },
          {
              title: '创建时间',
              dataIndex: 'create_time'
          },
          {
              title: '授权时间',
              dataIndex: 'auth_time'
          },
          {
              title: '授权人',
              dataIndex: 'auth_name'
          },
      ]
  }

  getRoles = async() => {
    const result = await reqRoles()
      if(result.status === 0 ){
          const roles = result.data
          this.setState({
            roles
          })
      }
  }

  onRow = (role) => {
      return{
          onClick: event => { //点击行
              console.log('点击行',role)
              this.setState({
                  role
              })
          }
      }
  }

  /*
  * 添加角色
  * */
    addRole = async () => {
        this.form.validateFields().then(async (values) => {
            //隐藏确认框
            this.setState({
                isShowAdd: false
            })
            // console.log(values);
            const { roleName } = values
            //重置数据
            this.form.resetFields()
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                message.success("添加角色成功")
                // this.getRoles()
                const role = result.data
                //更新roles状态，基于原本的状态数据更新
                this.setState(state => ({
                        roles: [...state.roles, role]
                    })

                )
            }
        })
            .catch((err) => {
                message.info('添加角色失败')
            })
    }

    /*
    * 更新角色
    * */
    updateRole = async () => {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        const result = await reqUpdateRole(role)
        if(result.status === 0){
            // 如果当前更新的是自身角色的权限，强制退出
            if(role._id === this.props.user.role._id){
                // this.props.user = {}
                // storageUtils.removeUser()
                this.props.logout()
                // this.props.history.replace('/login') // 不需要再执行这一步，admin.jsx中有统一的判断
                message.success("当前用户角色权限修改了，重新登陆")
            }else{
                message.success("设置角色权限成功")
                this.getRoles()
            }
            
        }
    }

  UNSAFE_componentWillMount() {
      this.initColum()
  }

  componentDidMount() {
    this.getRoles()
  }

    render() {
      const {roles,role,isShowAdd,isShowAuth} = this.state
      const title = (
          <span>
              <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>
              <Button type='primary'
                      disabled={!role._id}
                      style={{marginLeft:"20px"}}
                      onClick={() => this.setState({isShowAuth: true})}
              >
                  设置角色权限
              </Button>
          </span>
      )

    return (
        <Card title={title}>
            <Table
                dataSource={roles}
                columns={this.columns}
                bordered
                rowKey='_id'
                pagination={{pageSize:PAGE_SIZE}}
                rowSelection={{type:'radio',selectedRowKeys: [role._id],onSelect:(role) => {
                    this.setState({role:role})
                }}}
                onRow={(role) => {
                    return {
                        onSelect:(event) => {
                            this.setState({
                                role
                            })
                        },
                        onClick:(event) => {
                            this.setState({
                                role
                            })
                        }
                    }

                }}

                // loading={loading}
            />

            <Modal
                title="添加角色"
                visible={isShowAdd}
                onOk={this.addRole}
                onCancel={() => {
                    this.setState({isShowAdd: false})
                    //重置数据
                    this.form.resetFields()
                }}
            >
                <AddForm
                    setForm={(form) => this.form = form}
                />
            </Modal>

            <Modal
                title="设置角色权限"
                visible={isShowAuth}
                onOk={this.updateRole}
                onCancel={() => {
                    this.setState({isShowAuth: false})
                }}
            >
                <AuthForm role={role} ref={this.auth}/>
            </Modal>

        </Card>
    );
  }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)

