const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// 内存数据库
const db = new sqlite3.Database(':memory:');

// 初始化数据
const initData = {
  categories: [
    { id: 'identity', name: '身份类', description: '涉及身份隐藏、揭露、转换的桥段', subTypes: ['扮猪吃老虎', '身份揭露/认亲', '重生/穿越', '马甲掉落', '假死脱身', '替身梗', '双面间谍'] },
    { id: 'conflict', name: '冲突类', description: '制造矛盾与对抗的桥段', subTypes: ['装逼打脸', '退婚流', '复仇流', '越级反杀', '绝境翻盘', '快意恩仇', '杀鸡儆猴'] },
    { id: 'ability', name: '能力类', description: '主角获得或展示能力的桥段', subTypes: ['废材逆袭', '金手指/系统流', '升级流', '顿悟突破', '底牌爆发', '破而后立'] },
    { id: 'scene', name: '场景类', description: '特定场合下的经典桥段', subTypes: ['拍卖会', '秘境探险', '宗门大比', '学院流', '副本闯关', '天梯赛'] },
    { id: 'emotion', name: '情感类', description: '涉及人物情感关系的桥段', subTypes: ['英雄救美', '追妻火葬场', '双向奔赴', '久别重逢', '欢喜冤家', '救赎文学'] },
    { id: 'intelligence', name: '智斗类', description: '用计谋策略取胜的桥段', subTypes: ['运筹帷幄', '借刀杀人', '信息差碾压', '精准预判', '计中计', '连环计'] },
    { id: 'resource', name: '资源类', description: '获取或利用资源的桥段', subTypes: ['捡漏', '夺宝', '炼丹', '闷声发大财', '天降机缘', '截胡机缘'] },
    { id: 'relationship', name: '关系类', description: '建立或维护人际关系的桥段', subTypes: ['师徒羁绊', '兄弟情深', '护短名场面', '宿敌对决'] },
    { id: 'special', name: '特殊类', description: '特殊设定或流派的桥段', subTypes: ['重生复仇', '穿书自救', '快穿任务', '无限流副本'] }
  ],
  tropes: [
    { id: 'trope_001', category: 'conflict', subType: '装逼打脸', title: '三年之约', content: '天才少年一朝陨落，被未婚妻当众羞辱退婚。少年立下三年之约，届时上门讨回尊严。', book: '斗破苍穹', author: '天蚕土豆', year: 2009, tags: ['玄幻', '逆袭', '热血'] },
    { id: 'trope_002', category: 'ability', subType: '金手指/系统流', title: '戒指里的老爷爷', content: '主角意外获得一枚神秘戒指，里面藏着一位远古强者的灵魂，从此开启修行之路。', book: '斗破苍穹', author: '天蚕土豆', year: 2009, tags: ['玄幻', '金手指', '传承'] },
    { id: 'trope_003', category: 'conflict', subType: '装逼打脸', title: '测试震惊全场', content: '主角参加宗门测试，众人以为他是废物，结果测出天灵根/满级天赋，全场震惊。', book: '凡人修仙传', author: '忘语', year: 2008, tags: ['仙侠', '测试', '天赋'] },
    { id: 'trope_004', category: 'identity', subType: '扮猪吃老虎', title: '废品炼丹师', content: '主角炼丹水平极高，却伪装成一品炼丹师，在炼丹大会上让对手轻敌后惨败。', book: '武炼巅峰', author: '莫默', year: 2012, tags: ['玄幻', '炼丹', '伪装'] },
    { id: 'trope_005', category: 'intelligence', subType: '借刀杀人', title: '借刀杀人', content: '主角实力不足以对抗强敌，巧妙设局让两个敌对势力互相残杀，自己坐收渔利。', book: '雪中悍刀行', author: '烽火戏诸侯', year: 2012, tags: ['武侠', '谋略', '权谋'] },
    { id: 'trope_006', category: 'identity', subType: '身份揭露/认亲', title: '废物竟是绝世高手', content: '门派中的扫地僧/外门弟子一直被当成废物，直到宗门大难才显露真实修为。', book: '一念永恒', author: '耳根', year: 2016, tags: ['仙侠', '隐藏', '强者'] },
    { id: 'trope_007', category: 'ability', subType: '越级挑战', title: '越级秒杀', content: '筑基期主角遭遇金丹期对手，底牌尽出，以弱胜强完成越级反杀。', book: '仙逆', author: '耳根', year: 2009, tags: ['仙侠', '战斗', '底牌'] },
    { id: 'trope_008', category: 'ability', subType: '顿悟突破', title: '绝境突破', content: '主角被逼入绝境，濒死之际突破瓶颈，不仅伤势痊愈，修为更是暴涨。', book: '完美世界', author: '辰东', year: 2013, tags: ['玄幻', '突破', '反杀'] },
    { id: 'trope_009', category: 'resource', subType: '闷声发大财', title: '不经意间露富', content: '主角随手拿出的普通物品其实是绝世珍品，众人震惊而主角一脸茫然。', book: '从前有座灵剑山', author: '国王陛下', year: 2013, tags: ['仙侠', '搞笑', '装逼'] },
    { id: 'trope_010', category: 'scene', subType: '拍卖会', title: '拍卖会竞价', content: '反派嘲讽主角没钱，结果主角直接加价十倍，用财力碾压后揭露身份。', book: '斗罗大陆', author: '唐家三少', year: 2008, tags: ['玄幻', '拍卖会', '财富'] },
    { id: 'trope_011', category: 'identity', subType: '扮猪吃老虎', title: '傻子人设伪装', content: '主角顶着傻子名号让对手放松警惕，实则暗中布局，关键时刻一击致命。', book: '各类爽文', author: '通用', year: 2015, tags: ['都市', '伪装', '复仇'] },
    { id: 'trope_012', category: 'intelligence', subType: '运筹帷幄', title: '草船借箭', content: '主角利用敌人资源为己所用，通过智慧而非武力获取所需。', book: '三国演义', author: '罗贯中', year: 1400, tags: ['谋略', '借势', '经典'] },
    { id: 'trope_013', category: 'emotion', subType: '英雄救美', title: '英雄救美', content: '女主角遭遇危险，千钧一发之际主角挺身而出，结下情缘或让对方改观。', book: '各类网文', author: '通用', year: 2005, tags: ['情感', '邂逅', '经典'] },
    { id: 'trope_014', category: 'emotion', subType: '追妻火葬场', title: '追妻火葬场', content: '男主前期对女主冷漠/伤害，失去后才追悔莫及，开启疯狂追妻模式。', book: '各类言情', author: '通用', year: 2010, tags: ['言情', '虐恋', '后悔'] },
    { id: 'trope_015', category: 'relationship', subType: '师徒羁绊', title: '师徒诀别', content: '师父为救主角燃烧生命施展禁术，临终前将毕生修为传给主角。', book: '诛仙', author: '萧鼎', year: 2003, tags: ['仙侠', '师徒', '传承'] },
    { id: 'trope_016', category: 'resource', subType: '捡漏', title: '废物鉴宝', content: '众人眼中的废物却能看出别人看不出的宝物价值，以极低价格捡漏珍品。', book: '遮天', author: '辰东', year: 2010, tags: ['玄幻', '鉴宝', '眼力'] },
    { id: 'trope_017', category: 'scene', subType: '学院流', title: '低调炫技', content: '主角故意隐藏修为，在朋友遇险时恰好展现实力救人，装逼于无形。', book: '天道图书馆', author: '横扫天涯', year: 2017, tags: ['玄幻', '装逼', '教学'] },
    { id: 'trope_018', category: 'special', subType: '重生复仇', title: '重生复仇', content: '主角带着前世记忆重生，利用先知优势改变命运，手撕前世仇人。', book: '各类重生文', author: '通用', year: 2012, tags: ['重生', '复仇', '爽文'] },
    { id: 'trope_019', category: 'ability', subType: '金手指/系统流', title: '系统绑定', content: '主角平凡无奇，意外绑定系统，从此可以通过完成任务获得奖励。', book: '最强反套路系统', author: '太上布衣', year: 2017, tags: ['系统', '搞笑', '无敌'] },
    { id: 'trope_020', category: 'conflict', subType: '装逼打脸', title: '多底牌爆发', content: '主角面对强敌，一张底牌接一张底牌掀开，让对手从嚣张到绝望。', book: '各类爽文', author: '通用', year: 2015, tags: ['战斗', '底牌', '惊喜'] }
  ]
};

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, description TEXT, sub_types TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS tropes (id TEXT PRIMARY KEY, category TEXT, sub_type TEXT, title TEXT, content TEXT, book TEXT, author TEXT, year INTEGER, tags TEXT)`);
  
  const cstmt = db.prepare('INSERT OR IGNORE INTO categories VALUES (?,?,?,?)');
  initData.categories.forEach(c => cstmt.run(c.id, c.name, c.description, JSON.stringify(c.subTypes)));
  cstmt.finalize();
  
  const tstmt = db.prepare('INSERT OR IGNORE INTO tropes VALUES (?,?,?,?,?,?,?,?,?)');
  initData.tropes.forEach(t => tstmt.run(t.id, t.category, t.subType, t.title, t.content, t.book, t.author, t.year, JSON.stringify(t.tags)));
  tstmt.finalize();
});

app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, sub_types: JSON.parse(r.sub_types || '[]') })));
  });
});

app.get('/api/tropes', (req, res) => {
  const { category, search } = req.query;
  let sql = 'SELECT * FROM tropes';
  let params = [];
  if (category) { sql += ' WHERE category = ?'; params.push(category); }
  if (search) { sql += category ? ' AND' : ' WHERE'; sql += ' (title LIKE ? OR content LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') })));
  });
});

app.post('/api/tropes', (req, res) => {
  const { category, subType, title, content, book, author, year, tags } = req.body;
  const id = 'trope_' + Date.now();
  db.run('INSERT INTO tropes VALUES (?,?,?,?,?,?,?,?,?)', [id, category, subType, title, content, book, author, year, JSON.stringify(tags || [])], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, category, subType, title, content, book, author, year, tags });
  });
});

module.exports = app;
