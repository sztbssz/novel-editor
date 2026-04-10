const fs = require('fs');

// 读取当前数据
const charactersAll = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', 'utf8'));

// 需要继续补充的书籍数据
const moreCharacters = {
  "兽血沸腾": [
    { name: "海伦父亲", gender: "男", role: "配角", personality: "威严慈爱、狐族长老", description: "《兽血沸腾》重要配角，海伦的父亲，狐族长老，对刘震撼既有考验又有认可。", author: "静官", year: 2006, tags: ["狐族", "长老", "父亲"] },
    { name: "魔族将领", gender: "男", role: "反派", personality: "冷酷无情、战力强大", description: "《兽血沸腾》重要反派，魔族将领，与刘震撼多次交锋。", author: "静官", year: 2006, tags: ["魔族", "将领", "冷酷"] }
  ],
  "佛本是道": [
    { name: "周青师父", gender: "男", role: "配角", personality: "神秘莫测、道法高深", description: "《佛本是道》重要配角，周青的师父，教导周青修炼道法。", author: "梦入神机", year: 2006, tags: ["师父", "神秘", "道法"] },
    { name: "西方教主", gender: "男", role: "反派", personality: "虚伪伪善、阴谋算计", description: "《佛本是道》重要反派，西方教教主，与周青在封神之战中多次交锋。", author: "梦入神机", year: 2006, tags: ["教主", "虚伪", "宿敌"] },
    { name: "玉帝", gender: "男", role: "配角", personality: "威严深沉、权谋深沉", description: "《佛本是道》重要配角，天庭玉帝，对周青既有忌惮又有合作。", author: "梦入神机", year: 2006, tags: ["玉帝", "天庭", "威严"] },
    { name: "嫦娥", gender: "女", role: "配角", personality: "清冷绝艳、身世凄凉", description: "《佛本是道》重要配角，月宫嫦娥，与周青有交集。", author: "梦入神机", year: 2006, tags: ["嫦娥", "月宫", "清冷"] },
    { name: "准提道人", gender: "男", role: "反派", personality: "老谋深算、算计深远", description: "《佛本是道》重要反派，西方教准提道人，与周青在封神之战中多次交锋。", author: "梦入神机", year: 2006, tags: ["准提", "西方教", "老谋深算"] }
  ],
  "鬼吹灯": [
    { name: "大金牙", gender: "男", role: "配角", personality: "市侩精明、见多识广", description: "《鬼吹灯》重要配角，古董商人，为胡八一等人提供情报和装备。", author: "天下霸唱", year: 2006, tags: ["商人", "市侩", "情报"] },
    { name: "陈瞎子", gender: "男", role: "配角", personality: "神秘莫测、风水大师", description: "《鬼吹灯》重要配角，摸金校尉前辈，对胡八一点拨甚多。", author: "天下霸唱", year: 2006, tags: ["瞎子", "风水", "前辈"] },
    { name: "红姑娘", gender: "女", role: "配角", personality: "英气飒爽、身手矫健", description: "《鬼吹灯》重要配角，卸岭力士，与胡八一等人共同探险。", author: "天下霸唱", year: 2006, tags: ["卸岭", "英气", "矫健"] },
    { name: "鹧鸪哨", gender: "男", role: "配角", personality: "冷峻神秘、搬山道人", description: "《鬼吹灯》重要配角，Shirley杨的外公，搬山道人魁首。", author: "天下霸唱", year: 2006, tags: ["搬山", "冷峻", "神秘"] }
  ],
  "神墓": [
    { name: "辰南师父", gender: "男", role: "配角", personality: "神秘莫测、实力强大", description: "《神墓》重要配角，辰南的师父，教导辰南修炼。", author: "辰东", year: 2006, tags: ["师父", "神秘", "强者"] },
    { name: "七绝天女", gender: "女", role: "配角", personality: "风华绝代、实力强大", description: "《神墓》重要配角，天界强者，与辰南有交集。", author: "辰东", year: 2006, tags: ["天女", "风华", "强者"] }
  ],
  "空速星痕": [
    { name: "天痕父亲", gender: "男", role: "配角", personality: "慈爱深沉、空间异能者", description: "《空速星痕》重要配角，天痕的父亲，空间异能高手。", author: "唐家三少", year: 2006, tags: ["父亲", "空间", "慈爱"] },
    { name: "天痕母亲", gender: "女", role: "配角", personality: "温柔善良、水系异能者", description: "《空速星痕》重要配角，天痕的母亲，水系异能高手。", author: "唐家三少", year: 2006, tags: ["母亲", "水系", "温柔"] },
    { name: "敌对异能者", gender: "男", role: "反派", personality: "冷酷无情、野心勃勃", description: "《空速星痕》重要反派，敌对异能者组织首领，与天痕多次交锋。", author: "唐家三少", year: 2006, tags: ["敌对", "异能", "冷酷"] },
    { name: "异能导师", gender: "男", role: "配角", personality: "严厉慈爱、实力强大", description: "《空速星痕》重要配角，天痕的异能导师，教导天痕控制异能。", author: "唐家三少", year: 2006, tags: ["导师", "严厉", "强者"] },
    { name: "异能好友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《空速星痕》重要配角，天痕的异能好友，与天痕并肩作战。", author: "唐家三少", year: 2006, tags: ["好友", "忠诚", "义气"] },
    { name: "外星敌人", gender: "男", role: "反派", personality: "邪恶残暴、科技先进", description: "《空速星痕》重要反派，外星敌人，企图征服地球。", author: "唐家三少", year: 2006, tags: ["外星", "邪恶", "科技"] }
  ],
  "冰火魔厨": [
    { name: "冰灵", gender: "女", role: "配角", personality: "冷艳高贵、冰雪系魔法师", description: "《冰火魔厨》重要配角，融念冰的红颜知己，冰雪系魔法师。", author: "唐家三少", year: 2006, tags: ["冰系", "冷艳", "红颜"] },
    { name: "火灵", gender: "女", role: "配角", personality: "热情似火、火系魔法师", description: "《冰火魔厨》重要配角，融念冰的红颜知己，火系魔法师。", author: "唐家三少", year: 2006, tags: ["火系", "热情", "红颜"] },
    { name: "敌对厨师", gender: "男", role: "反派", personality: "嫉妒心强、厨艺高超", description: "《冰火魔厨》重要反派，敌对厨师，嫉妒融念冰的厨艺。", author: "唐家三少", year: 2006, tags: ["厨师", "嫉妒", "敌对"] },
    { name: "魔法导师", gender: "男", role: "配角", personality: "博学多才、严厉慈爱", description: "《冰火魔厨》重要配角，融念冰的魔法导师，教导融念冰魔法。", author: "唐家三少", year: 2006, tags: ["导师", "博学", "严厉"] },
    { name: "厨艺好友", gender: "男", role: "配角", personality: "忠诚可靠、厨艺精湛", description: "《冰火魔厨》重要配角，融念冰的厨艺好友，与融念冰共同研究厨艺。", author: "唐家三少", year: 2006, tags: ["好友", "忠诚", "厨艺"] },
    { name: "黑暗料理界首领", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《冰火魔厨》重要反派，黑暗料理界首领，与融念冰多次交锋。", author: "唐家三少", year: 2006, tags: ["料理界", "邪恶", "首领"] }
  ],
  "惟我独仙": [
    { name: "海龙师父", gender: "男", role: "配角", personality: "严厉慈爱、仙道高人", description: "《惟我独仙》重要配角，海龙的师父，仙道高人，教导海龙修炼。", author: "唐家三少", year: 2006, tags: ["师父", "严厉", "仙道"] },
    { name: "仙界公主", gender: "女", role: "配角", personality: "高贵典雅、聪慧机敏", description: "《惟我独仙》重要配角，仙界公主，与海龙有交集。", author: "唐家三少", year: 2006, tags: ["公主", "高贵", "聪慧"] },
    { name: "魔界魔王", gender: "男", role: "反派", personality: "邪恶残暴、野心勃勃", description: "《惟我独仙》重要反派，魔界魔王，企图入侵仙界。", author: "唐家三少", year: 2006, tags: ["魔王", "邪恶", "宿敌"] },
    { name: "仙道好友", gender: "男", role: "配角", personality: "忠诚可靠、重情重义", description: "《惟我独仙》重要配角，海龙的仙道好友，与海龙并肩作战。", author: "唐家三少", year: 2006, tags: ["好友", "忠诚", "义气"] },
    { name: "敌对仙人", gender: "男", role: "反派", personality: "阴险狡诈、实力强大", description: "《惟我独仙》重要反派，敌对仙人，与海龙多次交锋。", author: "唐家三少", year: 2006, tags: ["敌对", "阴险", "仙人"] },
    { name: "仙界前辈", gender: "男", role: "配角", personality: "德高望重、智慧深沉", description: "《惟我独仙》重要配角，仙界前辈，对海龙有指点之恩。", author: "唐家三少", year: 2006, tags: ["前辈", "德高望重", "智慧"] }
  ],
  "师士传说": [
    { name: "叶重父亲", gender: "男", role: "配角", personality: "神秘莫测、顶级师士", description: "《师士传说》重要配角，叶重的父亲，神秘的顶级师士。", author: "方想", year: 2006, tags: ["父亲", "神秘", "师士"] },
    { name: "叶重母亲", gender: "女", role: "配角", personality: "温柔善良、科学家", description: "《师士传说》重要配角，叶重的母亲，杰出的科学家。", author: "方想", year: 2006, tags: ["母亲", "温柔", "科学家"] },
    { name: "敌对师士", gender: "男", role: "反派", personality: "冷酷无情、实力强大", description: "《师士传说》重要反派，敌对师士，与叶重多次交锋。", author: "方想", year: 2006, tags: ["敌对", "冷酷", "师士"] },
    { name: "师士前辈", gender: "男", role: "配角", personality: "德高望重、经验丰富", description: "《师士传说》重要配角，师士前辈，对叶重有指点之恩。", author: "方想", year: 2006, tags: ["前辈", "德高望重", "经验"] },
    { name: "机甲商人", gender: "男", role: "配角", personality: "精明圆滑、重利轻义", description: "《师士传说》重要配角，机甲商人，与叶重有商业往来。", author: "方想", year: 2006, tags: ["商人", "精明", "机甲"] }
  ],
  "亵渎": [
    { name: "罗格师父", gender: "男", role: "配角", personality: "神秘莫测、魔法高深", description: "《亵渎》重要配角，罗格的魔法导师，教导罗格魔法。", author: "烟雨江南", year: 2006, tags: ["师父", "神秘", "魔法"] },
    { name: "安德烈", gender: "男", role: "反派", personality: "阴险狡诈、野心勃勃", description: "《亵渎》重要反派，罗格的政治对手，与罗格多次交锋。", author: "烟雨江南", year: 2006, tags: ["敌对", "阴险", "政客"] }
  ],
  "回到明朝当王爷": [
    { name: "正德皇帝", gender: "男", role: "配角", personality: "荒唐放纵、信任主角", description: "《回到明朝当王爷》重要配角，明武宗正德皇帝，对张天涯信任有加。", author: "月关", year: 2007, tags: ["皇帝", "荒唐", "信任"] },
    { name: "杨一清", gender: "男", role: "配角", personality: "老谋深算、忠心耿耿", description: "《回到明朝当王爷》重要配角，明朝重臣，与张天涯合作共事。", author: "月关", year: 2007, tags: ["重臣", "老谋深算", "忠心"] },
    { name: "江彬", gender: "男", role: "反派", personality: "阴险狡诈、野心勃勃", description: "《回到明朝当王爷》重要反派，边将，与张天涯在朝堂上争权。", author: "月关", year: 2007, tags: ["边将", "阴险", "宿敌"] }
  ],
  "极品家丁": [
    { name: "萧家老爷", gender: "男", role: "配角", personality: "威严慈爱、商场老手", description: "《极品家丁》重要配角，萧玉若的父亲，对萧别离从怀疑到欣赏。", author: "禹岩", year: 2007, tags: ["老爷", "威严", "商场"] },
    { name: "萧家夫人", gender: "女", role: "配角", personality: "温柔贤惠、疼爱女儿", description: "《极品家丁》重要配角，萧玉若的母亲，对萧别离多有照顾。", author: "禹岩", year: 2007, tags: ["夫人", "温柔", "疼爱"] },
    { name: "程德", gender: "男", role: "反派", personality: "阴险狡诈、官场老手", description: "《极品家丁》重要反派，官场对手，与萧别离多次交锋。", author: "禹岩", year: 2007, tags: ["官场", "阴险", "宿敌"] },
    { name: "陶婉盈", gender: "女", role: "配角", personality: "活泼可爱、痴情专一", description: "《极品家丁》重要配角，萧别离的红颜知己，性格活泼。", author: "禹岩", year: 2007, tags: ["红颜", "活泼", "痴情"] },
    { name: "董巧巧", gender: "女", role: "配角", personality: "温柔贤惠、厨艺精湛", description: "《极品家丁》重要配角，萧别离的红颜知己，擅长厨艺。", author: "禹岩", year: 2007, tags: ["红颜", "温柔", "厨艺"] }
  ],
  "无限恐怖": [
    { name: "张杰", gender: "男", role: "配角", personality: "沉稳内敛、经验丰富", description: "《无限恐怖》重要配角，中洲队资深者，对郑东霆多有照顾。", author: "zhttty", year: 2007, tags: ["资深者", "沉稳", "经验"] },
    { name: "零点", gender: "男", role: "配角", personality: "冷酷精准、狙击手", description: "《无限恐怖》重要配角，中洲队狙击手，枪法精准。", author: "zhttty", year: 2007, tags: ["狙击手", "冷酷", "精准"] },
    { name: "齐藤一", gender: "男", role: "配角", personality: "温和善良、考古专家", description: "《无限恐怖》重要配角，中洲队考古专家，知识渊博。", author: "zhttty", year: 2007, tags: ["考古", "温和", "博学"] }
  ],
  "庆余年": [
    { name: "范建", gender: "男", role: "配角", personality: "深沉内敛、忠心耿耿", description: "《庆余年》重要配角，范闲养父，对范闲视如己出。", author: "猫腻", year: 2007, tags: ["养父", "深沉", "忠心"] },
    { name: "范若若", gender: "女", role: "配角", personality: "聪慧机敏、才情出众", description: "《庆余年》重要配角，范闲妹妹，京都第一才女。", author: "猫腻", year: 2007, tags: ["妹妹", "才女", "聪慧"] },
    { name: "王启年", gender: "男", role: "配角", personality: "市侩精明、轻功卓绝", description: "《庆余年》重要配角，监察院文书，范闲的得力助手。", author: "猫腻", year: 2007, tags: ["文书", "市侩", "轻功"] }
  ],
  "星辰变": [
    { name: "秦德", gender: "男", role: "配角", personality: "威严深沉、父爱如山", description: "《星辰变》重要配角，秦羽的父亲，镇东王秦德。", author: "我吃西红柿", year: 2007, tags: ["父亲", "镇东王", "威严"] },
    { name: "风玉子", gender: "男", role: "配角", personality: "仙风道骨、阵法大师", description: "《星辰变》重要配角，秦羽的阵法导师，金丹期高手。", author: "我吃西红柿", year: 2007, tags: ["导师", "阵法", "仙风"] },
    { name: "秦风", gender: "男", role: "配角", personality: "沉稳大气、兄友弟恭", description: "《星辰变》重要配角，秦羽的大哥，镇东王世子。", author: "我吃西红柿", year: 2007, tags: ["大哥", "沉稳", "世子"] },
    { name: "秦政", gender: "男", role: "配角", personality: "温文尔雅、智谋过人", description: "《星辰变》重要配角，秦羽的二哥，镇东王次子。", author: "我吃西红柿", year: 2007, tags: ["二哥", "温文", "智谋"] },
    { name: "项央", gender: "男", role: "反派", personality: "霸道强势、野心勃勃", description: "《星辰变》重要反派，楚王朝老祖宗，元婴期高手。", author: "我吃西红柿", year: 2007, tags: ["老祖宗", "霸道", "宿敌"] }
  ],
  "恶魔法则": [
    { name: "甘多夫", gender: "男", role: "配角", personality: "疯癫强大、魔法高深", description: "《恶魔法则》重要配角，大魔法师，薇薇安的师父，实力强大。", author: "跳舞", year: 2008, tags: ["魔法师", "疯癫", "强大"] },
    { name: "罗伯特", gender: "男", role: "配角", personality: "忠诚勇敢、骑士精神", description: "《恶魔法则》重要配角，杜维的骑士护卫，忠心耿耿。", author: "跳舞", year: 2008, tags: ["骑士", "忠诚", "勇敢"] },
    { name: "乔治", gender: "男", role: "配角", personality: "豪爽粗犷、忠诚可靠", description: "《恶魔法则》重要配角，杜维的追随者，性格豪爽。", author: "跳舞", year: 2008, tags: ["追随者", "豪爽", "忠诚"] }
  ],
  "盘龙": [
    { name: "霍格", gender: "男", role: "配角", personality: "慈爱严厉、巴鲁克家族族长", description: "《盘龙》重要配角，林雷的父亲，巴鲁克家族族长。", author: "我吃西红柿", year: 2008, tags: ["父亲", "族长", "慈爱"] }
  ],
  "斗罗大陆": [
    { name: "戴沐白", gender: "男", role: "配角", personality: "邪眸白虎、史莱克七怪老大", description: "《斗罗大陆》重要配角，史莱克七怪之一，星罗帝国皇子。", author: "唐家三少", year: 2008, tags: ["白虎", "七怪", "皇子"] },
    { name: "奥斯卡", gender: "男", role: "配角", personality: "香肠专卖、史莱克七怪之一", description: "《斗罗大陆》重要配角，史莱克七怪之一，食物系魂师。", author: "唐家三少", year: 2008, tags: ["食物系", "七怪", "搞笑"] },
    { name: "马红俊", gender: "男", role: "配角", personality: "邪火凤凰、史莱克七怪之一", description: "《斗罗大陆》重要配角，史莱克七怪之一，拥有邪火凤凰武魂。", author: "唐家三少", year: 2008, tags: ["凤凰", "七怪", "邪火"] }
  ],
  "琴帝": [
    { name: "秦殇", gender: "男", role: "配角", personality: "琴宗宗主、叶音竹的师父", description: "《琴帝》重要配角，琴宗宗主，叶音竹的琴艺导师。", author: "唐家三少", year: 2008, tags: ["琴宗", "宗主", "导师"] },
    { name: "香鸾", gender: "女", role: "配角", personality: "米兰公主、活泼可爱", description: "《琴帝》重要配角，米兰帝国公主，叶音竹的红颜知己。", author: "唐家三少", year: 2008, tags: ["公主", "活泼", "红颜"] },
    { name: "海洋", gender: "女", role: "配角", personality: "温柔内向、弹奏古琴", description: "《琴帝》重要配角，叶音竹的同学，擅长古琴演奏。", author: "唐家三少", year: 2008, tags: ["同学", "温柔", "古琴"] },
    { name: "紫", gender: "男", role: "配角", personality: "紫晶比蒙、兽人之王", description: "《琴帝》重要配角，紫晶比蒙巨兽，叶音竹的契约魔兽。", author: "唐家三少", year: 2008, tags: ["比蒙", "兽王", "契约"] },
    { name: "斯隆", gender: "男", role: "反派", personality: "法蓝黑暗塔主、野心勃勃", description: "《琴帝》重要反派，法蓝黑暗塔主，企图控制大陆。", author: "唐家三少", year: 2008, tags: ["塔主", "黑暗", "宿敌"] },
    { name: "妮娜", gender: "女", role: "配角", personality: "米兰魔武学院院长、严厉慈爱", description: "《琴帝》重要配角，米兰魔武学院院长，对叶音竹多有照顾。", author: "唐家三少", year: 2008, tags: ["院长", "严厉", "照顾"] }
  ],
  "凡人修仙传": [
    { name: "墨大夫", gender: "男", role: "反派", personality: "阴险狡诈、图谋夺舍", description: "《凡人修仙传》重要反派，韩立的第一个师父，企图夺舍韩立。", author: "忘语", year: 2008, tags: ["师父", "阴险", "夺舍"] },
    { name: "厉飞雨", gender: "男", role: "配角", personality: "豪爽仗义、韩立好友", description: "《凡人修仙传》重要配角，韩立在七玄门的好友，性格豪爽。", author: "忘语", year: 2008, tags: ["好友", "豪爽", "义气"] },
    { name: "黄枫谷掌门", gender: "男", role: "配角", personality: "老谋深算、结丹期修士", description: "《凡人修仙传》重要配角，黄枫谷掌门，对韩立有所关注。", author: "忘语", year: 2008, tags: ["掌门", "老谋深算", "结丹"] },
    { name: "陈巧倩", gender: "女", role: "配角", personality: "温柔善良、暗恋韩立", description: "《凡人修仙传》重要配角，黄枫谷女修，对韩立有好感。", author: "忘语", year: 2008, tags: ["女修", "温柔", "暗恋"] },
    { name: "血色禁地敌人", gender: "男", role: "反派", personality: "冷酷无情、杀人夺宝", description: "《凡人修仙传》重要反派，血色禁地中的敌对修士，与韩立多次交锋。", author: "忘语", year: 2008, tags: ["敌人", "冷酷", "夺宝"] }
  ],
  "斗破苍穹": [
    { name: "纳兰嫣然", gender: "女", role: "配角", personality: "高傲自负、云岚宗少宗主", description: "《斗破苍穹》重要配角，云岚宗少宗主，曾与萧炎退婚，后对其改观。", author: "天蚕土豆", year: 2009, tags: ["少宗主", "高傲", "宿敌"] },
    { name: "雅妃", gender: "女", role: "配角", personality: "妩媚动人、米特尔拍卖师", description: "《斗破苍穹》重要配角，米特尔拍卖场首席拍卖师，对萧炎多有帮助。", author: "天蚕土豆", year: 2009, tags: ["拍卖师", "妩媚", "帮助"] }
  ],
  "阳神": [
    { name: "梦神机", gender: "男", role: "反派", personality: "太上道宗主、天下第一人", description: "《阳神》重要反派，太上道宗主，洪易的主要对手之一。", author: "梦入神机", year: 2008, tags: ["宗主", "天下第一", "宿敌"] },
    { name: "元世祖", gender: "男", role: "配角", personality: "雄才大略、大乾皇帝", description: "《阳神》重要配角，大乾王朝皇帝，洪易需要面对的皇权象征。", author: "梦入神机", year: 2008, tags: ["皇帝", "雄才大略", "皇权"] },
    { name: "精元神庙教皇", gender: "男", role: "反派", personality: "信仰狂热、实力强大", description: "《阳神》重要反派，精元神庙教皇，与洪易在信仰上对立。", author: "梦入神机", year: 2008, tags: ["教皇", "狂热", "宿敌"] },
    { name: "芸香香", gender: "女", role: "配角", personality: "香香公主、真宗圣女", description: "《阳神》重要配角，真宗圣女，洪易的红颜知己之一。", author: "梦入神机", year: 2008, tags: ["圣女", "红颜", "香香"] },
    { name: "大金蛛", gender: "女", role: "配角", personality: "活泼可爱、蛛王后代", description: "《阳神》重要配角，金蛛法王后代，与洪易结为兄妹。", author: "梦入神机", year: 2008, tags: ["蛛王", "活泼", "兄妹"] }
  ],
  "间客": [
    { name: "施清海", gender: "男", role: "配角", personality: "风流不羁、帝国间谍", description: "《间客》重要配角，许乐的好友，帝国间谍，性格风流。", author: "猫腻", year: 2008, tags: ["间谍", "风流", "好友"] },
    { name: "张小萌", gender: "女", role: "配角", personality: "清纯善良、许乐初恋", description: "《间客》重要配角，许乐的初恋女友，性格清纯。", author: "猫腻", year: 2008, tags: ["初恋", "清纯", "善良"] },
    { name: "南相美", gender: "女", role: "配角", personality: "知性优雅、林家千金", description: "《间客》重要配角，林家千金，许乐的红颜知己。", author: "猫腻", year: 2008, tags: ["千金", "知性", "红颜"] },
    { name: "钟瘦虎", gender: "男", role: "反派", personality: "铁骨铮铮、钟家司令", description: "《间客》重要反派，钟家司令，与许乐在战场上交锋。", author: "猫腻", year: 2008, tags: ["司令", "铁骨", "宿敌"] },
    { name: "怀草诗", gender: "女", role: "配角", personality: "帝国公主、许乐姐姐", description: "《间客》重要配角，帝国公主，许乐的姐姐，实力强大。", author: "猫腻", year: 2008, tags: ["公主", "姐姐", "强大"] }
  ],
  "仙逆": [
    { name: "司徒南", gender: "男", role: "配角", personality: "霸气侧漏、天逆珠前任主人", description: "《仙逆》重要配角，天逆珠前任主人，对王林影响深远。", author: "耳根", year: 2008, tags: ["天逆", "霸气", "前辈"] },
    { name: "孙大柱", gender: "男", role: "反派", personality: "贪婪吝啬、王林师父", description: "《仙逆》重要反派，王林在恒岳派的师父，对王林不好。", author: "耳根", year: 2008, tags: ["师父", "贪婪", "反派"] },
    { name: "周茹", gender: "女", role: "配角", personality: "善良可爱、李慕婉转世之身", description: "《仙逆》重要配角，李慕婉的转世之身，与王林有情感纠葛。", author: "耳根", year: 2008, tags: ["转世", "善良", "纠葛"] },
    { name: "红蝶", gender: "女", role: "配角", personality: "骄傲自负、朱雀星天骄", description: "《仙逆》重要配角，朱雀星天骄，与王林有过节。", author: "耳根", year: 2008, tags: ["天骄", "骄傲", "过节"] },
    { name: "清水", gender: "男", role: "配角", personality: "杀戮仙君、王林师兄", description: "《仙逆》重要配角，杀戮仙君，王林的师兄，实力强大。", author: "耳根", year: 2008, tags: ["仙君", "师兄", "强大"] }
  ],
  "九鼎记": [
    { name: "诸葛元洪", gender: "男", role: "配角", personality: "归元宗宗主、慧眼识珠", description: "《九鼎记》重要配角，归元宗宗主，滕青山的师父。", author: "我吃西红柿", year: 2009, tags: ["宗主", "慧眼", "师父"] },
    { name: "诸葛云", gender: "女", role: "配角", personality: "宗主之女、聪慧机敏", description: "《九鼎记》重要配角，诸葛元洪之女，滕青山的红颜知己。", author: "我吃西红柿", year: 2009, tags: ["宗主之女", "聪慧", "红颜"] },
    { name: "青湖岛岛主", gender: "男", role: "反派", personality: "野心勃勃、实力强大", description: "《九鼎记》重要反派，青湖岛岛主，滕青山的主要敌人。", author: "我吃西红柿", year: 2009, tags: ["岛主", "野心", "宿敌"] },
    { name: "滕永凡", gender: "男", role: "配角", personality: "严厉慈爱、滕青山父亲", description: "《九鼎记》重要配角，滕青山的父亲，对滕青山期望很高。", author: "我吃西红柿", year: 2009, tags: ["父亲", "严厉", "期望"] },
    { name: "滕永湘", gender: "男", role: "配角", personality: "豪爽仗义、滕青山表哥", description: "《九鼎记》重要配角，滕青山的表哥，性格豪爽。", author: "我吃西红柿", year: 2009, tags: ["表哥", "豪爽", "仗义"] },
    { name: "天神宫宫主", gender: "男", role: "反派", personality: "深不可测、裴三", description: "《九鼎记》重要反派，天神宫宫主裴三，滕青山的最终对手。", author: "我吃西红柿", year: 2009, tags: ["宫主", "深不可测", "宿敌"] }
  ],
  "陈二狗的妖孽人生": [
    { name: "陈富贵", gender: "男", role: "配角", personality: "憨厚老实、力大无穷", description: "《陈二狗的妖孽人生》重要配角，陈二狗的哥哥，性格憨厚。", author: "烽火戏诸侯", year: 2008, tags: ["哥哥", "憨厚", "力大"] },
    { name: "王虎剩", gender: "男", role: "配角", personality: "精明圆滑、盗墓高手", description: "《陈二狗的妖孽人生》重要配角，陈二狗的朋友，盗墓高手。", author: "烽火戏诸侯", year: 2008, tags: ["朋友", "精明", "盗墓"] },
    { name: "钱子项", gender: "男", role: "配角", personality: "老谋深算、曹家军师", description: "《陈二狗的妖孽人生》重要配角，曹蒹葭的外公，陈二狗的贵人。", author: "烽火戏诸侯", year: 2008, tags: ["外公", "老谋深算", "贵人"] },
    { name: "魏端公", gender: "男", role: "反派", personality: "南京大佬、阴险狠辣", description: "《陈二狗的妖孽人生》重要反派，南京地下势力大佬，与陈二狗多次交锋。", author: "烽火戏诸侯", year: 2008, tags: ["大佬", "阴险", "宿敌"] },
    { name: "竹叶青", gender: "女", role: "配角", personality: "冷艳妖娆、南京女王", description: "《陈二狗的妖孽人生》重要配角，南京地下女王，与陈二狗有交集。", author: "烽火戏诸侯", year: 2008, tags: ["女王", "冷艳", "妖娆"] },
    { name: "沐小夭", gender: "女", role: "配角", personality: "清纯可爱、陈二狗初恋", description: "《陈二狗的妖孽人生》重要配角，陈二狗的初恋女友，性格清纯。", author: "烽火戏诸侯", year: 2008, tags: ["初恋", "清纯", "可爱"] }
  ],
  "盗墓笔记": [
    { name: "吴三省", gender: "男", role: "配角", personality: "神秘莫测、老九门后人", description: "《盗墓笔记》重要配角，吴邪的三叔，老九门吴家后人，行为神秘。", author: "南派三叔", year: 2006, tags: ["三叔", "神秘", "九门"] },
    { name: "解雨臣", gender: "男", role: "配角", personality: "风华绝代、解家当家", description: "《盗墓笔记》重要配角，解家当家，人称花儿爷，身手不凡。", author: "南派三叔", year: 2006, tags: ["当家", "风华", "解家"] },
    { name: "黑眼镜", gender: "男", role: "配角", personality: "神秘强大、始终戴墨镜", description: "《盗墓笔记》重要配角，神秘高手，始终戴着黑眼镜，实力强大。", author: "南派三叔", year: 2006, tags: ["墨镜", "神秘", "高手"] },
    { name: "霍秀秀", gender: "女", role: "配角", personality: "聪慧机敏、霍家当家", description: "《盗墓笔记》重要配角，霍家当家，解雨臣的青梅竹马。", author: "南派三叔", year: 2006, tags: ["当家", "聪慧", "霍家"] }
  ],
  "遮天": [
    { name: "庞博", gender: "男", role: "配角", personality: "豪爽仗义、妖神血脉", description: "《遮天》重要配角，叶凡的同学，被妖帝附体，与叶凡并肩作战。", author: "辰东", year: 2010, tags: ["同学", "豪爽", "妖神"] },
    { name: "段德", gender: "男", role: "配角", personality: "猥琐贪财、无良道士", description: "《遮天》重要配角，无良道士段德，喜欢盗墓，与叶凡亦敌亦友。", author: "辰东", year: 2010, tags: ["道士", "贪财", "无良"] },
    { name: "华云飞", gender: "男", role: "反派", personality: "温文尔雅、狠毒无情", description: "《遮天》重要反派，太玄门弟子，表面温文尔雅实则狠毒。", author: "辰东", year: 2010, tags: ["太玄", "温文", "狠毒"] },
    { name: "安妙依", gender: "女", role: "配角", personality: "风华绝代、妙欲庵传人", description: "《遮天》重要配角，妙欲庵传人，叶凡的红颜知己。", author: "辰东", year: 2010, tags: ["妙欲", "风华", "红颜"] }
  ],
  "吞噬星空": [
    { name: "雷神", gender: "男", role: "配角", personality: "雷电武馆馆主、地球第二强者", description: "《吞噬星空》重要配角，雷电武馆馆主，地球第二强者。", author: "我吃西红柿", year: 2010, tags: ["雷神", "馆主", "第二"] },
    { name: "洪", gender: "男", role: "配角", personality: "极限武馆馆主、地球第一强者", description: "《吞噬星空》重要配角，极限武馆馆主，地球第一强者，罗峰的引路人。", author: "我吃西红柿", year: 2010, tags: ["洪", "馆主", "第一"] },
    { name: "金角巨兽", gender: "男", role: "反派", personality: "星空巨兽、毁灭地球", description: "《吞噬星空》重要反派，星空巨兽，给地球带来毁灭危机。", author: "我吃西红柿", year: 2010, tags: ["巨兽", "星空", "毁灭"] },
    { name: "罗华", gender: "男", role: "配角", personality: "罗峰弟弟、残疾但坚强", description: "《吞噬星空》重要配角，罗峰的弟弟，虽然残疾但坚强乐观。", author: "我吃西红柿", year: 2010, tags: ["弟弟", "残疾", "坚强"] },
    { name: "江芳", gender: "女", role: "配角", personality: "罗峰教官、实力强大", description: "《吞噬星空》重要配角，罗峰的教官，对罗峰多有照顾。", author: "我吃西红柿", year: 2010, tags: ["教官", "强大", "照顾"] }
  ],
  "武动乾坤": [
    { name: "林动父亲", gender: "男", role: "配角", personality: "慈爱严厉、林家高手", description: "《武动乾坤》重要配角，林动的父亲，林家高手。", author: "天蚕土豆", year: 2010, tags: ["父亲", "高手", "慈爱"] },
    { name: "青檀", gender: "女", role: "配角", personality: "林动妹妹、活泼可爱", description: "《武动乾坤》重要配角，林动的妹妹，性格活泼可爱。", author: "天蚕土豆", year: 2010, tags: ["妹妹", "活泼", "可爱"] },
    { name: "林琅天", gender: "男", role: "反派", personality: "林氏宗族天才、林动宿敌", description: "《武动乾坤》重要反派，林氏宗族天才，林动的宿敌。", author: "天蚕土豆", year: 2010, tags: ["天才", "宿敌", "宗族"] },
    { name: "绫清竹", gender: "女", role: "女主", personality: "九天太清宫圣女、清冷绝艳", description: "《武动乾坤》女主角之一，九天太清宫圣女，与林动有一段情。", author: "天蚕土豆", year: 2010, tags: ["圣女", "清冷", "女主"] },
    { name: "小貂", gender: "男", role: "配角", personality: "天妖貂、林动伙伴", description: "《武动乾坤》重要配角，天妖貂，林动的伙伴，性格风骚。", author: "天蚕土豆", year: 2010, tags: ["天妖貂", "伙伴", "风骚"] },
    { name: "小炎", gender: "男", role: "配角", personality: "火蟒虎、林动宠物", description: "《武动乾坤》重要配角，火蟒虎，林动的宠物，后化为人形。", author: "天蚕土豆", year: 2010, tags: ["火蟒虎", "宠物", "忠心"] }
  ],
  "圣墟": [
    { name: "楚风父母", gender: "男", role: "配角", personality: "慈爱担忧、牵挂楚风", description: "《圣墟》重要配角，楚风的父母，始终牵挂楚风。", author: "辰东", year: 2016, tags: ["父母", "慈爱", "牵挂"] },
    { name: "欧阳风", gender: "男", role: "配角", personality: "神兽欧阳风、搞笑担当", description: "《圣墟》重要配角，神兽欧阳风，楚风的好友，性格搞笑。", author: "辰东", year: 2016, tags: ["神兽", "搞笑", "好友"] }
  ],
  "牧神记": [
    { name: "秦牧师父们", gender: "男", role: "配角", personality: "各有所长、疼爱秦牧", description: "《牧神记》重要配角，残老村的九位师父，各有所长，疼爱秦牧。", author: "宅猪", year: 2016, tags: ["师父", "疼爱", "残老"] },
    { name: "上苍诸神", gender: "男", role: "反派", personality: "高高在上、视众生如草芥", description: "《牧神记》重要反派，上苍诸神，秦牧需要对抗的存在。", author: "宅猪", year: 2016, tags: ["上苍", "高高在上", "宿敌"] }
  ],
  "修真聊天群": [
    { name: "北河散人", gender: "男", role: "配角", personality: "聊天群群主、热心前辈", description: "《修真聊天群》重要配角，修真聊天群群主，对宋书航多有照顾。", author: "圣骑士的传说", year: 2016, tags: ["群主", "前辈", "热心"] },
    { name: "羽柔子", gender: "女", role: "配角", personality: "天真烂漫、灵蝶尊者之女", description: "《修真聊天群》重要配角，灵蝶尊者之女，性格天真烂漫。", author: "圣骑士的传说", year: 2016, tags: ["尊者之女", "天真", "活泼"] },
    { name: "药师", gender: "男", role: "配角", personality: "炼丹大师、话痨", description: "《修真聊天群》重要配角，炼丹大师，宋书航的炼丹导师。", author: "圣骑士的传说", year: 2016, tags: ["炼丹", "导师", "话痨"] },
    { name: "黄山真君", gender: "男", role: "配角", personality: "可靠前辈、照顾后辈", description: "《修真聊天群》重要配角，可靠的修真前辈，照顾宋书航。", author: "圣骑士的传说", year: 2016, tags: ["真君", "可靠", "前辈"] }
  ],
  "大王饶命": [
    { name: "李弦一", gender: "男", role: "配角", personality: "剑道大师、吕树师父", description: "《大王饶命》重要配角，剑道大师，吕树的剑道导师。", author: "会说话的肘子", year: 2016, tags: ["剑道", "师父", "大师"] },
    { name: "幽明羽", gender: "男", role: "配角", personality: "天罗地网高手、搞笑担当", description: "《大王饶命》重要配角，天罗地网高手，性格搞笑。", author: "会说话的肘子", year: 2016, tags: ["天罗", "高手", "搞笑"] },
    { name: "纳兰雀", gender: "女", role: "配角", personality: "吕树同学、性格傲娇", description: "《大王饶命》重要配角，吕树的同学，性格傲娇。", author: "会说话的肘子", year: 2016, tags: ["同学", "傲娇", "活泼"] },
    { name: "刘修", gender: "男", role: "配角", personality: "吕树好友、一起成长", description: "《大王饶命》重要配角，吕树的好友，与吕树一起变强。", author: "会说话的肘子", year: 2016, tags: ["好友", "成长", "义气"] }
  ],
  "全球高武": [
    { name: "李长生", gender: "男", role: "配角", personality: "长生剑客、方平师父", description: "《全球高武》重要配角，长生剑客，方平的剑道导师。", author: "老鹰吃小鸡", year: 2016, tags: ["剑客", "师父", "长生"] },
    { name: "吴奎山", gender: "男", role: "配角", personality: "魔都武大校长、老谋深算", description: "《全球高武》重要配角，魔都武大校长，对方平多有照顾。", author: "老鹰吃小鸡", year: 2016, tags: ["校长", "老谋深算", "照顾"] },
    { name: "张卫雨", gender: "男", role: "配角", personality: "方平战友、并肩作战", description: "《全球高武》重要配角，方平的战友，与方平并肩作战。", author: "老鹰吃小鸡", year: 2016, tags: ["战友", "并肩", "义气"] },
    { name: "镇星城老祖", gender: "男", role: "配角", personality: "人类绝巅、守护人类", description: "《全球高武》重要配角，镇星城老祖，人类绝巅强者，守护人类。", author: "老鹰吃小鸡", year: 2016, tags: ["老祖", "绝巅", "守护"] },
    { name: "天外天敌人", gender: "男", role: "反派", personality: "天外天强者、人类之敌", description: "《全球高武》重要反派，天外天强者，人类的敌人。", author: "老鹰吃小鸡", year: 2016, tags: ["天外天", "敌人", "强者"] }
  ],
  "诡秘之主": [
    { name: "罗塞尔大帝", gender: "男", role: "配角", personality: "穿越者前辈、日记作者", description: "《诡秘之主》重要配角，穿越者前辈，罗塞尔大帝，留下神秘日记。", author: "爱潜水的乌贼", year: 2018, tags: ["穿越者", "大帝", "前辈"] },
    { name: "邓恩·史密斯", gender: "男", role: "配角", personality: "值夜者队长、恪尽职守", description: "《诡秘之主》重要配角，黑荆棘安保公司值夜者队长，对克莱恩多有照顾。", author: "爱潜水的乌贼", year: 2018, tags: ["队长", "恪尽职守", "照顾"] }
  ],
  "雪中悍刀行": [
    { name: "徐骁", gender: "男", role: "配角", personality: "人屠、北凉王、父爱深沉", description: "《雪中悍刀行》重要配角，北凉王徐骁，徐凤年的父亲，人屠之名威震天下。", author: "烽火戏诸侯", year: 2012, tags: ["北凉王", "人屠", "父爱"] }
  ],
  "一念永恒": [
    { name: "白小纯师父", gender: "男", role: "配角", personality: "严厉慈爱、教导有方", description: "《一念永恒》重要配角，白小纯的师父，对白小纯既严厉又疼爱。", author: "耳根", year: 2016, tags: ["师父", "严厉", "疼爱"] },
    { name: "侯小妹", gender: "女", role: "配角", personality: "活泼可爱、暗恋白小纯", description: "《一念永恒》重要配角，侯小妹，暗恋白小纯，性格活泼。", author: "耳根", year: 2016, tags: ["暗恋", "活泼", "可爱"] },
    { name: "宋缺", gender: "男", role: "配角", personality: "天骄弟子、白小纯对手", description: "《一念永恒》重要配角，宋缺，白小纯的对手，后成为朋友。", author: "耳根", year: 2016, tags: ["天骄", "对手", "朋友"] },
    { name: "血溪宗老祖", gender: "男", role: "反派", personality: "邪恶强大、血溪宗领袖", description: "《一念永恒》重要反派，血溪宗老祖，白小纯需要面对的强者。", author: "耳根", year: 2016, tags: ["老祖", "邪恶", "血溪"] },
    { name: "星空道极宗宗主", gender: "男", role: "反派", personality: "高高在上、算计深远", description: "《一念永恒》重要反派，星空道极宗宗主，与白小纯多次交锋。", author: "耳根", year: 2016, tags: ["宗主", "高高在上", "宿敌"] },
    { name: "逆河宗宗主", gender: "男", role: "配角", personality: "德高望重、庇护白小纯", description: "《一念永恒》重要配角，逆河宗宗主，对白小纯多有庇护。", author: "耳根", year: 2016, tags: ["宗主", "德高望重", "庇护"] }
  ],
  "完美世界": [
    { name: "柳神", gender: "女", role: "配角", personality: "神秘强大、石村祭灵", description: "《完美世界》重要配角，柳神，石村祭灵，对石昊影响深远。", author: "辰东", year: 2013, tags: ["柳神", "祭灵", "神秘"] },
    { name: "石中天", gender: "男", role: "配角", personality: "大魔王、石昊爷爷", description: "《完美世界》重要配角，石中天，石昊的爷爷，大魔王之名威震天下。", author: "辰东", year: 2013, tags: ["爷爷", "大魔王", "威震"] },
    { name: "石子陵", gender: "男", role: "配角", personality: "石昊父亲、为子复仇", description: "《完美世界》重要配角，石子陵，石昊的父亲，为子复仇怒闯武王府。", author: "辰东", year: 2013, tags: ["父亲", "复仇", "怒闯"] },
    { name: "秦怡宁", gender: "女", role: "配角", personality: "石昊母亲、温柔慈爱", description: "《完美世界》重要配角，秦怡宁，石昊的母亲，性格温柔。", author: "辰东", year: 2013, tags: ["母亲", "温柔", "慈爱"] },
    { name: "石毅母亲", gender: "女", role: "反派", personality: "狠毒无情、挖骨凶手", description: "《完美世界》重要反派，石毅的母亲，挖去石昊至尊骨的凶手。", author: "辰东", year: 2013, tags: ["母亲", "狠毒", "凶手"] }
  ],
  "大主宰": [
    { name: "牧锋", gender: "男", role: "配角", personality: "牧域域主、牧尘父亲", description: "《大主宰》重要配角，牧锋，牧尘的父亲，牧域域主。", author: "天蚕土豆", year: 2013, tags: ["父亲", "域主", "牧域"] },
    { name: "九幽雀", gender: "女", role: "配角", personality: "九幽冥雀、牧尘伙伴", description: "《大主宰》重要配角，九幽雀，牧尘的伙伴，拥有九幽冥雀血脉。", author: "天蚕土豆", year: 2013, tags: ["九幽", "伙伴", "冥雀"] },
    { name: "曼荼罗", gender: "女", role: "配角", personality: "大罗天域域主、神秘强大", description: "《大主宰》重要配角，曼荼罗，大罗天域域主，实力强大。", author: "天蚕土豆", year: 2013, tags: ["域主", "大罗", "神秘"] },
    { name: "姬玄", gender: "男", role: "反派", personality: "圣灵院天骄、牧尘宿敌", description: "《大主宰》重要反派，姬玄，圣灵院天骄，牧尘的宿敌。", author: "天蚕土豆", year: 2013, tags: ["天骄", "宿敌", "圣灵"] },
    { name: "浮屠老祖", gender: "男", role: "反派", personality: "浮屠古族老祖、高高在上", description: "《大主宰》重要反派，浮屠古族老祖，牧尘需要面对的强敌。", author: "天蚕土豆", year: 2013, tags: ["老祖", "浮屠", "强敌"] }
  ],
  "龙血战神": [
    { name: "杨雪", gender: "女", role: "配角", personality: "杨灵青、龙辰妹妹", description: "《龙血战神》重要配角，杨雪，龙辰的妹妹，后改名杨灵青。", author: "风青阳", year: 2013, tags: ["妹妹", "灵青", "亲情"] },
    { name: "柳岚", gender: "女", role: "反派", personality: "狠毒无情、挖骨凶手", description: "《龙血战神》重要反派，柳岚，挖去龙辰龙魂的凶手。", author: "风青阳", year: 2013, tags: ["凶手", "狠毒", "挖骨"] },
    { name: "东方玄霄", gender: "男", role: "配角", personality: "东方家族天才、龙辰盟友", description: "《龙血战神》重要配角，东方玄霄，东方家族天才，龙辰的盟友。", author: "风青阳", year: 2013, tags: ["天才", "盟友", "东方"] },
    { name: "龙青澜", gender: "男", role: "配角", personality: "龙辰父亲、龙族强者", description: "《龙血战神》重要配角，龙青澜，龙辰的父亲，龙族强者。", author: "风青阳", year: 2013, tags: ["父亲", "龙族", "强者"] },
    { name: "莫小狼", gender: "男", role: "配角", personality: "噬日妖狼、龙辰兄弟", description: "《龙血战神》重要配角，莫小狼，噬日妖狼，龙辰的生死兄弟。", author: "风青阳", year: 2013, tags: ["妖狼", "兄弟", "生死"] },
    { name: "黑帝", gender: "男", role: "反派", personality: "黑帝教教主、阴谋深远", description: "《龙血战神》重要反派，黑帝教教主，与龙辰多次交锋。", author: "风青阳", year: 2013, tags: ["教主", "黑帝", "阴谋"] }
  ],
  "惊悚乐园": [
    { name: "疯不觉", gender: "男", role: "主角", personality: "智商极高、吐槽狂魔、疯狂理性", description: "《惊悚乐园》男主角，推理小说作家，患有轻度精神疾病。智商极高，性格疯狂却又理性，在惊悚游戏中寻找刺激和真相。", author: "三天两觉", year: 2016, tags: ["推理", "疯狂", "游戏"] },
    { name: "黎若雨", gender: "女", role: "女主", personality: "冷静理性、身手了得、外冷内热", description: "《惊悚乐园》女主角，疯不觉的搭档。身手了得，性格冷静，与疯不觉在游戏中配合默契。", author: "三天两觉", year: 2016, tags: ["搭档", "冷静", "身手"] },
    { name: "伍迪", gender: "男", role: "反派", personality: "疯狂诡异、深不可测、游戏人生", description: "《惊悚乐园》重要反派，来自地狱的恶魔。性格疯狂，喜欢玩弄人类，对疯不觉特别关注。", author: "三天两觉", year: 2016, tags: ["恶魔", "疯狂", "地狱"] },
    { name: "小叹", gender: "男", role: "配角", personality: "疯不觉好友、吐槽搭档", description: "《惊悚乐园》重要配角，疯不觉的好友，与疯不觉一起吐槽。", author: "三天两觉", year: 2016, tags: ["好友", "吐槽", "搭档"] },
    { name: "安大小姐", gender: "女", role: "配角", personality: "傲娇任性、实力强大", description: "《惊悚乐园》重要配角，安大小姐，性格傲娇，实力强大。", author: "三天两觉", year: 2016, tags: ["傲娇", "任性", "强大"] }
  ],
  "雪鹰领主": [
    { name: "东伯烈", gender: "男", role: "配角", personality: "东伯雪鹰父亲、正直严厉", description: "《雪鹰领主》重要配角，东伯烈，东伯雪鹰的父亲，性格正直严厉。", author: "我吃西红柿", year: 2016, tags: ["父亲", "正直", "严厉"] },
    { name: "墨阳瑜", gender: "女", role: "配角", personality: "东伯雪鹰母亲、温柔慈爱", description: "《雪鹰领主》重要配角，墨阳瑜，东伯雪鹰的母亲，性格温柔。", author: "我吃西红柿", year: 2016, tags: ["母亲", "温柔", "慈爱"] },
    { name: "池丘白", gender: "男", role: "配角", personality: "长风骑士、潇洒不羁", description: "《雪鹰领主》重要配角，长风骑士池丘白，潇洒不羁，实力强大。", author: "我吃西红柿", year: 2016, tags: ["骑士", "潇洒", "长风"] },
    { name: "司徒鸿", gender: "男", role: "反派", personality: "心胸狭隘、嫉妒雪鹰", description: "《雪鹰领主》重要反派，司徒鸿，心胸狭隘，嫉妒东伯雪鹰。", author: "我吃西红柿", year: 2016, tags: ["狭隘", "嫉妒", "反派"] },
    { name: "血刃酒馆首领", gender: "男", role: "反派", personality: "冷酷无情、杀手首领", description: "《雪鹰领主》重要反派，血刃酒馆首领，冷酷无情。", author: "我吃西红柿", year: 2016, tags: ["首领", "冷酷", "杀手"] }
  ],
  "飞剑问道": [
    { name: "秦云父亲", gender: "男", role: "配角", personality: "慈爱担忧、农家父亲", description: "《飞剑问道》重要配角，秦云的父亲，普通的农家父亲，疼爱儿子。", author: "我吃西红柿", year: 2017, tags: ["父亲", "农家", "慈爱"] },
    { name: "秦云母亲", gender: "女", role: "配角", personality: "温柔善良、农家母亲", description: "《飞剑问道》重要配角，秦云的母亲，普通的农家母亲，疼爱儿子。", author: "我吃西红柿", year: 2017, tags: ["母亲", "农家", "温柔"] },
    { name: "剑仙前辈", gender: "男", role: "配角", personality: "剑道通神、指点秦云", description: "《飞剑问道》重要配角，剑仙前辈，对秦云的剑道有指点之恩。", author: "我吃西红柿", year: 2017, tags: ["剑仙", "前辈", "指点"] },
    { name: "妖魔首领", gender: "男", role: "反派", personality: "邪恶残暴、妖魔领袖", description: "《飞剑问道》重要反派，妖魔首领，秦云需要斩杀的敌人。", author: "我吃西红柿", year: 2017, tags: ["妖魔", "首领", "邪恶"] },
    { name: "宗门长老", gender: "男", role: "配角", personality: "德高望重、剑道大师", description: "《飞剑问道》重要配角，宗门长老，对秦云多有照顾。", author: "我吃西红柿", year: 2017, tags: ["长老", "剑道", "德高望重"] },
    { name: "妖族公主", gender: "女", role: "配角", personality: "美丽妖艳、与秦云有情愫", description: "《飞剑问道》重要配角，妖族公主，与秦云有一段情愫。", author: "我吃西红柿", year: 2017, tags: ["公主", "妖族", "情愫"] }
  ],
  "凡人修仙之仙界篇": [
    { name: "韩立师父仙界", gender: "男", role: "配角", personality: "神秘莫测、仙界大能", description: "《凡人修仙之仙界篇》重要配角，韩立在仙界的师父，神秘大能。", author: "忘语", year: 2017, tags: ["师父", "神秘", "仙界"] },
    { name: "仙界强敌甲", gender: "男", role: "反派", personality: "阴险狡诈、仙界强者", description: "《凡人修仙之仙界篇》重要反派，仙界强者，与韩立多次交锋。", author: "忘语", year: 2017, tags: ["仙界", "阴险", "强敌"] },
    { name: "仙界盟友", gender: "男", role: "配角", personality: "忠诚可靠、仙界修士", description: "《凡人修仙之仙界篇》重要配角，韩立仙界的盟友，并肩作战。", author: "忘语", year: 2017, tags: ["仙界", "盟友", "忠诚"] },
    { name: "天庭高手", gender: "男", role: "反派", personality: "高高在上、天庭强者", description: "《凡人修仙之仙界篇》重要反派，天庭高手，韩立需要对抗的存在。", author: "忘语", year: 2017, tags: ["天庭", "高手", "敌对"] },
    { name: "仙界红颜", gender: "女", role: "配角", personality: "美丽动人、与韩立有缘", description: "《凡人修仙之仙界篇》重要配角，仙界红颜，与韩立有一段缘分。", author: "忘语", year: 2017, tags: ["红颜", "仙界", "缘分"] },
    { name: "古修传承者", gender: "男", role: "配角", personality: "古老传承、实力强大", description: "《凡人修仙之仙界篇》重要配角，古老传承者，对韩立有指点之恩。", author: "忘语", year: 2017, tags: ["古修", "传承", "指点"] }
  ],
  "道君": [
    { name: "牛有道", gender: "男", role: "配角", personality: "老谋深算、上清宗叛徒", description: "《道君》重要配角，牛有道，老谋深算，是道君的重要对手。", author: "跃千愁", year: 2017, tags: ["叛徒", "老谋深算", "对手"] },
    { name: "商淑清", gender: "女", role: "配角", personality: "聪慧善良、道君红颜", description: "《道君》重要配角，商淑清，道君的红颜知己，聪慧善良。", author: "跃千愁", year: 2017, tags: ["红颜", "聪慧", "善良"] },
    { name: "上清宗宗主", gender: "男", role: "配角", personality: "德高望重、宗门领袖", description: "《道君》重要配角，上清宗宗主，道君的宗门领袖。", author: "跃千愁", year: 2017, tags: ["宗主", "德高望重", "领袖"] },
    { name: "敌对宗主", gender: "男", role: "反派", personality: "阴险狡诈、宗门宿敌", description: "《道君》重要反派，敌对宗主，与道君多次交锋。", author: "跃千愁", year: 2017, tags: ["宗主", "阴险", "宿敌"] },
    { name: "散修高手", gender: "男", role: "配角", personality: "独来独往、实力强大", description: "《道君》重要配角，散修高手，与道君有交集。", author: "跃千愁", year: 2017, tags: ["散修", "独来独往", "强大"] },
    { name: "魔道巨擘", gender: "男", role: "反派", personality: "邪恶强大、魔道领袖", description: "《道君》重要反派，魔道巨擘，道君需要面对的强敌。", author: "跃千愁", year: 2017, tags: ["魔道", "巨擘", "强敌"] }
  ],
  "九星毒奶": [
    { name: "江晓父亲", gender: "男", role: "配角", personality: "慈爱担忧、星武者父亲", description: "《九星毒奶》重要配角，江晓的父亲，普通的星武者，疼爱女儿。", author: "育", year: 2017, tags: ["父亲", "星武者", "慈爱"] },
    { name: "江晓母亲", gender: "女", role: "配角", personality: "温柔善良、星武者母亲", description: "《九星毒奶》重要配角，江晓的母亲，普通的星武者，疼爱女儿。", author: "育", year: 2017, tags: ["母亲", "星武者", "温柔"] },
    { name: "星武导师", gender: "男", role: "配角", personality: "严厉慈爱、教导有方", description: "《九星毒奶》重要配角，星武导师，对江晓和许星多有照顾。", author: "育", year: 2017, tags: ["导师", "严厉", "照顾"] },
    { name: "星兽首领", gender: "男", role: "反派", personality: "残暴强大、星兽领袖", description: "《九星毒奶》重要反派，星兽首领，人类的大敌。", author: "育", year: 2017, tags: ["星兽", "首领", "残暴"] },
    { name: "敌对星武者", gender: "男", role: "反派", personality: "阴险狡诈、敌对势力", description: "《九星毒奶》重要反派，敌对星武者，与许星多次交锋。", author: "育", year: 2017, tags: ["敌对", "阴险", "星武者"] },
    { name: "队友甲", gender: "男", role: "配角", personality: "忠诚可靠、并肩作战", description: "《九星毒奶》重要配角，许星的队友，与他并肩作战。", author: "育", year: 2017, tags: ["队友", "忠诚", "并肩"] }
  ],
  "第一序列": [
    { name: "任小粟父亲", gender: "男", role: "配角", personality: "神秘失踪、身份成谜", description: "《第一序列》重要配角，任小粟的父亲，身份神秘，失踪多年。", author: "会说话的肘子", year: 2018, tags: ["父亲", "神秘", "失踪"] },
    { name: "陈无敌", gender: "男", role: "配角", personality: "大圣传人、单纯善良", description: "《第一序列》重要配角，陈无敌，大圣传人，性格单纯。", author: "会说话的肘子", year: 2018, tags: ["大圣", "单纯", "传人"] },
    { name: "李神坛", gender: "男", role: "反派", personality: "精神病人、危险强大", description: "《第一序列》重要反派，李神坛，精神病人，实力危险强大。", author: "会说话的肘子", year: 2018, tags: ["精神病人", "危险", "强大"] },
    { name: "壁垒管理者", gender: "男", role: "反派", personality: "高高在上、压迫流民", description: "《第一序列》重要反派，壁垒管理者，对流民压迫。", author: "会说话的肘子", year: 2018, tags: ["管理者", "压迫", "壁垒"] }
  ],
  "伏天氏": [
    { name: "花风流", gender: "男", role: "配角", personality: "琴魔、叶伏天师父", description: "《伏天氏》重要配角，花风流，琴魔，叶伏天的琴道师父。", author: "净无痕", year: 2018, tags: ["琴魔", "师父", "琴道"] },
    { name: "南斗文音", gender: "女", role: "配角", personality: "花风流妻子、叶伏天师娘", description: "《伏天氏》重要配角，南斗文音，花流流的妻子，叶伏天的师娘。", author: "净无痕", year: 2018, tags: ["师娘", "温柔", "师母"] },
    { name: "余生", gender: "男", role: "配角", personality: "沉默寡言、叶伏天兄弟", description: "《伏天氏》重要配角，余生，叶伏天的生死兄弟，沉默寡言。", author: "净无痕", year: 2018, tags: ["兄弟", "沉默", "生死"] },
    { name: "叶天子", gender: "男", role: "反派", personality: "天子骄子、叶伏天宿敌", description: "《伏天氏》重要反派，叶天子，叶伏天的宿敌。", author: "净无痕", year: 2018, tags: ["天子", "宿敌", "骄子"] },
    { name: "帝氏强者", gender: "男", role: "反派", personality: "帝氏天骄、高高在上", description: "《伏天氏》重要反派，帝氏强者，与叶伏天多次交锋。", author: "净无痕", year: 2018, tags: ["帝氏", "天骄", "强大"] },
    { name: "叶伏天母亲", gender: "女", role: "配角", personality: "温柔慈爱、身世神秘", description: "《伏天氏》重要配角，叶伏天的母亲，身世神秘。", author: "净无痕", year: 2018, tags: ["母亲", "温柔", "神秘"] }
  ],
  "大医凌然": [
    { name: "凌然父亲", gender: "男", role: "配角", personality: "严厉期望、医生世家", description: "《大医凌然》重要配角，凌然的父亲，对凌然期望很高。", author: "志鸟村", year: 2018, tags: ["父亲", "严厉", "期望"] },
    { name: "凌然母亲", gender: "女", role: "配角", personality: "温柔支持、疼爱儿子", description: "《大医凌然》重要配角，凌然的母亲，温柔支持儿子。", author: "志鸟村", year: 2018, tags: ["母亲", "温柔", "支持"] },
    { name: "医院主任", gender: "男", role: "配角", personality: "经验丰富、指导凌然", description: "《大医凌然》重要配角，医院主任，对凌然多有指导。", author: "志鸟村", year: 2018, tags: ["主任", "经验", "指导"] },
    { name: "医药代表", gender: "男", role: "反派", personality: "唯利是图、干扰医疗", description: "《大医凌然》重要反派，医药代表，唯利是图。", author: "志鸟村", year: 2018, tags: ["医药", "唯利是图", "反派"] },
    { name: "护士乙", gender: "女", role: "配角", personality: "细心负责、协助手术", description: "《大医凌然》重要配角，手术室护士，协助凌然手术。", author: "志鸟村", year: 2018, tags: ["护士", "细心", "协助"] },
    { name: "患者乙", gender: "男", role: "配角", personality: "感恩戴德、康复出院", description: "《大医凌然》重要配角，被凌然治愈的患者，感恩戴德。", author: "志鸟村", year: 2018, tags: ["患者", "感恩", "康复"] }
  ],
  "我真没想重生啊": [
    { name: "陈汉升父亲", gender: "男", role: "配角", personality: "严厉慈爱、公务员", description: "《我真没想重生啊》重要配角，陈汉升的父亲，公务员，对儿子严厉。", author: "柳岸花又明", year: 2018, tags: ["父亲", "公务员", "严厉"] },
    { name: "陈汉升母亲", gender: "女", role: "配角", personality: "温柔支持、疼爱儿子", description: "《我真没想重生啊》重要配角，陈汉升的母亲，温柔支持儿子。", author: "柳岸花又明", year: 2018, tags: ["母亲", "温柔", "疼爱"] },
    { name: "商业对手", gender: "男", role: "反派", personality: "阴险狡诈、商场宿敌", description: "《我真没想重生啊》重要反派，商业对手，与陈汉升在商场上交锋。", author: "柳岸花又明", year: 2018, tags: ["商业", "阴险", "宿敌"] },
    { name: "大学室友", gender: "男", role: "配角", personality: "搞笑担当、室友情谊", description: "《我真没想重生啊》重要配角，陈汉升的大学室友，搞笑担当。", author: "柳岸花又明", year: 2018, tags: ["室友", "搞笑", "情谊"] },
    { name: "黄慧", gender: "女", role: "反派", personality: "拜金虚荣、心机深沉", description: "《我真没想重生啊》重要反派，黄慧，拜金虚荣，与陈汉升有过节。", author: "柳岸花又明", year: 2018, tags: ["拜金", "虚荣", "心机"] }
  ],
  "万族之劫": [
    { name: "苏龙", gender: "男", role: "配角", personality: "苏宇父亲、镇魔军老兵", description: "《万族之劫》重要配角，苏龙，苏宇的父亲，镇魔军老兵。", author: "老鹰吃小鸡", year: 2019, tags: ["父亲", "老兵", "镇魔"] },
    { name: "柳文彦", gender: "男", role: "配角", personality: "多神文系传承者、苏宇老师", description: "《万族之劫》重要配角，柳文彦，多神文系传承者，苏宇的启蒙老师。", author: "老鹰吃小鸡", year: 2019, tags: ["老师", "传承", "多神文"] },
    { name: "白枫", gender: "男", role: "配角", personality: "五代领袖、苏宇师兄", description: "《万族之劫》重要配角，白枫，五代领袖，苏宇的师兄。", author: "老鹰吃小鸡", year: 2019, tags: ["师兄", "领袖", "五代"] },
    { name: "万族强者甲", gender: "男", role: "反派", personality: "万族入侵者、人类之敌", description: "《万族之劫》重要反派，万族强者，入侵人族。", author: "老鹰吃小鸡", year: 2019, tags: ["万族", "入侵", "强敌"] },
    { name: "战友甲", gender: "男", role: "配角", personality: "并肩作战、出生入死", description: "《万族之劫》重要配角，苏宇的战友，与他并肩作战。", author: "老鹰吃小鸡", year: 2019, tags: ["战友", "并肩", "出生入死"] }
  ],
  "我师兄实在太稳健了": [
    { name: "李长寿师父", gender: "男", role: "配角", personality: "迷迷糊糊、运气爆棚", description: "《我师兄实在太稳健了》重要配角，李长寿的师父，迷迷糊糊但运气极好。", author: "言归正传", year: 2019, tags: ["师父", "迷糊", "运气"] },
    { name: "有琴玄雅", gender: "女", role: "配角", personality: "正义感爆棚、师妹", description: "《我师兄实在太稳健了》重要配角，有琴玄雅，李长寿的师妹，正义感强。", author: "言归正传", year: 2019, tags: ["师妹", "正义", "师妹"] },
    { name: "酒玖", gender: "女", role: "配角", personality: "嗜酒如命、师叔", description: "《我师兄实在太稳健了》重要配角，酒玖，李长寿的师叔，嗜酒如命。", author: "言归正传", year: 2019, tags: ["师叔", "嗜酒", "师叔"] },
    { name: "天庭大能", gender: "男", role: "反派", personality: "高高在上、算计深远", description: "《我师兄实在太稳健了》重要反派，天庭大能，算计深远。", author: "言归正传", year: 2019, tags: ["天庭", "算计", "大能"] },
    { name: "截教弟子", gender: "男", role: "配角", personality: "豪爽仗义、李长寿盟友", description: "《我师兄实在太稳健了》重要配角，截教弟子，李长寿的盟友。", author: "言归正传", year: 2019, tags: ["截教", "豪爽", "盟友"] },
    { name: "西方教弟子", gender: "男", role: "反派", personality: "虚伪伪善、西方教", description: "《我师兄实在太稳健了》重要反派，西方教弟子，虚伪伪善。", author: "言归正传", year: 2019, tags: ["西方教", "虚伪", "反派"] }
  ],
  "长夜余火": [
    { name: "商见曜父亲", gender: "男", role: "配角", personality: "神秘失踪、身份成谜", description: "《长夜余火》重要配角，商见曜的父亲，神秘失踪。", author: "爱潜水的乌贼", year: 2019, tags: ["父亲", "神秘", "失踪"] },
    { name: "商见曜母亲", gender: "女", role: "配角", personality: "温柔担忧、牵挂儿子", description: "《长夜余火》重要配角，商见曜的母亲，温柔牵挂儿子。", author: "爱潜水的乌贼", year: 2019, tags: ["母亲", "温柔", "牵挂"] },
    { name: "旧调小组成员", gender: "男", role: "配角", personality: "各有所长、并肩作战", description: "《长夜余火》重要配角，旧调小组成员，与商见曜并肩作战。", author: "爱潜水的乌贼", year: 2019, tags: ["组员", "并肩", "各有所长"] },
    { name: "觉醒者敌人", gender: "男", role: "反派", personality: "能力诡异、危险强大", description: "《长夜余火》重要反派，觉醒者敌人，能力诡异。", author: "爱潜水的乌贼", year: 2019, tags: ["觉醒者", "诡异", "危险"] },
    { name: "研究高层", gender: "男", role: "反派", personality: "冷酷无情、研究狂人", description: "《长夜余火》重要反派，研究高层，冷酷无情。", author: "爱潜水的乌贼", year: 2019, tags: ["高层", "冷酷", "研究"] },
    { name: "废土游民", gender: "男", role: "配角", personality: "顽强生存、互帮互助", description: "《长夜余火》重要配角，废土游民，顽强生存。", author: "爱潜水的乌贼", year: 2019, tags: ["游民", "顽强", "互助"] }
  ],
  "深空彼岸": [
    { name: "王煊父母", gender: "男", role: "配角", personality: "慈爱担忧、普通父母", description: "《深空彼岸》重要配角，王煊的父母，普通的父母，疼爱儿子。", author: "辰东", year: 2021, tags: ["父母", "慈爱", "普通"] },
    { name: "老陈", gender: "男", role: "配角", personality: "神秘强大、王煊引路人", description: "《深空彼岸》重要配角，老陈，神秘强大，王煊的引路人。", author: "辰东", year: 2021, tags: ["引路人", "神秘", "强大"] },
    { name: "新星敌人", gender: "男", role: "反派", personality: "科技先进、敌对新星", description: "《深空彼岸》重要反派，新星敌人，科技先进。", author: "辰东", year: 2021, tags: ["新星", "科技", "敌人"] },
    { name: "旧术对手", gender: "男", role: "反派", personality: "敌对旧术、争夺传承", description: "《深空彼岸》重要反派，旧术对手，与王煊争夺旧术传承。", author: "辰东", year: 2021, tags: ["旧术", "敌对", "争夺"] },
    { name: "新术高手", gender: "男", role: "反派", personality: "新术修炼者、看不起旧术", description: "《深空彼岸》重要反派，新术高手，看不起旧术。", author: "辰东", year: 2021, tags: ["新术", "高手", "轻视"] },
    { name: "列仙后代", gender: "男", role: "配角", personality: "古老传承、列仙后裔", description: "《深空彼岸》重要配角，列仙后代，拥有古老传承。", author: "辰东", year: 2021, tags: ["列仙", "后裔", "传承"] }
  ],
  "从红月开始": [
    { name: "妈妈", gender: "女", role: "配角", personality: "恐怖强大、精神具现", description: "《从红月开始》重要配角，妈妈，陆辛精神具现的家人之一，恐怖强大。", author: "黑山老鬼", year: 2020, tags: ["妈妈", "恐怖", "精神"] },
    { name: "爸爸", gender: "男", role: "配角", personality: "暴力恐怖、精神具现", description: "《从红月开始》重要配角，爸爸，陆辛精神具现的家人之一，暴力恐怖。", author: "黑山老鬼", year: 2020, tags: ["爸爸", "暴力", "精神"] },
    { name: "陈菁", gender: "女", role: "配角", personality: "青港特清部主管、冷静干练", description: "《从红月开始》重要配角，陈菁，青港特清部主管，冷静干练。", author: "黑山老鬼", year: 2020, tags: ["主管", "冷静", "干练"] },
    { name: "特清部同事", gender: "男", role: "配角", personality: "各有所长、并肩作战", description: "《从红月开始》重要配角，特清部同事，与陆辛并肩作战。", author: "黑山老鬼", year: 2020, tags: ["同事", "并肩", "各有所长"] },
    { name: "精神污染源", gender: "男", role: "反派", personality: "诡异危险、精神污染", description: "《从红月开始》重要反派，精神污染源，诡异危险。", author: "黑山老鬼", year: 2020, tags: ["污染", "诡异", "危险"] }
  ],
  "十日终焉": [
    { name: "乔家劲", gender: "男", role: "配角", personality: "拳手、讲义气", description: "《十日终焉》重要配角，乔家劲，拳手，讲义气，与齐夏并肩作战。", author: "杀虫队队员", year: 2023, tags: ["拳手", "义气", "并肩"] },
    { name: "陈俊南", gender: "男", role: "配角", personality: "搞笑担当、齐夏好友", description: "《十日终焉》重要配角，陈俊南，搞笑担当，齐夏的好友。", author: "杀虫队队员", year: 2023, tags: ["搞笑", "好友", "担当"] },
    { name: "燕知春", gender: "女", role: "配角", personality: "极道王、神秘强大", description: "《十日终焉》重要配角，燕知春，极道王，神秘强大。", author: "杀虫队队员", year: 2023, tags: ["极道", "神秘", "强大"] },
    { name: "天龙", gender: "男", role: "反派", personality: "终焉之地主宰、高高在上", description: "《十日终焉》重要反派，天龙，终焉之地主宰，高高在上。", author: "杀虫队队员", year: 2023, tags: ["天龙", "主宰", "高高在上"] }
  ],
  "绍宋": [
    { name: "张浚", gender: "男", role: "配角", personality: "南宋名臣、主战派", description: "《绍宋》重要配角，张浚，南宋名臣，主战派。", author: "榴弹怕水", year: 2020, tags: ["名臣", "主战", "南宋"] },
    { name: "吕颐浩", gender: "男", role: "配角", personality: "南宋名臣、主和派", description: "《绍宋》重要配角，吕颐浩，南宋名臣，主和派。", author: "榴弹怕水", year: 2020, tags: ["名臣", "主和", "南宋"] },
    { name: "金兀术", gender: "男", role: "反派", personality: "金国大将、勇猛善战", description: "《绍宋》重要反派，金兀术，金国大将，勇猛善战。", author: "榴弹怕水", year: 2020, tags: ["金国", "大将", "勇猛"] },
    { name: "吴乞买", gender: "男", role: "反派", personality: "金国皇帝、雄才大略", description: "《绍宋》重要反派，吴乞买，金国皇帝，雄才大略。", author: "榴弹怕水", year: 2020, tags: ["皇帝", "雄才大略", "金国"] }
  ],
  "玄鉴仙族": [
    { name: "李元修", gender: "男", role: "配角", personality: "李家十一世、剑道天才", description: "《玄鉴仙族》重要配角，李元修，李家十一世，剑道天才。", author: "季越人", year: 2022, tags: ["剑修", "天才", "十一世"] },
    { name: "李尺泾", gender: "男", role: "配角", personality: "李家十一世、炼丹师", description: "《玄鉴仙族》重要配角，李尺泾，李家十一世，炼丹师。", author: "季越人", year: 2022, tags: ["炼丹", "十一世", "药师"] },
    { name: "李玄宣", gender: "男", role: "配角", personality: "李家九世、执掌家族", description: "《玄鉴仙族》重要配角，李玄宣，李家九世，执掌家族。", author: "季越人", year: 2022, tags: ["执掌", "九世", "家主"] },
    { name: "敌对修士", gender: "男", role: "反派", personality: "敌对势力、李家之敌", description: "《玄鉴仙族》重要反派，敌对修士，李家的敌人。", author: "季越人", year: 2022, tags: ["敌对", "修士", "李家之敌"] }
  ],
  "我在精神病院学斩神": [
    { name: "赵空城", gender: "男", role: "配角", personality: "守夜人、赵将军、牺牲自己", description: "《我在精神病院学斩神》重要配角，赵空城，守夜人，为救林七夜牺牲。", author: "三九音域", year: 2021, tags: ["守夜人", "牺牲", "将军"] },
    { name: "陈牧野", gender: "男", role: "配角", personality: "136小队队长、沉稳可靠", description: "《我在精神病院学斩神》重要配角，陈牧野，136小队队长。", author: "三九音域", year: 2021, tags: ["队长", "沉稳", "136"] },
    { name: "吴湘南", gender: "男", role: "配角", personality: "136小队副队长", description: "《我在精神病院学斩神》重要配角，吴湘南，136小队副队长。", author: "三九音域", year: 2021, tags: ["副队长", "136", "小队"] },
    { name: "红缨", gender: "女", role: "配角", personality: "136小队成员、活泼可爱", description: "《我在精神病院学斩神》重要配角，红缨，136小队成员。", author: "三九音域", year: 2021, tags: ["成员", "活泼", "136"] },
    { name: "冷轩", gender: "男", role: "配角", personality: "136小队成员、狙击手", description: "《我在精神病院学斩神》重要配角，冷轩，136小队狙击手。", author: "三九音域", year: 2021, tags: ["狙击手", "成员", "136"] },
    { name: "司小南", gender: "女", role: "配角", personality: "136小队成员、温柔善良", description: "《我在精神病院学斩神》重要配角，司小南，136小队成员。", author: "三九音域", year: 2021, tags: ["成员", "温柔", "136"] }
  ],
  "夜的命名术": [
    { name: "李彤雲", gender: "女", role: "配角", personality: "庆尘妹妹、时间行者", description: "《夜的命名术》重要配角，李彤雲，庆尘的妹妹，也是时间行者。", author: "会说话的肘子", year: 2021, tags: ["妹妹", "时间行者", "兄妹"] },
    { name: "南庚辰", gender: "男", role: "配角", personality: "庆尘朋友、白昼成员", description: "《夜的命名术》重要配角，南庚辰，庆尘的朋友，白昼组织成员。", author: "会说话的肘子", year: 2021, tags: ["朋友", "白昼", "成员"] },
    { name: "刘德柱", gender: "男", role: "配角", personality: "白昼成员、火系觉醒者", description: "《夜的命名术》重要配角，刘德柱，白昼组织成员，火系觉醒者。", author: "会说话的肘子", year: 2021, tags: ["白昼", "火系", "成员"] },
    { name: "陈家章", gender: "男", role: "配角", personality: "骑士、李叔同战友", description: "《夜的命名术》重要配角，陈家章，骑士，李叔同的战友。", author: "会说话的肘子", year: 2021, tags: ["骑士", "战友", "陈家"] }
  ],
  "灵境行者": [
    { name: "傅青阳", gender: "男", role: "配角", personality: "白虎兵众、灵境行者", description: "《灵境行者》重要配角，傅青阳，白虎兵众，灵境行者。", author: "卖报小郎君", year: 2022, tags: ["白虎", "兵众", "行者"] },
    { name: "孙淼淼", gender: "女", role: "配角", personality: "孙长老孙女、夜游神", description: "《灵境行者》重要配角，孙淼淼，孙长老孙女，夜游神。", author: "卖报小郎君", year: 2022, tags: ["夜游神", "孙女", "孙家"] },
    { name: "天下归火", gender: "男", role: "配角", personality: "火师、灵境行者", description: "《灵境行者》重要配角，天下归火，火师，灵境行者。", author: "卖报小郎君", year: 2022, tags: ["火师", "行者", "归火"] },
    { name: "灵境反派首领", gender: "男", role: "反派", personality: "邪恶强大、灵境之敌", description: "《灵境行者》重要反派，灵境反派首领，邪恶强大。", author: "卖报小郎君", year: 2022, tags: ["首领", "邪恶", "灵境"] }
  ],
  "星门": [
    { name: "李皓母亲", gender: "女", role: "配角", personality: "慈爱担忧、李家主母", description: "《星门》重要配角，李皓的母亲，慈爱担忧儿子。", author: "老鹰吃小鸡", year: 2021, tags: ["母亲", "慈爱", "主母"] },
    { name: "巡夜人同事", gender: "男", role: "配角", personality: "并肩作战、出生入死", description: "《星门》重要配角，巡夜人同事，与李皓并肩作战。", author: "老鹰吃小鸡", year: 2021, tags: ["同事", "并肩", "巡夜"] },
    { name: "古文明敌人", gender: "男", role: "反派", personality: "古老强大、星门之敌", description: "《星门》重要反派，古文明敌人，古老强大。", author: "老鹰吃小鸡", year: 2021, tags: ["古文明", "强大", "星门"] }
  ],
  "宿命之环": [
    { name: "卢米安姐姐", gender: "女", role: "配角", personality: "慈爱保护、照顾弟弟", description: "《宿命之环》重要配角，卢米安的姐姐，慈爱保护弟弟。", author: "爱潜水的乌贼", year: 2023, tags: ["姐姐", "慈爱", "保护"] },
    { name: "塔罗会成员", gender: "男", role: "配角", personality: "神秘强大、塔罗会", description: "《宿命之环》重要配角，塔罗会成员，神秘强大。", author: "爱潜水的乌贼", year: 2023, tags: ["塔罗", "神秘", "强大"] },
    { name: "外神信徒", gender: "男", role: "反派", personality: "疯狂信仰、外神信徒", description: "《宿命之环》重要反派，外神信徒，疯狂信仰。", author: "爱潜水的乌贼", year: 2023, tags: ["外神", "信徒", "疯狂"] },
    { name: "邪神祭司", gender: "男", role: "反派", personality: "邪恶祭祀、邪神", description: "《宿命之环》重要反派，邪神祭司，邪恶祭祀。", author: "爱潜水的乌贼", year: 2023, tags: ["邪神", "祭司", "邪恶"] },
    { name: "神秘学者", gender: "男", role: "配角", personality: "博学神秘、知识丰富", description: "《宿命之环》重要配角，神秘学者，博学神秘。", author: "爱潜水的乌贼", year: 2023, tags: ["学者", "博学", "神秘"] },
    { name: "当地村民", gender: "男", role: "配角", personality: "朴实善良、受主角帮助", description: "《宿命之环》重要配角，当地村民，朴实善良。", author: "爱潜水的乌贼", year: 2023, tags: ["村民", "朴实", "善良"] }
  ],
  "赤心巡天": [
    { name: "左光烈", gender: "男", role: "配角", personality: "赤色天才、为姜望牺牲", description: "《赤心巡天》重要配角，左光烈，赤色天才，为姜望牺牲。", author: "情何以甚", year: 2020, tags: ["天才", "牺牲", "赤色"] },
    { name: "重玄遵", gender: "男", role: "配角", personality: "重玄家天骄、姜望对手", description: "《赤心巡天》重要配角，重玄遵，重玄家天骄，姜望的对手。", author: "情何以甚", year: 2020, tags: ["天骄", "对手", "重玄"] },
    { name: "姜安安", gender: "女", role: "配角", personality: "姜望妹妹、可爱懂事", description: "《赤心巡天》重要配角，姜安安，姜望的妹妹，可爱懂事。", author: "情何以甚", year: 2020, tags: ["妹妹", "可爱", "懂事"] },
    { name: "杜如晦", gender: "男", role: "配角", personality: "齐国国相、老谋深算", description: "《赤心巡天》重要配角，杜如晦，齐国国相，老谋深算。", author: "情何以甚", year: 2020, tags: ["国相", "老谋深算", "齐国"] }
  ],
  "深海余烬": [
    { name: "露克蕾西娅", gender: "女", role: "配角", personality: "邓肯妹妹、神秘学者", description: "《深海余烬》重要配角，露克蕾西娅，邓肯的妹妹，神秘学者。", author: "远瞳", year: 2022, tags: ["妹妹", "学者", "神秘"] },
    { name: "莫里斯", gender: "男", role: "配角", personality: "退休守门人、邓肯朋友", description: "《深海余烬》重要配角，莫里斯，退休守门人，邓肯的朋友。", author: "远瞳", year: 2022, tags: ["守门人", "退休", "朋友"] },
    { name: "深海神官", gender: "男", role: "反派", personality: "疯狂信仰、深海教会", description: "《深海余烬》重要反派，深海神官，疯狂信仰。", author: "远瞳", year: 2022, tags: ["神官", "疯狂", "深海"] }
  ]
};

console.log('=== 第二轮角色补充开始 ===\n');

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
for (const [book, characters] of Object.entries(moreCharacters)) {
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
    newBookStats[book] = { count: 0, protagonist: 0, antagonist: 0, supporting: 0 };
  }
  newBookStats[book].count++;
  if (char.role === '主角') newBookStats[book].protagonist++;
  else if (char.role === '反派') newBookStats[book].antagonist++;
  else if (char.role === '配角') newBookStats[book].supporting++;
}

