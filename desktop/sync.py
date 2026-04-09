#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
同步模块
支持 GitHub/Gitee 云同步，包含冲突检测和解决
"""

import os
import json
import time
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from database import Database


class SyncManager:
    """同步管理器"""
    
    SYNC_VERSION = 1
    
    def __init__(self, db: Database):
        self.db = db
        self.config = self._load_config()
        
    def _load_config(self) -> Dict:
        """加载同步配置"""
        config = {
            'provider': self.db.get_setting('sync_provider', ''),  # github/gitee
            'token': self.db.get_setting('sync_token', ''),
            'repo': self.db.get_setting('sync_repo', ''),
            'branch': self.db.get_setting('sync_branch', 'main'),
            'auto_sync': self.db.get_setting('sync_auto', 'false') == 'true',
            'sync_interval': int(self.db.get_setting('sync_interval', '300')),  # 秒
            'last_sync': self.db.get_setting('sync_last_time', ''),
        }
        return config
    
    def save_config(self, config: Dict):
        """保存同步配置"""
        self.db.set_setting('sync_provider', config.get('provider', ''))
        self.db.set_setting('sync_token', config.get('token', ''))
        self.db.set_setting('sync_repo', config.get('repo', ''))
        self.db.set_setting('sync_branch', config.get('branch', 'main'))
        self.db.set_setting('sync_auto', 'true' if config.get('auto_sync') else 'false')
        self.db.set_setting('sync_interval', str(config.get('sync_interval', 300)))
        self.config = config
    
    def is_configured(self) -> bool:
        """检查是否已配置同步"""
        return bool(self.config.get('token') and self.config.get('repo'))
    
    def is_auto_sync_enabled(self) -> bool:
        """检查是否启用自动同步"""
        return self.is_configured() and self.config.get('auto_sync', False)
    
    def get_last_sync_time(self) -> str:
        """获取上次同步时间"""
        return self.config.get('last_sync', '')
    
    def sync(self) -> Dict:
        """
        执行同步
        
        Returns:
            {
                'success': bool,
                'message': str,
                'conflicts': List[Dict],
                'uploaded': int,
                'downloaded': int
            }
        """
        if not self.is_configured():
            return {'success': False, 'message': '同步未配置', 'conflicts': [], 'uploaded': 0, 'downloaded': 0}
        
        provider = self.config.get('provider', 'github')
        
        try:
            if provider == 'github':
                return self._sync_github()
            elif provider == 'gitee':
                return self._sync_gitee()
            else:
                return {'success': False, 'message': f'不支持的同步源: {provider}', 'conflicts': [], 'uploaded': 0, 'downloaded': 0}
        except Exception as e:
            return {'success': False, 'message': str(e), 'conflicts': [], 'uploaded': 0, 'downloaded': 0}
    
    def _sync_github(self) -> Dict:
        """同步到 GitHub"""
        import requests
        
        token = self.config['token']
        repo = self.config['repo']
        branch = self.config.get('branch', 'main')
        
        headers = {
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # 准备本地数据
        local_data = self._prepare_sync_data()
        content = json.dumps(local_data, ensure_ascii=False, indent=2)
        content_bytes = content.encode('utf-8')
        import base64
        content_b64 = base64.b64encode(content_bytes).decode('utf-8')
        
        # 检查云端是否有数据
        file_path = 'novel_data.json'
        api_url = f'https://api.github.com/repos/{repo}/contents/{file_path}'
        
        try:
            resp = requests.get(api_url, headers=headers, params={'ref': branch})
            cloud_exists = resp.status_code == 200
            cloud_sha = resp.json().get('sha') if cloud_exists else None
            cloud_content_b64 = resp.json().get('content', '').replace('\n', '') if cloud_exists else None
        except:
            cloud_exists = False
            cloud_sha = None
            cloud_content_b64 = None
        
        conflicts = []
        uploaded = 0
        downloaded = 0
        
        if cloud_exists and cloud_content_b64:
            # 下载云端数据
            cloud_content = base64.b64decode(cloud_content_b64).decode('utf-8')
            cloud_data = json.loads(cloud_content)
            
            # 检测冲突
            conflicts = self._detect_conflicts(local_data, cloud_data)
            
            if conflicts:
                # 有冲突，保存云端数据到本地但不覆盖
                self._save_cloud_data_for_resolution(cloud_data)
                return {
                    'success': True,
                    'message': f'检测到 {len(conflicts)} 个冲突，请解决后再同步',
                    'conflicts': conflicts,
                    'uploaded': 0,
                    'downloaded': 0
                }
            
            # 合并数据（云端较新则使用云端，本地较新则上传）
            merged_data = self._merge_data(local_data, cloud_data)
            
            # 如果合并后有变化，上传
            if merged_data != local_data:
                content = json.dumps(merged_data, ensure_ascii=False, indent=2)
                content_b64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
                downloaded = 1
        
        # 上传数据
        commit_message = f"同步小说数据 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        data = {
            'message': commit_message,
            'content': content_b64,
            'branch': branch
        }
        if cloud_sha:
            data['sha'] = cloud_sha
        
        resp = requests.put(api_url, headers=headers, json=data)
        
        if resp.status_code in [200, 201]:
            # 更新同步时间
            self.config['last_sync'] = datetime.now().isoformat()
            self.db.set_setting('sync_last_time', self.config['last_sync'])
            uploaded = 1
            
            return {
                'success': True,
                'message': '同步成功',
                'conflicts': [],
                'uploaded': uploaded,
                'downloaded': downloaded
            }
        else:
            return {
                'success': False,
                'message': f'同步失败: {resp.json().get("message", "未知错误")}',
                'conflicts': [],
                'uploaded': 0,
                'downloaded': 0
            }
    
    def _sync_gitee(self) -> Dict:
        """同步到 Gitee"""
        import requests
        
        token = self.config['token']
        repo = self.config['repo']
        branch = self.config.get('branch', 'master')
        
        headers = {
            'Authorization': f'token {token}'
        }
        
        # 准备本地数据
        local_data = self._prepare_sync_data()
        content = json.dumps(local_data, ensure_ascii=False, indent=2)
        import base64
        content_b64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
        
        # 检查云端文件
        file_path = 'novel_data.json'
        api_url = f'https://gitee.com/api/v5/repos/{repo}/contents/{file_path}'
        
        try:
            resp = requests.get(api_url, headers=headers, params={'ref': branch})
            cloud_exists = resp.status_code == 200
            cloud_sha = resp.json().get('sha') if cloud_exists else None
        except:
            cloud_exists = False
            cloud_sha = None
        
        # 上传/更新文件
        if cloud_exists:
            data = {
                'access_token': token,
                'content': content_b64,
                'sha': cloud_sha,
                'message': f'同步小说数据 - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")',
                'branch': branch
            }
            resp = requests.put(api_url, json=data)
        else:
            data = {
                'access_token': token,
                'content': content_b64,
                'message': f'同步小说数据 - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")',
                'branch': branch
            }
            resp = requests.post(api_url, json=data)
        
        if resp.status_code in [200, 201]:
            self.config['last_sync'] = datetime.now().isoformat()
            self.db.set_setting('sync_last_time', self.config['last_sync'])
            
            return {
                'success': True,
                'message': '同步成功',
                'conflicts': [],
                'uploaded': 1,
                'downloaded': 0
            }
        else:
            return {
                'success': False,
                'message': f'同步失败: {resp.text}',
                'conflicts': [],
                'uploaded': 0,
                'downloaded': 0
            }
    
    def _prepare_sync_data(self) -> Dict:
        """准备同步数据"""
        return {
            'version': self.SYNC_VERSION,
            'sync_time': datetime.now().isoformat(),
            'device_id': self._get_device_id(),
            'data': self.db.get_all_sync_data()
        }
    
    def _get_device_id(self) -> str:
        """获取设备唯一标识"""
        device_id = self.db.get_setting('device_id')
        if not device_id:
            import uuid
            device_id = str(uuid.uuid4())
            self.db.set_setting('device_id', device_id)
        return device_id
    
    def _detect_conflicts(self, local_data: Dict, cloud_data: Dict) -> List[Dict]:
        """检测冲突"""
        conflicts = []
        
        local_version = local_data.get('version', 1)
        cloud_version = cloud_data.get('version', 1)
        
        # 检查各表的版本
        for table_name in ['characters', 'world_settings', 'plot_outline']:
            local_items = {item.get('sync_id', item.get('id')): item 
                          for item in local_data.get('data', {}).get(table_name, [])}
            cloud_items = {item.get('sync_id', item.get('id')): item 
                          for item in cloud_data.get('data', {}).get(table_name, [])}
            
            all_ids = set(local_items.keys()) | set(cloud_items.keys())
            
            for item_id in all_ids:
                local_item = local_items.get(item_id)
                cloud_item = cloud_items.get(item_id)
                
                if local_item and cloud_item:
                    # 检查版本是否一致
                    local_ver = local_item.get('version', 1)
                    cloud_ver = cloud_item.get('version', 1)
                    
                    if local_ver != cloud_ver:
                        # 检查内容是否不同
                        if json.dumps(local_item, sort_keys=True) != json.dumps(cloud_item, sort_keys=True):
                            conflicts.append({
                                'type': table_name,
                                'id': item_id,
                                'name': local_item.get('name') or local_item.get('title', '未命名'),
                                'local_version': local_ver,
                                'cloud_version': cloud_ver
                            })
                            # 标记冲突
                            self._mark_conflict(table_name, item_id, cloud_item)
        
        return conflicts
    
    def _mark_conflict(self, table_name: str, sync_id: str, cloud_item: Dict):
        """标记冲突到数据库"""
        # 查找本地记录ID
        if table_name == 'characters':
            local_item = self.db.get_character_by_sync_id(sync_id)
        else:
            # 其他表类似处理
            local_item = None
        
        if local_item:
            self.db.set_conflict(table_name, local_item['id'], cloud_item)
    
    def _merge_data(self, local_data: Dict, cloud_data: Dict) -> Dict:
        """合并本地和云端数据"""
        merged = {
            'version': max(local_data.get('version', 1), cloud_data.get('version', 1)) + 1,
            'sync_time': datetime.now().isoformat(),
            'device_id': self._get_device_id(),
            'data': {}
        }
        
        for table_name in ['characters', 'world_settings', 'plot_outline']:
            local_items = {item.get('sync_id', str(item.get('id'))): item 
                          for item in local_data.get('data', {}).get(table_name, [])}
            cloud_items = {item.get('sync_id', str(item.get('id'))): item 
                          for item in cloud_data.get('data', {}).get(table_name, [])}
            
            merged_items = []
            all_ids = set(local_items.keys()) | set(cloud_items.keys())
            
            for item_id in all_ids:
                local_item = local_items.get(item_id)
                cloud_item = cloud_items.get(item_id)
                
                if local_item and cloud_item:
                    # 比较更新时间，使用较新的
                    local_time = local_item.get('updated_at', '')
                    cloud_time = cloud_item.get('updated_at', '')
                    
                    if cloud_time > local_time:
                        merged_items.append(cloud_item)
                        # 更新本地数据库
                        self._update_local_item(table_name, cloud_item)
                    else:
                        merged_items.append(local_item)
                elif local_item:
                    merged_items.append(local_item)
                else:
                    merged_items.append(cloud_item)
                    # 添加到本地数据库
                    self._create_local_item(table_name, cloud_item)
            
            merged['data'][table_name] = merged_items
        
        return merged
    
    def _update_local_item(self, table_name: str, item: Dict):
        """更新本地记录"""
        item_id = item.get('id')
        if not item_id:
            return
        
        data = {k: v for k, v in item.items() if k != 'id'}
        
        if table_name == 'characters':
            self.db.update_character(item_id, data)
        elif table_name == 'world_settings':
            self.db.update_world_setting(item_id, data)
        elif table_name == 'plot_outline':
            self.db.update_plot_item(item_id, data)
    
    def _create_local_item(self, table_name: str, item: Dict):
        """创建本地记录"""
        data = {k: v for k, v in item.items() if k != 'id'}
        
        if table_name == 'characters':
            self.db.create_character(data)
        elif table_name == 'world_settings':
            self.db.create_world_setting(data)
        elif table_name == 'plot_outline':
            self.db.create_plot_item(data)
    
    def _save_cloud_data_for_resolution(self, cloud_data: Dict):
        """保存云端数据供冲突解决"""
        # 云端数据已经在 _detect_conflicts 中保存到 sync_metadata 表
        pass
    
    def get_conflicts(self) -> List[Dict]:
        """获取所有待解决的冲突"""
        conflicts = self.db.get_conflicts()
        result = []
        
        for conflict in conflicts:
            table_name = conflict['table_name']
            record_id = conflict['record_id']
            cloud_data = json.loads(conflict.get('cloud_data', '{}'))
            
            # 获取本地数据
            if table_name == 'characters':
                local_item = self.db.get_character(record_id)
            elif table_name == 'world_settings':
                local_item = self.db.get_world_setting(record_id)
            elif table_name == 'plot_outline':
                local_item = self.db.get_plot_item(record_id)
            else:
                local_item = None
            
            if local_item:
                result.append({
                    'table': table_name,
                    'id': record_id,
                    'name': local_item.get('name') or local_item.get('title', '未命名'),
                    'local': local_item,
                    'cloud': cloud_data
                })
        
        return result
    
    def resolve_conflict(self, table_name: str, record_id: int, use_local: bool):
        """解决冲突"""
        if use_local:
            # 使用本地版本，标记为已解决
            self.db.resolve_conflict(table_name, record_id, 'local')
        else:
            # 使用云端版本，更新本地数据
            conflict_data = self.db.get_sync_metadata(table_name, record_id)
            if conflict_data and conflict_data.get('cloud_data'):
                cloud_item = json.loads(conflict_data['cloud_data'])
                self._update_local_item(table_name, cloud_item)
                self.db.resolve_conflict(table_name, record_id, 'cloud')
    
    def test_connection(self) -> Tuple[bool, str]:
        """测试连接"""
        if not self.is_configured():
            return False, "同步未配置"
        
        provider = self.config.get('provider', 'github')
        
        try:
            import requests
            
            if provider == 'github':
                headers = {'Authorization': f'token {self.config["token"]}'}
                resp = requests.get('https://api.github.com/user', headers=headers, timeout=10)
                if resp.status_code == 200:
                    return True, f"连接成功 - {resp.json().get('login')}"
                else:
                    return False, f"连接失败: {resp.json().get('message', '未知错误')}"
                    
            elif provider == 'gitee':
                headers = {'Authorization': f'token {self.config["token"]}'}
                resp = requests.get('https://gitee.com/api/v5/user', headers=headers, timeout=10)
                if resp.status_code == 200:
                    return True, f"连接成功 - {resp.json().get('login')}"
                else:
                    return False, f"连接失败: {resp.text}"
            
            return False, f"不支持的同步源: {provider}"
            
        except Exception as e:
            return False, f"连接异常: {str(e)}"
