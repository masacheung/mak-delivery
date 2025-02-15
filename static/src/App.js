import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/homePage.js";
import RestaurantList from "./features/restaurants/restaurantList.js"; // Your existing component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/lookup-order" element={<div>Order Lookup Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
};

export default App;
