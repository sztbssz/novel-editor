#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
同步设置界面
"""

import tkinter as tk
from tkinter import ttk, messagebox


class SyncSettingsView(ttk.Frame):
    """同步设置视图"""
    
    def __init__(self, parent, db, sync_manager):
        super().__init__(parent)
        self.db = db
        self.sync_manager = sync_manager
        
        self.create_ui()
        self.load_settings()
        
    def create_ui(self):
        """创建界面"""
        # 标题
        header = ttk.Frame(self)
        header.pack(fill=tk.X, pady=(0, 20))
        ttk.Label(header, text="云同步设置", font=("微软雅黑", 16, "bold")).pack(side=tk.LEFT)
        
        # 设置卡片
        card = ttk.LabelFrame(self, text="GitHub / Gitee 配置")
        card.pack(fill=tk.X, padx=20, pady=10)
        
        row = 0
        
        # 同步源选择
        ttk.Label(card, text="同步源:").grid(row=row, column=0, sticky=tk.W, pady=10, padx=10)
        self.provider_var = tk.StringVar(value="github")
        provider_frame = ttk.Frame(card)
        provider_frame.grid(row=row, column=1, sticky=tk.W, pady=10)
        ttk.Radiobutton(provider_frame, text="GitHub", variable=self.provider_var, value="github").pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(provider_frame, text="Gitee", variable=self.provider_var, value="gitee").pack(side=tk.LEFT, padx=5)
        row += 1
        
        # Token
        ttk.Label(card, text="Access Token *:").grid(row=row, column=0, sticky=tk.W, pady=10, padx=10)
        self.token_var = tk.StringVar()
        token_entry = ttk.Entry(card, textvariable=self.token_var, width=50, show="*")
        token_entry.grid(row=row, column=1, sticky=tk.W, pady=10)
        ttk.Button(card, text="显示", command=self.toggle_token_visibility).grid(row=row, column=2, padx=5)
        row += 1
        
        # 仓库
        ttk.Label(card, text="仓库名称 *:").grid(row=row, column=0, sticky=tk.W, pady=10, padx=10)
        self.repo_var = tk.StringVar()
        ttk.Entry(card, textvariable=self.repo_var, width=50).grid(row=row, column=1, sticky=tk.W, pady=10)
        ttk.Label(card, text="(格式: 用户名/仓库名)").grid(row=row, column=2, sticky=tk.W, padx=5)
        row += 1
        
        # 分支
        ttk.Label(card, text="分支:").grid(row=row, column=0, sticky=tk.W, pady=10, padx=10)
        self.branch_var = tk.StringVar(value="main")
        ttk.Entry(card, textvariable=self.branch_var, width=30).grid(row=row, column=1, sticky=tk.W, pady=10)
        row += 1
        
        # 自动同步
        ttk.Label(card, text="自动同步:").grid(row=row, column=0, sticky=tk.W, pady=10, padx=10)
        self.auto_sync_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(card, text="启用自动同步", variable=self.auto_sync_var).grid(row=row, column=1, sticky=tk.W, pady=10)
        row += 1
        
        # 同步间隔
        ttk.Label(card, text="同步间隔:").grid(row=row, column=0, sticky=tk.W, pady=10, padx=10)
        self.interval_var = tk.StringVar(value="300")
        interval_frame = ttk.Frame(card)
        interval_frame.grid(row=row, column=1, sticky=tk.W, pady=10)
        ttk.Entry(interval_frame, textvariable=self.interval_var, width=10).pack(side=tk.LEFT)
        ttk.Label(interval_frame, text="秒").pack(side=tk.LEFT, padx=5)
        row += 1
        
        # 按钮
        btn_frame = ttk.Frame(card)
        btn_frame.grid(row=row, column=0, columnspan=3, pady=20)
        
        ttk.Button(btn_frame, text="测试连接", command=self.test_connection).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="保存设置", command=self.save_settings).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="立即同步", command=self.manual_sync).pack(side=tk.LEFT, padx=5)
        
        # 状态显示
        self.status_frame = ttk.LabelFrame(self, text="同步状态")
        self.status_frame.pack(fill=tk.X, padx=20, pady=20)
        
        self.status_label = ttk.Label(self.status_frame, text="未配置")
        self.status_label.pack(padx=10, pady=10)
        
        # 使用说明
        help_frame = ttk.LabelFrame(self, text="配置说明")
        help_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        help_text = """
【GitHub 配置步骤】
1. 登录 GitHub，点击右上角头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 勾选 "repo" 权限，生成 Token
4. 复制 Token 填入上方输入框
5. 创建一个私有仓库（如 novel-sync）
6. 填入仓库名格式：用户名/仓库名

