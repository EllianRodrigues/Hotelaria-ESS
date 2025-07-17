// Feito por Juliano Matheus Ferreira

const Estatisticas = require('../models/StatisticsModel');

const ControllerEstatisticas = {
  // Resumo geral do sistema
  async resumo(req, res) {
    try {
      const dados = await Estatisticas.pegarResumo();
      res.json({ ok: true, mensagem: 'Resumo geral', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar resumo', erro: erro.message });
    }
  },

  // Estatísticas por cidade
  async porCidade(req, res) {
    try {
      const dados = await Estatisticas.pegarPorCidade();
      res.json({ ok: true, mensagem: 'Por cidade', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar cidades', erro: erro.message });
    }
  },

  // Reservas por mês
  async reservasPorMes(req, res) {
    try {
      const dados = await Estatisticas.pegarReservasPorMes();
      res.json({ ok: true, mensagem: 'Reservas por mês', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar reservas por mês', erro: erro.message });
    }
  },

  // Top hotéis
  async topHoteis(req, res) {
    try {
      const dados = await Estatisticas.pegarTopHoteis();
      res.json({ ok: true, mensagem: 'Top hotéis', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar top hotéis', erro: erro.message });
    }
  },

  // Por tipo de quarto
  async porTipoQuarto(req, res) {
    try {
      const dados = await Estatisticas.pegarPorTipoQuarto();
      res.json({ ok: true, mensagem: 'Por tipo de quarto', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar tipos de quarto', erro: erro.message });
    }
  },

  // Por estação
  async porEstacao(req, res) {
    try {
      const dados = await Estatisticas.pegarPorEstacao();
      res.json({ ok: true, mensagem: 'Por estação', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar por estação', erro: erro.message });
    }
  },

  // Métricas avançadas
  async metricasAvancadas(req, res) {
    try {
      const dados = await Estatisticas.pegarMetricasAvancadas();
      res.json({ ok: true, mensagem: 'Métricas avançadas', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar métricas avançadas', erro: erro.message });
    }
  },

  // Tendências
  async tendencias(req, res) {
    try {
      const dados = await Estatisticas.pegarTendencias();
      res.json({ ok: true, mensagem: 'Análise de tendências', dados });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar tendências', erro: erro.message });
    }
  },

  // Limpar cache
  async limparCache(req, res) {
    try {
      Estatisticas.limparCache();
      res.json({ ok: true, mensagem: 'Cache limpo com sucesso' });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao limpar cache', erro: erro.message });
    }
  },

  // Todas as estatísticas de uma vez
  async tudo(req, res) {
    try {
      const [
        resumo,
        cidades,
        meses,
        top,
        tipos,
        estacoes,
        metricas,
        tendencias
      ] = await Promise.all([
        Estatisticas.pegarResumo(),
        Estatisticas.pegarPorCidade(),
        Estatisticas.pegarReservasPorMes(),
        Estatisticas.pegarTopHoteis(),
        Estatisticas.pegarPorTipoQuarto(),
        Estatisticas.pegarPorEstacao(),
        Estatisticas.pegarMetricasAvancadas(),
        Estatisticas.pegarTendencias()
      ]);

      res.json({
        ok: true,
        mensagem: 'Todas as estatísticas',
        dados: {
          resumo,
          cidades,
          meses,
          top,
          tipos,
          estacoes,
          metricas,
          tendencias
        }
      });
    } catch (erro) {
      res.status(500).json({ ok: false, mensagem: 'Erro ao buscar todas as estatísticas', erro: erro.message });
    }
  }
};

module.exports = ControllerEstatisticas; 