import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

function LoginHotel() {
  const [formData, setFormData] = useState({ cnpj: '', senha: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const backendUrl = 'http://localhost:3000/api/auth/hotel/login';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const { user } = await response.json(); 
      login(user); 

      // Mostrar mensagem de sucesso
      showSuccessMessage('Login realizado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erro no login do hotel:', error);
      showErrorMessage('Erro no login: ' + error.message);
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
          <div className="auth-icon">🏢</div>
          <h1>Bem-vindo de volta!</h1>
          <p>Faça login para acessar sua conta de hotel</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="cnpj">CNPJ</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                placeholder="Digite seu CNPJ"
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Não tem uma conta?</p>
          <Link to="/registro-hotel" className="auth-link">
            Criar conta de hotel
          </Link>
        </div>

       

        <div className="auth-options">
          <Link to="/login-hospede" className="auth-option">
            <span className="option-icon"></span>
            Entrar como Hóspede
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

export default LoginHotel;