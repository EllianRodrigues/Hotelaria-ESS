import Room from '../models/room.js';
import express from 'express';

/**
 * Retrieves all rooms from the database.
 *
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {void} Sends a JSON response with an array of room objects or an error message.
 */
export async function getAllRooms(req, res) {
  const { available } = req?.query || {}
  try {
    if (available === "true") {
      const { start_date, end_date, city, n_of_adults } = req?.query || {}

      if (!start_date || !end_date || !city || !n_of_adults) {
        return res.status(400).json({ error: 'Incomplete information' });
      }

      const roomsWithOverlap = await Room.findAvailableRooms(start_date, end_date, city, parseInt(n_of_adults))

      res.json(roomsWithOverlap)
      return
    }

    const rows = await Room.getAll(req?.query || {});
    rows.forEach(row => {
      row.photos = JSON.parse(row.photos || '[]');
    });
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Retrieves a room by its ID.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getRoomById(req, res) {
  try {
    const [type, identifier] = (req.params.id).split("-")
    const hotel_id = req?.query?.hotel_id

    const row = await Room.getByUniqueColumns(type, identifier, hotel_id);
    if (!row) return res.status(404).json({ error: 'Room not found' });

    row.photos = JSON.parse(row.photos || '[]');
    res.json(row);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Creates a new room.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createRoom(req, res) {
  try {
    if (!req.body.identifier || !req.body.type || !req.body.n_of_adults || !req.body.cost || !req.body.photos || !req.body.city || !req.body.hotel_id) {
      return res.status(400).json({ error: 'Incomplete information' });
    }

    const existingRooms = await Room.getAll({
      identifier: req.body.identifier,
      type: req.body.type,
      hotel_id: req.body.hotel_id
    });
    if (existingRooms.length > 0) {
      return res.status(409).json({ error: 'Room with same identifier, type, and hotel_id already exists' });
    }

    const newRoom = await Room.create(req.body);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Updates an existing room (patch).
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function updateRoom(req, res) {
  try {
    const [type, identifier] = (req.params.id).split("-")
    const hotel_id = req?.query?.hotel_id

    // Primeiro, buscar o quarto para obter o ID real
    const room = await Room.getByUniqueColumns(type, identifier, hotel_id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Verificar se o hotel tem permissão para editar este quarto
    if (room.hotel_id != hotel_id) {
      return res.status(403).json({ error: 'Unauthorized to edit this room' });
    }

    const changes = await Room.update(room.id, req.body);

    if (changes === 0) {
      return res.status(422).json({ error: 'No changes to be made' });
    }

    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    if (error.message === 'No fields to update') {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
}

/**
 * Deletes a room by ID.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function deleteRoom(req, res) {
  try {
    const [type, identifier] = (req.params.id).split("-")
    const hotel_id = req?.query?.hotel_id

    // Primeiro, buscar o quarto para obter o ID real
    const room = await Room.getByUniqueColumns(type, identifier, hotel_id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Verificar se o hotel tem permissão para deletar este quarto
    if (room.hotel_id != hotel_id) {
      return res.status(403).json({ error: 'Unauthorized to delete this room' });
    }

    const result = await Room.delete(room.id);
    if (!result.deleted) return res.status(404).json({ error: 'Room not found' });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
