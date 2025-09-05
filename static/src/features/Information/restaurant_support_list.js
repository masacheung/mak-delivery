import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  Home as HomeIcon,
  Event as EventIcon,
  DensityMedium as DensityMediumIcon,
  Store as StoreIcon,
  MenuBook as MenuBookIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";
import MoreMenu from "../headerSection/menu/more";

// Import restaurant images
import chefImage from "../../image/chef.webp";
import hkAlley from "../../image/hk_alley.webp";
import jiBeiChuan from "../../image/jiBeiChuan.webp";
import meeTu from "../../image/meeTu.webp";
import missFlowerHotpot from "../../image/missFlowerHotpot.webp";
import newDaNoodles from "../../image/newDaNoodles.webp";
import nineEightk from "../../image/nineEightk.webp";
import noodlesTime from "../../image/noodlesTime.webp";
import spiceTwentyFour from "../../image/spiceTwentyFour.webp";
import syMiniHotpot from "../../image/syMiniHotpot.webp";
import tastyMoment from "../../image/tastyMoment.webp";
import wontonGuy from "../../image/wontonGuy.webp";
import yoDessert from "../../image/yoDessert.webp";
import youGarden from "../../image/youGarden.webp";

const restaurants = [
  {
    name: "葛师傅私房菜",
    englishName: "Chef Ge ",
    menu: "https://order.chefgetogo.com/order/main",
    image: chefImage,
    cuisine: "Chinese Cuisine",
    specialty: "Sichuan Cuisine",
    description: ""
  },
  {
    name: "港茶巷",
    englishName: "HK Alley",
    menu: "",
    image: hkAlley,
    cuisine: "Hong Kong Style cafe",
    specialty: "Hong Kong Milktea, Bake rice & Pineapple Bun",
    description: "Hong Kong–style diner serving a mix of Chinese and Western comfort food"
  },
  {
    name: "季北川",
    englishName: "Ji Bei Chuan Noodles",
    menu: "https://jibeichuan.menucc.com/",
    image: jiBeiChuan,
    cuisine: "Chinese-style rice noodle soups and ramen",
    specialty: "Supreme Fish Maw Chicken Soup Rice Noodle",
    description: "Chinese-style rice noodle soups and ramen, blending traditional Chinese flavors feature a variety of broths, including fish maw chicken soup, mala spicy broth, and tom yum"
  },
  {
    name: "MeeTU",
    englishName: "MeeTU Flower & Tea",
    menu: "https://www.meetu.us/",
    image: meeTu,
    cuisine: "Drinks",
    specialty: "Coconut Teas & Fruit Teas",
    description: "specializing in a curated selection of fresh blooms, eternal blossoms, and exquisite tea blends."
  },
  {
    name: "花小娇金汤花胶鸡",
    englishName: "Miss Flower Hotpot",
    menu: "https://missflowerhotpot.shop/",
    image: missFlowerHotpot,
    cuisine: "Hotpot",
    specialty: "Chicken soup with fish maw ",
    description: "Premium hotpot with flavorful chicken soup and fresh ingredients"
  },
  {
    name: "牛大（兰州牛肉面）",
    englishName: "NewDa Noodles",
    menu: "https://order.peblla.com/newdanoodles/order?sid=1088756473349984128",
    image: newDaNoodles,
    cuisine: "Lanzhou Style",
    specialty: "authentic Lanzhou hand-pulled noodles.",
    description: "beef noodle soup, spicy noodles, and dry-tossed noodles,"
  },
  {
    name: "98K Fried Chicken & Sandwich (Edison)",
    englishName: "98K Fried Chicken",
    menu: "http://www.98kedison.com/",
    image: nineEightk,
    cuisine: "Chinese style Fried Chicken",
    specialty: "Fried Chicken",
    description: "Chinese style fried chicken and sandwiches"
  },
  {
    name: "Noodle's Time 面缘",
    englishName: "Noodle's Time",
    menu: "https://www.noodletimesedison.com/",
    image: noodlesTime,
    cuisine: "Guangxi-style Chinese noodle sou",
    specialty: "Lizhou spicy noodles (also known as river snail noodles, Luosifen",
    description: "specializes in Guangxi-style Chinese noodle soups celebrated for their harmonious blend of spicy, sour, and savory notes"
  },
  {
    name: "24 味",
    englishName: "Spice 24",
    menu: "https://order.toasttab.com/online/spice-24-edisons",
    image: spiceTwentyFour,
    cuisine: "Szechuan Chinese cuisine",
    specialty: "create-your-own stir-fry dry pot",
    description: "It offers a modern twist on classic styles with customizable stir-fry dishes and a variety of flavor bases."
  },
  {
    name: "蜀世冒菜",
    englishName: "S&Y Mini HotPot",
    menu: "http://syminihotpot.com/",
    image: syMiniHotpot,
    cuisine: "Szechuan Cuisine",
    specialty: "Spicy, sour, and numbing—typical of Sichuan hot pot",
    description: "pick ingredients and a broth base, and everything is cooked together and served in one bowl"
  },
  {
    name: "小食代",
    englishName: "Tasty Moment",
    menu: "https://dimsumedison.com/",
    image: tastyMoment,
    cuisine: "Shanghainese cuisine",
    specialty: "Soup Dumplings",
    description: "combining both the delicate flavors of Shanghai-style cooking with the classic dim sum tradition"
  },
  {
    name: "雲吞佳",
    englishName: "Wonton Guy",
    menu: "http://www.wontonguy.com/",
    image: wontonGuy,
    cuisine: "Hong Kong-style wantan mee",
    specialty: "Wonton Noodle Soup",
    description: "thin egg noodles served in a light, flavorful broth topped with generous shrimp-filled wontons and optional toppings like beef brisket or fish ball"
  },
  {
    name: "Yo Dessert",
    englishName: "Yo Dessert",
    menu: "https://yodessertus.com/",
    image: yoDessert,
    cuisine: "Yogurt",
    specialty: "Yogurt drink and Soymilk",
    description: "yogurt-based beverages with various favors and dessert"
  },
  {
    name: "Shanghai You Garden 又一村",
    englishName: "Shanghai You Garden",
    menu: "Dumplings, Noodles, Bubble Tea",
    image: youGarden,
    cuisine: "Shanghai Cuisine",
    specialty: "Shanghai Dishes",
    description: "Traditional Shanghai cuisine and specialties"
  }
];

