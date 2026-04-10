#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
网文桥段每日采集脚本
每天自动搜索并采集各类型网文桥段
"""

import os
import sys
import json
import hashlib
import time
import random
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

# 添加项目路径
BASE_DIR = Path(__file__).parent
sys.path.insert(0, str(BASE_DIR))

from dedup import Deduplicator
from update_data import DataUpdater

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(BASE_DIR / 'trope_collection.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class TropeCollector:
    """桥段采集器"""
    
    # 搜索关键词映射（按分类）
    SEARCH_KEYWORDS = {
        "xuanhuan": {
            "name": "玄幻",
            "keywords": [
                "废物逆袭 玄幻小说 经典桥段",
                "天降机缘 玄幻小说 奇遇",
                "装逼打脸 玄幻小说 名场面",
                "无敌流 玄幻小说 开篇",
                "退婚流 玄幻小说 经典",
                "觉醒血脉 玄幻小说 桥段",
                "获得传承 玄幻小说 机缘"
            ]
        },
        "xianxia": {
            "name": "仙侠",
            "keywords": [
                "渡劫飞升 仙侠小说 经典",
                "宗门争斗 仙侠小说 桥段",
                "灵根觉醒 仙侠小说 名场面",
                "拜师学艺 仙侠小说 经典",
                "秘境探险 仙侠小说 奇遇",
                "炼丹炼器 仙侠小说 桥段"
            ]
        },
        "dushi": {
            "name": "都市",
            "keywords": [
                "重生归来 都市小说 经典桥段",
                "神医下山 都市小说 名场面",
                "神豪系统 都市小说 装逼",
                "透视异能 都市小说 觉醒",
                "特种兵王 都市小说 回归",
                "商业帝国 都市小说 创业"
            ]
        },
        "kehuan": {
            "name": "科幻",
            "keywords": [
                "末世生存 科幻小说 经典",
                "星际战争 科幻小说 名场面",
                "机甲觉醒 科幻小说 桥段",
                "虫族入侵 科幻小说 战斗",
                "末日囤货 科幻小说 生存",
                "异能进化 科幻小说 觉醒"
            ]
        },
        "lishi": {
            "name": "历史",
            "keywords": [
                "穿越架空 历史小说 经典",
                "权谋争斗 历史小说 桥段",
                "名将召唤 历史小说 名场面",
                "争霸天下 历史小说 开局",
                "科举仕途 历史小说 升职",
                "工业革命 历史小说 改革"
            ]
        },
        "xuanyi": {
            "name": "悬疑",
            "keywords": [
                "灵异事件 悬疑小说 经典",
                "推理探案 悬疑小说 桥段",
                "盗墓探险 悬疑小说 名场面",
                "无限流副本 悬疑小说 闯关",
                "密室逃脱 悬疑小说 解密",
                "凶手反转 悬疑小说 结局"
            ]
        },
        "chuanshu": {
            "name": "重生/穿越/穿书/快穿",
            "keywords": [
                "重生复仇 小说 经典桥段",
                "穿越改命 小说 名场面",
                "穿书自救 小说 反派",
                "快穿任务 小说 执行",
                "剧情崩坏 小说 改变",
                "前世遗憾 小说 弥补"
            ]
        },
        "tongyong": {
            "name": "全网文通用",
            "keywords": [
                "扮猪吃老虎 小说 经典桥段",
                "智斗博弈 小说 名场面",
                "越级反杀 小说 战斗",
                "绝境翻盘 小说 反转",
                "身份揭晓 小说 震惊",
                "降维打击 小说 装逼",
                "护短名场面 小说 经典",
                "捡漏淘宝 小说 机缘"
            ]
        }
    }
    
    def __init__(self):
        self.deduplicator = Deduplicator()
        self.updater = DataUpdater()
        self.collected_count = 0
        self.new_count = 0
        self.failed_keywords = []
        
    def collect_all(self) -> Dict[str, Any]:
        """执行完整采集流程"""
        logger.info("=" * 60)
        logger.info(f"开始每日桥段采集 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info("=" * 60)
        
        all_new_tropes = []
        
        for category_id, config in self.SEARCH_KEYWORDS.items():
            logger.info(f"\n>>> 采集分类: {config['name']} ({category_id})")
            
            for keyword in config['keywords']:
                try:
                    # 模拟搜索延迟
                    time.sleep(random.uniform(1, 2))
                    
                    # 搜索桥段
                    tropes = self._search_tropes(keyword, category_id)
                    
                    # 去重并筛选新桥段
                    new_tropes = []
                    for trope in tropes:
                        self.collected_count += 1
                        if not self.deduplicator.is_duplicate(trope):
                            new_tropes.append(trope)
                            self.new_count += 1
                    
                    all_new_tropes.extend(new_tropes)
                    logger.info(f"  关键词 '{keyword[:20]}...' - 找到 {len(tropes)} 个，新增 {len(new_tropes)} 个")
                    
                except Exception as e:
                    logger.error(f"  关键词 '{keyword}' 采集失败: {str(e)}")
                    self.failed_keywords.append(keyword)
        
        # 更新数据库
        if all_new_tropes:
            logger.info(f"\n>>> 更新数据库，新增 {len(all_new_tropes)} 个桥段")
            self.updater.add_tropes(all_new_tropes)
        else:
            logger.info("\n>>> 未发现新桥段，跳过更新")
        
        # 输出统计
        self._print_summary()
        
        return {
            "collected": self.collected_count,
            "new": self.new_count,
            "failed": len(self.failed_keywords),
            "timestamp": datetime.now().isoformat()
        }
    
    def _search_tropes(self, keyword: str, category_id: str) -> List[Dict]:
        """
        搜索桥段（模拟实现）
        实际使用时替换为真实搜索API
        """
        # TODO: 替换为实际搜索API（如百度搜索、微博搜索等）
        # 当前返回模拟数据用于测试
        
        mock_tropes = self._generate_mock_tropes(keyword, category_id)
        return mock_tropes
    
    def _generate_mock_tropes(self, keyword: str, category_id: str) -> List[Dict]:
        """生成模拟桥段数据（用于测试）"""
        # 实际部署时，这里应该调用搜索API
        # 返回空列表表示当天没有新内容（避免重复生成模拟数据）
        return []
    
    def _print_summary(self):
        """输出采集统计"""
        logger.info("\n" + "=" * 60)
        logger.info("采集完成统计")
        logger.info("=" * 60)
        logger.info(f"总采集数: {self.collected_count}")
        logger.info(f"新增桥段: {self.new_count}")
        logger.info(f"失败关键词: {len(self.failed_keywords)}")
        if self.failed_keywords:
            for kw in self.failed_keywords[:5]:
                logger.info(f"  - {kw}")
        logger.info("=" * 60)


def main():
    """主函数"""
    collector = TropeCollector()
    result = collector.collect_all()
    
    # 输出JSON结果（供其他程序调用）
    print(json.dumps(result, ensure_ascii=False))
    
    return 0 if result["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
