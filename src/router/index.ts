import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Login from '@/views/Login.vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
import Home from '@/views/Home.vue'
import UserManage from '@/views/UserManage.vue'
import RoleManage from '@/views/RoleManage.vue'
import DepartmentManage from '@/views/DepartmentManage.vue'
import PermissionManage from '@/views/PermissionManage.vue'
import TodoManage from '@/views/TodoManage.vue'
import TodoDetail from '@/views/TodoDetail.vue'
import TodoStatistics from '@/views/TodoStatistics.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: '首页', requiresAuth: true }
      },
      {
        path: 'todo',
        name: 'TodoManage',
        component: TodoManage,
        meta: { title: '待办列表', requiresAuth: true }
      },
      {
        path: 'todo/:id',
        name: 'TodoDetail',
        component: TodoDetail,
        meta: { title: '待办详情', requiresAuth: true }
      },
      {
        path: 'statistics',
        name: 'TodoStatistics',
        component: TodoStatistics,
        meta: { title: '查询统计', requiresAuth: true }
      },
      {
        path: 'user',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理', requiresAuth: true }
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: RoleManage,
        meta: { title: '角色管理', requiresAuth: true }
      },
      {
        path: 'department',
        name: 'DepartmentManage',
        component: DepartmentManage,
        meta: { title: '部门管理', requiresAuth: true }
      },
      {
        path: 'permission',
        name: 'PermissionManage',
        component: PermissionManage,
        meta: { title: '权限管理', requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  const isAdmin = userStore.roles && userStore.roles.includes('admin')

  document.title = to.meta.title ? `政务待办系统 - ${to.meta.title}` : '政务待办系统'

  if (to.name === 'Login') {
    if (token) {
      return next({ path: '/' })
    }
    return next()
  }

  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login' })
  }

  // 权限管理页面需要管理员角色
  if (to.name === 'PermissionManage' && !isAdmin) {
    return next({ path: '/' })
  }

  return next()
})

export default router
