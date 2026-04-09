from dataclasses import dataclass, asdict
from typing import Optional, List
from datetime import datetime
import json


@dataclass
class Character:
    """角色/人设数据模型"""
    name: str
    gender: Optional[str] = None
    age: Optional[str] = None
    role_type: Optional[str] = None  # 主角/配角/反派/龙套
    personality: Optional[str] = None
    ability: Optional[str] = None
    background: Optional[str] = None
    tags: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    id: Optional[int] = None
    created_at: Optional[str] = None
    
    def to_dict(self) -> dict:
        return asdict(self)
    
    @classmethod
    def from_row(cls, row: dict) -> "Character":
        return cls(
            id=row.get("id"),
            name=row.get("name"),
            gender=row.get("gender"),
            age=row.get("age"),
            role_type=row.get("role_type"),
            personality=row.get("personality"),
            ability=row.get("ability"),
            background=row.get("background"),
            tags=row.get("tags"),
            source=row.get("source"),
            notes=row.get("notes"),
            created_at=row.get("created_at")
        )
    
    def display(self):
        """格式化显示角色信息"""
        lines = [f"\n{'='*50}"]
        lines.append(f"🎭 {self.name}" + (f" [{self.role_type}]" if self.role_type else ""))
        lines.append(f"{'='*50}")
        
        if self.gender:
            lines.append(f"性别: {self.gender}")
        if self.age:
            lines.append(f"年龄: {self.age}")
        if self.ability:
            lines.append(f"能力: {self.ability}")
        if self.personality:
            lines.append(f"性格: {self.personality}")
        if self.background:
            lines.append(f"背景: {self.background}")
        if self.tags:
            lines.append(f"标签: {self.tags}")
        if self.source:
            lines.append(f"来源: {self.source}")
        if self.notes:
            lines.append(f"备注: {self.notes}")
            
        return "\n".join(lines)


@dataclass
class Name:
    """名字数据模型"""
    name: str
    gender: Optional[str] = None
    style: Optional[str] = None  # 现代/西幻/仙侠/科幻/古风/通用
    tags: Optional[str] = None
    usage_count: int = 0
    id: Optional[int] = None
    
    def to_dict(self) -> dict:
        return asdict(self)
    
    @classmethod
    def from_row(cls, row: dict) -> "Name":
        return cls(
            id=row.get("id"),
            name=row.get("name"),
            gender=row.get("gender"),
            style=row.get("style"),
            tags=row.get("tags"),
            usage_count=row.get("usage_count", 0)
        )


@dataclass
class Plot:
    """桥段/情节数据模型"""
    title: Optional[str] = None
    category: Optional[str] = None  # 打脸/升级/反转/揭秘/情感/战斗
    content: Optional[str] = None
    tags: Optional[str] = None
    source_work: Optional[str] = None
    id: Optional[int] = None
    
    def to_dict(self) -> dict:
        return asdict(self)
    
    @classmethod
    def from_row(cls, row: dict) -> "Plot":
        return cls(
            id=row.get("id"),
            title=row.get("title"),
            category=row.get("category"),
            content=row.get("content"),
            tags=row.get("tags"),
            source_work=row.get("source_work")
        )
    
    def display(self):
        """格式化显示桥段信息"""
        lines = [f"\n{'='*50}"]
        title = self.title or "未命名桥段"
        cat = f" [{self.category}]" if self.category else ""
        lines.append(f"📖 {title}{cat}")
        lines.append(f"{'='*50}")
        
        if self.content:
            lines.append(f"\n{self.content}\n")
        if self.tags:
            lines.append(f"标签: {self.tags}")
        if self.source_work:
            lines.append(f"出处: {self.source_work}")
            
        return "\n".join(lines)


