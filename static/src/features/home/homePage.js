import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        padding: 2,
        position: "relative",
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

      {/* Contact Information */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="body1">
          Contact Us: (123) 456-7890 | info@restaurant.com
        </Typography>
        <Typography variant="body2" color="textSecondary">
          123 Food Street, Gourmet City, 98765
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
