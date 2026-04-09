#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据库模块
管理本地 SQLite 数据库的创建、读写操作
"""

import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Optional, Any


class Database:
    """数据库管理类"""
    
    def __init__(self, db_path: str = None):
        """
        初始化数据库连接
        
        Args:
            db_path: 数据库文件路径，默认为用户目录下的 .novel_editor/novel.db
        """
        if db_path is None:
            home_dir = os.path.expanduser("~")
            app_dir = os.path.join(home_dir, ".novel_editor")
            os.makedirs(app_dir, exist_ok=True)
            db_path = os.path.join(app_dir, "novel.db")
        
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
        
        # 初始化表结构
        self._init_tables()
        
    def _init_tables(self):
        """初始化数据库表"""
        
        # 角色表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS characters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                alias TEXT,
                age INTEGER,
                gender TEXT,
                appearance TEXT,
                personality TEXT,
                background TEXT,
                motivation TEXT,
                relationships TEXT,
                notes TEXT,
                tags TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sync_id TEXT UNIQUE,
                version INTEGER DEFAULT 1
            )
        ''')
        
        # 世界观表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS world_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT,
                parent_id INTEGER,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sync_id TEXT UNIQUE,
                version INTEGER DEFAULT 1,
                FOREIGN KEY (parent_id) REFERENCES world_settings(id)
            )
        ''')
        
        # 情节大纲表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS plot_outline (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                volume_number INTEGER DEFAULT 1,
                chapter_number INTEGER,
                title TEXT NOT NULL,
                summary TEXT,
                scenes TEXT,
                characters TEXT,
                notes TEXT,
                status TEXT DEFAULT 'draft',
                parent_id INTEGER,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sync_id TEXT UNIQUE,
                version INTEGER DEFAULT 1,
                FOREIGN KEY (parent_id) REFERENCES plot_outline(id)
            )
        ''')
        
        # 同步元数据表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS sync_metadata (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                table_name TEXT NOT NULL,
                record_id INTEGER NOT NULL,
                sync_id TEXT NOT NULL,
                last_sync_at TIMESTAMP,
                cloud_version INTEGER DEFAULT 1,
                local_version INTEGER DEFAULT 1,
                conflict_status TEXT DEFAULT 'none',
                cloud_data TEXT,
                UNIQUE(table_name, record_id)
            )
        ''')
        
        # 设置表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 创建索引
        self.cursor.execute('CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name)')
        self.cursor.execute('CREATE INDEX IF NOT EXISTS idx_world_category ON world_settings(category)')
        self.cursor.execute('CREATE INDEX IF NOT EXISTS idx_plot_volume ON plot_outline(volume_number)')
        self.cursor.execute('CREATE INDEX IF NOT EXISTS idx_sync_metadata_sync_id ON sync_metadata(sync_id)')
        
        self.conn.commit()
        
    # ==================== 角色管理 ====================
    
    def create_character(self, data: Dict[str, Any]) -> int:
        """创建角色"""
        import uuid
        
        data['sync_id'] = str(uuid.uuid4())
        data['updated_at'] = datetime.now().isoformat()
        
        fields = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        
        self.cursor.execute(f'''
            INSERT INTO characters ({fields})
            VALUES ({placeholders})
        ''', tuple(data.values()))
        
        self.conn.commit()
        return self.cursor.lastrowid
    
    def update_character(self, char_id: int, data: Dict[str, Any]) -> bool:
        """更新角色"""
        data['updated_at'] = datetime.now().isoformat()
        data['version'] = self._get_version('characters', char_id) + 1
        
        fields = ', '.join([f"{k} = ?" for k in data.keys()])
        values = tuple(data.values()) + (char_id,)
        
        self.cursor.execute(f'''
            UPDATE characters SET {fields}
            WHERE id = ?
        ''', values)
        
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def delete_character(self, char_id: int) -> bool:
        """删除角色"""
        self.cursor.execute('DELETE FROM characters WHERE id = ?', (char_id,))
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def get_character(self, char_id: int) -> Optional[Dict]:
        """获取单个角色"""
        self.cursor.execute('SELECT * FROM characters WHERE id = ?', (char_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def get_character_by_sync_id(self, sync_id: str) -> Optional[Dict]:
        """通过 sync_id 获取角色"""
        self.cursor.execute('SELECT * FROM characters WHERE sync_id = ?', (sync_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def list_characters(self, search: str = None, tags: List[str] = None) -> List[Dict]:
        """列出所有角色"""
        query = 'SELECT * FROM characters WHERE 1=1'
        params = []
        
        if search:
            query += ' AND (name LIKE ? OR alias LIKE ? OR notes LIKE ?)'
            params.extend([f'%{search}%', f'%{search}%', f'%{search}%'])
        
        if tags:
            for tag in tags:
                query += ' AND tags LIKE ?'
                params.append(f'%{tag}%')
        
        query += ' ORDER BY updated_at DESC'
        
        self.cursor.execute(query, params)
        return [dict(row) for row in self.cursor.fetchall()]
    
    # ==================== 世界观管理 ====================
    
    def create_world_setting(self, data: Dict[str, Any]) -> int:
        """创建世界观设定"""
        import uuid
        
        data['sync_id'] = str(uuid.uuid4())
        data['updated_at'] = datetime.now().isoformat()
        
        fields = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        
        self.cursor.execute(f'''
            INSERT INTO world_settings ({fields})
            VALUES ({placeholders})
        ''', tuple(data.values()))
        
        self.conn.commit()
        return self.cursor.lastrowid
    
    def update_world_setting(self, setting_id: int, data: Dict[str, Any]) -> bool:
        """更新世界观设定"""
        data['updated_at'] = datetime.now().isoformat()
        data['version'] = self._get_version('world_settings', setting_id) + 1
        
        fields = ', '.join([f"{k} = ?" for k in data.keys()])
        values = tuple(data.values()) + (setting_id,)
        
        self.cursor.execute(f'''
            UPDATE world_settings SET {fields}
            WHERE id = ?
        ''', values)
        
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def delete_world_setting(self, setting_id: int) -> bool:
        """删除世界观设定"""
        self.cursor.execute('DELETE FROM world_settings WHERE id = ?', (setting_id,))
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def get_world_setting(self, setting_id: int) -> Optional[Dict]:
        """获取单个世界观设定"""
        self.cursor.execute('SELECT * FROM world_settings WHERE id = ?', (setting_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def list_world_settings(self, category: str = None, parent_id: int = None) -> List[Dict]:
        """列出世观设定"""
        query = 'SELECT * FROM world_settings WHERE 1=1'
        params = []
        
        if category:
            query += ' AND category = ?'
            params.append(category)
        
        if parent_id is not None:
            query += ' AND parent_id = ?'
            params.append(parent_id)
        else:
            query += ' AND parent_id IS NULL'
        
        query += ' ORDER BY order_index, created_at'
        
        self.cursor.execute(query, params)
        return [dict(row) for row in self.cursor.fetchall()]
    
    def get_world_categories(self) -> List[str]:
        """获取所有世界观分类"""
        self.cursor.execute('SELECT DISTINCT category FROM world_settings ORDER BY category')
        return [row[0] for row in self.cursor.fetchall()]
    
    # ==================== 情节大纲管理 ====================
    
    def create_plot_item(self, data: Dict[str, Any]) -> int:
        """创建情节大纲项"""
        import uuid
        
        data['sync_id'] = str(uuid.uuid4())
        data['updated_at'] = datetime.now().isoformat()
        
        fields = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        
        self.cursor.execute(f'''
            INSERT INTO plot_outline ({fields})
            VALUES ({placeholders})
        ''', tuple(data.values()))
        
        self.conn.commit()
        return self.cursor.lastrowid
    
    def update_plot_item(self, item_id: int, data: Dict[str, Any]) -> bool:
        """更新情节大纲项"""
        data['updated_at'] = datetime.now().isoformat()
        data['version'] = self._get_version('plot_outline', item_id) + 1
        
        fields = ', '.join([f"{k} = ?" for k in data.keys()])
        values = tuple(data.values()) + (item_id,)
        
        self.cursor.execute(f'''
            UPDATE plot_outline SET {fields}
            WHERE id = ?
        ''', values)
        
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def delete_plot_item(self, item_id: int) -> bool:
        """删除情节大纲项"""
        self.cursor.execute('DELETE FROM plot_outline WHERE id = ?', (item_id,))
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def get_plot_item(self, item_id: int) -> Optional[Dict]:
        """获取单个情节大纲项"""
        self.cursor.execute('SELECT * FROM plot_outline WHERE id = ?', (item_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def list_plot_items(self, volume_number: int = None, status: str = None) -> List[Dict]:
        """列出情节大纲"""
        query = 'SELECT * FROM plot_outline WHERE 1=1'
        params = []
        
        if volume_number:
            query += ' AND volume_number = ?'
            params.append(volume_number)
        
        if status:
            query += ' AND status = ?'
            params.append(status)
        
        query += ' ORDER BY volume_number, order_index, chapter_number'
        
        self.cursor.execute(query, params)
        return [dict(row) for row in self.cursor.fetchall()]
    
    def get_volume_list(self) -> List[int]:
        """获取所有卷号"""
        self.cursor.execute('SELECT DISTINCT volume_number FROM plot_outline ORDER BY volume_number')
        return [row[0] for row in self.cursor.fetchall()]
    
    # ==================== 同步元数据管理 ====================
    
    def get_sync_metadata(self, table_name: str, record_id: int) -> Optional[Dict]:
        """获取同步元数据"""
        self.cursor.execute('''
            SELECT * FROM sync_metadata 
            WHERE table_name = ? AND record_id = ?
        ''', (table_name, record_id))
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def update_sync_metadata(self, table_name: str, record_id: int, sync_id: str, 
                            cloud_version: int = None, conflict_status: str = None,
                            cloud_data: str = None):
        """更新同步元数据"""
        self.cursor.execute('''
            INSERT OR REPLACE INTO sync_metadata 
            (table_name, record_id, sync_id, last_sync_at, cloud_version, local_version, conflict_status, cloud_data)
            VALUES (?, ?, ?, ?, ?, 
                    COALESCE((SELECT local_version FROM sync_metadata WHERE table_name = ? AND record_id = ?), 1),
                    ?, ?)
        ''', (table_name, record_id, sync_id, datetime.now().isoformat(), 
              cloud_version, table_name, record_id, conflict_status, cloud_data))
        self.conn.commit()
    
    def set_conflict(self, table_name: str, record_id: int, cloud_data: Dict):
        """标记冲突"""
        self.cursor.execute('''
            UPDATE sync_metadata 
            SET conflict_status = 'conflict', cloud_data = ?
            WHERE table_name = ? AND record_id = ?
        ''', (json.dumps(cloud_data), table_name, record_id))
        self.conn.commit()
    
    def resolve_conflict(self, table_name: str, record_id: int, resolution: str):
        """解决冲突 (local/cloud/merge)"""
        if resolution == 'local':
            self.cursor.execute('''
                UPDATE sync_metadata 
                SET conflict_status = 'none', cloud_data = NULL
                WHERE table_name = ? AND record_id = ?
            ''', (table_name, record_id))
        elif resolution == 'cloud':
            # 云端数据会在同步时覆盖本地
            self.cursor.execute('''
                UPDATE sync_metadata 
                SET conflict_status = 'none', cloud_data = NULL
                WHERE table_name = ? AND record_id = ?
            ''', (table_name, record_id))
        self.conn.commit()
    
    def get_conflicts(self) -> List[Dict]:
        """获取所有冲突"""
        self.cursor.execute('''
            SELECT * FROM sync_metadata 
            WHERE conflict_status = 'conflict'
        ''')
        return [dict(row) for row in self.cursor.fetchall()]
    
    # ==================== 设置管理 ====================
    
    def get_setting(self, key: str, default: str = None) -> str:
        """获取设置值"""
        self.cursor.execute('SELECT value FROM settings WHERE key = ?', (key,))
        row = self.cursor.fetchone()
        return row[0] if row else default
    
    def set_setting(self, key: str, value: str):
        """设置值"""
        self.cursor.execute('''
            INSERT OR REPLACE INTO settings (key, value, updated_at)
            VALUES (?, ?, ?)
        ''', (key, value, datetime.now().isoformat()))
        self.conn.commit()
    
    # ==================== 工具方法 ====================
    
    def _get_version(self, table_name: str, record_id: int) -> int:
        """获取记录版本号"""
        self.cursor.execute(f'SELECT version FROM {table_name} WHERE id = ?', (record_id,))
        row = self.cursor.fetchone()
        return row[0] if row else 1
    
    def export_all(self) -> Dict:
        """导出所有数据"""
        data = {
            'characters': self.list_characters(),
            'world_settings': self.list_world_settings(),
            'plot_outline': self.list_plot_items(),
            'export_time': datetime.now().isoformat()
        }
        return data
    
    def import_all(self, data: Dict):
        """导入数据（会覆盖现有数据）"""
        # 清空现有数据
        self.cursor.execute('DELETE FROM characters')
        self.cursor.execute('DELETE FROM world_settings')
        self.cursor.execute('DELETE FROM plot_outline')
        
        # 导入角色
        for char in data.get('characters', []):
            char.pop('id', None)
            self.create_character(char)
        
        # 导入世界观
        for setting in data.get('world_settings', []):
            setting.pop('id', None)
            self.create_world_setting(setting)
        
        # 导入情节大纲
        for item in data.get('plot_outline', []):
            item.pop('id', None)
            self.create_plot_item(item)
    
    def get_all_sync_data(self) -> Dict[str, List[Dict]]:
        """获取所有需要同步的数据"""
        return {
            'characters': self.list_characters(),
            'world_settings': self.list_world_settings(),
            'plot_outline': self.list_plot_items()
        }
    
    def close(self):
        """关闭数据库连接"""
        self.conn.close()
