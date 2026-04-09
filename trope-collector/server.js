const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
const dbPath = path.join(__dirname, 'tropes.db');
const db = new sqlite3.Database(dbPath);

// 创建表结构
db.serialize(() => {
  // 分类表
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sub_types TEXT
  )`);

  // 桥段表
  db.run(`CREATE TABLE IF NOT EXISTS tropes (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    sub_type TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    book TEXT,
    author TEXT,
    year INTEGER,
    tags TEXT,
    use_count INTEGER DEFAULT 0,
    is_user_added INTEGER DEFAULT 0,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 检查是否需要初始化数据
  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) {
      console.error('检查数据库错误:', err);
      return;
    }
    if (row.count === 0) {
      console.log('初始化数据库数据...');
      initData();
    }
  });
});

// 从JSON文件初始化数据
function initData() {
  const dataPath = path.join(__dirname, 'data.json');
  if (!fs.existsSync(dataPath)) {
    console.log('未找到data.json，跳过初始化');
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // 插入分类
  const categoryStmt = db.prepare(`INSERT INTO categories (id, name, description, sub_types) VALUES (?, ?, ?, ?)`);
  data.categories.forEach(cat => {
    categoryStmt.run(cat.id, cat.name, cat.description, JSON.stringify(cat.subTypes || []));
  });
  categoryStmt.finalize();

  // 插入桥段
  const tropeStmt = db.prepare(`
    INSERT INTO tropes (id, category, sub_type, title, content, book, author, year, tags, use_count, is_user_added, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  data.tropes.forEach(trope => {
    tropeStmt.run(
      trope.id,
      trope.category,
      trope.subType || null,
      trope.title,
      trope.content,
      trope.book || null,
      trope.author || null,
      trope.year || null,
      JSON.stringify(trope.tags || []),
      trope.useCount || 0,
      trope.isUserAdded ? 1 : 0,
      trope.source || null
    );
  });
  tropeStmt.finalize();

  console.log(`已初始化 ${data.categories.length} 个分类，${data.tropes.length} 个桥段`);
}

// API路由

// 获取所有分类
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // 解析sub_types
    const categories = rows.map(row => ({
      ...row,
      sub_types: JSON.parse(row.sub_types || '[]')
    }));
    res.json(categories);
  });
});

// 获取所有桥段（支持筛选）
app.get('/api/tropes', (req, res) => {
  const { category, sub_type, search, limit = 100, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM tropes WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (sub_type) {
    sql += ' AND sub_type = ?';
    params.push(sub_type);
  }

  if (search) {
    sql += ' AND (title LIKE ? OR content LIKE ? OR book LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // 解析tags
    const tropes = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      is_user_added: !!row.is_user_added
    }));
    res.json(tropes);
  });
});

// 获取单个桥段
app.get('/api/tropes/:id', (req, res) => {
  db.get('SELECT * FROM tropes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: '桥段不存在' });
    }
    res.json({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      is_user_added: !!row.is_user_added
    });
  });
});

// 创建桥段
app.post('/api/tropes', (req, res) => {
  const { category, sub_type, title, content, book, author, year, tags, source } = req.body;
  
  if (!category || !title || !content) {
    return res.status(400).json({ error: '缺少必要字段: category, title, content' });
  }

  const id = 'trope_' + Date.now();
  
  db.run(`
    INSERT INTO tropes (id, category, sub_type, title, content, book, author, year, tags, is_user_added, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `, [id, category, sub_type, title, content, book, author, year, JSON.stringify(tags || []), source], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: '桥段创建成功' });
  });
});

// 更新桥段
app.put('/api/tropes/:id', (req, res) => {
  const { category, sub_type, title, content, book, author, year, tags, source } = req.body;
  
  db.run(`
    UPDATE tropes SET
      category = COALESCE(?, category),
      sub_type = COALESCE(?, sub_type),
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      book = COALESCE(?, book),
      author = COALESCE(?, author),
      year = COALESCE(?, year),
      tags = COALESCE(?, tags),
      source = COALESCE(?, source),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [category, sub_type, title, content, book, author, year, tags ? JSON.stringify(tags) : null, source, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '桥段不存在' });
    }
    res.json({ message: '桥段更新成功' });
  });
});

// 删除桥段
app.delete('/api/tropes/:id', (req, res) => {
  db.run('DELETE FROM tropes WHERE id = ? AND is_user_added = 1', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '桥段不存在或非用户添加' });
    }
    res.json({ message: '桥段删除成功' });
  });
});

// 增加使用次数
app.post('/api/tropes/:id/use', (req, res) => {
  db.run('UPDATE tropes SET use_count = use_count + 1 WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '桥段不存在' });
    }
    res.json({ message: '使用次数已更新' });
  });
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  db.get(`
    SELECT 
      COUNT(*) as total_tropes,
      COUNT(CASE WHEN is_user_added = 1 THEN 1 END) as user_tropes,
      COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today_tropes
    FROM tropes
  `, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.get('SELECT COUNT(*) as total_categories FROM categories', (err2, row2) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }
      res.json({
        ...row,
        total_categories: row2.total_categories
      });
    });
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`桥段素材库API服务器运行在端口 ${PORT}`);
  console.log(`API文档:`);
  console.log(`  GET  /api/categories     - 获取所有分类`);
  console.log(`  GET  /api/tropes         - 获取桥段列表(支持?category=&sub_type=&search=)`);
  console.log(`  GET  /api/tropes/:id     - 获取单个桥段`);
  console.log(`  POST /api/tropes         - 创建桥段`);
  console.log(`  PUT  /api/tropes/:id     - 更新桥段`);
  console.log(`  DELETE /api/tropes/:id   - 删除桥段(仅用户添加的)`);
  console.log(`  POST /api/tropes/:id/use - 增加使用次数`);
  console.log(`  GET  /api/stats          - 获取统计信息`);
});

// 优雅关闭
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('数据库连接已关闭');
    process.exit(0);
  });
});
