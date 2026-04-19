import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Login from '@/views/Login.vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
import Home from '@/views/Home.vue'
import UserManage from '@/views/UserManage.vue'
import RoleManage from '@/views/RoleManage.vue'
import DepartmentManage from '@/views/DepartmentManage.vue'

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
        meta: { title: '首页' }
      },
      {
        path: 'user',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: RoleManage,
        meta: { title: '角色管理' }
      },
      {
        path: 'department',
        name: 'DepartmentManage',
        component: DepartmentManage,
        meta: { title: '部门管理' }
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

  if (to.path === '/login') {
    if (userStore.token) {
      return next({ path: '/' })
    }
    return next()
  }

  if (!userStore.token) {
    return next({ path: '/login' })
  }

  return next()
})

export default router
