const db = require('../db.js');

class FavoritosService {
  // Salvar anúncio como favorito
  async salvarFavorito(usuarioId, anuncioId, pastaId = null) {
    return new Promise((resolve, reject) => {
      // Verificar se já existe como favorito
      const checkQuery = 'SELECT id FROM favoritos WHERE usuario_id = ? AND anuncio_id = ? AND status = "ativo"';
      db.get(checkQuery, [usuarioId, anuncioId], (err, existing) => {
        if (err) return reject(err);
        
        if (existing) {
          return reject(new Error('Anúncio já está nos favoritos'));
        }

        // Verificar se o anúncio existe
        const anuncioQuery = 'SELECT * FROM anuncios WHERE id = ? AND status = "ativo"';
        db.get(anuncioQuery, [anuncioId], (err, anuncio) => {
          if (err) return reject(err);
          if (!anuncio) {
            return reject(new Error('Anúncio não encontrado'));
          }

          // Inserir favorito
          const insertQuery = `
            INSERT INTO favoritos (usuario_id, anuncio_id, pasta_id, data_salvamento)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `;
          
          db.run(insertQuery, [usuarioId, anuncioId, pastaId], function (err) {
            if (err) return reject(err);
            
            const favoritoId = this.lastID;
            
            // Registrar no histórico
            this.registrarHistorico(usuarioId, anuncioId, 'salvar', null, { pasta_id: pastaId });
            
            resolve({
              id: favoritoId,
              usuario_id: usuarioId,
              anuncio_id: anuncioId,
              pasta_id: pastaId,
              data_salvamento: new Date().toISOString(),
              mensagem: 'Anúncio salvo como favorito com sucesso'
            });
          }.bind(this));
        });
      });
    });
  }

