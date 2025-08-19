// src/components/Layout.jsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    // Menu ouvert par défaut
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />
            
            {/* Contenu principal avec adaptation dynamique */}
            <main 
                className={`pt-20 px-6 pb-6 transition-all duration-300 ${
                    sidebarOpen ? 'ml-64' : 'ml-0'
                }`}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;