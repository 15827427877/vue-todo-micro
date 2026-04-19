<template>
  <div class="login-wrapper">
    <el-card class="login-card" shadow="hover">
      <div class="login-title">后台管理系统</div>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="el-icon-user" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码" prefix-icon="el-icon-lock" show-password type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round block @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginForm = ref()

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
  loginForm.value.validate(async (valid: boolean) => {
    if (!valid) return
    const success = await userStore.login(form.username, form.password)
    if (success) {
      router.push('/')
    }
  })
}
</script>

<style scoped>
.login-title {
  font-size: 22px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
}

.login-card {
  width: 420px;
}
</style>
