const Hotel = require('../models/hotel');

exports.createHotel = async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ error: 'Missing information' });
    }

    const newHotel = await Hotel.create(name, city);
    res.status(201).json(newHotel);
  } catch (err) {
    console.error('Error creating hotel:', err);
    res.status(500).json({ error: err.message });
  }
};
