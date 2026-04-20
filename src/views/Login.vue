<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="bg-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="login-content">
      <!-- 左侧品牌区域 -->
      <div class="brand-section" :class="{ 'animate-in': isVisible }">
        <div class="brand-logo">
          <svg viewBox="0 0 64 64" width="80" height="80" fill="none">
            <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.2)"/>
            <path d="M20 32l8 8 16-16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="brand-title">智能待办管理系统</h1>
        <p class="brand-description">打造高效、安全、便捷的政务办公平台</p>
        
        <div class="brand-features">
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            </div>
            <span>智能任务分配</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
            </div>
            <span>多级权限控制</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/>
              </svg>
            </div>
            <span>数据可视化</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录区域 -->
      <div class="login-section" :class="{ 'animate-in': isVisible }">
        <div class="login-card">
          <div class="login-header">
            <h2 class="login-title">欢迎回来</h2>
            <p class="login-subtitle">请登录您的账户</p>
          </div>
          
          <!-- 登录表单 -->
          <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
            <el-form-item prop="username">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <div class="input-wrapper" :class="{ 'focused': isUsernameFocus }">
                  <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                  <el-input
                    v-model="form.username"
                    placeholder="请输入用户名"
                    size="large"
                    clearable
                    @focus="isUsernameFocus = true"
                    @blur="isUsernameFocus = false"
                  />
                </div>
              </div>
            </el-form-item>
            
            <el-form-item prop="password">
              <div class="form-group">
                <div class="form-label-row">
                  <label class="form-label">密码</label>
                  <a href="#" class="forgot-password">忘记密码?</a>
                </div>
                <div class="input-wrapper" :class="{ 'focused': isPasswordFocus }">
                  <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
                  </svg>
                  <el-input
                    v-model="form.password"
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                    show-password
                    clearable
                    @focus="isPasswordFocus = true"
                    @blur="isPasswordFocus = false"
                    @keyup.enter="handleLogin"
                  />
                </div>
              </div>
            </el-form-item>
            
            <div class="form-options">
              <el-checkbox v-model="rememberMe" class="remember-me">
                <span>记住我</span>
              </el-checkbox>
            </div>
            
            <el-button
              type="primary"
              size="large"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form>
          
          <!-- 其他登录方式 -->
          <div class="alternative-login">
            <div class="divider">
              <span>或使用以下方式登录</span>
            </div>
            <div class="social-login">
              <button class="social-button wechat" @click="handleSocialLogin('wechat')">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M8.691 2.188C3.409 2.188 0 5.406 0 8.98c0 1.952 1.062 3.687 2.732 4.838-.066.266-.193.832.134 1.363.33.534.993.832 1.46.832.466 0 .799-.266.932-.4.133-.133.399-.534.532-.667.067-.133.2-.266.333-.266h.067c.266 0 .466.133.666.4.2.267.533.667.866 1.067.333.4 1.066.4 1.466 0 .4-.4.8-1.067 1.2-1.734.4-.667 1.2-1.334 2.133-1.334h.067c1.466 0 2.8-.6 3.866-1.6.133-.133.266-.266.333-.466.067-.2.067-.333.067-.533 0-.2-.067-.333-.2-.467-.133-.133-.266-.2-.466-.2-.266 0-.466.133-.6.333-.2.2-.333.333-.533.467-.2.133-.466.2-.733.2-.266 0-.533-.133-.733-.333-.2-.2-.333-.467-.466-.734-.133-.267-.267-.533-.467-.734-.2-.2-.4-.333-.666-.333-.266 0-.533.133-.733.333-.2.2-.333.467-.466.734-.133.267-.267.533-.467.734-.2.2-.4.333-.666.333-.266 0-.533-.133-.733-.333-.2-.2-.333-.467-.466-.734-.133-.267-.267-.533-.467-.734-.2-.2-.4-.333-.666-.333-.266 0-.533.133-.733.333-.2.2-.333.467-.466.734-.133.267-.267.533-.467.734-.2.2-.4.333-.666.333z" fill="currentColor"/>
                </svg>
                <span>微信登录</span>
              </button>
              <button class="social-button work-wechat" @click="handleSocialLogin('workwechat')">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                </svg>
                <span>企业微信</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 版权信息 -->
        <div class="login-footer">
          <p>© 2024 政务管理系统 · 安全高效 · 便捷办公</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()

