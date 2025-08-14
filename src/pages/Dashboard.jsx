import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels, addHotel } from '../api/hotelApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faPlus, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';

const Dashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const hotelsData = await getHotels();
                if (Array.isArray(hotelsData)) {
                    setHotels(hotelsData);
                } else {
                    setError("Format de données invalide reçu du serveur");
                    setHotels([]);
                }
            } catch (err) {
                setError('Erreur lors de la récupération des hôtels: ' + err.message);
                console.error('Erreur API:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const hotelsCount = hotels.length;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fonction pour rafraîchir la liste des hôtels après ajout
    const refreshHotels = async () => {
        try {
            const hotelsData = await getHotels();
            if (Array.isArray(hotelsData)) {
                setHotels(hotelsData);
            }
        } catch (err) {
            console.error('Erreur lors du rafraîchissement:', err);
        }
    };

    const HotelCard = ({ hotel }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <img 
                src={hotel.imageUrl || 'https://via.placeholder.com/300x200'} 
                alt={hotel.name} 
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h4 className="font-bold text-lg mb-1">{hotel.name}</h4>
                <p className="text-gray-600 text-sm mb-2 truncate">{hotel.ville}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>ID: {hotel._id}</span>
                    <button 
                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors"
                    >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        Voir
                    </button>
                </div>
            </div>
        </div>
    );

    // Composant Modal pour le formulaire d'ajout d'hôtel harmonisé avec AddHotel.js
    const AddHotelModal = () => {
        const [formData, setFormData] = useState({
            name: '',
            ville: '',
            description: '',
            image: null
        });
        const [imagePreview, setImagePreview] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [submitError, setSubmitError] = useState(null);

        const handleChange = (e) => {
            const { name, value } = e.target;
            console.log(`Changement ${name}:`, value);
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Vérifier la taille du fichier (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setSubmitError('La taille de l\'image ne doit pas dépasser 5MB');
                    return;
                }
                
                // Vérifier le type de fichier
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    setSubmitError('Seuls les fichiers JPG, JPEG et PNG sont autorisés');
                    return;
                }
                
                console.log('Image sélectionnée:', file.name, file.size, file.type);
                setFormData(prev => ({ ...prev, image: file }));
                setImagePreview(URL.createObjectURL(file));
                setSubmitError(null);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setSubmitError(null);

            console.log('=== SOUMISSION FORMULAIRE MODAL ===');
            console.log('Données du formulaire:', {
                name: formData.name.trim(),
                description: formData.description.trim(),
                ville: formData.ville.trim(),
                hasImage: !!formData.image,
                imageName: formData.image?.name
            });

            // Validation des champs (même logique que AddHotel.js)
            if (!formData.name.trim()) {
                setSubmitError('Le nom de l\'hôtel est requis');
                setIsSubmitting(false);
                return;
            }
            
            if (!formData.description.trim()) {
                setSubmitError('La description est requise');
                setIsSubmitting(false);
                return;
            }

            if (!formData.ville.trim()) {
                setSubmitError('La ville est requise');
                setIsSubmitting(false);
                return;
            }
            
            if (!formData.image) {
                setSubmitError('Veuillez sélectionner une image');
                setIsSubmitting(false);
                return;
            }

            try {
                // Utiliser la même structure de données que AddHotel.js
                const hotelData = {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    ville: formData.ville.trim(),
                    image: formData.image
                };
                
                console.log('Données à envoyer à l\'API:', hotelData);
                
                const result = await addHotel(hotelData);
                console.log('Résultat de l\'ajout:', result);
                
                // Fermer le modal et rafraîchir la liste
                closeModal();
                await refreshHotels();
                
                // Réinitialiser le formulaire
                setFormData({
                    name: '',
                    ville: '',
                    description: '',
                    image: null
                });
                setImagePreview('');
                
            } catch (err) {
                console.error('Erreur lors de l\'ajout:', err);
                const errorMessage = err.message || 'Échec de l\'ajout de l\'hôtel. Veuillez réessayer.';
                setSubmitError(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        };

        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    {/* Header du modal */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">Ajouter un hôtel</h3>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>

                    {/* Contenu du modal */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {submitError && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                                {submitError}
                            </div>
                        )}



                        {/* Nom de l'hôtel */}
                        <div>
                            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom de l'hôtel *
                            </label>
                            <input
                                type="text"
                                id="modal-name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Entrez le nom de l'hôtel"
                            />
                        </div>

                        {/* Ville */}
                        <div>
                            <label htmlFor="modal-ville" className="block text-sm font-medium text-gray-700 mb-1">
                                Ville *
                            </label>
                            <input
                                type="text"
                                id="modal-ville"
                                name="ville"
                                required
                                value={formData.ville}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Ex: BOBO, OUAGA, KOUDOUGOU..."
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="modal-description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                id="modal-description"
                                name="description"
                                rows="3"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                placeholder="Décrivez l'hôtel..."
                            />
                        </div>

                        {/* Upload d'image - même logique que AddHotel.js */}
                        <div>
                            <label htmlFor="modal-image" className="block text-sm font-medium text-gray-700 mb-1">
                                Image * (JPG, JPEG, PNG - max 5MB)
                            </label>
                            <input
                                type="file"
                                id="modal-image"
                                accept="image/jpeg, image/jpg, image/png"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">Aperçu de l'image:</p>
                                    <img 
                                        src={imagePreview} 
                                        alt="Aperçu de l'image" 
                                        className="max-w-xs rounded-lg border border-gray-300" 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        En cours...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        Ajouter
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div id="dashboard-section" className="fade-in">
                {/* Header du dashboard avec espacement approprié */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
                    <button
                        onClick={openModal}
                        className="bg-white text-black py-2 px-4 rounded-lg flex items-center hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border border-gray-300"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Ajouter un hôtel
                    </button>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-200">
                        <div className="text-4xl text-blue-600 mr-4">
                            <FontAwesomeIcon icon={faHotel} />
                        </div>
                        <div>
                            <p className="text-lg text-gray-500">Total Hôtels</p>
                            <h3 className="text-3xl font-bold text-gray-800">{hotelsCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Section des hôtels */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Tous les hôtels</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {hotelsCount} hôtels
                        </span>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-gray-500 mt-2">Chargement des hôtels...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>
                        </div>
                    ) : hotels.length === 0 ? (
                        <div className="text-center py-12">
                            <FontAwesomeIcon icon={faHotel} className="text-4xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">Aucun hôtel trouvé.</p>
                            <button
                                onClick={openModal}
                                className="mt-4 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
                            >
                                Ajouter votre premier hôtel
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotels.map(hotel => (
                                <HotelCard key={hotel._id} hotel={hotel} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal d'ajout d'hôtel */}
                <AddHotelModal />
            </div>
        </Layout>
    );
};

export default Dashboard;