import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ReservationModal from '../components/ReservationModal';
import './SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchData = location.state?.searchData;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchRooms = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        available: 'true',
        city: searchParams.city,
        n_of_adults: searchParams.n_of_adults,
        start_date: searchParams.start_date,
        end_date: searchParams.end_date,
      });
      const response = await fetch(`http://localhost:3000/api/rooms?${queryParams}`);
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
  };

  useEffect(() => {
    if (searchData) {
      fetchRooms(searchData);
    } else {
      setLoading(false);
    }
  }, [searchData]);

  const handleReserveClick = (room) => {
    if (!user || user.tipo !== 'hospede') {
      navigate('/login-hospede', { state: { from: location } });
      return;
    }
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleReservationSuccess = () => {
    handleCloseModal();
    setShowSuccessToast(true);
    fetchRooms(searchData);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000); // O toast some após 5 segundos
  };

  if (!searchData) {
    return (
      <div className="search-results-container">
        <div className="no-results">
          <h2>Nenhuma pesquisa encontrada</h2>
          <p>Volte e faça uma nova pesquisa.</p>
          <Link to="/" className="btn-primary">Voltar ao Início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      {/* Estrutura do Toast de Sucesso */}
      {showSuccessToast && (
        <div className="success-toast">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <h4>Reserva Confirmada!</h4>
            <p>Sua reserva foi efetuada com sucesso.</p>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <div className="search-header">
        <h1>Resultados da Pesquisa</h1>
        <div className="search-summary">
          <p>
            <strong>Cidade:</strong> {searchData.city} | 
            <strong> Adultos:</strong> {searchData.n_of_adults} | 
            <strong> Período:</strong> {searchData.start_date} a {searchData.end_date}
          </p>
        </div>
      </div>

      <div className="results-content">
        {loading ? (
          <div className="loading-message">
            <p>Buscando quartos disponíveis...</p>
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Erro ao buscar quartos: {error}</p>
            <button onClick={() => fetchRooms(searchData)} className="btn-primary">
              Tentar Novamente
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="no-rooms-message">
            <p>Nenhum quarto disponível encontrado para os critérios selecionados.</p>
            <p>Tente ajustar as datas ou a cidade.</p>
          </div>
        ) : (
          <div>
            <h3 className="rooms-title">Quartos Encontrados ({rooms.length})</h3>
            <div className="rooms-list">
              {rooms.map((room, index) => (
                <div key={`room-${room.id}-${index}`} className="room-card">
                  <div className="room-header">
                    <h4>Quarto {room.identifier} - {room.type === 'hotelRoom' ? 'Quarto de Hotel' : 'Chalé'}</h4>
                    <span className="room-price">R$ {room.cost}/noite</span>
                  </div>
                  <div className="room-details">
                    <p><strong>Cidade:</strong> <span>{room.city}</span></p>
                    <p><strong>Capacidade:</strong> <span>{room.n_of_adults} {room.n_of_adults === 1 ? 'adulto' : 'adultos'}</span></p>
                    {room.description && (
                      <p><strong>Descrição:</strong> <span>{room.description}</span></p>
                    )}
                  </div>
                  {room.photos && room.photos.length > 0 && (
                    <div className="room-photos">
                      <p><strong>Fotos:</strong></p>
                      <div className="photos-grid">
                        {room.photos.map((photo, photoIndex) => (
                          <img 
                            key={photoIndex} 
                            src={photo} 
                            alt={`Foto ${photoIndex + 1} do quarto ${room.identifier}`}
                            className="room-photo"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="room-actions">
                    <button 
                      onClick={() => handleReserveClick(room)}
                      className="btn-reservar"
                    >
                      Reservar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        room={selectedRoom}
        searchData={searchData}
        onReservationSuccess={handleReservationSuccess}
      />
    </div>
  );
}

export default SearchResults;