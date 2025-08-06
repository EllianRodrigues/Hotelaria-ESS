// src/components/RegisterDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterDropdown.css';

function RegisterDropdown({ onClose }) {
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
        Registrar
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/registro-hospede" onClick={closeDropdown} className="dropdown-link">
            <span className="link-icon"></span>
            Hóspede
          </Link>
          <Link to="/registro-hotel" onClick={closeDropdown} className="dropdown-link">
            <span className="link-icon"></span>
            Hotel
          </Link>
        </div>
      )}
    </div>
  );
}

export default RegisterDropdown;