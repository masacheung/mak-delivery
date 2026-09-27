const S_Y_MINI_HOTPOT = {
    id: 4,
    name: 'S&Y Mini HotPot 蜀世冒菜',
    dishes: [
        { id: 41, name: 'Mini Hot Pot 冒菜', price:"SP",
        options: {
            option1: {
                name: "Choose Spice", choices: ["No Spicy (Tomato Soup) 不要辣(番茄汤底)","青花椒 Green Sichuan Pepper(spicy)","骨湯 Bone Broth(no spicy)", "Slightly 微微辣", "Mild 微辣", "Medium 中辣", "Fire 大辣", "Super Spicy 特辣"], selectedOptions: [], limit: 1
            },
            option2: {
                name: "Option (6.49 each)",
                choices: ["Frog leg 牛蛙 ($6.49)","Black Beef Tripe 大片毛肚 ($6.49)", "Shrimp Paste 虾滑 ($6.49)", "Snowflake Beef 雪花牛肉 ($6.49)", "Pork Intestine 肥肠 ($6.49)", "Fried Pork Shin 炸猪皮 ($6.49)"], 
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
        { id: 42, name: 'Twice Cooked Pork Belly 回锅肉', price:17.95},
        { id: 43, name: 'Mapo Tofu 麻婆豆腐', price:15.95},
        { id: 44, name: 'Spicy Beef in Szechuan Style 水煮牛肉', price:33.95},
        { id: 45, name: 'Cumin Beef 孜然牛肉', price:18.95},
        { id: 46, name: 'ChongQing Spicy Chicken 重庆辣子鸡', price:16.95},
        { id: 47, name: 'West Lake Beef Soup 西湖牛肉羹', price:19.95},
        { id: 48, name: 'Squid w. Cauliflower 鱿鱼炒花菜', price:13.95},
        { id: 49, name: 'Pork Belly with Cauliflower 五花肉炒花菜', price:13.95},
        { id: 410, name: 'stir fry tomato with egg 番茄炒蛋', price:14.95 },
        { id: 411, name: 'Brown Sugar Lava Rice Cake 紅糖糍粑', price:6.95  },
        { id: 412, name: 'Pork Intestine w. Chili Pot 干锅肥肠', price:22.95  },
        { id: 413, name: 'sweet potato fries 地瓜薯条', price:6.95 },
        { id: 414, name: 'Corn pudding crispy 玉米布丁酥', price:5.95 },
        { id: 425, name: 'Sliced Beef and OX Tongue in Chili Sauce 夫妻肺片', price:10.95  },
        { id: 426, name: 'Pickled Cabbage & Chili w. Fish Filets 酸菜活魚', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $28.95", "L $44.95"], selectedOptions: [], limit: 1, adjustable: true
                }
            }
        },
        { id: 427, name: 'whole fish in Hot Chili Oil 水煮活魚', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $28.95", "L $44.95"], selectedOptions: [], limit: 1, adjustable: true
                }
            }
        },
        { id: 428, name: 'Boiled Fish Filets in Hot Chili Oil 水煮魚片', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $24.95", "L $39.95"], selectedOptions: [], limit: 1, adjustable: true
                }
            }
        },
        { id: 420, name: 'Boiled Frog in Hot Chili Oil 泡椒牛蛙', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $25.95", "L $49.95"], selectedOptions: [], limit: 1, adjustable: true
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
        { id: 452, name: 'Whole fish w. Pickled Pepper 泡椒活魚', price:"SP",
            options: {
                optionSize: {
                    name: "Size", choices: ["M $28.95", "L $44.95"], selectedOptions: [], limit: 1, adjustable: true
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

        { id: 434, name: 'Five Stars Mixed in Spicy Chili Sauce 五鲜烩 (毛肚,黄喉,肥牛,午餐肉,鱿鱼须) 菜类(青瓜,白菜,木耳,腐竹,魔芋) Black beef tripe, yellow throat, beef, spam meat, squid, cucumber, napa, earwood, bean curd stick, konjak', price:33.95  },
        
                }
            }
        },
        
    ]
};

export default S_Y_MINI_HOTPOT;
