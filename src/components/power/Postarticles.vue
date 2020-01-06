<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>发布文章</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-form label-width="90px" slot-scope="scope" ref="addFormRef">
          <el-form-item label="文章标题" prop="title">
            <el-input resize="none" type="textarea" autosize v-model="queryInfo.title"></el-input>
          </el-form-item>

          <el-form-item label="文章类型" prop="category.cname">
            <el-select v-model="categorys.cname" @focus="getCategoryList" @change="chageSelect(categorys.cname)"  placeholder="请选择">
              <el-option v-for="c in categorys" :key="c.cid" :label="c.cname" :value="c.cname"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="文章概括" prop="desc">
            <el-input resize="none" type="textarea" autosize v-model="queryInfo.desc"></el-input>
          </el-form-item>
          <el-form-item label="是否置顶"  prop="isTop" >
            <el-radio-group v-model="queryInfo.isTop" @change="chageisTop">
              <el-radio v-model="radio" :label="0">否</el-radio>
              <el-radio v-model="radio" :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正文内容" prop="content">
            <editor api-key="no-api-key" :init="editorList" v-model="queryInfo.content"></editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addArticle">立即创建</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'
    export default {
        name: "Postarticles",
        components: {
          'editor': Editor
        },
      data(){
          return{
            queryInfo: {
              cId:[],
              title:'',
              desc:'',
              content:'',
              isTop:''
            },
            radio:0,
            categorys:[],
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
            },
          }
      },created() {
        this.getCategoryList()
      },methods:{
        async getCategoryList(){
          const {data: res} = await this.$http.get('/sys/findAllCategory')
          if (res.code !== 200) {
            return this.$message.error("获取类别列表失败!!!")
          }
          this.categorys=res.data
        },
        //单选框按钮值的切换
        chageisTop(value){
         this.queryInfo.isTop=value
        },
        //el-select选择选中赋值函数
        chageSelect(value){
            this.categorys.map((s,index)=>{
                if (s.cname === value){
                  this.queryInfo.cId=this.categorys[index].cid
                }
            })
        },
        async  addArticle(){
            const {data: res} = await this.$http.post('/sys/addArticle', this.queryInfo)
            if (res.code !== 200){
              this.$message.error("文章发布失败！！！")
            }
            this.$message.success("文章发布成功")
            this.$router.push("/articles");
        },

      }
    }
</script>

<style scoped>

</style>
