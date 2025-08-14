import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message = "Êtes-vous sûr de vouloir effectuer cette action ?" }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div id="confirm-modal" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 fade-in">
                <div className="flex justify-center text-yellow-500 mb-4">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-5xl" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Confirmation</h3>
                <p className="text-gray-600 text-center mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onClose} className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;