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

  findByCpf: (cpf) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM hospede WHERE cpf = ?', [cpf], (err, row) => {
        if (err) reject(err);
        else resolve(row); 
      });
    });
  },

  checkPassword: (providedPassword, storedPassword) => {
    return providedPassword === storedPassword;
  }
};

module.exports = Hospede;