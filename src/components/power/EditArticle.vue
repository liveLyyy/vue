<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/articles' }">文章列表</el-breadcrumb-item>
      <el-breadcrumb-item>文章修改</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
    export default {
        name: "EditArticle"
    }
</script>

<style scoped>

</style>
