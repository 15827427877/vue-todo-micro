<template>
  <div class="approval-container">
    <div class="page-toolbar">
      <div class="page-title">
        <i class="el-icon-s-check"></i>
        <span>审批中心</span>
      </div>
      <div class="toolbar-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索审批标题..."
          clearable
          style="width: 280px; margin-right: 12px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <i class="el-icon-search"></i>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="审批状态" clearable style="width: 140px; margin-right: 12px" @change="handleStatusChange">
          <el-option label="全部" value="" />
          <el-option label="待审批" value="待审批" />
          <el-option label="已通过" value="已通过" />
          <el-option label="已拒绝" value="已拒绝" />
        </el-select>
        <el-select v-model="typeFilter" placeholder="审批类型" clearable style="width: 140px" @change="handleTypeChange">
          <el-option label="全部类型" value="" />
          <el-option label="请假申请" value="请假申请" />
          <el-option label="报销申请" value="报销申请" />
          <el-option label="加班申请" value="加班申请" />
          <el-option label="出差申请" value="出差申请" />
          <el-option label="采购申请" value="采购申请" />
          <el-option label="其他申请" value="其他申请" />
        </el-select>
      </div>
    </div>

    <base-table :data="paginatedApprovals" :loading="isLoading">
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="title" label="审批标题" min-width="200">
        <template #default="{ row }">
          <div class="approval-title">
            <span class="title-text">{{ row.title }}</span>
            <el-tag :type="getTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人" width="120" />
      <el-table-column prop="department" label="所属部门" width="140" />
      <el-table-column prop="createTime" label="申请时间" width="180" />
      <el-table-column prop="status" label="审批状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button link size="small" class="action-btn-view" @click="viewDetail(row)">查看</el-button>
            <el-button v-if="row.status === '待审批'" type="success" size="small" class="action-btn-pass" @click="handleRowApprove(row)">通过</el-button>
            <el-button v-if="row.status === '待审批'" type="danger" size="small" class="action-btn-reject" @click="handleRowReject(row)">拒绝</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>

    <div class="pagination-wrap">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :current-page="currentPage"
        prev-text="上一页"
        next-text="下一页"
        total-text="共"
        page-size-text="条/页"
        jumper-text="前往"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
      <div class="pagination-info">
        当前第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
      </div>
    </div>

    <el-dialog title="审批详情" v-model="detailVisible" width="640px">
      <div v-if="currentApproval" class="approval-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="编号">{{ currentApproval.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="getTypeTag(currentApproval.type)" size="small">{{ currentApproval.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="标题" :span="2">{{ currentApproval.title }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentApproval.applicant }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ currentApproval.department }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ currentApproval.createTime }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="getStatusTag(currentApproval.status)">{{ currentApproval.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审批人">{{ currentApproval.approver || '待分配' }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>申请内容</h4>
          <div class="detail-content" v-html="currentApproval.content"></div>
        </div>

        <div v-if="currentApproval.attachments && currentApproval.attachments.length > 0" class="detail-section">
          <h4>附件</h4>
          <div class="attachment-list">
            <div v-for="(file, index) in currentApproval.attachments" :key="index" class="attachment-item">
              <i class="el-icon-document"></i>
              <span>{{ file.name }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentApproval.status !== '待审批'" class="detail-section">
          <h4>审批意见</h4>
          <div class="approval-opinion">
            <div class="opinion-item">
              <span class="opinion-label">审批结果：</span>
              <el-tag :type="getStatusTag(currentApproval.status)">{{ currentApproval.status }}</el-tag>
            </div>
            <div class="opinion-item">
              <span class="opinion-label">审批人：</span>
              <span>{{ currentApproval.approver }}</span>
            </div>
            <div class="opinion-item">
              <span class="opinion-label">审批时间：</span>
              <span>{{ currentApproval.approveTime }}</span>
            </div>
            <div v-if="currentApproval.comment" class="opinion-item">
              <span class="opinion-label">审批说明：</span>
              <span>{{ currentApproval.comment }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="detail-footer">
          <el-input
            v-if="currentApproval && currentApproval.status === '待审批'"
            v-model="quickComment"
            placeholder="添加审批说明（可选）"
            style="flex: 1; margin-right: 12px"
          />
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button v-if="currentApproval && currentApproval.status === '待审批'" @click="handleQuickReject">拒绝</el-button>
          <el-button v-if="currentApproval && currentApproval.status === '待审批'" type="primary" @click="handleQuickApprove">通过</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="审批操作" v-model="approveVisible" width="480px">
      <el-form ref="approveFormRef" :model="approveForm" label-width="80px">
        <el-form-item label="审批结果">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="已通过">通过</el-radio>
            <el-radio label="已拒绝">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批说明">
          <el-input
            v-model="approveForm.comment"
            type="textarea"
            rows="4"
            placeholder="请输入审批说明（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApproval">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '@/components/BaseTable.vue'
import { fetchApprovalList, getApprovalDetail, submitApproval as submitApprovalApi } from '@/api'

interface ApprovalItem {
  id: number
  title: string
  type: string
  applicant: string
  department: string
  createTime: string
  status: string
  approver?: string
  approveTime?: string
  content: string
  comment?: string
  attachments?: { name: string; url: string }[]
}

const approvals = ref<ApprovalItem[]>([])
const isLoading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const detailVisible = ref(false)
const approveVisible = ref(false)
const currentApproval = ref<ApprovalItem | null>(null)
const approveFormRef = ref()
const approveForm = reactive({
  result: '已通过',
  comment: ''
})

const quickComment = ref('')

const filteredApprovals = computed(() => {
  let result = approvals.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.applicant.toLowerCase().includes(keyword)
    )
  }

  if (statusFilter.value) {
    result = result.filter(item => item.status === statusFilter.value)
  }

  if (typeFilter.value) {
    result = result.filter(item => item.type === typeFilter.value)
  }

  return result
})

const paginatedApprovals = computed(() => {
  total.value = filteredApprovals.value.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredApprovals.value.slice(start, end)
})

const loadApprovals = async () => {
  isLoading.value = true
  try {
    const data = await fetchApprovalList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value,
      type: typeFilter.value
    })
    approvals.value = data?.list || []
    total.value = data?.total || 0
  } catch (error) {
    ElMessage.error('加载审批列表失败')
  } finally {
    isLoading.value = false
  }
}

