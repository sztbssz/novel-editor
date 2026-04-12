# LoRA训练 - 4风格小说文风模型

基于 Qwen2.5-7B-Instruct 的LoRA微调，训练4种小说风格模型。

## 4种风格

| 风格 | 目录 | 描述 |
|------|------|------|
| 悬疑灵异 | `outputs/lora_suspense` | 恐怖氛围、推理逻辑、悬念设置 |
| 玄幻仙侠 | `outputs/lora_xuanhuan` | 修炼体系、法宝神通、仙侠世界观 |
| 都市异能 | `outputs/lora_urban` | 现代背景超能力、系统流、装逼打脸 |
| 末世废土 | `outputs/lora_apocalypse` | 末日生存、资源争夺、人性考验 |

## 硬件要求

- **显卡**: NVIDIA RTX 5070 (12GB/16GB)
- **显存**: ≥12GB
- **存储**: ≥50GB
- **内存**: ≥32GB
- **时间**: 6-8小时

## 快速开始

### 1. 安装环境

```bash
bash scripts/install_env.sh
```

### 2. 激活环境

```bash
conda activate lora-train
```

### 3. 运行训练

```bash
# 方式1: 一键训练
bash scripts/run_training.sh

# 方式2: 分步执行
python scripts/data_collect.py  # 生成训练数据
python scripts/train.py          # 开始训练
```

### 4. 测试模型

```bash
python scripts/inference.py
```

## 目录结构

```
lora-training/
├── scripts/
│   ├── install_env.sh    # 环境安装脚本
│   ├── data_collect.py   # 数据收集/生成
│   ├── train.py          # 训练脚本
│   ├── inference.py      # 推理测试
│   └── run_training.sh   # 一键训练
├── configs/              # 配置文件
├── data/                 # 训练数据
│   ├── suspense_train.json
│   ├── xuanhuan_train.json
│   ├── urban_train.json
│   └── apocalypse_train.json
└── outputs/              # 模型输出
    ├── lora_suspense/
    ├── lora_xuanhuan/
    ├── lora_urban/
    └── lora_apocalypse/
```

## 训练参数

```yaml
基础模型: Qwen/Qwen2.5-7B-Instruct
LoRA秩(r): 16
LoRA Alpha: 32
学习率: 1e-4
训练轮数: 3
Batch Size: 2
梯度累积: 4
最大序列长度: 2048
量化: 8bit
```

## 自定义训练数据

编辑 `scripts/data_collect.py` 中的 `generate_sample_data()` 函数，替换为真实小说内容：

```python
sample_texts = {
    "suspense": [
        "你的悬疑小说片段1...",
        "你的悬疑小说片段2...",
        # 至少20条，每条500-1000字
    ],
    # ... 其他风格
}
```

## 训练监控

训练过程中会输出：
- 当前epoch/step
- loss值
- 预计剩余时间
- GPU显存使用情况

## 模型使用

训练完成后，模型可用于：
1. **小说续写**: 输入开头，AI按指定风格续写
2. **风格转换**: 将一段文字转换为特定风格
3. **灵感生成**: 根据提示生成创意内容

## 故障排除

### CUDA out of memory
- 减小 `per_device_train_batch_size` 到 1
- 增大 `gradient_accumulation_steps` 到 8
- 启用 `load_in_4bit` 代替 `load_in_8bit`

### 训练速度慢
- 检查GPU利用率: `nvidia-smi -l 1`
- 确保数据加载不是瓶颈
- 考虑使用更快的存储(SSD)

### 模型效果差
- 增加训练数据量 (每风格≥50条)
- 增加训练轮数 (5-10轮)
- 调整学习率 (5e-5 ~ 2e-4)

## License

MIT
