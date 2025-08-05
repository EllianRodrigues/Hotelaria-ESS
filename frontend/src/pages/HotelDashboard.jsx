import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function HotelDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Estados para filtros
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState(12);

  // Controle de acesso - Apenas hotéis podem acessar
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    if (user.tipo !== 'hotel') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.tipo === 'hotel') {
      fetchHotelStats();
    }
  }, [selectedYear, selectedPeriod, user]);

  const fetchHotelStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar dados específicos do hotel logado
      const response = await fetch(`http://localhost:3000/api/statistics/hotel/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Erro ao carregar estatísticas do hotel');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar estatísticas do hotel:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  // Se não for hotel, não renderizar nada (componente será redirecionado)
  if (!user || user.tipo !== 'hotel') {
    return null;
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Carregando dados do seu hotel...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>❌ Erro ao carregar dados</h2>
          <p>{error}</p>
          <button onClick={fetchHotelStats} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏨 Painel do Hotel: {user.nome}</h1>
        <p>Dados específicos do seu estabelecimento</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🛏️</div>
          <div className="metric-content">
            <h3>Quartos Totais</h3>
            <p className="metric-value">{formatNumber(stats?.totalRooms || 0)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <h3>Reservas</h3>
            <p className="metric-value">{formatNumber(stats?.totalReservations || 0)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Receita Total</h3>
            <p className="metric-value">{formatCurrency(stats?.totalRevenue || 0)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Taxa de Ocupação</h3>
            <p className="metric-value">{formatPercentage(stats?.occupancyRate || 0)}</p>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Visão Geral
        </button>
        <button 
          className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          🛏️ Quartos
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          📅 Reservas
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h2>📊 Visão Geral do Hotel</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Desempenho Mensal</h3>
                <div className="chart-placeholder">
                  <p>📈 Gráfico de receita mensal</p>
                  <p>Receita média: {formatCurrency(stats?.avgMonthlyRevenue || 0)}</p>
                </div>
              </div>
              
              <div className="overview-card">
                <h3>Tipos de Quarto</h3>
                <div className="room-types-list">
                  {stats?.roomTypes?.map((type, index) => (
                    <div key={index} className="room-type-item">
                      <span>{type.type}</span>
                      <span>{type.count} quartos</span>
                      <span>{formatCurrency(type.avgPrice)}</span>
                    </div>
                  )) || <p>Sem dados de tipos de quarto</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="tab-content">
            <h2>🛏️ Gestão de Quartos</h2>
            <div className="rooms-grid">
              {stats?.rooms?.map((room) => (
                <div key={room.id} className="room-card">
                  <h4>Quarto {room.identifier}</h4>
                  <p><strong>Tipo:</strong> {room.type}</p>
                  <p><strong>Capacidade:</strong> {room.n_of_adults} adultos</p>
                  <p><strong>Preço:</strong> {formatCurrency(room.cost)}</p>
                  <p><strong>Status:</strong> {room.occupied ? '🔴 Ocupado' : '🟢 Disponível'}</p>
                </div>
              )) || <p>Nenhum quarto encontrado</p>}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="tab-content">
            <h2>📅 Reservas Recentes</h2>
            <div className="reservations-table">
              <table>
                <thead>
                  <tr>
                    <th>Reserva</th>
                    <th>Hóspede</th>
                    <th>Quarto</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.reservations?.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.name}</td>
                      <td>{reservation.hospede_name}</td>
                      <td>Quarto {reservation.room_identifier}</td>
                      <td>{new Date(reservation.start_date).toLocaleDateString('pt-BR')}</td>
                      <td>{new Date(reservation.end_date).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <span className={`status-badge ${reservation.status}`}>
                          {reservation.status === 'active' ? '✅ Ativa' : '⏰ Pendente'}
                        </span>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="6">Nenhuma reserva encontrada</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Atualização */}
      <div className="dashboard-actions">
        <button onClick={fetchHotelStats} className="refresh-button">
          🔄 Atualizar Dados
        </button>
      </div>
    </div>
  );
}

export default HotelDashboard;
