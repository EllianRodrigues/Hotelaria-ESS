import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Estados para filtros
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState(12);

  // Controle de acesso - Redirecionar se não for admin
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    if (user.tipo !== 'admin') {
      // Redirecionar usuários não-admin para suas páginas apropriadas
      if (user.tipo === 'hotel') {
        navigate('/hotel-dashboard');
      } else {
        navigate('/');
      }
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.tipo === 'admin') {
      fetchStats();
    }
  }, [selectedYear, selectedPeriod, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/api/statistics/all`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Erro ao carregar estatísticas');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar estatísticas:', err);
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
    return `${(value || 0).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <h2>Erro ao carregar dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard de Estatísticas</h1>
        <p>Visão completa do sistema de hotelaria</p>
        <div className="dashboard-filters">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="filter-select"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="filter-select"
          >
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
            <option value={24}>Últimos 24 meses</option>
          </select>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Resumo Geral
        </button>

        <button 
          className={`tab-button ${activeTab === 'month' ? 'active' : ''}`}
          onClick={() => setActiveTab('month')}
        >
          📅 Por Mês
        </button>
        <button 
          className={`tab-button ${activeTab === 'hotels' ? 'active' : ''}`}
          onClick={() => setActiveTab('hotels')}
        >
          🏨 Top Hotéis
        </button>
        <button 
          className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          🛏️ Por Tipo de Quarto
        </button>
        <button 
          className={`tab-button ${activeTab === 'season' ? 'active' : ''}`}
          onClick={() => setActiveTab('season')}
        >
          🌤️ Por Estação
        </button>
        <button 
          className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          📊 Métricas Avançadas
        </button>
        <button 
          className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Tendências
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && stats?.overview && (
          <div className="overview-section">
            <h2>Resumo Geral do Sistema</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏨</div>
                <div className="stat-value">{formatNumber(stats.overview.totalHotels)}</div>
                <div className="stat-label">Total de Hotéis</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{formatNumber(stats.overview.totalHospedes)}</div>
                <div className="stat-label">Total de Hóspedes</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛏️</div>
                <div className="stat-value">{formatNumber(stats.overview.totalRooms)}</div>
                <div className="stat-label">Total de Quartos</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{formatNumber(stats.overview.totalReservations)}</div>
                <div className="stat-label">Total de Reservas</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{formatNumber(stats.overview.activeReservations)}</div>
                <div className="stat-label">Reservas Ativas</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">{formatCurrency(stats.overview.totalRevenue)}</div>
                <div className="stat-label">Receita Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-value">{formatCurrency(stats.overview.avgRoomPrice)}</div>
                <div className="stat-label">Preço Médio</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{formatPercentage(stats.overview.occupancyRate)}</div>
                <div className="stat-label">Taxa de Ocupação</div>
              </div>
            </div>
          </div>
        )}



        {activeTab === 'month' && stats?.monthStats && (
          <div className="month-section">
            <h2>Estatísticas por Mês - {selectedYear}</h2>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Total de Reservas</th>
                    <th>Receita Total</th>
                    <th>Preço Médio</th>
                    <th>Clientes Únicos</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.monthStats.map((month, index) => (
                    <tr key={index}>
                      <td>{month.month}/{month.year}</td>
                      <td>{formatNumber(month.total_reservations)}</td>
                      <td>{formatCurrency(month.total_revenue)}</td>
                      <td>{formatCurrency(month.avg_price)}</td>
                      <td>{formatNumber(month.unique_customers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'hotels' && stats?.topHotels && (
          <div className="hotels-section">
            <h2>Top Hotéis por Performance</h2>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                                     <tr>
                     <th>Ranking</th>
                     <th>Hotel</th>
                     <th>Total de Quartos</th>
                     <th>Total de Reservas</th>
                     <th>Receita Total</th>
                     <th>Preço Médio</th>
                     <th>Taxa de Ocupação</th>
                   </tr>
                </thead>
                <tbody>
                  {stats.topHotels.map((hotel, index) => (
                                         <tr key={index}>
                       <td>#{index + 1}</td>
                       <td>{hotel.hotel_name}</td>
                       <td>{formatNumber(hotel.total_rooms)}</td>
                       <td>{formatNumber(hotel.total_reservations)}</td>
                       <td>{formatCurrency(hotel.total_revenue)}</td>
                       <td>{formatCurrency(hotel.avg_room_price)}</td>
                       <td>{formatPercentage(hotel.occupancy_rate)}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && stats?.roomTypeStats && (
          <div className="rooms-section">
            <h2>Estatísticas por Tipo de Quarto</h2>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Tipo de Quarto</th>
                    <th>Total de Quartos</th>
                    <th>Reservas Ativas</th>
                    <th>Taxa de Ocupação</th>
                    <th>Preço Médio</th>
                    <th>Receita Total</th>
                    <th>Capacidade Média</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.roomTypeStats.map((room, index) => (
                    <tr key={index}>
                      <td>{room.room_type}</td>
                      <td>{formatNumber(room.total_rooms)}</td>
                      <td>{formatNumber(room.active_reservations)}</td>
                      <td>{formatPercentage(room.occupancy_rate)}</td>
                      <td>{formatCurrency(room.avg_price)}</td>
                      <td>{formatCurrency(room.total_revenue)}</td>
                      <td>{formatNumber(room.avg_capacity)} pessoas</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'season' && stats?.seasonStats && (
          <div className="season-section">
            <h2>Estatísticas por Estação - {selectedYear}</h2>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Estação</th>
                    <th>Total de Reservas</th>
                    <th>Receita Total</th>
                    <th>Preço Médio</th>
                    <th>Clientes Únicos</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.seasonStats.map((season, index) => (
                    <tr key={index}>
                      <td>{season.season}</td>
                      <td>{formatNumber(season.total_reservations)}</td>
                      <td>{formatCurrency(season.total_revenue)}</td>
                      <td>{formatCurrency(season.avg_price)}</td>
                      <td>{formatNumber(season.unique_customers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && stats?.advancedMetrics && (
          <div className="advanced-section">
            <h2>Métricas Avançadas</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Retenção de Clientes</h3>
                <div className="metric-value">
                  {formatNumber(stats.advancedMetrics.customerRetention?.[0]?.avg_reservations_per_customer || 0)}
                </div>
                <div className="metric-label">Reservas por Cliente</div>
              </div>
              
            </div>
          </div>
        )}

        {activeTab === 'trends' && stats?.trends && (
          <div className="trends-section">
            <h2>Tendências de Crescimento</h2>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Reservas</th>
                    <th>Receita</th>
                    <th>Novos Clientes</th>
                    <th>Preço Médio</th>
                    <th>Taxa de Crescimento</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.trends.map((trend, index) => (
                    <tr key={index}>
                      <td>{trend.month}</td>
                      <td>{formatNumber(trend.reservations)}</td>
                      <td>{formatCurrency(trend.revenue)}</td>
                      <td>{formatNumber(trend.new_customers)}</td>
                      <td>{formatCurrency(trend.avg_price)}</td>
                      <td className={trend.growth_rate > 0 ? 'positive' : 'negative'}>
                        {trend.growth_rate > 0 ? '+' : ''}{formatPercentage(trend.growth_rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-footer">
        <p>Última atualização: {new Date().toLocaleString('pt-BR')}</p>
        <button onClick={fetchStats} className="refresh-button">
          🔄 Atualizar Dados
        </button>
      </div>
    </div>
  );
}

export default Dashboard; 