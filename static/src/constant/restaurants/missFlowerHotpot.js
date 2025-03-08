const MISS_FLOWER_HOTPOT = {
    id: 11,
    name: '花小娇金汤花胶鸡',
    dishes: [
        { id: 11109, name: "花小嬌午市套餐", price: 19.99,
            options: {
                option1: {
                    name: "Choose 锅底 SOUP BASE",
                    choices: ["金汤 Chicken Soup", "麻辣清油 Spicy Qing Mandarin oil"],
                    selectedOptions: [],
                    limit: 1
                },
                option2: {
                    name: "Choose 现切肉类 FRESHLY SLICED MEATS",
                    choices: ["三黄走地鸡 Chicken", "澳洲M8和牛 AUS WAGYU M8"],
                    selectedOptions: [],
                    limit: 1
                },
                option3: {
                    name: "蔬菜 VEGETABLES",
                    choices: ["九宮格蔬菜"],
                    selectedOptions: [],
                    limit: 1
                },
                option4: {
                    name: "碳水 Carb",
                    choices: ["面條 Noodles", "米饭 Rice"],
                    selectedOptions: [],
                    limit: 1
                }
            }
        },        
        { id: 111, name: "花胶鸡汤", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $49.99", "4人份 $89.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 112, name: "鲍鱼花胶鸡汤", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $69.99", "4人份 $109.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 113, name: "榴槤花胶鸡", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $68.99", "4人份 $108.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 114, name: "椰子鸡汤", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $46.99", "4人份 86.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 115, name: "胡椒猪肚鸡汤", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $46.99", "4人份 $86.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 116, name: "芋儿香辣鸡煲", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $46.99", "4人份 $86.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 117, name: "素食锅底", price: "SP",
            options: {
                option1: {
                    name: "份量",
                    choices: ["2人份 $15.99", "4人份 $30.99"],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                },
                option2: {
                    name: "汤底类型",
                    choices: ["野生菌汤底", "素油麻辣汤底", "海椰椰子水汤底"],
                    selectedOptions: [],
                    limit: 1
                }
            }
        },
        { id: 118, name: "鸳鸯锅底", price: "SP",
            options: {
                option1: {
                    name: "主汤底",
                    choices: [
                        "花胶鸡汤 $49.99",
                        "鲍鱼花胶鸡汤 $69.99",
                        "榴槤花胶鸡 $68.99",
                        "椰子鸡汤 $46.99",
                        "胡椒猪肚鸡汤 $46.99",
                        "芋儿香辣鸡煲 $46.99",
                        "素食锅底 $15.99"
                    ],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                },
                option2: {
                    name: "附加汤底",
                    choices: [
                        "胡椒猪肚鸡汤 $8.99",
                        "芋儿香辣鸡煲 $8.99",
                        "野生菌汤底 $5.99",
                        "清油麻辣汤底 $5.99",
                        "花胶鸡汤 $15.99",
                        "海椰椰子汤底 $15.99"
                    ],
                    selectedOptions: [],
                    limit: 1,
                    adjustable: true
                }
            }
        },
        { id: 119, name: "黄鱼花胶", price: 9.99 },
        { id: 1110, name: "海参", price: 12.99 },
        { id: 1111,  name: "香菇酿鱼籽虾滑Shiitake mushroom stuffed shrimp paste with Roe", price: 14.99 },
        { id: 1112, name: "有机菌菇拼盘", price: 21.99 },
        { id: 1113, name: "和牛虾滑壽司", price: 19.99 },
        { id: 1114, name: "贵妃泡饭 Rice with Abalone Sea Cucumber, Bacon, Peas, Corn, Mushroom and egg", price: 21.99 },
        { id: 1115, name: "风生水起撈汁贵妃鸡 Poached Chicken with Special Sauce", price: 19.99},
        { id: 1116, name: "功夫黑鱼片 Fresh Boneless Fish Fillet", price: 13.99},
        { id: 1117, name: "活體豆芽Fresh Bean Sprout", price: 5.99},
        { id: 1118, name: "火腿鱿鱼卷 Ham Hot Squid Roll", price: 8.99 },
        { id: 1119, name: "生蚝 Fresh Oyster", price: 6.99 },
        { id: 1120, name: "鲍鱼 Abalone", price: 5.99 },
        { id: 1121, name: "青口 Mussel", price: 6.99 },
        { id: 1122, name: "帶子 Scallop", price: 12.99 },
        { id: 1123, name: "蟹柳 Crab Stick", price: 6.99 },
        { id: 1124, name: "老虎虾 Tiger Shrimp", price: 9.99 },
        { id: 1125, name: "黄花鱼膠 Yellow Croaker Maw", price: 9.99 },
        { id: 1126, name: "小墨鱼 Baby Cuttlefish", price: 12.99 },
        { id: 1127, name: "功夫黑鱼片 Fresh Boneless Fish Fillet", price: 13.99 },
        { id: 1128, name: "手打鱼肉丸 Handmade Fish Ball", price: 7.99 },
        { id: 1129, name: "南美深海刺参 Sea Cucumber", price: 12.99 },
        { id: 1130, name: "香菇鱼籽虾滑 Shrimp Paste with Roe", price: 13.99 },
        { id: 1131, name: "鮮虾鱼籽福袋 Shrimp & Fish Roe Lucky Bag", price: 12.99 },
        { id: 1132, name: "王米虾滑 Shrimp Paste with Sweet Corn", price: 13.99 },
        { id: 1133, name: "海参 Sea Cucumber", price: 12.99 },
        { id: 1134, name: "海鲜拼盘 Seafood Platter", price: 26.99 },
        { id: 1135, name: "杏鲍菇 King Oyster Mushroom", price: 4.99 },
        { id: 1136, name: "海鲜菇 Seafood Mushroom", price: 4.99 },
        { id: 1137, name: "黑木耳 Black Fungus", price: 4.99 },
        { id: 1138, name: "金针菇 Enoki Mushroom", price: 5.99 },
        { id: 1139, name: "香菇 Shiitake Mushroom", price: 5.99 },
        { id: 1140, name: "白玉菇 White Mushroom", price: 5.99 },
        { id: 1141, name: "羊肚菌 Morel Mushroom", price: 9.99 },
        { id: 1142, name: "蚝菇 Oyster Mushroom", price: 7.99 },
        { id: 1143, name: "有机猴头菇 Organic Lion’s Mane Mushroom", price: 7.99 },
        { id: 1144, name: "野生竹笙 Bamboo Fungus", price: 10.99 },
        { id: 1145, name: "蟹味菇 Shimeji Mushroom", price: 7.99 },
        { id: 1146, name: "有机九鲜菇拼盘 Organic Mushroom Platter", price: 21.99 },
        { id: 1147, name: "五花肉 Pork Belly", price: 5.99 },
        { id: 1148, name: "牛百叶 Beef Tripe", price: 6.99 },
        { id: 1149, name: "手打牛肉丸 Handmade Beef Balls", price: 5.99 },
        { id: 1150, name: "鹌鹑蛋 Quail Egg", price: 3.99 },
        { id: 1151, name: "精品肥牛 Premium Marbled Beef", price: 13.99 },
        { id: 1152, name: "秘制嫩滑鸡肉 Marinated Tender Chicken", price: 24.99 },
        { id: 1153, name: "一品鮮切雪花牛 American Wagyu", price: 39.99 },
        { id: 1154, name: "鮮切神戸和牛 Freshly Sliced Kobe Beef", price: 13.99 },
        { id: 1155, name: "羔羊肉 Sliced Lamb", price: 12.99 },
        { id: 1156, name: "肥牛片 Sliced Beef", price: 9.99 },
        { id: 1157, name: "一品鮮切雪花牛 Premium Marbled Beef", price: 39.99 },
        { id: 1158, name: "日本A5和牛片 Japanese A5 Wagyu Beef", price: 59.99 },
        { id: 1159, name: "白菜 Napa Cabbage", price: 3.99 },
        { id: 1160, name: "娃娃菜 Baby Cabbage", price: 5.99 },
        { id: 1161, name: "西洋菜 Watercress", price: 5.99 },
        { id: 1162, name: "鲜嫩玉米笋 Fresh Corn Shoots", price: 6.99 },
        { id: 1163, name: "玉米 Sweet Corn", price: 3.99 },
        { id: 1164, name: "白萝卜 White Radish", price: 3.99 },
        { id: 1165, name: "南瓜 Pumpkin", price: 3.99 },
        { id: 1166, name: "鲜豆腐 Fresh Tofu", price: 3.99 },
        { id: 1167, name: "腐竹 Bean Curd", price: 3.99 },
        { id: 1168, name: "小芋头 Mini Taro", price: 4.99 },
        { id: 1169, name: "唐生菜 Lettuce", price: 4.99 },
        { id: 1170, name: "大白菜 Chinese Cabbage", price: 4.99 },
        { id: 1171, name: "茼蒿 Crown Daisy", price: 5.99 },
        { id: 1172, name: "窗花莲藕 Lotus Root", price: 5.99 },
        { id: 1173, name: "淮山 Chinese Yam", price: 5.99 },
        { id: 1174, name: "溫布土豆面 Shredded Potato", price: 4.99 },
        { id: 1175, name: "鲜摘活体豆莽菜 Fresh Bean Sprouts", price: 5.99 },
        { id: 1176, name: "莴笋 Celtuce", price: 6.99 },
        { id: 1177, name: "脆嫩海帶芽 Kelp Bud", price: 5.99 },
        { id: 1178, name: "豆苗 Pea Shoot", price: 6.99 },
        { id: 1179, name: "响铃卷 Crispy Beancurd Roll", price: 6.99 },
        { id: 1180, name: "笋尖 Bamboo Shoot", price: 6.99 },
        { id: 1181, name: "鲜蔬拼盘 (茴葛 生菜 大白菜 玉米 白萝卜) Vegetable Platter (Crown Daisy, Lettuce, Chinese Cabbage, Corn, White Radish)", price: 10.99 },
        { id: 1182, name: "菠菜 Spinach", price: 4.99 },
        { id: 1183, name: "豆腐 Tofu", price: 3.99 },
        { id: 1184, name: "冬瓜 Winter Melon", price: 3.99 },
        { id: 1185, name: "广东点心拼盘 Cantonese Dim Sum Platter", price: 14.99 },
        { id: 1186, name: "九层塔盐酥鸡 Crispy Salted Chicken", price: 9.99 },
        { id: 1187, name: "秘制花雕陈酿醉鸡 Hua Diao Wine Chicken", price: 8.99 },
        { id: 1188, name: "小酥肉 Thai Fried Pork", price: 10.99 },
        { id: 1189, name: "荔枝虾球 Lychee Fried Shrimp Meatballs", price: 10.99 },
        { id: 1190, name: "风生水起捞汁贵妃鸡 Poached Chicken with Special Sauce", price: 19.99 },
        { id: 1191, name: "牙簽羊肉 Spiced Salt Toothpick Lamb", price: 12.99 },
        { id: 1192, name: "大黄米爆浆糍粑 Brown Sugar Stuffed Millet Sticky Rice Cake", price: 9.99 },
        { id: 1193, name: "鲜虾鱼籽水饺 Shrimp & Fish Roe Dumpling", price: 7.99 },
        { id: 1194, name: "A5和牛鱼籽炒饭 A5 Wagyu and Fish Roe Fried Rice", price: 16.99 },
        { id: 1195, name: "贵妃泡饭 Rice with Abalone, Sea Cucumber, Bacon, Peas, Corn, Mushroom & Egg", price: 21.99 },
        { id: 1196, name: "黃金椰汁流心球 Golden Rice Cake Stuffed Coconut Lava", price: 7.99 },
        { id: 1197, name: "泰式海鲜菠萝炒饭 Thai Seafood and Pineapple Fried Rice", price: 15.99 },
        { id: 1198, name: "芥菜糯米粑粑 Mustard Greens with Glutinous Rice Cakes", price: 5.99 },
        { id: 1199, name: "一口酥小油系 Deep Fried Dough Stick", price: 5.99 },
        { id: 11100, name: "红薯宽粉 Sweet Potato Vermicelli Noodles", price: 5.99 },
        { id: 11101, name: "手工面 Handmade Noodles", price: 5.99 },
        { id: 11102, name: "杨枝甘露 Mango Pomelo Sago and Iced Rice Ball", price: 13.99 },
        { id: 11103, name: "炖燕窝 Bird’s Nest Soup", price: 10.99 },
        { id: 11104, name: "雪顶榴莲御子冻 Show-Copped Durian Coconut Jelly", price: 10.99 },
        { id: 11105, name: "桂花玫瑰冰汤圆 Sweet Osmanthus and Rose Iced Rice Ball", price: 5.99 },
        { id: 11106, name: "原味椰子冻 Coconut Jelly", price: 12.99 },
        { id: 11107, name: "桃胶雪燕炖木瓜 Papaya Soup with Peach Gum & Snow Lotus", price: 6.99 },
        { id: 11108, name: "手打鲜奶米麻薯", price: 7.99,
            options: {
                option1: {
                    name: "Combo",
                    choices: ["雙拼 Duo Combo", "三拼 Triple Combo"],
                    selectedOptions: [],
                    limit: 1
                },
                option2: {
                    name: "味道 Favors",
                    choices: ["燕麦 Oat Milk", "奥利奥 Oreo", "抹茶 Matcha", "榴莲 Durian"],
                    selectedOptions: [],
                    limit: 3
                }
            }
        }
    ]
}

export default MISS_FLOWER_HOTPOT;