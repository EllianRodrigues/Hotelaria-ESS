// src/components/RegisterDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterDropdown.css';

function RegisterDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false); 

  return (
    <div className="dropdown"> 
      <button onClick={toggleDropdown} className="dropdown-button">
        Registrar
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/registro-hospede" onClick={closeDropdown}>Hóspede</Link>
          <Link to="/registro-hotel" onClick={closeDropdown}>Hotel</Link>
        </div>
      )}
    </div>
  );
}

export default RegisterDropdown;