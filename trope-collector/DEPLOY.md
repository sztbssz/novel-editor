# 网文桥段素材库 - 部署指南

## 系统架构

```
前端 (GitHub Pages)
    ↓ HTTP请求
后端 API (Render/Railway/本地)
    ↓ SQLite
数据库文件
```

## 方案一：Render部署（推荐，免费）

### 1. 注册Render账号
- 访问 https://render.com
- 使用GitHub账号登录

### 2. 创建Web Service
1. 点击 "New +" → "Web Service"
2. 选择 GitHub 仓库 `sztbssz/novel-editor`
3. 配置：
   - **Name**: `trope-collector-api`
   - **Environment**: `Node`
   - **Build Command**: `cd trope-collector && npm install`
   - **Start Command**: `cd trope-collector && npm start`
   - **Plan**: Free

4. 点击 "Create Web Service"

### 3. 获取API地址
部署完成后，Render会提供一个URL：
```
https://trope-collector-api.onrender.com
```

### 4. 配置前端连接API
访问前端页面后，在浏览器控制台执行：
```javascript
localStorage.setItem('api_base_url', 'https://trope-collector-api.onrender.com');
location.reload();
```

## 方案二：Railway部署

1. 访问 https://railway.app
2. 从GitHub导入项目
3. 添加变量 `NIXPACKS_NODE_VERSION=18`
4. 设置启动命令：`cd trope-collector && npm start`
5. 部署后获取域名

## 方案三：本地运行（开发/测试）

### 前提条件
- Node.js 16+ 已安装

### 安装依赖
```bash
cd trope-collector
npm install
```

### 启动服务器
```bash
npm start
```

默认运行在 http://localhost:3000

### 前端连接本地API
```javascript
localStorage.setItem('api_base_url', 'http://localhost:3000');
location.reload();
```

## API接口文档

### 分类管理
```
GET  /api/categories     # 获取所有分类
```

### 桥段管理
```
GET    /api/tropes              # 获取桥段列表
GET    /api/tropes?category=identity          # 按大分类筛选
GET    /api/tropes?sub_type=扮猪吃老虎        # 按子类型筛选
GET    /api/tropes?search=关键词               # 搜索

GET    /api/tropes/:id          # 获取单个桥段
POST   /api/tropes              # 创建桥段
PUT    /api/tropes/:id          # 更新桥段
DELETE /api/tropes/:id          # 删除桥段（仅用户添加的）
POST   /api/tropes/:id/use      # 增加使用次数
```

### 统计信息
```
GET /api/stats        # 获取统计数据
GET /api/health       # 健康检查
```

## 数据初始化

后端启动时会自动检查数据库：
- 如果数据库为空，自动从 `data.json` 导入30个预置桥段
- 后续用户添加的桥段会持久化到 SQLite 数据库

## 目录结构

```
trope-collector/
├── data.json          # 初始数据（30个桥段）
├── server.js          # Express后端
├── package.json       # 依赖配置
├── render.yaml        # Render部署配置
├── index.html         # 前端页面
└── app.js             # 前端逻辑
```

## 技术栈

- **后端**: Node.js + Express + SQLite3
- **前端**: 纯HTML/CSS/JS (无框架)
- **部署**: Render / Railway / 本地

## 注意事项

1. **免费 tier 限制**: Render免费版会在15分钟无活动后休眠，首次访问可能需要等待10-30秒唤醒
2. **数据库**: SQLite文件存储在服务器磁盘，重启后会保留（Render有临时文件限制，建议定期备份）
3. **跨域**: 后端已配置CORS，支持任何前端域名访问

## 备份数据

定期导出数据库：
```bash
# 在服务器上执行
cp trope-collector/tropes.db tropes.db.backup.$(date +%Y%m%d)
```

## 故障排查

### 前端无法连接API
1. 检查 `localStorage.getItem('api_base_url')` 是否设置正确
2. 浏览器F12查看Network请求是否被CORS阻止
3. 确认后端服务已启动

### 数据库初始化失败
1. 检查 `data.json` 是否存在且格式正确
2. 查看服务器日志是否有权限错误

### Render部署失败
1. 确认Build Command和Start Command路径正确
2. 检查Node版本是否为16+
