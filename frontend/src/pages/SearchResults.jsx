import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const searchData = location.state?.searchData;

  // Log dos dados recebidos na página de resultados
  React.useEffect(() => {
    if (searchData) {
      console.log('SearchResults: Dados recebidos na página:', searchData);
      console.log('SearchResults: URL atual:', window.location.href);
    } else {
      console.log('SearchResults: Nenhum dado de pesquisa encontrado');
    }
  }, [searchData]);

  if (!searchData) {
    return (
      <div className="search-results-container">
        <div className="no-results">
          <h2>Nenhuma pesquisa encontrada</h2>
          <p>Volte e faça uma nova pesquisa.</p>
          <Link to="/" className="btn-primary">Voltar ao Início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Resultados da Pesquisa</h1>
        <div className="search-summary">
          <p>
            <strong>Cidade:</strong> {searchData.city} | 
            <strong> Adultos:</strong> {searchData.n_of_adults} | 
            <strong> Período:</strong> {searchData.start_date} a {searchData.end_date}
          </p>
        </div>
      </div>

      <div className="results-content">
        <div className="loading-message">
          <p>Buscando quartos disponíveis...</p>
          <div className="loading-spinner"></div>
        </div>
        
        <div className="search-actions">
          <Link to="/" className="btn-secondary">Nova Pesquisa</Link>
        </div>
      </div>
    </div>
  );
}

export default SearchResults; 