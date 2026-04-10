#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据更新模块 - 更新 data.json 和 version.json
"""

import json
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any


class DataUpdater:
    """数据更新器"""
    
    def __init__(self, data_path: str = None):
        """
        初始化数据更新器
        
        Args:
            data_path: data.json 文件路径
        """
        self.base_dir = Path(__file__).parent
        self.data_path = Path(data_path) if data_path else self.base_dir / 'data.json'
        
        # 加载现有数据
        self.data = self._load_data()
    
    def _load_data(self) -> Dict:
        """加载现有数据"""
        if not self.data_path.exists():
            return {
                "version": "1.0",
                "updated": "",
                "categories": [],
                "tropes": []
            }
        
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"加载数据失败: {e}")
            return {
                "version": "1.0",
                "updated": "",
                "categories": [],
                "tropes": []
            }
    
    def _generate_id(self, title: str) -> str:
        """生成桥段ID"""
        # 从标题生成唯一ID
        clean_title = re.sub(r'[^\w\u4e00-\u9fff]', '', title)
        base_id = clean_title[:8] if len(clean_title) >= 8 else clean_title
        
        # 检查是否已存在，存在则加序号
        existing_ids = {t['id'] for t in self.data.get('tropes', [])}
        if base_id not in existing_ids:
            return base_id
        
        # 添加序号
        counter = 1
        while f"{base_id}_{counter}" in existing_ids:
            counter += 1
        return f"{base_id}_{counter}"
    
    def _increment_version(self, current_version: str) -> str:
        """递增版本号"""
        try:
            parts = current_version.split('.')
            major = int(parts[0])
            minor = int(parts[1]) if len(parts) > 1 else 0
            
            # 小版本号递增
            minor += 1
            if minor >= 10:
                major += 1
                minor = 0
            
            return f"{major}.{minor}"
        except Exception:
            return "1.0"
    
    def _normalize_category(self, category_id: str) -> str:
        """标准化分类ID"""
        category_map = {
            "xuanhuan": "xuanhuan",
            "xianxia": "xianxia", 
            "dushi": "dushi",
            "kehuan": "kehuan",
            "lishi": "lishi",
            "xuanyi": "xuanyi",
            "chuanshu": "chuanshu",
            "tongyong": "common",
            "growth": "growth",
            "emotion": "emotion",
            "game": "game",
            "kesulu": "kesulu"
        }
        return category_map.get(category_id, category_id)
    
    def add_tropes(self, new_tropes: List[Dict]) -> Dict[str, Any]:
        """
        添加新桥段到数据库
        
        Args:
            new_tropes: 新桥段列表
            
        Returns:
            更新统计
        """
        if not new_tropes:
            return {"added": 0, "skipped": 0}
        
        added = 0
        skipped = 0
        
        for trope in new_tropes:
            try:
                # 标准化数据
                normalized = self._normalize_trope(trope)
                
                # 生成ID
                if 'id' not in normalized or not normalized['id']:
                    normalized['id'] = self._generate_id(normalized['title'])
                
                # 检查ID是否已存在
                existing_ids = {t['id'] for t in self.data.get('tropes', [])}
                if normalized['id'] in existing_ids:
                    skipped += 1
                    continue
                
                # 添加创建时间
                if 'createdAt' not in normalized:
                    normalized['createdAt'] = datetime.now().strftime('%Y-%m-%d')
                
                # 添加到列表
                self.data['tropes'].append(normalized)
                added += 1
                
            except Exception as e:
                print(f"处理桥段失败: {e}")
                skipped += 1
        
        # 更新版本信息
        if added > 0:
            self.data['version'] = self._increment_version(self.data.get('version', '1.0'))
            self.data['updated'] = f"{datetime.now().strftime('%Y-%m-%d')} (自动采集新增{added}个桥段)"
            
            # 保存数据
            self._save_data()
        
        return {"added": added, "skipped": skipped}
    
    def _normalize_trope(self, trope: Dict) -> Dict:
        """标准化桥段数据格式"""
        normalized = {
            "id": trope.get('id', ''),
            "title": trope.get('title', '未命名桥段').strip(),
            "content": trope.get('content', '').strip(),
            "category": self._normalize_category(trope.get('category', 'common')),
            "subType": trope.get('subType', ''),
            "source": trope.get('source', '网络采集'),
            "tags": trope.get('tags', []),
            "createdAt": trope.get('createdAt', datetime.now().strftime('%Y-%m-%d'))
        }
        
        # 确保tags是列表
        if isinstance(normalized['tags'], str):
            normalized['tags'] = [t.strip() for t in normalized['tags'].split(',') if t.strip()]
        
        return normalized
    
    def _save_data(self):
        """保存数据到文件"""
        try:
            with open(self.data_path, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            print(f"数据已保存到 {self.data_path}")
        except Exception as e:
            print(f"保存数据失败: {e}")
    
    def get_stats(self) -> Dict:
        """获取数据统计"""
        tropes = self.data.get('tropes', [])
        categories = self.data.get('categories', [])
        
        # 按分类统计
        category_counts = {}
        for trope in tropes:
            cat = trope.get('category', 'unknown')
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        return {
            "total_tropes": len(tropes),
            "categories": len(categories),
            "version": self.data.get('version', '1.0'),
            "updated": self.data.get('updated', ''),
            "category_distribution": category_counts
        }


def main():
    """命令行工具"""
    import sys
    
    updater = DataUpdater()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--stats':
            stats = updater.get_stats()
            print(json.dumps(stats, ensure_ascii=False, indent=2))
        elif sys.argv[1] == '--version':
            print(f"当前版本: {updater.data.get('version', '1.0')}")
            print(f"更新时间: {updater.data.get('updated', '')}")
    else:
        stats = updater.get_stats()
        print(f"数据更新模块已加载")
        print(f"版本: {stats['version']}")
        print(f"总桥段数: {stats['total_tropes']}")
        print(f"分类数: {stats['categories']}")
        print(f"\n使用: python update_data.py --stats  # 查看详细统计")


if __name__ == "__main__":
    main()
