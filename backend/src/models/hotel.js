const db = require('../sqlite/db');

const Hotel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, nome, email, cnpj FROM hotel', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  create: (nome, email, cnpj, senha) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO hotel (nome, email, cnpj, senha) VALUES (?, ?, ?, ?)',
        [nome, email, cnpj, senha], 
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, nome, email, cnpj });
        }
      );
    });
  },

  findByCnpj: (cnpj) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM hotel WHERE cnpj = ?', [cnpj], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  checkPassword: (providedPassword, storedPassword) => {
    return providedPassword === storedPassword;
  }
};

module.exports = Hotel;