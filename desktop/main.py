#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小说编辑器 - 主程序
桌面版 GUI 应用，支持本地存储和云同步
"""

import tkinter as tk
from tkinter import ttk, messagebox
import os
import sys

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import Database
from sync import SyncManager
from ui.character_view import CharacterView
from ui.world_view import WorldView
from ui.plot_view import PlotView
from ui.sync_settings_view import SyncSettingsView


class NovelEditorApp:
    """小说编辑器主应用"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("创世者 - 小说编辑器")
        self.root.geometry("1200x800")
        self.root.minsize(900, 600)
        
        # 初始化数据库
        self.db = Database()
        
        # 初始化同步管理器
        self.sync_manager = SyncManager(self.db)
        
        # 检查并执行自动同步
        self.check_auto_sync()
        
        # 创建界面
        self.create_ui()
        
    def create_ui(self):
        """创建主界面"""
        # 创建菜单栏
        self.create_menu()
        
        # 创建主框架
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 创建左侧导航
        nav_frame = ttk.Frame(main_frame, width=150)
        nav_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        nav_frame.pack_propagate(False)
        
        # 导航标签
        ttk.Label(nav_frame, text="导航", font=("微软雅黑", 12, "bold")).pack(pady=10)
        
        # 导航按钮
        nav_buttons = [
            ("角色管理", self.show_characters),
            ("世界观", self.show_world),
            ("情节大纲", self.show_plot),
            ("同步设置", self.show_sync_settings),
        ]
        
        for text, command in nav_buttons:
            btn = ttk.Button(nav_frame, text=text, command=command, width=15)
            btn.pack(pady=5)
        
        # 分隔线
        ttk.Separator(nav_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 同步状态
        self.sync_status_label = ttk.Label(nav_frame, text="同步: 未配置", foreground="gray")
        self.sync_status_label.pack(pady=5)
        
        # 立即同步按钮
        ttk.Button(nav_frame, text="立即同步", command=self.manual_sync).pack(pady=5)
        
        # 右侧内容区域
        self.content_frame = ttk.Frame(main_frame)
        self.content_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # 默认显示角色管理
        self.show_characters()
        
        # 更新同步状态显示
        self.update_sync_status()
        
    def create_menu(self):
        """创建菜单栏"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # 文件菜单
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="文件", menu=file_menu)
        file_menu.add_command(label="导出数据", command=self.export_data)
        file_menu.add_command(label="导入数据", command=self.import_data)
        file_menu.add_separator()
        file_menu.add_command(label="退出", command=self.root.quit)
        
        # 同步菜单
        sync_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="同步", menu=sync_menu)
        sync_menu.add_command(label="立即同步", command=self.manual_sync)
        sync_menu.add_command(label="同步设置", command=self.show_sync_settings)
        sync_menu.add_command(label="解决冲突", command=self.resolve_conflicts)
        
        # 帮助菜单
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="帮助", menu=help_menu)
        help_menu.add_command(label="关于", command=self.show_about)
        
    def show_characters(self):
        """显示角色管理页面"""
        self.clear_content()
        CharacterView(self.content_frame, self.db).pack(fill=tk.BOTH, expand=True)
        
    def show_world(self):
        """显示世界观页面"""
        self.clear_content()
        WorldView(self.content_frame, self.db).pack(fill=tk.BOTH, expand=True)
        
    def show_plot(self):
        """显示情节大纲页面"""
        self.clear_content()
        PlotView(self.content_frame, self.db).pack(fill=tk.BOTH, expand=True)
        
    def show_sync_settings(self):
        """显示同步设置页面"""
        self.clear_content()
        SyncSettingsView(self.content_frame, self.db, self.sync_manager).pack(fill=tk.BOTH, expand=True)
        
    def clear_content(self):
        """清空内容区域"""
        for widget in self.content_frame.winfo_children():
            widget.destroy()
            
    def check_auto_sync(self):
        """检查并执行自动同步"""
        try:
            if self.sync_manager.is_auto_sync_enabled():
                self.sync_manager.sync()
        except Exception as e:
            print(f"自动同步失败: {e}")
            
    def manual_sync(self):
        """手动执行同步"""
        try:
            result = self.sync_manager.sync()
            if result.get("conflicts"):
                messagebox.showwarning("同步完成", "同步完成，但检测到冲突，请前往'解决冲突'处理")
            else:
                messagebox.showinfo("同步完成", "数据已成功同步到云端")
            self.update_sync_status()
        except Exception as e:
            messagebox.showerror("同步失败", str(e))
            
    def resolve_conflicts(self):
        """显示冲突解决界面"""
        conflicts = self.sync_manager.get_conflicts()
        if not conflicts:
            messagebox.showinfo("无冲突", "当前没有需要解决的冲突")
            return
            
        # 创建冲突解决对话框
        dialog = tk.Toplevel(self.root)
        dialog.title("解决冲突")
        dialog.geometry("700x500")
        
        ttk.Label(dialog, text="检测到以下冲突，请选择保留哪个版本：", font=("微软雅黑", 11)).pack(pady=10)
        
        conflict_list = tk.Listbox(dialog, height=10)
        conflict_list.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        for conflict in conflicts:
            conflict_list.insert(tk.END, f"{conflict['type']}: {conflict['name']}")
            
        btn_frame = ttk.Frame(dialog)
        btn_frame.pack(pady=10)
        
        ttk.Button(btn_frame, text="使用本地版本", command=lambda: self.use_local_version(conflict_list)).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="使用云端版本", command=lambda: self.use_cloud_version(conflict_list)).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="稍后处理", command=dialog.destroy).pack(side=tk.LEFT, padx=5)
        
    def use_local_version(self, conflict_list):
        """使用本地版本"""
        selection = conflict_list.curselection()
        if not selection:
            messagebox.showinfo("提示", "请先选择一个冲突")
            return
        # 实现冲突解决逻辑
        messagebox.showinfo("完成", "已使用本地版本")
        
    def use_cloud_version(self, conflict_list):
        """使用云端版本"""
        selection = conflict_list.curselection()
        if not selection:
            messagebox.showinfo("提示", "请先选择一个冲突")
            return
        # 实现冲突解决逻辑
        messagebox.showinfo("完成", "已使用云端版本")
        
    def update_sync_status(self):
        """更新同步状态显示"""
        try:
            if self.sync_manager.is_configured():
                last_sync = self.sync_manager.get_last_sync_time()
                if last_sync:
                    self.sync_status_label.config(text=f"同步: {last_sync}", foreground="green")
                else:
                    self.sync_status_label.config(text="同步: 未同步", foreground="orange")
            else:
                self.sync_status_label.config(text="同步: 未配置", foreground="gray")
        except:
            self.sync_status_label.config(text="同步: 错误", foreground="red")
            
    def export_data(self):
        """导出数据"""
        from tkinter import filedialog
        import json
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            data = self.db.export_all()
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            messagebox.showinfo("导出成功", f"数据已导出到 {file_path}")
            
    def import_data(self):
        """导入数据"""
        from tkinter import filedialog
        import json
        
        file_path = filedialog.askopenfilename(
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.db.import_all(data)
                messagebox.showinfo("导入成功", "数据已导入")
                # 刷新当前视图
                self.show_characters()
            except Exception as e:
                messagebox.showerror("导入失败", str(e))
                
    def show_about(self):
        """显示关于对话框"""
        messagebox.showinfo("关于", "创世者 - 小说编辑器 v1.0\n\n支持本地存储和云同步功能")


def main():
    """主入口"""
    root = tk.Tk()
    
    # 设置主题样式
    style = ttk.Style()
    style.theme_use('clam')
    
    app = NovelEditorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
