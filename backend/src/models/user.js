import db from '../sqlite/db.js';

const User = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
};

export default User; 