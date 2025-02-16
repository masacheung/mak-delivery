import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const pickupLocations = [
  "Fort Lee 540 Main St",
  "Hackensack 99 Ranch",
  "Tenafly (165 Grove St, Tenafly, NJ 07670)",
  "Weehawken (150 Henley Place)",
  "Weehawken (9 Ave at Port Imperial)",
  "Möge Tea (2029 Lemoine Ave #102, Fort Lee, NJ 07024)",
  "Jersey City (Canopy 159 Morgan St)",
  "Jersey City (1 Shorn Ln)",
  "Jersey City (155 Bay St)",
  "JSQ (Overlook Flat)",
  "Ridgewood"
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Section - 60% */}
      <Box
        sx={{
          flex: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          麥麥送
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "80%", height: "60px", fontSize: "1.2rem" }}
          onClick={() => navigate("/restaurants")}
        >
          Order
        </Button>

        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "80%", height: "60px", fontSize: "1.2rem" }}
          onClick={() => navigate("/lookup-order")}
        >
          Look Up Order
        </Button>
      </Box>

      {/* Bottom Section - 40% */}
      <Box
        sx={{
          flex: 4,
          textAlign: "center",
          padding: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="body1">Pick-up Locations</Typography>
        <Typography variant="body2" color="textSecondary">
          {pickupLocations.map((location, index) => (
            <span key={index} style={{ display: "block" }}>{location}</span>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
