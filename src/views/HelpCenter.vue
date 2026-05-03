<template>
  <div class="help-container">
    <div class="page-header">
      <h2 class="page-title">
        <i class="el-icon-question"></i>
        帮助文档
      </h2>
      <p class="page-desc">这里是系统的使用指南，帮助您快速上手使用本系统</p>
    </div>

    <div class="help-content">
      <div class="help-sidebar">
        <el-card class="catalog-card">
          <template #header>
            <div class="catalog-header">
              <i class="el-icon-menu"></i>
              <span>目录导航</span>
            </div>
          </template>
          <div class="catalog-list">
            <div 
              v-for="item in catalogItems" 
              :key="item.id"
              :class="['catalog-item', { active: activeSection === item.id }]"
              @click="scrollToSection(item.id)"
            >
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <div class="help-main">
        <el-card id="intro" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-info"></i>
              <span>系统简介</span>
            </div>
          </template>
          <div class="section-content">
            <p>欢迎使用政务待办管理系统！本系统是一套高效、便捷的政务办公辅助工具，旨在帮助政府机构和企业实现待办事项的精细化管理。</p>
            <el-divider />
            <h4>主要功能模块：</h4>
            <ul>
              <li><strong>待办管理</strong>：创建、编辑、分配和跟踪待办事项</li>
              <li><strong>审批中心</strong>：处理各类审批申请，如请假、报销、加急等</li>
              <li><strong>用户管理</strong>：管理系统用户、角色和权限</li>
              <li><strong>部门管理</strong>：维护组织架构和部门信息</li>
              <li><strong>查询统计</strong>：查看工作进度和统计分析</li>
            </ul>
          </div>
        </el-card>

        <el-card id="quickstart" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-guide"></i>
              <span>快速入门</span>
            </div>
          </template>
          <div class="section-content">
            <el-steps :active="currentStep" finish-status="success" align-center>
              <el-step title="登录系统" description="使用账号密码登录" />
              <el-step title="完善个人信息" description="在系统设置中补充信息" />
              <el-step title="创建待办" description="开始您的工作任务" />
              <el-step title="处理审批" description="完成各项审批流程" />
            </el-steps>
            
            <el-divider />
            
            <h4>登录说明</h4>
            <p>1. 在登录页面输入您的用户名和密码</p>
            <p>2. 点击"登录"按钮进入系统</p>
            <p>3. 首次登录后建议前往"系统设置"完善个人信息</p>
            
            <div class="tip-box">
              <i class="el-icon-warning"></i>
              <span>提示：如果忘记密码，请联系系统管理员进行重置</span>
            </div>
          </div>
        </el-card>

        <el-card id="todo" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-document-copy"></i>
              <span>待办管理</span>
            </div>
          </template>
          <div class="section-content">
            <h4>创建待办</h4>
            <p>1. 点击左侧菜单"待办列表"，进入待办管理页面</p>
            <p>2. 点击"新增待办"按钮</p>
            <p>3. 填写待办标题、选择负责人、设置截止日期</p>
            <p>4. 点击"保存"完成创建</p>
            
            <el-divider />
            
            <h4>编辑和删除</h4>
            <p>在待办列表中，您可以：</p>
            <ul>
              <li>点击"编辑"修改待办信息</li>
              <li>点击"删除"移除不需要的待办</li>
              <li>使用"更多操作"快速更改状态或转交任务</li>
            </ul>
            
            <el-divider />
            
            <h4>状态说明</h4>
            <div class="status-list">
              <div class="status-item">
                <el-tag type="info" size="large">待处理</el-tag>
                <span>任务尚未开始处理</span>
              </div>
              <div class="status-item">
                <el-tag type="warning" size="large">处理中</el-tag>
                <span>任务正在处理中</span>
              </div>
              <div class="status-item">
                <el-tag type="success" size="large">已完成</el-tag>
                <span>任务已完成</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card id="approval" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-s-check"></i>
              <span>审批中心</span>
            </div>
          </template>
          <div class="section-content">
            <h4>审批类型</h4>
            <ul>
              <li><strong>请假申请</strong>：员工请假、休假审批</li>
              <li><strong>报销申请</strong>：差旅费、业务费用报销</li>
              <li><strong>加班申请</strong>：加班时长登记和审批</li>
              <li><strong>出差申请</strong>：因公出差审批流程</li>
              <li><strong>采购申请</strong>：办公物资采购审批</li>
              <li><strong>其他申请</strong>：其他各类行政审批</li>
            </ul>
            
            <el-divider />
            
            <h4>审批操作</h4>
            <p>1. 在审批列表中查看待审批事项</p>
            <p>2. 点击"查看"按钮了解申请详情</p>
            <p>3. 在详情页可以"通过"或"拒绝"申请</p>
            <p>4. 可以添加审批说明以便记录</p>
            
            <div class="tip-box success">
              <i class="el-icon-circle-check"></i>
              <span>建议：在审批前仔细查看申请内容和附件，确保审批准确</span>
            </div>
          </div>
        </el-card>

        <el-card id="settings" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </div>
          </template>
          <div class="section-content">
            <h4>个人信息</h4>
            <p>在"个人信息"标签页，您可以：</p>
            <ul>
              <li>查看和修改姓名、邮箱、手机号等基本信息</li>
              <li>查看所属部门和角色信息</li>
            </ul>
            
            <el-divider />
            
            <h4>修改密码</h4>
            <p>1. 进入"修改密码"标签页</p>
            <p>2. 输入当前密码和新密码</p>
            <p>3. 确认新密码后提交</p>
            <p>4. 修改成功后需重新登录</p>
            
            <el-divider />
            
            <h4>通知设置</h4>
            <p>您可以设置是否接收以下通知：</p>
            <ul>
              <li>待办事项提醒</li>
              <li>审批结果通知</li>
              <li>系统公告推送</li>
            </ul>
            <p>选择您偏好的通知方式和提醒时间。</p>
            
            <el-divider />
            
            <h4>安全设置</h4>
            <p>在"安全设置"中，您可以：</p>
            <ul>
              <li>查看当前登录设备列表</li>
              <li>强制下线可疑设备</li>
              <li>查看登录日志了解账号安全状况</li>
            </ul>
          </div>
        </el-card>

        <el-card id="faq" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-chat-line-round"></i>
              <span>常见问题</span>
            </div>
          </template>
          <div class="section-content">
            <el-collapse v-model="activeFaq">
              <el-collapse-item title="无法登录系统怎么办？" name="faq1">
                <div>请检查以下几点：</div>
                <ol>
                  <li>确认用户名和密码输入正确</li>
                  <li>检查是否按下了Caps Lock键</li>
                  <li>联系管理员确认账号状态是否正常</li>
                </ol>
              </el-collapse-item>
              <el-collapse-item title="为什么看不到某些菜单？" name="faq2">
                <div>系统根据您的角色分配功能权限。如果某个菜单不可见，说明您的账号可能没有该功能的访问权限。如需开通，请联系系统管理员。</div>
              </el-collapse-item>
              <el-collapse-item title="待办状态无法修改？" name="faq3">
                <div>只有待办的负责人或管理员才能修改待办状态。如果您不是负责人，请联系待办创建者或管理员。</div>
              </el-collapse-item>
              <el-collapse-item title="审批被拒绝后可以重新申请吗？" name="faq4">
                <div>可以。您可以查看拒绝原因，修改申请内容后重新提交审批。</div>
              </el-collapse-item>
              <el-collapse-item title="如何联系技术支持？" name="faq5">
                <div>您可以通过以下方式联系我们：</div>
                <ul>
                  <li>电话：010-12345678</li>
                  <li>邮箱：support@example.com</li>
                  <li>工作时间：周一至周五 9:00-18:00</li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>

        <el-card id="contact" class="help-section">
          <template #header>
            <div class="section-header">
              <i class="el-icon-phone"></i>
              <span>联系我们</span>
            </div>
          </template>
          <div class="section-content">
            <p>如果您在使用过程中遇到任何问题，欢迎通过以下方式联系我们：</p>
            
            <div class="contact-list">
              <div class="contact-item">
                <i class="el-icon-user"></i>
                <div>
                  <h4>技术支持</h4>
                  <p>电话：010-12345678</p>
                  <p>邮箱：support@example.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="el-icon-office-building"></i>
                <div>
                  <h4>商务合作</h4>
                  <p>电话：010-87654321</p>
                  <p>邮箱：business@example.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="el-icon-clock"></i>
                <div>
                  <h4>服务时间</h4>
                  <p>周一至周五：9:00 - 18:00</p>
                  <p>节假日除外</p>
                </div>
              </div>
            </div>
            
            <div class="version-info">
              <el-tag>系统版本：v1.0.0</el-tag>
              <el-tag type="info">最后更新：2026-05-03</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeSection = ref('intro')
