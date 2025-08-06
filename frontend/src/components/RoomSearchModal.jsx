import React, { useState } from 'react';
import './RoomSearchModal.css';

function RoomSearchModal({ isOpen, onClose, onSearch, userType = 'hospede' }) {
  const [formData, setFormData] = useState({
    city: '',
    n_of_adults: 1,
    start_date: '',
    end_date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // !
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.city && formData.start_date && formData.end_date) {
      // Log dos dados antes de enviar
      console.log('Modal: Dados do formulário enviados:', formData);
      onSearch(formData);
      onClose();
    } else {
      console.log('Modal: Formulário incompleto - campos obrigatórios não preenchidos');
    }
  };

  const handleClose = () => {
    setFormData({
      city: '',
      n_of_adults: 1,
      start_date: '',
      end_date: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{userType === 'hospede' ? 'Pesquisar Quartos' : 'Ver Quartos'}</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="city">Cidade *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Digite a cidade"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="n_of_adults">Número de Adultos</label>
            <select
              id="n_of_adults"
              name="n_of_adults"
              value={formData.n_of_adults}
              onChange={handleInputChange}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'adulto' : 'adultos'}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Data de Início *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">Data de Fim *</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {userType === 'hospede' ? 'Pesquisar' : 'Ver Quartos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomSearchModal; 