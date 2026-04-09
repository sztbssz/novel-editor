#!/usr/bin/env python3
"""
网文小说编辑器 - 命令行工具
Novel Editor CLI
"""

import argparse
import json
import sys
from pathlib import Path
from typing import List

from database import get_connection, init_database, reset_database
from models import Character, Name, Plot, CharacterDB, NameDB, PlotDB


def print_table(headers: List[str], rows: List[List]):
    """打印表格"""
    if not rows:
        print("(无数据)")
        return
    
    # 计算每列宽度
    col_widths = [len(h) for h in headers]
    for row in rows:
        for i, cell in enumerate(row):
            col_widths[i] = max(col_widths[i], len(str(cell)[:30]))  # 截断显示
    
    # 打印表头
    header_line = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
    print(f"\n{header_line}")
    print("-" * len(header_line))
    
    # 打印数据行
    for row in rows:
        print(" | ".join(str(cell)[:30].ljust(col_widths[i]) for i, cell in enumerate(row)))


def cmd_char(args):
    """查询人设"""
    conn = get_connection()
    db = CharacterDB(conn)
    
    results = db.search(
        tag=args.tag,
        ability=args.ability,
        role=args.role,
        keyword=args.keyword
    )
    
    if not results:
        print("🔍 未找到匹配的角色")
        return
    
    if args.verbose:
        for char in results:
            print(char.display())
    else:
        print_table(
            ["ID", "姓名", "性别", "类型", "能力", "标签"],
            [[c.id, c.name, c.gender or "-", c.role_type or "-", 
              (c.ability or "-")[:20], (c.tags or "-")[:20]] for c in results]
        )
        print(f"\n共找到 {len(results)} 个角色")
    
    conn.close()


def cmd_name(args):
    """查询名字"""
    conn = get_connection()
    db = NameDB(conn)
    
    results = db.search(
        style=args.style,
        gender=args.gender,
        keyword=args.keyword
    )
    
    if not results:
        print("🔍 未找到匹配的名字")
        return
    
    print_table(
        ["ID", "名字", "性别", "风格", "标签", "使用次数"],
        [[n.id, n.name, n.gender or "-", n.style or "-", 
          (n.tags or "-")[:15], n.usage_count] for n in results]
    )
    print(f"\n共找到 {len(results)} 个名字")
    
    conn.close()


def cmd_plot(args):
    """查询桥段"""
    conn = get_connection()
    db = PlotDB(conn)
    
    results = db.search(category=args.category, keyword=args.keyword)
    
    if not results:
        print("🔍 未找到匹配的桥段")
        return
    
    if args.verbose:
        for plot in results:
            print(plot.display())
    else:
        print_table(
            ["ID", "标题", "类别", "标签"],
            [[p.id, (p.title or "-")[:25], p.category or "-", 
              (p.tags or "-")[:20]] for p in results]
        )
        print(f"\n共找到 {len(results)} 个桥段")
    
    conn.close()


