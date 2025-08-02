import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
import RegisterDropdown from './RegisterDropdown';
import LoginDropdown from './LoginDropdown';
import RoomSearchModal from './RoomSearchModal';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoomSearchModalOpen, setIsRoomSearchModalOpen] = useState(false);

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

  const openRoomSearchModal = () => {
    setIsRoomSearchModalOpen(true);
    closeMobileMenu();
  };

  const closeRoomSearchModal = () => {
    setIsRoomSearchModalOpen(false);
  };

  const handleRoomSearch = (searchData) => {
    // Função para loggar as informações da pesquisa
    logSearchData(searchData);
    
    // Navegar para a página de resultados com os dados
    navigate('/search-results', { state: { searchData } });
  };

  // Função para loggar os dados da pesquisa
  const logSearchData = (data) => {
    console.log('=== DADOS DA PESQUISA DE QUARTOS ===');
    console.log('Cidade:', data.city);
    console.log('Número de adultos:', data.n_of_adults);
    console.log('Data de início:', data.start_date);
    console.log('Data de fim:', data.end_date);
    console.log('Data e hora da pesquisa:', new Date().toLocaleString('pt-BR'));
    console.log('Usuário logado:', user ? `${user.nome} (${user.tipo})` : 'Não logado');
    console.log('=====================================');
    
    // Aqui você pode adicionar mais lógica como:
    // - Salvar no localStorage
    // - Enviar para uma API
    // - Salvar no histórico de pesquisas
    // - Analytics/tracking
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
              <button 
                className="nav-link"
                onClick={openRoomSearchModal}
              >
                <span className="nav-icon"></span>
                Pesquisar Quartos
              </button>
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

      {/* Room Search Modal */}
      <RoomSearchModal
        isOpen={isRoomSearchModalOpen}
        onClose={closeRoomSearchModal}
        onSearch={handleRoomSearch}
      />
    </nav>
  );
}

export default Navbar;