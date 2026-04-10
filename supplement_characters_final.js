const fs = require('fs');

// 读取当前数据
const charactersAll = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', 'utf8'));

// 最后一批需要补充的角色
const finalCharacters = {
  "兽血沸腾": [
    { name: "匹格族战士", gender: "男", role: "配角", personality: "勇猛忠诚、匹格族战士", description: "《兽血沸腾》重要配角，匹格族战士，跟随刘震撼征战。", author: "静官", year: 2006, tags: ["匹格族", "战士", "忠诚"] }
  ],
  "神墓": [
    { name: "紫金神龙", gender: "男", role: "配角", personality: "痞气十足、紫金神龙", description: "《神墓》重要配角，紫金神龙，辰南的伙伴，性格痞气。", author: "辰东", year: 2006, tags: ["神龙", "紫金", "痞气"] }
  ],
  "亵渎": [
    { name: "神圣骑士", gender: "男", role: "配角", personality: "信仰坚定、神圣骑士", description: "《亵渎》重要配角，神圣骑士，罗格的对手兼盟友。", author: "烟雨江南", year: 2006, tags: ["骑士", "神圣", "信仰"] }
  ],
  "回到明朝当王爷": [
    { name: "永福公主", gender: "女", role: "配角", personality: "温婉贤淑、皇室公主", description: "《回到明朝当王爷》重要配角，永福公主，张天涯的红颜知己。", author: "月关", year: 2007, tags: ["公主", "温婉", "皇室"] }
  ],
  "无限恐怖": [
    { name: "赵樱空", gender: "女", role: "配角", personality: "冷静刺客、赵家天才", description: "《无限恐怖》重要配角，赵樱空，刺客世家天才，中洲队成员。", author: "zhttty", year: 2007, tags: ["刺客", "天才", "冷静"] }
  ],
  "庆余年": [
    { name: "五竹", gender: "男", role: "配角", personality: "神秘强大、蒙眼高手", description: "《庆余年》重要配角，五竹，范闲的守护者，神秘强大。", author: "猫腻", year: 2007, tags: ["五竹", "神秘", "守护"] }
  ],
  "恶魔法则": [
    { name: "艾露", gender: "女", role: "配角", personality: "大雪山弟子、杜维红颜", description: "《恶魔法则》重要配角，艾露，大雪山弟子，杜维的红颜知己。", author: "跳舞", year: 2008, tags: ["大雪山", "红颜", "弟子"] }
  ],
  "盘龙": [
    { name: "希塞", gender: "男", role: "配角", personality: "杀手之王、圣域强者", description: "《盘龙》重要配角，希塞，杀手之王，林雷的好友。", author: "我吃西红柿", year: 2008, tags: ["杀手", "圣域", "好友"] },
    { name: "沃顿", gender: "男", role: "配角", personality: "龙血战士、林雷弟弟", description: "《盘龙》重要配角，沃顿，林雷的弟弟，龙血战士。", author: "我吃西红柿", year: 2008, tags: ["弟弟", "龙血", "战士"] }
  ],
  "圣墟": [
    { name: "周曦", gender: "女", role: "女主", personality: "阳间贵女、楚风红颜", description: "《圣墟》女主角，周曦，阳间贵女，楚风的红颜知己。", author: "辰东", year: 2017, tags: ["贵女", "红颜", "阳间"] }
  ],
  "牧神记": [
    { name: "村长爷爷", gender: "男", role: "配角", personality: "残老村之首、智慧深沉", description: "《牧神记》重要配角，村长爷爷，残老村之首，对秦牧影响深远。", author: "宅猪", year: 2018, tags: ["村长", "残老", "智慧"] }
  ],
  "雪中悍刀行": [
    { name: "徐脂虎", gender: "女", role: "配角", personality: "大姐、病弱但坚强", description: "《雪中悍刀行》重要配角，徐脂虎，徐凤年的大姐，病弱但坚强。", author: "烽火戏诸侯", year: 2012, tags: ["大姐", "病弱", "坚强"] },
    { name: "徐渭熊", gender: "女", role: "配角", personality: "二姐、智计无双", description: "《雪中悍刀行》重要配角，徐渭熊，徐凤年的二姐，智计无双。", author: "烽火戏诸侯", year: 2012, tags: ["二姐", "智计", "无双"] }
  ],
  "星门": [
    { name: "李皓父亲", gender: "男", role: "配角", personality: "慈爱严厉、李家后人", description: "《星门》重要配角，李皓的父亲，慈爱严厉。", author: "老鹰吃小鸡", year: 2021, tags: ["父亲", "慈爱", "李家"] }
  ]
};

