import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ReservationModal.css';

function ReservationModal({ isOpen, onClose, room, searchData, onReservationSuccess }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleConfirmReservation = async () => {
    setIsLoading(true);
    setError(null);

    const reservationData = {
      name: user.nome,
      start_date: searchData.start_date,
      end_date: searchData.end_date,
      room_id: room.id,
      hospede_id: user.id,
    };

    try {
      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Não foi possível criar a reserva.');
      }

      onReservationSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Reserva</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Você está prestes a reservar o seguinte quarto:</p>
          <div className="room-info">
            <p><strong>Quarto:</strong> {room.identifier} ({room.type === 'hotelRoom' ? 'Quarto de Hotel' : 'Chalé'})</p>
            <p><strong>Cidade:</strong> {room.city}</p>
            <p><strong>Período:</strong> {searchData.start_date} a {searchData.end_date}</p>
            <p><strong>Preço:</strong> R$ {room.cost}/noite</p>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
            Cancelar
          </button>
          <button onClick={handleConfirmReservation} className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationModal;