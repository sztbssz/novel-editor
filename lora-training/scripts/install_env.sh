#!/bin/bash
# LoRA训练环境安装脚本 - RTX 5070
# 在本地5070机器上执行

echo "=== LoRA训练环境安装 ==="
echo "适用于: RTX 5070 (12GB/16GB)"
echo ""

# 1. 检查NVIDIA驱动
echo "[1/6] 检查NVIDIA驱动..."
nvidia-smi
if [ $? -ne 0 ]; then
    echo "错误: 未检测到NVIDIA驱动，请先安装驱动"
    exit 1
fi

# 2. 安装Miniconda (如果未安装)
echo "[2/6] 检查/安装Miniconda..."
if ! command -v conda &> /dev/null; then
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
    bash miniconda.sh -b -p $HOME/miniconda3
    eval "$($HOME/miniconda3/bin/conda shell.bash hook)"
    echo 'eval "$($HOME/miniconda3/bin/conda shell.bash hook)"' >> ~/.bashrc
fi

# 3. 创建conda环境
echo "[3/6] 创建Python环境..."
conda create -n lora-train python=3.11 -y
conda activate lora-train

# 4. 安装PyTorch (CUDA 12.1)
echo "[4/6] 安装PyTorch + CUDA支持..."
pip install torch==2.3.0 torchvision==0.18.0 torchaudio==2.3.0 --index-url https://download.pytorch.org/whl/cu121

# 5. 安装LoRA训练工具
echo "[5/6] 安装训练依赖..."
pip install peft==0.11.1 transformers==4.41.0 accelerate==0.30.0
pip install datasets==2.19.0 bitsandbytes==0.43.1
pip install tensorboard tqdm wandb
pip install scipy scikit-learn

# 6. 安装辅助工具
echo "[6/6] 安装数据收集工具..."
pip install requests beautifulsoup4 lxml

echo ""
echo "=== 安装完成 ==="
echo "激活环境: conda activate lora-train"
echo "验证GPU: python -c 'import torch; print(torch.cuda.get_device_name(0))'"
echo ""
echo "下一步:"
echo "1. 运行 data_collect.py 收集训练数据"
echo "2. 运行 train.py 开始训练"
