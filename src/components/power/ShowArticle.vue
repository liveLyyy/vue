<template>
    <div>
      <el-page-header @back="goBack" content="文章预览">
      </el-page-header>
    </div>
</template>

<script>
    export default {
        name: "ShowArticle",
      data:{},
      methods:{
        goBack(){
          this.$router.push("/articles");
        }
      }
    }
</script>

<style scoped>

</style>
