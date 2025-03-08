const HK_ALLEY = {
    id: 2,
    name: '港茶巷 HK ALLEY',
    dishes: [
        { id: 21, name: '金磚港式奶茶', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $6.00", "L $7.00"], selectedOptions: [], limit: 1, adjustable: true
            },
            option1:
                {
                name: "Sugar Level",
                choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                selectedOptions: [], limit: 1
                },
            option2:
                {
                name: "add-ons (0.85 each)",
                price: 0.85,
                choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 23, name: '冰凍港奶(M)', price:6.00,
          options: {
              option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
          }},
        { id: 24, name: '金磚港式茶走', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $6.50", "L $7.50"], selectedOptions: [], limit: 1, adjustable: true
            },
            option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
            option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 26, name: '金磚鴛鴦奶茶', price:"SP",
        options: {
            optionSize: {
                name: "Size", choices: ["M $6.00", "L $7.00"], selectedOptions: [], limit: 1, adjustable: true
            },
            option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
        }},
        { id: 28, name: '金磚布蕾奶茶', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $6.00", "L $7.00"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 210, name: '布蕾打冷震奶茶(L)', price:7.95,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 211, name: '港式檸檬(L)', price:6.50,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 212, name: '陳皮檸檬(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 213, name: '奇異果蜜綠茶(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 214, name: '紅油鮮橙綠茶(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 215, name: '桃子蜜烏龍(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 216, name: '百香果蜜綠茶(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 217, name: '芭樂麥綠茶(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 218, name: '石榴凍檸(L)', price:7.00,
         options: {
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 219, name: '阿薩姆奶茶', price: "SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $5.50", "L $6.50"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 221, name: '茉莉奶綠', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $5.50", "L $6.50"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 223, name: '深焙烏龍', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $5.50", "L $6.50"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 225, name: '伯爵奶茶', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $5.50", "L $6.50"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 227, name: '黑糖奶茶', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $6.50", "L $7.50"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1:
                 {
                 name: "Sugar Level",
                 choices: ["Little Sugar (30%)", "1/2 Sugar (50%)", "Less Sugar (70%)", "Regular Sugar (100%)"],
                 selectedOptions: [], limit: 1
                 },
             option2:
                 {
                 name: "add-ons (0.85 each)",
                 price: 0.85,
                 choices: [ "Oreo +$0.85", "Regular Bubble +$0.85", "Coconut Lychee Jelly +$0.85", "Add Aloe +$0.85", "Herb Jelly +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 229, name: '迷你菠蘿包(1PC) ', price:3.00 },
        { id: 230, name: '迷你菠蘿包(COMBO) ', price:2.00 },
        { id: 231, name: '迷你芋泥菠蘿包(1PC) ', price:3.00 },
        { id: 232, name: '迷你芋泥菠蘿包(COMBO) ', price:2.00 },
        { id: 233, name: '迷你鹹蛋黃菠蘿包(1PC) ', price:3.00 },
        { id: 234, name: '迷你鹹蛋黃菠蘿包(1PC) ', price:2.00 },
        { id: 235, name: '芋泥肉鬆葡撻(1PC) ', price:2.99 },
        { id: 236, name: '葡撻(1PC) ', price:2.49 },
    ]
};

export default HK_ALLEY;
