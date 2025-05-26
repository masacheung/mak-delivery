import React from "react";
import { Box, Typography, Divider, keyframes } from "@mui/material";
import chefImage from "../../image/chef.webp";
import hkAlley from "../../image/hk_alley.webp";
import jiBeiChuan from "../../image/jiBeiChuan.webp"; // Assuming you have an image for Ji Bei Chuan Noodles
import meeTu from "../../image/meeTu.webp"; // Assuming you have an image for Mee Tu
import missFlowerHotpot from "../../image/missFlowerHotpot.webp"; // Assuming you have an image for Miss Flower Hotpot
import newDaNoodles from "../../image/newDaNoodles.webp"; // Assuming you have an image for NewDa Noodles
import nineEightk from "../../image/nineEightk.webp"; // Assuming you have an image for 98K Fried Chicken & Sandwich
import noodlesTime from "../../image/noodlesTime.webp"; // Assuming you have an image for Noodle's Time
import spiceTwentyFour from "../../image/spiceTwentyFour.webp"; // Assuming you have an image for Spice 24
import syMiniHotpot from "../../image/syMiniHotpot.webp"; // Assuming you have an image for SY Mini Hotpot
import tastyMoment from "../../image/tastyMoment.webp"; // Assuming you have an image for Tasty Moment
import wontonGuy from "../../image/wontonGuy.webp"; // Assuming you have an image for Wonton Guy
import yoDessert from "../../image/yoDessert.webp"; // Assuming you have an image for Yo Dessert
import youGarden from "../../image/youGarden.webp"; // Assuming you have an image for Shanghai You Garden

const restaurants = [
  {
    name: "Chef Ge 葛师傅私房菜",
    menu: "order.chefgetogo.com",
    image: chefImage
  },
  {
    name: "HK Alley",
    menu: "Dumplings, Noodles, Bubble Tea",
    image: hkAlley
  },
  {
    name: "Ji Bei Chuan Noodles 季北川",
    menu: "Mapo Tofu, Hotpot, Spicy Wontons",
    image: jiBeiChuan
  },{
    name: "MeeTU",
    menu: "order.chefgetogo.com",
    image: meeTu
  },
  {
    name: "Miss Flower Hotpot 花小娇金汤花胶鸡",
    menu: "Dumplings, Noodles, Bubble Tea",
    image: missFlowerHotpot
  },
  {
    name: "NewDa Noodles 牛大（兰州牛肉面",
    menu: "Mapo Tofu, Hotpot, Spicy Wontons",
    image: newDaNoodles
  },{
    name: "98K Fried Chicken & Sandwich (Edison)",
    menu: "order.chefgetogo.com",
    image: nineEightk
  },
  {
    name: "Noodle's Time 面缘",
    menu: "Dumplings, Noodles, Bubble Tea",
    image: noodlesTime
  },
  {
    name: "Spice 24",
    menu: "Mapo Tofu, Hotpot, Spicy Wontons",
    image: spiceTwentyFour
  },{
    name: "S&Y Mini HotPot 蜀世冒菜",
    menu: "order.chefgetogo.com",
    image: syMiniHotpot
  },
  {
    name: "Tasty Moment",
    menu: "Dumplings, Noodles, Bubble Tea",
    image: tastyMoment
  },
  {
    name: "Wonton Guy",
    menu: "Mapo Tofu, Hotpot, Spicy Wontons",
    image: wontonGuy
  },{
    name: "Yo Dessert",
    menu: "order.chefgetogo.com",
    image: yoDessert
  },
  {
    name: "Shanghai You Garden",
    menu: "Dumplings, Noodles, Bubble Tea",
    image: youGarden
  }
];

const RestaurantList = () => {
  return (
    <Box sx={{ padding: 2 }}>
      {restaurants.map((restaurant, index) => (
        <Box key={index}>
          <Box sx={{ display: "flex", alignItems: "flex-start", paddingY: 2 }}>
            {/* Image section (40%) */}
            <Box sx={{ flex: 0.4, maxWidth: 200, minWidth: 160, height: 140 }}>
              <img
                src={restaurant.image}
                alt={restaurant.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>

            {/* Text section (60%) */}
            <Box sx={{ flex: 0.6, paddingLeft: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  textAlign: 'left',
                  wordBreak: 'break-word',
                  fontFamily: `"Noto Sans SC", "Poppins", "Arial", "sans-serif"`,
                  fontSize: '1.1rem',
                  lineHeight: 1.4,
                }}
              >
                {restaurant.name}
              </Typography>
              {/* Optional: Add menu below */}
              {/* <Typography variant="body1">Menu: {restaurant.menu}</Typography> */}
            </Box>
          </Box>
          {index !== restaurants.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

export default RestaurantList;