const getStatusTag = (status: string) => {
  if (status === '已通过') return 'success'
  if (status === '已拒绝') return 'danger'
  return 'warning'
}

const getTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '请假申请': 'danger',
    '报销申请': 'success',
    '加班申请': 'warning',
    '出差申请': 'primary',
    '采购申请': 'info',
    '其他申请': ''
  }
  return typeMap[type] || ''
}

const viewDetail = async (row: ApprovalItem) => {
  try {
    const data = await getApprovalDetail(row.id)
    currentApproval.value = data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('加载审批详情失败')
  }
}

const handleRowApprove = async (row: ApprovalItem) => {
  try {
    await ElMessageBox.confirm(`确定要通过"${row.title}"的审批吗？`, '确认通过', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })
    await submitApprovalApi(row.id, {
      result: '已通过',
      comment: ''
    })
    ElMessage.success('审批通过成功')
    loadApprovals()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审批提交失败')
    }
  }
}

const handleRowReject = async (row: ApprovalItem) => {
  try {
    await ElMessageBox.confirm(`确定要拒绝"${row.title}"的审批吗？`, '确认拒绝', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await submitApprovalApi(row.id, {
      result: '已拒绝',
      comment: ''
    })
    ElMessage.success('审批拒绝成功')
    loadApprovals()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审批提交失败')
    }
  }
}

const handleApprove = (row: ApprovalItem) => {
  currentApproval.value = row
  approveForm.result = '已通过'
  approveForm.comment = ''
  approveVisible.value = true
}

const handleQuickApprove = async () => {
  if (!currentApproval.value) return
  
  try {
    await submitApprovalApi(currentApproval.value.id, {
      result: '已通过',
      comment: quickComment.value
    })
    ElMessage.success('审批通过成功')
    detailVisible.value = false
    quickComment.value = ''
    loadApprovals()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审批提交失败')
    }
  }
}

