const JI_BEI_CHUAN = {
    id: 10,
    name: '季北川',
    dishes: [
        { id: 101, name: '至尊花胶鸡米粉(有鸡肉)Ji’s Fish Maw Rice Noodle Soup (without Chicken)', price:15},
        { id: 102, name: '季北川花胶鸡米粉(不含鸡肉)Supreme Fish Maw Chicken Soup Rice Noodles', price:13},
        { id: 103, name: '酸菜鱼片米粉 Fish Slice Rice Noodles🌶️', price:13.79},
        { id: 104, name: '酸菜肥肠米粉Pork Intestine Rice Noodles🌶️', price:4.50},
        { id: 105, name: '酸菜牛肚米粉Beef Tripe Rice Noodles🌶️', price:13.79},
        { id: 106, name: '酸菜肥⽜米粉Beef Slices Rice Noodles🌶️', price:13.79},
        { id: 107, name: '酸菜菌菇素米 粉Fresh Mushroom Rice Noodles🌶️', price:11.79},
        { id: 108, name: '麻辣鱼片米粉Fish Slices Rice Noodles🌶️🌶️🌶️', price:12.79},
        { id: 109, name: '麻辣肥牛米粉Beef Slices Rice Noodles🌶️🌶️🌶️', price:13.79},
        { id: 1010, name: '麻辣牛肚米粉Beef Tripe Rice Noodles 🌶️🌶️🌶️', price:13.79},
        { id: 1011, name: '麻辣牛腩米粉Beef Brisket Rice Noodle🌶️🌶️🌶️', price:13.79 },
        { id: 1012, name: '麻辣菌菇素米粉Fresh Mushroom Rice Noodles🌶️🌶️🌶️ ', price:11.79 },
        { id: 1013, name: '⾁沫⼲拌粉Minced Pork Sauce', price:4.50},
        { id: 1014, name: '⽜腩⼲拌粉Beef Brisket Sauce', price:13.79},
        { id: 1015, name: '肥肠⼲拌粉Pork Intestine Sauce', price:13.79},
        { id: 1016, name: '⽜肚千拌粉Beef Tripe Sauce ', price:13.79},
        { id: 1017, name: '⽜ 腱⼲拌粉Beef Shank Sauce', price:13.79},
        { id: 1018, name: '全家福⼲拌粉Assorted Beef Sauce', price:16},
        { id: 1019, name: '泰式⾦汤鸡米粉Chicken Rice Noodles🌶️🌶️', price:12.79},
        { id: 1020, name: '泰式⾦汤魚米粉Fish Slices Rice Noodles🌶️🌶️', price:12.79 },
        { id: 1021, name: '泰式⾦汤 肥⽜米粉Beef Slices Rice Noodles🌶️🌶️', price:11.79 },
        { id: 1022, name: '泰式⾦ 汤肥肠米粉Pork Intestine Rice Noodles🌶️🌶️', price:13.79 },
        { id: 1023, name: '菌菇米粉Mushroom Rice Noodles', price:12.00},
        { id: 1024, name: '菌菇肥⽜米粉Mushroom & Beef SlicesRice Noodles', price:14.00 },
        { id: 1025, name: '菌菇⾖腐米粉Mushroom & Tofu Rice Noodles', price:13.00 },
        { id: 1026, name: '番茄⽜腩米粉Beef Shank Rice Noodles', price:13.79 },
        { id: 1027, name: '番茄⻥片米粉Fish Slices Rice Noodles', price:12.79 },
        { id: 1028, name: '番茄肥⽜米粉Beef Slices Rice Noodles', price:13.79 },
        { id: 1029, name: '番茄⽜腱米粉Beef Shank Rice Noodles', price:13.79 },
        { id: 1030, name: '原味⻥片米 粉Fish Slices Rice Noodles', price:12.79 },
        { id: 1031, name: '原味肥⽜米粉Beef Slices Rice Noodles ', price:13.79 },
        { id: 1032, name: '原味⽜腱米粉Beef Shank Rice Noodles', price:13.79 },
        { id: 1033, name: '原味⽜腩米粉Beef Brisket Rice Noodles', price:13.79 },
        { id: 1034, name: '冬阴功海鮮米粉Seafood Rice Noodles🌶️', price:13.79 },
        { id: 1035, name: '冬阴功肥⽜米粉Beef Slices Rice Noodles🌶️', price:13.79 },
        { id: 1036, name: '冬阴菌菇素米粉Fresh Mushroom Rice Noodles (Vegan Broth)🌶️', price:11.79 },
        { id: 1037, name: '原味⽜腩米粉Beef Brisket Rice Noodles', price:13.79 },
        { id: 1038, name: '原味⽜腩米粉Beef Brisket Rice Noodles', price:13.79 },
        { id: 1039, name: '豚骨拉⾯Tonkotsu Ramen ', price:15.79},
        { id: 1040, name: '肥⽜拉⾯Beef Slices Ramen', price:14.79},
        { id: 1041, name: '菌蔬菜拉⾯Vegetable Ramen (VG)', price:13.79 },
        { id: 1042, name: '豚骨乌冬⾯ Tonkatsu Udon Noodles', price:15.79},
        { id: 1043, name: '肥⽜⻦冬⾯Beef Slices Udon Noodles', price:14.79 },
        { id: 1044, name: '鸡 ⾁ 炒 乌 冬 ⾯Stir Fry Chicken with ', price:14,
            options: {
                option1: {
                    name: "Types", choices: ["乌冬⾯Udon","⾯Noodle","米粉Rice Noodle"], selectedOptions: [], limit: 1
                }
            }
        },
        { id: 1045, name: '⽜⾁炒乌冬⾯ Stir Fry Beef with', price:15,
            options: {
                option1: {
                    name: "Types", choices: ["乌冬⾯Udon","⾯Noodle","米粉Rice Noodle"], selectedOptions: [], limit: 1
                }
            }
        },
        { id: 1046, name: '虾炒乌冬⾯ Stir Fry Shrimp with', price:15,
            options: {
                option1: {
                    name: "Types", choices: ["乌冬⾯Udon","⾯Noodle","米粉Rice Noodle"], selectedOptions: [], limit: 1
                }
            }
         },
        { id: 1047, name: '蔬菜炒乌冬⾯ Stir Fry Vegetable with', price:13,
            options: {
                option1: {
                    name: "Types", choices: ["乌冬⾯Udon","⾯Noodle","米粉Rice Noodle"], selectedOptions: [], limit: 1
                }
            }
        },
        { id: 1048, name: '鸡⾁炒饭Chicken Fried Rice', price:13},
        { id: 1049, name: '⽜ ⾁ 炒 饭Beef Fried Rice', price:14 },
        { id: 1050, name: '虾 炒 饭Shrimp Fried Rice', price:14},
        { id: 1051, name: '蔬 菜 炒 饭Vegetable Fried Rice', price:11},
        { id: 1052, name: '豬 ⾁ 煎 饺 Pork Dumpling(6pcs)', price:6.99 },
        { id: 1053, name: '豬 ⾁ ⾲ 菜 虾 煎 饺Pork And Leek Shrimp Pan-fried Dumplings(6pc)', price:7.99 },
        { id: 1054, name: '香炸酥⾁Crispy Fried Pork', price:7.99 },
        { id: 1055, name: '盐酥鸡Salt Fried Chicken', price:7.99 },
        { id: 1056, name: '猪⾁香腸Pork Sausage(2pcs)', price:6.99 },
        { id: 1057, name: '红糖糍粑Brown Sugar Rice Cake(5pcs)', price:7.99 },
        { id: 1058, name: '葱油饼Scallion Pancake', price:5.99 },
        { id: 1059, name: '炸鸡翅Fried Chicken Wings(4pcs)', price:7.99 },
        { id: 1060, name: ' 爆浆芝⼠虾球Stir Fried Shrimp Balls Balls With Cheese(5pc)', price:6.99 },
        { id: 1061, name: '椰汁流⼼球Coconut Juice Flow Ball (5pc)', price:5.99 },
        { id: 1062, name: '⿊椒⽜⾁酥⽪馅 饼Black Pepper Beef Puff Pastry', price:2.99 },
    ]
}

export default JI_BEI_CHUAN;