// src/pages/HomePage.jsx
import React from 'react';
import ImageSlider from '../components/ImageSlider';
import './HomePage.css';

function HomePage() {
  // Dados dos slides com imagens e textos para hotelaria
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Bem-vindo ao Paraíso',
      subtitle: 'Descubra o conforto e luxo que você merece',
      description: 'Hospedagem de qualidade com vistas deslumbrantes e serviço impecável'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
      title: 'Quartos Elegantes',
      subtitle: 'Conforto e sofisticação em cada detalhe',
      description: 'Quartos espaçosos com decoração moderna e todas as comodidades'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Piscina Infinita',
      subtitle: 'Relaxe com vista para o horizonte',
      description: 'Piscina com borda infinita e área de lazer exclusiva'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Gastronomia Exclusiva',
      subtitle: 'Sabores únicos em ambiente sofisticado',
      description: 'Restaurante premiado com pratos da culinária internacional'
    },
  ];

  return (
    <div className="homepage">
      {/* Slider Principal */}
      <ImageSlider slides={slides} autoPlayInterval={5000} />

      {/* Seção de Destaques */}
      <div className="highlights">
        <div className="highlight-card">
          <div className="highlight-icon">🏨</div>
          <h3>Hotéis Premium</h3>
          <p>Seleção dos melhores hotéis com classificação 4+ estrelas</p>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">💰</div>
          <h3>Melhor Preço</h3>
          <p>Garantimos os melhores preços do mercado</p>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">🛡️</div>
          <h3>Reserva Segura</h3>
          <p>Reservas 100% seguras com cancelamento gratuito</p>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">📞</div>
          <h3>Suporte 24h</h3>
          <p>Atendimento disponível 24 horas por dia</p>
        </div>
      </div>

      {/* Seção de Estatísticas */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Hotéis Parceiros</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50k+</div>
            <div className="stat-label">Clientes Satisfeitos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Destinos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Suporte</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;