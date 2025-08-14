import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/useAuth";

const PublicRoute = ({ children, redirectTo = '/' }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // Afficher un loading pendant la vérification
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (isLoggedIn) {
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Afficher le composant public si non connecté
  return children;
};

export default PublicRoute;