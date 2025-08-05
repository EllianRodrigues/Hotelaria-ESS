import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import DeleteUserModal from '../components/DeleteUserModal';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.tipo !== 'admin') {
      navigate('/login-admin');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const handleDeleteClick = (userToDelete) => {
    const userType = userToDelete.cpf ? 'hospede' : 'hotel';
    setSelectedUser({ ...userToDelete, type: userType });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserDeleted = () => {
    fetchUsers(); // Recarrega a lista de usuários após a exclusão
  };

  if (loading) {
    return <div className="admin-container"><p>Carregando usuários...</p></div>;
  }

  if (error) {
    return <div className="admin-container"><p className="error-message">Erro ao carregar usuários: {error}</p></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel do Administrador</h1>
        <p>Gerenciamento de Usuários</p>
      </div>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF/CNPJ</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={`${u.id}-${u.cpf || u.cnpj}`}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.cpf || u.cnpj}</td>
                <td>
                  <span className={`user-type-badge ${u.cpf ? 'hospede' : 'hotel'}`}>
                    {u.cpf ? 'Hóspede' : 'Hotel'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleDeleteClick(u)} className="btn-delete">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        user={selectedUser}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}

export default AdminDashboard;