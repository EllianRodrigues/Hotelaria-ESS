const Reservation = require('../models/reservation');

exports.createReservation = async (req, res) => {
    try {
      const { name, start_date, end_date, room_id } = req.body;
  
      if (!name || !start_date || !end_date || !room_id) {
        return res.status(400).json({ error: 'name, start_date, end_date, and room_id are required' });
      }
  
      const newReservation = await Reservation.create({ name, start_date, end_date, room_id });
  
      res.status(201).json(newReservation);
    } catch (err) {
      console.error('Error creating reservation:', err);
      res.status(500).json({ error: err.message });
    }
  };