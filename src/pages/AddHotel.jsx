import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addHotel } from '../api/hotelApi';
import SuccessModal from '../components/SuccessModal';

const AddHotel = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ville, setVille] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setModal({ 
                    isOpen: true, 
                    title: 'Erreur', 
                    message: 'La taille de l\'image ne doit pas dépasser 5MB' 
                });
                return;
            }
            
            // Vérifier le type de fichier
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setModal({ 
                    isOpen: true, 
                    title: 'Erreur', 
                    message: 'Seuls les fichiers JPG, JPEG et PNG sont autorisés' 
                });
                return;
            }
            
            console.log('Image sélectionnée:', file.name, file.size, file.type);
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        
        console.log('=== SOUMISSION FORMULAIRE ADDHOTEL ===');
        console.log('Données du formulaire:', {
            name: name.trim(),
            description: description.trim(),
            ville: ville.trim(),
            hasImage: !!image,
            imageName: image?.name
        });
        
        // Validation des champs
        if (!name.trim()) {
            setModal({ isOpen: true, title: 'Erreur', message: 'Le nom de l\'hôtel est requis' });
            setIsUploading(false);
            return;
        }
        
        if (!description.trim()) {
            setModal({ isOpen: true, title: 'Erreur', message: 'La description est requise' });
            setIsUploading(false);
            return;
        }

        if (!ville.trim()) {
            setModal({ isOpen: true, title: 'Erreur', message: 'La ville est requise' });
            setIsUploading(false);
            return;
        }
        
        if (!image) {
            setModal({ isOpen: true, title: 'Erreur', message: 'Veuillez sélectionner une image' });
            setIsUploading(false);
            return;
        }
        
        try {
            // Préparer les données avec tous les champs requis
            const hotelData = {
                name: name.trim(),
                description: description.trim(),
                ville: ville.trim(),  
                image: image
            };
            
            console.log('Données à envoyer à l\'API:', hotelData);
            
            const result = await addHotel(hotelData);
            console.log('Résultat de l\'ajout:', result);
            
            setModal({ 
                isOpen: true, 
                title: 'Succès', 
                message: 'Hôtel ajouté avec succès!' 
            });
            
            // Réinitialiser le formulaire
            setName('');
            setDescription('');
            setVille('');
            setImage(null);
            setImagePreview('');
            
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            const errorMessage = error.message || 'Échec de l\'ajout de l\'hôtel. Veuillez réessayer.';
            setModal({ isOpen: true, title: 'Erreur', message: errorMessage });
        } finally {
            setIsUploading(false);
        }
    };

    const closeModal = () => {
        setModal({ isOpen: false, title: '', message: '' });
        if (modal.title === 'Succès') {
            navigate('/hotels');
        }
    };

    return (
        <div id="add-hotel-section" className="fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Ajouter un nouvel hôtel</h2>
                <button 
                    onClick={() => navigate('/hotels')} 
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                    <i className="fas fa-arrow-left mr-2"></i> Retour à la liste
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Section debug temporaire - À retirer en production */}
                <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
                    <strong>Debug - Valeurs actuelles :</strong>
                    <br />Nom: "{name}"
                    <br />Ville: "{ville}"
                    <br />Description: "{description.substring(0, 50)}{description.length > 50 ? '...' : ''}"
                    <br />Image: {image ? `${image.name} (${Math.round(image.size / 1024)}KB)` : 'Aucune'}
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="hotel-name" className="block text-gray-700 font-medium mb-2">
                            Nom de l'hôtel *
                        </label>
                        <input 
                            type="text" 
                            id="hotel-name" 
                            value={name} 
                            onChange={(e) => {
                                console.log('Changement nom:', e.target.value);
                                setName(e.target.value);
                            }} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Entrez le nom de l'hôtel"
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="hotel-ville" className="block text-gray-700 font-medium mb-2">
                            Ville de l'hôtel *
                        </label>
                        <input 
                            type="text" 
                            id="hotel-ville" 
                            value={ville} 
                            onChange={(e) => {
                                console.log('Changement ville:', e.target.value);
                                setVille(e.target.value);
                            }} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Ex: Paris, Lyon, Marseille..."
                            required 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="hotel-description" className="block text-gray-700 font-medium mb-2">
                            Description *
                        </label>
                        <textarea 
                            id="hotel-description" 
                            rows="4" 
                            value={description} 
                            onChange={(e) => {
                                console.log('Changement description:', e.target.value.substring(0, 50) + '...');
                                setDescription(e.target.value);
                            }} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Décrivez l'hôtel..."
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="hotel-image" className="block text-gray-700 font-medium mb-2">
                            Image * (JPG, JPEG, PNG - max 5MB)
                        </label>
                        <input 
                            type="file" 
                            id="hotel-image" 
                            accept="image/jpeg, image/jpg, image/png" 
                            onChange={handleImageChange} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
                    
                    <div className="flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/hotels')}
                            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={isUploading}
                            className={`bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                isUploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isUploading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    En cours...
                                </span>
                            ) : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
            
            <SuccessModal 
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
};

export default AddHotel;