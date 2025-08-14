import React from 'react';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-2 ${title === 'Erreur' ? 'text-red-600' : 'text-green-600'}`}>
                        {title}
                    </h3>
                    <p className="text-gray-700 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className={`py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            title === 'Erreur' 
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        } text-white transition`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;