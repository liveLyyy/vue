<template>
  <div>
    <el-page-header @back="goBack" content="文章预览">
    </el-page-header>
    <el-card>
      <el-form>
        <el-container>
          <!--标题信息-->
          <el-header>
              <h1>{{showForm.title}}</h1>
            <el-row>
              <el-row :model="showForm.list">
                <el-col :span="6"><div class="grid-content bg-purple" >
                  <a class="el-icon-time" > {{showForm.createTime}}</a>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple-light">
                  <a class="el-icon-view">  {{showForm.views}}</a>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                  <a class="el-icon-chat-line-square">  {{showForm.likes}}</a>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                  <a class="el-icon-s-custom">  {{username}}</a>
                </div></el-col>
              </el-row>
              <el-row style="margin-top: 15px">
                <el-col :span="6"><div class="grid-content bg-purple">
                  <el-tag>类别：{{cname}}</el-tag>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple-light">
                  <el-tag type="success">概要：{{showForm.descs}}</el-tag>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                  <el-tag type="info">更新时间：{{showForm.updateTime}}</el-tag>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                  <el-tag v-if="isTop === 0">是否置顶：否</el-tag>
                  <el-tag  v-if="isTop === 1" type="success">是否置顶：是</el-tag>
                </div></el-col>
              </el-row>
            </el-row>
          </el-header>
          <!--正文内容-->
          <el-main>
            <p v-html="showForm.content"></p>
          </el-main>
        </el-container>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'

  export default {
    components: {
      'editor': Editor
    },
    name: "ShowArticle",
    data() {
      return {
        aId: '1',
        username:'',
        cname:'',
          title:'',
          descs:'',
          content:'',
          likes:'',
          views:'',
          isTop:'',
          createTime:'',
          updateTime:'',
        showForm:[],
        editorList:{
          height: 500,
          menubar: true,
          language:"zh_CN",
          language_url:"/static/tinymce/langs/zh_CN.js",
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
        }
      }
    },
    created() {
      this.aId = this.$route.params.aId
    },
   mounted:function () {
     this.findByIdArticle(this.aId)
   },
    methods: {
      goBack() {
        this.$router.push("/articles");

      },
      async findByIdArticle(aId) {
        const {data: res} = await this.$http.get('/sys/article/' + this.aId)
        if (res.code !== 200) {
          return this.$message.error("查询路径失败")
        }
        this.showForm = res.data
        this.username=res.data.user.username
        this.cname=res.data.category.cname
        this.isTop=res.data.isTop
      }
    }
  }
</script>

<style scoped>
  .el-card {
    margin-top: 10px;
    font-family: 宋体;
  }
  h1{
    text-align: center;
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-family: 黑体;
  }
  .el-row{
    text-align: center;
  }
  .el-main{
    margin-top: 50px;
    font-family: 宋体;
    font-size: 18px;
  }
</style>
