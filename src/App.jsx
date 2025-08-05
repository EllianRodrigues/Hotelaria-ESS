import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/dashboard/HomePage';
import FavoritosPage from './pages/favoritos/FavoritosPage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
          <Route path="/anuncios" element={<HomePage />} />
          <Route path="/perfil" element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Perfil do Usuário</h1>
              <p className="text-gray-600">Página de perfil em desenvolvimento...</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 