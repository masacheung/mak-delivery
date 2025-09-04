const HK_ALLEY = {
    id: 2,
    name: '港茶巷 HK ALLEY',
    dishes: [
         { id: 237, name: 'Combo A', price:21.99,
        options: {
            option1: {
                name: "Meal", choices: ["招牌黯然銷魂飯 Char Siu(BBQ Pork) Rice ", "招牌叉燒滑蛋飯 Slippery Egg Char Siu Over Rice"], selectedOptions: [], limit: 1
            },
            optionSize: {
                name: "Drinks", choices: [ "金磚港式奶茶 Hong Kong Milk Tea", "金磚鴛鴦奶茶 Coffee HK Milktea","金磚港式檸檬 HK Lemon Tea","草莓布蕾鮮乳 Strawberry Cream Brulee Milk(M)","紅柚鮮橙綠茶 Grapefruit Orange Green Tea","Deluxe Passionfruit Green Tea 豪華百果香蜜綠茶+0.99 "], selectedOptions: [], limit: 1, adjustable: true
            },
             }},
          { id: 238, name: 'Combo B', price:26.99,
        options: {
            option1: {
                name: "Meal", choices: ["黑椒牛扒意粉 Black Pepper Steak Over Pasta ", "茄汁牛扒意粉 Tomato Sauce Steak Over Pasta"], selectedOptions: [], limit: 1
            },
            optionSize: {
                name: "Drinks", choices: [ "金磚港式奶茶 Hong Kong Milk Tea", "金磚鴛鴦奶茶 Coffee HK Milktea","金磚港式檸檬 HK Lemon Tea","草莓布蕾鮮乳 Strawberry Cream Brulee Milk(M)","紅柚鮮橙綠茶 Grapefruit Orange Green Tea","Deluxe Passionfruit Green Tea 豪華百果香蜜綠茶+0.99 "], selectedOptions: [], limit: 1, adjustable: true
            },
             }},
        { id: 239, name: 'Combo C', price:18.99,
        options: {
            option1: {
                name: "Meal", choices: ["黑椒豬扒意粉 Black Pepper PorkChop Over Pasta ", "茄汁豬扒意粉 Tomato Sauce PorkChop Over Pasta", "茄汁雞扒意粉 Tomato Sauce Chicken Over Pasta", "黑椒雞扒意粉 Black Pepper Chicken Over Pasta", "咖喱雞扒蓋飯 Curry Chicken Over Rice", "雞扒滑蛋蓋飯 Slippery Egg Chicken Over Rice"], selectedOptions: [], limit: 1
            },
            optionSize: {
                name: "Drinks", choices: [ "金磚港式奶茶 Hong Kong Milk Tea", "金磚鴛鴦奶茶 Coffee HK Milktea","金磚港式檸檬 HK Lemon Tea","草莓布蕾鮮乳 Strawberry Cream Brulee Milk(M)","紅柚鮮橙綠茶 Grapefruit Orange Green Tea","Deluxe Passionfruit Green Tea 豪華百果香蜜綠茶+0.99 "], selectedOptions: [], limit: 1, adjustable: true
            },
             }},
         { id: 240, name: 'Combo D', price:20.99,
        options: {
            option1: {
                name: "Meal", choices: ["茄汁豬扒芝士焗意粉 Tomato Sauce PorkChop Pasta Gratin ", "茄汁雞扒芝士焗意粉 Tomato Sauce Chicken Pasta Gratin", "咖喱豬扒芝士焗飯 Curry porkchop Over Rice Gratin", "咖喱雞扒芝士飯 Curry Chicken Rice Gratin"], selectedOptions: [], limit: 1
            },
            optionSize: {
                name: "Drinks", choices: [ "金磚港式奶茶 Hong Kong Milk Tea", "金磚鴛鴦奶茶 Coffee HK Milktea","金磚港式檸檬 HK Lemon Tea","草莓布蕾鮮乳 Strawberry Cream Brulee Milk(M)","紅柚鮮橙綠茶 Grapefruit Orange Green Tea","Deluxe Passionfruit Green Tea 豪華百果香蜜綠茶+0.99 "], selectedOptions: [], limit: 1, adjustable: true
            },
             }},
        { id: 241, name: '招牌黯然銷魂飯 Char Siu(BBQ Pork) Rice', price:16.99},
        { id: 242, name: '招牌叉燒滑蛋飯 Slippery Egg Char Siu Over Rice', price:16.99},
        { id: 243, name: '黑椒牛扒意粉 Black Pepper Steak Over Pasta ', price:21.99},
        { id: 244, name: '茄汁牛扒意粉 Tomato Sauce Steak Over Pasta', price:21.99},
        { id: 245, name: '茄汁豬扒意粉 Tomato Sauce porkChop Over Pasta', price:13.49},
        { id: 246, name: '茄汁雞扒意粉 Tomato Sauce Chicken Over Pasta', price:13.49},
        { id: 247, name: '咖哩雞扒蓋飯 Curry Chicken Over Rice', price:13.49},
        { id: 248, name: '雞扒滑蛋蓋飯 Slippery Egg Chicken Over Rice', price:14.49},
        { id: 249, name: '雞扒滑蛋蓋飯 Slippery Egg Chicken Over Rice', price:14.49},
        { id: 250, name: '黑椒雞扒意粉 Black Pepper Chicken Over Pasta', price:14.49},
        { id: 251, name: '黑椒豬扒意粉 Black Pepper PorkChop Over Pasta', price:13.49},
        { id: 229, name: '招牌原味菠蘿包(1PC) Butter Pineapple Bun', price:2.99 },
        { id: 231, name: '鹹蛋黃菠蘿包 Salted Egg Pineapple Bun', price:3.49 },
        { id: 232, name: '芋泥菠蘿包(1PC) Taro Pineapple Bun ', price:2.99 },
        { id: 233, name: '招牌叉燒 BBQ Pork', price:9.99 },
        
        
         { id: 21, name: '金磚港式奶茶 Hong Kong Milk Tea', price:"SP",
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
                choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 23, name: '布蕾打冷震 Creme Brulee Milk Tea Frappe(L)', price:7.99,
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
          }},
        { id: 24, name: ' 金磚布蕾奶茶 Creme Brulee Milk Tea', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $6.00", "L $6.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 26, name: '金磚鴛鴦奶茶 Coffee HK Milktea', price:"SP",
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
        }},
        { id: 28, name: '奧利奧咖啡慕斯拿鐵 Oreo Coffee Mousse Latte', price:"SP",
         options: {
            optionSize: {
                name: "Size", choices: ["M $6.49", "L $7.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
         { id: 29, name: '草莓布蕾鮮乳 Strawberry Creme Brulee Milk', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["M $6.49", "L $7.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
        }},
        { id: 29, name: '厚芋泥鮮乳 Real Rich Taro Milk', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["M $6.49", "L $7.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 29, name: '金磚港式凍檸 HK Lemon Tea', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["L $6.49", "XL $7.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        
        { id: 211, name: '大枝凍檸冰沙 Jumbo HK Leomon Tea Slush', price:7.99,
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
         { id: 29, name: '豪華百香果綠茶 Deluxe Passion Fruit Green Tea', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["M $7.99", "L $.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 29, name: '金磚陳皮檸檬 Aged Tangerine Hk Lemon Tea', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["L $6.99", "XL $8.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 29, name: '陳皮檸檬可樂 Aged Tangerine Lemon Cola', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["L $6.99", "XL $8.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
        { id: 29, name: '紅油鮮橙綠茶(L) Grapefruit Orange Green Tea', price:"SP",
       options: {
            optionSize: {
                name: "Size", choices: ["L $6.99", "XL $8.99"], selectedOptions: [], limit: 1, adjustable: true
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
                 choices: [ "Oreo +$0.85", "Boba +$0.85", "Coconut Lychee Jelly +$0.85", "White Boba +$0.85"], selectedOptions: [], limit: 100
                 },
            option3:
                {
                name: "add-ons (1.00 each)",
                price: 1.00,
                choices: [ "Creme Brulee +$1.00", "Cheese Foam +$1.00"], selectedOptions: [], limit: 100
                }
         }},
       
        
        
    
    ]
};

export default HK_ALLEY;
