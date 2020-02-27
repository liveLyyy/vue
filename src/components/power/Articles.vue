<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="5">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.title"  clearable  @clear="getArticle">
            <el-button slot="append" icon="el-icon-search" @click="getArticle"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ArticleList" style="width: 100%;text-align: center" border stripe>
        <el-table-column width="50" label="#" type="index"></el-table-column>
        <el-table-column width="90" label="创建人" prop="user.username"></el-table-column>
        <el-table-column width="100" label="文章类型" prop="category.cname"></el-table-column>
        <el-table-column width="150" label="文章标题" prop="title"></el-table-column>
        <el-table-column width="100" label="文章概括" prop="desc"></el-table-column>
        <el-table-column width="300" label="文章内容" prop="content"></el-table-column>
        <el-table-column width="60" label="浏览人数" prop="views"></el-table-column>
        <el-table-column width="60" label="点赞人数" prop="likes"></el-table-column>
        <el-table-column width="170" label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
        <el-table-column width="170" label="更新时间" prop="updateTime" :formatter="dateFormat"></el-table-column>
        <el-table-column width="50" label="是否置顶" prop="isTop"></el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="浏览" placement="top">
              <el-button type="success" icon="el-icon-view" size="mini" @click="showArticle(scope.row.aId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editArticle(scope.row.aId)"
              ></el-button>
<!--              <router-link :to="{ path: '/showArticle',query:{aId:aId}}">跳转B组件</router-link>-->
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeArticle(scope.row.aId)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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
    name: "Articles",
    data() {
      return {
        queryInfo: {
          list: '',
          aId:'',
          title:'',
          desc:'',
          content:'',
          pageCount: 1,
          pageSize: 5,
        },
        ArticleList: [],
        showFrom:'',
        total: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        activePath:''
      }
    }, created() {
      this.getArticle()
    },
    methods: {
      //格式化时间显示
      dateFormat: function (row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        var moment = require("moment");
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      //获取文章列表
      async getArticle() {
        const {data: res} = await this.$http.get('/sys/article', {params: this.queryInfo})
        if (res.code !== 200) {
          return this.$message.error("获取列表失败!!!");
        }
        this.ArticleList = res.data.list;
        this.aId=res.data.aId;
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getArticle()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageCount = newPage
        this.getArticle()
      },
      //跳转到预览文章页面，并传递文章ID
      showArticle(aId){
        this.$router.push({
          name:'ShowArticle'
          ,params:{aId:aId}})
      },
      //跳转到修改文章页面，并传递文章ID
      editArticle(aId){
        this.$router.push({
          name:'EditArticle'
          ,params:{aId:aId}})
      },
      //根据ID删除文章
      async removeArticle(aId){
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result !== 'confirm') {
          return this.$message.info("已取消删除")
        }
        const {data: res} = await this.$http.delete('/sys/article/' + aId)
        if (res.code !== 200) {
          return this.$message.error("删除用户失败!!!")
        }
        this.$message.success("删除用户成功")
        this.getArticle()
      }
    }
  }
</script>

<style scoped>

</style>
