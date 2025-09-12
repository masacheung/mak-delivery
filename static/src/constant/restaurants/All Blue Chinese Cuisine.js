const ALL BLUE CHINESE CUISINE = {
    id: 15,
    name: '四海 All Blue Chinese Cuisine',
    dishes: [
        { id: 151, name: '辣子雞翅 Chill Chicken Wings', price:19.99},
        { id: 152, name: '鮮椒燉牛肉 Braised Beef with Fresh Chili Green Peppers', price:32.99 },
        { id: 153, name: '香酥鴨 Cripsy Mala Duck ', price:24.99 },
        { id: 154, name: '燒乳鴿 Roast Pigeon', price:22.99  },
        { id: 155, name: "烤鴨 Roast Duck", price:"SP",
                options: {
                    optionSize:
                        {
                        name: "Sizes ",
                        choices: [
                            "半隻 Half 25.99",
                            "一隻 Whole 47.99",
                            
                        ], selectedOptions: [], limit: 1, adjustable: true
                    },
       }
        }},
        { id: 157, name: "沙茶粉絲煲 Vermicelli Clay Pot with Satay Sauce", price: "34.99",
            options: {
                option1: {
                    name: "Choice of Meat",
                    choices: ["Beef", "Beef Tripe"],
                    selectedOptions: [],
                    limit: 1,
       }
        }},
        
        { id: 158, name: '沙薑豬肚 Pork Tripe with Sand Ginger', price:26.99 },
        { id: 159, name: '甜皮鸭 Sweet Skin Duck ', price:24.99 },
        { id: 160, name: '冒烤鸭 Stewed Roasted Duck', price:40.99 },
        { id: 161, name: '蒜蓉粉丝开背虾 Steamed Shrimps w. Garlic Sauce', price:28.99 },
        { id: 162, name: '粉蒸牛肉 🌶 Steamed Beef in Rice Flour', price:22.99 },
        { id: 163, name: '肝腰合炒 🌶 Pork Kidney Liver Stir Fry - $19.99', price:19.99 },
