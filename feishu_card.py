#!/usr/bin/env python3
"""
飞书消息卡片生成器 - 创世者入口
"""

import json

def create_creator_card():
    """创建创世者入口卡片"""
    card = {
        "config": {
            "wide_screen_mode": True
        },
        "elements": [
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "**🎮 创世者 | 网文世界构建系统**"
                }
            },
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "你的世界，由你书写"
                }
            },
            {
                "tag": "hr"
            },
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "👤 打开角色工坊"
                        },
                        "type": "primary",
                        "value": {
                            "action": "open_creator",
                            "module": "character"
                        }
                    },
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "📖 打开剧情织机"
                        },
                        "type": "default",
                        "value": {
                            "action": "open_creator",
                            "module": "plot"
                        }
                    }
                ]
            },
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "🌍 世界概览"
                        },
                        "type": "default",
                        "value": {
                            "action": "open_creator",
                            "module": "overview"
                        }
                    },
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "✍️ AI写作"
                        },
                        "type": "default",
                        "value": {
                            "action": "open_creator",
                            "module": "ai"
                        }
                    }
                ]
            },
            {
                "tag": "note",
                "elements": [
                    {
                        "tag": "plain_text",
                        "content": "点击按钮后，请在终端运行: python creator.py"
                    }
                ]
            }
        ]
    }
    return card


def send_creator_entry():
    """发送创世者入口卡片"""
    card = create_creator_card()
    
    # 输出为JSON，可用于飞书消息API
    print(json.dumps(card, ensure_ascii=False, indent=2))
    
    return card


if __name__ == "__main__":
    send_creator_entry()
