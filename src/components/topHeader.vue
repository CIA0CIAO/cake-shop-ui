<template>
  <el-header>
    <div class="header-left">
      <el-image :src="`http://localhost:10001/images/ui/logo.jpg`" fit="contain" />
      <el-menu :default-active="menuActive" mode="horizontal" :ellipsis="false" :router="true" @select="toPage">
        <el-menu-item index="/home" :disabled="menuActive == '/home'">首页</el-menu-item>
        <el-menu-item index="/store" :disabled="menuActive == '/store'">商城</el-menu-item>
        <el-menu-item v-if="user && user.id" index="/user" :disabled="menuActive == '/user'">个人中心</el-menu-item>
        <el-menu-item v-if="user && user.role == 'admin'" index="/admin"
          :disabled="menuActive == '/admin'">后台</el-menu-item>
      </el-menu>
    </div>
    <div class="header-right">
      <template v-if="user && user.id">
        <el-dropdown>
          <el-avatar :size="50" :src="user.avatar"></el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-dropdown>
          <el-avatar :size="50">未登录</el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toLoginPage">登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </el-header>
</template>

<script>
import server from '@/server.js'
export default {
  data() {
    return {
      menuActive: "/home",
      user: {
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token")
      this.user = {}
      this.$router.push('/home')
      this.menuActive = '/home'
    },
    toHomePage() {
      this.$router.push('/home')
    },
    toLoginPage() {
      this.$router.push("/login")
    },
    toUserPage() {
      this.$router.push('/user')
    },
    toStorePage() {
      this.$router.push('/store')
    },
    toAdminPage() {
      this.$router.push('/admin')
    },
    toPage(index, indexPath, item, routeResult) {
      this.menuActive = index
      routeResult.catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    let token = localStorage.getItem('token')
    if (token != null) {
      server.getUser(token).then(res => {
        this.user = res.data.user
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
}

.el-header .el-image:first-child {
  width: 60px;
  margin-right: 12px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>