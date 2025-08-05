import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Erro na API:', error);
    throw new Error(error.response?.data?.message || 'Erro na comunicação com o servidor');
  }
);

export const favoritosService = {
  // Favoritos
  async salvarFavorito(usuarioId, anuncioId, pastaId = null) {
    return api.post('/favoritos', {
      usuario_id: usuarioId,
      anuncio_id: anuncioId,
      pasta_id: pastaId
    });
  },

  async removerFavorito(usuarioId, anuncioId) {
    return api.delete('/favoritos', {
      data: {
        usuario_id: usuarioId,
        anuncio_id: anuncioId
      }
    });
  },

  async listarFavoritos(usuarioId, filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    
    return api.get(`/usuarios/${usuarioId}/favoritos?${params.toString()}`);
  },

  async verificarFavorito(usuarioId, anuncioId) {
    return api.get('/favoritos/verificar', {
      params: { usuario_id: usuarioId, anuncio_id: anuncioId }
    });
  },

  // Pastas
  async criarPasta(usuarioId, nome, descricao = '', cor = '#007bff') {
    return api.post('/pastas', {
      usuario_id: usuarioId,
      nome,
      descricao,
      cor
    });
  },

  async listarPastas(usuarioId) {
    return api.get(`/usuarios/${usuarioId}/pastas`);
  },

  async moverParaPasta(usuarioId, favoritoId, pastaId) {
    return api.post('/favoritos/mover-pasta', {
      usuario_id: usuarioId,
      favorito_id: favoritoId,
      pasta_id: pastaId
    });
  },

  // Alertas
  async definirAlertaPreco(usuarioId, favoritoId, precoMaximo) {
    return api.post('/favoritos/alerta-preco', {
      usuario_id: usuarioId,
      favorito_id: favoritoId,
      preco_maximo: precoMaximo
    });
  },

  async definirAlertaDisponibilidade(usuarioId, favoritoId, dataInicio, dataFim) {
    return api.post('/favoritos/alerta-disponibilidade', {
      usuario_id: usuarioId,
      favorito_id: favoritoId,
      data_inicio: dataInicio,
      data_fim: dataFim
    });
  },

  // Ações
  async marcarComoVisitado(usuarioId, favoritoId, comentarios = '') {
    return api.post('/favoritos/marcar-visitado', {
      usuario_id: usuarioId,
      favorito_id: favoritoId,
      comentarios
    });
  },

  // Compartilhamento
  async compartilharFavoritos(usuarioId, tipo = 'lista', dadosCompartilhados = null) {
    return api.post('/favoritos/compartilhar', {
      usuario_id: usuarioId,
      tipo,
      dados_compartilhados: dadosCompartilhados
    });
  },

  async visualizarCompartilhado(codigo) {
    return api.get(`/favoritos/compartilhado/${codigo}`);
  },

  // Sugestões e comparação
  async gerarSugestoes(usuarioId, limite = 5) {
    return api.get(`/usuarios/${usuarioId}/sugestoes`, {
      params: { limite }
    });
  },

  async compararFavoritos(usuarioId, favoritoIds) {
    return api.post('/favoritos/comparar', {
      usuario_id: usuarioId,
      favorito_ids: favoritoIds
    });
  },

  // Manutenção
  async limparFavoritosAntigos(usuarioId, meses = 6) {
    return api.delete(`/usuarios/${usuarioId}/favoritos/limpar-antigos`, {
      params: { meses }
    });
  },

  async gerarRelatorio(usuarioId) {
    return api.get(`/usuarios/${usuarioId}/favoritos/relatorio`);
  },

  // Anúncios
  async listarAnuncios() {
    return api.get('/anuncios');
  },

  async buscarAnuncio(id) {
    return api.get(`/anuncios/${id}`);
  },

  // Usuários
  async listarUsuarios() {
    return api.get('/usuarios');
  },

  async criarUsuario(dados) {
    return api.post('/usuarios', dados);
  },

  // Notificações
  async listarNotificacoes(usuarioId, lida = null) {
    const params = lida !== null ? { lida } : {};
    return api.get(`/usuarios/${usuarioId}/notificacoes`, { params });
  },

  async marcarNotificacaoComoLida(id) {
    return api.put(`/notificacoes/${id}/marcar-lida`);
  },

  // Histórico
  async listarHistorico(usuarioId, acao = null, limit = 50) {
    const params = { limit };
    if (acao) params.acao = acao;
    return api.get(`/usuarios/${usuarioId}/historico-favoritos`, { params });
  },

  // Estatísticas
  async buscarEstatisticas(usuarioId) {
    return api.get(`/usuarios/${usuarioId}/estatisticas-favoritos`);
  },

  // Exportação
  async exportarFavoritos(usuarioId, formato = 'json') {
    return api.get(`/usuarios/${usuarioId}/favoritos/exportar`, {
      params: { formato }
    });
  }
}; 