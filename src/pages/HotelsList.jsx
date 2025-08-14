// src/pages/HotelsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels, deleteHotel } from '../api/hotelApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch, 
  faHotel,
  faEye,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';
import Layout from '../components/Layout';

const HotelsList = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ isOpen: false, hotelId: null });
    const navigate = useNavigate();

    const fetchHotels = async () => {
        try {
            const data = await getHotels();
            
            let hotelsArray = [];
            if (Array.isArray(data)) {
                hotelsArray = data;
            } else if (data && Array.isArray(data.hotels)) {
                hotelsArray = data.hotels;
            } else {
                throw new Error("Format de données invalide reçu du serveur");
            }

            setHotels(hotelsArray);
            setError(null);

        } catch (error) {
            setError('Erreur lors de la récupération des hôtels: ' + error.message);
            console.error('Erreur API:', error);
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleDeleteClick = (id) => {
        setModal({ isOpen: true, hotelId: id });
    };

    const confirmDelete = async () => {
        try {
            await deleteHotel(modal.hotelId);
            setHotels(prevHotels => prevHotels.filter(hotel => hotel._id !== modal.hotelId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'hôtel :', error);
            setError('Erreur lors de la suppression de l\'hôtel');
        } finally {
            setModal({ isOpen: false, hotelId: null });
        }
    };

    // ⚠️ CORRECTION : Utiliser hotel.ville au lieu de hotel.city
    const filteredHotels = hotels.filter(hotel => {
        return (
            hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.ville?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="ml-4 text-gray-600">Chargement des hôtels...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={fetchHotels}
                        className="mt-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div id="hotels-section" className="fade-in">
                {/* Header avec espacement approprié */}
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des hôtels</h2>
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher un hôtel ou une ville..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                icon={faSearch} 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                            />
                        </div>
                        <button 
                            onClick={() => navigate('/add-hotel')} 
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center shadow-md hover:shadow-lg"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
                            <span className="hidden md:inline">Ajouter un hôtel</span>
                            <span className="md:hidden">Ajouter</span>
                        </button>
                    </div>
                </div>

                {/* Tableau responsive */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hôtel
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Ville
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredHotels.length > 0 ? (
                                    filteredHotels.map(hotel => (
                                        <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                                                        {hotel.imageUrl ? (
                                                            <img 
                                                                src={hotel.imageUrl} 
                                                                alt={hotel.name} 
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                                                <FontAwesomeIcon icon={faHotel} className="text-gray-400 text-lg" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {hotel.name}
                                                        </div>
                                                        {/* Affichage de la ville sur mobile uniquement */}
                                                        <div className="text-sm text-gray-500 sm:hidden flex items-center mt-1">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-xs" />
                                                            {hotel.ville || 'Ville non renseignée'}
                                                        </div>
                                                        {/* Affichage de la description sur mobile */}
                                                        <div className="text-sm text-gray-500 lg:hidden line-clamp-2 mt-1">
                                                            {hotel.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <div className="text-sm text-gray-900 line-clamp-3 max-w-md">
                                                    {hotel.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                                                    <span className="line-clamp-1">
                                                        {hotel.ville || 'Ville non renseignée'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                                                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/edit-hotel/${hotel._id}`)}
                                                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(hotel._id)}
                                                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FontAwesomeIcon icon={faHotel} className="text-4xl mb-4 text-blue-200" />
                                                <p className="text-lg font-medium mb-1">Aucun hôtel trouvé</p>
                                                <p className="text-sm mb-4">
                                                    {searchTerm ? 
                                                        `Aucun résultat pour "${searchTerm}"` : 
                                                        "Commencez par ajouter votre premier hôtel"
                                                    }
                                                </p>
                                                {!searchTerm && (
                                                    <button 
                                                        onClick={() => navigate('/add-hotel')} 
                                                        className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                                        Ajouter un hôtel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <ConfirmModal 
                    isOpen={modal.isOpen} 
                    onClose={() => setModal({ isOpen: false, hotelId: null })}
                    onConfirm={confirmDelete}
                    message="Êtes-vous sûr de vouloir supprimer cet hôtel ? Cette action est irréversible."
                />
            </div>
        </Layout>
    );
};

export default HotelsList;