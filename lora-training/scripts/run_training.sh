#!/bin/bash
# 一键训练脚本

echo "=============================================="
echo "LoRA训练 - 4风格小说文风模型"
echo "=============================================="

# 激活环境
source ~/miniconda3/etc/profile.d/conda.sh
conda activate lora-train

# 检查环境
echo "检查GPU..."
python -c "import torch; print(f'GPU: {torch.cuda.get_device_name(0)}'); print(f'显存: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB')"

if [ $? -ne 0 ]; then
    echo "错误: GPU未就绪"
    exit 1
fi

# 生成训练数据
echo ""
echo "[1/3] 生成训练数据..."
python scripts/data_collect.py

if [ $? -ne 0 ]; then
    echo "数据生成失败"
    exit 1
fi

# 开始训练
echo ""
echo "[2/3] 开始训练..."
echo "预计总耗时: 6-8小时 (RTX 5070)"
echo ""
python scripts/train.py

# 训练完成
echo ""
echo "[3/3] 训练完成!"
echo ""
echo "输出模型:"
ls -lh outputs/
echo ""
echo "测试模型:"
echo "  python scripts/inference.py"
