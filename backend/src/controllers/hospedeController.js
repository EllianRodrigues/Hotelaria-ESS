const Hospede = require('../models/hospede');

exports.getAllHospedes = async (req, res) => {
  try {
    const hospedes = await Hospede.getAll();
    res.status(200).json(hospedes);
  } catch (err) {
    console.error('Error getting hospedes:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createHospede = async (req, res) => {
  try {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({ error: 'Missing information: nome, email, cpf, and senha are required.' });
    }

    const newHospede = await Hospede.create(nome, email, cpf, senha);
    res.status(201).json(newHospede); 
  } catch (err) {
    console.error('Error creating hospede:', err);

    if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email or CPF already registered.' }); 
    }
    res.status(500).json({ error: err.message });
  }
};