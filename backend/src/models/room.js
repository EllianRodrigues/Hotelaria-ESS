const db = require('../sqlite/db');

const Room = {
  getAll: (callback) => {
    db.all('SELECT * FROM rooms', [], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM rooms WHERE id = ?', [id], callback);
  },

  create: (room, callback) => {
    const { name, type, n_of_adults, description, cost, photos } = room;
    db.run(
      `INSERT INTO rooms (name, type, n_of_adults, description, cost, photos)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, type, n_of_adults, description, cost, JSON.stringify(photos)],
      function (err) {
        callback(err, { id: this.lastID, ...room });
      }
    );
  },

  update: (id, fields, callback) => {
    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return callback(new Error('No fields to update'));
    }

    const values = keys.map(key => {
      return key === 'photos' ? JSON.stringify(fields[key]) : fields[key];
    });

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE rooms SET ${setClause} WHERE id = ?`;

    db.run(sql, [...values, id], function (err) {
      if (err) return callback(err);
      if (this.changes === 0) return callback(null, 0); // no rows updated
      callback(null, this.changes);
    });
  },

  delete: (id, callback) => {
    db.run('DELETE FROM rooms WHERE id = ?', [id], function (err) {
      callback(err, { deleted: this.changes > 0 });
    });
  }
};

module.exports = Room;