# 数据库操作类
class CharacterDB:
    """角色数据库操作"""
    
    def __init__(self, conn):
        self.conn = conn
    
    def add(self, char: Character) -> int:
        """添加角色"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO characters (name, gender, age, role_type, personality, 
                                   ability, background, tags, source, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (char.name, char.gender, char.age, char.role_type, char.personality,
              char.ability, char.background, char.tags, char.source, char.notes))
        self.conn.commit()
        return cursor.lastrowid
    
    def search(self, tag: str = None, ability: str = None, role: str = None, keyword: str = None) -> List[Character]:
        """搜索角色"""
        cursor = self.conn.cursor()
        query = "SELECT * FROM characters WHERE 1=1"
        params = []
        
        if tag:
            query += " AND tags LIKE ?"
            params.append(f"%{tag}%")
        if ability:
            query += " AND ability LIKE ?"
            params.append(f"%{ability}%")
        if role:
            query += " AND role_type = ?"
            params.append(role)
        if keyword:
            query += " AND (name LIKE ? OR personality LIKE ? OR background LIKE ? OR notes LIKE ?)"
            params.extend([f"%{keyword}%"] * 4)
        
        query += " ORDER BY created_at DESC"
        cursor.execute(query, params)
        return [Character.from_row(dict(row)) for row in cursor.fetchall()]
    
    def get_all(self) -> List[Character]:
        """获取所有角色"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM characters ORDER BY created_at DESC")
        return [Character.from_row(dict(row)) for row in cursor.fetchall()]
    
    def get_by_id(self, char_id: int) -> Optional[Character]:
        """根据ID获取角色"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM characters WHERE id = ?", (char_id,))
        row = cursor.fetchone()
        return Character.from_row(dict(row)) if row else None
    
    def delete(self, char_id: int):
        """删除角色"""
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM characters WHERE id = ?", (char_id,))
        self.conn.commit()


class NameDB:
    """名字数据库操作"""
    
    def __init__(self, conn):
        self.conn = conn
    
    def add(self, name: Name) -> int:
        """添加名字"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO names (name, gender, style, tags, usage_count)
            VALUES (?, ?, ?, ?, ?)
        """, (name.name, name.gender, name.style, name.tags, name.usage_count))
        self.conn.commit()
        return cursor.lastrowid
    
    def search(self, style: str = None, gender: str = None, keyword: str = None) -> List[Name]:
        """搜索名字"""
        cursor = self.conn.cursor()
        query = "SELECT * FROM names WHERE 1=1"
        params = []
        
        if style:
            query += " AND style = ?"
            params.append(style)
        if gender:
            query += " AND gender = ?"
            params.append(gender)
        if keyword:
            query += " AND name LIKE ?"
            params.append(f"%{keyword}%")
        
        cursor.execute(query, params)
        return [Name.from_row(dict(row)) for row in cursor.fetchall()]
    
    def get_all(self) -> List[Name]:
        """获取所有名字"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM names ORDER BY usage_count DESC")
        return [Name.from_row(dict(row)) for row in cursor.fetchall()]
    
    def increment_usage(self, name_id: int):
        """增加使用计数"""
        cursor = self.conn.cursor()
        cursor.execute("UPDATE names SET usage_count = usage_count + 1 WHERE id = ?", (name_id,))
        self.conn.commit()


class PlotDB:
    """桥段数据库操作"""
    
    def __init__(self, conn):
        self.conn = conn
    
    def add(self, plot: Plot) -> int:
        """添加桥段"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO plots (title, category, content, tags, source_work)
            VALUES (?, ?, ?, ?, ?)
        """, (plot.title, plot.category, plot.content, plot.tags, plot.source_work))
        self.conn.commit()
        return cursor.lastrowid
    
    def search(self, category: str = None, keyword: str = None) -> List[Plot]:
        """搜索桥段"""
        cursor = self.conn.cursor()
        query = "SELECT * FROM plots WHERE 1=1"
        params = []
        
        if category:
            query += " AND category = ?"
            params.append(category)
        if keyword:
            query += " AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)"
            params.extend([f"%{keyword}%"] * 3)
        
        cursor.execute(query, params)
        return [Plot.from_row(dict(row)) for row in cursor.fetchall()]
    
    def get_all(self) -> List[Plot]:
        """获取所有桥段"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM plots ORDER BY id DESC")
        return [Plot.from_row(dict(row)) for row in cursor.fetchall()]
    
    def get_by_id(self, plot_id: int) -> Optional[Plot]:
        """根据ID获取桥段"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM plots WHERE id = ?", (plot_id,))
        row = cursor.fetchone()
        return Plot.from_row(dict(row)) if row else None
