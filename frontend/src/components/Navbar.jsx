// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterDropdown from './RegisterDropdown';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Início</Link>
      </div>
      <div className="navbar-links">
        <RegisterDropdown />
      </div>
    </nav>
  );
}

export default Navbar;