import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // Implement your authentication logic here
  return true; // Set this according to your authentication logic
};

const PrivateRoute = ({ component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
