#!/usr/bin/env python3
"""
风格推理测试脚本
训练完成后使用此脚本测试模型效果
"""

import torch
from pathlib import Path
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

STYLES = {
    "suspense": "悬疑灵异",
    "xuanhuan": "玄幻仙侠", 
    "urban": "都市异能",
    "apocalypse": "末世废土"
}

def load_model(style_key, base_model="Qwen/Qwen2.5-7B-Instruct"):
    """加载风格模型"""
    
    output_dir = f"outputs/lora_{style_key}"
    
    if not Path(output_dir).exists():
        print(f"模型不存在: {output_dir}")
        return None, None
    
    print(f"加载 {STYLES[style_key]} 模型...")
    
    # 加载基础模型
    model = AutoModelForCausalLM.from_pretrained(
        base_model,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )
    
    # 加载LoRA权重
    model = PeftModel.from_pretrained(model, output_dir)
    model = model.merge_and_unload()  # 合并权重
    
    # 加载tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        base_model,
        trust_remote_code=True
    )
    
    return model, tokenizer

def generate(model, tokenizer, prompt, max_length=512):
    """生成文本"""
    
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def interactive_test():
    """交互式测试"""
    
    print("="*60)
    print("风格模型推理测试")
    print("="*60)
    print("可用风格:")
    for k, v in STYLES.items():
        print(f"  {k}: {v}")
    print("="*60)
    
    # 选择风格
    style_key = input("\n选择风格 (suspense/xuanhuan/urban/apocalypse): ").strip()
    
    if style_key not in STYLES:
        print("无效的风格选择")
        return
    
    # 加载模型
    model, tokenizer = load_model(style_key)
    
    if model is None:
        return
    
    print(f"\n{STYLES[style_key]} 模型已加载，输入提示词进行测试 (输入 'quit' 退出):\n")
    
    while True:
        prompt = input("> ").strip()
        
        if prompt.lower() == 'quit':
            break
        
        if not prompt:
            continue
        
        # 格式化提示词
        formatted_prompt = f"### 指令:\n以{STYLES[style_key]}风格续写以下内容\n\n### 输入:\n{prompt}\n\n### 回答:\n"
        
        print("\n生成中...")
        result = generate(model, tokenizer, formatted_prompt)
        
        # 提取生成的部分
        response = result.split("### 回答:\n")[-1].strip()
        
        print(f"\n{response}\n")
        print("-"*60)

if __name__ == "__main__":
    interactive_test()
