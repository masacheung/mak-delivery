const NEW_DA_NOODLES = {
  id: 13,
  name: '牛大 NewDa Noodles',
  dishes: [
     { id: 1329, name: '孜然炒羊肉配兩塊月牙餅 Sizzling Cumin Lamb Platter w 2 Bread', price: 20.99},
     { id: 1332, name: '水盆羊肉 Xian Style Lamb Soup', price: 16.95},
     { id: 1330, name: '孜然羊肉肉夾饃 Xian Lamb Burger', price: 6.95 },
    { id: 1331, name: '孜然羊肉拌麵 Stir Fried Cumin lamb Noodles', price:13.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
      }},
     { id: 131, name: '纯汤牛肉面 Lanzhou Beef Noodle Soup', price:13.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 132, name: '传统牛肉面 Traditional Beef Noodle Soup', price:13.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 133, name: '椒麻牛肉面 Sichuan Pepper Beef Noodle Soup', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 134, name: '兰州传统卤面 Lanzhou Braised Noodle', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 135, name: '兰州肥肠面 Lanzhou Intestine Noodle Soup', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 136, name: '番茄红烧牛肉面 Tomato Roast Beef Noodle Soup', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 137, name: '羊肉汤面 Lamb Hand Pull Noodle Soup', price:15.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 138, name: '兰州辣子凉面 Lanzhou Cold noodles', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 139, name: '油泼面  Oil Spill Noodles', price:13.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1310, name: '炸酱面 Jajang Noodles', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1311, name: '酸辣素凉面 Spicy Cold Noodles', price:14.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1312, name: '葱油拌面 Scallion Oil Noodles ', price:10.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1313, name: '兰州炒面 Lanzhou stir Fry Handpull Noodles', price:15.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1314, name: '刀削炒面 Stir Fry Knife Sliced Noodles', price:15.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1315, name: '三合一油泼面 Stir Fry Knife Sliced Noodles', price:15.95,
        options: {
          option1:
            {
              name: "Noodle Types",
              choices: ["細的 Thin", "二細 Thick","韭叶 Flat ","小宽 Wide","大宽 Extra Wide","刀削 Knife Sliced" ,], selectedOptions: [], limit: 1
            },
          option2:
            {
              name: "主食/湯選1 Add on/ extra noodle", 
              choices: ["麵Noodle $3.95", "上海菜 Bok Choy $2.95","牛肉 Beef $4.95","肥腸 Intestine $4.95", "雞肉 Chicken $4.95","油豆腐 Tofu $2.95"], selectedOptions: [], limit: 7, adjustable: true
            },
      }},
      { id: 1316, name: '蒜泥黄瓜 Cucumber Salad', price: 5.95 },
      { id: 1317, name: '小碗牛肉汤 Small Beef Soup', price: 4.95 },
      { id: 1318, name: '红油泡菜 Chili Oil Kim chi', price: 5.95 },
      { id: 1319, name: '皮蛋豆腐 Tofu with Century Egg Salad', price: 6.95 },
      { id: 1320, name: '风味盐酥鸡 Popcorn Chicken', price: 9.95 },
      { id: 1321, name: '酸辣土豆丝 Shred Potato Salad', price: 5.95 },
      { id: 1322, name: '麻辣牛肉 Spicy Beef Salad', price: 11.95 },
      { id: 1323, name: '凉拌海带丝 Kelp Salad', price: 6.95 },
      { id: 1324, name: '兰州酿皮 Lanzhou Liangpi', price: 9.95 },
      { id: 1325, name: '手撕羊肉每日限量 Mutton Chops', price: 23.95 },
      { id: 1326, name: '凉拌西芹腐竹 Celery with Beancurd Salad', price: 6.95 },
      { id: 1327, name: '爽口云耳 Crispy refreshing woodear', price: 6.95 },
      { id: 1328, name: '茶叶蛋（1）Chinese Tea Egg (1)', price: 1.95 }
  ]
};

export default NEW_DA_NOODLES;
