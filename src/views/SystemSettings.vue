<template>
  <div class="settings-container">
    <div class="page-header">
      <h2 class="page-title">
        <i class="el-icon-setting"></i>
        系统设置
      </h2>
    </div>

    <div class="settings-content">
      <div class="settings-sidebar">
        <el-menu :default-active="activeMenu" @select="handleMenuSelect">
          <el-menu-item index="profile">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="password">
            <i class="el-icon-lock"></i>
            <span>修改密码</span>
          </el-menu-item>
          <el-menu-item index="notification">
            <i class="el-icon-bell"></i>
            <span>通知设置</span>
          </el-menu-item>
          <el-menu-item index="security">
            <i class="el-icon-shield"></i>
            <span>安全设置</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="settings-main">
        <el-card v-show="activeMenu === 'profile'" class="settings-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
          <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="profileForm.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="profileForm.department" disabled />
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="profileForm.roleName" disabled />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-show="activeMenu === 'password'" class="settings-card">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>
          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="120px">
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword">确认修改</el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-show="activeMenu === 'notification'" class="settings-card">
          <template #header>
            <div class="card-header">
              <span>通知设置</span>
            </div>
          </template>
          <el-form ref="notificationFormRef" :model="notificationForm" label-width="120px">
            <el-form-item label="待办提醒">
              <el-switch v-model="notificationForm.todoReminder" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="提醒时间" v-if="notificationForm.todoReminder">
              <el-time-select
                v-model="notificationForm.reminderTime"
                placeholder="选择时间"
                start="08:00"
                step="00:30"
                end="20:00"
              />
            </el-form-item>
            <el-form-item label="审批通知">
              <el-switch v-model="notificationForm.approvalNotice" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="系统公告">
              <el-switch v-model="notificationForm.systemNotice" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="notificationForm.notifyWays">
                <el-checkbox label="站内信">站内信</el-checkbox>
                <el-checkbox label="邮件">邮件</el-checkbox>
                <el-checkbox label="短信">短信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNotification">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-show="activeMenu === 'security'" class="settings-card">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h4>登录设备管理</h4>
                <p>查看并管理当前登录的设备</p>
              </div>
              <el-button type="primary" link @click="showDeviceManagement">管理</el-button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <h4>登录日志</h4>
                <p>查看账号的登录历史记录</p>
              </div>
              <el-button type="primary" link @click="showLoginLogs">查看</el-button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <h4>操作日志</h4>
                <p>查看账号的关键操作记录</p>
              </div>
              <el-button type="primary" link @click="showOperationLogs">查看</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog title="登录设备管理" v-model="deviceDialogVisible" width="600px">
      <el-table :data="loginDevices" stripe>
        <el-table-column prop="device" label="设备" width="150" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column prop="loginTime" label="登录时间" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="logoutDevice(row)">下线</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="deviceDialogVisible = false">关闭</el-button>
        <el-button type="danger" @click="logoutAllDevices">全部下线</el-button>
      </template>
    </el-dialog>

    <el-dialog title="登录日志" v-model="loginLogsDialogVisible" width="800px">
      <el-table :data="loginLogs" stripe>
        <el-table-column prop="loginTime" label="登录时间" width="180" />
        <el-table-column prop="device" label="设备" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '成功' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="loginLogsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserInfo, updateUserProfile, changePassword as changePasswordApi } from '@/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const activeMenu = ref('profile')
const profileFormRef = ref()
const passwordFormRef = ref()
const notificationFormRef = ref()

const profileForm = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  department: '',
  roleName: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationForm = reactive({
  todoReminder: true,
  reminderTime: '09:00',
  approvalNotice: true,
  systemNotice: true,
  notifyWays: ['站内信']
})

const profileRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const deviceDialogVisible = ref(false)
const loginLogsDialogVisible = ref(false)
const loginDevices = ref([
  { id: 1, device: 'Chrome浏览器', location: '北京市', ip: '192.168.1.100', loginTime: '2026-05-03 10:30:00', isCurrent: true },
  { id: 2, device: 'Safari浏览器', location: '上海市', ip: '192.168.1.101', loginTime: '2026-05-02 15:20:00', isCurrent: false }
])
const loginLogs = ref([
  { id: 1, loginTime: '2026-05-03 10:30:00', device: 'Chrome浏览器', location: '北京市', ip: '192.168.1.100', status: '成功' },
  { id: 2, loginTime: '2026-05-02 15:20:00', device: 'Safari浏览器', location: '上海市', ip: '192.168.1.101', status: '成功' },
  { id: 3, loginTime: '2026-05-01 09:15:00', device: 'Firefox浏览器', location: '广州市', ip: '192.168.1.102', status: '失败' },
  { id: 4, loginTime: '2026-04-30 18:45:00', device: 'Edge浏览器', location: '深圳市', ip: '192.168.1.103', status: '成功' }
])

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

const loadUserInfo = async () => {
  try {
    const data = await getUserInfo()
    if (data) {
      profileForm.username = data.username || ''
      profileForm.name = data.name || ''
      profileForm.email = data.email || ''
      profileForm.phone = data.phone || ''
      profileForm.department = data.departmentName || data.department || ''
      profileForm.roleName = data.roleName || data.role || ''
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const saveProfile = async () => {
  try {
    await profileFormRef.value?.validate()
    await updateUserProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone
    })
    ElMessage.success('个人信息保存成功')
    userStore.fetchUserInfo()
  } catch (error) {
    ElMessage.error('保存失败，请检查输入')
  }
}

const changePassword = async () => {
  try {
    await passwordFormRef.value?.validate()
    await changePasswordApi({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功，请重新登录')
    resetPasswordForm()
    userStore.logout()
    window.location.href = '/login'
  } catch (error) {
    ElMessage.error('密码修改失败')
  }
}

const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const saveNotification = async () => {
  try {
    ElMessage.success('通知设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const showDeviceManagement = () => {
  deviceDialogVisible.value = true
}

const showLoginLogs = () => {
  loginLogsDialogVisible.value = true
}

const showOperationLogs = () => {
  ElMessage.info('操作日志功能开发中')
}

const logoutDevice = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要让该设备下线吗？', '设备下线', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loginDevices.value = loginDevices.value.filter(d => d.id !== row.id)
    ElMessage.success('设备已下线')
  } catch (error) {
    // 取消操作
  }
}

const logoutAllDevices = async () => {
  try {
    await ElMessageBox.confirm('确定要让所有设备下线吗？', '全部下线', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loginDevices.value = loginDevices.value.filter(d => d.isCurrent)
    ElMessage.success('已下线所有其他设备')
  } catch (error) {
    // 取消操作
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.settings-container {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.page-title i {
  font-size: 24px;
  color: #667eea;
}

.settings-content {
  display: flex;
  gap: 24px;
}

.settings-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.settings-sidebar .el-menu {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.settings-sidebar .el-menu-item {
  height: 50px;
  line-height: 50px;
  color: #1e293b !important;
  font-weight: 500;
  font-size: 15px;
}

.settings-sidebar .el-menu-item:hover {
  background-color: #f8fafc !important;
  color: #1e293b !important;
}

.settings-sidebar .el-menu-item.is-active {
  background-color: #165dff !important;
  color: #ffffff !important;
  font-weight: 600;
}

.settings-main {
  flex: 1;
}

.settings-card {
  border-radius: 12px;
}

.settings-card :deep(.el-card__header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.security-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.security-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.security-info p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.pagination-wrap {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #1e293b;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f8fafc;
  color: #64748b;
}
</style>
