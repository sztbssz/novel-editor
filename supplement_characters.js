const fs = require('fs');
const path = require('path');

// 读取所有角色数据
const charactersAll = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', 'utf8'));
const batchFiles = [
  '/root/.openclaw/workspace/novel-editor/characters_2006_2007.json',
  '/root/.openclaw/workspace/novel-editor/characters_2008.json',
  '/root/.openclaw/workspace/novel-editor/characters_2009_2010.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch1.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch2.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch3.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch4.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch5.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch6.json',
  '/root/.openclaw/workspace/novel-editor/characters_2016_2020_batch7.json',
  '/root/.openclaw/workspace/novel-editor/characters_2021_2026_batch1.json',
  '/root/.openclaw/workspace/novel-editor/characters_2021_2026_batch2.json',
];

// 收集所有batch中的角色
let allBatchCharacters = [];
for (const file of batchFiles) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const chars = data.characters || data;
    allBatchCharacters = allBatchCharacters.concat(chars);
  } catch (e) {
    console.log(`Error reading ${file}: ${e.message}`);
  }
}

// 标准化角色数据格式
function normalizeCharacter(char) {
  // 解析source字段
  let book = char.book || '';
  let author = char.author || '';
  let year = char.year || 2020;
  
  if (!book && char.source) {
    const parts = char.source.split('|').map(p => p.trim());
    if (parts.length >= 1) book = parts[0];
    if (parts.length >= 2) author = parts[1];
    if (parts.length >= 3) year = parseInt(parts[2]) || 2020;
  }
  
  // 标准化role字段
  let role = char.role || '';
  if (!role && char.role_type) {
    const roleMap = {
      'protagonist': '主角',
      'antagonist': '反派',
      'supporting': '配角'
    };
    role = roleMap[char.role_type] || '配角';
  }
  
  // 标准化description字段
  let description = char.description || char.background || '';
  if (description && book && !description.includes(book)) {
    description = `《${book}》${description}`;
  }
  
  return {
    name: char.name,
    gender: char.gender || '男',
    role: role,
    personality: char.personality || '',
    description: description,
    book: book,
    author: author,
    year: year,
    tags: char.tags || []
  };
}

// 按书分组统计当前角色
const bookStats = {};
for (const char of charactersAll.characters) {
  const book = char.book;
  if (!bookStats[book]) {
    bookStats[book] = {
      characters: [],
      protagonist: [],
      antagonist: [],
      supporting: [],
      female: [],
      male: []
    };
  }
  bookStats[book].characters.push(char);
  
  if (char.role === '主角') bookStats[book].protagonist.push(char);
  else if (char.role === '反派') bookStats[book].antagonist.push(char);
  else if (char.role === '配角') bookStats[book].supporting.push(char);
  
  if (char.gender === '女') bookStats[book].female.push(char);
  else bookStats[book].male.push(char);
}

// 优先补充的书单
const priorityBooks = [
  // 2006-2010
  '兽血沸腾', '神墓', '亵渎', '盘龙', '斗罗大陆', '阳神', '鬼吹灯', '佛本是道',
  '回到明朝当王爷', '极品家丁', '无限恐怖', '庆余年', '星辰变', '寸芒',
  '恶魔法则', '斗破苍穹', '凡人修仙传', '仙逆', '九鼎记', '锦衣夜行',
  '陈二狗的妖孽人生', '盗墓笔记',
  // 2011-2015
  '将夜', '遮天', '雪中悍刀行', '全职高手', '武动乾坤', '吞噬星空',
  // 2016-2020
  '诡秘之主', '大奉打更人', '圣墟', '牧神记', '一念永恒', '完美世界',
  '大王饶命', '全球高武', '修真聊天群', '雪中悍刀行', '惊悚乐园',
  '雪鹰领主', '飞剑问道', '凡人修仙之仙界篇', '道君', '九星毒奶',
  '第一序列', '伏天氏', '谍影风云', '大医凌然', '我真没想重生啊',
  '万族之劫', '我师兄实在太稳健了', '长夜余火', '临渊行', '深空彼岸',
  '从红月开始', '十日终焉', '绍宋', '玄鉴仙族', '我在精神病院学斩神',
  // 2021-2026
  '夜的命名术', '灵境行者', '星门', '赤心巡天', '深海余烬', '宿命之环'
];

console.log('=== 当前角色统计 ===\n');
console.log(`总书籍数: ${Object.keys(bookStats).length}`);
console.log(`总角色数: ${charactersAll.characters.length}`);
console.log(`平均每本书角色数: ${(charactersAll.characters.length / Object.keys(bookStats).length).toFixed(1)}`);

console.log('\n=== 每本书角色数量统计 ===\n');
const sortedBooks = Object.entries(bookStats).sort((a, b) => a[1].characters.length - b[1].characters.length);

