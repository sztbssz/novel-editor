import sqlite3
import os
from pathlib import Path

# 数据库路径
DB_PATH = Path(__file__).parent / "novel_editor.db"


def get_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """初始化数据库，创建所有表"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # 创建 characters 表（人设库）
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gender TEXT,
            age TEXT,
            role_type TEXT,
            personality TEXT,
            ability TEXT,
            background TEXT,
            tags TEXT,
            source TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # 创建 names 表（名字库）
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS names (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gender TEXT,
            style TEXT,
            tags TEXT,
            usage_count INTEGER DEFAULT 0
        )
    """)
    
    # 创建 plots 表（桥段库）
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS plots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            category TEXT,
            content TEXT,
            tags TEXT,
            source_work TEXT
        )
    """)
    
    # 创建索引
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_char_tags ON characters(tags)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_char_role ON characters(role_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_char_ability ON characters(ability)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_names_style ON names(style)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_names_gender ON names(gender)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_plots_category ON plots(category)")
    
    conn.commit()
    conn.close()
    print(f"✅ 数据库初始化完成: {DB_PATH}")


def reset_database():
    """重置数据库（删除所有数据）"""
    if DB_PATH.exists():
        DB_PATH.unlink()
        print(f"🗑️  已删除旧数据库")
    init_database()


if __name__ == "__main__":
    init_database()
