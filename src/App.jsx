import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Composants d'authentification
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Composants principaux
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import HotelsList from './pages/HotelsList';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';
import HotelDetail from './pages/HotelDetail';

// Composant principal de l'application (avec layout)
const AppLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 overflow-auto">
                <Header toggleSidebar={toggleSidebar} />
                <main className="p-4 md:p-6">
                    <Routes>
                        {/* Routes protégées */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/hotels" element={
                            <ProtectedRoute>
                                <HotelsList />
                            </ProtectedRoute>
                        } />
                        <Route path="/add-hotel" element={
                            <ProtectedRoute>
                                <AddHotel />
                            </ProtectedRoute>
                        } />
                        <Route path="/edit-hotel/:id" element={
                            <ProtectedRoute>
                                <EditHotel />
                            </ProtectedRoute>
                        } />
                        <Route path="/hotels/:id" element={
                            <ProtectedRoute>
                                <HotelDetail />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

// Composant principal de l'application
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes publiques (authentification) */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/signup" element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    } />
                    <Route path="/forgot-password" element={
                        <PublicRoute>
                            <ForgotPassword />
                        </PublicRoute>
                    } />
                    <Route path="/reset-password/:token" element={
                        <PublicRoute>
                            <ResetPassword />
                        </PublicRoute>
                    } />
                    
                    {/* Routes avec layout principal */}
                    <Route path="/*" element={<AppLayout />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;