<template>
  <div>
    <el-page-header @back="goBack" content="文章修改">
    </el-page-header>
    <el-card>

      <el-form ref="editFormRef">
        <!--标题信息-->
        <el-form-item label="标题">
        <el-input v-model="showForm.title"/>
      </el-form-item>
        <el-form-item label="文章类型" prop="cname">
          <el-select v-model="cname" @focus="getCategoryList" @change="chageSelect(categorys.cname)">
            <el-option v-for="c in categorys" :key="c.cid" :label="c.cname" :value="c.cname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="文章概括">
          <el-input v-model="showForm.descs"/>
        </el-form-item>
        <el-form-item label="是否置顶"  prop="isTop" >
          <el-radio-group v-model="showForm.isTop" @change="chageisTop">
            <el-radio v-model="radio" :label="0">否</el-radio>
            <el-radio v-model="radio" :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--正文内容-->
        <el-form-item label="正文内容">
          <editor api-key="afyohn2wcmrxhgiihsjime70hbzpqvtoh78a04tr305y0bfr" :init="editorList"
                  v-model="showForm.content"></editor>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="EditArticle">确定更改</el-button>
        </el-form-item>
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
    name: "EditArticle",
    data() {
      return {
        aId: '',
        queryInfo: {
          cId:[],
          title:'',
          descs:'',
          content:'',
          isTop:'',
        },
        cname:'',
        radio:1,
        categorys:[],
        showForm: [],
        editorList: {
          height: 500,
          menubar: true,
          language: "zh_CN",
          language_url: "/static/tinymce/langs/zh_CN.js",
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
    }, created() {
      this.aId = this.$route.params.aId
      this.getCategoryList()
    }, mounted: function () {
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
        this.cname=res.data.category.cname
      },
      async EditArticle(){
          //发起用户修改的请求
          const {data: res} = await this.$http.put('/sys/article/' + this.showForm.aId, {
            cId:this.showForm.cId,
            title: this.showForm.title,
            descs: this.showForm.descs,
            content: this.showForm.content,
            isTop:this.showForm.isTop
          })
          if (res.code !== 200) {
            return this.$message.error("更新用户数据失败!!!")
          }
          this.$message.success("文章更新成功")
          this.$router.push("/articles");
      },
      //单选框按钮值的切换
      chageisTop(value){
        this.isTop=value
      },

      async getCategoryList(){
        const {data: res} = await this.$http.get('/sys/catetoryall')
        if (res.code !== 200) {
          return this.$message.error("获取类别列表失败!!!")
        }
        this.categorys=res.data
      },

      chageSelect(value){
        this.categorys.map((s,index)=>{
          if (s.cname === value){
            this.queryInfo.cId=this.categorys[index].cid
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-card {
    margin-top: 20px;

  }

</style>
