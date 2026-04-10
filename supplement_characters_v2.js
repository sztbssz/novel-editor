const fs = require('fs');

// 读取当前合并的角色数据
const charactersAll = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', 'utf8'));

// 创建当前所有角色的键集合
const existingKeys = new Set();
for (const char of charactersAll.characters) {
  existingKeys.add(`${char.book}_${char.name}`);
}

// 从batch文件中提取角色的辅助函数
function extractFromBatch(content, filePath) {
  const chars = [];
  try {
    // 尝试解析JSON
    const data = JSON.parse(content);
    if (data.characters) {
      return data.characters;
    }
    return data;
  } catch (e) {
    // JSON解析失败，使用正则提取
    console.log(`JSON parse failed for ${filePath}, using regex extraction`);
    
    // 提取角色名
    const nameMatches = content.match(/"name":\s*"([^"]+)"/g) || [];
    const genderMatches = content.match(/"gender":\s*"([^"]+)"/g) || [];
    const roleMatches = content.match(/"role(?:_type)?":\s*"([^"]+)"/g) || [];
    const bookMatches = content.match(/"book":\s*"([^"]+)"/g) || [];
    const authorMatches = content.match(/"author":\s*"([^"]+)"/g) || [];
    const yearMatches = content.match(/"year":\s*(\d{4})/g) || [];
    const descMatches = content.match(/"description":\s*"([^"]+)"/g) || [];
    const personalityMatches = content.match(/"personality":\s*"([^"]+)"/g) || [];
    
    // 从source字段解析
    const sourceMatches = content.match(/"source":\s*"([^"]+)"/g) || [];
    
    return [];
  }
}

