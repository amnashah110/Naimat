import React from 'react';
import ReactDOM from 'react-dom/client'; // updated import
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AppRoutes from './Routes';
import { UserProvider } from './context/UserContext';

// createRoot replaces ReactDOM.render in React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </Router>
  </React.StrictMode>
);
