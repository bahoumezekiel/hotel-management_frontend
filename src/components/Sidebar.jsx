// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // Ou '../context/AuthContext' selon votre structure
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faBuilding,
    faPlusCircle,
    faSearch,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen }) => {
    const { logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Confirmation avant déconnexion 
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            try {
                await logout();
                // Rediriger vers la page de connexion après déconnexion
                navigate('/login', { replace: true });
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
                //  afficher un message d'erreur à l'utilisateur
                alert('Une erreur est survenue lors de la déconnexion');
            }
        }
    };

    return (
        <div className={`fixed top-16 left-0 bg-gray-500 text-white w-64 h-[calc(100vh-64px)] z-30 transform transition-transform duration-300 border-r border-gray-400 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <nav className="p-4">
                <ul>
                    <li className="mb-2">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded hover:bg-gray-600 transition-colors ${
                                    isActive ? 'bg-gray-600 font-semibold text-white' : ''
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
                            Tableau de bord
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/hotels"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded hover:bg-gray-600 transition-colors ${
                                    isActive ? 'bg-gray-600 font-semibold text-white' : ''
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={faBuilding} className="mr-3" />
                            Hôtels
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/add-hotel"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded hover:bg-gray-600 transition-colors ${
                                    isActive ? 'bg-gray-600 font-semibold text-white' : ''
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-3" />
                            Ajouter un hôtel
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="flex items-center p-3 rounded hover:bg-gray-600 cursor-not-allowed text-gray-300 transition-colors"
                        >
                            <FontAwesomeIcon icon={faSearch} className="mr-3" />
                            Recherche
                        </a>
                    </li>
                </ul>
                
                <div className="mt-8 pt-4 border-t border-gray-400">
                    <button 
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full flex items-center p-3 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                        {loading ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;