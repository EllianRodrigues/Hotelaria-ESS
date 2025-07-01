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
  },

  updateByIdAndCnpj: (id, nome, email, cnpj, loggedInCnpj) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE hotel SET nome = ?, email = ?, cnpj = ? WHERE id = ? AND cnpj = ?',
        [nome, email, cnpj, id, loggedInCnpj], 
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0 ? { id, nome, email, cnpj } : null);
        }
      );
    });
  },

   findById: (id) => {
    return new Promise((resolve, reject) => {
      // Retorna todos os campos EXCETO a senha para o frontend
      db.get('SELECT id, nome, email, cnpj FROM hotel WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row); // Retorna o hotel encontrado (ou undefined se não encontrar)
      });
    });
  },

  updatePassword: (id, newPassword, loggedInCnpj) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE hotel SET senha = ? WHERE id = ? AND cnpj = ?',
        [newPassword, id, loggedInCnpj], // Atualiza a senha verificando ID e CNPJ
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0 ? true : false);
        }
      );
    });
  }
};

module.exports = Hotel;