import React from 'react';
import './DeleteUserModal.css';

function DeleteUserModal({ isOpen, onClose, user, onUserDeleted }) {
  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${user.type}/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar usuário');
      }

      onUserDeleted();
      onClose();
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      alert('Erro ao deletar usuário: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Tem certeza que deseja excluir o usuário <strong>{user.nome}</strong>?</p>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleDelete} className="btn-danger">Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;