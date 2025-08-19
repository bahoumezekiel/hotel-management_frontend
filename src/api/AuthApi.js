import axios from 'axios';

// URL de base de mon API backend
const API_URL = 'https://hotel-management-backend-1-ngaz.onrender.com/api/auth';


// Configuration axios pour inclure les cookies
axios.defaults.withCredentials = true;

// Creation d'une instance axios pour l'authentification
const authAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token aux requêtes
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Rediriger vers la page de connexion si nécessaire
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

 

// Inscription
export const signup = async (userData) => {
  try {
    const { email, password, confirmPassword } = userData;
    
    const response = await authAPI.post('/signup', {
      email,
      password,
      confirmPassword
    });

    if (response.data.success) {
      // Sauvegarder le token et les informations utilisateur
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de l\'inscription'
    );
  }
};

// Connexion
export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    const response = await authAPI.post('/login', {
      email,
      password
    });

    if (response.data.success) {
      // Sauvegarder le token et les informations utilisateur
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la connexion'
    );
  }
};

// Déconnexion
export const logout = async () => {
  try {
    const response = await authAPI.post('/logout');
    
    // Nettoyer le stockage local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    // Même en cas d'erreur, on nettoie le stockage local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la déconnexion'
    );
  }
};

// Mot de passe oublié
export const forgotPassword = async (email) => {
  try {
    const response = await authAPI.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la demande de réinitialisation'
    );
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (token, passwords) => {
  try {
    const { password, confirmPassword } = passwords;
    
    const response = await authAPI.patch(`/reset-password/${token}`, {
      password,
      confirmPassword
    });

    if (response.data.success) {
      // Sauvegarder le token et les informations utilisateur après réinitialisation
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response.data;
  } catch (error) {
    console.error('Erreur réinitialisation mot de passe:', error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la réinitialisation du mot de passe'
    );
  }
};

// Vérifier si l'utilisateur est connecté
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get('/me');
    return response.data;
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la récupération des informations utilisateur'
    );
  }
};

 

// Vérifier si l'utilisateur est connecté (côté client)
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Obtenir les informations utilisateur depuis le stockage local
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erreur parsing user:', error);
    return null;
  }
};

// Obtenir le token depuis le stockage local
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

// Nettoyer les données d'authentification
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Vérifier la validité du token (appel API)
export const verifyToken = async () => {
  try {
    const response = await getCurrentUser();
    return response.success;
  } catch (error) {
    console.error('Erreur vérification token:', error);
    clearAuthData();
    return false;
  }
};

// Export par défaut de l'instance axios configurée
export default authAPI;