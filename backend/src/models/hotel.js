const db = require('../sqlite/db');

const Hotel = {
  create: (name, city) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO hotels (name, city) VALUES (?, ?)`;

      db.run(sql, [name, city], function (err) {
        if (err) return reject(err);

        resolve({ id: this.lastID, name, city });
      });
    });
  }
};


module.exports = Hotel;
