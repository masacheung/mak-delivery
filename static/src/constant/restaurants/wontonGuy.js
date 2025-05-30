const WONTON_GUY = {
    id: 3,
    name: '雲吞佳',
    dishes: [
        { id: 31, name: '雲吞麵 Shrimp Wonton With Noodle in Soup', price:11.00 ,
        options: {
            option1: {
                name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
            }
        }},
        { id: 32, name: '水餃麵 Dumplings with Noodle in Soup', price:11.00 ,
        options: {
            option1: {
                name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
            }
        }},
        { id: 33, name: '鯪魚球麵 Dace Fish Balls with Noodle in Soup', price:11.00 ,
        options: {
            option1: {
                name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
            }
        }},
        { id: 34, name: '牛肉麵 Sliced Beef with Noodle in Soup', price:11.00 ,
        options: {
             option1: {
                name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
             }
        }},
        { id: 35, name: '牛腩麵 Beef Briskets with Noodle in Soup ', price:11.00 ,
        options: {
             option1: {
                 name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
             }
         }},
        { id: 36, name: '上湯淨麵 Plain Noodle in Soup', price:12.00 },
        { id: 37, name: '雙拼麵 Two Toppings with Noodle in Soup', price:12.75,
        options: {
            option1: {
                name: "Choose Noodle ", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
            },
            option2: {
                name: "Choose Toppings", choices: [ "雲吞 Wonton", "水餃 Dumplings ","鯪魚球 Dace Fish Ball","牛肉 Sliced Beef","牛腩 Beef Briskets","豬手 Pork Knuckle"], selectedOptions: [], limit: 2
            },
        }},
        { id: 38, name: '三拼麵 Three Toppings with Noodle in Soup', price:14.50,
          options: {
              option1: {
                  name: "Choose Noodle ", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
              },
              option2: {
                  name: "Choose Toppings", choices: [ "雲吞 Wonton", "水餃 Dumplings ","鯪魚球 Dace Fish Ball","牛肉 Sliced Beef","牛腩 Beef Briskets","豬手 Pork Knuckle"], selectedOptions: [], limit: 3
              },
          }},
        { id: 39, name: '雲吞撈麵 Shrimp Wonton Lo Mein', price:12.00 ,
        options: {
              option1: {
                  name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
              }
        }},
        { id: 310, name: '水餃撈麵 Dumplings Lo Mein ', price:12.00 ,
        options: {
            option1: {
                name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
            }
        }},
        { id: 311, name: '鯪魚球撈麵 Dace Fish Balls Lo Mein', price:12.00 ,
        options: {
            option1: {
                name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
            }
        }},
        { id: 312, name: '牛肉撈麵 Sliced Beef Lo Mein', price:12.00 ,
        options: {
             option1: {
                 name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
             }
        }},
        { id: 313, name: '炸醬撈麵 Chili Tomato Sauce with Shredded Pork Lo Mein', price:12.00 ,
        options: {
             option1: {
                 name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
             }
         }},
        { id: 314, name: '蠔油撈麵 Oyster Sauce Lo Mein', price:10.00 ,
        options: {
             option1: {
                 name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
             }
         }},
        { id: 315, name: '油菜撈麵 Vegetable Lo Mein', price:11.50 ,
        options: {
             option1: {
                 name: "Noodle Type", choices: ["河粉 Flat Rice Noodle", "米粉 Vemicelli Noodle", "米線 Rice Noodle", "蛋麵 Egg Noodle"], selectedOptions: [], limit: 1
             }
        }},
        { id: 316, name: '牛腩撈麵', price:12.00 ,
        options: {
             option1: {
                name: "Noodle Type", choices: ["河粉", "米粉", "米線", "蛋麵"], selectedOptions: [], limit: 1
             }
        }},
        { id: 317, name: '雙拼撈麵', price:13.75  },
        { id: 318, name: '三拼撈麵', price:15.50  },
        { id: 319, name: '牛腩（小食）Beef Brisket', price:19.00  },
        { id: 320, name: '炸魚皮（小食）Deep Fried Fish Skin', price:7.00  },
        { id: 321, name: '油菜（菜心或生菜）Vegetable with Oyster Sauce(Choy Sum or Lettuce) ', price:6.00  },
        { id: 322, name: '炸醬生菜（小食）Chill Tomato Sauce with Shredded Pork on Lettuce', price:10.00  },
        { id: 323, name: '淨上湯（小食）House Special Soup', price:3.00  },
        { id: 324, name: '咖喱魚蛋（小食）Curry Fish Ball', price:7.00  },
        { id: 325, name: '加牛腩汁 adding Beef Brisket Gravy', price:1.00  },
        { id: 326, name: '加麵 Extra Noodle', price:3.00  },
        { id: 327, name: '加菜 Adding Vegetable', price:3.00  },
        { id: 328, name: '雲吞生鮮 Shrimp Wonton 1 DOZEN', price:20.00  },
        { id: 329, name: '雲吞生鮮 Shrimp Wonton 1/2 DOZEN', price:10.00  },
        { id: 330, name: '水餃生鮮 Dumpling 1DOZEN', price:20.00  },
        { id: 331, name: '水餃生鮮 Dumpling1/2 DOZEN', price:10.00  },
        { id: 332, name: '鯪魚球生鮮 Dace Fish Paste 1 DOZEN', price:14.00  },
        { id: 333, name: '鯪魚球生鮮 Dace Fish Paste 1/2 DOZEN', price:7.00  },
        { id: 334, name: '牛肉生鮮 Slice Beef 1 DOZEN', price:14.00  },
        { id: 335, name: '牛肉生鮮 Slice Beef 1/2 DOZEN', price:7.00  },
        { id: 336, name: '蛋麵 Egg Noodle Each', price:3.00  },
        { id: 337, name: '河粉 Flat Rice Noodle ', price:4.00  },
        { id: 338, name: '辣椒油 Chili Oil 1 jar', price:14.00  },
    ]
};

export default WONTON_GUY;
