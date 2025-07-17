import Hospede from '../models/hospede.js';
import Hotel from '../models/hotel.js';

export async function loginHospede(req, res) {
  try {
    const { cpf, senha } = req.body;
    if (!cpf || !senha) {
      return res.status(400).json({ error: 'CPF e senha são obrigatórios.' });
    }
    const hospede = await Hospede.findByCpf(cpf);
    if (!hospede) {
      return res.status(401).json({ error: 'CPF não encontrado.' });
    }
    const isMatch = Hospede.checkPassword(senha, hospede.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    const { id, nome, email, cpf: hospedeCpf } = hospede;
    res.status(200).json({
      message: 'Login de hóspede bem-sucedido!',
      user: { id, nome, email, cpf: hospedeCpf, tipo: 'hospede' }
    });
  } catch (err) {
    console.error('Erro no login de hóspede:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function loginHotel(req, res) {
  try {
    const { cnpj, senha } = req.body;
    if (!cnpj || !senha) {
      return res.status(400).json({ error: 'CNPJ e senha são obrigatórios.' });
    }
    const hotel = await Hotel.findByCnpj(cnpj);
    if (!hotel) {
      return res.status(401).json({ error: 'CNPJ não encontrado.' });
    }
    const isMatch = Hotel.checkPassword(senha, hotel.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    const { id, nome, email, cnpj: hotelCnpj } = hotel;
    res.status(200).json({
      message: 'Login de hotel bem-sucedido!',
      user: { id, nome, email, cnpj: hotelCnpj, tipo: 'hotel' }
    });
  } catch (err) {
    console.error('Erro no login de hotel:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export default { loginHospede, loginHotel };