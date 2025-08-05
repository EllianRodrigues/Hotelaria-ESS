import { createContext, useContext, useReducer, useEffect } from 'react';
import { favoritosService } from '../services/favoritosService';

// Estado inicial
const initialState = {
  favoritos: [],
  pastas: [],
  loading: false,
  error: null,
  selectedFavorito: null,
  filtros: {
    pasta_id: null,
    visitado: null,
    ordenacao: 'data_salvamento',
    direcao: 'DESC'
  }
};

// Tipos de ações
const FAVORITOS_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FAVORITOS: 'SET_FAVORITOS',
  ADD_FAVORITO: 'ADD_FAVORITO',
  REMOVE_FAVORITO: 'REMOVE_FAVORITO',
  SET_PASTAS: 'SET_PASTAS',
  ADD_PASTA: 'ADD_PASTA',
  SET_FILTROS: 'SET_FILTROS',
  SET_SELECTED_FAVORITO: 'SET_SELECTED_FAVORITO',
  UPDATE_FAVORITO: 'UPDATE_FAVORITO'
};

// Reducer
function favoritosReducer(state, action) {
  switch (action.type) {
    case FAVORITOS_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case FAVORITOS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case FAVORITOS_ACTIONS.SET_FAVORITOS:
      return { ...state, favoritos: action.payload, loading: false };
    
    case FAVORITOS_ACTIONS.ADD_FAVORITO:
      return { 
        ...state, 
        favoritos: [...state.favoritos, action.payload],
        loading: false 
      };
    
    case FAVORITOS_ACTIONS.REMOVE_FAVORITO:
      return { 
        ...state, 
        favoritos: state.favoritos.filter(f => f.id !== action.payload),
        loading: false 
      };
    
    case FAVORITOS_ACTIONS.SET_PASTAS:
      return { ...state, pastas: action.payload };
    
    case FAVORITOS_ACTIONS.ADD_PASTA:
      return { 
        ...state, 
        pastas: [...state.pastas, action.payload] 
      };
    
    case FAVORITOS_ACTIONS.SET_FILTROS:
      return { ...state, filtros: { ...state.filtros, ...action.payload } };
    
    case FAVORITOS_ACTIONS.SET_SELECTED_FAVORITO:
      return { ...state, selectedFavorito: action.payload };
    
    case FAVORITOS_ACTIONS.UPDATE_FAVORITO:
      return {
        ...state,
        favoritos: state.favoritos.map(f => 
          f.id === action.payload.id ? action.payload : f
        )
      };
    
    default:
      return state;
  }
}

// Contexto
const FavoritosContext = createContext();

// Provider
export function FavoritosProvider({ children }) {
  const [state, dispatch] = useReducer(favoritosReducer, initialState);

  // Carregar favoritos iniciais
  useEffect(() => {
    carregarFavoritos();
    carregarPastas();
  }, []);

  // Carregar favoritos quando filtros mudarem
  useEffect(() => {
    carregarFavoritos();
  }, [state.filtros]);

  const carregarFavoritos = async () => {
    try {
      dispatch({ type: FAVORITOS_ACTIONS.SET_LOADING, payload: true });
      const favoritos = await favoritosService.listarFavoritos(1, state.filtros);
      dispatch({ type: FAVORITOS_ACTIONS.SET_FAVORITOS, payload: favoritos });
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const carregarPastas = async () => {
    try {
      const pastas = await favoritosService.listarPastas(1);
      dispatch({ type: FAVORITOS_ACTIONS.SET_PASTAS, payload: pastas });
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
    }
  };

  const salvarFavorito = async (anuncioId, pastaId = null) => {
    try {
      dispatch({ type: FAVORITOS_ACTIONS.SET_LOADING, payload: true });
      const novoFavorito = await favoritosService.salvarFavorito(1, anuncioId, pastaId);
      dispatch({ type: FAVORITOS_ACTIONS.ADD_FAVORITO, payload: novoFavorito });
      return novoFavorito;
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const removerFavorito = async (anuncioId) => {
    try {
      dispatch({ type: FAVORITOS_ACTIONS.SET_LOADING, payload: true });
      await favoritosService.removerFavorito(1, anuncioId);
      dispatch({ type: FAVORITOS_ACTIONS.REMOVE_FAVORITO, payload: anuncioId });
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const criarPasta = async (nome, descricao, cor) => {
    try {
      const novaPasta = await favoritosService.criarPasta(1, nome, descricao, cor);
      dispatch({ type: FAVORITOS_ACTIONS.ADD_PASTA, payload: novaPasta });
      return novaPasta;
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const definirAlertaPreco = async (favoritoId, precoMaximo) => {
    try {
      await favoritosService.definirAlertaPreco(1, favoritoId, precoMaximo);
      // Recarregar favoritos para atualizar o alerta
      await carregarFavoritos();
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const marcarComoVisitado = async (favoritoId, comentarios) => {
    try {
      const favoritoAtualizado = await favoritosService.marcarComoVisitado(1, favoritoId, comentarios);
      dispatch({ type: FAVORITOS_ACTIONS.UPDATE_FAVORITO, payload: favoritoAtualizado });
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const compartilharFavoritos = async (tipo = 'lista') => {
    try {
      return await favoritosService.compartilharFavoritos(1, tipo);
    } catch (error) {
      dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const setFiltros = (novosFiltros) => {
    dispatch({ type: FAVORITOS_ACTIONS.SET_FILTROS, payload: novosFiltros });
  };

  const setSelectedFavorito = (favorito) => {
    dispatch({ type: FAVORITOS_ACTIONS.SET_SELECTED_FAVORITO, payload: favorito });
  };

  const limparErro = () => {
    dispatch({ type: FAVORITOS_ACTIONS.SET_ERROR, payload: null });
  };

  const value = {
    ...state,
    salvarFavorito,
    removerFavorito,
    criarPasta,
    definirAlertaPreco,
    marcarComoVisitado,
    compartilharFavoritos,
    setFiltros,
    setSelectedFavorito,
    limparErro,
    carregarFavoritos
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
}

// Hook personalizado
export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
} 