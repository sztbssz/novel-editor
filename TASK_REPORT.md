# 云端存储重构报告

## 重构完成时间
2026-04-11

## 主要变更

### 1. GitHubSync 类扩展
- 支持多文件Gist管理
- 新增 `loadFile(filename)` - 加载指定文件
- 新增 `saveFile(filename, content)` - 保存指定文件
- 新增 `saveFiles(files)` - 批量保存多个文件
- 新增 `getFileList()` - 获取Gist中的文件列表
- 优化错误处理和日志记录

### 2. 新增 CloudStorageManager 基类
提供统一的云端存储管理功能：
- **数据分层**: 本地IndexedDB作为缓存，GitHub Gist作为数据源
- **同步逻辑**: 
  - 读取时：先读本地缓存，再检查云端更新
  - 写入时：先写本地，再同步到云端
  - 合并策略：以云端为准，保留本地独有数据
- **CRUD操作**: getAll, get, add, update, delete, clear
- **版本管理**: 自动递增版本号，追踪同步状态
- **冲突解决**: 云端数据优先，本地独有记录合并

### 3. 新增各数据管理器类
为每个存储创建专门的管理器，继承CloudStorageManager：

| 管理器类 | 存储名称 | Gist文件名 |
|---------|---------|-----------|
| WorksManager | works | novel_editor_works.json |
| VolumesManager | volumes | novel_editor_volumes.json |
| ChaptersManager | chapters | novel_editor_chapters.json |
| OutlineSettingsManager | outline_settings | novel_editor_outline_settings.json |
| OutlineVolumesManager | outline_volumes | novel_editor_outline_volumes.json |
| OutlinePlotsManager | outline_plots | novel_editor_outline_plots.json |
| WorldSettingsManager | world_settings | novel_editor_world_settings.json |
| PlotsManager | plots | novel_editor_plots.json |
| WritingStatsManager | writing_stats | novel_editor_writing_stats.json |
| HistoryDataManager | history | novel_editor_history.json |
| FavoritesManager | favorites | novel_editor_favorites.json |
| TemplatesManager | templates | novel_editor_templates.json |

### 4. CloudStorageFactory 工厂类
- 统一管理所有云端存储管理器
- 提供全局同步状态监听
- 支持批量同步所有存储

### 5. Database 类重构
- 集成 CloudStorageFactory
- 自动初始化云端存储管理器
- 智能路由CRUD操作（云端存储优先）
- 新增数据迁移功能 `migrateToCloud()`
- 区分使用云端同步的存储类型

### 6. UI增强
- **同步状态显示**: 首页显示各存储同步状态
- **操作按钮**: 
  - "立即同步" - 强制同步所有数据到云端
  - "同步详情" - 查看详细同步状态表格
  - "数据迁移" - 将本地数据迁移到云端
- **状态指示器**: 显示上次同步时间、记录数量

### 7. outline_works 处理
- outline_works 已改为直接引用云端 works 存储
- 不再创建独立的 objectStore
- 统一使用作品ID关联

## 数据迁移指南

### 自动迁移
如果用户已有本地数据且配置了GitHub Token：
1. 系统自动检测本地数据
2. 首次同步时自动上传到云端
3. 后续保持双向同步

### 手动迁移
用户可通过首页的"数据迁移"按钮：
1. 点击"数据迁移"按钮
2. 确认迁移对话框
3. 等待迁移完成提示

### 数据结构
每个Gist文件包含：
```json
{
  "data": [...],
  "version": 1,
  "lastSync": "2026-04-11T12:00:00.000Z",
  "count": 100
}
```

## 跨设备同步说明

### 首次配置新设备
1. 在新设备上输入相同的 GitHub Token
2. 系统自动从云端拉取所有数据
3. 本地IndexedDB作为缓存

### 同步冲突处理
- 云端数据为准
- 本地独有的记录会被保留并上传
- 同一记录的修改以云端版本为准

### 离线使用
- 数据首先保存在本地IndexedDB
- 网络恢复后自动同步到云端
- 支持离线查看和编辑

## 保留本地存储的
以下存储保持本地模式，不使用云端同步：
- **characters** - 角色管理（已是云端，保持不变）
- **templates** - 模板数据（可选保留本地）

## 兼容性
- 向后兼容：已配置的GitHub Token继续有效
- 数据版本：自动管理，支持未来升级
- 降级方案：可从云端导出JSON手动恢复

## 测试建议
1. 配置GitHub Token后检查首次同步
2. 添加作品/章节后确认自动同步
3. 清除本地数据后检查云端恢复
4. 多设备间测试数据同步
5. 离线模式下测试数据保存

## 已知限制
- Gist有文件大小限制（单文件约10MB）
- GitHub API有速率限制（每小时60次未认证/5000次认证）
- 大型数据集可能需要分批同步
