// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterHospede from './pages/RegisterHospede';
import RegisterHotel from './pages/RegisterHotel';
import LoginHospede from './pages/LoginHospede';
import LoginHotel from './pages/LoginHotel';
import ProfilePage from './pages/ProfilePage';
import EditHospede from './pages/EditHospede';
import EditHotel from './pages/EditHotel';
import ChangePassword from './pages/ChangePassword'; 
import SearchResults from './pages/SearchResults';
import HotelRoomsPage from './pages/HotelRoomsPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registro-hospede" element={<RegisterHospede />} />
            <Route path="/registro-hotel" element={<RegisterHotel />} />
            <Route path="/login-hospede" element={<LoginHospede />} />
            <Route path="/login-hotel" element={<LoginHotel />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/editar-hospede/:id" element={<EditHospede />} />
            <Route path="/editar-hotel/:id" element={<EditHotel />} />
            <Route path="/alterar-senha" element={<ChangePassword />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/hotel-rooms" element={<HotelRoomsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;