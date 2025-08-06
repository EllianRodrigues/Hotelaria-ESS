// src/pages/ChangePassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './EditPages.css';

function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id || !(user.cpf || user.cnpj)) {
      showErrorMessage('Você precisa estar logado para mudar sua senha.');
      setTimeout(() => navigate('/login-hospede'), 2000);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('A nova senha não coincide.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 3) {
        setError('A nova senha deve ter no mínimo 3 caracteres.');
        setLoading(false);
        return;
    }

    let backendUrl = '';
    let bodyData = {};

    if (user.tipo === 'hospede') {
      backendUrl = `http://localhost:3000/api/hospedes/${user.id}/password`;
      bodyData = { currentPassword, newPassword, loggedInCpf: user.cpf }; 
    } else if (user.tipo === 'hotel') {
      backendUrl = `http://localhost:3000/api/hotels/${user.id}/password`;
      bodyData = { currentPassword, newPassword, loggedInCnpj: user.cnpj }; 
    } else {
      setError('Tipo de usuário desconhecido para mudança de senha.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      showSuccessMessage('Senha atualizada com sucesso!');
      setCurrentPassword(''); 
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setError('Erro ao atualizar senha: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  };

  const showErrorMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  };

  if (!user) {
    return (
      <div className="edit-container">
        <div className="edit-card">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-container">
        <div className="edit-card">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-card">
        <div className="edit-header">
          <div className="edit-icon"></div>
          <h1>Alterar Senha</h1>
          <p>{user.tipo === 'hospede' ? 'Hóspede' : 'Hotel'} - {user.nome}</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Senha Atual</label>
            <div className="input-wrapper">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="edit-input"
              />
              <span className="input-icon"></span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="edit-input"
              />
              <span className="input-icon"></span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="edit-input"
              />
              <span className="input-icon"></span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`edit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Atualizando...
              </>
            ) : (
              'Alterar Senha'
            )}
          </button>
        </form>

        <div className="action-buttons">
          <Link to={`/editar-${user.tipo}/${user.id}`} className="action-button secondary-action">
            Editar Perfil
          </Link>
          <Link to="/" className="action-button primary-action">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;