# 创世者编辑器 - 飞书菜单集成方案

## 架构概览

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   飞书客户端     │────▶│   OpenClaw       │────▶│  桌面版编辑器    │
│  点击菜单按钮    │     │  处理菜单事件      │     │ HTTP服务器:18790 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                             │
                                                             ▼
                                                      ┌─────────────┐
                                                      │  弹出/聚焦窗口 │
                                                      └─────────────┘
```

## 文件结构

```
novel-editor/
├── desktop/                    # 桌面版编辑器
│   ├── package.json           # Electron包配置
│   ├── main.js                # 主进程（含HTTP服务）
│   └── index.html             # 渲染进程界面
│
├── data/                       # 数据文件
│   ├── characters.json
│   └── names.json
│
├── launcher.html              # 网页版启动器
├── creator.py                 # Python启动脚本
├── integration-plan.md        # 方案分析报告
└── openclaw-config.md         # OpenClaw配置说明
```

## 快速开始

### 1. 安装依赖
```bash
cd desktop
npm install
```

### 2. 启动桌面版
```bash
cd ~/.openclaw/workspace/novel-editor
python creator.py
```

### 3. 测试菜单触发
在飞书中点击机器人菜单「启动创世者」，桌面版应自动弹出。

## 通信协议

### 启动请求
```http
POST http://127.0.0.1:18790/api/open
Content-Type: application/json

{
  "action": "open_creator",
  "timestamp": 1712651234567
}
```

### 响应
```json
{
  "success": true,
  "message": "Window opened",
  "timestamp": 1712651234567
}
```

### 健康检查
```http
GET http://127.0.0.1:18790/health
```

## 方案选择理由

选择**方案A（HTTP监听）**的原因：

1. **简单可靠** - HTTP是最稳定的本地通信方式
2. **快速响应** - 一键直达，无中间环节
3. **易于维护** - 代码量少，调试方便
4. **无外部依赖** - 不依赖浏览器、系统scheme等

## 特性

- ✅ 单实例控制 - 防止多开
- ✅ 自动唤醒 - 已有实例时直接聚焦
- ✅ 优雅降级 - 桌面版未运行时提示启动命令
- ✅ 健康检查 - 可检测服务状态
- ✅ 跨平台 - 支持Windows/macOS/Linux

## 配置

默认端口：**18790**

如需修改，同时编辑：
- `desktop/main.js` 中的 `CONFIG.httpPort`
- `event-handlers.js` 中的 `CREATOR_HTTP_PORT`

## 技术栈

- **桌面框架**: Electron 28
- **通信协议**: HTTP/1.1
- **数据格式**: JSON
- **启动脚本**: Python 3

## 相关文档

- [方案分析报告](./integration-plan.md)
- [OpenClaw配置说明](./openclaw-config.md)
# 触发重建 Sat Apr 11 12:42:11 AM CST 2026
