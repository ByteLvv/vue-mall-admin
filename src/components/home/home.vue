<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt="无法显示图片" style="object-fit:contain" />
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="loginout" @click.prevent="handleSignout()">
            <!-- <a class="loginout" @click.prevent="handleSignout()" href="#">退出</a> -->
            <el-button type="info">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航 -->
        <el-menu :router="true" :unique-opened="true">
          <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
            </template>
              <el-menu-item index="users">
                <i class="el-icon-s-grid"></i>
                <span>用户列表</span>
              </el-menu-item>
          </el-submenu>

          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-s-cooperation"></i>
                <span>权限管理</span>
            </template>
              <el-menu-item index="role">
                <i class="el-icon-s-grid"></i>
                <span>角色列表</span>
              </el-menu-item>
              <el-menu-item index="rights">
                <i class="el-icon-s-grid"></i>
                <span>权限列表</span>
              </el-menu-item>
          </el-submenu>

          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
            </template>
              <el-menu-item index="3-1">
                <i class="el-icon-s-grid"></i>
                <span>商品列表 </span>
              </el-menu-item>
              <el-menu-item index="3-2">
                <i class="el-icon-s-grid"></i>
                <span>分类参数 </span>
              </el-menu-item>
              <el-menu-item index="3-3">
                <i class="el-icon-s-grid"></i>
                <span>商品分类 </span>
              </el-menu-item>
          </el-submenu>

          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
            </template>
              <el-menu-item index="4-1">
                <i class="el-icon-s-grid"></i>
                <span>订单列表</span>
              </el-menu-item>
          </el-submenu>

          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>数据统计</span>
            </template>
              <el-menu-item index="5-1">
                <i class="el-icon-s-grid"></i>
                <span>数据报表</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // new vue之前自动触发
  beforeCreate () {
    const token = localStorage.getItem('token')
    // 获取token
    if (!token) {
      // 如果没有token则跳转到登录
      this.$router.push({name: 'login'})
    }
    // 如果有token则继续渲染组件
  },
  methods: {
    handleSignout () {
      // 1.清除token
      localStorage.clear()
      // 2.提示退出成功
      this.$message.success('退出成功')
      // 3.回到Login组件
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
  height: 1000px;
}

/* 头部样式 */
.middle {
  text-align: center;
}

.loginout {
  line-height: 60px;
  text-align: center;
  text-decoration: none;
}
</style>
