// src/components/LoginDropdown.jsx
// src/components/LoginDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginDropdown.css';

function LoginDropdown({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const closeDropdown = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-button">
        <span className="dropdown-icon"></span>
        Entrar
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/login-hospede" onClick={closeDropdown} className="dropdown-link">
            <span className="link-icon">👤</span>
            Hóspede
          </Link>
          <Link to="/login-hotel" onClick={closeDropdown} className="dropdown-link">
            <span className="link-icon">🏨</span>
            Hotel
          </Link>
          
          {/* Adição da seção de Admin */}
          <div className="dropdown-divider"></div>
          <Link to="/login-admin" onClick={closeDropdown} className="dropdown-link admin-link">
            <span className="link-icon">👑</span>
            Admin
          </Link>
        </div>
      )}
    </div>
  );
}

export default LoginDropdown;