console.log('\n=== 第二轮补充完成 ===');
console.log(`本轮新增角色数: ${addedCount}`);
console.log(`当前总角色数: ${charactersAll.characters.length}`);

// 统计仍不足8个角色的书
console.log('\n=== 补充后仍不足8个角色的书 ===');
let stillNeedMore = [];
for (const [book, stats] of Object.entries(newBookStats)) {
  if (stats.count < 8) {
    stillNeedMore.push({ book, ...stats });
  }
}

if (stillNeedMore.length > 0) {
  for (const item of stillNeedMore.slice(0, 20)) {
    console.log(`${item.book}: ${item.count}个 (主角:${item.protagonist}, 反派:${item.antagonist}, 配角:${item.supporting}) 还需${8 - item.count}个`);
  }
  if (stillNeedMore.length > 20) {
    console.log(`... 还有 ${stillNeedMore.length - 20} 本书需要补充`);
  }
} else {
  console.log('所有书籍均已达到8个角色！');
}

// 更新文件元数据
charactersAll.total_characters = charactersAll.characters.length;
charactersAll.updated = '2026-04-10';
charactersAll.version = '1.2';

// 保存文件
fs.writeFileSync('/root/.openclaw/workspace/novel-editor/characters_all.json', JSON.stringify(charactersAll, null, 2), 'utf8');

console.log('\n✅ 已保存更新后的 characters_all.json');
console.log(`\n本轮新增角色详情 (${addedDetails.length}个):`);
for (const item of addedDetails.slice(0, 30)) {
  console.log(`  - ${item.book}: ${item.name} (${item.role})`);
}
if (addedDetails.length > 30) {
  console.log(`  ... 还有 ${addedDetails.length - 30} 个角色`);
}

// 最终统计
console.log('\n=== 最终统计 ===');
console.log(`总书籍数: ${Object.keys(newBookStats).length}`);
console.log(`总角色数: ${charactersAll.characters.length}`);
console.log(`平均每本书角色数: ${(charactersAll.characters.length / Object.keys(newBookStats).length).toFixed(1)}`);

let booksWith8Plus = 0;
for (const stats of Object.values(newBookStats)) {
  if (stats.count >= 8) booksWith8Plus++;
}
console.log(`达到8个角色的书籍: ${booksWith8Plus}/${Object.keys(newBookStats).length}`);
