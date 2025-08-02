import React from 'react';
import './DeleteRoomModal.css';

function DeleteRoomModal({ isOpen, onClose, room, user, onRoomDeleted }) {
  const handleDelete = async () => {
    try {
      const roomId = `${room.type}-${room.identifier}`;
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}?hotel_id=${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar quarto');
      }

      // Chamar callback para atualizar a lista de quartos
      if (onRoomDeleted) {
        onRoomDeleted();
      }

      onClose();
    } catch (err) {
      console.error('Erro ao deletar quarto:', err);
      alert('Erro ao deletar quarto: ' + err.message);
    }
  };

  if (!isOpen || !room) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <h3>Tem certeza que deseja excluir este quarto?</h3>
          
          <div className="room-info">
            <p><strong>Quarto:</strong> {room.identifier}</p>
            <p><strong>Tipo:</strong> {room.type === 'hotelRoom' ? 'Quarto de Hotel' : 'Chalé'}</p>
            <p><strong>Cidade:</strong> {room.city}</p>
            <p><strong>Preço:</strong> R$ {room.cost}/noite</p>
          </div>

          <div className="warning-message">
            <p>Esta ação não pode ser desfeita. O quarto será permanentemente removido do sistema.</p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Excluir Quarto
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoomModal; 