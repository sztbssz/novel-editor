#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
情节大纲界面
"""

import tkinter as tk
from tkinter import ttk, messagebox


class PlotView(ttk.Frame):
    """情节大纲视图"""
    
    STATUS_OPTIONS = ["draft", "outline", "writing", "completed"]
    STATUS_LABELS = {
        "draft": "草稿",
        "outline": "大纲",
        "writing": "写作中",
        "completed": "已完成"
    }
    
    def __init__(self, parent, db):
        super().__init__(parent)
        self.db = db
        self.current_id = None
        
        self.create_ui()
        self.load_data()
        
    def create_ui(self):
        """创建界面"""
        # 顶部工具栏
        toolbar = ttk.Frame(self)
        toolbar.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(toolbar, text="情节大纲", font=("微软雅黑", 14, "bold")).pack(side=tk.LEFT)
        
        # 卷选择
        ttk.Label(toolbar, text="当前卷:").pack(side=tk.LEFT, padx=(20, 5))
        self.volume_var = tk.StringVar(value="1")
        volume_combo = ttk.Combobox(toolbar, textvariable=self.volume_var, width=8, state="readonly")
        volume_combo.pack(side=tk.LEFT)
        volume_combo.bind('<<ComboboxSelected>>', lambda e: self.load_data())
        
        ttk.Button(toolbar, text="+ 新建条目", command=self.new_item).pack(side=tk.RIGHT, padx=5)
        ttk.Button(toolbar, text="+ 新卷", command=self.add_volume).pack(side=tk.RIGHT, padx=5)
        ttk.Button(toolbar, text="刷新", command=self.load_data).pack(side=tk.RIGHT)
        
        # 主内容区 - 左右分栏
        content = ttk.Frame(self)
        content.pack(fill=tk.BOTH, expand=True)
        
        # 左侧列表
        left_frame = ttk.LabelFrame(content, text="大纲列表", width=300)
        left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        left_frame.pack_propagate(False)
        
        # 状态筛选
        filter_frame = ttk.Frame(left_frame)
        filter_frame.pack(fill=tk.X, padx=5, pady=5)
        ttk.Label(filter_frame, text="状态:").pack(side=tk.LEFT)
        self.status_filter = tk.StringVar(value="全部")
        status_combo = ttk.Combobox(filter_frame, textvariable=self.status_filter, 
                                     values=["全部", "草稿", "大纲", "写作中", "已完成"], 
                                     width=10, state="readonly")
        status_combo.pack(side=tk.LEFT, padx=5)
        status_combo.bind('<<ComboboxSelected>>', lambda e: self.load_data())
        
        # 树形列表
        tree_frame = ttk.Frame(left_frame)
        tree_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.tree = ttk.Treeview(tree_frame, columns=('status',), selectmode="browse")
        self.tree.heading('#0', text='章节/场景')
        self.tree.heading('status', text='状态')
        self.tree.column('#0', width=200)
        self.tree.column('status', width=60)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.tree.bind('<<TreeviewSelect>>', self.on_select)
        
        scrollbar = ttk.Scrollbar(tree_frame, orient=tk.VERTICAL, command=self.tree.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.config(yscrollcommand=scrollbar.set)
        
        # 右键菜单
        self.context_menu = tk.Menu(self, tearoff=0)
        self.context_menu.add_command(label="添加场景", command=self.add_scene)
        self.context_menu.add_command(label="删除", command=self.delete_item)
        self.tree.bind('<Button-3>', self.show_context_menu)
        
        # 右侧编辑区
        right_frame = ttk.LabelFrame(content, text="详情")
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        self.create_form(right_frame)
        
    def create_form(self, parent):
        """创建编辑表单"""
        canvas = tk.Canvas(parent)
        scrollbar = ttk.Scrollbar(parent, orient=tk.VERTICAL, command=canvas.yview)
        self.form_frame = ttk.Frame(canvas)
        
        self.form_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=self.form_frame, anchor="nw", width=550)
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        row = 0
        
        # 类型
        ttk.Label(self.form_frame, text="类型").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.type_var = tk.StringVar(value="chapter")
        type_frame = ttk.Frame(self.form_frame)
        type_frame.grid(row=row, column=1, sticky=tk.W, pady=5)
        ttk.Radiobutton(type_frame, text="章节", variable=self.type_var, value="chapter").pack(side=tk.LEFT)
        ttk.Radiobutton(type_frame, text="场景", variable=self.type_var, value="scene").pack(side=tk.LEFT)
        row += 1
        
        # 卷号
        ttk.Label(self.form_frame, text="卷号 *").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.volume_entry = ttk.Entry(self.form_frame, width=10)
        self.volume_entry.grid(row=row, column=1, sticky=tk.W, pady=5)
        self.volume_entry.insert(0, "1")
        row += 1
        
        # 章号
        ttk.Label(self.form_frame, text="章号").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.chapter_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.chapter_var, width=10).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 标题
        ttk.Label(self.form_frame, text="标题 *").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.title_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.title_var, width=50).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 父级
        ttk.Label(self.form_frame, text="父级章节").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.parent_var = tk.StringVar(value="无")
        self.parent_combo = ttk.Combobox(self.form_frame, textvariable=self.parent_var, 
                                          width=30, state="readonly")
        self.parent_combo.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 状态
        ttk.Label(self.form_frame, text="状态").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.status_var = tk.StringVar(value="draft")
        status_combo = ttk.Combobox(self.form_frame, textvariable=self.status_var,
                                     values=self.STATUS_OPTIONS, width=15, state="readonly")
        status_combo.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 简介
        ttk.Label(self.form_frame, text="简介").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.summary_text = tk.Text(self.form_frame, width=60, height=6, wrap=tk.WORD)
        self.summary_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 场景详情
        ttk.Label(self.form_frame, text="场景详情").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.scenes_text = tk.Text(self.form_frame, width=60, height=8, wrap=tk.WORD)
        self.scenes_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 出场角色
        ttk.Label(self.form_frame, text="出场角色").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.characters_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.characters_var, width=50).grid(row=row, column=1, sticky=tk.W, pady=5)
        ttk.Label(self.form_frame, text="(用逗号分隔)").grid(row=row, column=2, sticky=tk.W, pady=5)
        row += 1
        
        # 备注
        ttk.Label(self.form_frame, text="备注").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.notes_text = tk.Text(self.form_frame, width=60, height=4, wrap=tk.WORD)
        self.notes_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 按钮
        btn_frame = ttk.Frame(self.form_frame)
        btn_frame.grid(row=row, column=0, columnspan=3, pady=20)
        
        ttk.Button(btn_frame, text="保存", command=self.save_item).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="删除", command=self.delete_item).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="清空", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        
    def load_data(self):
        """加载数据"""
        # 更新卷选择下拉框
        volumes = self.db.get_volume_list()
        if volumes:
            volume_values = [str(v) for v in volumes]
        else:
            volume_values = ["1"]
        
        # 找到 volume_combo 并更新
        for child in self.winfo_children():
            if isinstance(child, ttk.Frame):  # toolbar
                for c in child.winfo_children():
                    if isinstance(c, ttk.Combobox):
                        c['values'] = volume_values
        
        # 清空树
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        self.items_map = {}
        
        # 获取当前卷
        try:
            volume = int(self.volume_var.get())
        except:
            volume = 1
        
        # 状态筛选
        status_filter = self.status_filter.get()
        status_map = {v: k for k, v in self.STATUS_LABELS.items()}
        status = status_map.get(status_filter)
        
        # 加载章节
        items = self.db.list_plot_items(volume_number=volume, status=status)
        
        # 先加载没有parent_id的（章节），再加载有parent_id的（场景）
        chapters = [i for i in items if i.get('parent_id') is None]
        scenes = [i for i in items if i.get('parent_id') is not None]
        
        for item in chapters:
            self._add_tree_item("", item)
            
        for item in scenes:
            # 查找父级在树中的ID
            parent_tree_id = None
            for tree_id, data in self.items_map.items():
                if data['id'] == item.get('parent_id'):
                    parent_tree_id = tree_id
                    break
            if parent_tree_id:
                self._add_tree_item(parent_tree_id, item)
            else:
                self._add_tree_item("", item)
        
        # 更新父级下拉框
        self.update_parent_combo()
        
    def _add_tree_item(self, parent_tree_id, item_data):
        """添加树节点"""
        status_label = self.STATUS_LABELS.get(item_data.get('status', 'draft'), '草稿')
        
        # 显示文本
        if item_data.get('chapter_number'):
            display = f"第{item_data['chapter_number']}章 {item_data['title']}"
        else:
            display = item_data['title']
        
        tree_id = self.tree.insert(parent_tree_id, 'end', text=display, values=(status_label,))
        self.items_map[tree_id] = item_data
        
    def update_parent_combo(self):
        """更新父级下拉框"""
        chapters = [(v['id'], v['title']) for v in self.items_map.values() 
                   if v.get('parent_id') is None]
        
        values = ["无"] + [f"{id}: {title}" for id, title in chapters]
        self.parent_combo['values'] = values
        
    def on_select(self, event):
        """选择条目"""
        selection = self.tree.selection()
        if not selection:
            return
            
        tree_id = selection[0]
        item = self.items_map.get(tree_id)
        if not item:
            return
            
        self.current_id = item['id']
        
        # 填充表单
        self.volume_entry.delete(0, tk.END)
        self.volume_entry.insert(0, str(item.get('volume_number', 1)))
        
        self.chapter_var.set(str(item.get('chapter_number', '')) if item.get('chapter_number') else '')
        self.title_var.set(item.get('title', ''))
        self.status_var.set(item.get('status', 'draft'))
        self.characters_var.set(item.get('characters', ''))
        
        # 父级
        if item.get('parent_id'):
            for i in self.items_map.values():
                if i['id'] == item['parent_id']:
                    self.parent_var.set(f"{i['id']}: {i['title']}")
                    break
        else:
            self.parent_var.set("无")
        
        self.summary_text.delete('1.0', tk.END)
        self.summary_text.insert('1.0', item.get('summary', ''))
        
        self.scenes_text.delete('1.0', tk.END)
        self.scenes_text.insert('1.0', item.get('scenes', ''))
        
        self.notes_text.delete('1.0', tk.END)
        self.notes_text.insert('1.0', item.get('notes', ''))
        
    def add_volume(self):
        """添加新卷"""
        # 找到最大卷号并+1
        volumes = self.db.get_volume_list()
        new_volume = max(volumes) + 1 if volumes else 1
        
        # 创建一个占位章节
        data = {
            'volume_number': new_volume,
            'chapter_number': 1,
            'title': f'第{new_volume}卷 第一章',
            'summary': '',
            'scenes': '',
            'characters': '',
            'notes': '',
            'status': 'draft',
            'parent_id': None,
        }
        
        self.db.create_plot_item(data)
        self.volume_var.set(str(new_volume))
        self.load_data()
        messagebox.showinfo("成功", f"第{new_volume}卷已创建")
        
    def new_item(self):
        """新建条目"""
        self.clear_form()
        self.current_id = None
        # 设置当前卷
        self.volume_entry.delete(0, tk.END)
        self.volume_entry.insert(0, self.volume_var.get())
        
    def add_scene(self):
        """添加场景"""
        selection = self.tree.selection()
        if not selection:
            messagebox.showinfo("提示", "请先选择一个章节")
            return
            
        tree_id = selection[0]
        parent_item = self.items_map.get(tree_id)
        if not parent_item:
            return
        
        # 检查是否已经是场景
        if parent_item.get('parent_id'):
            messagebox.showinfo("提示", "只能在章节下添加场景")
            return
            
        self.clear_form()
        self.current_id = None
        self.volume_entry.delete(0, tk.END)
        self.volume_entry.insert(0, str(parent_item.get('volume_number', 1)))
        self.parent_var.set(f"{parent_item['id']}: {parent_item['title']}")
        
    def clear_form(self):
        """清空表单"""
        self.current_id = None
        self.type_var.set("chapter")
        self.volume_entry.delete(0, tk.END)
        self.volume_entry.insert(0, "1")
        self.chapter_var.set('')
        self.title_var.set('')
        self.parent_var.set("无")
        self.status_var.set("draft")
        self.characters_var.set('')
        self.summary_text.delete('1.0', tk.END)
        self.scenes_text.delete('1.0', tk.END)
        self.notes_text.delete('1.0', tk.END)
        
    def save_item(self):
        """保存条目"""
        title = self.title_var.get().strip()
        if not title:
            messagebox.showerror("错误", "标题不能为空")
            return
            
        try:
            volume = int(self.volume_entry.get())
        except:
            messagebox.showerror("错误", "卷号必须是数字")
            return
        
        # 解析父级ID
        parent_id = None
        parent_text = self.parent_var.get()
        if parent_text != "无":
            try:
                parent_id = int(parent_text.split(':')[0])
            except:
                pass
        
        chapter_num = int(self.chapter_var.get()) if self.chapter_var.get().isdigit() else None
        
        data = {
            'volume_number': volume,
            'chapter_number': chapter_num,
            'title': title,
            'summary': self.summary_text.get('1.0', tk.END).strip(),
            'scenes': self.scenes_text.get('1.0', tk.END).strip(),
            'characters': self.characters_var.get(),
            'notes': self.notes_text.get('1.0', tk.END).strip(),
            'status': self.status_var.get(),
            'parent_id': parent_id,
        }
        
        try:
            if self.current_id:
                self.db.update_plot_item(self.current_id, data)
                messagebox.showinfo("成功", "大纲已更新")
            else:
                item_id = self.db.create_plot_item(data)
                self.current_id = item_id
                messagebox.showinfo("成功", "大纲已创建")
                
            self.load_data()
            
        except Exception as e:
            messagebox.showerror("错误", f"保存失败: {str(e)}")
            
    def delete_item(self):
        """删除条目"""
        if not self.current_id:
            selection = self.tree.selection()
            if selection:
                tree_id = selection[0]
                item = self.items_map.get(tree_id)
                if item:
                    self.current_id = item['id']
                    
        if not self.current_id:
            messagebox.showinfo("提示", "请先选择一个条目")
            return
            
        if not messagebox.askyesno("确认", "确定要删除这个条目吗？"):
            return
            
        try:
            self.db.delete_plot_item(self.current_id)
            self.clear_form()
            self.load_data()
            messagebox.showinfo("成功", "条目已删除")
        except Exception as e:
            messagebox.showerror("错误", f"删除失败: {str(e)}")
            
    def show_context_menu(self, event):
        """显示右键菜单"""
        item = self.tree.identify_row(event.y)
        if item:
            self.tree.selection_set(item)
            self.context_menu.post(event.x_root, event.y_root)
