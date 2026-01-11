const HK_ALLEY = {
    id: 2,
    name: '港茶巷 HK ALLEY',
    dishes: [
        { id: 239, name: 'Combo A', price:20.49,
        options: {
            option1: {
                name: "Meal", choices: ["牛肉滑蛋蓋飯 Slippery Egg Chicken Over Rice +0.99", "豬扒滑蛋蓋飯 Slippery Egg Chicken"], selectedOptions: [], limit: 1
            },
            optionSize: {
                name: "Drinks", choices: ["陳皮凍檸 Aged Tangerine Hk Lemon Tea", "豪華百香果蜜綠茶 Deluxe Passion Fruit Green Tea","金磚港式檸檬 HK Lemon Tea","紅柚鮮橙綠茶 Grapefruit Orange Green Tea","百香果蜜綠茶 Passion Fruit Green Tea"], selectedOptions: [], limit: 1, adjustable: true
            },
             }},
         { id: 240, name: 'Combo B', price:21.49,
        options: {
            option1: {
                name: "Meal", choices: ["茄汁牛肉芝士焗飯 Tomato Beef Pasta Gartin +0.99","咖喱牛肉芝士焗飯 Curry Beef Rice Gartin +0.99", "茄汁豬扒芝士焗意粉 Tomato Sauce PorkChop Pasta Gratin ", "茄汁雞扒芝士焗意粉 Tomato Sauce Chicken Pasta Gratin", "咖喱豬扒芝士焗飯 Curry porkchop Over Rice Gratin", "咖喱雞扒芝士飯 Curry Chicken Rice Gratin"], selectedOptions: [], limit: 1
            },
            optionSize: {
                name: "Drinks", choices: [ "陳皮凍檸 Aged Tangerine Hk Lemon Tea", "豪華百香果蜜綠茶 Deluxe Passion Fruit Green Tea","金磚港式檸檬 HK Lemon Tea","紅柚鮮橙綠茶 Grapefruit Orange Green Tea","百香果蜜綠茶 Passion Fruit Green Tea"], selectedOptions: [], limit: 1, adjustable: true
            },
             }},
        { id: 241, name: '咖喱牛肉芝士焗飯 Curry Beef Rice Gartin', price:17.79},
        { id: 242, name: '咖喱豬扒芝士焗飯 Curry Pork Chop Rice Gartin', price:16.99},
        { id: 243, name: '茄汁牛肉芝士焗意粉 Tomato Beef Pasta Gartin', price:17.79},
        { id: 245, name: '茄汁豬扒芝士焗意粉 Tomato Sauce porkChop pasta Gartin', price:17.49},
        { id: 246, name: '茄汁牛肉芝士焗意粉 Tomato Beef Pasta Gartin', price:17.79},
        { id: 248, name: '雞扒滑蛋蓋飯 Slippery Egg Chicken Over Rice', price:15.49},
        { id: 249, name: '牛肉滑蛋蓋飯 Slippery Egg Chicken Over Rice', price:16.79},
         { id: 231, name: '鹹蛋黃菠蘿包 Salted Egg Pineapple Bun', price:3.59 },
        { id: 232, name: '芋泥菠蘿包(1PC) Taro Pineapple Bun ', price:3.19 },
        { id: 233, name: '招牌原味菠蘿包 Butter Pineapple Bun', price:3.19 },
        { id: 252, name: '鹹蛋黃菠蘿包 Salted Egg Pineapple Bun', price:3.49 },
        { id: 254, name: '咖喱魚蛋 Curry Fish Ball 8pc', price:6.49 },
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
