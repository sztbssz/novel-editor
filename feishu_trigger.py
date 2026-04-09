#!/usr/bin/env python3
"""
飞书触发器 - 检查 /创世者 命令并启动编辑器
"""

import sys
import subprocess

def start_creator():
    """启动创世者编辑器"""
    subprocess.Popen([
        'python3', 
        '/root/.openclaw/workspace/novel-editor/creator.py'
    ])
    print("✓ 创世者已启动")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ['/创世者', '/creator']:
        start_creator()
    else:
        print("用法: python3 feishu_trigger.py /创世者")
