// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterDropdown from './RegisterDropdown';
import LoginDropdown from './LoginDropdown'; 
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Início</Link>
      </div>
      <div className="navbar-links">
        {user ? ( // Se o usuário está logado
          <>
            <span className="navbar-user-info">
              {user.tipo === 'hospede' ? 'Hóspede: ' : 'Hotel: '}
              {user.nome}
            </span>
            <button onClick={handleLogout} className="navbar-button">Sair</button>
          </>
        ) : ( // Se o usuário NÃO está logado
          <>
            <RegisterDropdown /> 
            <LoginDropdown /> 
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;