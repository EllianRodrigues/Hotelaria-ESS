import React, { useState, useEffect } from 'react';
import { Heart, HeartOff, Star, MapPin, Users, Calendar } from 'lucide-react';
import { useFavoritos } from '../../context/FavoritosContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AnuncioCard = ({ anuncio, onFavoritar, onDesfavoritar, showActions = true }) => {
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const { verificarFavorito, salvarFavorito, removerFavorito } = useFavoritos();

  useEffect(() => {
    verificarSeFavorito();
  }, [anuncio.id]);

  const verificarSeFavorito = async () => {
    try {
      const resultado = await verificarFavorito(1, anuncio.id);
      setIsFavorito(resultado.is_favorito);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const handleFavoritar = async () => {
    try {
      setLoading(true);
      if (isFavorito) {
        await removerFavorito(anuncio.id);
        setIsFavorito(false);
        onDesfavoritar?.(anuncio);
      } else {
        await salvarFavorito(anuncio.id);
        setIsFavorito(true);
        onFavoritar?.(anuncio);
      }
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const renderAvaliacao = () => {
    if (!anuncio.avaliacao_media) return null;
    
    return (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{anuncio.avaliacao_media.toFixed(1)}</span>
        <span className="text-gray-400">({anuncio.numero_avaliacoes})</span>
      </div>
    );
  };

  const renderComodidades = () => {
    if (!anuncio.comodidades) return null;
    
    const comodidades = JSON.parse(anuncio.comodidades || '[]');
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {comodidades.slice(0, 3).map((comodidade, index) => (
          <span 
            key={index}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
          >
            {comodidade}
          </span>
        ))}
        {comodidades.length > 3 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
            +{comodidades.length - 3}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden" hover>
      {/* Badge de destaque */}
      {anuncio.destaque && (
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-medium">
            Destaque
          </span>
        </div>
      )}

      {/* Imagem do anúncio */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {anuncio.fotos ? (
          <img 
            src={JSON.parse(anuncio.fotos)[0]} 
            alt={anuncio.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Users className="w-12 h-12" />
          </div>
        )}
        
        {/* Botão de favoritar */}
        {showActions && (
          <button
            onClick={handleFavoritar}
            disabled={loading}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : isFavorito ? (
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            ) : (
              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
            )}
          </button>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Título e preço */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {anuncio.titulo}
          </h3>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              {formatarPreco(anuncio.preco_por_noite)}
            </p>
            <p className="text-xs text-gray-500">por noite</p>
          </div>
        </div>

        {/* Localização */}
        {anuncio.localizacao && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{anuncio.localizacao}</span>
          </div>
        )}

        {/* Avaliação */}
        {renderAvaliacao()}

        {/* Descrição */}
        {anuncio.descricao && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {anuncio.descricao}
          </p>
        )}

        {/* Comodidades */}
        {renderComodidades()}

        {/* Ações */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="small" 
              className="flex-1"
              onClick={() => window.open(`/anuncios/${anuncio.id}`, '_blank')}
            >
              Ver detalhes
            </Button>
            <Button 
              variant={isFavorito ? "danger" : "primary"} 
              size="small"
              onClick={handleFavoritar}
              loading={loading}
            >
              {isFavorito ? (
                <>
                  <HeartOff className="w-4 h-4 mr-1" />
                  Remover
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-1" />
                  Favoritar
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AnuncioCard; 