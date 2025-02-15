// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18+
import App from './App'; // Adjust this path if your App component is elsewhere
import { Provider } from 'react-redux'; // Import the Provider
import store from './redux/store'; // Import the Redux store

// For React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));  // Create root using ReactDOM.createRoot
root.render(
  <Provider store={store}>  {/* Wrap your App with the Provider */}
    <App />
  </Provider>
);
