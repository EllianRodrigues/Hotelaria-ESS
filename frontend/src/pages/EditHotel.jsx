// src/pages/EditHotel.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext.jsx';
import './EditPages.css';

function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const backendUrl = `http://localhost:3000/api/hotels/${id}`;

  useEffect(() => {
    if (!user || user.tipo !== 'hotel' || !user.id || !user.cnpj) {
      showErrorMessage('Acesso negado. Faça login como hotel para editar seu perfil.');
      setTimeout(() => navigate('/login-hotel'), 2000);
      return;
    }

    const fetchHotelData = async () => {
      try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (String(data.id) !== String(user.id) || data.cnpj !== user.cnpj) {
          showErrorMessage('Você não tem permissão para editar este perfil.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        setFormData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do hotel:', err);
        setError('Erro ao carregar dados do hotel. Verifique sua conexão ou se o perfil existe.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id, backendUrl, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user || user.tipo !== 'hotel' || String(user.id) !== String(id)) {
      showErrorMessage('Erro de autorização. Recarregue a página e tente novamente.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, loggedInCnpj: user.cnpj }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = { ...user, ...formData };
      login(updatedUser);

      showSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Erro ao atualizar hotel:', err);
      showErrorMessage('Erro ao atualizar perfil: ' + err.message);
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return (
      <div className="edit-container">
        <div className="edit-card">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando dados do hotel...</p>
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

  if (!formData.id && !loading) {
    return (
      <div className="edit-container">
        <div className="edit-card">
          <div className="not-found-state">
            <p>Hotel não encontrado ou acesso não autorizado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-card">
        <div className="edit-header">
          <div className="edit-icon">🏢</div>
          <h1>Editar Perfil</h1>
          <p>Atualize as informações do hotel</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="nome">Nome do Hotel</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite o nome do hotel"
                value={formData.nome || ''}
                onChange={handleChange}
                required
                className="edit-input"
              />
              <span className="input-icon"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite o email do hotel"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="edit-input"
              />
              <span className="input-icon"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cnpj">CNPJ</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                placeholder="Digite o CNPJ do hotel"
                value={formData.cnpj || ''}
                onChange={handleChange}
                required
                className="edit-input"
              />
              <span className="input-icon"></span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`edit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Atualizando...
              </>
            ) : (
              'Atualizar Perfil'
            )}
          </button>
        </form>

        <div className="action-buttons">
          <Link to="/alterar-senha" className="action-button secondary-action">
            Alterar Senha
          </Link>
          <Link to="/" className="action-button primary-action">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditHotel;