const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

let data = {
  version: '2.1',
  categories: [
    { id: 'identity', name: '身份类', subTypes: ['扮猪吃老虎', '身份揭露/认亲', '重生/穿越', '马甲掉落', '假死脱身', '替身梗', '双面间谍'] },
    { id: 'conflict', name: '冲突类', subTypes: ['装逼打脸', '退婚流', '复仇流', '越级反杀', '绝境翻盘', '快意恩仇', '杀鸡儆猴'] },
    { id: 'ability', name: '能力类', subTypes: ['废材逆袭', '金手指/系统流', '升级流', '顿悟突破', '底牌爆发', '破而后立'] },
    { id: 'scene', name: '场景类', subTypes: ['拍卖会', '秘境探险', '宗门大比', '学院流', '副本闯关', '天梯赛'] },
    { id: 'emotion', name: '情感类', subTypes: ['英雄救美', '追妻火葬场', '双向奔赴', '久别重逢', '欢喜冤家', '救赎文学'] },
    { id: 'intelligence', name: '智斗类', subTypes: ['运筹帷幄', '借刀杀人', '信息差碾压', '精准预判', '计中计', '连环计'] },
    { id: 'resource', name: '资源类', subTypes: ['捡漏', '夺宝', '炼丹', '闷声发大财', '天降机缘', '截胡机缘'] },
    { id: 'relationship', name: '关系类', subTypes: ['师徒羁绊', '兄弟情深', '护短名场面', '宿敌对决'] },
    { id: 'special', name: '特殊类', subTypes: ['重生复仇', '穿书自救', '快穿任务', '无限流副本'] }
  ],
  tropes: [
    { id: 'trope_001', category: 'conflict', subType: '装逼打脸', title: '三年之约', content: '天才少年一朝陨落，被未婚妻当众羞辱退婚。少年立下三年之约，届时上门讨回尊严。', book: '斗破苍穹', author: '天蚕土豆' },
    { id: 'trope_002', category: 'ability', subType: '金手指/系统流', title: '戒指里的老爷爷', content: '主角意外获得一枚神秘戒指，里面藏着一位远古强者的灵魂，从此开启修行之路。', book: '斗破苍穹', author: '天蚕土豆' },
    { id: 'trope_003', category: 'conflict', subType: '装逼打脸', title: '测试震惊全场', content: '主角参加宗门测试，众人以为他是废物，结果测出天灵根/满级天赋，全场震惊。', book: '凡人修仙传', author: '忘语' },
    { id: 'trope_004', category: 'identity', subType: '扮猪吃老虎', title: '废品炼丹师', content: '主角炼丹水平极高，却伪装成一品炼丹师，在炼丹大会上让对手轻敌后惨败。', book: '武炼巅峰', author: '莫默' },
    { id: 'trope_005', category: 'intelligence', subType: '借刀杀人', title: '借刀杀人', content: '主角实力不足以对抗强敌，巧妙设局让两个敌对势力互相残杀，自己坐收渔利。', book: '雪中悍刀行', author: '烽火戏诸侯' },
    { id: 'trope_006', category: 'identity', subType: '身份揭露/认亲', title: '废物竟是绝世高手', content: '门派中的扫地僧/外门弟子一直被当成废物，直到宗门大难才显露真实修为。', book: '一念永恒', author: '耳根' },
    { id: 'trope_007', category: 'ability', subType: '越级挑战', title: '越级秒杀', content: '筑基期主角遭遇金丹期对手，底牌尽出，以弱胜强完成越级反杀。', book: '仙逆', author: '耳根' },
    { id: 'trope_008', category: 'ability', subType: '顿悟突破', title: '绝境突破', content: '主角被逼入绝境，濒死之际突破瓶颈，不仅伤势痊愈，修为更是暴涨。', book: '完美世界', author: '辰东' },
    { id: 'trope_009', category: 'resource', subType: '闷声发大财', title: '不经意间露富', content: '主角随手拿出的普通物品其实是绝世珍品，众人震惊而主角一脸茫然。', book: '从前有座灵剑山', author: '国王陛下' },
    { id: 'trope_010', category: 'scene', subType: '拍卖会', title: '拍卖会竞价', content: '反派嘲讽主角没钱，结果主角直接加价十倍，用财力碾压后揭露身份。', book: '斗罗大陆', author: '唐家三少' }
  ]
};

try {
  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, 'utf8');
    data = JSON.parse(raw);
  }
} catch (e) {
  console.log('Using default data');
}

app.get('/api/categories', function(req, res) {
  res.json(data.categories);
});

app.get('/api/tropes', function(req, res) {
  let tropes = data.tropes;
  if (req.query.category) {
    tropes = tropes.filter(function(t) { return t.category === req.query.category; });
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    tropes = tropes.filter(function(t) {
      return t.title.toLowerCase().indexOf(q) > -1 ||
             t.content.toLowerCase().indexOf(q) > -1;
    });
  }
  res.json(tropes);
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', count: data.tropes.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});
