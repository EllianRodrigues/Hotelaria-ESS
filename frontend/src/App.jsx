import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // NOVO: Importa o AuthProvider
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterHospede from './pages/RegisterHospede';
import RegisterHotel from './pages/RegisterHotel';
import LoginHospede from './pages/LoginHospede'; // NOVO: Importa LoginHospede
import LoginHotel from './pages/LoginHotel';     // NOVO: Importa LoginHotel
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider> {/* O AuthProvider envolve toda a aplicação para fornecer o contexto */}
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registro-hospede" element={<RegisterHospede />} />
            <Route path="/registro-hotel" element={<RegisterHotel />} />
            {/* NOVAS ROTAS DE LOGIN */}
            <Route path="/login-hospede" element={<LoginHospede />} />
            <Route path="/login-hotel" element={<LoginHotel />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;