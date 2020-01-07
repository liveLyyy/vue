<template>
  <div>
    <el-page-header @back="goBack" content="文章修改">
    </el-page-header>
    <el-card>
      {{aId}}
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "EditArticle",
    data(){
      return{
        aId:''
      }
    },created() {
      this.aId=this.$route.params.aId
    },
    methods: {
      goBack() {
        this.$router.push("/articles");
      }
    }
  }
</script>

<style scoped>
.el-card{
  margin-top: 20px;
}
</style>
