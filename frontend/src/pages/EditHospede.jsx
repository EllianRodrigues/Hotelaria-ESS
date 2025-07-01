// src/pages/EditHospede.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext.jsx';

function EditHospede() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = `http://localhost:3000/api/hospedes/${id}`;

  useEffect(() => {
    if (!user || user.tipo !== 'hospede' || !user.id || !user.cpf) {
      alert('Acesso negado. Faça login como hóspede para editar seu perfil.');
      navigate('/login-hospede');
      return;
    }

    const fetchHospedeData = async () => {
      try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (String(data.id) !== String(user.id) || data.cpf !== user.cpf) {
          alert('Você não tem permissão para editar este perfil.');
          navigate('/');
          return;
        }

        setFormData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do hóspede:', err);
        setError('Erro ao carregar dados do hóspede. Verifique sua conexão ou se o perfil existe.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospedeData();
  }, [id, backendUrl, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.tipo !== 'hospede' || String(user.id) !== String(id)) {
        alert('Erro de autorização. Recarregue a página e tente novamente.');
        return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, loggedInCpf: user.cpf }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = { ...user, ...formData };
      login(updatedUser);

      alert('Hóspede atualizado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro ao atualizar hóspede:', err);
      alert('Erro ao atualizar hóspede: ' + err.message);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Carregando dados do hóspede...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!formData.id && !loading) return <p style={{ textAlign: 'center' }}>Hóspede não encontrado ou acesso não autorizado.</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Editar Hóspede</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome || ''} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" value={formData.cpf || ''} onChange={handleChange} required /> 
        <button type="submit">Atualizar Hóspede</button>
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

export default EditHospede;