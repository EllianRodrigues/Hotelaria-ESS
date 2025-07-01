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

exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.getAll();
    res.status(200).json(hotels);
  } catch (err) {
    console.error('Error getting hotels:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const { nome, email, cnpj, senha } = req.body;

    // Validação básica
    if (!nome || !email || !cnpj || !senha) {
      return res.status(400).json({ error: 'Missing information: nome, email, cnpj, and senha are required.' });
    }

    const newHotel = await Hotel.create(nome, email, cnpj, senha);
    res.status(201).json(newHotel); 
  } catch (err) {
    console.error('Error creating hotel:', err);
    if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email or CNPJ already registered.' });
    }
    res.status(500).json({ error: err.message });
  }
};
