import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
import RegisterDropdown from './RegisterDropdown';
import LoginDropdown from './LoginDropdown';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectar scroll para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon"></div>
            <span className="brand-text">Hotelaria ESS</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {user ? ( 
            <>
              {/* User Info */}
              <div className="user-info">
                <div className="user-avatar">
                  {user.tipo === 'hospede' ? '👤' : '🏢'}
                </div>
                <div className="user-details">
                  <span className="user-type">
                    {user.tipo === 'hospede' ? 'Hóspede' : 'Hotel'}
                  </span>
                  <span className="user-name">{user.nome}</span>
                </div>
              </div>
              
              {/* Navigation Links */}
              <Link 
                to="/perfil" 
                className={`nav-link ${location.pathname === '/perfil' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon"></span>
                Editar Perfil
              </Link>
              
              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-button">
                <span className="nav-icon"></span>
                Sair
              </button>
            </>
          ) : ( 
            <>
              {/* Register Dropdown */}
              <RegisterDropdown onClose={closeMobileMenu} />
              
              {/* Login Dropdown */}
              <LoginDropdown onClose={closeMobileMenu} />
              
             
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
}

export default Navbar;