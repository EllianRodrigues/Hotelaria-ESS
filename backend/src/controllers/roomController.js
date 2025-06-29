const Room = require('../models/room');

exports.getAllRooms = (req, res) => {
  Room.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    rows.forEach(row => {
      row.photos = JSON.parse(row.photos || '[]');
    });

    res.json(rows);
  });
};

exports.getRoomById = (req, res) => {
  Room.getById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Room not found' });

    row.photos = JSON.parse(row.photos || '[]');

    res.json(row);
  });
};

exports.createRoom = (req, res) => {
  const room = req.body;

  Room.create(room, (err, newRoom) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(newRoom);
  });
};

// the update is a patch
exports.updateRoom = (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  Room.update(id, fields, (err, changes) => {
    if (err) {
      if (err.message === 'No fields to update') {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    if (changes === 0) {
      return res.status(422).json({ error: 'No changes to be made' });
    }

    res.json({ message: 'Room updated successfully' });
  });
};

exports.deleteRoom = (req, res) => {
  Room.delete(req.params.id, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!result.deleted) return res.status(404).json({ error: 'Room not found' });
    
    res.json({ message: 'Room deleted successfully' });
  });
};
