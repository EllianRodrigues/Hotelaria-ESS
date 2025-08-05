const favoritosService = require('../services/favoritosService.js');

module.exports = {
  // Salvar anúncio como favorito
  async salvarFavorito(req, res) {
    try {
      const { usuario_id, anuncio_id, pasta_id } = req.body;

      if (!usuario_id || !anuncio_id) {
        return res.status(400).json({
          message: 'Usuário ID e Anúncio ID são obrigatórios',
          required: ['usuario_id', 'anuncio_id']
        });
      }

      const resultado = await favoritosService.salvarFavorito(usuario_id, anuncio_id, pasta_id);

      return res.status(201).json({
        success: true,
        message: 'Anúncio salvo como favorito com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
      
      if (error.message === 'Anúncio já está nos favoritos') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message === 'Anúncio não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Remover favorito
  async removerFavorito(req, res) {
    try {
      const { usuario_id, anuncio_id } = req.body;

      if (!usuario_id || !anuncio_id) {
        return res.status(400).json({
          message: 'Usuário ID e Anúncio ID são obrigatórios',
          required: ['usuario_id', 'anuncio_id']
        });
      }

      const resultado = await favoritosService.removerFavorito(usuario_id, anuncio_id);

      return res.status(200).json({
        success: true,
        message: 'Favorito removido com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      
      if (error.message === 'Favorito não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Listar favoritos do usuário
  async listarFavoritos(req, res) {
    try {
      const { usuario_id } = req.params;
      const { pasta_id, visitado, ordenacao, direcao } = req.query;

      if (!usuario_id) {
        return res.status(400).json({
          message: 'Usuário ID é obrigatório'
        });
      }

      const filtros = {};
      if (pasta_id) filtros.pasta_id = pasta_id;
      if (visitado !== undefined) filtros.visitado = visitado === 'true';
      if (ordenacao) filtros.ordenacao = ordenacao;
      if (direcao) filtros.direcao = direcao;

      const favoritos = await favoritosService.listarFavoritos(usuario_id, filtros);

      return res.status(200).json({
        success: true,
        data: favoritos,
        total: favoritos.length
      });

    } catch (error) {
      console.error('Erro ao listar favoritos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Verificar se anúncio é favorito
  async verificarFavorito(req, res) {
    try {
      const { usuario_id, anuncio_id } = req.query;

      if (!usuario_id || !anuncio_id) {
        return res.status(400).json({
          message: 'Usuário ID e Anúncio ID são obrigatórios',
          required: ['usuario_id', 'anuncio_id']
        });
      }

      const resultado = await favoritosService.verificarFavorito(usuario_id, anuncio_id);

      return res.status(200).json({
        success: true,
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Criar pasta de favoritos
  async criarPasta(req, res) {
    try {
      const { usuario_id, nome, descricao, cor } = req.body;

      if (!usuario_id || !nome) {
        return res.status(400).json({
          message: 'Usuário ID e Nome são obrigatórios',
          required: ['usuario_id', 'nome']
        });
      }

      const pasta = await favoritosService.criarPasta(usuario_id, nome, descricao, cor);

      return res.status(201).json({
        success: true,
        message: 'Pasta criada com sucesso',
        data: pasta
      });

    } catch (error) {
      console.error('Erro ao criar pasta:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Listar pastas do usuário
  async listarPastas(req, res) {
    try {
      const { usuario_id } = req.params;

      if (!usuario_id) {
        return res.status(400).json({
          message: 'Usuário ID é obrigatório'
        });
      }

      const pastas = await favoritosService.listarPastas(usuario_id);

      return res.status(200).json({
        success: true,
        data: pastas,
        total: pastas.length
      });

    } catch (error) {
      console.error('Erro ao listar pastas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Mover favorito para pasta
  async moverParaPasta(req, res) {
    try {
      const { usuario_id, favorito_id, pasta_id } = req.body;

      if (!usuario_id || !favorito_id) {
        return res.status(400).json({
          message: 'Usuário ID e Favorito ID são obrigatórios',
          required: ['usuario_id', 'favorito_id']
        });
      }

      const resultado = await favoritosService.moverParaPasta(usuario_id, favorito_id, pasta_id);

      return res.status(200).json({
        success: true,
        message: 'Favorito movido com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao mover favorito:', error);
      
      if (error.message === 'Favorito não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Definir alerta de preço
  async definirAlertaPreco(req, res) {
    try {
      const { usuario_id, favorito_id, preco_maximo } = req.body;

      if (!usuario_id || !favorito_id || !preco_maximo) {
        return res.status(400).json({
          message: 'Usuário ID, Favorito ID e Preço Máximo são obrigatórios',
          required: ['usuario_id', 'favorito_id', 'preco_maximo']
        });
      }

      const resultado = await favoritosService.definirAlertaPreco(usuario_id, favorito_id, preco_maximo);

      return res.status(200).json({
        success: true,
        message: 'Alerta de preço definido com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao definir alerta de preço:', error);
      
      if (error.message === 'Favorito não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Definir alerta de disponibilidade
  async definirAlertaDisponibilidade(req, res) {
    try {
      const { usuario_id, favorito_id, data_inicio, data_fim } = req.body;

      if (!usuario_id || !favorito_id || !data_inicio || !data_fim) {
        return res.status(400).json({
          message: 'Todos os campos são obrigatórios',
          required: ['usuario_id', 'favorito_id', 'data_inicio', 'data_fim']
        });
      }

      const resultado = await favoritosService.definirAlertaDisponibilidade(usuario_id, favorito_id, data_inicio, data_fim);

      return res.status(200).json({
        success: true,
        message: 'Alerta de disponibilidade definido com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao definir alerta de disponibilidade:', error);
      
      if (error.message === 'Favorito não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Marcar favorito como visitado
  async marcarComoVisitado(req, res) {
    try {
      const { usuario_id, favorito_id, comentarios } = req.body;

      if (!usuario_id || !favorito_id) {
        return res.status(400).json({
          message: 'Usuário ID e Favorito ID são obrigatórios',
          required: ['usuario_id', 'favorito_id']
        });
      }

      const resultado = await favoritosService.marcarComoVisitado(usuario_id, favorito_id, comentarios);

      return res.status(200).json({
        success: true,
        message: 'Favorito marcado como visitado',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao marcar como visitado:', error);
      
      if (error.message === 'Favorito não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Compartilhar favoritos
  async compartilharFavoritos(req, res) {
    try {
      const { usuario_id, tipo, dados_compartilhados } = req.body;

      if (!usuario_id) {
        return res.status(400).json({
          message: 'Usuário ID é obrigatório',
          required: ['usuario_id']
        });
      }

      const resultado = await favoritosService.compartilharFavoritos(usuario_id, tipo, dados_compartilhados);

      return res.status(200).json({
        success: true,
        message: 'Link de compartilhamento gerado com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao compartilhar favoritos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Visualizar favoritos compartilhados
  async visualizarCompartilhado(req, res) {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        return res.status(400).json({
          message: 'Código de compartilhamento é obrigatório'
        });
      }

      const resultado = await favoritosService.visualizarCompartilhado(codigo);

      return res.status(200).json({
        success: true,
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao visualizar compartilhado:', error);
      
      if (error.message === 'Link de compartilhamento inválido ou expirado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Gerar sugestões
  async gerarSugestoes(req, res) {
    try {
      const { usuario_id } = req.params;
      const { limite } = req.query;

      if (!usuario_id) {
        return res.status(400).json({
          message: 'Usuário ID é obrigatório'
        });
      }

      const sugestoes = await favoritosService.gerarSugestoes(usuario_id, parseInt(limite) || 5);

      return res.status(200).json({
        success: true,
        data: sugestoes,
        total: sugestoes.length
      });

    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Comparar favoritos
  async compararFavoritos(req, res) {
    try {
      const { usuario_id, favorito_ids } = req.body;

      if (!usuario_id || !favorito_ids || !Array.isArray(favorito_ids)) {
        return res.status(400).json({
          message: 'Usuário ID e lista de Favorito IDs são obrigatórios',
          required: ['usuario_id', 'favorito_ids']
        });
      }

      const resultado = await favoritosService.compararFavoritos(usuario_id, favorito_ids);

      return res.status(200).json({
        success: true,
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao comparar favoritos:', error);
      
      if (error.message.includes('Selecione entre 2 e 5 favoritos')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('não foram encontrados')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Limpar favoritos antigos
  async limparFavoritosAntigos(req, res) {
    try {
      const { usuario_id } = req.params;
      const { meses } = req.query;

      if (!usuario_id) {
        return res.status(400).json({
          message: 'Usuário ID é obrigatório'
        });
      }

      const resultado = await favoritosService.limparFavoritosAntigos(usuario_id, parseInt(meses) || 6);

      return res.status(200).json({
        success: true,
        message: resultado.mensagem,
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao limpar favoritos antigos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // Gerar relatório
  async gerarRelatorio(req, res) {
    try {
      const { usuario_id } = req.params;

      if (!usuario_id) {
        return res.status(400).json({
          message: 'Usuário ID é obrigatório'
        });
      }

      const relatorio = await favoritosService.gerarRelatorio(usuario_id);

      return res.status(200).json({
        success: true,
        data: relatorio
      });

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}; 