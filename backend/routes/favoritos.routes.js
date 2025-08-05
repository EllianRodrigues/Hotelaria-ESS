const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritos.controller');

// Rotas principais de favoritos
router.post('/favoritos', favoritosController.salvarFavorito);
router.delete('/favoritos', favoritosController.removerFavorito);
router.get('/favoritos/verificar', favoritosController.verificarFavorito);

// Rotas de listagem e gerenciamento
router.get('/usuarios/:usuario_id/favoritos', favoritosController.listarFavoritos);
router.post('/favoritos/mover-pasta', favoritosController.moverParaPasta);
router.post('/favoritos/marcar-visitado', favoritosController.marcarComoVisitado);

// Rotas de pastas
router.post('/pastas', favoritosController.criarPasta);
router.get('/usuarios/:usuario_id/pastas', favoritosController.listarPastas);

// Rotas de alertas
router.post('/favoritos/alerta-preco', favoritosController.definirAlertaPreco);
router.post('/favoritos/alerta-disponibilidade', favoritosController.definirAlertaDisponibilidade);

// Rotas de compartilhamento
router.post('/favoritos/compartilhar', favoritosController.compartilharFavoritos);
router.get('/favoritos/compartilhado/:codigo', favoritosController.visualizarCompartilhado);

// Rotas de sugestões e comparação
router.get('/usuarios/:usuario_id/sugestoes', favoritosController.gerarSugestoes);
router.post('/favoritos/comparar', favoritosController.compararFavoritos);

// Rotas de manutenção
router.delete('/usuarios/:usuario_id/favoritos/limpar-antigos', favoritosController.limparFavoritosAntigos);
router.get('/usuarios/:usuario_id/favoritos/relatorio', favoritosController.gerarRelatorio);

// Rotas para anúncios
router.get('/anuncios', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT * FROM anuncios WHERE status = "ativo" ORDER BY created_at DESC';
  
  db.all(query, [], (err, anuncios) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar anúncios' });
    }
    return res.status(200).json(anuncios);
  });
});

router.get('/anuncios/:id', (req, res) => {
  const db = require('../db.js');
  const { id } = req.params;
  
  const query = 'SELECT * FROM anuncios WHERE id = ? AND status = "ativo"';
  db.get(query, [id], (err, anuncio) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar anúncio' });
    }
    if (!anuncio) {
      return res.status(404).json({ message: 'Anúncio não encontrado' });
    }
    return res.status(200).json(anuncio);
  });
});

// Rotas para usuários
router.get('/usuarios', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT id, nome, email, telefone, data_nascimento FROM usuarios ORDER BY nome';
  
  db.all(query, [], (err, usuarios) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
    return res.status(200).json(usuarios);
  });
});

router.post('/usuarios', (req, res) => {
  const db = require('../db.js');
  const { nome, email, senha, telefone, data_nascimento } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
  }
  
  const query = 'INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)';
  
  db.run(query, [nome, email, senha, telefone, data_nascimento], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Email já cadastrado' });
      }
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
    
    return res.status(201).json({
      id: this.lastID,
      nome,
      email,
      telefone,
      data_nascimento
    });
  });
});

// Rotas para notificações
router.get('/usuarios/:usuario_id/notificacoes', (req, res) => {
  const db = require('../db.js');
  const { usuario_id } = req.params;
  const { lida } = req.query;
  
  let query = `
    SELECT n.*, a.titulo as anuncio_titulo
    FROM notificacoes n
    LEFT JOIN favoritos f ON n.favorito_id = f.id
    LEFT JOIN anuncios a ON f.anuncio_id = a.id
    WHERE n.usuario_id = ?
  `;
  
  const params = [usuario_id];
  
  if (lida !== undefined) {
    query += ' AND n.lida = ?';
    params.push(lida === 'true' ? 1 : 0);
  }
  
  query += ' ORDER BY n.created_at DESC';
  
  db.all(query, params, (err, notificacoes) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar notificações' });
    }
    return res.status(200).json(notificacoes);
  });
});

