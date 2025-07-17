// backend/src/controllers/adminController.js (NOVO ARQUIVO)

import Hospede from '../models/hospede.js';
import Hotel from '../models/hotel.js';
import Reservation from '../models/reservation.js';
import Admin from '../models/admin.js';

// Função de login para Admin (pode ser movida para authController se preferir)
async function loginAdmin(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Email não encontrado.' });
    }

    const isMatch = Admin.checkPassword(senha, admin.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Em um app real, aqui você geraria um token JWT
    const { id, nome } = admin;
    res.status(200).json({
      message: 'Login de admin bem-sucedido!',
      user: { id, nome, email, tipo: 'admin' }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// Gerenciamento de Usuários (Hóspedes e Hotéis)
async function getAllUsers(req, res) {
  try {
    const hospedes = await Hospede.getAll();
    const hotels = await Hotel.getAll();
    res.status(200).json([...hospedes, ...hotels]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
    const { userType, id } = req.params;
    try {
        if (userType === 'hospede') {
            await Hospede.deleteById(id); // Supondo que você crie este método no modelo
        } else if (userType === 'hotel') {
            await Hotel.deleteById(id); // Supondo que você crie este método no modelo
        } else {
            return res.status(400).json({ error: 'Tipo de usuário inválido.' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// Gerenciamento de Reservas
async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.getAll(); // Método a ser criado
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReservation(req, res) {
    try {
        const { id } = req.params;
        await Reservation.deleteById(id); // Método a ser criado
        res.status(200).json({ message: 'Reserva deletada com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export default {
  loginAdmin,
  getAllUsers,
  deleteUser,
  getAllReservations,
  deleteReservation
};