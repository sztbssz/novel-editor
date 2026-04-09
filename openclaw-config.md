# OpenClaw侧配置说明

## 概述

已完成小说编辑器与飞书菜单的集成方案，采用**HTTP监听方案（方案A）**实现。

## 已实现功能

### 1. 桌面版（desktop/）
- **HTTP服务器**: 监听 `127.0.0.1:18790`
- **API端点**: `POST /api/open` - 接收启动请求
- **健康检查**: `GET /health` - 检查服务状态
- **单实例控制**: 防止多开，自动唤醒已有实例

### 2. OpenClaw飞书插件修改
**文件**: `/root/.openclaw/extensions/openclaw-lark/src/channel/event-handlers.js`

修改了 `handleMenuEvent` 函数，使其：
1. 收到菜单事件后，先尝试HTTP连接到桌面版
2. 如果桌面版运行中，发送唤醒请求并回复用户「已唤醒」
3. 如果桌面版未运行，回复用户启动命令

## 启动方式

### 方式一：Python启动器（推荐）
```bash
cd ~/.openclaw/workspace/novel-editor && python creator.py
```

### 方式二：直接运行Electron
```bash
cd ~/.openclaw/workspace/novel-editor/desktop
npm install  # 首次运行前安装依赖
electron .
```

## 用户交互流程

```
用户点击飞书菜单「启动创世者」
          │
          ▼
OpenClaw收到菜单事件
          │
          ▼
尝试HTTP POST到 127.0.0.1:18790/api/open
          │
    ┌─────┴─────┐
    │           │
  成功         失败
    │           │
    ▼           ▼
桌面版弹出   回复启动命令
    │
    ▼
回复「已唤醒」
```

## 端口配置

默认端口为 **18790**，如需修改：

### 桌面版侧
编辑 `desktop/main.js`:
```javascript
const CONFIG = {
  httpPort: 18790,  // 修改此处
  // ...
};
```

### OpenClaw侧
编辑 `event-handlers.js`，修改 `CREATOR_HTTP_PORT` 常量：
```javascript
const CREATOR_HTTP_PORT = 18790;  // 修改此处
```

## 测试验证

### 1. 启动桌面版
```bash
cd ~/.openclaw/workspace/novel-editor && python creator.py
```

### 2. 健康检查
```bash
curl http://127.0.0.1:18790/health
```
预期响应：
```json
{"status":"ok","service":"novel-editor-creator","version":"1.0.0"}
```

### 3. 模拟菜单触发
```bash
curl -X POST http://127.0.0.1:18790/api/open \
  -H "Content-Type: application/json" \
  -d '{"action":"open_creator","timestamp":1712651234567}'
```
预期响应：
```json
{"success":true,"message":"Window opened","timestamp":1712651234567}
```

## 依赖安装

### 首次使用
```bash
cd ~/.openclaw/workspace/novel-editor/desktop

# 安装Electron
npm install

# 或全局安装
cd ~/.openclaw/workspace/novel-editor
electron-builder
```

## 故障排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 端口被占用 | 18790被其他程序占用 | 修改端口配置 |
| 连接超时 | 桌面版未运行 | 先启动桌面版 |
| Electron未找到 | 未安装依赖 | 运行 `npm install` |
| 窗口未弹出 | 桌面版被最小化 | 检查任务栏/托盘 |

## 扩展建议

1. **配置文件**: 可将端口等配置提取到 `config.json`
2. **托盘模式**: 关闭窗口时最小化到托盘，保持HTTP服务
3. **开机自启**: 添加桌面版到系统启动项
4. **日志记录**: 添加文件日志便于排查问题
