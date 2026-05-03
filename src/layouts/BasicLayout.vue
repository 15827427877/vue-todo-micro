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
        <div class="header-left">
          <span class="header-title">待办系统后台</span>
        </div>
        <div class="header-center"></div>
        <div class="header-right">
          <NotificationPanel />
          <el-dropdown>
            <div class="user-menu-trigger">
              <div class="avatar-wrapper">
                <svg class="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="user-name">{{ user.name }}</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToSettings">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  </svg>
                  <span>系统设置</span>
                </el-dropdown-item>
                <el-dropdown-item @click="goToHelp">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                  <span>帮助文档</span>
                </el-dropdown-item>
                <el-dropdown-divider />
                <el-dropdown-item @click="logout">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <path d="M16 17l5-5-5-5"/>
                    <path d="M21 12H9"/>
                  </svg>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import NotificationPanel from '@/components/NotificationPanel.vue'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const goToSettings = () => {
  router.push('/settings')
}

const goToHelp = () => {
  router.push('/help')
}

const user = userStore

// 根据用户角色生成菜单
const menuItems = computed(() => {
  const baseItems = [
    { path: '/', label: '首页' },
    { path: '/todo', label: '待办列表' },
    { path: '/approval', label: '审批中心' },
    { path: '/statistics', label: '查询统计' },
    { path: '/notifications', label: '通知中心' }
  ]
  
  // 所有登录用户都能看到的管理菜单
  const manageItems = [
    { path: '/user', label: '用户管理' },
    { path: '/role', label: '角色管理' }
  ]
  
  // 只有管理员能看到的菜单
  const adminItems = [
    { path: '/permission', label: '权限管理' }
  ]
  
  // 所有登录用户都能看到的部门管理
  const departmentItem = [
    { path: '/department', label: '部门管理' }
  ]
  
  // 检查用户是否为管理员
  const isAdmin = user.roles && user.roles.includes('admin')
  
  // 组合菜单
  return [...baseItems, ...manageItems, ...(isAdmin ? adminItems : []), ...departmentItem]
})
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
  background: #fff;
}

.layout-main {
  padding: 24px;
  background-color: #f5f7fa;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-center {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-trigger:hover {
  background-color: #f1f5f9;
}

.avatar-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.arrow-icon {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
}

:deep(.el-dropdown-menu) {
  min-width: 180px;
}

:deep(.el-dropdown-item) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
}

:deep(.el-dropdown-item:hover) {
  background-color: #f1f5f9;
}
</style>
