const CHEF_GE = {
    id: 6,
    name: '葛师傅',
    dishes: [
        { id: 61, name: '魚頭泡餅 Fish Head Pot with Pancakes ', price:33.99  },
        { id: 691, name: '酸菜全鱼 Fresh Fish Pot with Sauerkraut', price:38.99 },
        { id: 692, name: '水煮全鱼 Spicy Whole fish in hot chill oil', price:38.99 },
        { id: 693, name: '一特色羊蝎子 Special lamb spine hotpot', price:38.99 ,
         options: {
            option1: {
               name: "Spice", choices: ["中辣 Medium Spicy", "原味 Original"], selectedOptions: [], limit: 1
            }
        }},
        
        { id: 695, name: '馋嘴牛蛙(现杀) Spicy Frog Pot with Szechun Pepper', price:59.99 },
        { id: 696, name: '川味走地鸡 Chicken with Szechun Pepper', price:25.99 },
        
        { id: 66, name: '饞嘴牛蛙', price:59.99 },
        { id: 67, name: '酸辣蕨根粉', price:7.99  },
        { id: 68, name: '養顏皮凍', price:7.99  },
        { id: 69, name: '夫妻肺片', price:10.99  },
        { id: 610, name: '口水雞', price:9.99 },
        { id: 611, name: '熗雜拌', price:7.99 ,
            options: {
               option1: {
                  name: "Types", choices: ["黃瓜", "木耳","洋蔥","豆製品"], selectedOptions: [], limit: 1
               }
        }},
        { id: 615, name: '滷鴨頭', price:3.99  },
        { id: 697, name: '秘制剁子肉 ', price:9.99 },
        { id: 698, name: '皮蛋豆腐', price:38.99 }, 
        { id: 616, name: '滷雞腿', price:2.95  },
        { id: 617, name: '滷蛋', price:1.99  },
        { id: 618, name: '秘製椒香鮮肉餅（1個）', price:4.99  },
        { id: 619, name: '家鄉烙餅', price:4.99  },
        { id: 620, name: '滷肉大餅', price:6.99  },
        { id: 621, name: '白菜豬肉水餃', price:11.99  },
        
        { id: 623, name: '肉三鮮水餃', price:13.99  },
        { id: 624, name: '薺菜雲吞湯', price:7.99  },
        { id: 627, name: '特色大盤雞', price:19.99  },
        { id: 628, name: '麻辣香鍋牛肉', price:28.99  },
        { id: 630, name: '藤椒牛仔粒', price:25.99  },
        { id: 631, name: '農家霸王肘', price:25.99  },
        { id: 632, name: '蒜香辣子五花肉', price:18.99  },
        { id: 633, name: '乾煸鸭头', price:23.99  },
        { id: 634, name: '滕椒魚片', price:22.99  },
        { id: 635, name: '藕椒雞丁', price:17.99},
        { id: 636, name: '風味排骨蝦', price:19.99},
        { id: 699, name: '黄豆焖猪脚 ', price:18.99 },
        { id: 6100, name: '泡椒小炒牛 ', price:20.99 },
        { id: 6101, name: '蔥爆牛肉 ', price:20.99 },
        { id: 6102, name: '农家小炒肉 ', price:16.99 },
        { id: 6103, name: '水煮牛肉  ', price:20.99 },
        { id: 6104, name: '独蒜烧肥肠 ', price:20.99 },
        { id: 6105, name: '红烧狮子头 ', price:16.99 },
        { id: 6106, name: '火爆腰花 ', price:19.99 },
        { id: 6107, name: '西兰花炒牛 ', price:18.99 },
        
        
        { id: 6110, name: '章茶鸭 ', price:25.99 },
        { id: 6111, name: '藤椒鱼片 ', price:22.99 },
        
        { id: 6113, name: '干煸鸭头  ', price:23.99 },
        
        { id: 6115, name: '火爆鱼肚  ', price:22.99 },
        { id: 6116, name: '金汤椒麻鱼(黑鱼) ', price:22.99 },
        { id: 6117, name: '绝味花千骨', price:25.99 },
        { id: 6118, name: '蜜汁铁板鸡(去骨鸡) ', price:25.99 },
        
        { id: 640, name: '乾鍋干葉豆腐', price:16.99  },
        { id: 641, name: '金湯椒麻魚(黑鱼)', price:22.99  },
        { id: 643, name: '菠蘿咕嚕肉', price:15.99  },
        { id: 644, name: '紅燒肉', price:16.99  },
        { id: 645, name: '葛师傅小炒', price:16.99  },
        { id: 646, name: '笋尖肉絲', price:16.99  },
        { id: 650, name: '蔥爆牛肉', price:20.99  },
        { id: 652, name: '水煮魚片（黑魚）', price:22.99  },
        { id: 653, name: '酸湯肥牛', price:22.99  },
        { id: 655, name: '水煮牛肉', price:22.99  },
        { id: 658, name: '農家小炒肉', price:16.99  },
        { id: 672, name: '手撕包菜', price:13.99  },
        { id: 673, name: '乾煸四季豆', price:13.99  },
        { id: 674, name: '魚香肉丝', price:18.99  },
        { id: 675, name: '西紅柿炒雞蛋', price:14.99  },
        { id: 676, name: '酸辣土豆絲', price:11.99  },
        { id: 677, name: '濃湯娃娃菜', price:16.99  },
        { id: 678, name: '蒜炒西蘭花', price:14.99  },
        { id: 679, name: '紅燒牛肉麵', price:12.99 ,
        options: {
             option1: {
                name: "Types", choices: ["麵","米線", ], selectedOptions: [], limit: 1
             }
        }},
        { id: 680, name: '炸醬麵', price:9.99 ,
        options: {
             option1: {
                name: "Types", choices: ["麵","米線", ], selectedOptions: [], limit: 1
             }
        }},
        { id: 681, name: '擔擔麵', price:9.99  },
        { id: 682, name: '茄子肉丁麵', price:11.99  },
        { id: 683, name: '麻辣小龍蝦蓋飯', price:15.99  },
        { id: 684, name: '蒜蓉小龍蝦蓋飯', price:15.99  },
        { id: 685, name: '雙椒雞丁蓋飯', price:11.99  },
        { id: 686, name: '楊州炒飯', price:11.99  },
        { id: 687, name: '肉沫酸豆角炒飯', price:11.99  },
        { id: 688, name: '黑椒牛粒炒飯', price:10.99  },
        { id: 689, name: '蛋炒飯', price:8.99  },
        { id: 690, name: '蕃茄雞蛋蓋飯', price:11.99  },
    ]
}

export default CHEF_GE;
