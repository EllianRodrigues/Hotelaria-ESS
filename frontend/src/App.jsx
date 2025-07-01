import React, { useState, useEffect } from 'react';
import './App.css'; // Mantenha ou remova se não for usar estilos

function App() {
  return (
    <div className="App">
      <h1>Gerenciamento de Entidades</h1>
      <hr />
      <HospedeManager />
      <hr />
      <HotelManager />
    </div>
  );
}

// --- Componente para Hóspedes ---
function HospedeManager() {
  const [hospedes, setHospedes] = useState([]);
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '', senha: '' });
  const backendUrl = 'http://localhost:3000/api/hospedes';

  // Função para buscar hóspedes
  const fetchHospedes = async () => {
    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHospedes(data);
    } catch (error) {
      console.error('Erro ao buscar hóspedes:', error);
    }
  };

  // Buscar hóspedes ao carregar o componente
  useEffect(() => {
    fetchHospedes();
  }, []);

  // Lidar com mudança nos inputs do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lidar com o envio do formulário (Criar Hóspede)
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

      // Se deu certo, limpa o formulário e busca a lista atualizada
      setFormData({ nome: '', email: '', cpf: '', senha: '' });
      fetchHospedes();
      alert('Hóspede criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar hóspede:', error);
      alert('Erro ao criar hóspede: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Hóspedes</h2>
      {/* Formulário para criar Hóspede */}
      <h3>Criar Novo Hóspede</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
        <button type="submit">Adicionar Hóspede</button>
      </form>

      {/* Lista de Hóspedes */}
      <h3>Hóspedes Cadastrados</h3>
      {hospedes.length === 0 ? (
        <p>Nenhum hóspede cadastrado ainda.</p>
      ) : (
        <ul>
          {hospedes.map((hospede) => (
            <li key={hospede.id}>
              ID: {hospede.id} | Nome: {hospede.nome} | Email: {hospede.email} | CPF: {hospede.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Componente para Hotéis ---
function HotelManager() {
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', senha: '' });
  const backendUrl = 'http://localhost:3000/api/hotels';

  // Função para buscar hotéis
  const fetchHotels = async () => {
    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Erro ao buscar hotéis:', error);
    }
  };

  // Buscar hotéis ao carregar o componente
  useEffect(() => {
    fetchHotels();
  }, []);

  // Lidar com mudança nos inputs do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lidar com o envio do formulário (Criar Hotel)
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

      // Se deu certo, limpa o formulário e busca a lista atualizada
      setFormData({ nome: '', email: '', cnpj: '', senha: '' });
      fetchHotels();
      alert('Hotel criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar hotel:', error);
      alert('Erro ao criar hotel: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Hotéis</h2>
      {/* Formulário para criar Hotel */}
      <h3>Criar Novo Hotel</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
        <button type="submit">Adicionar Hotel</button>
      </form>

      {/* Lista de Hotéis */}
      <h3>Hotéis Cadastrados</h3>
      {hotels.length === 0 ? (
        <p>Nenhum hotel cadastrado ainda.</p>
      ) : (
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel.id}>
              ID: {hotel.id} | Nome: {hotel.nome} | Email: {hotel.email} | CNPJ: {hotel.cnpj}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;