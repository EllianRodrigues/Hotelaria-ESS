// src/pages/RegisterHospede.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterHospede() {
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '', senha: '' });
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000/api/hospedes';

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

      setFormData({ nome: '', email: '', cpf: '', senha: '' }); 
      alert('Hóspede registrado com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error('Erro ao registrar hóspede:', error);
      alert('Erro ao registrar hóspede: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Registro de Hóspede</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
        <button type="submit">Registrar Hóspede</button>
      </form>
    </div>
  );
}

export default RegisterHospede;