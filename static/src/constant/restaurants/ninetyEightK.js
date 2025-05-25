const NINETY_EIGHT_K = {
    id: 5,
    name: '98K',
    dishes: [
        { id: 51, name: '香酥雞腿堡 Crispy Chicken Sandwich', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $6.98", "COMBO $10.75"], selectedOptions: [], limit: 1, adjustable: true
            },
            option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-spicy"], selectedOptions: [], limit: 1
            }
        }},
        { id: 53, name: '奧爾良漢堡 Grilled Chicken Sandwich', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $6.98", "COMBO $10.75"], selectedOptions: [], limit: 1, adjustable: true
            },
            option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
            }
        }},
        { id: 55, name: "勇者辣堡 Bolder's Hot Sandwich(Spicy)", price:"SP",
         options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $8.25", "COMBO $11.98"], selectedOptions: [], limit: 1, adjustable: true
            },
         }
         },
        { id: 57, name: '脆皮雞肉卷 Crispy Chicken Wrap', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $6.98", "COMBO $10.75"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 59, name: '烤雞肉卷 Grilled Chicken Wrap', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $6.98", "COMBO $10.75"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 511, name: '芝士牛肉堡 Cheese Burger', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $7.50", "COMBO $11.75"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 513, name: '培根芝士牛肉堡 Bacon Cheese Burger', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $8.98", "COMBO $11.25"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 515, name: '魚堡 Fish Sandwich', price:"SP",
         options: {
            optionSize: {
               name: "Size", choices: ["單點 $7.50", "COMBO $11.25"], selectedOptions: [], limit: 1, adjustable: true
            }
         }},
        { id: 517, name: ' 情侶套餐 Meal For 2', price:21.98},
        { id: 518, name: '混合炸雞3pcs Mixed Fried Chicken (Leg&Tighs)', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $6.98", "COMBO $11.25"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 519, name: '混合炸雞5pcs Mixed Fried Chicken (Legs&Tighs)', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $10.98", "COMBO $15.25"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 521, name: '混合炸雞8pcs Mixed Fried Chicken(Legs&Tighs)', price:"SP" ,
        options: {
            optionSize: {
               name: "Size", choices: ["單點 Single $16.75", "COMBO $20.98"], selectedOptions: [], limit: 1, adjustable: true
            },
             option1: {
                name: "Spicy", choices: ["辣  Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 523, name: ' 辣翅 Spicy Cripsy Chicken Wings', price:"SP",
         options: {
            optionSize: {
               name: "Pieces", choices: ["2pcs $3.25", "6pcs $9.50", "10pcs $13.50"], selectedOptions: [], limit: 1, adjustable: true
            }
         }
        },
        { id: 526, name: ' 烤翅 Roasted Chicken Wings', price:"SP",
         options: {
            optionSize: {
               name: "Pieces", choices: ["2pcs $3.25", "6pcs $9.50", "10pcs $13.50"], selectedOptions: [], limit: 1, adjustable: true
            }
         }
        },
        { id: 529, name: '薯條 Fries', price:4.5 ,
        options: {
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 530, name: '馬鈴薯條 Potato Wedges', price:6.25 ,
        options: {
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 531, name: '雞米花 Popcorn Chicken', price:6.25 ,
        options: {
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 532, name: ' 雞塊 Chicken Nuggets', price:4.25},
        { id: 533, name: ' 洋蔥圈 Onion Rings', price:4.25},
        { id: 534, name: ' 奶酪棒 Mozzarella Sticks ', price:6.25},
        { id: 535, name: '孜然烤雞架3pcs Roasted Chicken Ribs', price:6.95 ,
        options: {
             option1: {
                name: "Spicy", choices: ["辣Spicy", "不辣 Non-Spicy"], selectedOptions: [], limit: 1
             }
        }},
        { id: 536, name: '手槍腿 Legs', price:7.95 ,
        options: {
             option1: {
                name: "Spicy", choices: ["辣 Spicy", "不辣 Non-Spicy","New Orleans"], selectedOptions: [], limit: 1
             }
        }},
    ]
};

export default NINETY_EIGHT_K;
