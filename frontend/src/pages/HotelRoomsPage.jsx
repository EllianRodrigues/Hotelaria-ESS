import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import EditRoomModal from '../components/EditRoomModal';
import DeleteRoomModal from '../components/DeleteRoomModal';
import './HotelRoomsPage.css';

function HotelRoomsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchHotelRooms = useCallback(async () => {
    if (!user || !user.id) {
      setError('Usuário não identificado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/rooms?hotel_id=${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Verificar se o usuário está logado e é um hotel
    if (!user) {
      navigate('/');
      return;
    }

    if (user.tipo !== 'hotel') {
      navigate('/');
      return;
    }

    fetchHotelRooms();
  }, [user, navigate, fetchHotelRooms]);

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleDeleteRoom = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRoom(null);
  };

  const handleRoomUpdated = () => {
    fetchHotelRooms();
  };

  const handleRoomDeleted = () => {
    fetchHotelRooms();
  };

  if (!user || user.tipo !== 'hotel') {
    return null;
  }

  return (
    <div className="hotel-rooms-page">
      <div className="page-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando seus quartos...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>Erro ao carregar quartos</h3>
              <p>{error}</p>
              <button onClick={fetchHotelRooms} className="btn-primary">
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏨</div>
            <h2>Nenhum quarto encontrado</h2>
            <p>Você ainda não adicionou nenhum quarto ao seu hotel.</p>
            <p>Use o botão "Adicionar Quarto" na barra de navegação para começar.</p>
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="rooms-section">
            <div className="rooms-header">
              <h2>Seus Quartos ({rooms.length})</h2>
              <p>Gerencie todos os quartos do seu hotel</p>
            </div>
            
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={`${room.type}-${room.identifier}`} className="room-card">
                  <div className="room-header">
                    <h3>Quarto {room.identifier}</h3>
                    <span className="room-type">
                      {room.type === 'hotelRoom' ? 'Quarto de Hotel' : 'Chalé'}
                    </span>
                  </div>
                  
                  <div className="room-price">
                    <span className="price">R$ {room.cost}</span>
                    <span className="per-night">/noite</span>
                  </div>
                  
                  <div className="room-details">
                    <div className="detail-item">
                      <strong>Capacidade:</strong> {room.n_of_adults} adultos
                    </div>
                    <div className="detail-item">
                      <strong>Cidade:</strong> {room.city}
                    </div>
                    {room.description && (
                      <div className="detail-item">
                        <strong>Descrição:</strong> {room.description}
                      </div>
                    )}
                  </div>

                  {room.photos && room.photos.length > 0 && (
                    <div className="room-photos">
                      <h4>Fotos do Quarto</h4>
                      <div className="photos-grid">
                        {room.photos.map((photo, index) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Foto ${index + 1} do quarto ${room.identifier}`}
                            className="room-photo"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="room-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => handleEditRoom(room)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeleteRoom(room)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Room Modal */}
        <EditRoomModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          room={selectedRoom}
          user={user}
          onRoomUpdated={handleRoomUpdated}
        />

        {/* Delete Room Modal */}
        <DeleteRoomModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          room={selectedRoom}
          user={user}
          onRoomDeleted={handleRoomDeleted}
        />
      </div>
    </div>
  );
}

export default HotelRoomsPage; 