import axios from 'axios';

// URL de base de ton API backend
const API_URL = 'http://localhost:3000/api/hotels';

// Obtenir tous les hôtels
export const getHotels = async () => {
    try {
        const response = await axios.get(API_URL);
        // Normaliser la réponse pour retourner un tableau d'hôtels
        if (response.data.hotels && Array.isArray(response.data.hotels)) {
            return response.data.hotels;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération des hôtels :', error);
        return [];
    }
};

// Obtenir un hôtel par son ID
export const getHotelById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        // Retourner l'objet hôtel directement
        return response.data.hotel || response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'hôtel avec l'ID ${id} :`, error);
        throw error;
    }
};

// Ajouter un nouvel hôtel
export const addHotel = async (hotelData) => {
    try {
        const formData = new FormData();
        
        // Ajouter tous les champs requis
        Object.keys(hotelData).forEach(key => {
            if (key === 'image' && hotelData[key] instanceof File) {
                formData.append('image', hotelData[key]);
            } else if (key !== 'image') {
                formData.append(key, hotelData[key]);
            }
        });

        const response = await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'hôtel :', error);
        throw new Error(error.response?.data?.message || 'Échec de l\'ajout de l\'hôtel');
    }
};

// Modifier un hôtel existant
export const updateHotel = async (id, hotelData) => {
    try {
        const formData = new FormData();
        
        // Ajouter tous les champs modifiés
        Object.keys(hotelData).forEach(key => {
            if (key === 'image' && hotelData[key] instanceof File) {
                formData.append('image', hotelData[key]);
            } else if (key !== 'image') {
                formData.append(key, hotelData[key]);
            }
        });

        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la modification de l'hôtel avec l'ID ${id} :`, error);
        throw new Error(error.response?.data?.message || 'Échec de la modification de l\'hôtel');
    }
};

// Supprimer un hôtel
export const deleteHotel = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'hôtel avec l'ID ${id} :`, error);
        throw error;
    }
};