console.log('=== 最后一批角色补充开始 ===\n');

// 统计当前每本书的角色数量
const bookStats = {};
for (const char of charactersAll.characters) {
  const book = char.book;
  if (!bookStats[book]) {
    bookStats[book] = { count: 0 };
  }
  bookStats[book].count++;
}

let addedCount = 0;
let addedDetails = [];

// 补充角色
for (const [book, characters] of Object.entries(finalCharacters)) {
  const currentCount = bookStats[book]?.count || 0;
  
  if (currentCount >= 8) continue;
  
  const needed = 8 - currentCount;
  const toAdd = characters.slice(0, needed);
  
  for (const char of toAdd) {
    const newChar = {
      name: char.name,
      gender: char.gender,
      role: char.role,
      personality: char.personality,
      description: char.description,
      book: book,
      author: char.author,
      year: char.year,
      tags: char.tags
    };
    
    charactersAll.characters.push(newChar);
    addedCount++;
    addedDetails.push({ book, name: char.name, role: char.role });
  }
  
  console.log(`${book}: ${currentCount}个 → ${currentCount + toAdd.length}个角色 (补充${toAdd.length}个)`);
}

// 更新统计
const newBookStats = {};
for (const char of charactersAll.characters) {
  const book = char.book;
  if (!newBookStats[book]) {
    newBookStats[book] = { count: 0, protagonist: 0, antagonist: 0, supporting: 0, female: 0 };
  }
  newBookStats[book].count++;
  if (char.role === '主角') newBookStats[book].protagonist++;
  else if (char.role === '反派') newBookStats[book].antagonist++;
  else if (char.role === '配角') newBookStats[book].supporting++;
  if (char.gender === '女') newBookStats[book].female++;
}

console.log('\n=== 最终补充完成 ===');
console.log(`本轮新增角色数: ${addedCount}`);
console.log(`当前总角色数: ${charactersAll.characters.length}`);

// 检查是否所有书都达到8个角色
let booksWith8Plus = 0;
let booksNeedMore = [];
for (const [book, stats] of Object.entries(newBookStats)) {
  if (stats.count >= 8) booksWith8Plus++;
  else booksNeedMore.push({ book, ...stats });
}

console.log(`\n达到8个角色的书籍: ${booksWith8Plus}/${Object.keys(newBookStats).length}`);

if (booksNeedMore.length > 0) {
  console.log('\n仍不足8个角色的书:');
  for (const item of booksNeedMore) {
    console.log(`  ${item.book}: ${item.count}个 还需${8 - item.count}个`);
  }
} else {
  console.log('\n✅ 所有书籍均已达到8个角色！');
}

// 更新文件元数据
charactersAll.total_characters = charactersAll.characters.length;
charactersAll.updated = '2026-04-10';
charactersAll.version = '1.3';

// 保存文件
fs.writeFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', JSON.stringify(charactersAll, null, 2), 'utf8');

console.log('\n✅ 已保存最终版本的 characters_all.json');

// 统计报告
console.log('\n=== 最终统计报告 ===');
console.log(`总书籍数: ${Object.keys(newBookStats).length}`);
console.log(`总角色数: ${charactersAll.characters.length}`);
console.log(`平均每本书角色数: ${(charactersAll.characters.length / Object.keys(newBookStats).length).toFixed(1)}`);

let totalProtagonist = 0;
let totalAntagonist = 0;
let totalSupporting = 0;
let totalFemale = 0;
for (const stats of Object.values(newBookStats)) {
  totalProtagonist += stats.protagonist;
  totalAntagonist += stats.antagonist;
  totalSupporting += stats.supporting;
  totalFemale += stats.female;
}

console.log(`\n角色类型分布:`);
console.log(`  主角: ${totalProtagonist}个`);
console.log(`  反派: ${totalAntagonist}个`);
console.log(`  配角: ${totalSupporting}个`);
console.log(`\n性别分布:`);
console.log(`  女性角色: ${totalFemale}个`);
console.log(`  男性角色: ${charactersAll.characters.length - totalFemale}个`);

console.log('\n=== 补充前后对比 ===');
console.log(`补充前: 267个角色`);
console.log(`补充后: ${charactersAll.characters.length}个角色`);
console.log(`新增: ${charactersAll.characters.length - 267}个角色`);
console.log(`增长率: ${((charactersAll.characters.length - 267) / 267 * 100).toFixed(1)}%`);
