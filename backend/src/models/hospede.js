const db = require('../sqlite/db');

const Hospede = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, nome, email, cpf FROM hospede', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

 create: (nome, email, cpf, senha) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO hospede (nome, email, cpf, senha) VALUES (?, ?, ?, ?)',
        [nome, email, cpf, senha],
        function (err) { 
          if (err) reject(err);
          else resolve({ id: this.lastID, nome, email, cpf }); 
        }
      );
    });
  },
};

module.exports = Hospede;