// Feito por Juliano Matheus Ferreira

const db = require('../database/grupoDatabase');

const PaymentModel = {
  registrarPagamento: function(pagamento) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO payments (reserva_id, valor, metodo, status, usuario_id, transacao_externa, observacao) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.run(sql, [
        pagamento.reserva_id,
        pagamento.valor,
        pagamento.metodo,
        pagamento.status || 'pendente',
        pagamento.usuario_id || null,
        pagamento.transacao_externa || null,
        pagamento.observacao || null
      ], function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...pagamento });
      });
    });
  },

  listarPagamentos: function(filtros = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM payments WHERE 1=1';
      const params = [];
      if (filtros.status) {
        sql += ' AND status = ?';
        params.push(filtros.status);
      }
      if (filtros.reserva_id) {
        sql += ' AND reserva_id = ?';
        params.push(filtros.reserva_id);
      }
      if (filtros.metodo) {
        sql += ' AND metodo = ?';
        params.push(filtros.metodo);
      }
      if (filtros.usuario_id) {
        sql += ' AND usuario_id = ?';
        params.push(filtros.usuario_id);
      }
      if (filtros.data_inicio) {
        sql += ' AND data_pagamento >= ?';
        params.push(filtros.data_inicio);
      }
      if (filtros.data_fim) {
        sql += ' AND data_pagamento <= ?';
        params.push(filtros.data_fim);
      }
      sql += ' ORDER BY data_pagamento DESC';
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  buscarPagamentoPorId: function(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM payments WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  listarPagamentosPorReserva: function(reserva_id) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM payments WHERE reserva_id = ? ORDER BY data_pagamento DESC', [reserva_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  atualizarStatus: function(id, status, usuario_id) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE payments SET status = ?, atualizado_em = CURRENT_TIMESTAMP, usuario_id = ? WHERE id = ?';
      db.run(sql, [status, usuario_id, id], function(err) {
        if (err) return reject(err);
        resolve({ id, status });
      });
    });
  }
};

module.exports = PaymentModel; 