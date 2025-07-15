import Reservation from '../models/reservation.js';

export async function createReservation(req, res) {
    try {
      const { name, start_date, end_date, room_id, hospede_id } = req.body;
  
      if (!name || !start_date || !end_date || !room_id || !hospede_id) {
        return res.status(400).json({ error: 'name, start_date, end_date, room_id e hospede_id são obrigatórios' });
      }
  
      const newReservation = await Reservation.create({ name, start_date, end_date, room_id, hospede_id });
  
      res.status(201).json(newReservation);
    } catch (err) {
      console.error('Error creating reservation:', err);
      res.status(500).json({ error: err.message });
    }
  };

  export default { createReservation };