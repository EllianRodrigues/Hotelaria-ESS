import db from '../sqlite/db.js';

const Reservation = {
    create: ({ name, start_date, end_date, room_id, hospede_id }) => {
        return new Promise((resolve, reject) => {
          const sql = `
            INSERT INTO reservations (name, start_date, end_date, room_id, hospede_id)
            VALUES (?, ?, ?, ?, ?)
          `;
          const params = [name, start_date, end_date, room_id, hospede_id];
    
          db.run(sql, params, function (err) {
            if (err) return reject(err);
    
            resolve({
              id: this.lastID,
              name,
              start_date,
              end_date,
              room_id,
              hospede_id
            });
          });
        });
      },
    getAll: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM reservations', [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    deleteById: (id) => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM reservations WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ deleted: this.changes });
          }
        });
      });
  }
}

export default Reservation