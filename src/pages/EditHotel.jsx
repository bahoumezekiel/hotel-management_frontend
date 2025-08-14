// src/pages/EditHotel.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, updateHotel } from '../api/hotelApi';
import Layout from '../components/Layout';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState({
    name: '',
    description: '',
    ville: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Charger les infos de l'hôtel
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        console.log('=== CHARGEMENT HOTEL ===');
        console.log('ID récupéré:', id);
        
        const data = await getHotelById(id);
        console.log('Données reçues de l\'API:', data);
        
        setHotelData({
          name: data.name || '',
          description: data.description || '',
          ville: data.ville || '',
          image: null, // on ne remplit pas le fichier image ici
          currentImageUrl: data.imageUrl || null, // pour afficher l'image actuelle
        });
        
        console.log('État hotelData mis à jour:', {
          name: data.name || '',
          description: data.description || '',
          ville: data.ville || '',
          currentImageUrl: data.imageUrl || null,
        });
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Erreur lors du chargement de l\'hôtel');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchHotel();
    }
  }, [id]);

  // Gestion des champs formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    console.log(`Changement détecté - ${name}:`, name === 'image' ? files[0] : value);
    
    if (name === 'image') {
      setHotelData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setHotelData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Soumettre le formulaire - MISE À JOUR
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      console.log('=== SOUMISSION FORMULAIRE ===');
      console.log('État hotelData avant envoi:', {
        name: hotelData.name,
        description: hotelData.description,
        ville: hotelData.ville,
        hasImage: !!hotelData.image,
        imageName: hotelData.image?.name
      });

      // OPTION 1: Passer un objet simple (recommandé)
      const updateData = {
        name: hotelData.name,
        description: hotelData.description,
        ville: hotelData.ville,
      };
      
      // Ajouter l'image seulement si elle existe
      if (hotelData.image) {
        updateData.image = hotelData.image;
      }

      console.log('Données à envoyer:', updateData);

      // Appel API
      const result = await updateHotel(id, updateData);
      console.log('Résultat de la mise à jour:', result);

      alert('Hôtel mis à jour avec succès');
      navigate('/hotels');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4">Chargement des données de l'hôtel...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => navigate('/hotels')}
              className="mt-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Modifier l'hôtel</h1>
          
          {/* Debug : afficher les valeurs actuelles */}
          <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
            <strong>Debug - Valeurs actuelles :</strong>
            <br />Nom: {hotelData.name}
            <br />Ville: {hotelData.ville}
            <br />Description: {hotelData.description?.substring(0, 50)}...
            <br />Image actuelle: {hotelData.currentImageUrl ? 'Oui' : 'Non'}
            <br />Nouvelle image: {hotelData.image ? hotelData.image.name : 'Non'}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700" htmlFor="name">
                Nom de l'hôtel
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={hotelData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Entrez le nom de l'hôtel"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700" htmlFor="ville">
                Ville de l'hôtel
              </label>
              <input
                type="text"
                id="ville"
                name="ville"
                value={hotelData.ville}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Entrez la ville de l'hôtel"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={hotelData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                required
                placeholder="Décrivez l'hôtel"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700" htmlFor="image">
                Image de l'hôtel
              </label>
              
              {hotelData.currentImageUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Image actuelle :</p>
                  <img
                    src={hotelData.currentImageUrl}
                    alt="Image actuelle"
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Laissez vide pour conserver l'image actuelle
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {submitting ? 'Mise à jour...' : 'Mettre à jour l\'hôtel'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/hotels')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditHotel;