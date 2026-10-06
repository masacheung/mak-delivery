import React, { useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./features/home/homePage.js";
import RestaurantList from "./features/restaurants/restaurantList.js";
import Admin from "./features/admin/admin.js";
import OrderLookup from "./features/orders/orderLookup.js"; // Import the new component
import OrderedPage from "./features/ordered/orderedPage.js"
import EditExistingOrder from "./features/editExistingOrder/editExistingOrder.js";
import PickUpLocations from "./features/Information/pick_up_location.js";
import RestaurantSupportList from "./features/Information/restaurant_list.js";
import AuthPage from "./features/auth/AuthPage.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import InstallGuide from "./features/Information/InstallGuide.js";

import { applyPwaMetadata } from './pwa';

function PwaMetadata() {
  const { pathname } = useLocation();
  useLayoutEffect(() => { applyPwaMetadata(pathname); }, [pathname]);
  return null;
}

const App = () => {
  return (
    <Router>
      <PwaMetadata />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/install-guide" element={<InstallGuide />} />
        <Route path="/pick-up-locations" element={<PickUpLocations />} />
        <Route path="/restaurant-support" element={<RestaurantSupportList />} />
        <Route path="/lookup-order" element={<OrderLookup />} /> {/* Keep public for order tracking */}
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/restaurants" 
          element={
            <ProtectedRoute>
              <RestaurantList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ordered" 
          element={
            <ProtectedRoute>
              <OrderedPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-order" 
          element={
            <ProtectedRoute>
              <EditExistingOrder />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Route */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
