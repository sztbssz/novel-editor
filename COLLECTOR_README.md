# 网文桥段自动采集系统

## 系统概述

自动每日采集网文桥段，更新桥段数据库，支持智能去重和分类管理。

## 文件说明

```
novel-editor/
├── collect_tropes.py      # 主采集脚本
├── dedup.py               # 去重模块
├── update_data.py         # 数据更新模块
├── search_adapter.py      # 搜索适配器（需配置API）
├── cron_config            # 定时任务配置
├── view_logs.sh           # 日志查看脚本
├── data.json              # 桥段数据库
├── trope_hashes.json      # 去重哈希表（自动生成）
└── trope_collection.log   # 采集日志（自动生成）
```

## 快速开始

### 1. 初始化去重哈希表

```bash
cd /root/.openclaw/workspace/novel-editor
python3 dedup.py --rebuild
```

### 2. 手动测试采集

```bash
python3 collect_tropes.py
```

### 3. 安装定时任务

```bash
# 编辑 crontab
crontab -e

# 粘贴 cron_config 文件中的内容
# 保存退出
```

或者使用命令行安装：

```bash
(crontab -l 2>/dev/null; echo "0 3 * * * cd /root/.openclaw/workspace/novel-editor && /usr/bin/python3 collect_tropes.py >> /root/.openclaw/workspace/novel-editor/cron.log 2>&1") | crontab -
```

### 4. 查看日志

```bash
# 查看今日采集
./view_logs.sh -t

# 查看统计
./view_logs.sh -s

# 查看错误
./view_logs.sh -e

# 实时跟踪
./view_logs.sh -f
```

## 配置说明

### 搜索API配置

编辑 `search_adapter.py`，配置真实的搜索API：

1. **百度搜索API**
   - 申请地址：https://cloud.baidu.com/
   - 配置 API Key 和 Secret Key

2. **微博搜索API**
   - 申请地址：https://open.weibo.com/
   - 配置 Access Token

### 采集关键词配置

编辑 `collect_tropes.py` 中的 `SEARCH_KEYWORDS`，添加更多搜索关键词：

```python
SEARCH_KEYWORDS = {
    "xuanhuan": {
        "name": "玄幻",
        "keywords": [
            "你的关键词1",
            "你的关键词2",
        ]
    }
}
```

## 定时任务管理

### 查看当前定时任务

```bash
crontab -l
```

### 停止定时任务

```bash
# 删除所有定时任务
crontab -r

# 或编辑删除特定任务
crontab -e
```

### 修改执行时间

编辑 `cron_config`，修改时间后重新安装：

```bash
# 格式: 分钟 小时 * * * 命令
# 每天凌晨3点执行
0 3 * * * cd /root/.openclaw/workspace/novel-editor && /usr/bin/python3 collect_tropes.py

# 每天上午10点执行
0 10 * * * cd /root/.openclaw/workspace/novel-editor && /usr/bin/python3 collect_tropes.py
```

## 数据结构

### 桥段数据格式

```json
{
  "id": "唯一标识",
  "title": "桥段标题",
  "content": "桥段内容",
  "category": "分类ID",
  "subType": "子类型",
  "source": "来源",
  "tags": ["标签1", "标签2"],
  "createdAt": "2026-04-10"
}
```

### 分类映射

| 分类ID | 名称 |
|--------|------|
| xuanhuan | 玄幻 |
| xianxia | 仙侠 |
| dushi | 都市 |
| kehuan | 科幻 |
| lishi | 历史 |
| xuanyi | 悬疑 |
| chuanshu | 重生/穿越/穿书/快穿 |
| tongyong | 全网文通用 |

## 故障排查

### 采集没有执行

1. 检查 crontab 是否正确安装：`crontab -l`
2. 检查 Python 路径：`which python3`
3. 检查日志文件权限：`ls -la *.log`

### 没有新桥段

1. 检查搜索API是否配置
2. 查看去重哈希表：`python3 dedup.py`
3. 降低相似度阈值（编辑 dedup.py 中的 `similarity_threshold`）

### 数据损坏

1. 从 GitHub 恢复 data.json
2. 重建哈希表：`python3 dedup.py --rebuild`

## 更新日志

- 2026-04-10: 初始版本发布
  - 支持8大类网文桥段采集
  - 智能去重机制
  - 定时自动更新