const RestaurantSupportList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSearch = async () => {
    try {
      setError("");
      const response = await fetch("/api/adminConfig");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    handleSearch();
    const interval = setInterval(() => {
      handleSearch();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisine))];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          color: 'black',
        }}
      >
        <Toolbar>
          <IconButton 
            onClick={() => setShowMenu(true)}
            sx={{ 
              color: 'inherit',
              '&:hover': { 
                background: 'rgba(0,0,0,0.1)',
                transform: 'scale(1.1)',
              }
            }}
          >
            <DensityMediumIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease',
              }
            }}
            onClick={() => navigate("/")}
          >
            Restaurant Partners
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => navigate("/")}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <HomeIcon />
            </IconButton>
            
            <IconButton 
              onClick={() => setShowEvents(true)}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Badge 
                badgeContent={events.length > 0 ? events.length : null} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.75rem',
                    minWidth: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  }
                }}
              >
                <EventIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu */}
      {showMenu && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MoreMenu onClose={() => setShowMenu(false)} />
        </Box>
      )}

      {/* Upcoming Event */}
      {showEvents && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            {/* Hero Section */}
            <Paper
              elevation={8}
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <RestaurantIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                }}
              >
                Our Restaurant Partners
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Discover our amazing restaurant partners and their specialties
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<StoreIcon />}
                  label={`${restaurants.length} Restaurants`}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  icon={<MenuBookIcon />}
                  label={`${cuisineTypes.length} Cuisines`}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </Paper>

            {/* Restaurant Grid */}
            <Grid container spacing={3}>
              {restaurants.map((restaurant, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={restaurant.image}
                      alt={restaurant.name}
                      sx={{
                        objectFit: 'cover',
                        borderRadius: '12px 12px 0 0',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#333',
                            mb: 0.5,
                            fontSize: '1rem',
                            lineHeight: 1.3,
                            fontFamily: `"Noto Sans SC", "Poppins", "Arial", "sans-serif"`,
                          }}
                        >
                          {restaurant.name}
                        </Typography>
                        {restaurant.englishName && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.75rem',
                              fontStyle: 'italic',
                            }}
                          >
                            {restaurant.englishName}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={restaurant.cuisine}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            mb: 1,
                          }}
                        />
                        <Chip
                          label={restaurant.specialty}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            ml: 0.5,
                          }}
                        />
                      </Box>

                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {restaurant.description}
                      </Typography>

                      {restaurant.menu && restaurant.menu.includes('order.') ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LanguageIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#4CAF50',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          >
                            Online Ordering Available
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MenuBookIcon sx={{ fontSize: 16, color: '#667eea' }} />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#667eea',
                              fontSize: '0.75rem',
                            }}
                          >
                            {restaurant.menu}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Footer Info */}
            <Paper
              elevation={8}
              sx={{
                p: 4,
                mt: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
                Want to Partner With Us?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Join our growing network of restaurant partners and reach more customers
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#667eea' }} />
                <Typography variant="body2" color="text.secondary">
                  Contact us to learn more about partnership opportunities
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default RestaurantSupportList;
