// src/pages/HotelDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../api/hotelApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faHotel, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
        setError(null);
      } catch (err) {
        console.error('Erreur API:', err);
        setError('Erreur lors de la récupération de l\'hôtel.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotel();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Chargement des détails de l'hôtel...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faInfoCircle} className="text-red-500 mr-3" />
              <h2 className="text-lg font-semibold text-red-700">Erreur</h2>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/hotels')}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour à la liste
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faHotel} className="text-yellow-500 mr-3" />
              <h2 className="text-lg font-semibold text-yellow-700">Hôtel introuvable</h2>
            </div>
            <p className="text-yellow-600 mb-4">L'hôtel demandé n'existe pas ou a été supprimé.</p>
            <button 
              onClick={() => navigate('/hotels')}
              className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour à la liste
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/hotels')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Retour à la liste des hôtels
          </button>
          
          <button
            onClick={() => navigate(`/edit-hotel/${hotel._id}`)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Modifier cet hôtel
          </button>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image de l'hôtel */}
          <div className="relative">
            <img
              src={hotel.imageUrl || 'https://via.placeholder.com/800x400?text=Aucune+image'}
              alt={hotel.name}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations principales */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-blue-600" />
                  Informations générales
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nom de l'hôtel</label>
                    <p className="text-lg text-gray-800">{hotel.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Identifiant</label>
                    <p className="text-sm text-gray-500 font-mono">{hotel._id}</p>
                  </div>
                  
                  {hotel.location && (
                    <div>
                      <label className=" text-sm font-medium text-gray-600 flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        Localisation
                      </label>
                      <p className="text-gray-800">{hotel.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {hotel.description || 'Aucune description disponible.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Métadonnées */}
            {(hotel.createdAt || hotel.updatedAt) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Métadonnées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {hotel.createdAt && (
                    <div>
                      <span className="font-medium">Créé le :</span>
                      <span className="ml-2">{new Date(hotel.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {hotel.updatedAt && (
                    <div>
                      <span className="font-medium">Dernière modification :</span>
                      <span className="ml-2">{new Date(hotel.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => navigate(`/edit-hotel/${hotel._id}`)}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Modifier
              </button>
              
              <button
                onClick={() => navigate('/hotels')}
                className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HotelDetail;