const activeFaq = ref(['faq1'])
const currentStep = ref(0)

const catalogItems = [
  { id: 'intro', title: '系统简介', icon: 'el-icon-info' },
  { id: 'quickstart', title: '快速入门', icon: 'el-icon-guide' },
  { id: 'todo', title: '待办管理', icon: 'el-icon-document-copy' },
  { id: 'approval', title: '审批中心', icon: 'el-icon-s-check' },
  { id: 'settings', title: '系统设置', icon: 'el-icon-setting' },
  { id: 'faq', title: '常见问题', icon: 'el-icon-chat-line-round' },
  { id: 'contact', title: '联系我们', icon: 'el-icon-phone' }
]

const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.2 }
  )

  catalogItems.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) {
      observer.observe(element)
    }
  })
})
</script>

<style scoped>
.help-container {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.page-title i {
  font-size: 26px;
  color: #667eea;
}

.page-desc {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.help-content {
  display: flex;
  gap: 24px;
}

.help-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  height: fit-content;
}

.catalog-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.catalog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.catalog-header i {
  color: #667eea;
}

.catalog-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.catalog-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  font-size: 14px;
}

.catalog-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.catalog-item.active {
  background: #eef2ff;
  color: #165dff;
  font-weight: 600;
}

.catalog-item i {
  font-size: 16px;
}

