import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Certifique-se que o .jsx está correto
import RegisterDropdown from './RegisterDropdown';
import LoginDropdown from './LoginDropdown';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); // Obtém o estado do usuário e a função de logout do contexto de autenticação
  const navigate = useNavigate(); // Hook para navegação programática

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    logout(); // Chama a função de logout fornecida pelo AuthContext
    navigate('/'); // Redireciona o usuário para a página inicial após o logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Início</Link> {/* Link para a página inicial */}
      </div>
      <div className="navbar-links">
        {user ? ( // Renderização condicional: Se 'user' existe (usuário está logado)
          <>
            <span className="navbar-user-info">
              {/* Exibe o tipo de usuário e o nome */}
              {user.tipo === 'hospede' ? 'Hóspede: ' : 'Hotel: '}
              <strong>{user.nome}</strong>
            </span>
            {/* Link para a página de edição de perfil, visível apenas quando logado */}
            <Link to="/perfil">Editar Perfil</Link> 
            {/* Botão de sair, visível apenas quando logado */}
            <button onClick={handleLogout} className="navbar-button">Sair</button>
          </>
        ) : ( // Se 'user' não existe (usuário não está logado)
          <>
            {/* Componente de dropdown para opções de registro */}
            <RegisterDropdown /> 
            {/* Componente de dropdown para opções de login */}
            <LoginDropdown /> 
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;