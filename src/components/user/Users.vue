<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图结构-->
    <el-card>
      <el-row :gutter="5">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="quryInfo.username" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户信息展示-->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="用户角色" prop="role.rolename"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="电子邮件" prop="email"></el-table-column>
        <!--        <el-table-column label="状态">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-switch v-model="scope.row.status"  @change="userStatusChanged(scope.row)">-->
        <!--            </el-switch>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click=" (scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="权限分配" placement="top">
              <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--添加用户Dialog-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed" >
        <!--内容主体-->
        <el-form :model="addForm" :rules="rulesForm" ref="addFormRef" label-width="100px"slot-scope="scope">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <!--          <el-form-item label="用户角色">-->
          <!--            <el-select placeholder="请选择角色" v-model="userList.role">-->
          <!--              <el-option v-for="item in userList" :key="item.id" :lable="item.rolename"-->
          <!--                         :value="item.role.rolename"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUsers">确 定</el-button>
          </span>
      </el-dialog>

      <!--修改用户Dialog-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
        <el-form :model="editFrom" :rules="editFromRules" ref="editFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="editFrom.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
      </el-dialog>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="quryInfo.pageCount"
        :page-sizes="[1, 2, 3, 4,5]"
        :page-size="quryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "users",
    data() {
      //校验邮箱规则
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      //校验电话号码规则
      var checkPhone = (rule, value, cb) => {
        const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regPhone.test(value)) {
          return cb()
        }
        cb(new Error("请输入合法的手机号"))
      }
      return {
        quryInfo: {
          list: '',
          pageCount: 1,
          pageSize: 5,
        },
        userList: [],
        total: 0,
        //控制添加弹出框
        addDialogVisible: false,
        editDialogVisible: false,
        //添加用户表单
        addForm: {
          rid:'',
          username: '',
          password: '',
          phone: '',
          email: ''
        },
        rulesForm: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ]
        },
        editFrom: '',
        editFromRules: {
          phone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ]
        }
      }
    }, created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const {data: res} = await this.$http.get('/user/users', {params: this.quryInfo})
        if (res.code !== 200) {
          return this.$message.error("获取列表失败!!!");
        }
        this.userList = res.data.list;
        this.total = res.data.total;
      },

      handleSizeChange(newSize) {
        this.quryInfo.pageSize = newSize
        this.getUserList()
      },

      handleCurrentChange(newPage) {
        this.quryInfo.pageCount = newPage
        this.getUserList()
      },
      //监听对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //添加用户点击事件
      addUsers() {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return
          // //可以发起添加用户的网络请求
          const {data: res} = await this.$http.post('/user/addUsers', this.addForm)
          if (res.code !== 200) {
            this.$message.error("添加用户失败！！！")
          }
          this.$message.success("添加用户成功")
          this.addDialogVisible = false
          this.getUserList()
          // console.log(res)
        })
      },
      //监听修改弹出框
      async showEditDialog(id) {
        const {data: res} = await this.$http.get('/user/findById/' + id)
        if (res.code !== 200) {
          return this.$message.error("查询路径失败")
        }
        this.editFrom = res.data
        this.editDialogVisible = true
      },

      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },

      //修改用户信息
      editUser() {
        this.$refs.editFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return
          //发起用户修改的请求
          const {data: res} = await this.$http.put('/user/updateUser/' + this.editFrom.id, {
            phone: this.editFrom.phone,
            email: this.editFrom.email
          })
          if (res.code !== 200) {
            return this.$message.error("更新用户数据失败!!!")
          }
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success("更新用户成功")
        })
      },

      //删除用户信息
      async removeUserById(id) {
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return this.$message.info("已取消删除")
        }
        const {data: res} = await this.$http.delete('/user/deleteByIdUser/' + id)
        if (res.code !== 200) {
          return this.$message.error("删除用户失败!!!")
        }
        this.$message.success("删除用户成功")
        this.getUserList()
      }
    }
  }
</script>

<style scoped>

</style>
