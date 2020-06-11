<template>
<el-card class="box-card">
  <!-- 1. 面包屑 首页=>权限管理=>权限列表 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
    </el-breadcrumb>
</el-card>
</template>

<script>
export default {
  data(){
    return{}
  },
  props:['level1', 'level2']
}
</script>

<style>

</style>
