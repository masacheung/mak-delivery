const S_Y_MINI_HOTPOT = {
    id: 4,
    name: 'S&Y Mini HotPot 蜀世冒菜',
    dishes: [
        { id: 41, name: 'Mini Hot Pot 冒菜', price:"SP",
        options: {
            option1: {
                name: "Choose Spice", choices: ["No Spicy (Tomato Soup) 不要辣(番茄汤底)", "Slightly 微微辣", "Mild 微辣", "Medium 中辣", "Fire 大辣", "Super Spicy 特辣"], selectedOptions: [], limit: 1
            },
            option2: {
                name: "Option (6.49 each)",
                choices: ["Black Beef Tripe 大片毛肚 ($6.49)", "Shrimp Paste 虾滑 ($6.49)", "Snowflake Beef 雪花牛肉 ($6.49)", "Pork Intestine 肥肠 ($6.49)", "Fried Pork Shin 炸猪皮 ($6.49)"], 
                selectedOptions: [], 
                limit: 100,
                price: 6.49
            },
            option3: {
                name: "Option (5.49 each)",
                choices: [
                    "Sliced Beef 肥牛卷 ($5.49)",
                    "Octopus 八爪鱼 ($5.49)",
                    "Kidney 腰花 ($5.49)",
                    "Chicken Gizzard 秘制鸡胗 ($5.49)",
                    "Beef Omasum 牛百叶 ($5.49)",
                    "Mini Sausage 亲亲肠 ($5.49)",
                    "Beef Aorta 脆黄喉 ($5.49)",
                    "Spam Meat 午餐肉 ($5.49)",
                    "Squid 鱿鱼须 ($5.49)",
                    "Boneless Duck Feet 无骨鸭掌 ($5.49)",
                    "Fish Fillet 龙利鱼片 ($5.49)",
                    "Shrimp (Heaf off) 大虾 ($5.49)",
                    "Crab Meat 蟹肉棒 ($5.49)",
                    "Celtuce 莴笋 ($5.49)",
                    "Quail Egg 鹌鹑蛋 ($5.49)",
                    "Beef Tendon Ball 牛筋丸 ($5.49)",
                    "Pork Stomach 猪肚 ($5.49)",
                    "Gluten 面筋 ($5.49)",
                    "Soybean Roll 响铃 ($5.49)",
                    "Fish Ball 蟹粉蟹籽丸 ($5.49)",
                    "fish ball salted egg 流心鱼籽鱼丸 ($5.49)",
                    "Sliced Lamb 羊肉卷 ($5.49)",
                    "Beef Tripe 草原毛肚 ($5.49)",
                    "Pork belly ($5.49)",
                ], 
                selectedOptions: [], 
                limit: 100,
                price: 5.49
            },
            option4: {
                name: "Option (4.49 each)",
                choices: [
                    "Seaweed 海带丝 ($4.49)",
                    "Wood Ear 东北黑木耳 ($4.49)",
                    "Enoki Mushroom 金针茹 ($4.49)",
                    "Bamboo Shoots Sliced 笋片 ($4.49)",
                    "Green Vegetable 小青菜 ($4.49)",
                    "King Oyster Mushroom 王子菇 ($4.49)",
                    "Cauliflower 花菜 ($4.49)",
                    "Corn 玉米 ($4.49)",
                    "Shirataki 魔芋 ($4.49)",
                    "Thousand Pages Tofu 千叶豆腐 ($4.49)",
                    "Potato Sliced 土豆片 ($4.49)",
                    "Tomato 番茄 ($4.49)",
                    "Yuba 腐竹 ($4.49)",
                    "Lotus Sliced 莲藕片 ($4.49)",
                    "Fish Tofu 鱼豆腐 ($4.49)",
                    "Hotpot Sweet Potato Noodles 宽粉 ($4.49)",
                    "Napa 白菜 ($4.49)",
                    "Bean Sprout 豆芽 ($4.49)",
                    "Dried Yamakurage 贡菜 ($4.49)",
                    "Shimeji Mushroom 海鲜菇 ($4.49)",
                    "Frozen Tofu 冻豆腐 ($4.49)"
                ], 
                selectedOptions: [], 
                limit: 100,
                price: 4.49
            },
            option5: {
                name: "Options", choices:["Dry Chili Seasoning 干碟 $1.50", "Sesame Oil with Ingredients 油碟 $2.00", "Instant Noodle 公仔面 $3.00"], selectedOptions: [], limit: 100, adjustable: true
            }
        }},
        { id: 42, name: 'Chongqing Noodle 重庆小面', price:9.95 },
        { id: 43, name: 'Dan Dan Noodle 担担面', price:9.95 },
        { id: 44, name: 'Egg Fried Rice 蛋炒饭', price:9.95 },
        { id: 45, name: 'Spam Egg Fried Rice 午餐肉蛋炒饭', price:10.95 },
        { id: 46, name: 'Beef Stir-Fried Udon Noodle 牛肉炒乌冬面 ', price:10.95 },
        { id: 47, name: 'Seafood Stir-Fried Udon Noodle 海鲜炒乌冬面', price:13.95 },
        { id: 48, name: 'Beef Stir-Fried Instant Noodle 牛肉炒公仔面', price:10.95  },
        { id: 49, name: 'Seafood Stir-Fried Instant Noodle 海鲜炒公仔面', price:13.95  },
        { id: 410, name: 'White Rice 白饭', price:2.00 },
        { id: 411, name: 'Purple Sweet Potato Ball 紫薯球', price:5.95  },
        { id: 412, name: 'Fried pork egg roll (2pcs) 炸春卷', price:4.95  },
        { id: 413, name: 'sweet potato fries 地瓜薯条', price:6.95 },
        { id: 414, name: 'Corn pudding crispy 玉米布丁酥', price:5.95 },
        { id: 415, name: 'Cumin Chicken Strips 孜然鸡条', price:6.95 },
        { id: 416, name: 'Fried fish stick 炸鳕鱼条', price:6.95 },
        { id: 417, name: 'Rice Stuffed Chicken Wing 鸡翅包饭', price:6.95 },
        { id: 418, name: 'Rice Stuffed Chicken Wing(2) 鸡翅包饭(2)', price:12.95 },
        { id: 419, name: 'Fried Chicken Cutlet with cheese 爆浆鸡排', price:9.95  },
        { id: 420, name: 'Oyster Pancake 蚵仔煎', price:11.95  },
        { id: 421, name: 'Crispy Fried Pork 小酥肉', price:9.95  },
        { id: 422, name: 'Crispy Peanut 炒花生', price:5.00  },
        { id: 423, name: 'Cucumber in Hot and Sour Sauce 拍黄瓜', price:6.95  },
        { id: 424, name: 'Pickled Chicken Feet 泡椒凤爪', price:8.95  },
        { id: 425, name: 'Sliced Beef and OX Tongue in Chili Sauce 夫妻肺片', price:10.95  },
        { id: 426, name: 'Arctic Surf Clams w. Homemade Sauce 凉拌北极贝', price:15.95  },
        { id: 427, name: 'Boiled Fish Filets in Hot Chili Oil 水煮鱼片', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $24.95", "L $39.95"], selectedOptions: [], limit: 1, adjustable: true
                }
            }
        },
        { id: 429, name: 'Pickled Cabbage & Chili w. Fish Filets 酸菜鱼片', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $24.95", "L $39.95"], selectedOptions: [], limit: 1, adjustable: true
                }
            }
        },
        { id: 431, name: 'Live Fish Fillets w. Pickled Pepper 泡椒鱼片', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $24.95", "L $39.95"], selectedOptions: [], limit: 1, adjustable: true
                }
            }
        },
        { id: 433, name: 'Spicy Beef in Szechuan Style 水煮牛肉', price:30.95  },
        { id: 434, name: 'Five Stars Mixed in Spicy Chili Sauce 五鲜烩 (毛肚,黄喉,肥牛,午餐肉,鱿鱼须) 菜类(青瓜,白菜,木耳,腐竹,魔芋) Black beef tripe, yellow throat, beef, spam meat, squid, cucumber, napa, earwood, bean curd stick, konjak', price:30.95  },
        { id: 435, name: 'Pork Intestine w. Chili Pot 干锅肥肠', price:22.95  },
        { id: 436, name: 'Cumin Beef 孜然牛肉', price:18.95  },
        { id: 437, name: 'Mala Stir-Fried 麻辣香锅 (面筋,腐竹,花菜,鱿鱼,虾,鱼豆腐,肥牛,鸡胗) Gluten, bean curd stick, cauliflower, squid, shrimp, fish tofu, beef, chicken gizzard', price:30.95 },
        { id: 438, name: 'Twice Cooked Pork Belly 回锅肉', price:17.95  },
        { id: 439, name: 'ChongQing Spicy Chicken 重庆辣子鸡', price:16.95  },
        { id: 440, name: 'Hot & Sour Shredded Potato 酸辣土豆丝', price:13.95  },
        { id: 441, name: 'Mapo Tofu 麻婆豆腐', price:13.95  },
        { id: 442, name: 'West Lake Beef Soup 西湖牛肉羹', price:16.95  },
        { id: 443, name: 'Squid w. Cauliflower 鱿鱼炒花菜', price:13.95  },
        { id: 444, name: 'Pork Belly with Cauliflower 五花肉炒花菜', price:13.95  },
        { id: 445, name: 'Stir-Fried Shanghai Vegetables 炒上海青', price:13.95  },
        { id: 446, name: 'Sliced beef in Hot Sour Soup 酸汤肥牛', price:29.95  },
        { id: 447, name: 'stir fry tomato with egg 番茄炒蛋', price:13.95  },
        { id: 448, name: 'sweet and sour pork ribs 糖醋排骨', price:17.95  },
        { id: 449, name: 'Stir- Fried Lamb with Scallion 葱爆羊肉', price:16.95  },
        { id: 450, name: 'Stir-Fried Squid with XO Sauce XO酱炒鱿鱼', price:16.95  },
        { id: 451, name: 'Pink Lady 粉红佳人', price:7.50  },
        { id: 452, name: 'Orange Fruit Tea 粒粒鲜橙', price:6.75  },
        { id: 453, name: 'Grapefruit Fruit Tea w/ Jelly Boba 满杯西柚', price:6.75  },
        { id: 454, name: 'Mango Lemon Fruit Tea w/ Lychee Jelly 芒果香柠', price:6.75  },
        { id: 455, name: 'Rose Lemon Fruit Tea w/ Lychee Jelly 玫瑰香柠', price:6.75  },
        { id: 456, name: 'Strawberry Lemon Fruit Tea w/ Sweet Heart 草莓香柠', price:6.75  },
        { id: 457, name: 'Lychee Jasmine Green Tea w/ Lychee Jelly 荔枝香柠', price:6.75  },
        { id: 458, name: 'Mango & Passion Fruit Tea w/ Jelly Boba 芒果百香啵啵', price:6.75  },
        { id: 459, name: 'Honey Lemon Green Tea 蜂蜜柠檬绿茶', price:6.75  },
        { id: 460, name: 'Signature Lemonade 元气缤纷', price:6.75  },
        { id: 461, name: 'Orange lemon Fruit Tea 柳橙香柠', price:6.75  },
        { id: 462, name: 'Pina Colada Smoothie 椰香凤梨冰沙', price:6.75  },
        { id: 463, name: 'Mango & Orange Smoothie 柳芒冰沙', price:6.75  },
        { id: 464, name: 'Mango Smoothie 芒果冰沙', price:6.75  },
        { id: 465, name: 'Strawberry Smoothie 草莓冰沙', price:6.75  },
        { id: 466, name: 'Lychee Smoothie 荔枝冰沙', price:6.75  },
        { id: 467, name: 'Orange Juice 柳橙汁', price:8.45  },
        { id: 468, name: 'Cucumber Juice 青瓜汁', price:8.45  },
        { id: 469, name: 'Vitamin 123 维生素123', price:8.45  },
        { id: 470, name: 'Mr. Clean 排毒刷脂', price:8.45  },
        { id: 471, name: 'Carrot Juice 红萝卜汁', price:8.45  },
        { id: 472, name: 'Diet Coke 健怡可乐', price:2.00  },
        { id: 473, name: 'Coke 可乐', price:2.00  },
        { id: 474, name: 'Sprite 雪碧', price:2.00  },
        { id: 475, name: 'Soymilk 豆奶', price:3.00  },
        { id: 476, name: 'Wong Lo Kat 王老吉(加多宝)', price:3.00  },
    ]
};

export default S_Y_MINI_HOTPOT;