def cmd_import_char(args):
    """导入角色"""
    with open(args.file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    conn = get_connection()
    db = CharacterDB(conn)
    
    if isinstance(data, list):
        for item in data:
            char = Character(**item)
            db.add(char)
        print(f"✅ 成功导入 {len(data)} 个角色")
    else:
        char = Character(**data)
        char_id = db.add(char)
        print(f"✅ 成功导入角色: {char.name} (ID: {char_id})")
    
    conn.close()


def cmd_import_name(args):
    """导入名字"""
    with open(args.file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    conn = get_connection()
    db = NameDB(conn)
    
    if isinstance(data, list):
        for item in data:
            name = Name(**item)
            db.add(name)
        print(f"✅ 成功导入 {len(data)} 个名字")
    else:
        name = Name(**data)
        name_id = db.add(name)
        print(f"✅ 成功导入名字: {name.name} (ID: {name_id})")
    
    conn.close()


def cmd_add_char(args):
    """添加角色"""
    if args.file:
        # 从文件导入
        with open(args.file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        conn = get_connection()
        db = CharacterDB(conn)
        
        if isinstance(data, list):
            for item in data:
                char = Character(**item)
                db.add(char)
            print(f"✅ 成功导入 {len(data)} 个角色")
        else:
            char = Character(**data)
            char_id = db.add(char)
            print(f"✅ 成功添加角色: {char.name} (ID: {char_id})")
        
        conn.close()
    else:
        # 交互式添加
        print("🎭 添加新角色")
        char = Character(
            name=input("姓名: ").strip(),
            gender=input("性别 (男/女/未知): ").strip() or None,
            age=input("年龄: ").strip() or None,
            role_type=input("类型 (主角/配角/反派/龙套): ").strip() or None,
            ability=input("能力/异能: ").strip() or None,
            personality=input("性格描述: ").strip() or None,
            background=input("背景故事: ").strip() or None,
            tags=input("标签 (逗号分隔): ").strip() or None,
            source=input("来源作品: ").strip() or None,
            notes=input("备注: ").strip() or None,
        )
        
        if not char.name:
            print("❌ 姓名不能为空")
            return
        
        conn = get_connection()
        db = CharacterDB(conn)
        char_id = db.add(char)
        print(f"✅ 成功添加角色: {char.name} (ID: {char_id})")
        conn.close()


def cmd_add_name(args):
    """添加名字"""
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        conn = get_connection()
        db = NameDB(conn)
        
        if isinstance(data, list):
            for item in data:
                name = Name(**item)
                db.add(name)
            print(f"✅ 成功导入 {len(data)} 个名字")
        else:
            name = Name(**data)
            name_id = db.add(name)
            print(f"✅ 成功添加名字: {name.name} (ID: {name_id})")
        
        conn.close()
    else:
        print("📝 添加新名字")
        name = Name(
            name=input("名字: ").strip(),
            gender=input("性别 (男/女/中性): ").strip() or None,
            style=input("风格 (现代/西幻/仙侠/科幻/古风/通用): ").strip() or None,
            tags=input("标签 (逗号分隔): ").strip() or None,
        )
        
        if not name.name:
            print("❌ 名字不能为空")
            return
        
        conn = get_connection()
        db = NameDB(conn)
        name_id = db.add(name)
        print(f"✅ 成功添加名字: {name.name} (ID: {name_id})")
        conn.close()


def cmd_add_plot(args):
    """添加桥段"""
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        conn = get_connection()
        db = PlotDB(conn)
        
        if isinstance(data, list):
            for item in data:
                plot = Plot(**item)
                db.add(plot)
            print(f"✅ 成功导入 {len(data)} 个桥段")
        else:
            plot = Plot(**data)
            plot_id = db.add(plot)
            print(f"✅ 成功添加桥段: {plot.title or '未命名'} (ID: {plot_id})")
        
        conn.close()
    else:
        print("📖 添加新桥段")
        plot = Plot(
            title=input("标题: ").strip() or None,
            category=input("类别 (打脸/升级/反转/揭秘/情感/战斗): ").strip() or None,
            content=input("桥段内容:\n").strip() or None,
            tags=input("标签 (逗号分隔): ").strip() or None,
            source_work=input("出处作品: ").strip() or None,
        )
        
        conn = get_connection()
        db = PlotDB(conn)
        plot_id = db.add(plot)
        print(f"✅ 成功添加桥段 (ID: {plot_id})")
        conn.close()


def cmd_stats(args):
    """显示统计信息"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM characters")
    char_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM names")
    name_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM plots")
    plot_count = cursor.fetchone()[0]
    
    print("\n📊 数据库统计")
    print("=" * 30)
    print(f"🎭 角色数量: {char_count}")
    print(f"📝 名字数量: {name_count}")
    print(f"📖 桥段数量: {plot_count}")
    
    if char_count > 0:
        print("\n角色类型分布:")
        cursor.execute("SELECT role_type, COUNT(*) FROM characters GROUP BY role_type")
        for row in cursor.fetchall():
            print(f"  {row[0] or '未分类'}: {row[1]}")
    
    if name_count > 0:
        print("\n名字风格分布:")
        cursor.execute("SELECT style, COUNT(*) FROM names GROUP BY style")
        for row in cursor.fetchall():
            print(f"  {row[0] or '未分类'}: {row[1]}")
    
    conn.close()


def cmd_init(args):
    """初始化数据库"""
    if args.reset:
        reset_database()
    else:
        init_database()


def main():
    parser = argparse.ArgumentParser(
        description="网文小说编辑器 - 命令行工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 查询人设
  python cli.py char --tag "反派"
  python cli.py char --ability "火系"
  python cli.py char --role "主角"
  
  # 查询名字
  python cli.py name --style "西幻" --gender "男"
  python cli.py name --keyword "云"
  
  # 导入数据
  python cli.py import-char data/characters.json
  python cli.py import-name data/names.json
  
  # 添加数据
  python cli.py add-char --file new_char.json
  python cli.py add-name --file new_names.json
  python cli.py add-char  # 交互式添加
  
  # 其他
  python cli.py stats     # 统计信息
  python cli.py init      # 初始化数据库
        """
    )
    subparsers = parser.add_subparsers(dest='command', help='可用命令')
    
    # char 命令
    char_parser = subparsers.add_parser('char', help='查询人设')
    char_parser.add_argument('--tag', help='按标签筛选')
    char_parser.add_argument('--ability', help='按能力筛选')
    char_parser.add_argument('--role', help='按类型筛选 (主角/配角/反派/龙套)')
    char_parser.add_argument('--keyword', '-k', help='关键词搜索')
    char_parser.add_argument('--verbose', '-v', action='store_true', help='显示详细信息')
    
    # name 命令
    name_parser = subparsers.add_parser('name', help='查询名字')
    name_parser.add_argument('--style', help='按风格筛选 (现代/西幻/仙侠/科幻/古风/通用)')
    name_parser.add_argument('--gender', help='按性别筛选 (男/女/中性)')
    name_parser.add_argument('--keyword', '-k', help='关键词搜索')
    
    # plot 命令
    plot_parser = subparsers.add_parser('plot', help='查询桥段')
    plot_parser.add_argument('--category', help='按类别筛选 (打脸/升级/反转/揭秘/情感/战斗)')
    plot_parser.add_argument('--keyword', '-k', help='关键词搜索')
    plot_parser.add_argument('--verbose', '-v', action='store_true', help='显示详细内容')
    
    # add-char 命令
    add_char_parser = subparsers.add_parser('add-char', help='添加角色')
    add_char_parser.add_argument('--file', help='从JSON文件导入')
    
    # add-name 命令
    add_name_parser = subparsers.add_parser('add-name', help='添加名字')
    add_name_parser.add_argument('--file', help='从JSON文件导入')
    
    # add-plot 命令
    add_plot_parser = subparsers.add_parser('add-plot', help='添加桥段')
    add_plot_parser.add_argument('--file', help='从JSON文件导入')
    
    # import-char 命令
    import_char_parser = subparsers.add_parser('import-char', help='导入角色JSON')
    import_char_parser.add_argument('file', help='JSON文件路径')
    
    # import-name 命令
    import_name_parser = subparsers.add_parser('import-name', help='导入名字JSON')
    import_name_parser.add_argument('file', help='JSON文件路径')
    
    # stats 命令
    subparsers.add_parser('stats', help='显示统计信息')
    
    # init 命令
    init_parser = subparsers.add_parser('init', help='初始化数据库')
    init_parser.add_argument('--reset', action='store_true', help='重置数据库（清空所有数据）')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # 执行对应命令
    commands = {
        'char': cmd_char,
        'name': cmd_name,
        'plot': cmd_plot,
        'add-char': cmd_add_char,
        'add-name': cmd_add_name,
        'add-plot': cmd_add_plot,
        'import-char': cmd_import_char,
        'import-name': cmd_import_name,
        'stats': cmd_stats,
        'init': cmd_init,
    }
    
    commands[args.command](args)


if __name__ == '__main__':
    main()