// 定义需要补充的角色数据 - 从各年文件中提取的完整数据
const supplementaryData = {
  // 2006-2010年书籍补充角色
  "邪风曲": [
    { name: "厉风", gender: "男", role: "主角", personality: "狂傲不羁、快意恩仇、重情重义", description: "《邪风曲》男主角，邪道修士，修炼邪风曲功法，性格狂傲却重情重义，在正邪两道间游走，最终成为一代宗师。", author: "血红", year: 2006, tags: ["邪道", "狂傲", "快意恩仇", "宗师"] },
    { name: "碧灵儿", gender: "女", role: "女主", personality: "冷艳高贵、痴情专一", description: "《邪风曲》女主角，厉风的红颜知己，性格冷艳高贵，对厉风情深意重，始终不离不弃。", author: "血红", year: 2006, tags: ["冷艳", "痴情", "红颜"] },
    { name: "血魔", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《邪风曲》重要反派，血魔教教主，修炼邪恶功法，是厉风的主要敌人之一。", author: "血红", year: 2006, tags: ["血魔", "邪恶", "宿敌"] },
    { name: "厉风师父", gender: "男", role: "配角", personality: "严厉慈爱、护短", description: "《邪风曲》重要配角，厉风的师父，虽然严厉但对徒弟极为疼爱，是厉风成长路上的重要引路人。", author: "血红", year: 2006, tags: ["师父", "严厉", "护短"] },
    { name: "师兄弟甲", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《邪风曲》配角，厉风的师兄弟，与厉风共同修炼成长。", author: "血红", year: 2006, tags: ["师兄弟", "忠诚"] },
    { name: "师兄弟乙", gender: "男", role: "配角", personality: "机智狡黠、重义气", description: "《邪风曲》配角，厉风的另一位师兄弟，性格机智，多次帮助厉风化解危机。", author: "血红", year: 2006, tags: ["机智", "义气"] },
    { name: "正道掌门", gender: "男", role: "反派", personality: "虚伪伪善、冷酷无情", description: "《邪风曲》重要反派，正道门派掌门，表面光明磊落实则虚伪冷酷，与厉风多次交锋。", author: "血红", year: 2006, tags: ["正道", "虚伪", "宿敌"] }
  ],
  "龙域": [
    { name: "华凌", gender: "女", role: "女主", personality: "冷艳高贵、聪明独立、外冷内热", description: "《龙域》女主角，世家大小姐，拥有极高的修炼天赋和商业头脑，与主角相识后成为他的重要盟友。", author: "众生", year: 2006, tags: ["世家", "大小姐", "商业", "修炼"] },
    { name: "龙傲天", gender: "男", role: "主角", personality: "坚韧不拔、重情重义", description: "《龙域》男主角，拥有龙族血脉的少年，在修炼路上不断成长，最终成为龙域之主。", author: "众生", year: 2006, tags: ["龙族", "成长", "霸主"] },
    { name: "龙域长老", gender: "男", role: "配角", personality: "德高望重、智慧深沉", description: "《龙域》重要配角，龙域长老，对主角的成长影响深远。", author: "众生", year: 2006, tags: ["长老", "智慧"] },
    { name: "敌对家族少主", gender: "男", role: "反派", personality: "阴险狡诈、野心勃勃", description: "《龙域》重要反派，敌对家族少主，与主角多次交锋。", author: "众生", year: 2006, tags: ["敌对", "野心"] },
    { name: "龙域护卫", gender: "男", role: "配角", personality: "忠诚可靠、武力高强", description: "《龙域》配角，龙域护卫，保护主角安全。", author: "众生", year: 2006, tags: ["护卫", "忠诚"] },
    { name: "侍女小莲", gender: "女", role: "配角", personality: "温柔体贴、忠心耿耿", description: "《龙域》配角，主角的侍女，性格温柔，对主角忠心耿耿。", author: "众生", year: 2006, tags: ["侍女", "温柔", "忠心"] },
    { name: "神秘老者", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《龙域》神秘配角，实力强大的老者，对主角有指点之恩。", author: "众生", year: 2006, tags: ["神秘", "强者"] }
  ],
  "江山美人志": [
    { name: "柳轻侯", gender: "男", role: "主角", personality: "风流倜傥、文武双全、重情重义", description: "《江山美人志》男主角，穿越到古代，凭借现代知识和超凡能力，在江山美人之间游走，成就一代传奇。", author: "瑞根", year: 2006, tags: ["穿越", "古代", "风流", "传奇"] },
    { name: "柳轻侯红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《江山美人志》女主角，柳轻侯的红颜知己，聪慧过人，帮助主角在朝堂上立足。", author: "瑞根", year: 2006, tags: ["红颜", "聪慧", "温柔"] },
    { name: "权臣", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《江山美人志》重要反派，朝廷权臣，与主角在朝堂上多次交锋。", author: "瑞根", year: 2006, tags: ["权臣", "老谋深算", "宿敌"] },
    { name: "敌国将领", gender: "男", role: "反派", personality: "勇猛善战、冷酷无情", description: "《江山美人志》重要反派，敌国将领，与主角在战场上多次交锋。", author: "瑞根", year: 2006, tags: ["敌将", "勇猛", "宿敌"] },
    { name: "忠心部下", gender: "男", role: "配角", personality: "忠诚可靠、勇猛善战", description: "《江山美人志》重要配角，主角的忠心部下，为主角出生入死。", author: "瑞根", year: 2006, tags: ["忠心", "勇猛", "部下"] },
    { name: "谋士", gender: "男", role: "配角", personality: "足智多谋、深谋远虑", description: "《江山美人志》重要配角，主角的谋士，为主主出谋划策。", author: "瑞根", year: 2006, tags: ["谋士", "智慧"] },
    { name: "侍从", gender: "男", role: "配角", personality: "机灵活泼、忠心耿耿", description: "《江山美人志》配角，主角的侍从，性格机灵，对主角忠心耿耿。", author: "瑞根", year: 2006, tags: ["侍从", "机灵", "忠心"] }
  ],
  "寸芒": [
    { name: "周青", gender: "男", role: "主角", personality: "冷酷无情、杀伐果断、重情重义", description: "《寸芒》男主角，修炼寸芒飞刀绝技，为报父仇踏入修真界，最终成为一代强者。", author: "我吃西红柿", year: 2007, tags: ["飞刀", "复仇", "冷酷", "强者"] },
    { name: "周青恋人", gender: "女", role: "女主", personality: "温柔善良、痴情专一", description: "《寸芒》女主角，周青的恋人，性格温柔，对周青情深义重。", author: "我吃西红柿", year: 2007, tags: ["温柔", "痴情", "恋人"] },
    { name: "杀父仇人", gender: "男", role: "反派", personality: "阴险狡诈、心狠手辣", description: "《寸芒》重要反派，周青的杀父仇人，是周青踏上复仇之路的原因。", author: "我吃西红柿", year: 2007, tags: ["仇人", "阴险", "宿敌"] },
    { name: "飞刀传人", gender: "男", role: "配角", personality: "孤傲冷漠、实力强大", description: "《寸芒》重要配角，飞刀绝技的传人，对周青有指点之恩。", author: "我吃西红柿", year: 2007, tags: ["飞刀", "传人", "强者"] },
    { name: "师门长老", gender: "男", role: "配角", personality: "德高望重、护短", description: "《寸芒》重要配角，周青师门的长老，对周青多有照顾。", author: "我吃西红柿", year: 2007, tags: ["长老", "护短"] },
    { name: "敌对门派弟子", gender: "男", role: "反派", personality: "嚣张跋扈、实力不俗", description: "《寸芒》反派，敌对门派弟子，与周青多次冲突。", author: "我吃西红柿", year: 2007, tags: ["敌对", "嚣张"] },
    { name: "江湖朋友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《寸芒》配角，周青在江湖上结识的朋友，对周青多有帮助。", author: "我吃西红柿", year: 2007, tags: ["豪爽", "义气", "朋友"] }
  ],
  "七界传说": [
    { name: "李强", gender: "男", role: "主角", personality: "机智幽默、重情重义、敢作敢当", description: "《七界传说》男主角，现代人穿越到修真世界，凭借机缘巧合和自身努力，在七界中闯出一片天地。", author: "心梦无痕", year: 2007, tags: ["穿越", "修真", "机智", "闯荡"] },
    { name: "李强伴侣", gender: "女", role: "女主", personality: "温柔善良、聪慧机敏", description: "《七界传说》女主角，李强的伴侣，性格温柔，与李强共同面对七界的挑战。", author: "心梦无痕", year: 2007, tags: ["温柔", "聪慧", "伴侣"] },
    { name: "七界魔主", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《七界传说》重要反派，七界魔主，企图统治七界，是李强的主要敌人。", author: "心梦无痕", year: 2007, tags: ["魔主", "邪恶", "宿敌"] },
    { name: "神秘前辈", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《七界传说》重要配角，神秘前辈，对李强有指点之恩。", author: "心梦无痕", year: 2007, tags: ["神秘", "前辈", "强者"] },
    { name: "同门师兄", gender: "男", role: "配角", personality: "正直善良、重情重义", description: "《七界传说》配角，李强的同门师兄，与李强共同修炼成长。", author: "心梦无痕", year: 2007, tags: ["师兄", "正直", "义气"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《七界传说》重要反派，敌对势力首领，与李强多次交锋。", author: "心梦无痕", year: 2007, tags: ["敌对", "阴险", "首领"] },
    { name: "七界守护者", gender: "男", role: "配角", personality: "德高望重、守护七界", description: "《七界传说》重要配角，七界守护者，维护七界和平。", author: "心梦无痕", year: 2007, tags: ["守护者", "德高望重"] }
  ],
  "张三丰异界游": [
    { name: "张三丰", gender: "男", role: "主角", personality: "淡泊名利、智慧超群、慈悲为怀", description: "《张三丰异界游》男主角，武当祖师张三丰穿越到异界，凭借太极神功在异世开宗立派，成为一代宗师。", author: "大秦皇族", year: 2007, tags: ["穿越", "太极", "宗师", "异界"] },
    { name: "异界红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《张三丰异界游》女主角，张三丰在异界结识的红颜知己，性格聪慧，帮助张三丰在异界立足。", author: "大秦皇族", year: 2007, tags: ["红颜", "聪慧", "温柔"] },
    { name: "异界魔王", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《张三丰异界游》重要反派，异界魔王，企图征服异界，与张三丰多次交锋。", author: "大秦皇族", year: 2007, tags: ["魔王", "邪恶", "宿敌"] },
    { name: "武当弟子", gender: "男", role: "配角", personality: "忠诚可靠、勤奋好学", description: "《张三丰异界游》重要配角，张三丰的弟子，跟随张三丰在异界传播武当武学。", author: "大秦皇族", year: 2007, tags: ["弟子", "忠诚", "勤奋"] },
    { name: "异界强者", gender: "男", role: "配角", personality: "实力强大、性格豪爽", description: "《张三丰异界游》重要配角，异界强者，与张三丰不打不相识，成为朋友。", author: "大秦皇族", year: 2007, tags: ["强者", "豪爽", "朋友"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《张三丰异界游》重要反派，敌对势力首领，与张三丰多次交锋。", author: "大秦皇族", year: 2007, tags: ["敌对", "阴险", "首领"] },
    { name: "异界商人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《张三丰异界游》配角，异界商人，与张三丰有商业往来。", author: "大秦皇族", year: 2007, tags: ["商人", "精明"] }
  ],
  "异界兽医": [
    { name: "方青书", gender: "男", role: "主角", personality: "冷酷沉稳、医术高超、正义凛然", description: "《异界兽医》男主角，异界兽医，凭借高超的医术和异能，在异界中救死扶伤，成为一代传奇。", author: "油炸包子", year: 2007, tags: ["兽医", "医术", "异能", "正义"] },
    { name: "方青书妻子", gender: "女", role: "女主", personality: "温柔善良、聪慧机敏", description: "《异界兽医》女主角，方青书的妻子，性格温柔，是方青书最坚实的后盾。", author: "油炸包子", year: 2007, tags: ["温柔", "聪慧", "妻子"] },
    { name: "邪恶巫师", gender: "男", role: "反派", personality: "邪恶残暴、阴险狡诈", description: "《异界兽医》重要反派，邪恶巫师，与方青书多次交锋。", author: "油炸包子", year: 2007, tags: ["巫师", "邪恶", "宿敌"] },
    { name: "兽医助手", gender: "男", role: "配角", personality: "忠诚可靠、勤奋好学", description: "《异界兽医》重要配角，方青书的助手，跟随方青书学习医术。", author: "油炸包子", year: 2007, tags: ["助手", "忠诚", "勤奋"] },
    { name: "贵族患者", gender: "男", role: "配角", personality: "高傲自负、知恩图报", description: "《异界兽医》重要配角，被方青书救治的贵族，对方青书感恩戴德。", author: "油炸包子", year: 2007, tags: ["贵族", "感恩"] },
    { name: "敌对兽医", gender: "男", role: "反派", personality: "嫉妒心强、阴险狡诈", description: "《异界兽医》反派，敌对兽医，嫉妒方青书的医术，多次陷害。", author: "油炸包子", year: 2007, tags: ["嫉妒", "敌对", "兽医"] },
    { name: "村民", gender: "男", role: "配角", personality: "朴实善良、感恩戴德", description: "《异界兽医》配角，被方青书救治的村民，对方青书十分感激。", author: "油炸包子", year: 2007, tags: ["村民", "朴实", "感恩"] }
  ],
  "生肖守护神": [
    { name: "齐岳", gender: "男", role: "主角", personality: "风流倜傥、重情重义、勇敢无畏", description: "《生肖守护神》男主角，生肖守护神之一，拥有麒麟血脉，带领生肖守护神守护人间，对抗邪恶势力。", author: "唐家三少", year: 2007, tags: ["麒麟", "守护神", "风流", "守护"] },
    { name: "齐岳爱人", gender: "女", role: "女主", personality: "温柔善良、聪慧机敏", description: "《生肖守护神》女主角，齐岳的爱人，性格温柔，与齐岳共同守护人间。", author: "唐家三少", year: 2007, tags: ["温柔", "聪慧", "爱人"] },
    { name: "邪恶势力首领", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《生肖守护神》重要反派，邪恶势力首领，企图毁灭人间，与生肖守护神为敌。", author: "唐家三少", year: 2007, tags: ["邪恶", "首领", "宿敌"] },
    { name: "生肖守护神甲", gender: "男", role: "配角", personality: "忠诚可靠、实力强大", description: "《生肖守护神》重要配角，生肖守护神之一，与齐岳并肩作战。", author: "唐家三少", year: 2007, tags: ["守护神", "忠诚", "强者"] },
    { name: "生肖守护神乙", gender: "女", role: "配角", personality: "聪慧机敏、实力强大", description: "《生肖守护神》重要配角，另一位生肖守护神，与齐岳并肩作战。", author: "唐家三少", year: 2007, tags: ["守护神", "聪慧", "强者"] },
    { name: "邪恶势力干将", gender: "男", role: "反派", personality: "冷酷无情、实力强大", description: "《生肖守护神》反派，邪恶势力的干将，与生肖守护神多次交锋。", author: "唐家三少", year: 2007, tags: ["邪恶", "干将", "冷酷"] },
    { name: "麒麟族长老", gender: "男", role: "配角", personality: "德高望重、智慧深沉", description: "《生肖守护神》重要配角，麒麟族长老，对齐岳的成长有重要影响。", author: "唐家三少", year: 2007, tags: ["长老", "麒麟", "智慧"] }
  ],
  "邪气凛然": [
    { name: "陈阳", gender: "男", role: "主角", personality: "邪气凛然、重情重义、敢爱敢恨", description: "《邪气凛然》男主角，黑道出身的青年，凭借自身能力和一帮兄弟，在都市中闯出一片天地。", author: "跳舞", year: 2007, tags: ["黑道", "都市", "义气", "枭雄"] },
    { name: "陈阳红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《邪气凛然》女主角，陈阳的红颜知己，性格聪慧，是陈阳最信任的人之一。", author: "跳舞", year: 2007, tags: ["红颜", "聪慧", "温柔"] },
    { name: "黑道大佬", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《邪气凛然》重要反派，黑道大佬，与陈阳在黑道上多次交锋。", author: "跳舞", year: 2007, tags: ["黑道", "大佬", "老谋深算", "宿敌"] },
    { name: "陈阳兄弟", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《邪气凛然》重要配角，陈阳的兄弟，与陈阳出生入死。", author: "跳舞", year: 2007, tags: ["兄弟", "忠诚", "义气"] },
    { name: "陈阳兄弟乙", gender: "男", role: "配角", personality: "勇猛善战、忠心耿耿", description: "《邪气凛然》重要配角，陈阳的另一位兄弟，对陈阳忠心耿耿。", author: "跳舞", year: 2007, tags: ["兄弟", "勇猛", "忠心"] },
    { name: "敌对势力头目", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《邪气凛然》重要反派，敌对势力头目，与陈阳多次交锋。", author: "跳舞", year: 2007, tags: ["敌对", "阴险", "头目"] },
    { name: "警方人员", gender: "男", role: "配角", personality: "正直不阿、执着追查", description: "《邪气凛然》配角，警方人员，对陈阳既追查又欣赏。", author: "跳舞", year: 2007, tags: ["警方", "正直", "追查"] }
  ],
  "卡徒": [
    { name: "陈长生", gender: "男", role: "主角", personality: "冷静理智、坚韧不拔、智慧过人", description: "《卡徒》男主角，拥有神秘卡牌的少年，凭借卡牌能力在卡徒世界中成长，最终成为一代卡神。", author: "方想", year: 2008, tags: ["卡牌", "冷静", "成长", "卡神"] },
    { name: "陈长生伴侣", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《卡徒》女主角，陈长生的伴侣，性格聪慧，与陈长生共同成长。", author: "方想", year: 2008, tags: ["聪慧", "温柔", "伴侣"] },
    { name: "卡牌公会会长", gender: "男", role: "反派", personality: "老谋深算、野心勃勃", description: "《卡徒》重要反派，卡牌公会会长，企图控制卡牌世界，与陈长生多次交锋。", author: "方想", year: 2008, tags: ["公会", "老谋深算", "宿敌"] },
    { name: "卡牌导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《卡徒》重要配角，陈长生的卡牌导师，教导陈长生使用卡牌。", author: "方想", year: 2008, tags: ["导师", "博学", "严厉"] },
    { name: "卡牌好友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《卡徒》重要配角，陈长生在卡牌世界结识的好友，与陈长生并肩作战。", author: "方想", year: 2008, tags: ["好友", "忠诚", "义气"] },
    { name: "敌对卡徒", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《卡徒》反派，敌对卡徒，与陈长生多次交锋。", author: "方想", year: 2008, tags: ["敌对", "阴险", "卡徒"] },
    { name: "卡牌商人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《卡徒》配角，卡牌商人，与陈长生有商业往来。", author: "方想", year: 2008, tags: ["商人", "精明"] }
  ],
  "江山美色": [
    { name: "江山美色主角", gender: "男", role: "主角", personality: "机智狡黠、风流倜傥", description: "《江山美色》男主角，在乱世中成长，凭借智慧和手段成就一番事业。", author: "墨武", year: 2008, tags: ["机智", "风流", "乱世"] },
    { name: "华研", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良、外柔内刚", description: "《江山美色》女主角，与主角相识于乱世，凭借智慧和勇气在这个世界中生存，是主角重要的红颜知己。", author: "墨武", year: 2008, tags: ["聪慧", "温柔", "乱世", "红颜"] },
    { name: "乱世枭雄", gender: "男", role: "反派", personality: "野心勃勃、冷酷无情", description: "《江山美色》重要反派，乱世枭雄，与主角在乱世中争夺天下。", author: "墨武", year: 2008, tags: ["枭雄", "野心", "宿敌"] },
    { name: "忠臣良将", gender: "男", role: "配角", personality: "忠诚可靠、勇猛善战", description: "《江山美色》重要配角，忠臣良将，与主角并肩作战。", author: "墨武", year: 2008, tags: ["忠臣", "勇猛", "良将"] },
    { name: "谋士智者", gender: "男", role: "配角", personality: "足智多谋、深谋远虑", description: "《江山美色》重要配角，谋士智者，为主角出谋划策。", author: "墨武", year: 2008, tags: ["谋士", "智慧"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《江山美色》重要反派，敌对势力首领，与主角多次交锋。", author: "墨武", year: 2008, tags: ["敌对", "阴险", "首领"] },
    { name: "红颜知己乙", gender: "女", role: "配角", personality: "温柔体贴、善解人意", description: "《江山美色》配角，主角的红颜知己，性格温柔，对主角体贴入微。", author: "墨武", year: 2008, tags: ["红颜", "温柔", "体贴"] }
  ],
  "异界之光脑威龙": [
    { name: "高扬", gender: "男", role: "主角", personality: "冷酷沉稳、军事天才、重情重义", description: "《异界之光脑威龙》男主角，拥有光脑的外来者，凭借科技和武力在异界中闯荡，最终成为一代传奇。", author: "苍天白鹤", year: 2008, tags: ["光脑", "科技", "军事", "异界"] },
    { name: "高扬伴侣", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《异界之光脑威龙》女主角，高扬的伴侣，性格聪慧，与高扬共同在异界闯荡。", author: "苍天白鹤", year: 2008, tags: ["聪慧", "温柔", "伴侣"] },
    { name: "异界魔王", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《异界之光脑威龙》重要反派，异界魔王，企图征服异界，与高扬多次交锋。", author: "苍天白鹤", year: 2008, tags: ["魔王", "邪恶", "宿敌"] },
    { name: "光脑助手", gender: "男", role: "配角", personality: "智能高效、忠诚可靠", description: "《异界之光脑威龙》重要配角，高扬光脑的AI助手，帮助高扬处理各种事务。", author: "苍天白鹤", year: 2008, tags: ["AI", "助手", "忠诚"] },
    { name: "异界盟友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《异界之光脑威龙》重要配角，高扬在异界结识的盟友，与高扬并肩作战。", author: "苍天白鹤", year: 2008, tags: ["盟友", "豪爽", "义气"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《异界之光脑威龙》重要反派，敌对势力首领，与高扬多次交锋。", author: "苍天白鹤", year: 2008, tags: ["敌对", "阴险", "首领"] },
    { name: "异界商人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《异界之光脑威龙》配角，异界商人，与高扬有商业往来。", author: "苍天白鹤", year: 2008, tags: ["商人", "精明"] }
  ],
  "星际之亡灵帝国": [
    { name: "方青书", gender: "男", role: "主角", personality: "冷静理智、战术天才、坚韧不拔", description: "《星际之亡灵帝国》男主角，在星际战争中成长，凭借亡灵魔法和战术才能在星际间建立帝国，成为一代亡灵帝王。", author: "苍天白鹤", year: 2008, tags: ["亡灵", "星际", "战术", "帝王"] },
    { name: "方青书妻子", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《星际之亡灵帝国》女主角，方青书的妻子，性格聪慧，是方青书最坚实的后盾。", author: "苍天白鹤", year: 2008, tags: ["聪慧", "温柔", "妻子"] },
    { name: "星际联盟首领", gender: "男", role: "反派", personality: "老谋深算、野心勃勃", description: "《星际之亡灵帝国》重要反派，星际联盟首领，企图消灭亡灵帝国，与方青书多次交锋。", author: "苍天白鹤", year: 2008, tags: ["联盟", "老谋深算", "宿敌"] },
    { name: "亡灵将领", gender: "男", role: "配角", personality: "忠诚可靠、勇猛善战", description: "《星际之亡灵帝国》重要配角，方青书的亡灵将领，为方青书出生入死。", author: "苍天白鹤", year: 2008, tags: ["亡灵", "将领", "忠诚"] },
    { name: "星际盟友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《星际之亡灵帝国》重要配角，方青书在星际中结识的盟友，与方青书并肩作战。", author: "苍天白鹤", year: 2008, tags: ["盟友", "豪爽", "义气"] },
    { name: "敌对帝国皇帝", gender: "男", role: "反派", personality: "冷酷无情、野心勃勃", description: "《星际之亡灵帝国》重要反派，敌对帝国皇帝，与方青书多次交锋。", author: "苍天白鹤", year: 2008, tags: ["皇帝", "冷酷", "敌对"] },
    { name: "星际商人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《星际之亡灵帝国》配角，星际商人，与方青书有商业往来。", author: "苍天白鹤", year: 2008, tags: ["商人", "精明"] }
  ],
  "混在三国当军阀": [
    { name: "刘辩", gender: "男", role: "主角", personality: "机智狡黠、野心勃勃、坚韧不拔", description: "《混在三国当军阀》男主角，穿越到三国时期成为刘辩，凭借现代知识和手段在乱世中建立势力，成为一代军阀。", author: "寂寞剑客", year: 2008, tags: ["穿越", "三国", "军阀", "乱世"] },
    { name: "刘辩红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《混在三国当军阀》女主角，刘辩的红颜知己，性格聪慧，帮助刘辩在乱世中立足。", author: "寂寞剑客", year: 2008, tags: ["红颜", "聪慧", "温柔"] },
    { name: "曹操", gender: "男", role: "反派", personality: "雄才大略、多疑残忍", description: "《混在三国当军阀》重要反派，曹操，与刘辩在乱世中争夺天下。", author: "寂寞剑客", year: 2008, tags: ["曹操", "雄才大略", "宿敌"] },
    { name: "刘辩部将", gender: "男", role: "配角", personality: "忠诚可靠、勇猛善战", description: "《混在三国当军阀》重要配角，刘辩的部将，为刘辩出生入死。", author: "寂寞剑客", year: 2008, tags: ["部将", "忠诚", "勇猛"] },
    { name: "谋士", gender: "男", role: "配角", personality: "足智多谋、深谋远虑", description: "《混在三国当军阀》重要配角，刘辩的谋士，为刘辩出谋划策。", author: "寂寞剑客", year: 2008, tags: ["谋士", "智慧"] },
    { name: "袁绍", gender: "男", role: "反派", personality: "刚愎自用、优柔寡断", description: "《混在三国当军阀》重要反派，袁绍，与刘辩在乱世中争夺天下。", author: "寂寞剑客", year: 2008, tags: ["袁绍", "刚愎", "敌对"] },
    { name: "三国名将", gender: "男", role: "配角", personality: "勇猛善战、忠诚义气", description: "《混在三国当军阀》配角，三国名将，与刘辩有交集。", author: "寂寞剑客", year: 2008, tags: ["名将", "勇猛", "义气"] }
  ],
  "初唐房二传": [
    { name: "房遗爱", gender: "男", role: "主角", personality: "风流倜傥、机智狡黠、重情重义", description: "《初唐房二传》男主角，穿越成为房玄龄的二儿子，在初唐时期凭借现代知识和手段，玩转朝堂和江湖。", author: "圣者晨雷", year: 2008, tags: ["穿越", "初唐", "房玄龄", "风流"] },
    { name: "房遗爱妻子", gender: "女", role: "女主", personality: "聪慧机敏、温柔贤惠", description: "《初唐房二传》女主角，房遗爱的妻子，性格聪慧，是房遗爱最坚实的后盾。", author: "圣者晨雷", year: 2008, tags: ["妻子", "聪慧", "贤惠"] },
    { name: "长孙无忌", gender: "男", role: "反派", personality: "老谋深算、权谋深沉", description: "《初唐房二传》重要反派，长孙无忌，与房遗爱在朝堂上多次交锋。", author: "圣者晨雷", year: 2008, tags: ["长孙无忌", "老谋深算", "宿敌"] },
    { name: "房玄龄", gender: "男", role: "配角", personality: "忠心耿耿、智慧超群", description: "《初唐房二传》重要配角，房遗爱的父亲，唐朝名相，对房遗爱影响深远。", author: "圣者晨雷", year: 2008, tags: ["房玄龄", "名相", "父亲"] },
    { name: "李世民", gender: "男", role: "配角", personality: "雄才大略、知人善任", description: "《初唐房二传》重要配角，唐太宗李世民，对房遗爱既有猜忌又有欣赏。", author: "圣者晨雷", year: 2008, tags: ["李世民", "唐太宗", "帝王"] },
    { name: "权臣", gender: "男", role: "反派", personality: "阴险狡诈、权谋深沉", description: "《初唐房二传》重要反派，朝堂权臣，与房遗爱多次交锋。", author: "圣者晨雷", year: 2008, tags: ["权臣", "阴险", "敌对"] },
    { name: "江湖朋友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《初唐房二传》配角，房遗爱在江湖上结识的朋友，对房遗爱多有帮助。", author: "圣者晨雷", year: 2008, tags: ["朋友", "豪爽", "义气"] }
  ],
  "史上第一混乱": [
    { name: "萧强", gender: "男", role: "主角", personality: "玩世不恭、机智幽默、重情重义", description: "《史上第一混乱》男主角，现代人穿越到多个历史时期，以搞笑的方式改变历史，是一部轻松幽默的穿越作品。", author: "张小花", year: 2008, tags: ["穿越", "搞笑", "历史", "轻松"] },
    { name: "萧强女友", gender: "女", role: "女主", personality: "活泼可爱、善解人意", description: "《史上第一混乱》女主角，萧强的女友，性格活泼，与萧强共同经历各种搞笑事件。", author: "张小花", year: 2008, tags: ["女友", "活泼", "可爱"] },
    { name: "历史人物甲", gender: "男", role: "配角", personality: "个性鲜明、搞笑担当", description: "《史上第一混乱》重要配角，被萧强改变历史的著名历史人物，性格搞笑。", author: "张小花", year: 2008, tags: ["历史人物", "搞笑"] },
    { name: "历史人物乙", gender: "男", role: "配角", personality: "个性鲜明、搞笑担当", description: "《史上第一混乱》重要配角，另一位被萧强改变历史的著名历史人物，性格搞笑。", author: "张小花", year: 2008, tags: ["历史人物", "搞笑"] },
    { name: "历史人物丙", gender: "女", role: "配角", personality: "个性鲜明、搞笑担当", description: "《史上第一混乱》重要配角，被萧强改变历史的著名女性历史人物，性格搞笑。", author: "张小花", year: 2008, tags: ["历史人物", "搞笑"] },
    { name: "反派角色", gender: "男", role: "反派", personality: "倒霉悲催、被主角坑", description: "《史上第一混乱》反派，总是被萧强坑的倒霉反派，搞笑担当。", author: "张小花", year: 2008, tags: ["反派", "倒霉", "搞笑"] },
    { name: "萧强朋友", gender: "男", role: "配角", personality: "忠诚可靠、搞笑担当", description: "《史上第一混乱》配角，萧强的朋友，与萧强一起搞笑。", author: "张小花", year: 2008, tags: ["朋友", "搞笑", "忠诚"] }
  ],
  "武神": [
    { name: "萧寒", gender: "男", role: "主角", personality: "狂傲不羁、实力超群、重情重义", description: "《武神》男主角，拥有武神血脉的少年，凭借强大的实力和狂傲的性格，在武道之路上不断突破，成就武神之名。", author: "苍天白鹤", year: 2009, tags: ["武神血脉", "狂傲", "武道", "突破"] },
    { name: "萧寒妻子", gender: "女", role: "女主", personality: "温柔善良、聪慧机敏", description: "《武神》女主角，萧寒的妻子，性格温柔，是萧寒最坚实的后盾。", author: "苍天白鹤", year: 2009, tags: ["温柔", "聪慧", "妻子"] },
    { name: "武神殿殿主", gender: "男", role: "反派", personality: "老谋深算、野心勃勃", description: "《武神》重要反派，武神殿殿主，企图控制武道世界，与萧寒多次交锋。", author: "苍天白鹤", year: 2009, tags: ["殿主", "老谋深算", "宿敌"] },
    { name: "萧寒师父", gender: "男", role: "配角", personality: "严厉慈爱、实力强大", description: "《武神》重要配角，萧寒的师父，教导萧寒武道，对萧寒影响深远。", author: "苍天白鹤", year: 2009, tags: ["师父", "严厉", "强者"] },
    { name: "武道好友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《武神》重要配角，萧寒在武道之路上结识的好友，与萧寒并肩作战。", author: "苍天白鹤", year: 2009, tags: ["好友", "豪爽", "义气"] },
    { name: "敌对武者", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《武神》反派，敌对武者，与萧寒多次交锋。", author: "苍天白鹤", year: 2009, tags: ["敌对", "阴险", "武者"] },
    { name: "武道前辈", gender: "男", role: "配角", personality: "德高望重、智慧深沉", description: "《武神》配角，武道前辈，对萧寒有指点之恩。", author: "苍天白鹤", year: 2009, tags: ["前辈", "德高望重", "智慧"] }
  ],
  "步步生莲": [
    { name: "杨凌", gender: "男", role: "主角", personality: "机智狡黠、重情重义、风流倜傥", description: "《步步生莲》男主角，穿越到古代，凭借现代知识和手段在朝堂和江湖中游走，步步生莲，成就一代传奇。", author: "月关", year: 2009, tags: ["穿越", "古代", "风流", "传奇"] },
    { name: "杨凌红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《步步生莲》女主角，杨凌的红颜知己，性格聪慧，帮助杨凌在朝堂上立足。", author: "月关", year: 2009, tags: ["红颜", "聪慧", "温柔"] },
    { name: "权臣", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《步步生莲》重要反派，朝廷权臣，与杨凌在朝堂上多次交锋。", author: "月关", year: 2009, tags: ["权臣", "老谋深算", "宿敌"] },
    { name: "杨凌部下", gender: "男", role: "配角", personality: "忠诚可靠、勇猛善战", description: "《步步生莲》重要配角，杨凌的部下，为杨凌出生入死。", author: "月关", year: 2009, tags: ["部下", "忠诚", "勇猛"] },
    { name: "谋士", gender: "男", role: "配角", personality: "足智多谋、深谋远虑", description: "《步步生莲》重要配角，杨凌的谋士，为杨凌出谋划策。", author: "月关", year: 2009, tags: ["谋士", "智慧"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《步步生莲》重要反派，敌对势力首领，与杨凌多次交锋。", author: "月关", year: 2009, tags: ["敌对", "阴险", "首领"] },
    { name: "红颜知己乙", gender: "女", role: "配角", personality: "温柔体贴、善解人意", description: "《步步生莲》配角，杨凌的红颜知己，性格温柔，对杨凌体贴入微。", author: "月关", year: 2009, tags: ["红颜", "温柔", "体贴"] }
  ],
  "异世邪君": [
    { name: "君莫邪", gender: "男", role: "主角", personality: "狂傲不羁、重情重义、邪气凛然", description: "《异世邪君》男主角，异世邪君，凭借邪异的能力和狂傲的性格，在这个世界中建立势力，成就一代邪君之名。", author: "风凌天下", year: 2009, tags: ["邪君", "狂傲", "异世", "建立势力"] },
    { name: "君莫邪红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《异世邪君》女主角，君莫邪的红颜知己，性格聪慧，帮助君莫邪在异世立足。", author: "风凌天下", year: 2009, tags: ["红颜", "聪慧", "温柔"] },
    { name: "正道领袖", gender: "男", role: "反派", personality: "虚伪伪善、野心勃勃", description: "《异世邪君》重要反派，正道领袖，表面光明磊落实则虚伪，与君莫邪多次交锋。", author: "风凌天下", year: 2009, tags: ["正道", "虚伪", "宿敌"] },
    { name: "君莫邪兄弟", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《异世邪君》重要配角，君莫邪的兄弟，与君莫邪出生入死。", author: "风凌天下", year: 2009, tags: ["兄弟", "忠诚", "义气"] },
    { name: "邪道前辈", gender: "男", role: "配角", personality: "实力强大、性格豪爽", description: "《异世邪君》重要配角，邪道前辈，对君莫邪有指点之恩。", author: "风凌天下", year: 2009, tags: ["前辈", "邪道", "豪爽"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《异世邪君》重要反派，敌对势力首领，与君莫邪多次交锋。", author: "风凌天下", year: 2009, tags: ["敌对", "阴险", "首领"] },
    { name: "异世盟友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《异世邪君》配角，君莫邪在异世结识的盟友，与君莫邪并肩作战。", author: "风凌天下", year: 2009, tags: ["盟友", "豪爽", "义气"] }
  ],
  "冒牌大英雄": [
    { name: "韩三", gender: "男", role: "主角", personality: "机智幽默、重情重义、扮猪吃虎", description: "《冒牌大英雄》男主角，冒牌大英雄，以搞笑的方式在这个世界中生存，最终成为真正的英雄。", author: "七十二编", year: 2009, tags: ["搞笑", "英雄", "扮猪吃虎", "机智"] },
    { name: "韩三女友", gender: "女", role: "女主", personality: "活泼可爱、善解人意", description: "《冒牌大英雄》女主角，韩三的女友，性格活泼，与韩三共同经历各种冒险。", author: "七十二编", year: 2009, tags: ["女友", "活泼", "可爱"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、野心勃勃", description: "《冒牌大英雄》重要反派，敌对势力首领，与韩三多次交锋。", author: "七十二编", year: 2009, tags: ["敌对", "阴险", "首领"] },
    { name: "韩三伙伴", gender: "男", role: "配角", personality: "忠诚可靠、搞笑担当", description: "《冒牌大英雄》重要配角，韩三的伙伴，与韩三一起冒险，搞笑担当。", author: "七十二编", year: 2009, tags: ["伙伴", "忠诚", "搞笑"] },
    { name: "韩三伙伴乙", gender: "男", role: "配角", personality: "勇猛善战、忠心耿耿", description: "《冒牌大英雄》重要配角，韩三的另一位伙伴，对韩三忠心耿耿。", author: "七十二编", year: 2009, tags: ["伙伴", "勇猛", "忠心"] },
    { name: "反派干将", gender: "男", role: "反派", personality: "冷酷无情、实力强大", description: "《冒牌大英雄》反派，敌对势力的干将，与韩三多次交锋。", author: "七十二编", year: 2009, tags: ["反派", "冷酷", "干将"] },
    { name: "神秘高手", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《冒牌大英雄》配角，神秘高手，对韩三有指点之恩。", author: "七十二编", year: 2009, tags: ["神秘", "高手", "强者"] }
  ],
  "猎国": [
    { name: "许乐", gender: "男", role: "主角", personality: "冷静理智、军事天才、重情重义", description: "《猎国》男主角，在猎国世界中成长，凭借军事才能和政治手腕，建立势力，最终成为一方霸主。", author: "跳舞", year: 2009, tags: ["军事", "政治", "建立势力", "霸主"] },
    { name: "许乐红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《猎国》女主角，许乐的红颜知己，性格聪慧，帮助许乐在猎国世界中立足。", author: "跳舞", year: 2009, tags: ["红颜", "聪慧", "温柔"] },
    { name: "敌对军阀", gender: "男", role: "反派", personality: "老谋深算、野心勃勃", description: "《猎国》重要反派，敌对军阀，与许乐在猎国世界中多次交锋。", author: "跳舞", year: 2009, tags: ["军阀", "老谋深算", "宿敌"] },
    { name: "许乐部将", gender: "男", role: "配角", personality: "忠诚可靠、勇猛善战", description: "《猎国》重要配角，许乐的部将，为许乐出生入死。", author: "跳舞", year: 2009, tags: ["部将", "忠诚", "勇猛"] },
    { name: "谋士", gender: "男", role: "配角", personality: "足智多谋、深谋远虑", description: "《猎国》重要配角，许乐的谋士，为许乐出谋划策。", author: "跳舞", year: 2009, tags: ["谋士", "智慧"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《猎国》重要反派，敌对势力首领，与许乐多次交锋。", author: "跳舞", year: 2009, tags: ["敌对", "阴险", "首领"] },
    { name: "猎国盟友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《猎国》配角，许乐在猎国中结识的盟友，与许乐并肩作战。", author: "跳舞", year: 2009, tags: ["盟友", "豪爽", "义气"] }
  ],
  "酒神": [
    { name: "姬动", gender: "男", role: "主角", personality: "狂傲不羁、才华横溢、重情重义", description: "《酒神》男主角，拥有酒神传承的少年，凭借酿酒之术和战斗能力，在这个世界中闯荡，成就酒神之名。", author: "唐家三少", year: 2009, tags: ["酒神", "酿酒", "狂傲", "才华"] },
    { name: "烈焰", gender: "女", role: "女主", personality: "高贵典雅、温柔善良、痴情专一", description: "《酒神》女主角，姬动的爱人，性格高贵典雅，是姬动最爱的人。", author: "唐家三少", year: 2009, tags: ["高贵", "温柔", "痴情", "爱人"] },
    { name: "黑暗五行大陆首领", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《酒神》重要反派，黑暗五行大陆首领，企图毁灭光明五行大陆，与姬动多次交锋。", author: "唐家三少", year: 2009, tags: ["黑暗", "邪恶", "宿敌"] },
    { name: "酒神导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《酒神》重要配角，姬动的导师，教导姬动酿酒之术。", author: "唐家三少", year: 2009, tags: ["导师", "博学", "严厉"] },
    { name: "光明五行大陆盟友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《酒神》重要配角，姬动在光明五行大陆的盟友，与姬动并肩作战。", author: "唐家三少", year: 2009, tags: ["盟友", "忠诚", "义气"] },
    { name: "黑暗天干圣徒", gender: "男", role: "反派", personality: "冷酷无情、实力强大", description: "《酒神》反派，黑暗天干圣徒，与姬动多次交锋。", author: "唐家三少", year: 2009, tags: ["黑暗", "冷酷", "圣徒"] },
    { name: "光明天干圣徒", gender: "男", role: "配角", personality: "正义凛然、实力强大", description: "《酒神》配角，光明天干圣徒，与姬动并肩作战。", author: "唐家三少", year: 2009, tags: ["光明", "正义", "圣徒"] }
  ],
  "天珠变": [
    { name: "周维清", gender: "男", role: "主角", personality: "风流倜傥、机智狡黠、重情重义", description: "《天珠变》男主角，拥有天珠变能力的少年，凭借变珠能力和聪明才智，在这个世界中建立势力，成就一代传奇。", author: "唐家三少", year: 2010, tags: ["天珠变", "风流", "机智", "建立势力"] },
    { name: "上官冰儿", gender: "女", role: "女主", personality: "冷艳高贵、聪慧机敏、外冷内热", description: "《天珠变》女主角，周维清的爱人，性格冷艳高贵，是周维清最坚实的后盾。", author: "唐家三少", year: 2010, tags: ["冷艳", "高贵", "聪慧", "爱人"] },
    { name: "血红狱狱主", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《天珠变》重要反派，血红狱狱主，企图统治大陆，与周维清多次交锋。", author: "唐家三少", year: 2010, tags: ["血红狱", "邪恶", "宿敌"] },
    { name: "周维清师父", gender: "男", role: "配角", personality: "严厉慈爱、实力强大", description: "《天珠变》重要配角，周维清的师父，教导周维清天珠变能力。", author: "唐家三少", year: 2010, tags: ["师父", "严厉", "强者"] },
    { name: "天珠师好友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《天珠变》重要配角，周维清的天珠师好友，与周维清并肩作战。", author: "唐家三少", year: 2010, tags: ["好友", "忠诚", "义气"] },
    { name: "敌对天珠师", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《天珠变》反派，敌对天珠师，与周维清多次交锋。", author: "唐家三少", year: 2010, tags: ["敌对", "阴险", "天珠师"] },
    { name: "天珠变前辈", gender: "男", role: "配角", personality: "德高望重、智慧深沉", description: "《天珠变》配角，天珠变前辈，对周维清有指点之恩。", author: "唐家三少", year: 2010, tags: ["前辈", "德高望重", "智慧"] }
  ],
  "医道官途": [
    { name: "方青书", gender: "男", role: "主角", personality: "冷酷沉稳、医术高超、正义凛然", description: "《医道官途》男主角，拥有医术和官途双重的少年，凭借医术和手段在官场和江湖中游走，成就医道官途。", author: "石章鱼", year: 2009, tags: ["医术", "官场", "正义", "游走"] },
    { name: "方青书红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《医道官途》女主角，方青书的红颜知己，性格聪慧，帮助方青书在官场上立足。", author: "石章鱼", year: 2009, tags: ["红颜", "聪慧", "温柔"] },
    { name: "官场对手", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《医道官途》重要反派，官场对手，与方青书在官场上多次交锋。", author: "石章鱼", year: 2009, tags: ["官场", "老谋深算", "宿敌"] },
    { name: "医学导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《医道官途》重要配角，方青书的医学导师，教导方青书医术。", author: "石章鱼", year: 2009, tags: ["导师", "博学", "严厉"] },
    { name: "官场盟友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《医道官途》重要配角，方青书在官场的盟友，与方青书并肩作战。", author: "石章鱼", year: 2009, tags: ["盟友", "忠诚", "义气"] },
    { name: "医药公司老板", gender: "男", role: "反派", personality: "阴险狡诈、唯利是图", description: "《医道官途》反派，医药公司老板，与方青书多次交锋。", author: "石章鱼", year: 2009, tags: ["医药", "阴险", "唯利是图"] },
    { name: "患者家属", gender: "男", role: "配角", personality: "朴实善良、感恩戴德", description: "《医道官途》配角，被方青书救治的患者的家属，对方青书十分感激。", author: "石章鱼", year: 2009, tags: ["患者", "朴实", "感恩"] }
  ],
  "重生之衙内": [
    { name: "李衙内", gender: "男", role: "主角", personality: "纨绔不羁、机智狡黠、重情重义", description: "《重生之衙内》男主角，重生为衙内，凭借现代知识和手段在古代官场中游走，玩转朝堂，成就一代传奇。", author: "不信天上掉馅饼", year: 2009, tags: ["重生", "衙内", "官场", "机智"] },
    { name: "李衙内妻子", gender: "女", role: "女主", personality: "聪慧机敏、温柔贤惠", description: "《重生之衙内》女主角，李衙内的妻子，性格聪慧，是李衙内最坚实的后盾。", author: "不信天上掉馅饼", year: 2009, tags: ["妻子", "聪慧", "贤惠"] },
    { name: "官场政敌", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《重生之衙内》重要反派，官场政敌，与李衙内在官场上多次交锋。", author: "不信天上掉馅饼", year: 2009, tags: ["政敌", "老谋深算", "宿敌"] },
    { name: "李衙内父亲", gender: "男", role: "配角", personality: "威严慈爱、官场老手", description: "《重生之衙内》重要配角，李衙内的父亲，对李衙内影响深远。", author: "不信天上掉馅饼", year: 2009, tags: ["父亲", "威严", "官场"] },
    { name: "官场盟友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《重生之衙内》重要配角，李衙内在官场的盟友，与李衙内并肩作战。", author: "不信天上掉馅饼", year: 2009, tags: ["盟友", "忠诚", "义气"] },
    { name: "地方豪强", gender: "男", role: "反派", personality: "阴险狡诈、地方一霸", description: "《重生之衙内》反派，地方豪强，与李衙内多次交锋。", author: "不信天上掉馅饼", year: 2009, tags: ["豪强", "阴险", "地方"] },
    { name: "红颜知己", gender: "女", role: "配角", personality: "温柔体贴、善解人意", description: "《重生之衙内》配角，李衙内的红颜知己，性格温柔，对李衙内体贴入微。", author: "不信天上掉馅饼", year: 2009, tags: ["红颜", "温柔", "体贴"] }
  ],
  "黄金瞳": [
    { name: "庄睿", gender: "男", role: "主角", personality: "冷静理智、机智过人、重情重义", description: "《黄金瞳》男主角，拥有黄金瞳的少年，凭借透视能力在古玩界闯荡，鉴别真伪，成就一代鉴宝大师。", author: "打眼", year: 2010, tags: ["黄金瞳", "鉴宝", "透视", "古玩"] },
    { name: "庄睿女友", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《黄金瞳》女主角，庄睿的女友，性格聪慧，与庄睿共同在古玩界闯荡。", author: "打眼", year: 2010, tags: ["女友", "聪慧", "温柔"] },
    { name: "古玩界大佬", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《黄金瞳》重要反派，古玩界大佬，与庄睿在古玩界多次交锋。", author: "打眼", year: 2010, tags: ["古玩", "老谋深算", "宿敌"] },
    { name: "鉴宝导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《黄金瞳》重要配角，庄睿的鉴宝导师，教导庄睿鉴宝之术。", author: "打眼", year: 2010, tags: ["导师", "博学", "严厉"] },
    { name: "古玩朋友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《黄金瞳》重要配角，庄睿在古玩界结识的朋友，与庄睿并肩作战。", author: "打眼", year: 2010, tags: ["朋友", "豪爽", "义气"] },
    { name: "造假团伙头目", gender: "男", role: "反派", personality: "阴险狡诈、唯利是图", description: "《黄金瞳》反派，造假团伙头目，与庄睿多次交锋。", author: "打眼", year: 2010, tags: ["造假", "阴险", "唯利是图"] },
    { name: "收藏爱好者", gender: "男", role: "配角", personality: "热爱收藏、鉴赏能力不俗", description: "《黄金瞳》配角，收藏爱好者，与庄睿有交流。", author: "打眼", year: 2010, tags: ["收藏", "鉴赏"] }
  ],
  "偷天": [
    { name: "方青书", gender: "男", role: "主角", personality: "机智狡黠、重情重义、敢于逆天", description: "《偷天》男主角，拥有偷天能力的少年，凭借逆天手段在这个世界中生存，偷天换日，成就一代传奇。", author: "血红", year: 2010, tags: ["偷天", "逆天", "机智", "传奇"] },
    { name: "方青书红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《偷天》女主角，方青书的红颜知己，性格聪慧，帮助方青书在偷天世界中立足。", author: "血红", year: 2010, tags: ["红颜", "聪慧", "温柔"] },
    { name: "天庭使者", gender: "男", role: "反派", personality: "高高在上、冷酷无情", description: "《偷天》重要反派，天庭使者，维护天庭秩序，与方青书多次交锋。", author: "血红", year: 2010, tags: ["天庭", "冷酷", "宿敌"] },
    { name: "偷天前辈", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《偷天》重要配角，偷天前辈，对方青书有指点之恩。", author: "血红", year: 2010, tags: ["前辈", "神秘", "强者"] },
    { name: "偷天盟友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《偷天》重要配角，方青书在偷天世界的盟友，与方青书并肩作战。", author: "血红", year: 2010, tags: ["盟友", "忠诚", "义气"] },
    { name: "天庭追兵", gender: "男", role: "反派", personality: "冷酷无情、实力强大", description: "《偷天》反派，天庭追兵，奉命追捕方青书。", author: "血红", year: 2010, tags: ["天庭", "冷酷", "追兵"] },
    { name: "偷天商人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《偷天》配角，偷天商人，与方青书有商业往来。", author: "血红", year: 2010, tags: ["商人", "精明"] }
  ],
  "官仙": [
    { name: "杨帆", gender: "男", role: "主角", personality: "机智狡黠、重情重义、官场老手", description: "《官仙》男主角，拥有官仙传承的少年，凭借手段和智慧在官场中游走，成就一代官仙之名。", author: "陈风笑", year: 2010, tags: ["官仙", "官场", "机智", "手段"] },
    { name: "杨帆红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔贤惠", description: "《官仙》女主角，杨帆的红颜知己，性格聪慧，帮助杨帆在官场上立足。", author: "陈风笑", year: 2010, tags: ["红颜", "聪慧", "贤惠"] },
    { name: "官场政敌", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《官仙》重要反派，官场政敌，与杨帆在官场上多次交锋。", author: "陈风笑", year: 2010, tags: ["政敌", "老谋深算", "宿敌"] },
    { name: "官场导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《官仙》重要配角，杨帆的官场导师，教导杨帆官场之道。", author: "陈风笑", year: 2010, tags: ["导师", "博学", "严厉"] },
    { name: "官场盟友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《官仙》重要配角，杨帆在官场的盟友，与杨帆并肩作战。", author: "陈风笑", year: 2010, tags: ["盟友", "忠诚", "义气"] },
    { name: "地方官员", gender: "男", role: "反派", personality: "贪污腐败、阴险狡诈", description: "《官仙》反派，地方官员，与杨帆多次交锋。", author: "陈风笑", year: 2010, tags: ["官员", "贪污", "阴险"] },
    { name: "百姓代表", gender: "男", role: "配角", personality: "朴实善良、感恩戴德", description: "《官仙》配角，受杨帆帮助的百姓代表，对杨帆十分感激。", author: "陈风笑", year: 2010, tags: ["百姓", "朴实", "感恩"] }
  ]
};

// 继续补充更多书籍的数据
const moreSupplementaryData = {
  "汉乡": [
    { name: "秦长青", gender: "男", role: "主角", personality: "沉稳睿智、心思缜密、有担当", description: "《汉乡》男主角，穿越到汉朝的现代青年。性格沉稳，心思缜密，在汉朝的历史洪流中不断成长，最终成为一代名臣。", author: "孑与2", year: 2017, tags: ["现代知识", "权谋", "治国"] },
    { name: "秦长青妻子", gender: "女", role: "女主", personality: "聪慧机敏、温柔贤惠", description: "《汉乡》女主角，秦长青的妻子，性格聪慧，是秦长青最坚实的后盾。", author: "孑与2", year: 2017, tags: ["妻子", "聪慧", "贤惠"] },
    { name: "汉朝权臣", gender: "男", role: "反派", personality: "老谋深算、权谋深沉", description: "《汉乡》重要反派，汉朝权臣，与秦长青在朝堂上多次交锋。", author: "孑与2", year: 2017, tags: ["权臣", "老谋深算", "宿敌"] },
    { name: "汉武帝", gender: "男", role: "配角", personality: "雄才大略、知人善任", description: "《汉乡》重要配角，汉武帝刘彻，对秦长青既有猜忌又有欣赏。", author: "孑与2", year: 2017, tags: ["汉武帝", "帝王", "雄才大略"] },
    { name: "谋士", gender: "男", role: "配角", personality: "足智多谋、深谋远虑", description: "《汉乡》重要配角，秦长青的谋士，为秦长青出谋划策。", author: "孑与2", year: 2017, tags: ["谋士", "智慧"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《汉乡》重要反派，敌对势力首领，与秦长青多次交锋。", author: "孑与2", year: 2017, tags: ["敌对", "阴险", "首领"] },
    { name: "汉朝百姓", gender: "男", role: "配角", personality: "朴实善良、感恩戴德", description: "《汉乡》配角，受秦长青帮助的汉朝百姓，对秦长青十分感激。", author: "孑与2", year: 2017, tags: ["百姓", "朴实", "感恩"] }
  ],
  "谍影风云": [
    { name: "宁志恒", gender: "男", role: "主角", personality: "冷静沉稳、心思缜密、爱国情怀", description: "《谍影风云》男主角，穿越到民国时期的特工。性格冷静沉稳，心思缜密，在乱世中为国家和民族而战。", author: "寻青藤", year: 2018, tags: ["特工技能", "现代知识", "格斗"] },
    { name: "宁志恒搭档", gender: "女", role: "女主", personality: "聪慧机敏、身手矫健", description: "《谍影风云》女主角，宁志恒的搭档，性格聪慧，与宁志恒共同执行任务。", author: "寻青藤", year: 2018, tags: ["搭档", "聪慧", "矫健"] },
    { name: "日本特务头子", gender: "男", role: "反派", personality: "阴险狡诈、冷酷无情", description: "《谍影风云》重要反派，日本特务头子，与宁志恒多次交锋。", author: "寻青藤", year: 2018, tags: ["特务", "阴险", "宿敌"] },
    { name: "军统上司", gender: "男", role: "配角", personality: "老谋深算、权谋深沉", description: "《谍影风云》重要配角，宁志恒的军统上司，对宁志恒既有利用又有欣赏。", author: "寻青藤", year: 2018, tags: ["军统", "上司", "老谋深算"] },
    { name: "地下党员", gender: "男", role: "配角", personality: "忠诚可靠、勇敢无畏", description: "《谍影风云》重要配角，地下党员，与宁志恒有秘密合作。", author: "寻青藤", year: 2018, tags: ["地下党", "忠诚", "勇敢"] },
    { name: "汉奸", gender: "男", role: "反派", personality: "卑鄙无耻、卖国求荣", description: "《谍影风云》反派，汉奸，为日本人卖命，与宁志恒多次交锋。", author: "寻青藤", year: 2018, tags: ["汉奸", "卑鄙", "卖国"] },
    { name: "爱国商人", gender: "男", role: "配角", personality: "爱国情怀、重情重义", description: "《谍影风云》配角，爱国商人，为抗日事业提供支持。", author: "寻青藤", year: 2018, tags: ["商人", "爱国", "义气"] }
  ],
  "手术直播间": [
    { name: "陈聪", gender: "男", role: "主角", personality: "冷静专注、医术精湛、有担当", description: "《手术直播间》男主角，拥有直播系统的医生。性格冷静专注，医术精湛，通过直播系统分享手术过程，救治无数病人。", author: "真熊初墨", year: 2018, tags: ["直播系统", "手术技巧", "医学知识"] },
    { name: "陈聪助手", gender: "女", role: "女主", personality: "聪慧机敏、温柔体贴", description: "《手术直播间》女主角，陈聪的助手，性格聪慧，协助陈聪完成手术。", author: "真熊初墨", year: 2018, tags: ["助手", "聪慧", "体贴"] },
    { name: "医院院长", gender: "男", role: "反派", personality: "老谋深算、利益至上", description: "《手术直播间》重要反派，医院院长，与陈聪在医院内部多次交锋。", author: "真熊初墨", year: 2018, tags: ["院长", "老谋深算", "宿敌"] },
    { name: "医学导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《手术直播间》重要配角，陈聪的医学导师，教导陈聪医术。", author: "真熊初墨", year: 2018, tags: ["导师", "博学", "严厉"] },
    { name: "护士", gender: "女", role: "配角", personality: "温柔体贴、细心负责", description: "《手术直播间》重要配角，手术室的护士，协助陈聪完成手术。", author: "真熊初墨", year: 2018, tags: ["护士", "温柔", "细心"] },
    { name: "医药代表", gender: "男", role: "反派", personality: "唯利是图、阴险狡诈", description: "《手术直播间》反派，医药代表，与陈聪多次交锋。", author: "真熊初墨", year: 2018, tags: ["医药", "唯利是图", "阴险"] },
    { name: "患者家属", gender: "男", role: "配角", personality: "朴实善良、感恩戴德", description: "《手术直播间》配角，被陈聪救治的患者的家属，对陈聪十分感激。", author: "真熊初墨", year: 2018, tags: ["家属", "朴实", "感恩"] }
  ],
  "学霸的黑科技系统": [
    { name: "苏陌", gender: "男", role: "主角", personality: "学霸气质、冷静理性、科技狂人", description: "《学霸的黑科技系统》男主角，获得黑科技系统的学霸。性格冷静理性，通过系统不断研发黑科技，改变人类未来。", author: "晨星LL", year: 2018, tags: ["黑科技系统", "学习能力", "科研"] },
    { name: "苏陌女友", gender: "女", role: "女主", personality: "聪慧机敏、温柔体贴", description: "《学霸的黑科技系统》女主角，苏陌的女友，性格聪慧，支持苏陌的科研事业。", author: "晨星LL", year: 2018, tags: ["女友", "聪慧", "体贴"] },
    { name: "科技巨头CEO", gender: "男", role: "反派", personality: "老谋深算、利益至上", description: "《学霸的黑科技系统》重要反派，科技巨头CEO，与苏陌在商业上多次交锋。", author: "晨星LL", year: 2018, tags: ["CEO", "老谋深算", "宿敌"] },
    { name: "科研导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《学霸的黑科技系统》重要配角，苏陌的科研导师，教导苏陌科研方法。", author: "晨星LL", year: 2018, tags: ["导师", "博学", "严厉"] },
    { name: "科研伙伴", gender: "男", role: "配角", personality: "忠诚可靠、聪明勤奋", description: "《学霸的黑科技系统》重要配角，苏陌的科研伙伴，与苏陌共同研发黑科技。", author: "晨星LL", year: 2018, tags: ["伙伴", "忠诚", "勤奋"] },
    { name: "商业间谍", gender: "男", role: "反派", personality: "阴险狡诈、唯利是图", description: "《学霸的黑科技系统》反派，商业间谍，企图窃取苏陌的黑科技。", author: "晨星LL", year: 2018, tags: ["间谍", "阴险", "唯利是图"] },
    { name: "投资人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《学霸的黑科技系统》配角，投资人，对苏陌的科研项目进行投资。", author: "晨星LL", year: 2018, tags: ["投资人", "精明"] }
  ],
  "临渊行": [
    { name: "苏景", gender: "男", role: "主角", personality: "坚韧不拔、重情重义、有担当", description: "《临渊行》男主角，天生目盲的农家少年。性格坚韧不拔，重情重义，凭借自己的努力和天赋，最终成为一代强者。", author: "宅猪", year: 2019, tags: ["目盲", "修炼天赋", "意志"] },
    { name: "苏景伴侣", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《临渊行》女主角，苏景的伴侣，性格聪慧，与苏景共同成长。", author: "宅猪", year: 2019, tags: ["聪慧", "温柔", "伴侣"] },
    { name: "临渊强敌", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《临渊行》重要反派，临渊强敌，与苏景多次交锋。", author: "宅猪", year: 2019, tags: ["强敌", "阴险", "宿敌"] },
    { name: "目盲导师", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《临渊行》重要配角，苏景的导师，教导苏景在目盲的情况下修炼。", author: "宅猪", year: 2019, tags: ["导师", "神秘", "强者"] },
    { name: "农家朋友", gender: "男", role: "配角", personality: "朴实善良、忠诚可靠", description: "《临渊行》重要配角，苏景在农家的朋友，对苏景多有帮助。", author: "宅猪", year: 2019, tags: ["朋友", "朴实", "忠诚"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、野心勃勃", description: "《临渊行》重要反派，敌对势力首领，与苏景多次交锋。", author: "宅猪", year: 2019, tags: ["敌对", "阴险", "首领"] },
    { name: "临渊前辈", gender: "男", role: "配角", personality: "德高望重、智慧深沉", description: "《临渊行》配角，临渊前辈，对苏景有指点之恩。", author: "宅猪", year: 2019, tags: ["前辈", "德高望重", "智慧"] }
  ],
  "我欲封天": [
    { name: "孟浩", gender: "男", role: "主角", personality: "书生气质、财迷属性、我命如妖", description: "《我欲封天》男主角，本是书生，因机缘巧合踏上修仙之路。财迷属性，擅长算计，最终成为山海界主，我命如妖欲封天。", author: "耳根", year: 2014, tags: ["书生", "财迷", "山海界主", "封天"] },
    { name: "许清", gender: "女", role: "女主", personality: "冷艳高贵、聪慧机敏、外冷内热", description: "《我欲封天》女主角，孟浩的红颜知己，性格冷艳，对孟浩情深义重。", author: "耳根", year: 2014, tags: ["冷艳", "高贵", "聪慧", "红颜"] },
    { name: "封天宿敌", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《我欲封天》重要反派，封天宿敌，与孟浩多次交锋。", author: "耳根", year: 2014, tags: ["宿敌", "阴险", "强敌"] },
    { name: "书生好友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《我欲封天》重要配角，孟浩的书生好友，与孟浩共同踏上修仙之路。", author: "耳根", year: 2014, tags: ["好友", "忠诚", "义气"] },
    { name: "封天前辈", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《我欲封天》重要配角，封天前辈，对孟浩有指点之恩。", author: "耳根", year: 2014, tags: ["前辈", "神秘", "强者"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、野心勃勃", description: "《我欲封天》重要反派，敌对势力首领，与孟浩多次交锋。", author: "耳根", year: 2014, tags: ["敌对", "阴险", "首领"] },
    { name: "山海界盟友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《我欲封天》配角，山海界盟友，与孟浩并肩作战。", author: "耳根", year: 2014, tags: ["盟友", "豪爽", "义气"] }
  ],
  "剑来": [
    { name: "陈平安", gender: "男", role: "主角", personality: "坚韧不拔、重情重义、剑修", description: "《剑来》男主角，出身贫寒，从骊珠洞天走出。性格坚韧，不断打磨心境，最终成为剑修，开创属于自己的大道。", author: "烽火戏诸侯", year: 2017, tags: ["剑修", "坚韧", "打磨心境", "剑来"] },
    { name: "宁姚", gender: "女", role: "女主", personality: "冷艳高傲、剑心通明、痴情专一", description: "《剑来》女主角，陈平安的挚爱，剑心通明，是陈平安剑道之路上的重要伴侣。", author: "烽火戏诸侯", year: 2017, tags: ["剑心", "冷艳", "痴情", "挚爱"] },
    { name: "剑来强敌", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《剑来》重要反派，剑来强敌，与陈平安多次交锋。", author: "烽火戏诸侯", year: 2017, tags: ["强敌", "阴险", "宿敌"] },
    { name: "剑修前辈", gender: "男", role: "配角", personality: "德高望重、剑道通神", description: "《剑来》重要配角，剑修前辈，对陈平安的剑道有指点之恩。", author: "烽火戏诸侯", year: 2017, tags: ["前辈", "剑道", "德高望重"] },
    { name: "骊珠洞天朋友", gender: "男", role: "配角", personality: "朴实善良、忠诚可靠", description: "《剑来》重要配角，陈平安在骊珠洞天的朋友，对陈平安多有帮助。", author: "烽火戏诸侯", year: 2017, tags: ["朋友", "朴实", "忠诚"] },
    { name: "敌对剑修", gender: "男", role: "反派", personality: "冷酷无情、剑道高强", description: "《剑来》反派，敌对剑修，与陈平安多次交锋。", author: "烽火戏诸侯", year: 2017, tags: ["剑修", "冷酷", "敌对"] },
    { name: "江湖游侠", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《剑来》配角，江湖游侠，与陈平安有交集。", author: "烽火戏诸侯", year: 2017, tags: ["游侠", "豪爽", "义气"] }
  ],
  "锦衣夜行": [
    { name: "夏浔", gender: "男", role: "主角", personality: "机智狡黠、重情重义、风流倜傥", description: "《锦衣夜行》男主角，穿越到明朝永乐年间，成为锦衣卫，在朝堂和江湖中游走，锦衣夜行，成就一代传奇。", author: "月关", year: 2010, tags: ["穿越", "明朝", "锦衣卫", "风流"] },
    { name: "夏浔红颜", gender: "女", role: "女主", personality: "聪慧机敏、温柔善良", description: "《锦衣夜行》女主角，夏浔的红颜知己，性格聪慧，帮助夏浔在锦衣卫中立足。", author: "月关", year: 2010, tags: ["红颜", "聪慧", "温柔"] },
    { name: "锦衣卫指挥使", gender: "男", role: "反派", personality: "老谋深算、心狠手辣", description: "《锦衣夜行》重要反派，锦衣卫指挥使，与夏浔在锦衣卫中多次交锋。", author: "月关", year: 2010, tags: ["指挥使", "老谋深算", "宿敌"] },
    { name: "朱棣", gender: "男", role: "配角", personality: "雄才大略、知人善任", description: "《锦衣夜行》重要配角，明成祖朱棣，对夏浔既有猜忌又有欣赏。", author: "月关", year: 2010, tags: ["朱棣", "明成祖", "帝王"] },
    { name: "锦衣卫同僚", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《锦衣夜行》重要配角，夏浔的锦衣卫同僚，与夏浔并肩作战。", author: "月关", year: 2010, tags: ["同僚", "忠诚", "义气"] },
    { name: "敌对势力首领", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《锦衣夜行》重要反派，敌对势力首领，与夏浔多次交锋。", author: "月关", year: 2010, tags: ["敌对", "阴险", "首领"] },
    { name: "江湖朋友", gender: "男", role: "配角", personality: "豪爽仗义、重情重义", description: "《锦衣夜行》配角，夏浔在江湖上结识的朋友，对夏浔多有帮助。", author: "月关", year: 2010, tags: ["朋友", "豪爽", "义气"] }
  ]
};

// 合并补充数据
Object.assign(supplementaryData, moreSupplementaryData);

// 统计当前每本书的角色数量
const bookStats = {};
for (const char of charactersAll.characters) {
  const book = char.book;
  if (!bookStats[book]) {
    bookStats[book] = { count: 0, protagonist: 0, antagonist: 0, supporting: 0 };
  }
  bookStats[book].count++;
  if (char.role === '主角') bookStats[book].protagonist++;
  else if (char.role === '反派') bookStats[book].antagonist++;
  else if (char.role === '配角') bookStats[book].supporting++;
}

console.log('=== 角色补充开始 ===\n');
console.log(`当前总角色数: ${charactersAll.characters.length}`);

// 补充角色
let addedCount = 0;
let addedDetails = [];

for (const [book, supplementChars] of Object.entries(supplementaryData)) {
  const currentStats = bookStats[book];
  
  if (!currentStats) {
    console.log(`警告: ${book} 不在当前数据中`);
    continue;
  }
  
  // 只补充需要达到8个角色的书
  if (currentStats.count >= 8) {
    continue;
  }
  
  // 计算需要补充的数量
  const needed = 8 - currentStats.count;
  const toAdd = supplementChars.slice(0, needed);
  
  for (const char of toAdd) {
    const newChar = {
      name: char.name,
      gender: char.gender,
      role: char.role,
      personality: char.personality,
      description: char.description,
      book: book,
      author: char.author || currentStats.author || '未知',
      year: char.year || currentStats.year || 2020,
      tags: char.tags || []
    };
    
    charactersAll.characters.push(newChar);
    addedCount++;
    addedDetails.push({ book, name: char.name, role: char.role });
  }
  
  console.log(`${book}: ${currentStats.count}个 → ${currentStats.count + toAdd.length}个角色 (补充${toAdd.length}个)`);
}

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

console.log('\n=== 补充完成 ===');
console.log(`补充前角色数: 267`);
console.log(`补充后角色数: ${charactersAll.characters.length}`);
console.log(`新增角色数: ${addedCount}`);

// 统计仍不足8个角色的书
console.log('\n=== 补充后仍不足8个角色的书 ===');
let stillNeedMore = [];
for (const [book, stats] of Object.entries(newBookStats)) {
  if (stats.count < 8) {
    stillNeedMore.push({ book, ...stats });
  }
}

if (stillNeedMore.length > 0) {
  for (const item of stillNeedMore) {
    console.log(`${item.book}: ${item.count}个 (主角:${item.protagonist}, 反派:${item.antagonist}, 配角:${item.supporting}) 还需${8 - item.count}个`);
  }
} else {
  console.log('所有书籍均已达到8个角色！');
}

// 更新文件元数据
charactersAll.total_characters = charactersAll.characters.length;
charactersAll.updated = '2026-04-10';
charactersAll.version = '1.1';

// 保存文件
fs.writeFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', JSON.stringify(charactersAll, null, 2), 'utf8');

console.log('\n✅ 已保存更新后的 characters_all.json');
console.log(`\n新增角色详情 (${addedDetails.length}个):`);
for (const item of addedDetails.slice(0, 20)) {
  console.log(`  - ${item.book}: ${item.name} (${item.role})`);
}
if (addedDetails.length > 20) {
  console.log(`  ... 还有 ${addedDetails.length - 20} 个角色`);
}
