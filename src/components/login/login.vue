<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名" >
        <el-input v-model="formdata.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formdata.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin () {
      this.$http.post('login', this.formdata).then(res => {
        // console.log(res)
        // 登录失败：1.提示错误信息
        const {
          // eslint-disable-next-line no-unused-vars
          data,
          meta: { msg, status }
        } = res.data

        if (status === 200) {
          // 登录成功：
          // 0.保存token值
          localStorage.setItem('token', data.token)
          // 1.跳转首页
          this.$router.push({name: 'home'})
          // 2.提示成功
          this.$message.success(msg)
        } else {
          // 提示失败原因
          this.$message.warning(msg)
        }

      })
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>
