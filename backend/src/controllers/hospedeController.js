const Hospede = require('../models/hospede');

exports.getAllHospedes = async (req, res) => {
  try {
    const hospedes = await Hospede.getAll();
    res.status(200).json(hospedes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHospede = async (req, res) => {
  try {
    const { nome, email, cpf, senha } = req.body;
    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    const newHospede = await Hospede.create(nome, email, cpf, senha);
    res.status(201).json(newHospede);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email ou CPF já registrados.' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateHospede = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cpf, loggedInCpf } = req.body;

    if (!nome || !email || !cpf || !loggedInCpf) {
      return res.status(400).json({ error: 'Nome, email, CPF e o CPF do usuário logado são obrigatórios para a atualização.' });
    }

    const updatedHospede = await Hospede.updateByIdAndCpf(id, nome, email, cpf, loggedInCpf);

    if (!updatedHospede) {
      return res.status(403).json({ error: 'Não autorizado ou Hóspede não encontrado para este CPF.' });
    }

    res.status(200).json(updatedHospede);
  } catch (err) {
    console.error('Erro ao atualizar hóspede:', err);
    if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email ou CPF já registrados para outro hóspede.' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ESTA FUNÇÃO É ESSENCIAL PARA A ROTA GET /api/hospedes/:id
exports.getHospedeById = async (req, res) => {
  try {
    const { id } = req.params;
    const hospede = await Hospede.findById(id); // Chama o método findById do Model
    if (!hospede) {
      return res.status(404).json({ error: 'Hóspede não encontrado.' });
    }
    // Remove a senha antes de enviar para o frontend por segurança
    const { senha, ...hospedeWithoutPassword } = hospede;
    res.status(200).json(hospedeWithoutPassword);
  } catch (err) {
    console.error('Erro ao obter hóspede por ID:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateHospedePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, loggedInCpf } = req.body;

    if (!newPassword || !loggedInCpf) {
      return res.status(400).json({ error: 'Nova senha e CPF do usuário logado são obrigatórios.' });
    }

    const updated = await Hospede.updatePassword(id, newPassword, loggedInCpf);

    if (!updated) {
      return res.status(403).json({ error: 'Não autorizado ou Hóspede não encontrado para este CPF.' });
    }

    res.status(200).json({ message: 'Senha do hóspede atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar senha do hóspede:', err);
    res.status(500).json({ error: err.message });
  }
};