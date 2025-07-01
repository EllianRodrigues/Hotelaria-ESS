// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';

function HomePage() {
  const [hospedes, setHospedes] = useState([]);
  const [hotels, setHotels] = useState([]);

  const backendBaseUrl = 'http://localhost:3000/api';

  const fetchHospedes = async () => {
    try {
      const response = await fetch(`${backendBaseUrl}/hospedes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHospedes(data);
    } catch (error) {
      console.error('Erro ao buscar hóspedes:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${backendBaseUrl}/hotels`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Erro ao buscar hotéis:', error);
    }
  };

  useEffect(() => {
    fetchHospedes();
    fetchHotels();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Use a NavBar para fazer login/registrar/editar hospede e hotel</h2>

      {/* Exibição da Lista de Hóspedes */}
      <hr />
      <h3>Hóspedes Cadastrados</h3>
      {hospedes.length === 0 ? (
        <p>Nenhum hóspede cadastrado ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: '20px auto', textAlign: 'left' }}>
          {hospedes.map((hospede) => (
            <li key={hospede.id} style={{ backgroundColor: 'black', border: '1px solidrgb(0, 0, 0)', padding: '10px', marginBottom: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                ID: {hospede.id} | Nome: {hospede.nome} | Email: {hospede.email} | CPF: {hospede.cpf}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Exibição da Lista de Hotéis */}
      <hr />
      <h3>Hotéis Cadastrados</h3>
      {hotels.length === 0 ? (
        <p>Nenhum hotel cadastrado ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: '20px auto', textAlign: 'left' }}>
          {hotels.map((hotel) => (
            <li key={hotel.id} style={{ backgroundColor: 'black', border: '1px solidrgb(0, 0, 0)', padding: '10px', marginBottom: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                ID: {hotel.id} | Nome: {hotel.nome} | Email: {hotel.email} | CNPJ: {hotel.cnpj}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;