const loading = ref(false)
const rememberMe = ref(false)
const isVisible = ref(false)
const isUsernameFocus = ref(false)
const isPasswordFocus = ref(false)

// 登录表单
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      const success = await userStore.login(form.username, form.password)
      if (success) {
        ElMessage.success('登录成功')
        router.push('/')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    } catch (error) {
      ElMessage.error('登录失败,请重试')
    } finally {
      loading.value = false
    }
  })
}

const handleSocialLogin = (type: string) => {
  ElMessage.info(`暂不支持${type === 'wechat' ? '微信' : '企业微信'}登录`)
}

onMounted(() => {
  // 页面加载后显示动画
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style scoped>
/* 登录容器 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 100%;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

/* 渐变背景 */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #1543e8 100%);
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 动态粒子背景 */
.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  animation: particleFloat 15s ease-in-out infinite;
}

.particle:nth-child(1) {
  width: 40px;
  height: 40px;
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 25%;
  animation-delay: 2s;
}

.particle:nth-child(3) {
  width: 30px;
  height: 30px;
  bottom: 30%;
  left: 15%;
  animation-delay: 4s;
}

.particle:nth-child(4) {
  width: 50px;
  height: 50px;
  bottom: 20%;
  right: 10%;
  animation-delay: 6s;
}

.particle:nth-child(5) {
  width: 25px;
  height: 25px;
  top: 50%;
  left: 50%;
  animation-delay: 8s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-50px) scale(1.2);
    opacity: 0.8;
  }
}

/* 网格背景 */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}

/* 主内容区 */
.login-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  max-width: 1200px;
  width: 100%;
  padding: 40px;
  position: relative;
  z-index: 1;
}

/* 品牌区域 */
.brand-section {
  flex: 1;
  max-width: 500px;
  color: white;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease;
}

.brand-section.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.brand-logo {
  margin-bottom: 30px;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.brand-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  line-height: 1.2;
}

.brand-description {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.5;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  opacity: 0;
  transform: translateY(20px);
  animation: featureFadeIn 0.6s ease forwards;
}

.feature-item:nth-child(1) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(2) {
  animation-delay: 0.4s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes featureFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 登录区域 */
.login-section {
  flex: 1;
  max-width: 450px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.login-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
}

/* 表单样式 */
.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.forgot-password {
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper:focused {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s ease;
  z-index: 1;
}

.input-wrapper:focused .input-icon {
  color: #667eea;
}

.el-input {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  padding-left: 48px !important;
  height: 52px !important;
  font-size: 16px !important;
}

.el-input__wrapper {
  box-shadow: none !important;
  border: none !important;
}

.form-options {
  margin-bottom: 32px;
}

.remember-me {
  font-size: 14px;
  color: #666;
}

.remember-me .el-checkbox__label {
  color: #666;
  margin-left: 8px;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 52px;
  border-radius: 12px !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.login-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4) !important;
}

.login-button:active {
  transform: translateY(0) !important;
}

/* 其他登录方式 */
.alternative-login {
  margin-top: 32px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e4e7ed;
}

.divider span {
  padding: 0 20px;
  font-size: 14px;
  color: #999;
}

.social-login {
  display: flex;
  gap: 16px;
}

.social-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-button:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.social-button.wechat:hover {
  border-color: #07C160;
  color: #07C160;
}

.social-button.work-wechat:hover {
  border-color: #007AFF;
  color: #007AFF;
}

/* 登录页脚 */
.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .login-content {
    flex-direction: column;
    gap: 40px;
    padding: 40px 20px;
  }
  
  .brand-section {
    max-width: 100%;
    text-align: center;
    order: 2;
  }
  
  .login-section {
    max-width: 100%;
    order: 1;
  }
  
  .brand-features {
    align-items: center;
  }
  
  .feature-item {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px;
  }
  
  .brand-title {
    font-size: 28px;
  }
  
  .brand-description {
    font-size: 16px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .el-input {
    height: 48px !important;
  }
  
  .login-button {
    height: 48px !important;
  }
}
</style>
