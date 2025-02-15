// src/features/dishes/dishSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state: assume that dishes come from a restaurant object
const initialState = {
  quantities: {}, // Stores quantities for each dish, e.g., { 1: 2, 2: 3 }
};

const dishSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    // Action to update quantity of a dish
    updateQuantity: (state, action) => {
      const { dishId, quantity } = action.payload;
      if (quantity >= 0 && quantity <= 10) {
        state.quantities[dishId] = quantity;
      }
    },
    // Action to reset quantities for a restaurant (for form reset)
    resetQuantities: (state) => {
      state.quantities = {};
    },
  },
});

export const { updateQuantity, resetQuantities } = dishSlice.actions;
export default dishSlice.reducer;
