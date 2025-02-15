// src/redux/rootReducer.js
import { combineReducers } from 'redux';
import restaurantReducer from '../features/restaurants/restaurantSlice.js';
import dishReducer from '../features/dishes/dishSlice.js'; // Import the dishReducer

const rootReducer = combineReducers({
  restaurants: restaurantReducer, // For restaurant-related state
  dishes: dishReducer,            // For dish-related state
  // Add other reducers as needed
});

export default rootReducer;
