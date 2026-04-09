#!/usr/bin/env python3
"""
创世者编辑器启动脚本
用于从命令行快速启动桌面版编辑器
"""

import os
import sys
import subprocess
import json
import http.client
import time

def check_server_running():
    """检查编辑器是否已在运行"""
    try:
        conn = http.client.HTTPConnection("127.0.0.1", 18790, timeout=1)
        conn.request("GET", "/health")
        response = conn.getresponse()
        data = json.loads(response.read().decode())
        conn.close()
        return data.get("service") == "novel-editor-creator"
    except:
        return False

def send_open_request():
    """向运行中的实例发送打开请求"""
    try:
        conn = http.client.HTTPConnection("127.0.0.1", 18790, timeout=2)
        headers = {"Content-Type": "application/json"}
        data = json.dumps({"action": "open_creator", "timestamp": int(time.time() * 1000)})
        conn.request("POST", "/api/open", data, headers)
        response = conn.getresponse()
        result = json.loads(response.read().decode())
        conn.close()
        return result.get("success", False)
    except Exception as e:
        print(f"发送打开请求失败: {e}")
        return False

def start_electron_app():
    """启动Electron应用"""
    desktop_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 检查是否安装了electron
    electron_path = os.path.join(desktop_dir, "node_modules", ".bin", "electron")
    if not os.path.exists(electron_path):
        # 尝试全局electron
        electron_path = "electron"
    
    main_js = os.path.join(desktop_dir, "main.js")
    
    try:
        # 启动electron
        subprocess.Popen(
            [electron_path, main_js],
            cwd=desktop_dir,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True
        )
        return True
    except Exception as e:
        print(f"启动失败: {e}")
        return False

def main():
    print("🎮 创世者编辑器启动器")
    print("-" * 30)
    
    # 检查是否已有实例在运行
    if check_server_running():
        print("检测到编辑器已在运行，正在唤醒...")
        if send_open_request():
            print("✅ 编辑器已唤醒")
        else:
            print("⚠️ 唤醒失败，请手动切换窗口")
        return
    
    print("正在启动编辑器...")
    if start_electron_app():
        print("✅ 编辑器启动成功")
        print("📍 等待HTTP服务就绪...")
        
        # 等待服务启动
        for i in range(10):
            time.sleep(0.5)
            if check_server_running():
                print("✅ HTTP服务已就绪")
                break
        else:
            print("⚠️ HTTP服务启动较慢，请稍候...")
    else:
        print("❌ 启动失败")
        print("\n请确保已安装Electron:")
        print("  cd desktop && npm install")
        sys.exit(1)

if __name__ == "__main__":
    main()
