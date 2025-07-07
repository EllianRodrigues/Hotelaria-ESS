import Hotel from '../models/hotel.js';

export async function createHotel(req, res) {
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
}

export async function getAllHotels(req, res) {
  try {
    const hotels = await Hotel.getAll();
    res.status(200).json(hotels);
  } catch (err) {
    console.error('Error getting hotels:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createHotelFull(req, res) {
  try {
    const { nome, email, cnpj, senha } = req.body;
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
}

export async function updateHotel(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, cnpj, loggedInCnpj } = req.body;
    if (!nome || !email || !cnpj || !loggedInCnpj) {
      return res.status(400).json({ error: 'Nome, email, CNPJ e o CNPJ do hotel logado são obrigatórios para a atualização.' });
    }
    const updatedHotel = await Hotel.updateByIdAndCnpj(id, nome, email, cnpj, loggedInCnpj);
    if (!updatedHotel) {
      return res.status(403).json({ error: 'Não autorizado ou Hotel não encontrado para este CNPJ.' });
    }
    res.status(200).json(updatedHotel);
  } catch (err) {
    console.error('Erro ao atualizar hotel:', err);
    if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email ou CNPJ já registrados para outro hotel.' });
    }
    res.status(500).json({ error: err.message });
  }
}

export async function getHotelById(req, res) {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel não encontrado.' });
    }
    const { senha, ...hotelWithoutPassword } = hotel;
    res.status(200).json(hotelWithoutPassword);
  } catch (err) {
    console.error('Erro ao obter hotel por ID:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateHotelPassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, loggedInCnpj } = req.body;
    if (!currentPassword || !newPassword || !loggedInCnpj) {
      return res.status(400).json({ error: 'Senha atual, nova senha e CNPJ do hotel logado são obrigatórios.' });
    }
    const updated = await Hotel.updatePassword(id, currentPassword, newPassword, loggedInCnpj);
    if (!updated) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    res.status(200).json({ message: 'Senha do hotel atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar senha do hotel:', err);
    res.status(500).json({ error: err.message });
  }
}

export default {
  createHotel,
  getAllHotels,
  createHotelFull,
  updateHotel,
  getHotelById,
  updateHotelPassword
};
