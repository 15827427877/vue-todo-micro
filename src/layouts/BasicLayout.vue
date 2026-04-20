<template>
  <el-container style="min-height: 100vh">
    <el-aside width="240px" class="layout-aside">
      <div class="menu-logo">政务待办系统</div>
      <el-menu router class="el-menu-vertical-demo" :default-active="$route.path" background-color="#001529" text-color="#fff" active-text-color="#409eff">
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">{{ item.label }}</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-title">待办系统后台</div>
        <div class="header-actions">
          <span>欢迎，{{ user.name }}</span>
          <el-button size="small" type="text" @click="logout">退出</el-button>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const user = userStore
const menuItems = [
  { path: '/', label: '首页' },
  { path: '/todo', label: '待办列表' },
  { path: '/statistics', label: '查询统计' },
  { path: '/user', label: '用户管理' },
  { path: '/role', label: '角色管理' },
  { path: '/department', label: '部门管理' }
]
</script>

<style scoped>
.menu-logo {
  color: #fff;
  font-size: 18px;
  text-align: center;
  padding: 24px 0;
  font-weight: 600;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  box-shadow: inset 0 -1px 0 rgb(0 0 0 / 6%);
}

.layout-main {
  padding: 24px;
  background-color: #f5f7fa;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>