import db from '../sqlite/db.js';

const Hotel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, nome, email, cnpj FROM hotels', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  create: (nome, email, cnpj, senha) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO hotels (nome, email, cnpj, senha) VALUES (?, ?, ?, ?)',
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
      db.get('SELECT * FROM hotels WHERE cnpj = ?', [cnpj], (err, row) => {
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
      db.run('UPDATE hotels SET nome = ?, email = ?, cnpj = ? WHERE id = ? AND cnpj = ?',
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
      db.get('SELECT id, nome, email, cnpj FROM hotels WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row); 
      });
    });
  },

   updatePassword: (id, currentPassword, newPassword, loggedInCnpj) => {
    return new Promise((resolve, reject) => { 
      db.get('SELECT senha FROM hotels WHERE id = ? AND cnpj = ?', [id, loggedInCnpj], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(false);

        if (!Hotel.checkPassword(currentPassword, row.senha)) {
          return resolve(false);
        }

        db.run('UPDATE hotels SET senha = ? WHERE id = ?',
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

export default Hotel;
