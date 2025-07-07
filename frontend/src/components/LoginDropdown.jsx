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
          <Link to="/login-hospede" onClick={closeDropdown}>Hóspede</Link>
          <Link to="/login-hotel" onClick={closeDropdown}>Hotel</Link>
        </div>
      )}
    </div>
  );
}

export default LoginDropdown;