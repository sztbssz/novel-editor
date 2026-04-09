exports.handler = async (event, context) => {
  const path = event.path || '/';
  
  const data = {
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
      { id: 'trope_003', category: 'conflict', title: '测试震惊全场', content: '主角参加宗门测试，众人以为他是废物，结果测出天灵根/满级天赋，全场震惊。', book: '凡人修仙传' }
    ]
  };
  
  let body;
  if (path === '/api/categories') {
    body = data.categories;
  } else if (path === '/api/tropes') {
    body = data.tropes;
  } else {
    body = { message: 'API running', endpoints: ['/api/categories', '/api/tropes'] };
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
};