.help-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.help-section {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.section-header i {
  font-size: 20px;
  color: #667eea;
}

.section-content {
  color: #1e293b;
  line-height: 1.8;
  font-size: 14px;
}

.section-content h4 {
  color: #1e293b;
  font-size: 15px;
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.section-content p {
  margin: 8px 0;
  color: #1e293b;
}

.section-content ul,
.section-content ol {
  margin: 8px 0;
  padding-left: 24px;
  color: #1e293b;
}

.section-content li {
  margin: 6px 0;
}

.tip-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef3c7;
  border-radius: 8px;
  color: #92400e;
  margin-top: 16px;
}

.tip-box.success {
  background: #d1fae5;
  color: #065f46;
}

.tip-box i {
  font-size: 18px;
}

.status-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.contact-item i {
  font-size: 28px;
  color: #667eea;
  margin-top: 4px;
}

.contact-item h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
}

.contact-item p {
  margin: 4px 0;
  color: #64748b;
  font-size: 13px;
}

.version-info {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

:deep(.el-card__header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-divider) {
  margin: 20px 0;
}

:deep(.el-steps) {
  margin: 20px 0;
}

:deep(.el-collapse-item__header) {
  font-weight: 600;
  color: #1e293b;
}

:deep(.el-collapse-item__content) {
  color: #64748b;
  line-height: 1.8;
}
</style>
