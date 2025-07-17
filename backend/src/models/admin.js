// backend/src/models/admin.js (NOVO ARQUIVO)

import db from '../sqlite/db.js';

const Admin = {
  create: (nome, email, senha) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senha],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, nome, email });
          }
        }
      );
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM admins WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  checkPassword: (providedPassword, storedPassword) => {
    // Em um projeto real, use bcrypt.compareSync(providedPassword, storedPassword);
    return providedPassword === storedPassword;
  }
};

export default Admin;