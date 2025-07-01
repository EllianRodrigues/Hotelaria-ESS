// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterHospede from './pages/RegisterHospede';
import RegisterHotel from './pages/RegisterHotel';
import './App.css'; // Mantenha seus estilos globais

function App() {
  return (
    <Router>
      {/* Navbar sempre visível em todas as rotas */}
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registro-hospede" element={<RegisterHospede />} />
          <Route path="/registro-hotel" element={<RegisterHotel />} />
          {/* Rotas de Login e Edição serão adicionadas no futuro */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;