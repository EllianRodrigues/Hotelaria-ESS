// src/components/RegisterDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterDropdown.css';

function RegisterDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  // O closeDropdown será chamado apenas ao clicar em uma opção
  const closeDropdown = () => setIsOpen(false); 

  return (
    // Removido o onMouseLeave do div pai
    <div className="dropdown"> 
      <button onClick={toggleDropdown} className="dropdown-button">
        Registrar
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {/* closeDropdown é chamado ao clicar em qualquer Link dentro do dropdown */}
          <Link to="/registro-hospede" onClick={closeDropdown}>Hóspede</Link>
          <Link to="/registro-hotel" onClick={closeDropdown}>Hotel</Link>
        </div>
      )}
    </div>
  );
}

export default RegisterDropdown;