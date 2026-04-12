#!/usr/bin/env python3
"""
LoRA训练脚本 - 4风格小说文风模型
基于 Qwen2.5-7B-Instruct
"""

import os
import json
import torch
from pathlib import Path
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    DataCollatorForSeq2Seq
)
from peft import (
    LoraConfig,
    get_peft_model,
    TaskType,
    prepare_model_for_kbit_training
)
from accelerate import Accelerator

# 风格配置
STYLES = {
    "suspense": {
        "name": "悬疑灵异",
        "data_file": "data/suspense_train.json",
        "output_dir": "outputs/lora_suspense",
        "description": "悬疑灵异风格，擅长营造恐怖氛围、推理逻辑、悬念设置"
    },
    "xuanhuan": {
        "name": "玄幻仙侠",
        "data_file": "data/xuanhuan_train.json", 
        "output_dir": "outputs/lora_xuanhuan",
        "description": "玄幻仙侠风格，擅长修炼体系、法宝神通、仙侠世界观"
    },
    "urban": {
        "name": "都市异能",
        "data_file": "data/urban_train.json",
        "output_dir": "outputs/lora_urban",
        "description": "都市异能风格，擅长现代背景下的超能力、系统流、装逼打脸"
    },
    "apocalypse": {
        "name": "末世废土",
        "data_file": "data/apocalypse_train.json",
        "output_dir": "outputs/lora_apocalypse",
        "description": "末世废土风格，擅长末日生存、资源争夺、人性考验"
    }
}

