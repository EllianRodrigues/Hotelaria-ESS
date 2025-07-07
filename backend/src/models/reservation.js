import db from '../sqlite/db.js';

const Reservation = {
    create: ({ name, start_date, end_date, room_id }) => {
        return new Promise((resolve, reject) => {
          const sql = `
            INSERT INTO reservations (name, start_date, end_date, room_id)
            VALUES (?, ?, ?, ?)
          `;
          const params = [name, start_date, end_date, room_id];
    
          db.run(sql, params, function (err) {
            if (err) return reject(err);
    
            resolve({
              id: this.lastID,
              name,
              start_date,
              end_date,
              room_id
            });
          });
        });
      }
}

export default Reservation