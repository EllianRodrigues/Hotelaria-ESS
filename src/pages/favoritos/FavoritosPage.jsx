import React, { useState } from 'react';
import { 
  Heart, 
  Folder, 
  Filter, 
  Search, 
  Grid, 
  List, 
  Share2, 
  Download,
  AlertTriangle,
  Calendar,
  Star,
  MapPin,
  Trash2,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';
import { useFavoritos } from '../../context/FavoritosContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AnuncioCard from '../../components/anuncios/AnuncioCard';

const FavoritosPage = () => {
  const { 
    favoritos, 
    pastas, 
    loading, 
    error, 
    setFiltros, 
    filtros,
    criarPasta,
    compartilharFavoritos,
    limparFavoritosAntigos,
    gerarRelatorio
  } = useFavoritos();

  const [viewMode, setViewMode] = useState('grid');
  const [showCreatePasta, setShowCreatePasta] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFavoritos, setSelectedFavoritos] = useState([]);
  const [novaPasta, setNovaPasta] = useState({ nome: '', descricao: '', cor: '#007bff' });

  const handleCreatePasta = async () => {
    try {
      await criarPasta(novaPasta.nome, novaPasta.descricao, novaPasta.cor);
      setShowCreatePasta(false);
      setNovaPasta({ nome: '', descricao: '', cor: '#007bff' });
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
    }
  };

  const handleShare = async () => {
    try {
      const resultado = await compartilharFavoritos(1, 'lista');
      // Aqui você pode implementar a lógica para copiar o link ou abrir modal
      console.log('Link compartilhado:', resultado.codigo_compartilhamento);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleExport = async () => {
    try {
      const resultado = await gerarRelatorio(1);
      // Aqui você pode implementar o download do relatório
      console.log('Relatório gerado:', resultado);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  const handleCleanOld = async () => {
    try {
      await limparFavoritosAntigos(1, 6);
      // Recarregar favoritos após limpeza
    } catch (error) {
      console.error('Erro ao limpar favoritos antigos:', error);
    }
  };

  const filteredFavoritos = favoritos.filter(favorito => {
    const anuncio = favorito.anuncio;
    const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.localizacao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="text-center">
        <div className="text-2xl font-bold text-blue-600">{favoritos.length}</div>
        <div className="text-sm text-gray-600">Total de Favoritos</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {favoritos.filter(f => f.visitado).length}
        </div>
        <div className="text-sm text-gray-600">Visitados</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-orange-600">
          {favoritos.filter(f => f.alerta_preco).length}
        </div>
        <div className="text-sm text-gray-600">Alertas de Preço</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-purple-600">{pastas.length}</div>
        <div className="text-sm text-gray-600">Pastas Criadas</div>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <Card className="mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Busca */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por pasta */}
        <select
          value={filtros.pasta_id || ''}
          onChange={(e) => setFiltros({ pasta_id: e.target.value || null })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as pastas</option>
          {pastas.map(pasta => (
            <option key={pasta.id} value={pasta.id}>{pasta.nome}</option>
          ))}
        </select>

        {/* Filtro por status */}
        <select
          value={filtros.visitado || ''}
          onChange={(e) => setFiltros({ visitado: e.target.value || null })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="true">Visitados</option>
          <option value="false">Não visitados</option>
        </select>

        {/* Ordenação */}
        <select
          value={`${filtros.ordenacao}-${filtros.direcao}`}
          onChange={(e) => {
            const [ordenacao, direcao] = e.target.value.split('-');
            setFiltros({ ordenacao, direcao });
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="data_salvamento-DESC">Mais recentes</option>
          <option value="data_salvamento-ASC">Mais antigos</option>
          <option value="preco-ASC">Menor preço</option>
          <option value="preco-DESC">Maior preço</option>
          <option value="avaliacao-DESC">Melhor avaliados</option>
        </select>
      </div>
    </Card>
  );

  const renderActions = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button onClick={() => setShowCreatePasta(true)}>
        <Folder className="w-4 h-4 mr-2" />
        Nova Pasta
      </Button>
      
      <Button variant="outline" onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar
      </Button>
      
      <Button variant="outline" onClick={handleExport}>
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
      
      <Button variant="outline" onClick={handleCleanOld}>
        <Trash2 className="w-4 h-4 mr-2" />
        Limpar Antigos
      </Button>

      <div className="flex border border-gray-300 rounded-lg">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderFavoritos = () => {
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
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar favoritos</h3>
          <p className="text-gray-600">{error}</p>
        </Card>
      );
    }

    if (filteredFavoritos.length === 0) {
      return (
        <Card className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum favorito encontrado</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece salvando alguns anúncios como favoritos!'}
          </p>
        </Card>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavoritos.map(favorito => (
            <AnuncioCard 
              key={favorito.id} 
              anuncio={favorito.anuncio}
              showActions={false}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredFavoritos.map(favorito => (
          <Card key={favorito.id} className="flex">
            <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {favorito.anuncio.fotos ? (
                <img 
                  src={JSON.parse(favorito.anuncio.fotos)[0]} 
                  alt={favorito.anuncio.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Heart className="w-8 h-8" />
                </div>
              )}
            </div>
            
            <div className="flex-1 ml-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{favorito.anuncio.titulo}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {favorito.anuncio.localizacao}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {favorito.anuncio.avaliacao_media?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(favorito.data_salvamento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    R$ {favorito.anuncio.preco_por_noite}
                  </p>
                  <p className="text-xs text-gray-500">por noite</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button size="small" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver detalhes
                </Button>
                <Button size="small" variant="outline">
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button size="small" variant="danger">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Favoritos</h1>
        <p className="text-gray-600">Gerencie seus anúncios favoritos e organize-os em pastas</p>
      </div>

      {renderStats()}
      {renderFilters()}
      {renderActions()}
      {renderFavoritos()}

      {/* Modal de criar pasta */}
      {showCreatePasta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Nova Pasta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da pasta
                </label>
                <input
                  type="text"
                  value={novaPasta.nome}
                  onChange={(e) => setNovaPasta({ ...novaPasta, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Hotéis em São Paulo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={novaPasta.descricao}
                  onChange={(e) => setNovaPasta({ ...novaPasta, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Descreva o conteúdo desta pasta..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={novaPasta.cor}
                  onChange={(e) => setNovaPasta({ ...novaPasta, cor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleCreatePasta} className="flex-1">
                Criar Pasta
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreatePasta(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FavoritosPage; 