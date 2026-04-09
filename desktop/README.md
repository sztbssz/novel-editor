# 创世者 - 小说编辑器

桌面版小说编辑器，支持本地存储和云同步。

## 功能特性

- **角色管理**：创建、编辑、管理小说角色
- **世界观设定**：组织化的世界设定管理
- **情节大纲**：分卷、分章节的大纲编写
- **云同步**：支持 GitHub/Gitee 自动同步
- **冲突检测**：多设备编辑冲突检测与解决

## 安装

1. 确保已安装 Python 3.8+
2. 安装依赖：
```bash
pip install -r requirements.txt
```

## 运行

```bash
python main.py
```

## 数据存储

- 本地数据存储在用户目录下的 `.novel_editor/novel.db`
- 云同步数据以 JSON 格式存储在配置的仓库中

## 云同步配置

### GitHub 配置
1. 生成 Personal Access Token（需要 repo 权限）
2. 创建一个私有仓库
3. 在应用设置中填入 Token 和仓库名（格式：用户名/仓库名）

### Gitee 配置
1. 生成私人令牌（需要 projects 权限）
2. 创建私有仓库
3. 在应用设置中填入 Token 和仓库名

## 项目结构

```
desktop/
├── main.py              # 主程序入口
├── database.py          # SQLite 数据库操作
├── sync.py              # 云同步模块
├── requirements.txt     # 依赖列表
├── ui/                  # 界面模块
│   ├── __init__.py
│   ├── character_view.py      # 角色管理界面
│   ├── world_view.py          # 世界观界面
│   ├── plot_view.py           # 情节大纲界面
│   └── sync_settings_view.py  # 同步设置界面
└── README.md
```

## 技术栈

- Python 3
- tkinter（GUI）
- sqlite3（本地存储）
- requests（GitHub/Gitee API）