  // Remover favorito
  async removerFavorito(usuarioId, anuncioId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE favoritos 
        SET status = 'removido', data_remocao = CURRENT_TIMESTAMP
        WHERE usuario_id = ? AND anuncio_id = ? AND status = 'ativo'
      `;
      
      db.run(query, [usuarioId, anuncioId], function (err) {
        if (err) return reject(err);
        
        if (this.changes === 0) {
          return reject(new Error('Favorito não encontrado'));
        }
        
        // Registrar no histórico
        this.registrarHistorico(usuarioId, anuncioId, 'remover', null, null);
        
        resolve({
          mensagem: 'Favorito removido com sucesso',
          anuncio_id: anuncioId
        });
      }.bind(this));
    });
  }

  // Listar favoritos do usuário
  async listarFavoritos(usuarioId, filtros = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT f.*, a.*, p.nome as pasta_nome, p.cor as pasta_cor
        FROM favoritos f
        JOIN anuncios a ON f.anuncio_id = a.id
        LEFT JOIN pastas_favoritos p ON f.pasta_id = p.id
        WHERE f.usuario_id = ? AND f.status = 'ativo'
      `;
      
      const params = [usuarioId];
      
      // Aplicar filtros
      if (filtros.pasta_id) {
        query += ' AND f.pasta_id = ?';
        params.push(filtros.pasta_id);
      }
      
      if (filtros.visitado !== undefined) {
        query += ' AND f.visitado = ?';
        params.push(filtros.visitado);
      }
      
      // Ordenação
      const ordenacao = filtros.ordenacao || 'data_salvamento';
      const direcao = filtros.direcao || 'DESC';
      query += ` ORDER BY ${ordenacao} ${direcao}`;
      
      db.all(query, params, (err, favoritos) => {
        if (err) return reject(err);
        
        resolve(favoritos.map(favorito => ({
          id: favorito.id,
          anuncio: {
            id: favorito.anuncio_id,
            titulo: favorito.titulo,
            descricao: favorito.descricao,
            preco_por_noite: favorito.preco_por_noite,
            localizacao: favorito.localizacao,
            avaliacao_media: favorito.avaliacao_media,
            numero_avaliacoes: favorito.numero_avaliacoes,
            comodidades: favorito.comodidades,
            politica_cancelamento: favorito.politica_cancelamento,
            fotos: favorito.fotos
          },
          pasta: favorito.pasta_id ? {
            id: favorito.pasta_id,
            nome: favorito.pasta_nome,
            cor: favorito.pasta_cor
          } : null,
          data_salvamento: favorito.data_salvamento,
          visitado: favorito.visitado,
          data_visita: favorito.data_visita,
          comentarios_pessoais: favorito.comentarios_pessoais,
          alerta_preco: favorito.alerta_preco,
          alerta_disponibilidade: favorito.alerta_disponibilidade
        })));
      });
    });
  }

  // Criar pasta de favoritos
  async criarPasta(usuarioId, nome, descricao = '', cor = '#007bff') {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO pastas_favoritos (usuario_id, nome, descricao, cor)
        VALUES (?, ?, ?, ?)
      `;
      
      db.run(query, [usuarioId, nome, descricao, cor], function (err) {
        if (err) return reject(err);
        
        resolve({
          id: this.lastID,
          usuario_id: usuarioId,
          nome,
          descricao,
          cor,
          created_at: new Date().toISOString()
        });
      });
    });
  }

  // Listar pastas do usuário
  async listarPastas(usuarioId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, COUNT(f.id) as total_favoritos
        FROM pastas_favoritos p
        LEFT JOIN favoritos f ON p.id = f.pasta_id AND f.status = 'ativo'
        WHERE p.usuario_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      
      db.all(query, [usuarioId], (err, pastas) => {
        if (err) return reject(err);
        resolve(pastas);
      });
    });
  }

  // Mover favorito para pasta
  async moverParaPasta(usuarioId, favoritoId, pastaId) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE favoritos SET pasta_id = ? WHERE id = ? AND usuario_id = ?';
      
      db.run(query, [pastaId, favoritoId, usuarioId], function (err) {
        if (err) return reject(err);
        
        if (this.changes === 0) {
          return reject(new Error('Favorito não encontrado'));
        }
        
        resolve({
          mensagem: 'Favorito movido para pasta com sucesso',
          favorito_id: favoritoId,
          pasta_id: pastaId
        });
      });
    });
  }

  // Definir alerta de preço
  async definirAlertaPreco(usuarioId, favoritoId, precoMaximo) {
    return new Promise((resolve, reject) => {
      // Verificar se o favorito pertence ao usuário
      const checkQuery = 'SELECT id FROM favoritos WHERE id = ? AND usuario_id = ? AND status = "ativo"';
      db.get(checkQuery, [favoritoId, usuarioId], (err, favorito) => {
        if (err) return reject(err);
        if (!favorito) {
          return reject(new Error('Favorito não encontrado'));
        }

        // Atualizar ou inserir alerta
        const query = `
          INSERT OR REPLACE INTO alertas_preco (favorito_id, preco_maximo, ativo)
          VALUES (?, ?, 1)
        `;
        
        db.run(query, [favoritoId, precoMaximo], function (err) {
          if (err) return reject(err);
          
          resolve({
            mensagem: 'Alerta de preço definido com sucesso',
            favorito_id: favoritoId,
            preco_maximo: precoMaximo
          });
        });
      });
    });
  }

  // Definir alerta de disponibilidade
  async definirAlertaDisponibilidade(usuarioId, favoritoId, dataInicio, dataFim) {
    return new Promise((resolve, reject) => {
      // Verificar se o favorito pertence ao usuário
      const checkQuery = 'SELECT id FROM favoritos WHERE id = ? AND usuario_id = ? AND status = "ativo"';
      db.get(checkQuery, [favoritoId, usuarioId], (err, favorito) => {
        if (err) return reject(err);
        if (!favorito) {
          return reject(new Error('Favorito não encontrado'));
        }

        // Atualizar ou inserir alerta
        const query = `
          INSERT OR REPLACE INTO alertas_disponibilidade (favorito_id, data_inicio, data_fim, ativo)
          VALUES (?, ?, ?, 1)
        `;
        
        db.run(query, [favoritoId, dataInicio, dataFim], function (err) {
          if (err) return reject(err);
          
          resolve({
            mensagem: 'Alerta de disponibilidade definido com sucesso',
            favorito_id: favoritoId,
            data_inicio: dataInicio,
            data_fim: dataFim
          });
        });
      });
    });
  }

  // Marcar favorito como visitado
  async marcarComoVisitado(usuarioId, favoritoId, comentarios = '') {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE favoritos 
        SET visitado = 1, data_visita = CURRENT_TIMESTAMP, comentarios_pessoais = ?
        WHERE id = ? AND usuario_id = ? AND status = 'ativo'
      `;
      
      db.run(query, [comentarios, favoritoId, usuarioId], function (err) {
        if (err) return reject(err);
        
        if (this.changes === 0) {
          return reject(new Error('Favorito não encontrado'));
        }
        
        resolve({
          mensagem: 'Favorito marcado como visitado',
          favorito_id: favoritoId,
          data_visita: new Date().toISOString()
        });
      });
    });
  }

  // Compartilhar lista de favoritos
  async compartilharFavoritos(usuarioId, tipo = 'lista', dadosCompartilhados = null) {
    return new Promise((resolve, reject) => {
      const codigoUnico = this.gerarCodigoUnico();
      const expiraEm = new Date();
      expiraEm.setDate(expiraEm.getDate() + 7); // Expira em 7 dias
      
      const query = `
        INSERT INTO compartilhamento_favoritos (usuario_id, codigo_unico, tipo, dados_compartilhados, expira_em)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(query, [usuarioId, codigoUnico, tipo, dadosCompartilhados, expiraEm.toISOString()], function (err) {
        if (err) return reject(err);
        
        resolve({
          codigo_unico: codigoUnico,
          link_compartilhamento: `http://localhost:3000/api/favoritos/compartilhado/${codigoUnico}`,
          expira_em: expiraEm.toISOString()
        });
      });
    });
  }

  // Visualizar favoritos compartilhados
  async visualizarCompartilhado(codigoUnico) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT cf.*, u.nome as usuario_nome
        FROM compartilhamento_favoritos cf
        JOIN usuarios u ON cf.usuario_id = u.id
        WHERE cf.codigo_unico = ? AND cf.expira_em > datetime('now')
      `;
      
      db.get(query, [codigoUnico], (err, compartilhamento) => {
        if (err) return reject(err);
        if (!compartilhamento) {
          return reject(new Error('Link de compartilhamento inválido ou expirado'));
        }

        // Incrementar visualizações
        db.run('UPDATE compartilhamento_favoritos SET visualizacoes = visualizacoes + 1 WHERE codigo_unico = ?', [codigoUnico]);

        // Buscar favoritos compartilhados
        this.listarFavoritos(compartilhamento.usuario_id).then(favoritos => {
          resolve({
            compartilhamento: {
              usuario: compartilhamento.usuario_nome,
              tipo: compartilhamento.tipo,
              visualizacoes: compartilhamento.visualizacoes + 1,
              expira_em: compartilhamento.expira_em
            },
            favoritos
          });
        }).catch(reject);
      });
    });
  }

  // Gerar sugestões baseadas em favoritos
  async gerarSugestoes(usuarioId, limite = 5) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT DISTINCT a.*, 
               (a.avaliacao_media * 0.4 + (1 / a.preco_por_noite) * 0.6) as score
        FROM anuncios a
        WHERE a.id NOT IN (
          SELECT anuncio_id FROM favoritos WHERE usuario_id = ? AND status = 'ativo'
        )
        AND a.status = 'ativo'
        ORDER BY score DESC
        LIMIT ?
      `;
      
      db.all(query, [usuarioId, limite], (err, sugestoes) => {
        if (err) return reject(err);
        
        resolve(sugestoes.map(sugestao => ({
          id: sugestao.id,
          titulo: sugestao.titulo,
          descricao: sugestao.descricao,
          preco_por_noite: sugestao.preco_por_noite,
          localizacao: sugestao.localizacao,
          avaliacao_media: sugestao.avaliacao_media,
          score: sugestao.score,
          motivo: 'Baseado em seus favoritos'
        })));
      });
    });
  }

  // Comparar favoritos
  async compararFavoritos(usuarioId, favoritoIds) {
    return new Promise((resolve, reject) => {
      if (favoritoIds.length < 2 || favoritoIds.length > 5) {
        return reject(new Error('Selecione entre 2 e 5 favoritos para comparar'));
      }

      const placeholders = favoritoIds.map(() => '?').join(',');
      const query = `
        SELECT f.*, a.*
        FROM favoritos f
        JOIN anuncios a ON f.anuncio_id = a.id
        WHERE f.id IN (${placeholders}) AND f.usuario_id = ? AND f.status = 'ativo'
        ORDER BY a.preco_por_noite ASC
      `;
      
      const params = [...favoritoIds, usuarioId];
      
      db.all(query, params, (err, favoritos) => {
        if (err) return reject(err);
        
        if (favoritos.length !== favoritoIds.length) {
          return reject(new Error('Alguns favoritos não foram encontrados'));
        }
        
        resolve({
          comparacao: favoritos.map(favorito => ({
            id: favorito.id,
            titulo: favorito.titulo,
            preco_por_noite: favorito.preco_por_noite,
            localizacao: favorito.localizacao,
            avaliacao_media: favorito.avaliacao_media,
            comodidades: favorito.comodidades,
            politica_cancelamento: favorito.politica_cancelamento
          })),
          total_comparados: favoritos.length
        });
      });
    });
  }

  // Verificar se anúncio é favorito
  async verificarFavorito(usuarioId, anuncioId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, pasta_id FROM favoritos WHERE usuario_id = ? AND anuncio_id = ? AND status = "ativo"';
      
      db.get(query, [usuarioId, anuncioId], (err, favorito) => {
        if (err) return reject(err);
        
        resolve({
          is_favorito: !!favorito,
          favorito_id: favorito ? favorito.id : null,
          pasta_id: favorito ? favorito.pasta_id : null
        });
      });
    });
  }

  // Limpar favoritos antigos
  async limparFavoritosAntigos(usuarioId, meses = 6) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE favoritos 
        SET status = 'removido', data_remocao = CURRENT_TIMESTAMP
        WHERE usuario_id = ? 
        AND status = 'ativo'
        AND data_salvamento < datetime('now', '-${meses} months')
      `;
      
      db.run(query, [usuarioId], function (err) {
        if (err) return reject(err);
        
        resolve({
          mensagem: `${this.changes} favoritos antigos foram removidos`,
          favoritos_removidos: this.changes
        });
      });
    });
  }

  // Gerar relatório de favoritos
  async gerarRelatorio(usuarioId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as total_favoritos,
          COUNT(CASE WHEN visitado = 1 THEN 1 END) as favoritos_visitados,
          COUNT(CASE WHEN pasta_id IS NOT NULL THEN 1 END) as favoritos_organizados,
          AVG(a.avaliacao_media) as media_avaliacao,
          MIN(a.preco_por_noite) as menor_preco,
          MAX(a.preco_por_noite) as maior_preco,
          COUNT(CASE WHEN f.data_salvamento > datetime('now', '-7 days') THEN 1 END) as novos_esta_semana
        FROM favoritos f
        JOIN anuncios a ON f.anuncio_id = a.id
        WHERE f.usuario_id = ? AND f.status = 'ativo'
      `;
      
      db.get(query, [usuarioId], (err, relatorio) => {
        if (err) return reject(err);
        
        resolve({
          total_favoritos: relatorio.total_favoritos,
          favoritos_visitados: relatorio.favoritos_visitados,
          favoritos_organizados: relatorio.favoritos_organizados,
          media_avaliacao: relatorio.media_avaliacao,
          faixa_preco: {
            menor: relatorio.menor_preco,
            maior: relatorio.maior_preco
          },
          novos_esta_semana: relatorio.novos_esta_semana
        });
      });
    });
  }

  // Métodos auxiliares
  gerarCodigoUnico() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  registrarHistorico(usuarioId, anuncioId, acao, dadosAnteriores, dadosNovos) {
    const query = `
      INSERT INTO historico_favoritos (usuario_id, anuncio_id, acao, dados_anteriores, dados_novos)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query, [
      usuarioId, 
      anuncioId, 
      acao, 
      dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
      dadosNovos ? JSON.stringify(dadosNovos) : null
    ]);
  }
}

module.exports = new FavoritosService(); 