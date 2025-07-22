// Feito por Juliano Matheus Ferreira
// Script para criar a tabela de pagamentos sem apagar o banco

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
    process.exit(1);
  }
});

const sql = `CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reserva_id INTEGER NOT NULL,
  valor REAL NOT NULL,
  metodo TEXT NOT NULL,
  status TEXT NOT NULL,
  data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id INTEGER,
  transacao_externa TEXT,
  observacao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reserva_id) REFERENCES reservations(id)
);`;

db.run(sql, (err) => {
  if (err) {
    console.error('Erro ao criar tabela payments:', err.message);
  } else {
    console.log('✅ Tabela de pagamentos criada (ou já existia). Nenhum dado foi apagado.');
  }
  db.close();
}); 