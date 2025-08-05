import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Users } from 'lucide-react';
import { favoritosService } from '../../services/favoritosService';
import AnuncioCard from '../../components/anuncios/AnuncioCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const HomePage = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    precoMin: '',
    precoMax: '',
    localizacao: '',
    avaliacao: ''
  });

  useEffect(() => {
    carregarAnuncios();
  }, []);

  const carregarAnuncios = async () => {
    try {
      setLoading(true);
      const data = await favoritosService.listarAnuncios();
      setAnuncios(data);
    } catch (error) {
      setError('Erro ao carregar anúncios');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritar = (anuncio) => {
    console.log('Anúncio favoritado:', anuncio);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  const handleDesfavoritar = (anuncio) => {
    console.log('Anúncio removido dos favoritos:', anuncio);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  const filteredAnuncios = anuncios.filter(anuncio => {
    const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.localizacao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPreco = (!filtros.precoMin || anuncio.preco_por_noite >= parseFloat(filtros.precoMin)) &&
                        (!filtros.precoMax || anuncio.preco_por_noite <= parseFloat(filtros.precoMax));
    
    const matchesLocalizacao = !filtros.localizacao || 
                              anuncio.localizacao?.toLowerCase().includes(filtros.localizacao.toLowerCase());
    
    const matchesAvaliacao = !filtros.avaliacao || 
                            (anuncio.avaliacao_media && anuncio.avaliacao_media >= parseFloat(filtros.avaliacao));
    
    return matchesSearch && matchesPreco && matchesLocalizacao && matchesAvaliacao;
  });

  const renderHero = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Encontre o Hotel Perfeito
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Milhares de opções de hospedagem para suas viagens
        </p>
        
        {/* Barra de busca */}
        <div className="max-w-2xl mx-auto">
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Para onde você vai?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <Button className="rounded-l-none px-8">
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <Card className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço mínimo
          </label>
          <input
            type="number"
            placeholder="R$ 0"
            value={filtros.precoMin}
            onChange={(e) => setFiltros({ ...filtros, precoMin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço máximo
          </label>
          <input
            type="number"
            placeholder="R$ 1000"
            value={filtros.precoMax}
            onChange={(e) => setFiltros({ ...filtros, precoMax: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <input
            type="text"
            placeholder="Cidade, estado..."
            value={filtros.localizacao}
            onChange={(e) => setFiltros({ ...filtros, localizacao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avaliação mínima
          </label>
          <select
            value={filtros.avaliacao}
            onChange={(e) => setFiltros({ ...filtros, avaliacao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Qualquer</option>
            <option value="4">4+ estrelas</option>
            <option value="3">3+ estrelas</option>
            <option value="2">2+ estrelas</option>
          </select>
        </div>
      </div>
    </Card>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{anuncios.length}</div>
        <div className="text-gray-600">Anúncios Disponíveis</div>
      </Card>
      <Card className="text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">
          {anuncios.filter(a => a.destaque).length}
        </div>
        <div className="text-gray-600">Anúncios em Destaque</div>
      </Card>
      <Card className="text-center">
        <div className="text-3xl font-bold text-purple-600 mb-2">
          {anuncios.filter(a => a.avaliacao_media >= 4).length}
        </div>
        <div className="text-gray-600">Altamente Avaliados</div>
      </Card>
    </div>
  );

  const renderAnuncios = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <Card className="text-center py-8">
          <div className="text-red-500 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar anúncios</h3>
          <p className="text-gray-600">{error}</p>
          <Button onClick={carregarAnuncios} className="mt-4">
            Tentar novamente
          </Button>
        </Card>
      );
    }

    if (filteredAnuncios.length === 0) {
      return (
        <Card className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
          <p className="text-gray-600">
            {searchTerm || Object.values(filtros).some(f => f) 
              ? 'Tente ajustar os filtros de busca.' 
              : 'Nenhum anúncio disponível no momento.'}
          </p>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAnuncios.map(anuncio => (
          <AnuncioCard
            key={anuncio.id}
            anuncio={anuncio}
            onFavoritar={handleFavoritar}
            onDesfavoritar={handleDesfavoritar}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderHero()}
      
      <div className="container mx-auto px-4 py-8">
        {renderStats()}
        {renderFilters()}
        {renderAnuncios()}
      </div>
    </div>
  );
};

export default HomePage; 