router.put('/notificacoes/:id/marcar-lida', (req, res) => {
  const db = require('../db.js');
  const { id } = req.params;
  
  const query = 'UPDATE notificacoes SET lida = 1 WHERE id = ?';
  
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao marcar notificação como lida' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }
    
    return res.status(200).json({ message: 'Notificação marcada como lida' });
  });
});

// Rotas para histórico de favoritos
router.get('/usuarios/:usuario_id/historico-favoritos', (req, res) => {
  const db = require('../db.js');
  const { usuario_id } = req.params;
  const { acao, limit = 50 } = req.query;
  
  let query = `
    SELECT h.*, a.titulo as anuncio_titulo
    FROM historico_favoritos h
    LEFT JOIN anuncios a ON h.anuncio_id = a.id
    WHERE h.usuario_id = ?
  `;
  
  const params = [usuario_id];
  
  if (acao) {
    query += ' AND h.acao = ?';
    params.push(acao);
  }
  
  query += ' ORDER BY h.created_at DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.all(query, params, (err, historico) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar histórico' });
    }
    return res.status(200).json(historico);
  });
});

// Rotas para estatísticas
router.get('/usuarios/:usuario_id/estatisticas-favoritos', (req, res) => {
  const db = require('../db.js');
  const { usuario_id } = req.params;
  
  const query = `
    SELECT 
      COUNT(*) as total_favoritos,
      COUNT(CASE WHEN visitado = 1 THEN 1 END) as favoritos_visitados,
      COUNT(CASE WHEN pasta_id IS NOT NULL THEN 1 END) as favoritos_organizados,
      COUNT(CASE WHEN data_salvamento > datetime('now', '-7 days') THEN 1 END) as novos_esta_semana,
      COUNT(CASE WHEN data_salvamento > datetime('now', '-30 days') THEN 1 END) as novos_este_mes,
      AVG(a.avaliacao_media) as media_avaliacao,
      MIN(a.preco_por_noite) as menor_preco,
      MAX(a.preco_por_noite) as maior_preco,
      AVG(a.preco_por_noite) as preco_medio
    FROM favoritos f
    JOIN anuncios a ON f.anuncio_id = a.id
    WHERE f.usuario_id = ? AND f.status = 'ativo'
  `;
  
  db.get(query, [usuario_id], (err, estatisticas) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
    return res.status(200).json(estatisticas);
  });
});

// Rotas para exportação
router.get('/usuarios/:usuario_id/favoritos/exportar', (req, res) => {
  const db = require('../db.js');
  const { usuario_id } = req.params;
  const { formato = 'json' } = req.query;
  
  const query = `
    SELECT f.*, a.*, p.nome as pasta_nome
    FROM favoritos f
    JOIN anuncios a ON f.anuncio_id = a.id
    LEFT JOIN pastas_favoritos p ON f.pasta_id = p.id
    WHERE f.usuario_id = ? AND f.status = 'ativo'
    ORDER BY f.data_salvamento DESC
  `;
  
  db.all(query, [usuario_id], (err, favoritos) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao exportar favoritos' });
    }
    
    if (formato === 'csv') {
      // Implementar exportação CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="favoritos.csv"');
      
      const csv = [
        'ID,Título,Preço,Localização,Avaliação,Pasta,Data Salvamento,Visitado',
        ...favoritos.map(f => 
          `${f.id},"${f.titulo}",${f.preco_por_noite},"${f.localizacao}",${f.avaliacao_media},"${f.pasta_nome || ''}","${f.data_salvamento}",${f.visitado}`
        )
      ].join('\n');
      
      return res.send(csv);
    }
    
    return res.status(200).json({
      usuario_id,
      total_favoritos: favoritos.length,
      data_exportacao: new Date().toISOString(),
      favoritos
    });
  });
});

module.exports = router; 