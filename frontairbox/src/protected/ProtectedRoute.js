import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  // Si no hay usuario, redirige a la página de inicio
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado, renderiza los hijos
  return children;
};

export default ProtectedRoute;