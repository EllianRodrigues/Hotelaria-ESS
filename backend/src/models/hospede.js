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
  },

  updateByIdAndCpf: (id, nome, email, cpf, loggedInCpf) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE hospede SET nome = ?, email = ?, cpf = ? WHERE id = ? AND cpf = ?',
        [nome, email, cpf, id, loggedInCpf],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0 ? { id, nome, email, cpf } : null);
        }
      );
    });
  },

  // ESTE MÉTODO É ESSENCIAL PARA A ROTA GET /api/hospedes/:id
  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, nome, email, cpf FROM hospede WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row); // Retorna o objeto do hóspede ou undefined se não encontrado
      });
    });
  },

  updatePassword: (id, currentPassword, newPassword, loggedInCpf) => {
    return new Promise((resolve, reject) => { // <--- CORRIGIDO AQUI: apenas UMA vez 'new'
      db.get('SELECT senha FROM hospede WHERE id = ? AND cpf = ?', [id, loggedInCpf], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(false);

        if (!Hospede.checkPassword(currentPassword, row.senha)) {
          return resolve(false);
        }

        db.run('UPDATE hospede SET senha = ? WHERE id = ?',
          [newPassword, id],
          function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0 ? true : false);
          }
        );
      });
    });
  }
};

module.exports = Hospede;