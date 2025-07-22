// Feito por Juliano Matheus Ferreira

const PaymentModel = require('../models/PaymentModel');

const PaymentController = {
  registrar: async (req, res) => {
    try {
      const pagamento = req.body;
      if (!pagamento.reserva_id || !pagamento.valor || !pagamento.metodo) {
        return res.status(400).json({ ok: false, mensagem: 'Dados obrigatórios ausentes' });
      }
      const novo = await PaymentModel.registrarPagamento(pagamento);
      res.status(201).json({ ok: true, mensagem: 'Pagamento registrado', dados: novo });
    } catch (err) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao registrar pagamento', erro: err.message });
    }
  },

  listar: async (req, res) => {
    try {
      const filtros = req.query;
      const lista = await PaymentModel.listarPagamentos(filtros);
      res.json({ ok: true, dados: lista });
    } catch (err) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao listar pagamentos', erro: err.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const pagamento = await PaymentModel.buscarPagamentoPorId(id);
      if (!pagamento) {
        return res.status(404).json({ ok: false, mensagem: 'Pagamento não encontrado' });
      }
      res.json({ ok: true, dados: pagamento });
    } catch (err) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar pagamento', erro: err.message });
    }
  },

  listarPorReserva: async (req, res) => {
    try {
      const reserva_id = req.params.reserva_id;
      const lista = await PaymentModel.listarPagamentosPorReserva(reserva_id);
      res.json({ ok: true, dados: lista });
    } catch (err) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao listar pagamentos da reserva', erro: err.message });
    }
  },

  atualizarStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const { status, usuario_id } = req.body;
      if (!status) {
        return res.status(400).json({ ok: false, mensagem: 'Status obrigatório' });
      }
      const atualizado = await PaymentModel.atualizarStatus(id, status, usuario_id);
      res.json({ ok: true, mensagem: 'Status atualizado', dados: atualizado });
    } catch (err) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao atualizar status', erro: err.message });
    }
  }
};

module.exports = PaymentController; 