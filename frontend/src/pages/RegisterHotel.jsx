// src/pages/RegisterHotel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterHotel() {
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', senha: '' });
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000/api/hotels';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setFormData({ nome: '', email: '', cnpj: '', senha: '' }); 
      alert('Hotel registrado com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error('Erro ao registrar hotel:', error);
      alert('Erro ao registrar hotel: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Registro de Hotel</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <input type="text" name="nome" placeholder="Nome do Hotel" value={formData.nome} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email do Hotel" value={formData.email} onChange={handleChange} required />
        <input type="text" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
        <button type="submit">Registrar Hotel</button>
      </form>
    </div>
  );
}

export default RegisterHotel;