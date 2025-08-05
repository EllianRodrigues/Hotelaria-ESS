// src/components/LoginDropdown.jsx
// src/components/LoginDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginDropdown.css'; 

function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false); 

  return (
    <div className="dropdown" > 
      <button onClick={toggleDropdown} className="dropdown-button">
        Login
      </button>
      {isOpen && (
        <div className="dropdown-content">
<<<<<<< Updated upstream
          <Link to="/login-hospede" onClick={closeDropdown}>Hóspede</Link>
          <Link to="/login-hotel" onClick={closeDropdown}>Hotel</Link>
=======
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
>>>>>>> Stashed changes
        </div>
      )}
    </div>
  );
}

export default LoginDropdown;