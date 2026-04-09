// 阿里云函数计算入口
'use strict';

var data = {
  categories: [
    { id: 'identity', name: '身份类' },
    { id: 'conflict', name: '冲突类' },
    { id: 'ability', name: '能力类' },
    { id: 'scene', name: '场景类' },
    { id: 'emotion', name: '情感类' },
    { id: 'intelligence', name: '智斗类' },
    { id: 'resource', name: '资源类' },
    { id: 'relationship', name: '关系类' },
    { id: 'special', name: '特殊类' }
  ],
  tropes: [
    { id: 'trope_001', category: 'conflict', title: '三年之约', content: '天才少年一朝陨落，被未婚妻当众羞辱退婚。少年立下三年之约，届时上门讨回尊严。', book: '斗破苍穹' },
    { id: 'trope_002', category: 'ability', title: '戒指里的老爷爷', content: '主角意外获得一枚神秘戒指，里面藏着一位远古强者的灵魂，从此开启修行之路。', book: '斗破苍穹' },
    { id: 'trope_003', category: 'conflict', title: '测试震惊全场', content: '主角参加宗门测试，众人以为他是废物，结果测出天灵根/满级天赋，全场震惊。', book: '凡人修仙传' },
    { id: 'trope_004', category: 'identity', title: '废品炼丹师', content: '主角炼丹水平极高，却伪装成一品炼丹师，在炼丹大会上让对手轻敌后惨败。', book: '武炼巅峰' },
    { id: 'trope_005', category: 'intelligence', title: '借刀杀人', content: '主角实力不足以对抗强敌，巧妙设局让两个敌对势力互相残杀，自己坐收渔利。', book: '雪中悍刀行' },
    { id: 'trope_006', category: 'identity', title: '废物竟是绝世高手', content: '门派中的扫地僧/外门弟子一直被当成废物，直到宗门大难才显露真实修为。', book: '一念永恒' },
    { id: 'trope_007', category: 'ability', title: '越级秒杀', content: '筑基期主角遭遇金丹期对手，底牌尽出，以弱胜强完成越级反杀。', book: '仙逆' },
    { id: 'trope_008', category: 'ability', title: '绝境突破', content: '主角被逼入绝境，濒死之际突破瓶颈，不仅伤势痊愈，修为更是暴涨。', book: '完美世界' },
    { id: 'trope_009', category: 'resource', title: '不经意间露富', content: '主角随手拿出的普通物品其实是绝世珍品，众人震惊而主角一脸茫然。', book: '从前有座灵剑山' },
    { id: 'trope_010', category: 'scene', title: '拍卖会竞价', content: '反派嘲讽主角没钱，结果主角直接加价十倍，用财力碾压后揭露身份。', book: '斗罗大陆' }
  ]
};

exports.handler = function(event, context, callback) {
  var request = JSON.parse(event);
  var path = request.path || '/';
  var method = request.httpMethod || 'GET';
  
  var response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
  
  if (path === '/api/categories') {
    response.body = JSON.stringify(data.categories);
  } else if (path === '/api/tropes') {
    response.body = JSON.stringify(data.tropes);
  } else if (path === '/api/health') {
    response.body = JSON.stringify({ status: 'ok', count: data.tropes.length });
  } else {
    response.body = JSON.stringify({ message: 'API is running', endpoints: ['/api/categories', '/api/tropes', '/api/health'] });
  }
  
  callback(null, response);
};
