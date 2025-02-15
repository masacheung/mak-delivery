const TASTY_MOMENT = {
  id: 1,
  name: "Tasty Moment",
  dishes: [
    { id: 11, name: '排骨年糕', price:16.95  },
    { id: 12, name: '鲜肉小笼包', price:9.50  },
    { id: 13, name: '丝瓜小笼包', price:10.50  },
    { id: 14, name: '蟹粉小笼包', price:12.50  },
    { id: 15, name: '香辣小笼包', price:12.50  },
    { id: 16, name: '三拼小笼包', price:12.50 },
    { id: 17, name: '生煎包', price:8.50  },
    { id: 18, name: '锅贴', price:8.95  },
    { id: 19, name: '油条', price:2.95  },
    { id: 110, name: '甜豆浆', price:3.95  },
    { id: 111, name: '咸豆浆', price:4.95  },
    { id: 112, name: '葱油饼', price:5.95  },
    { id: 113, name: '豆花', price:5.95 },
    { id: 114, name: '咸饭团', price:8.95  },
    { id: 115, name: '甜饭团', price:4.50  },
    { id: 116, name: '糯米烧卖', price:6.95  },
    { id: 117, name: '素蒸饺', price:8.50  },
    { id: 118, name: '小椒牛肉丝夹饼', price:13.95  },
    { id: 119, name: '萝卜丝酥饼', price:6.95  },
    { id: 120, name: '糯米烧卖', price:6.95  },
    { id: 121, name: '素蒸饺', price:8.50  },
    { id: 122, name: '韭菜盒子', price:6.95  },
    { id: 123, name: '韭黄春卷', price:6.50  },
    { id: 124, name: '豆沙酥饼', price:5.95  },
    { id: 125, name: '苔条黄鱼', price:22.95  },
    { id: 126, name: '葱烤大排汤面', price:13.95  },
    { id: 127, name: '上海炒年糕', price:12.95  },
    { id: 128, name: '蒜香骨', price:13.95  },
    { id: 129, name: '咸蛋黄莴笋', price:17.95  },
    { id: 130, name: '鲜肉小云吞', price:10.95  },
    { id: 131, name: '麻辣大云吞', price:10.95  },
    { id: 132, name: '拍青瓜', price:6.50  },
    { id: 133, name: '凉拌木耳', price: 5.50 },
    { id: 134, name: '伤心凉粉', price:8.95  },
    { id: 135, name: '香干马兰头', price: 8.95},
    { id: 136, name: '四喜烤麸', price:8.95  },
    { id: 137, name: '剁椒皮蛋豆腐', price:10.95  },
    { id: 138, name: '夫妻肺片', price:8.95  },
    { id: 139, name: '口水鸡', price:10.95  },
    { id: 140, name: '白切鸡', price:10.95 },
    { id: 141, name: '白切鸡', price:10.95 },
    { id: 142, name: '墨鱼大烤', price:11.95  },
    { id: 143, name: '上海酱鸭', price:10.95  },
    { id: 144, name: '水晶蹄膀', price:9.95  },
    { id: 145, name: '红油大刀腰片', price:15.95  },
    { id: 146, name: '墨鱼大烤', price:11.95  },
    { id: 147, name: '香糟三宝', price:13.95  },
    { id: 148, name: '老醋海蜇头', price:12.95  },
    { id: 149, name: '剁椒鱼肚', price:12.95  },
    { id: 150, name: '海派炸猪排', price:12.95  },
    { id: 151, name: '蒜香骨', price:13.95  },
    { id: 152, name: '香辣鸡中翼', price:12.95  },
    { id: 153, name: '蒜香鸡中翼', price:10.95  },
    { id: 154, name: '弄堂臭豆腐', price:11.95  },
    { id: 155, name: '芋泥腐衣卷', price:13.95  },
    { id: 156, name: '响油鳝丝', price: "SP"  },
    { id: 157, name: '虾爆鳝', price:42.95  },
    { id: 158, name: '红烧肉烩小鲍鱼', price:39.95  },
    { id: 159, name: '葱烤鲍鱼小海参', price:39.95  },
    { id: 160, name: '红烧肚膛', price: "SP" },
    { id: 161, name: '红烧刌水', price: "SP"  },
    { id: 162, name: '红烧鱼头烩豆腐', price:28.95  },
    { id: 163, name: '清炒虾仁', price:17.95 },
    { id: 164, name: '油爆虾', price:17.95  },
    { id: 165, name: '八宝辣酱', price:18.95  },
    { id: 166, name: '芥菜山药开背虾', price:18.95 },
    { id: 167, name: '黑椒牛仔粒', price:34.95  },
    { id: 168, name: '蟹粉豆腐', price:22.95  },
    { id: 169, name: '高粱豆苗圈子', price:19.95  },
    { id: 170, name: '咸菜黄鱼小云吞汤', price:23.95  },
    { id: 171, name: '咸蛋黄银鳕鱼', price:34.95  },
    { id: 172, name: '銀鱈魚熏鱼', price:35.95  },
    { id: 173, name: '鸡菇海参烩豆腐', price:34.95  },
    { id: 174, name: '蟹粉本土花胶', price:35.95  },
    { id: 175, name: '三鲜绘本土花胶', price:35.95  },
    { id: 176, name: '蒜蓉炸生蚝', price:21.95  },
    { id: 177, name: '避风塘炒虾', price:20.95  },
    { id: 178, name: ' XO酱双白', price:20.95  },
    { id: 179, name: '金丝虾球', price:20.95  },
    { id: 180, name: '鲜鱿算你狠', price:15.95  },
    { id: 181, name: '水煮鱼片', price:20.95  },
    { id: 182, name: '滕椒鱼片', price:20.95  },
    { id: 183, name: '糟熘鱼片', price:20.95  },
    { id: 184, name: '葱烤牛仔粒', price:34.95  },
    { id: 185, name: '黄灯厚切牛舌', price:26.95 },
    { id: 186, name: '水煮牛肉', price:24.95  },
    { id: 187, name: '滋补羊肉煲', price:24.95  },
    { id: 188, name: '牙签羊肉', price:21.95  },
    { id: 189, name: '小米爱上小公鸡', price:22.95  },
    { id: 190, name: '重庆辣子鸡', price:20.95  },
    { id: 191, name: '小米椒辣子鸡', price:16.95  },
    { id: 192, name: '泡椒鸡杂', price:16.95  },
    { id: 193, name: '外婆红烧肉', price:20.95  },
    { id: 194, name: '腰肝合欢臭豆腐', price:19.95  },
    { id: 195, name: '酱爆猪肝', price:14.95  },
    { id: 196, name: '荷叶狮子头', price:14.95 },
    { id: 197, name: '滕椒猪手', price:16.95 },
    { id: 198, name: '椒盐猪手', price:16.95  },
    { id: 199, name: '糖醋小排', price:15.95  },
    { id: 1100, name: '蒜蓉豆苗', price: "SP"  },
    { id: 1101, name: '上海素杂锦', price:14.95 },
    { id: 1102, name: '双菇扒菜心', price:16.95  },
    { id: 1103, name: '手撕包菜', price:12.95  },
    { id: 1104, name: '干煸四季豆', price:12.95  },
    { id: 1105, name: '小椒皮蛋擂茄子', price:14.95  },
    { id: 1106, name: '麻婆豆腐', price:15.95  },
    { id: 1107, name: '咸蛋黄土豆丝', price:17.95  },
    { id: 1108, name: '咸蛋黄莴笋', price:17.95  },
    { id: 1109, name: '十六铺酥脆茄子', price:15.95  },
    { id: 1110, name: '蟹粉石锅捞饭', price:17.95  },
    { id: 1111, name: '黑松露石锅捞饭', price:15.95  },
    { id: 1112, name: '蒜香小龙虾盖饭', price:17.95  },
    { id: 1113, name: '麻辣小龙虾盖饭', price:17.95  },
    { id: 1114, name: '茄汁牛肉滑蛋盖饭', price:17.95  },
    { id: 1115, name: '酱爆猪肝饭', price:9.95  },
    { id: 1116, name: '咖喱猪扒饭', price:12.95  },
    { id: 1117, name: '鱼香肉丝饭', price:9.95  },
    { id: 1118, name: ' XO酱小龙虾炒饭', price:18.95  },
    { id: 1119, name: '孜然牛肉炒饭', price:13.95  },
    { id: 1120, name: '上海菜饭', price:10.95  },
    { id: 1121, name: '成都炒饭', price:9.95  },
    { id: 1122, name: '卤肉饭', price:11.95  },
    { id: 1123, name: '排骨年糕', price:16.95  },
    { id: 1124, name: '上海粗炒面', price:12.95  },
    { id: 1125, name: '上海炒年糕', price:12.95  },
    { id: 1126, name: '雪菜肉丝炒年糕', price:12.95  },
    { id: 1127, name: '荠菜肉丝炒年糕', price:12.95  },
    { id: 1128, name: '咸蛋黄虾仁年糕', price:16.95  },
    { id: 1129, name: '阿娘黄鱼鱼面', price:14.95  },
    { id: 1130, name: '酸菜鱼片汤面', price:10.95  },
    { id: 1131, name: '红烧牛肉面', price:15.95  },
    { id: 1132, name: '红烧猪脚面', price:10.95  },
    { id: 1133, name: '葱烤大排汤面', price:12.95  },
    { id: 1134, name: '酱爆猪肝汤面', price:9.95  },
    { id: 1135, name: '八宝辣酱汤面', price:12.95  },
    { id: 1136, name: '鱼香肉丝汤面', price:9.95  },
    { id: 1137, name: '雪菜肉丝汤面', price:9.95  },
    { id: 1138, name: '小窝米线', price:8.95  },
    { id: 1139, name: '泡椒牛杂米线', price:12.95  },
    { id: 1140, name: '泡椒鸡杂米线', price:11.95  },
    { id: 1141, name: '肥肠酸辣粉', price:10.95  },
    { id: 1142, name: '泡椒牛杂米线', price:12.95  },
    { id: 1143, name: '川味大肠面', price:9.95  },
    { id: 1144, name: '麻酱凉面', price:5.50  },
    { id: 1145, name: '葱油拌', price:5.50  },
    { id: 1146, name: '重庆冷面', price:5.50 },
    { id: 1147, name: '蟹粉拌面', price:17.95  },
    { id: 1148, name: '辣肉葱油拌面', price:10.95  },
    { id: 1149, name: '大肠葱油拌面', price:9.95  },
    { id: 1150, name: '麻辣小龙虾拌面', price:17.95  },
    { id: 1151, name: '茄汁牛肉滑蛋拌面', price:16.95  },
    { id: 1152, name: '鱼香肉丝拌面', price:9.95  },
  ],
};

export default TASTY_MOMENT;