const handleReject = () => {
  approveForm.result = '已拒绝'
  approveForm.comment = ''
  approveVisible.value = true
}

const handleQuickReject = async () => {
  if (!currentApproval.value) return
  
  try {
    await submitApprovalApi(currentApproval.value.id, {
      result: '已拒绝',
      comment: quickComment.value
    })
    ElMessage.success('审批拒绝成功')
    detailVisible.value = false
    quickComment.value = ''
    loadApprovals()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审批提交失败')
    }
  }
}

const handleApproveConfirm = () => {
  approveForm.result = '已通过'
  approveForm.comment = ''
  approveVisible.value = true
}

const submitApproval = async () => {
  if (!currentApproval.value) return

  try {
    await submitApprovalApi(currentApproval.value.id, {
      result: approveForm.result,
      comment: approveForm.comment
    })
    ElMessage.success(`审批${approveForm.result === '已通过' ? '通过' : '已拒绝'}成功`)
    approveVisible.value = false
    detailVisible.value = false
    loadApprovals()
  } catch (error) {
    ElMessage.error('审批提交失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadApprovals()
}

const handleStatusChange = () => {
  currentPage.value = 1
  loadApprovals()
}

const handleTypeChange = () => {
  currentPage.value = 1
  loadApprovals()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadApprovals()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadApprovals()
}

onMounted(() => {
  loadApprovals()
})
</script>

<style scoped>
.approval-container {
  padding: 0;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.page-title i {
  font-size: 22px;
  color: #667eea;
}

.toolbar-actions {
  display: flex;
  align-items: center;
}

.approval-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons .el-button {
  padding: 6px 12px;
}

/* 操作按钮颜色 */
.action-btn-view {
  color: var(--gov-primary) !important;
}

.action-btn-view:hover {
  color: var(--gov-primary-light) !important;
}

.action-btn-pass {
  background-color: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
}

.action-btn-pass:hover {
  background-color: #059669 !important;
  border-color: #059669 !important;
}

.action-btn-reject {
  background-color: #ef4444 !important;
  border-color: #ef4444 !important;
  color: white !important;
}

.action-btn-reject:hover {
  background-color: #dc2626 !important;
  border-color: #dc2626 !important;
}

.approval-detail {
  padding: 8px 0;
}

.detail-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.detail-content {
  color: #64748b;
  line-height: 1.6;
  white-space: pre-wrap;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.attachment-item:hover {
  background: #f1f5f9;
  border-color: #667eea;
}

.attachment-item i {
  color: #667eea;
}

.approval-opinion {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
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

.pagination-info {
  color: #64748b;
  font-size: 14px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8fafc !important;
  color: #1e293b !important;
  font-weight: 600;
  font-size: 14px;
}

:deep(.el-table td) {
  color: #1e293b !important;
  font-size: 14px;
}

:deep(.el-table tr) {
  transition: background-color 0.2s ease;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #f8fafc;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #f1f5f9 !important;
}

:deep(.el-table .cell) {
  line-height: 1.6;
}

/* 确保表格单元格文本颜色为深黑色 */
:deep(.el-table .cell) {
  color: #0d0c0c !important;
}

/* 确保操作栏按钮颜色与列表数据颜色一致 */
:deep(.el-table .el-button--text) {
  color: #0d0c0c !important;
}

:deep(.el-table .el-button--text:hover) {
  color: #165dff !important;
}

:deep(.el-table__header th) {
  font-weight: 600 !important;
}

:deep(.el-table__row:hover > td) {
  background-color: #f1f5f9 !important;
}

.title-text {
  font-weight: 500;
  color: #1e293b;
}

.opinion-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.opinion-item:last-child {
  margin-bottom: 0;
}

.opinion-label {
  color: #64748b;
  min-width: 80px;
}

.detail-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

/* 弹窗样式优化 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: #f8fafc;
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-dialog__title) {
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #64748b;
  font-size: 20px;
}

:deep(.el-dialog__headerbtn .el-dialog__close:hover) {
  color: #1e293b;
}

:deep(.el-dialog__footer) {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
}

:deep(.el-dialog__body) {
  padding: 24px;
}
</style>
