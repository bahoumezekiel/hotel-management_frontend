import React, { createContext, useState, useEffect } from 'react';
import { 
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated,
  getStoredUser,
  clearAuthData,
  verifyToken
} from '../api/AuthApi';

// Créer le contexte
const AuthContext = createContext();

// Provider du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialisation : vérifier si l'utilisateur est connecté
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Vérifier d'abord le stockage local
        if (isAuthenticated()) {
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setIsLoggedIn(true);
            
            // Vérifier la validité du token côté serveur
            const isValid = await verifyToken();
            if (!isValid) {
              // Token invalide, déconnecter
              setUser(null);
              setIsLoggedIn(false);
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        setUser(null);
        setIsLoggedIn(false);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiLogin(credentials);
      
      if (response.success) {
        setUser(response.user);
        setIsLoggedIn(true);
        return response;
      } else {
        throw new Error(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await apiSignup(userData);
      
      if (response.success) {
        setUser(response.user);
        setIsLoggedIn(true);
        return response;
      } else {
        throw new Error(response.message || 'Erreur d\'inscription');
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      clearAuthData();
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUser = async () => {
    try {
      if (isAuthenticated()) {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.user);
          setIsLoggedIn(true);
          return response.user;
        }
      }
    } catch (error) {
      console.error('Erreur refresh user:', error);
      setUser(null);
      setIsLoggedIn(false);
      clearAuthData();
    }
  };

  // Valeurs du contexte
  const value = {
    // État
    user,
    loading,
    isLoggedIn,
    
    // Fonctions
    login,
    signup,
    logout,
    refreshUser,
    
    // Utilitaires
    isAuthenticated: isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;