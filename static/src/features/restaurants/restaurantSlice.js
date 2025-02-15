// src/features/restaurants/restaurantSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  selectedRestaurant: null, // This will hold the currently selected restaurant
};

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    selectRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
    deselectRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
  },
});

export const { selectRestaurant, deselectRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