# LoRA配置
LORA_CONFIG = {
    "r": 16,                    # LoRA秩
    "lora_alpha": 32,          # 缩放参数
    "target_modules": [        # 目标模块
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    "lora_dropout": 0.05,
    "bias": "none",
    "task_type": TaskType.CAUSAL_LM
}

# 训练参数
TRAINING_CONFIG = {
    "base_model": "Qwen/Qwen2.5-7B-Instruct",
    "num_train_epochs": 3,
    "per_device_train_batch_size": 2,
    "per_device_eval_batch_size": 2,
    "gradient_accumulation_steps": 4,
    "learning_rate": 1e-4,
    "max_seq_length": 2048,
    "warmup_ratio": 0.1,
    "logging_steps": 10,
    "save_steps": 100,
    "save_total_limit": 3,
    "fp16": True,
    "gradient_checkpointing": True,
    "optim": "paged_adamw_8bit"
}

def load_data(data_file):
    """加载训练数据"""
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def format_prompt(example):
    """格式化提示词"""
    instruction = example.get("instruction", "")
    input_text = example.get("input", "")
    output = example.get("output", "")
    
    if input_text:
        prompt = f"### 指令:\n{instruction}\n\n### 输入:\n{input_text}\n\n### 回答:\n{output}"
    else:
        prompt = f"### 指令:\n{instruction}\n\n### 回答:\n{output}"
    
    return prompt

def prepare_dataset(data, tokenizer, max_length=2048):
    """准备数据集"""
    
    def tokenize_function(examples):
        prompts = [format_prompt(ex) for ex in examples]
        
        # Tokenize
        result = tokenizer(
            prompts,
            truncation=True,
            max_length=max_length,
            padding="max_length",
            return_tensors=None
        )
        
        # 标签与输入相同（因果语言模型）
        result["labels"] = result["input_ids"].copy()
        
        return result
    
    dataset = Dataset.from_list(data)
    tokenized_dataset = dataset.map(
        lambda x: tokenize_function([x]),
        batched=False,
        remove_columns=dataset.column_names
    )
    
    return tokenized_dataset

def train_style(style_key, style_config):
    """训练单个风格"""
    
    print(f"\n{'='*50}")
    print(f"开始训练: {style_config['name']}")
    print(f"{'='*50}\n")
    
    # 检查数据文件
    data_file = Path(style_config["data_file"])
    if not data_file.exists():
        print(f"⚠️ 数据文件不存在: {data_file}")
        print("请先运行 data_collect.py 生成训练数据")
        return
    
    # 创建输出目录
    output_dir = Path(style_config["output_dir"])
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 初始化accelerator
    accelerator = Accelerator()
    
    # 加载tokenizer
    print("加载Tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(
        TRAINING_CONFIG["base_model"],
        trust_remote_code=True,
        padding_side="right"
    )
    tokenizer.pad_token = tokenizer.eos_token
    
    # 加载模型
    print("加载模型...")
    model = AutoModelForCausalLM.from_pretrained(
        TRAINING_CONFIG["base_model"],
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True,
        load_in_8bit=True  # 8bit量化节省显存
    )
    
    # 准备模型用于训练
    model = prepare_model_for_kbit_training(model)
    
    # 配置LoRA
    print("配置LoRA...")
    lora_config = LoraConfig(**LORA_CONFIG)
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # 加载数据
    print("加载训练数据...")
    raw_data = load_data(data_file)
    train_dataset = prepare_dataset(raw_data, tokenizer, TRAINING_CONFIG["max_seq_length"])
    
    print(f"训练样本数: {len(train_dataset)}")
    
    # 训练参数
    training_args = TrainingArguments(
        output_dir=str(output_dir),
        num_train_epochs=TRAINING_CONFIG["num_train_epochs"],
        per_device_train_batch_size=TRAINING_CONFIG["per_device_train_batch_size"],
        gradient_accumulation_steps=TRAINING_CONFIG["gradient_accumulation_steps"],
        learning_rate=TRAINING_CONFIG["learning_rate"],
        warmup_ratio=TRAINING_CONFIG["warmup_ratio"],
        logging_steps=TRAINING_CONFIG["logging_steps"],
        save_steps=TRAINING_CONFIG["save_steps"],
        save_total_limit=TRAINING_CONFIG["save_total_limit"],
        fp16=TRAINING_CONFIG["fp16"],
        gradient_checkpointing=TRAINING_CONFIG["gradient_checkpointing"],
        optim=TRAINING_CONFIG["optim"],
        report_to="none",
        remove_unused_columns=False
    )
    
    # 数据整理器
    data_collator = DataCollatorForSeq2Seq(
        tokenizer,
        pad_to_multiple_of=8,
        return_tensors="pt",
        padding=True
    )
    
    # 创建Trainer
    from transformers import Trainer
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        data_collator=data_collator
    )
    
    # 开始训练
    print(f"\n开始训练 {style_config['name']}...")
    print(f"预计时间: 1.5-2小时/风格 (RTX 5070)\n")
    
    trainer.train()
    
    # 保存模型
    print(f"\n保存模型到 {output_dir}...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    # 保存风格描述
    with open(output_dir / "style_info.json", 'w', encoding='utf-8') as f:
        json.dump({
            "name": style_config["name"],
            "description": style_config["description"],
            "base_model": TRAINING_CONFIG["base_model"],
            "training_samples": len(raw_data)
        }, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {style_config['name']} 训练完成!")
    print(f"模型保存至: {output_dir}\n")

def main():
    """主函数"""
    
    print("="*60)
    print("LoRA训练 - 4风格小说文风模型")
    print("="*60)
    print(f"基础模型: {TRAINING_CONFIG['base_model']}")
    print(f"LoRA秩(r): {LORA_CONFIG['r']}")
    print(f"学习率: {TRAINING_CONFIG['learning_rate']}")
    print(f"训练轮数: {TRAINING_CONFIG['num_train_epochs']}")
    print("="*60)
    
    # 检查GPU
    if not torch.cuda.is_available():
        print("错误: 未检测到GPU")
        return
    
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"显存: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
    
    # 训练所有风格
    total_start = time.time()
    
    for style_key, style_config in STYLES.items():
        try:
            train_style(style_key, style_config)
        except Exception as e:
            print(f"❌ {style_config['name']} 训练失败: {e}")
            import traceback
            traceback.print_exc()
            continue
    
    total_time = time.time() - total_start
    print("\n" + "="*60)
    print(f"全部训练完成! 总耗时: {total_time/3600:.1f} 小时")
    print("="*60)
    
    # 显示输出目录
    print("\n模型输出目录:")
    for style_key, style_config in STYLES.items():
        print(f"  {style_config['name']}: {style_config['output_dir']}")

if __name__ == "__main__":
    import time
    main()
