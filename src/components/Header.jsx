import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faBars, faTimes, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/useAuth';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
 
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white text-black p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40 h-16 shadow-md border-b border-gray-200">
       
      <div className="flex items-center">
        
        <button 
          onClick={toggleSidebar}
          className="text-black focus:outline-none mr-4 hover:bg-gray-100 p-2 rounded transition-colors"
        >
          <FontAwesomeIcon 
            icon={sidebarOpen ? faTimes : faBars} 
            className="text-xl" 
          />
        </button>
        
        
        <h1 className="text-xl font-bold flex items-center">
          <FontAwesomeIcon icon={faHotel} className="mr-2 text-gray-500" /> 
          Hotel Manager
        </h1>
      </div>

       
      <div className="flex items-center space-x-4">
        {/* Email utilisateur */}
        <span className="hidden md:block text-black font-medium text-sm">
          {user?.email || 'Utilisateur'}
        </span>
        
        {/* Avatar utilisateur avec point bleu */}
        <div className="relative">
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center border border-gray-400">
            <FontAwesomeIcon icon={faUser} className="text-gray-600 text-sm" />
          </div>
          {/* Point bleu pour indiquer que l'utilisateur est connecté */}
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-1 text-black hover:bg-gray-100 p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Se déconnecter"
        >
          {isLoggingOut ? (
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;