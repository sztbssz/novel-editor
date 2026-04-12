#!/usr/bin/env python3
"""
LoRA模型推理脚本
使用训练好的风格模型生成小说内容
"""

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import argparse

STYLES = {
    "funny": {
        "name": "搞笑风格",
        "model_path": "outputs/lora_funny/final_model"
    },
    "xuanhuan": {
        "name": "玄幻风格",
        "model_path": "outputs/lora_xuanhuan/final_model"
    },
    "horror": {
        "name": "恐怖风格",
        "model_path": "outputs/lora_horror/final_model"
    },
    "modern": {
        "name": "现代风格",
        "model_path": "outputs/lora_modern/final_model"
    }
}

class StyleGenerator:
    def __init__(self, style_key, base_model="Qwen/Qwen2.5-7B-Instruct"):
        self.style_key = style_key
        self.style_name = STYLES[style_key]["name"]
        self.model_path = STYLES[style_key]["model_path"]
        self.base_model = base_model
        
        print(f"🎨 加载 {self.style_name} 模型...")
        self.load_model()
    
    def load_model(self):
        """加载模型"""
        # 加载tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_path,
            trust_remote_code=True
        )
        
        # 加载基础模型
        print("⏳ 加载基础模型...")
        base = AutoModelForCausalLM.from_pretrained(
            self.base_model,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True
        )
        
        # 加载LoRA权重
        print("⏳ 加载LoRA权重...")
        self.model = PeftModel.from_pretrained(base, self.model_path)
        self.model.eval()
        
        print("✅ 模型加载完成")
    
    def generate(self, prompt, max_length=512, temperature=0.8):
        """
        生成文本
        
        Args:
            prompt: 输入提示
            max_length: 最大生成长度
            temperature: 温度参数（越高越有创意）
        """
        # 构建完整prompt
        full_prompt = f"""### 指令:
请以{self.style_name}续写以下小说内容

### 输入:
{prompt}

### 输出:
"""
        
        # Tokenize
        inputs = self.tokenizer(full_prompt, return_tensors="pt").to(self.model.device)
        
        # 生成
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_length=max_length,
                temperature=temperature,
                top_p=0.9,
                top_k=50,
                num_return_sequences=1,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        # 解码
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # 提取输出部分
        if "### 输出:" in generated_text:
            result = generated_text.split("### 输出:")[-1].strip()
        else:
            result = generated_text[len(full_prompt):].strip()
        
        return result

def interactive_mode():
    """交互模式"""
    print("="*50)
    print("🎨 LoRA风格生成器 - 交互模式")
    print("="*50)
    print("\n可用风格:")
    for key, config in STYLES.items():
        print(f"  • {key}: {config['name']}")
    print("\n输入 'quit' 退出")
    print("="*50)
    
    # 选择风格
    while True:
        style = input("\n选择风格 (funny/xuanhuan/horror/modern): ").strip()
        if style == "quit":
            break
        if style not in STYLES:
            print("❌ 无效的风格")
            continue
        break
    
    if style == "quit":
        return
    
    # 加载模型
    generator = StyleGenerator(style)
    
    # 交互生成
    while True:
        print()
        prompt = input("输入提示 (或 'quit' 退出): ").strip()
        if prompt == "quit":
            break
        
        if not prompt:
            continue
        
        print("\n📝 生成中...")
        result = generator.generate(prompt)
        
        print("\n" + "="*50)
        print(result)
        print("="*50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LoRA推理脚本")
    parser.add_argument(
        "--style",
        choices=["funny", "xuanhuan", "horror", "modern"],
        help="生成风格"
    )
    parser.add_argument(
        "--prompt",
        help="输入提示"
    )
    parser.add(
        "--max-length",
        type=int,
        default=512,
        help="最大生成长度"
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.8,
        help="温度参数 (0.1-1.0)"
    )
    
    args = parser.parse_args()
    
    if args.style and args.prompt:
        # 命令行模式
        generator = StyleGenerator(args.style)
        result = generator.generate(args.prompt, args.max_length, args.temperature)
        print(result)
    else:
        # 交互模式
        interactive_mode()
