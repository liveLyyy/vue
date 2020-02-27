<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>类别管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="5">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.cname" clearable @clear="getCategoryList">
            <el-button slot="append" icon="el-icon-search" @click="getCategoryList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="categoryList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cname"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="shwoDialog(scope.row.cid)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCategoryById(scope.row.cid)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--添加分类-->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="40%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="editFromRules"  label-width="90px" slot-scope="scope" ref="addFormRef">
          <el-form-item label="分类名称" prop="cname">
            <el-input v-model="addForm.cname"></el-input>
          </el-form-item>
          <el-form-item label="分类排序" prop="sort">
            <el-input v-model="addForm.sort" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改分类Dialog-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"  @close="editDialogClosed">
        <el-form :model="editFrom" ref="editFormRef"  label-width="100px" >
          <el-form-item label="分类名称" prop="cname">
            <el-input v-model="editFrom.cname"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime"   >
            <el-input v-model="editFrom.createTime"  disabled></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="editFrom.sort"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editCategory">确 定</el-button>
          </span>
      </el-dialog>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageCount"
        :page-sizes="[1, 2, 3, 4,5]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Categorys",
    data() {
      return {
        queryInfo: {
          list: '',
          pageCount: 1,
          pageSize: 5,
        },
        categoryList: [],
        total: 0,
        addDialogVisible: false,
        editDialogVisible:false,
        addForm: {
          cname: '',
          sort: ''
        },
        editFrom:'',
        editFromRules:{
          sort:[
            {required: true, message: '请输入排序', trigger: 'blur'},
            { max: 1, message: '排序大小不超过10', trigger: 'blur'}
          ]
        }
      }
    }, created() {
      this.getCategoryList()
    },
    methods: {
      async getCategoryList() {
        const {data: res} = await this.$http.get('/sys/catetory', {params: this.queryInfo})
        if (res.code !== 200) {
          return this.$message.error("获取列表失败!!!");
        }
        this.categoryList = res.data.list;
        this.total = res.data.total;
      },
      dateFormat: function (row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        var moment = require("moment");
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getCategoryList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageCount = newPage
        this.getCategoryList()
      },
      //监听对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      addCategory() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('/sys/catetory', this.addForm)
          if (res.code !== 200) {
            this.$message.error("添加用户失败！！！")
          }
          this.$message.success("添加用户成功")
          this.addDialogVisible = false
          this.getCategoryList()
        })
      },
      async shwoDialog(id) {
        const {data: res} = await this.$http.get('/sys/catetory/' + id)
        if (res.code !== 200){
          return this.$message.error("根据ID查询分类失败")
        }
        this.editFrom=res.data
        this.editDialogVisible=true
      },
      editCategory(){
        this.$refs.editFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return
          //发起用户修改的请求
          const {data: res} = await this.$http.put('/sys/catetory/' + this.editFrom.cid, {
            cname: this.editFrom.cname,
            sort: this.editFrom.sort
          })
          if (res.code !== 200) {
            return this.$message.error("更新用户数据失败!!!")
          }
          this.editDialogVisible = false
          this.getCategoryList()
          this.$message.success("更新用户成功")
        })
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //删除用户信息
      async removeCategoryById(cid) {
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return this.$message.info("已取消删除")
        }
        const {data: res} = await this.$http.delete('sys/catetory/' + cid)
        if (res.code !== 200) {
          return this.$message.error("删除用户失败!!!")
        }
        this.$message.success("删除用户成功")
        this.getCategoryList()
      }
    }
  }
</script>

<style scoped>

</style>
