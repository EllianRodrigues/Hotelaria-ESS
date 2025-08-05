import React, { useState } from 'react';
import './AddRoomModal.css';

function AddRoomModal({ isOpen, onClose, onAddRoom, user }) {
  const [formData, setFormData] = useState({
    identifier: '',
    type: 'hotelRoom',
    n_of_adults: 2,
    description: '',
    cost: '',
    city: '',
    photos: []
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError('');

    try {
      const uploadedUrls = [];
      
      for (const file of files) {
        // Obter assinatura do backend
        const signatureResponse = await fetch('http://localhost:3000/api/upload/signature');
        if (!signatureResponse.ok) {
          throw new Error('Erro ao obter assinatura para upload');
        }
        const signatureData = await signatureResponse.json();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', signatureData.timestamp);
        formData.append('signature', signatureData.signature);
        formData.append('api_key', signatureData.api_key);
        formData.append('folder', 'rooms');

        const response = await fetch('https://api.cloudinary.com/v1_1/dajmzj1ww/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Erro no upload da imagem');
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls]
      }));
    } catch (err) {
      setError('Erro ao fazer upload das imagens: ' + err.message);
    } finally {
      setUploading(false);
    }
  };



  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.type || !formData.n_of_adults || !formData.cost || !formData.city) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const roomData = {
        ...formData,
        n_of_adults: parseInt(formData.n_of_adults),
        cost: parseFloat(formData.cost),
        hotel_id: user.id
      };

      const response = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar quarto');
      }

      const newRoom = await response.json();
      console.log('Quarto criado com sucesso:', newRoom);
      
      onAddRoom(newRoom);
      handleClose();
    } catch (err) {
      setError('Erro ao criar quarto: ' + err.message);
    }
  };

  const handleClose = () => {
    setFormData({
      identifier: '',
      type: 'hotelRoom',
      n_of_adults: 2,
      description: '',
      cost: '',
      city: '',
      photos: []
    });
    setError('');
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Quarto</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="identifier">Identificador *</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="Ex: 40A"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Tipo *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="hotelRoom">Quarto de Hotel</option>
                <option value="lodge">Chalé</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="n_of_adults">Número de Adultos *</label>
              <select
                id="n_of_adults"
                name="n_of_adults"
                value={formData.n_of_adults}
                onChange={handleInputChange}
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'adulto' : 'adultos'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cost">Preço por Noite (R$) *</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="Ex: 250.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="city">Cidade *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Ex: Rio de Janeiro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o quarto..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Fotos</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              disabled={uploading}
            />
            {uploading && <p className="upload-status">Fazendo upload...</p>}
          </div>

          {formData.photos.length > 0 && (
            <div className="photos-preview">
              <label>Fotos Selecionadas:</label>
              <div className="photos-grid">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo} alt={`Foto ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="remove-photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Fazendo Upload...' : 'Adicionar Quarto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal; 