#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
去重模块 - 检测和避免重复桥段
使用哈希表和相似度检测双重机制
"""

import json
import hashlib
import re
from pathlib import Path
from typing import Dict, List, Set
from difflib import SequenceMatcher


class Deduplicator:
    """桥段去重器"""
    
    def __init__(self, data_path: str = None):
        """
        初始化去重器
        
        Args:
            data_path: data.json 文件路径，默认在当前目录
        """
        self.base_dir = Path(__file__).parent
        self.data_path = Path(data_path) if data_path else self.base_dir / 'data.json'
        self.hash_file = self.base_dir / 'trope_hashes.json'
        
        # 加载已有哈希
        self.existing_hashes: Set[str] = self._load_hashes()
        
        # 加载已有桥段用于相似度检测
        self.existing_tropes: List[Dict] = self._load_existing_tropes()
        
        # 相似度阈值
        self.similarity_threshold = 0.75
    
    def _load_hashes(self) -> Set[str]:
        """加载已采集桥段的哈希表"""
        if self.hash_file.exists():
            try:
                with open(self.hash_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return set(data.get('hashes', []))
            except Exception:
                pass
        return set()
    
    def _load_existing_tropes(self) -> List[Dict]:
        """加载已有的所有桥段"""
        if not self.data_path.exists():
            return []
        
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('tropes', [])
        except Exception:
            return []
    
    def _compute_hash(self, trope: Dict) -> str:
        """
        计算桥段的唯一哈希
        基于标题和内容
        """
        # 提取标题和内容的关键部分
        title = trope.get('title', '').strip()
        content = trope.get('content', '').strip()
        
        # 清理文本（去除标点、空格，统一大小写）
        clean_title = self._clean_text(title)
        clean_content = self._clean_text(content[:100])  # 只取前100字符
        
        # 计算哈希
        text = f"{clean_title}|{clean_content}"
        return hashlib.md5(text.encode('utf-8')).hexdigest()
    
    def _clean_text(self, text: str) -> str:
        """清理文本用于比较"""
        # 去除标点符号
        text = re.sub(r'[^\w\u4e00-\u9fff]', '', text)
        # 统一小写
        return text.lower()
    
    def _compute_similarity(self, trope1: Dict, trope2: Dict) -> float:
        """
        计算两个桥段的相似度
        返回 0-1 之间的值，越接近1越相似
        """
        # 标题相似度
        title_sim = SequenceMatcher(
            None, 
            self._clean_text(trope1.get('title', '')),
            self._clean_text(trope2.get('title', ''))
        ).ratio()
        
        # 内容相似度（取前200字符）
        content_sim = SequenceMatcher(
            None,
            self._clean_text(trope1.get('content', '')[:200]),
            self._clean_text(trope2.get('content', '')[:200])
        ).ratio()
        
        # 综合相似度（内容权重更高）
        return title_sim * 0.3 + content_sim * 0.7
    
    def is_duplicate(self, trope: Dict) -> bool:
        """
        检测是否为重复桥段
        
        检测逻辑：
        1. 先检查哈希是否已存在（精确匹配）
        2. 再检查相似度（模糊匹配）
        
        Returns:
            True 表示是重复桥段
        """
        # 1. 哈希检测
        trope_hash = self._compute_hash(trope)
        if trope_hash in self.existing_hashes:
            return True
        
        # 2. 相似度检测
        for existing in self.existing_tropes:
            similarity = self._compute_similarity(trope, existing)
            if similarity >= self.similarity_threshold:
                return True
        
        return False
    
    def add_hash(self, trope: Dict):
        """添加新桥段的哈希到记录"""
        trope_hash = self._compute_hash(trope)
        self.existing_hashes.add(trope_hash)
    
    def save_hashes(self):
        """保存哈希表到文件"""
        data = {
            'hashes': list(self.existing_hashes),
            'count': len(self.existing_hashes),
            'updated': str(Path(__file__).stat().st_mtime)
        }
        
        with open(self.hash_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def rebuild_hashes(self):
        """从 data.json 重建哈希表（用于初始化或修复）"""
        print("正在重建哈希表...")
        
        self.existing_hashes = set()
        self.existing_tropes = self._load_existing_tropes()
        
        for trope in self.existing_tropes:
            self.add_hash(trope)
        
        self.save_hashes()
        print(f"哈希表重建完成，共 {len(self.existing_hashes)} 条记录")


def main():
    """命令行工具"""
    import sys
    
    dedup = Deduplicator()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--rebuild':
        dedup.rebuild_hashes()
    else:
        print(f"去重模块已加载")
        print(f"当前哈希记录数: {len(dedup.existing_hashes)}")
        print(f"当前桥段总数: {len(dedup.existing_tropes)}")
        print(f"相似度阈值: {dedup.similarity_threshold}")
        print("\n使用: python dedup.py --rebuild  # 重建哈希表")


if __name__ == "__main__":
    main()
