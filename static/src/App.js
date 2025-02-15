import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/homePage.js";
import RestaurantList from "./features/restaurants/restaurantList.js";
import Admin from "./features/admin/admin.js";
import OrderLookup from "./features/orders/orderLookup.js"; // Import the new component
import OrderedPage from "./features/ordered/orderedPage.js"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/ordered" element={<OrderedPage />} />
        <Route path="/lookup-order" element={<OrderLookup />} /> {/* Updated */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
