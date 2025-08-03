import React, { useState, useEffect } from 'react';
import './EditRoomModal.css';

function EditRoomModal({ isOpen, onClose, room, user, onRoomUpdated }) {
  const [formData, setFormData] = useState({
    identifier: '',
    type: 'hotelRoom',
    n_of_adults: 1,
    description: '',
    cost: 0,
    city: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (room && isOpen) {
      setFormData({
        identifier: room.identifier || '',
        type: room.type || 'hotelRoom',
        n_of_adults: room.n_of_adults || 1,
        description: room.description || '',
        cost: room.cost || 0,
        city: room.city || '',
        photos: room.photos || []
      });
      setError('');
    }
  }, [room, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'n_of_adults' || name === 'cost' ? parseInt(value) : value
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
    setLoading(true);
    setError('');

    try {
      // Comparar com os dados originais para enviar apenas mudanças
      const changes = {};
      const originalData = {
        identifier: room.identifier,
        type: room.type,
        n_of_adults: room.n_of_adults,
        description: room.description,
        cost: room.cost,
        city: room.city,
        photos: room.photos
      };

      // Verificar quais campos foram alterados
      Object.keys(formData).forEach(key => {
        if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
          changes[key] = formData[key];
        }
      });

      // Se não há mudanças, mostrar erro
      if (Object.keys(changes).length === 0) {
        setError('Nenhuma alteração foi feita');
        setLoading(false);
        return;
      }

      console.log('Campos alterados:', changes);

      const roomId = `${room.type}-${room.identifier}`;
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}?hotel_id=${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar quarto');
      }

      // Chamar callback para atualizar a lista de quartos
      if (onRoomUpdated) {
        onRoomUpdated();
      }

      onClose();
    } catch (err) {
      setError('Erro ao atualizar quarto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !room) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Quarto {room.identifier}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="identifier">Identificador:</label>
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
              <label htmlFor="type">Tipo:</label>
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
              <label htmlFor="n_of_adults">Número de Adultos:</label>
              <input
                type="number"
                id="n_of_adults"
                name="n_of_adults"
                value={formData.n_of_adults}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cost">Preço por Noite (R$):</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="city">Cidade:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Descreva as características do quarto..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Fotos:</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileUpload}
              multiple
              accept="image/*"
            />
            {uploading && <p className="upload-status">Fazendo upload...</p>}
          </div>

          {formData.photos.length > 0 && (
            <div className="form-group">
              <label>Fotos Atuais:</label>
              <div className="photos-preview">
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
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoomModal; 