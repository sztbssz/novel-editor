#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
世界观设定界面
"""

import tkinter as tk
from tkinter import ttk, messagebox


class WorldView(ttk.Frame):
    """世界观设定视图"""
    
    CATEGORIES = [
        "地理",
        "历史",
        "种族",
        "势力/组织",
        "力量体系",
        "规则",
        "其他"
    ]
    
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
        
        ttk.Label(toolbar, text="世界观设定", font=("微软雅黑", 14, "bold")).pack(side=tk.LEFT)
        ttk.Button(toolbar, text="+ 新建条目", command=self.new_item).pack(side=tk.RIGHT, padx=5)
        ttk.Button(toolbar, text="刷新", command=self.load_data).pack(side=tk.RIGHT)
        
        # 主内容区 - 左右分栏
        content = ttk.Frame(self)
        content.pack(fill=tk.BOTH, expand=True)
        
        # 左侧树形列表
        left_frame = ttk.LabelFrame(content, text="设定分类", width=280)
        left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        left_frame.pack_propagate(False)
        
        # 分类筛选
        ttk.Label(left_frame, text="筛选分类:").pack(anchor=tk.W, padx=5, pady=5)
        self.category_var = tk.StringVar(value="全部")
        category_combo = ttk.Combobox(left_frame, textvariable=self.category_var, 
                                       values=["全部"] + self.CATEGORIES, state="readonly")
        category_combo.pack(fill=tk.X, padx=5)
        category_combo.bind('<<ComboboxSelected>>', lambda e: self.load_data())
        
        ttk.Separator(left_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 树形列表
        tree_frame = ttk.Frame(left_frame)
        tree_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.tree = ttk.Treeview(tree_frame, selectmode="browse")
        self.tree.heading('#0', text='条目名称')
        self.tree.column('#0', width=250)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.tree.bind('<<TreeviewSelect>>', self.on_select)
        
        scrollbar = ttk.Scrollbar(tree_frame, orient=tk.VERTICAL, command=self.tree.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.config(yscrollcommand=scrollbar.set)
        
        # 右键菜单
        self.context_menu = tk.Menu(self, tearoff=0)
        self.context_menu.add_command(label="添加子条目", command=self.add_child_item)
        self.context_menu.add_command(label="删除", command=self.delete_item)
        self.tree.bind('<Button-3>', self.show_context_menu)
        
        # 右侧编辑区
        right_frame = ttk.LabelFrame(content, text="设定详情")
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
        
        # 分类
        ttk.Label(self.form_frame, text="分类 *").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.cat_var = tk.StringVar()
        cat_combo = ttk.Combobox(self.form_frame, textvariable=self.cat_var, 
                                  values=self.CATEGORIES, width=20, state="readonly")
        cat_combo.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 标题
        ttk.Label(self.form_frame, text="标题 *").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.title_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.title_var, width=50).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 父级条目
        ttk.Label(self.form_frame, text="父级条目").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.parent_var = tk.StringVar(value="无")
        self.parent_combo = ttk.Combobox(self.form_frame, textvariable=self.parent_var, 
                                          width=30, state="readonly")
        self.parent_combo.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 内容
        ttk.Label(self.form_frame, text="详细内容").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.content_text = tk.Text(self.form_frame, width=60, height=20, wrap=tk.WORD)
        self.content_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 排序
        ttk.Label(self.form_frame, text="排序").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.order_var = tk.StringVar(value="0")
        ttk.Entry(self.form_frame, textvariable=self.order_var, width=10).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 按钮
        btn_frame = ttk.Frame(self.form_frame)
        btn_frame.grid(row=row, column=0, columnspan=3, pady=20)
        
        ttk.Button(btn_frame, text="保存", command=self.save_item).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="删除", command=self.delete_item).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="清空", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        
    def load_data(self):
        """加载数据"""
        # 清空树
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        self.items_map = {}  # tree id -> item data
        
        # 获取筛选条件
        category = self.category_var.get()
        
        # 加载顶级条目
        if category == "全部":
            items = self.db.list_world_settings(parent_id=None)
        else:
            items = self.db.list_world_settings(category=category, parent_id=None)
        
        for item in items:
            self._add_tree_item("", item)
            
        # 更新父级条目下拉框
        self.update_parent_combo()
        
    def _add_tree_item(self, parent_tree_id, item_data):
        """递归添加树节点"""
        tree_id = self.tree.insert(parent_tree_id, 'end', text=item_data['title'])
        self.items_map[tree_id] = item_data
        
        # 加载子条目
        children = self.db.list_world_settings(parent_id=item_data['id'])
        for child in children:
            self._add_tree_item(tree_id, child)
            
    def update_parent_combo(self):
        """更新父级条目下拉框"""
        all_items = []
        for item_data in self.items_map.values():
            all_items.append(f"{item_data['id']}: {item_data['title']}")
        
        self.parent_combo['values'] = ["无"] + all_items
        
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
        self.cat_var.set(item.get('category', ''))
        self.title_var.set(item.get('title', ''))
        self.order_var.set(str(item.get('order_index', 0)))
        
        # 父级
        if item.get('parent_id'):
            # 查找父级标题
            parent_item = None
            for i in self.items_map.values():
                if i['id'] == item['parent_id']:
                    parent_item = i
                    break
            if parent_item:
                self.parent_var.set(f"{parent_item['id']}: {parent_item['title']}")
        else:
            self.parent_var.set("无")
        
        self.content_text.delete('1.0', tk.END)
        self.content_text.insert('1.0', item.get('content', ''))
        
    def new_item(self):
        """新建条目"""
        self.clear_form()
        self.current_id = None
        
    def add_child_item(self):
        """添加子条目"""
        selection = self.tree.selection()
        if not selection:
            messagebox.showinfo("提示", "请先选择一个父级条目")
            return
            
        tree_id = selection[0]
        parent_item = self.items_map.get(tree_id)
        if parent_item:
            self.clear_form()
            self.current_id = None
            self.parent_var.set(f"{parent_item['id']}: {parent_item['title']}")
            
    def clear_form(self):
        """清空表单"""
        self.current_id = None
        self.cat_var.set('')
        self.title_var.set('')
        self.parent_var.set("无")
        self.order_var.set("0")
        self.content_text.delete('1.0', tk.END)
        
    def save_item(self):
        """保存条目"""
        category = self.cat_var.get().strip()
        title = self.title_var.get().strip()
        
        if not category or not title:
            messagebox.showerror("错误", "分类和标题不能为空")
            return
            
        # 解析父级ID
        parent_id = None
        parent_text = self.parent_var.get()
        if parent_text != "无":
            try:
                parent_id = int(parent_text.split(':')[0])
            except:
                pass
        
        data = {
            'category': category,
            'title': title,
            'content': self.content_text.get('1.0', tk.END).strip(),
            'parent_id': parent_id,
            'order_index': int(self.order_var.get()) if self.order_var.get().isdigit() else 0,
        }
        
        try:
            if self.current_id:
                self.db.update_world_setting(self.current_id, data)
                messagebox.showinfo("成功", "设定已更新")
            else:
                item_id = self.db.create_world_setting(data)
                self.current_id = item_id
                messagebox.showinfo("成功", "设定已创建")
                
            self.load_data()
            
        except Exception as e:
            messagebox.showerror("错误", f"保存失败: {str(e)}")
            
    def delete_item(self):
        """删除条目"""
        if not self.current_id:
            # 尝试从树选择获取
            selection = self.tree.selection()
            if selection:
                tree_id = selection[0]
                item = self.items_map.get(tree_id)
                if item:
                    self.current_id = item['id']
                    
        if not self.current_id:
            messagebox.showinfo("提示", "请先选择一个条目")
            return
            
        # 检查是否有子条目
        children = self.db.list_world_settings(parent_id=self.current_id)
        if children:
            if not messagebox.askyesno("确认", "该条目下有子条目，确定要删除吗？\n(子条目也会被删除)"):
                return
        else:
            if not messagebox.askyesno("确认", "确定要删除这个设定条目吗？"):
                return
            
        try:
            self.db.delete_world_setting(self.current_id)
            self.clear_form()
            self.load_data()
            messagebox.showinfo("成功", "设定已删除")
        except Exception as e:
            messagebox.showerror("错误", f"删除失败: {str(e)}")
            
    def show_context_menu(self, event):
        """显示右键菜单"""
        item = self.tree.identify_row(event.y)
        if item:
            self.tree.selection_set(item)
            self.context_menu.post(event.x_root, event.y_root)
