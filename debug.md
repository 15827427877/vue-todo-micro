# 前端与后端联调问题分析

## 问题现象
- 前端请求 `http://localhost:3001/todo/list` 被重定向到 `http://localhost:8090/login`
- 重定向响应没有CORS头，导致浏览器拦截

## 配置检查

### 前端Vite代理配置
```javascript
proxy: {
  '/system': {
    target: 'http://localhost:8081',
    changeOrigin: true
  },
  '/todo': {
    target: 'http://localhost:8081',
    changeOrigin: true
  }
}
```

### 前端API调用
- 待办服务: `todoService.get('/todo/list', { params })`
- 系统服务: `service.get('/system/api/users')`

### 后端网关配置
- `http://localhost:8081/todo/**` → `http://localhost:8090/todo/**`
- `http://localhost:8081/system/**` → `http://localhost:8091/**`

## 可能的问题

### 1. 待办服务JWT验证配置
- 待办服务可能没有正确配置JWT验证
- 或JWT密钥与系统服务不一致

### 2. 待办服务CORS配置
- 待办服务的CORS配置可能没有包含 `http://localhost:3001`
- 或重定向响应没有CORS头

### 3. 网关路由配置
- 网关可能没有正确路由 `/todo` 路径到待办服务

## 建议检查

1. **待办服务JWT配置**
   - 检查 `JwtUtils.java` 中的密钥配置
   - 确保与系统服务使用相同的密钥
   - 检查 `SecurityConfig.java` 中的JWT过滤器配置

2. **待办服务CORS配置**
   - 检查是否添加了CORS过滤器
   - 确保允许 `http://localhost:3001` 跨域访问
   - 确保重定向响应也包含CORS头

3. **网关路由配置**
   - 验证网关的路由规则是否正确
   - 确保 `/todo` 路径被正确路由到待办服务

4. **测试验证**
   - 使用Postman测试 `http://localhost:8081/todo/list`
   - 检查是否返回401或重定向
   - 测试携带正确的JWT令牌

## 临时解决方案

如果网关配置正确，前端可以直接通过网关访问：

```javascript
// 前端API基础路径
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 待办服务API调用
export const fetchTodos = (params?: TodoQueryParams) =>
  service.get('/todo/list', { params })
```

这样可以绕过Vite代理，直接访问后端网关。