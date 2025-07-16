import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  if (!auth.user) {
    // Giriş yapılmamışsa giriş sayfasına yönlendir
    return <Navigate to="/giris" />;
  }
  if (!auth.user.isAdmin) {
    // Admin değilse ana sayfaya yönlendir
    return <Navigate to="/" />;
  }
  return children;
};

export default AdminRoute;
