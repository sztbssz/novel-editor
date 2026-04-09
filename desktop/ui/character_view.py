#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
角色管理界面
"""

import tkinter as tk
from tkinter import ttk, messagebox
from typing import Optional


class CharacterView(ttk.Frame):
    """角色管理视图"""
    
    def __init__(self, parent, db):
        super().__init__(parent)
        self.db = db
        self.current_char_id = None
        
        self.create_ui()
        self.load_characters()
        
    def create_ui(self):
        """创建界面"""
        # 顶部工具栏
        toolbar = ttk.Frame(self)
        toolbar.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(toolbar, text="角色管理", font=("微软雅黑", 14, "bold")).pack(side=tk.LEFT)
        ttk.Button(toolbar, text="+ 新建角色", command=self.new_character).pack(side=tk.RIGHT, padx=5)
        ttk.Button(toolbar, text="刷新", command=self.load_characters).pack(side=tk.RIGHT)
        
        # 搜索框
        search_frame = ttk.Frame(self)
        search_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(search_frame, text="搜索:").pack(side=tk.LEFT)
        self.search_var = tk.StringVar()
        self.search_var.trace('w', lambda *args: self.load_characters())
        ttk.Entry(search_frame, textvariable=self.search_var, width=30).pack(side=tk.LEFT, padx=5)
        
        # 主内容区 - 左右分栏
        content = ttk.Frame(self)
        content.pack(fill=tk.BOTH, expand=True)
        
        # 左侧角色列表
        left_frame = ttk.LabelFrame(content, text="角色列表", width=250)
        left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        left_frame.pack_propagate(False)
        
        # 列表框
        list_frame = ttk.Frame(left_frame)
        list_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.char_listbox = tk.Listbox(list_frame, selectmode=tk.SINGLE)
        self.char_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.char_listbox.bind('<<ListboxSelect>>', self.on_select)
        
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.char_listbox.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.char_listbox.config(yscrollcommand=scrollbar.set)
        
        # 右侧编辑区
        right_frame = ttk.LabelFrame(content, text="角色详情")
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # 创建表单
        self.create_form(right_frame)
        
    def create_form(self, parent):
        """创建编辑表单"""
        # 使用 Canvas + Scrollbar 实现滚动
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
        
        # 表单字段
        row = 0
        
        # 姓名
        ttk.Label(self.form_frame, text="姓名 *").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.name_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.name_var, width=40).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 别名
        ttk.Label(self.form_frame, text="别名").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.alias_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.alias_var, width=40).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 年龄
        ttk.Label(self.form_frame, text="年龄").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.age_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.age_var, width=10).grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 性别
        ttk.Label(self.form_frame, text="性别").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.gender_var = tk.StringVar()
        gender_combo = ttk.Combobox(self.form_frame, textvariable=self.gender_var, width=10, values=["男", "女", "其他", "未知"])
        gender_combo.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 外貌
        ttk.Label(self.form_frame, text="外貌描述").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.appearance_text = tk.Text(self.form_frame, width=50, height=4, wrap=tk.WORD)
        self.appearance_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 性格
        ttk.Label(self.form_frame, text="性格特点").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.personality_text = tk.Text(self.form_frame, width=50, height=4, wrap=tk.WORD)
        self.personality_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 背景
        ttk.Label(self.form_frame, text="背景故事").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.background_text = tk.Text(self.form_frame, width=50, height=5, wrap=tk.WORD)
        self.background_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 动机
        ttk.Label(self.form_frame, text="动机/目标").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.motivation_text = tk.Text(self.form_frame, width=50, height=3, wrap=tk.WORD)
        self.motivation_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 关系
        ttk.Label(self.form_frame, text="人物关系").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.relationships_text = tk.Text(self.form_frame, width=50, height=4, wrap=tk.WORD)
        self.relationships_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 标签
        ttk.Label(self.form_frame, text="标签").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.tags_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.tags_var, width=40).grid(row=row, column=1, sticky=tk.W, pady=5)
        ttk.Label(self.form_frame, text="(用逗号分隔)").grid(row=row, column=2, sticky=tk.W, pady=5)
        row += 1
        
        # 备注
        ttk.Label(self.form_frame, text="备注").grid(row=row, column=0, sticky=tk.NW, pady=5)
        self.notes_text = tk.Text(self.form_frame, width=50, height=3, wrap=tk.WORD)
        self.notes_text.grid(row=row, column=1, sticky=tk.W, pady=5)
        row += 1
        
        # 按钮
        btn_frame = ttk.Frame(self.form_frame)
        btn_frame.grid(row=row, column=0, columnspan=3, pady=20)
        
        ttk.Button(btn_frame, text="保存", command=self.save_character).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="删除", command=self.delete_character).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="清空", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        
    def load_characters(self):
        """加载角色列表"""
        self.char_listbox.delete(0, tk.END)
        self.characters = []
        
        search = self.search_var.get().strip()
        characters = self.db.list_characters(search=search if search else None)
        
        for char in characters:
            display = f"{char['name']}"
            if char.get('alias'):
                display += f" ({char['alias']})"
            self.char_listbox.insert(tk.END, display)
            self.characters.append(char)
            
    def on_select(self, event):
        """选择角色"""
        selection = self.char_listbox.curselection()
        if not selection:
            return
            
        index = selection[0]
        char = self.characters[index]
        self.current_char_id = char['id']
        
        # 填充表单
        self.name_var.set(char.get('name', ''))
        self.alias_var.set(char.get('alias', ''))
        self.age_var.set(str(char.get('age', '')) if char.get('age') else '')
        self.gender_var.set(char.get('gender', ''))
        self.tags_var.set(char.get('tags', ''))
        
        self.appearance_text.delete('1.0', tk.END)
        self.appearance_text.insert('1.0', char.get('appearance', ''))
        
        self.personality_text.delete('1.0', tk.END)
        self.personality_text.insert('1.0', char.get('personality', ''))
        
        self.background_text.delete('1.0', tk.END)
        self.background_text.insert('1.0', char.get('background', ''))
        
        self.motivation_text.delete('1.0', tk.END)
        self.motivation_text.insert('1.0', char.get('motivation', ''))
        
        self.relationships_text.delete('1.0', tk.END)
        self.relationships_text.insert('1.0', char.get('relationships', ''))
        
        self.notes_text.delete('1.0', tk.END)
        self.notes_text.insert('1.0', char.get('notes', ''))
        
    def new_character(self):
        """新建角色"""
        self.clear_form()
        self.current_char_id = None
        
    def clear_form(self):
        """清空表单"""
        self.current_char_id = None
        self.name_var.set('')
        self.alias_var.set('')
        self.age_var.set('')
        self.gender_var.set('')
        self.tags_var.set('')
        self.appearance_text.delete('1.0', tk.END)
        self.personality_text.delete('1.0', tk.END)
        self.background_text.delete('1.0', tk.END)
        self.motivation_text.delete('1.0', tk.END)
        self.relationships_text.delete('1.0', tk.END)
        self.notes_text.delete('1.0', tk.END)
        
    def save_character(self):
        """保存角色"""
        name = self.name_var.get().strip()
        if not name:
            messagebox.showerror("错误", "姓名不能为空")
            return
            
        data = {
            'name': name,
            'alias': self.alias_var.get().strip(),
            'age': int(self.age_var.get()) if self.age_var.get().isdigit() else None,
            'gender': self.gender_var.get(),
            'appearance': self.appearance_text.get('1.0', tk.END).strip(),
            'personality': self.personality_text.get('1.0', tk.END).strip(),
            'background': self.background_text.get('1.0', tk.END).strip(),
            'motivation': self.motivation_text.get('1.0', tk.END).strip(),
            'relationships': self.relationships_text.get('1.0', tk.END).strip(),
            'tags': self.tags_var.get().strip(),
            'notes': self.notes_text.get('1.0', tk.END).strip(),
        }
        
        try:
            if self.current_char_id:
                self.db.update_character(self.current_char_id, data)
                messagebox.showinfo("成功", "角色已更新")
            else:
                char_id = self.db.create_character(data)
                self.current_char_id = char_id
                messagebox.showinfo("成功", "角色已创建")
                
            self.load_characters()
            
            # 重新选中当前角色
            for i, char in enumerate(self.characters):
                if char['id'] == self.current_char_id:
                    self.char_listbox.selection_set(i)
                    break
                    
        except Exception as e:
            messagebox.showerror("错误", f"保存失败: {str(e)}")
            
    def delete_character(self):
        """删除角色"""
        if not self.current_char_id:
            messagebox.showinfo("提示", "请先选择一个角色")
            return
            
        if not messagebox.askyesno("确认", "确定要删除这个角色吗？"):
            return
            
        try:
            self.db.delete_character(self.current_char_id)
            self.clear_form()
            self.load_characters()
            messagebox.showinfo("成功", "角色已删除")
        except Exception as e:
            messagebox.showerror("错误", f"删除失败: {str(e)}")
