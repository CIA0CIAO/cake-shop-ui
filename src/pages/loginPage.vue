<template>
  <el-container>
    <el-aside width="60%">
      <el-image style="width: 100%;" :src="`http://localhost:10001/images/ui/big-house.jpg`" fit="contain" /></el-aside>
    <el-main>
      <template v-if="scene == 'login'">
        <el-form class="loginForm" :model="loginForm">
          <el-form-item>
            <el-input v-model="loginForm.username" type="tel" prefix-icon="User" placeholder="电话号码/邮箱" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.password" type="password" prefix-icon="Key" placeholder="请输入密码" />
          </el-form-item>
          <el-button style="width: 100%;" type="primary" @click="login">登录</el-button>
          <el-form-item>
            还没有账号？<el-link type="primary" @click="scene = 'register'" :underline="false">注册</el-link>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="scene == 'register'">
        <el-form :model="registerForm">
          <el-form-item>
            <el-input v-model="registerForm.nick" type="text" prefix-icon="User" placeholder="昵称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="registerForm.telephone" type="tel" prefix-icon="Phone" placeholder="电话号码/邮箱" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="registerForm.password" type="password" prefix-icon="Key" placeholder="6~18个字母或数字" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="registerForm.checkPassword" type="password" prefix-icon="Key" placeholder="请确认密码" />
          </el-form-item>
          <el-button style="width: 100%;" type="primary" @click="register">注册</el-button>
          <el-form-item>
            已有账号？<el-link type="primary" @click="scene = 'login'" :underline="false">登录</el-link>
          </el-form-item>
        </el-form>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import server from '@/server.js'
export default {
  data() {
    return {
      scene: "login",
      loginForm: {
        username: "",
        password: "",
      },
      registerForm: {
        telephone: "",
        password: "",
        checkPassword: "",
        nick: ""
      }
    }
  },
  methods: {
    login() {
      server.login(this.loginForm.username, this.loginForm.password).then(res => {
        if (res.data.code != 200) {
          throw res.data.msg
        }
        localStorage.setItem("token", res.data.token)
        ElMessage({
          message: '登录成功',
          type: 'success',
        })
        this.$router.push('/home')
      }).catch(err => {
        ElMessage({
          message: '登录失败 ' + err,
          type: 'error',
        })
        console.log(err)
      })
    },
    register() {
      server.register(this.registerForm).then(res => {
        ElMessage({
          message: '注册成功',
          type: 'success',
        })
        this.loginForm.username = this.registerForm.telephone
        this.loginForm.password = this.registerForm.password
        this.scene = 'login'
      }).catch(err => {
        ElMessage({
          message: '注册失败',
          type: 'error',
        })
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.loginForm {
  width: 250px;
  border-radius: 5px;
  padding: 10px;
}

.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>