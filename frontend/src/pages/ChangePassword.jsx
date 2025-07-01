// src/pages/ChangePassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState(''); // NOVO ESTADO
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id || !(user.cpf || user.cnpj)) {
      alert('Você precisa estar logado para mudar sua senha.');
      navigate('/login-hospede');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('A nova senha não coincide.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 3) {
        setError('A nova senha deve ter no mínimo 3 caracteres.');
        setLoading(false);
        return;
    }

    let backendUrl = '';
    let bodyData = {};

    if (user.tipo === 'hospede') {
      backendUrl = `http://localhost:3000/api/hospedes/${user.id}/password`;
      bodyData = { currentPassword, newPassword, loggedInCpf: user.cpf }; // NOVO: currentPassword
    } else if (user.tipo === 'hotel') {
      backendUrl = `http://localhost:3000/api/hotels/${user.id}/password`;
      bodyData = { currentPassword, newPassword, loggedInCnpj: user.cnpj }; // NOVO: currentPassword
    } else {
      setError('Tipo de usuário desconhecido para mudança de senha.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert('Senha atualizada com sucesso!');
      setCurrentPassword(''); // Limpa os campos após sucesso
      setNewPassword('');
      setConfirmPassword('');
      navigate('/'); // Volta para a página do perfil
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setError('Erro ao atualizar senha: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return <p style={{ textAlign: 'center' }}>Carregando...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Alterar Senha ({user.tipo === 'hospede' ? 'Hóspede' : 'Hotel'} - {user.nome})</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        {/* NOVO CAMPO: Senha Atual */}
        <input type="password" placeholder="Senha Atual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        <input type="password" placeholder="Nova Senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <input type="password" placeholder="Confirme a Nova Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Atualizando...' : 'Alterar Senha'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;