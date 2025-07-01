// src/pages/EditHotel.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Importe 'Link'
import { useAuth } from '../context/AuthContext.jsx';

function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = `http://localhost:3000/api/hotels/${id}`;

  useEffect(() => {
    if (!user || user.tipo !== 'hotel' || !user.id || !user.cnpj) {
      alert('Acesso negado. Faça login como hotel para editar seu perfil.');
      navigate('/login-hotel');
      return;
    }

    const fetchHotelData = async () => {
      try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (String(data.id) !== String(user.id) || data.cnpj !== user.cnpj) {
          alert('Você não tem permissão para editar este perfil.');
          navigate('/');
          return;
        }

        setFormData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do hotel:', err);
        setError('Erro ao carregar dados do hotel. Verifique sua conexão ou se o perfil existe.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id, backendUrl, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.tipo !== 'hotel' || String(user.id) !== String(id)) {
        alert('Erro de autorização. Recarregue a página e tente novamente.');
        return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, loggedInCnpj: user.cnpj }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = { ...user, ...formData };
      login(updatedUser);

      alert('Hotel atualizado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro ao atualizar hotel:', err);
      alert('Erro ao atualizar hotel: ' + err.message);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Carregando dados do hotel...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!formData.id && !loading) return <p style={{ textAlign: 'center' }}>Hotel não encontrado ou acesso não autorizado.</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Editar Hotel </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <input type="text" name="nome" placeholder="Nome do Hotel" value={formData.nome || ''} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email do Hotel" value={formData.email || ''} onChange={handleChange} required />
        <input type="text" name="cnpj" placeholder="CNPJ" value={formData.cnpj || ''} onChange={handleChange} required />
        <button type="submit">Atualizar Hotel</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <Link to="/alterar-senha" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px',
          display: 'inline-block' 
        }}>
          Alterar Senha
        </Link>
      </div>
    </div>
  );
}

export default EditHotel;