let needSupplement = [];
for (const [book, stats] of sortedBooks) {
  const count = stats.characters.length;
  const needProtagonist = stats.protagonist.filter(c => c.gender === '男').length === 0 ? 1 : 0;
  const needVillain = Math.max(0, 2 - stats.antagonist.length);
  const needSupporting = Math.max(0, 5 - stats.supporting.length);
  
  if (count < 8) {
    needSupplement.push({
      book,
      count,
      protagonist: stats.protagonist.length,
      antagonist: stats.antagonist.length,
      supporting: stats.supporting.length,
      needProtagonist,
      needVillain,
      needSupporting
    });
  }
  
  if (count <= 3) {
    console.log(`${book}: ${count}个角色 (主角:${stats.protagonist.length}, 反派:${stats.antagonist.length}, 配角:${stats.supporting.length}) ⚠️ 需要补充`);
  }
}

console.log(`\n=== 需要补充角色的书籍: ${needSupplement.length}本 ===\n`);

// 创建角色名到batch角色的映射
const batchCharMap = new Map();
for (const char of allBatchCharacters) {
  const normalized = normalizeCharacter(char);
  if (normalized.book && normalized.name) {
    const key = `${normalized.book}_${normalized.name}`;
    if (!batchCharMap.has(key)) {
      batchCharMap.set(key, normalized);
    }
  }
}

// 创建当前所有角色的唯一键集合
const existingKeys = new Set();
for (const char of charactersAll.characters) {
  existingKeys.add(`${char.book}_${char.name}`);
}

// 补充角色
let addedCount = 0;
let addedCharacters = [];

for (const need of needSupplement) {
  const book = need.book;
  const bookData = bookStats[book];
  
  // 从batch中找该书的角色
  const availableChars = [];
  for (const [key, char] of batchCharMap) {
    if (char.book === book && !existingKeys.has(key)) {
      availableChars.push(char);
    }
  }
  
  // 按需要的类型排序
  availableChars.sort((a, b) => {
    const aIsProtagonist = a.role === '主角' ? 2 : (a.role === '反派' ? 1 : 0);
    const bIsProtagonist = b.role === '主角' ? 2 : (b.role === '反派' ? 1 : 0);
    return bIsProtagonist - aIsProtagonist;
  });
  
  // 补充到至少8个角色
  const toAdd = availableChars.slice(0, 8 - need.count);
  
  for (const char of toAdd) {
    const newChar = {
      name: char.name,
      gender: char.gender || '男',
      role: char.role || '配角',
      personality: char.personality || '',
      description: char.description || `《${book}》角色`,
      book: book,
      author: bookData.characters[0]?.author || char.author || '未知',
      year: bookData.characters[0]?.year || char.year || 2020,
      tags: char.tags || []
    };
    
    charactersAll.characters.push(newChar);
    addedCharacters.push({ book, name: char.name, role: char.role });
    addedCount++;
  }
}

console.log(`\n=== 补充完成 ===`);
console.log(`补充前角色数: 267`);
console.log(`补充后角色数: ${charactersAll.characters.length}`);
console.log(`新增角色数: ${addedCount}`);

// 更新统计
const newBookStats = {};
for (const char of charactersAll.characters) {
  const book = char.book;
  if (!newBookStats[book]) {
    newBookStats[book] = { count: 0, protagonist: 0, antagonist: 0, supporting: 0 };
  }
  newBookStats[book].count++;
  if (char.role === '主角') newBookStats[book].protagonist++;
  else if (char.role === '反派') newBookStats[book].antagonist++;
  else if (char.role === '配角') newBookStats[book].supporting++;
}

console.log(`\n=== 补充后每本书角色数 ===\n`);
const newSortedBooks = Object.entries(newBookStats).sort((a, b) => a[1].count - b[1].count);
for (const [book, stats] of newSortedBooks) {
  if (stats.count < 8) {
    console.log(`${book}: ${stats.count}个 (主角:${stats.protagonist}, 反派:${stats.antagonist}, 配角:${stats.supporting})`);
  }
}

// 保存更新后的文件
charactersAll.total_characters = charactersAll.characters.length;
charactersAll.updated = '2026-04-10';

fs.writeFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', JSON.stringify(charactersAll, null, 2), 'utf8');
console.log('\n✅ 已保存到 characters_all.json');

// 输出详细的新增角色列表
console.log('\n=== 新增角色列表 ===');
for (const item of addedCharacters.slice(0, 50)) {
  console.log(`- ${item.book}: ${item.name} (${item.role})`);
}
if (addedCharacters.length > 50) {
  console.log(`... 还有 ${addedCharacters.length - 50} 个角色`);
}