【Gitee 配置步骤】
1. 登录 Gitee，点击头像 → 设置 → 私人令牌
2. 生成新令牌，勾选 "projects" 权限
3. 复制 Token 填入上方输入框
4. 创建私有仓库
5. 填入仓库名格式：用户名/仓库名

【注意事项】
- Token 只显示一次，请妥善保存
- 建议使用私有仓库保护数据隐私
- 自动同步会定期检测并上传更改
- 冲突时会提示手动解决
        """
        
        help_text_widget = tk.Text(help_frame, wrap=tk.WORD, height=15, bg="#f5f5f5")
        help_text_widget.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        help_text_widget.insert('1.0', help_text)
        help_text_widget.config(state=tk.DISABLED)
        
    def toggle_token_visibility(self):
        """切换 Token 显示/隐藏"""
        for child in self.winfo_children():
            if isinstance(child, ttk.LabelFrame):
                for c in child.winfo_children():
                    if isinstance(c, ttk.Entry) and c.cget('show') == '*':
                        c.config(show='')
                    elif isinstance(c, ttk.Entry) and c.cget('show') == '':
                        c.config(show='*')
                        
    def load_settings(self):
        """加载设置"""
        config = self.sync_manager.config
        
        self.provider_var.set(config.get('provider', 'github'))
        self.token_var.set(config.get('token', ''))
        self.repo_var.set(config.get('repo', ''))
        self.branch_var.set(config.get('branch', 'main'))
        self.auto_sync_var.set(config.get('auto_sync', False))
        self.interval_var.set(str(config.get('sync_interval', 300)))
        
        # 更新状态
        if self.sync_manager.is_configured():
            last_sync = config.get('last_sync', '')
            if last_sync:
                self.status_label.config(text=f"已配置 | 上次同步: {last_sync}", foreground="green")
            else:
                self.status_label.config(text="已配置 | 未同步", foreground="orange")
        else:
            self.status_label.config(text="未配置", foreground="gray")
            
    def test_connection(self):
        """测试连接"""
        # 临时更新配置
        self.sync_manager.config = {
            'provider': self.provider_var.get(),
            'token': self.token_var.get().strip(),
            'repo': self.repo_var.get().strip(),
            'branch': self.branch_var.get().strip(),
        }
        
        self.status_label.config(text="正在测试连接...", foreground="blue")
        self.update()
        
        success, message = self.sync_manager.test_connection()
        
        if success:
            self.status_label.config(text=message, foreground="green")
            messagebox.showinfo("连接测试", message)
        else:
            self.status_label.config(text=message, foreground="red")
            messagebox.showerror("连接失败", message)
            
    def save_settings(self):
        """保存设置"""
        token = self.token_var.get().strip()
        repo = self.repo_var.get().strip()
        
        if not token or not repo:
            messagebox.showerror("错误", "Token 和仓库名称不能为空")
            return
        
        if '/' not in repo:
            messagebox.showerror("错误", "仓库名称格式应为: 用户名/仓库名")
            return
        
        try:
            interval = int(self.interval_var.get())
            if interval < 60:
                messagebox.showerror("错误", "同步间隔至少 60 秒")
                return
        except:
            messagebox.showerror("错误", "同步间隔必须是数字")
            return
        
        config = {
            'provider': self.provider_var.get(),
            'token': token,
            'repo': repo,
            'branch': self.branch_var.get().strip() or 'main',
            'auto_sync': self.auto_sync_var.get(),
            'sync_interval': interval,
        }
        
        self.sync_manager.save_config(config)
        self.status_label.config(text="设置已保存", foreground="green")
        messagebox.showinfo("成功", "同步设置已保存")
        
    def manual_sync(self):
        """手动同步"""
        if not self.sync_manager.is_configured():
            messagebox.showerror("错误", "请先配置同步设置")
            return
            
        self.status_label.config(text="正在同步...", foreground="blue")
        self.update()
        
        result = self.sync_manager.sync()
        
        if result['success']:
            if result.get('conflicts'):
                self.status_label.config(text=f"检测到 {len(result['conflicts'])} 个冲突", foreground="orange")
                messagebox.showwarning("同步完成", f"同步完成，但检测到 {len(result['conflicts'])} 个冲突\n请前往主界面解决冲突")
            else:
                self.status_label.config(text=f"同步成功 | 上传: {result['uploaded']} 下载: {result['downloaded']}", foreground="green")
                messagebox.showinfo("同步完成", result['message'])
        else:
            self.status_label.config(text=f"同步失败: {result['message']}", foreground="red")
            messagebox.showerror("同步失败", result['message'])
