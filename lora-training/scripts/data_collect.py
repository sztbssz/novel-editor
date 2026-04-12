#!/usr/bin/env python3
# 小说数据收集脚本
# 收集免费章节用于LoRA训练

import requests
import json
import os
import re
import time
from pathlib import Path

# 训练数据配置
TRAINING_DATA = {
    "funny": {
        "name": "搞笑风格",
        "novels": [
            {"title": "大王饶命", "url": "https://www.qidian.com/book/1010403994/", "chapters": 5},
            {"title": "修真聊天群", "url": "https://www.qidian.com/book/1004173515/", "chapters": 5}
        ]
    },
    "xuanhuan": {
        "name": "玄幻风格",
        "novels": [
            {"title": "大奉打更人", "url": "https://www.qidian.com/book/1021601530/", "chapters": 5},
            {"title": "我不是戏神", "url": "https://www.qidian.com/book/1036370336/", "chapters": 5}
        ]
    },
    "horror": {
        "name": "恐怖风格",
        "novels": [
            {"title": "神秘复苏", "url": "https://www.qidian.com/book/1021627774/", "chapters": 5},
            {"title": "地狱公寓", "url": "https://www.qidian.com/book/173050/", "chapters": 5}
        ]
    },
    "modern": {
        "name": "现代风格",
        "novels": [
            {"title": "间客", "url": "https://www.qidian.com/book/178577/", "chapters": 5},
            {"title": "从红月开始", "url": "https://www.qidian.com/book/1021627774/", "chapters": 5}
        ]
    }
}

def clean_text(text):
    """清洗文本"""
    # 去除HTML标签
    text = re.sub(r'<[^>]+>', '', text)
    # 去除多余空白
    text = re.sub(r'\s+', ' ', text)
    # 去除特殊字符
    text = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f]', '', text)
    return text.strip()

def format_for_training(text, style_name):
    """格式化为训练数据格式"""
    return {
        "instruction": f"请以{style_name}续写以下小说内容",
        "input": "",
        "output": text,
        "style": style_name
    }

def generate_sample_data():
    """
    由于实际爬取需要处理反爬机制，这里生成示例训练数据
    用户需要手动收集或使用其他方式获取真实数据
    """
    
    sample_texts = {
        "funny": [
            "吕树看着面前的系统面板，一脸懵逼。\"恭喜宿主获得负面情绪值系统，收集他人负面情绪可兑换奖励。\"吕树：\"？？？\"这是什么鬼系统？别人都是正能量，到我这就成负能量了？",
            "\"吕树，你能不能正经点？\"吕小鱼叉着腰，气鼓鼓地看着他。\"我很正经啊，\"吕树一脸无辜，\"我只是在思考人生。\"\"你思考人生的方式就是躺在沙发上抠脚？\"",
            "修真聊天群里，北河散人发了个红包。\"叮，您已领取北河散人的红包，获得一品灵石x10。\"吕树：\"这破群还能发红包？\"",
            "宋书航看着手机里的修真聊天群，陷入了沉思。群里的人都在讨论渡劫、飞升，而他只是个普通大学生。\"今天渡劫的道友记得避雷针接地啊，上次有位道友被劈成了爆炸头。\"",
            "\"前辈，您能教我修真吗？\"宋书航弱弱地问道。\"可以啊，先交学费，一品灵石100块。\"\"……前辈，我没钱。\"\"那去隔壁打更人吧，那里工资高。\""
        ],
        "xuanhuan": [
            "许七安睁开眼睛，发现自己躺在大奉王朝的监狱里。\"我穿越了？还成了打更人？\"他看着手中的铜锣，陷入了沉思。这打更人不是更夫，而是大奉的特务机构。",
            "\"许七安，你的金手指呢？\"监正笑眯眯地看着他。\"什么金手指？\"\"别装了，每个穿越者都有。\"许七安沉默片刻：\"我的金手指可能是……会背唐诗三百首？\"",
            "陈伶站在戏台上，看着台下空荡荡的观众席。\"观众朋友们，今天的戏码是……\"话音未落，他感觉背后一凉。那些看不见的\"观众\"正在注视着他。",
            "\"我不是戏神，我只是个演员。\"陈伶喃喃自语。但他知道，在这个世界里，戏演得好真的能救命。每一出戏都是对命运的抗争，每一个角色都是一次重生。",
            "大奉打更人的铜锣响了，许七安提着灯笼走在夜晚的街道上。黑暗中，有妖邪在窥视，有诡异在潜伏。\"子时三更，小心火烛。\"锣声回荡，震慑百邪。"
        ],
        "horror": [
            "杨间看着手中的羊皮纸，上面缓缓浮现出一行血字：\"你已经被它盯上了。\"他抬起头，镜中的自己正对着他笑，而他自己明明没有笑。",
            "\"鬼是无法被杀死的，能对付鬼的只有鬼。\"杨间重复着这句话，感受着体内厉鬼的躁动。每一次使用鬼的力量，他就离死亡更近一步。",
            "公寓的大门缓缓打开，李隐走了进去。这是他第十次执行血字任务，每一次都是九死一生。\"这次的目标是……找到那个不存在的人。\"",
            "镜子里的世界和现实世界一模一样，只是左右颠倒。李隐知道，一旦走进那面镜子，可能就再也回不来了。但血字任务的指示就在那里。",
            "深夜，杨间的手机突然响了。来电显示是一串乱码，接通后只传来一个声音：\"我找到你了。\"他看向窗外，黑暗中有一双眼睛正在盯着他。"
        ],
        "modern": [
            "许乐坐在机甲驾驶舱里，看着窗外的星空。\"间客\"是他对自己的定位——既不是联邦人，也不是帝国人，只是一个流浪在宇宙间的过客。",
            "\"机甲不是用来看的，是用来开的。\"许乐按下启动键，巨大的机甲发出轰鸣。在这个世界里，只有驾驶机甲才能保护自己在乎的人。",
            "陆辛看着窗外的红月，知道又一个不眠之夜开始了。他是\"红月\"事件后的幸存者，也是唯一能看见\"家人\"的人。",
            "\"哥哥，你看见那个东西了吗？\"妹妹的声音在耳边响起。陆辛点点头，看着那个站在街角的黑色影子。普通人看不见，但他能。因为他本来就不正常。",
            "许乐从机甲上跳下来，点燃一支烟。\"打完这一仗，我想去海边看看。\"\"你每次都说这句话。\"\"但这一次是真的。\""
        ]
    }
    
    return sample_texts

def create_training_dataset():
    """创建训练数据集"""
    
    data_dir = Path(__file__).parent.parent / "data"
    data_dir.mkdir(exist_ok=True)
    
    sample_texts = generate_sample_data()
    
    for style, texts in sample_texts.items():
        style_name = TRAINING_DATA[style]["name"]
        
        # 创建训练数据
        train_data = []
        for text in texts:
            train_data.append(format_for_training(text, style_name))
        
        # 保存JSON
        output_file = data_dir / f"{style}_train.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(train_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ {style_name}: 生成 {len(train_data)} 条训练数据 -> {output_file}")
    
    print("\n📊 数据生成完成")
    print("注意: 当前为示例数据，建议替换为真实小说内容")
    print("每条数据建议500-1000字，每个风格至少20条")

if __name__ == "__main__":
    create_training_dataset()
    print("\n下一步: 运行 train.py 开始训练")
