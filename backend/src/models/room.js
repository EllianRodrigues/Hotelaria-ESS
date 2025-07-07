import db from '../sqlite/db.js';

const Room = {
  getAll: (filters = {}) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM rooms';
      const conditions = [];
      const values = [];
  
      if (filters.identifier) {
        conditions.push('identifier = ?');
        values.push(filters.identifier);
      }
      if (filters.type) {
        conditions.push('type = ?');
        values.push(filters.type);
      }
      if (filters.n_of_adults) {
        conditions.push('n_of_adults = ?');
        values.push(filters.n_of_adults);
      }
      if (filters.hotel_id) {
        conditions.push('hotel_id = ?');
        values.push(filters.hotel_id);
      }
  
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
  
      db.all(query, values, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  

  getByUniqueColumns: (type, identifier, hotelId) => {
    console.log(type, identifier, hotelId)
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM rooms
        WHERE type = ? AND identifier = ? AND hotel_id = ?
        LIMIT 1
      `;
      const params = [type, identifier, hotelId];
  
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  getByIds: async (ids) => {
    if (!ids.length) return [];

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `SELECT * FROM rooms WHERE id IN (${placeholders})`;

    return new Promise((resolve, reject) => {
      db.all(sql, ids, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Search reservations with custom overlap logic.
   * @param {string} start_date - Start date that the customer desires
   * @param {string} end_date - End date that the customer desires; inclusive
   * @param {number} [room_id] - optional room filter
   * @returns {Promise<Array>}
  */
  findAvailableRooms: (startDate, endDate, city, nOfAdults) => {
    const sql = `
    SELECT
      rooms.*,
      hotels.id,
      hotels.city,
      reservations.id AS reservation_id,
      reservations.start_date,
      reservations.end_date
    FROM rooms
    LEFT JOIN reservations ON rooms.id = reservations.room_id
    LEFT JOIN hotels ON rooms.hotel_id = hotels.id
    WHERE
      hotels.city = ?
      AND rooms.n_of_adults >= ?
      AND (reservations.id IS NULL OR NOT (
        (? <= reservations.start_date AND ? >= reservations.end_date)
        OR (? <= reservations.end_date AND ? > reservations.start_date)
        OR (? < reservations.end_date AND ? >= reservations.start_date)
        )
      )
    ORDER BY rooms.id, reservations.start_date;
    `;
        
        const params = [
          city,
          nOfAdults
          // startDate, endDate,
          // startDate, endDate,
          // startDate, endDate
        ];
  
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
  
        const grouped = rows.reduce((acc, row) => {
          const roomId = row.id;
          if (!acc[roomId]) {
            acc[roomId] = {
              id: row.id,
              identifier: row.identifier,
              type: row.type,
              n_of_adults: row.n_of_adults,
              description: row.description,
              cost: row.cost,
              photos: JSON.parse(row.photos || '[]'),
              hotel_id: row.hotel_id,
              city: row.city,
              reservations: []
            };
          }
  
          acc[roomId].reservations.push({
            id: row.reservation_id,
            start_date: row.start_date,
            end_date: row.end_date
          });
  
          return acc;
        }, {});
  
        resolve(Object.values(grouped));
      });
    });
  },

  create: (room) => {
    const { identifier, type, n_of_adults, description, cost, photos, hotel_id } = room;

    return new Promise((resolve, reject) => {
      // Check for duplicate
      db.get(
        `SELECT id FROM rooms WHERE identifier = ? AND type = ? AND hotel_id = ?`,
        [identifier, type, hotel_id],
        (err, existingRoom) => {
          if (err) return reject(err);

          if (existingRoom) {
            return reject(new Error('Room with same identifier, type, and hotel_id already exists'));
          }

          // Insert new room
          db.run(
            `INSERT INTO rooms (identifier, type, n_of_adults, description, cost, photos, hotel_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [identifier, type, n_of_adults, description, cost, JSON.stringify(photos), hotel_id],
            function (err) {
              if (err) return reject(err);
              resolve({ id: this.lastID, ...room });
            }
          );
        }
      );
    });
  },

  update: (id, fields) => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(fields);
      if (keys.length === 0) {
        return reject(new Error('No fields to update'));
      }

      const values = keys.map(key => key === 'photos' ? JSON.stringify(fields[key]) : fields[key]);
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE rooms SET ${setClause} WHERE id = ?`;

      db.run(sql, [...values, id], function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(0); // no rows updated
        resolve(this.changes);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM rooms WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes > 0 });
      });
    });
  }
};

export default Room;
