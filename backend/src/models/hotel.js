const db = require('../sqlite/db');

// const Hotel = {
//   create: (name, city) => {
//     return new Promise((resolve, reject) => {
//       const sql = `INSERT INTO hotels (name, city) VALUES (?, ?)`;

//       db.run(sql, [name, city], function (err) {
//         if (err) return reject(err);

//         resolve({ id: this.lastID, name, city });
//       });
//     });
//   }
// };

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
};


module.exports = Hotel;
