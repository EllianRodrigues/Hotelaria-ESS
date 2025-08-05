// src/pages/RegisterHotel.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';

function RegisterHotel() {
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', senha: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000/api/hotels';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setFormData({ nome: '', email: '', cnpj: '', senha: '' }); 
      
      // Mostrar mensagem de sucesso
      showSuccessMessage('Conta criada com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erro ao registrar hotel:', error);
      showErrorMessage('Erro ao registrar: ' + error.message);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon"></div>
          <h1>Criar Conta de Hotel</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nome">Nome do Hotel</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite o nome do hotel"
                value={formData.nome}
                onChange={handleChange}
                required
                className="auth-input"
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
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
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
                value={formData.cnpj}
                onChange={handleChange}
                required
                className="auth-input"
              />
              <span className="input-icon"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="auth-input"
              />
              <span className="input-icon"></span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Criando conta...
              </>
            ) : (
              'Criar Conta'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Já tem uma conta?</p>
          <Link to="/login-hotel" className="auth-link">
            Fazer login
          </Link>
        </div>

        <div className="auth-options">
          <Link to="/registro-hospede" className="auth-option">
            <span className="option-icon"></span>
            Criar conta de Hóspede
          </Link>
          {/* <Link to="/" className="auth-option">
            <span className="option-icon"></span>
            Voltar ao Início
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default RegisterHotel;