
const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservas.controller');

// Rotas principais de reservas
router.post('/reservas', reservasController.create);
router.get('/reservas', reservasController.getAll);
router.get('/reservas/:id', reservasController.getById);
router.put('/reservas/:id', reservasController.update);
router.delete('/reservas/:id/cancel', reservasController.cancel);

// Rota para calcular valor sem criar reserva
router.post('/reservas/calcular-valor', reservasController.calcularValor);

// Rotas para serviços
router.get('/services', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT * FROM services WHERE ativo = 1';
  
  db.all(query, [], (err, services) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar serviços' });
    }
    return res.status(200).json(services);
  });
});

// Rotas para quartos
router.get('/rooms', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT * FROM rooms WHERE disponivel = 1';
  
  db.all(query, [], (err, rooms) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar quartos' });
    }
    return res.status(200).json(rooms);
  });
});

router.get('/rooms/:id', (req, res) => {
  const db = require('../db.js');
  const { id } = req.params;
  
  const query = 'SELECT * FROM rooms WHERE id = ? AND disponivel = 1';
  db.get(query, [id], (err, room) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar quarto' });
    }
    if (!room) {
      return res.status(404).json({ message: 'Quarto não encontrado' });
    }
    return res.status(200).json(room);
  });
});

// Rotas para códigos promocionais
router.get('/promo-codes', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT codigo, desconto_percentual, desconto_fixo, tipo, data_inicio, data_fim FROM promo_codes WHERE ativo = 1';
  
  db.all(query, [], (err, codes) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar códigos promocionais' });
    }
    return res.status(200).json(codes);
  });
});

router.post('/promo-codes/validate', (req, res) => {
  const db = require('../db.js');
  const { codigo } = req.body;
  
  if (!codigo) {
    return res.status(400).json({ message: 'Código promocional é obrigatório' });
  }
  
  const query = `
    SELECT desconto_percentual, desconto_fixo, tipo, max_usos, usos_atuais, data_inicio, data_fim
    FROM promo_codes 
    WHERE codigo = ? AND ativo = 1
  `;
  
  db.get(query, [codigo], (err, promo) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao validar código promocional' });
    }
    
    if (!promo) {
      return res.status(404).json({ message: 'Código promocional inválido' });
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    if (hoje < promo.data_inicio || hoje > promo.data_fim) {
      return res.status(400).json({ message: 'Código promocional expirado' });
    }
    
    if (promo.usos_atuais >= promo.max_usos) {
      return res.status(400).json({ message: 'Código promocional esgotado' });
    }
    
    return res.status(200).json({
      valido: true,
      desconto_percentual: promo.desconto_percentual,
      desconto_fixo: promo.desconto_fixo,
      tipo: promo.tipo
    });
  });
});

// Rotas para temporadas
router.get('/seasons', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT * FROM seasons WHERE ativo = 1';
  
  db.all(query, [], (err, seasons) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar temporadas' });
    }
    return res.status(200).json(seasons);
  });
});

// Rotas para impostos
router.get('/taxes', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT * FROM taxes WHERE ativo = 1';
  
  db.all(query, [], (err, taxes) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar impostos' });
    }
    return res.status(200).json(taxes);
  });
});

// Rota para verificar disponibilidade de quarto
router.post('/rooms/:id/availability', (req, res) => {
  const db = require('../db.js');
  const { id } = req.params;
  const { start_date, end_date } = req.body;
  
  if (!start_date || !end_date) {
    return res.status(400).json({ message: 'Datas de início e fim são obrigatórias' });
  }
  
  const query = `
    SELECT COUNT(*) as count 
    FROM reservations 
    WHERE room_id = ? 
    AND status != 'cancelada'
    AND (
      (start_date <= ? AND end_date > ?) OR
      (start_date < ? AND end_date >= ?) OR
      (start_date >= ? AND end_date <= ?)
    )
  `;
  
  db.get(query, [id, start_date, start_date, end_date, end_date, start_date, end_date], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar disponibilidade' });
    }
    
    const disponivel = result.count === 0;
    return res.status(200).json({
      room_id: id,
      start_date,
      end_date,
      disponivel,
      reservas_existentes: result.count
    });
  });
});

// Rota para buscar hóspedes
router.get('/hospedes', (req, res) => {
  const db = require('../db.js');
  const query = 'SELECT * FROM hospedes ORDER BY name';
  
  db.all(query, [], (err, hospedes) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar hóspedes' });
    }
    return res.status(200).json(hospedes);
  });
});

// Rota para criar hóspede
router.post('/hospedes', (req, res) => {
  const db = require('../db.js');
  const { name, cpf, email, telefone } = req.body;
  
  if (!name || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios' });
  }
  
  const query = 'INSERT INTO hospedes (name, cpf, email, telefone) VALUES (?, ?, ?, ?)';
  
  db.run(query, [name, cpf, email, telefone], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'CPF já cadastrado' });
      }
      return res.status(500).json({ message: 'Erro ao criar hóspede' });
    }
    
    return res.status(201).json({
      id: this.lastID,
      name,
      cpf,
      email,
      telefone
    });
  });
});

module.exports = router;
