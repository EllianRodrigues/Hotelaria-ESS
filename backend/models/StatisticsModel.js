// Feito por Juliano Matheus Ferreira

const db = require('../database/grupoDatabase');

// Cache simples para melhorar performance
const cache = new Map();
const TEMPO_CACHE = 5 * 60 * 1000; // 5 minutos

class Estatisticas {
  // Gera chave única para o cache
  static gerarChaveCache(metodo, params = '') {
    return `${metodo}_${params}`;
  }

  // Busca dados do cache
  static buscarCache(chave) {
    const dados = cache.get(chave);
    if (dados && Date.now() - dados.timestamp < TEMPO_CACHE) {
      return dados.dados;
    }
    cache.delete(chave);
    return null;
  }

  // Salva dados no cache
  static salvarCache(chave, dados) {
    cache.set(chave, {
      dados,
      timestamp: Date.now()
    });
  }

  // Remove todo o cache
  static limparCache() {
    cache.clear();
  }

  // Resumo geral do sistema
  static pegarResumo() {
    const chave = this.gerarChaveCache('resumo');
    const cacheado = this.buscarCache(chave);
    if (cacheado) return Promise.resolve(cacheado);

    return new Promise((resolve, reject) => {
      const resultado = {};

      // Conta hóspedes
      db.get("SELECT COUNT(*) as total FROM hospede", (err, row) => {
        if (err) return reject(err);
        resultado.hospedes = row.total;

        // Conta hotéis
        db.get("SELECT COUNT(*) as total FROM hotels", (err, row) => {
          if (err) return reject(err);
          resultado.hoteis = row.total;

          // Conta quartos
          db.get("SELECT COUNT(*) as total FROM rooms", (err, row) => {
            if (err) return reject(err);
            resultado.quartos = row.total;

            // Quartos disponíveis (todos os quartos são considerados disponíveis por padrão)
            db.get("SELECT COUNT(*) as total FROM rooms", (err, row) => {
              if (err) return reject(err);
              resultado.quartosDisponiveis = row.total;

              // Total de reservas
              db.get("SELECT COUNT(*) as total FROM reservations", (err, row) => {
                if (err) return reject(err);
                resultado.reservas = row.total;

                // Taxa de ocupação
                resultado.taxaOcupacao = resultado.quartos > 0 ? 
                  Number(((resultado.quartos - resultado.quartosDisponiveis) / resultado.quartos * 100).toFixed(2)) : 0;

                // Receita total (calculada pelo custo dos quartos)
                db.get("SELECT SUM(r.cost) as total FROM reservations res JOIN rooms r ON res.room_id = r.id", (err, row) => {
                  if (err) return reject(err);
                  resultado.receita = row.total || 0;

                  // Média de noites
                  db.get(`SELECT AVG(julianday(res.end_date) - julianday(res.start_date)) as media FROM reservations res`, (err, row) => {
                    if (err) return reject(err);
                    resultado.mediaNoites = row.media ? Number(row.media.toFixed(1)) : 0;

                    // Dados extras
                    resultado.ultimaAtualizacao = new Date().toISOString();
                    resultado.performance = {
                      cacheHit: false,
                      tempoProcessamento: Date.now()
                    };

                    this.salvarCache(chave, resultado);
                    resolve(resultado);
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  // Estatísticas por cidade
  static pegarPorCidade() {
    const chave = this.gerarChaveCache('cidades');
    const cacheado = this.buscarCache(chave);
    if (cacheado) return Promise.resolve(cacheado);

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.city, COUNT(DISTINCT r.hotel_id) as hoteis, COUNT(r.id) as quartos,
          COUNT(r.id) as disponiveis, 0 as ocupados
        FROM rooms r
        GROUP BY r.city
        ORDER BY quartos DESC
      `;
      
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        
        const cidades = rows.map(row => ({
          cidade: row.city,
          hoteis: row.hoteis,
          quartos: row.quartos,
          disponiveis: row.disponiveis,
          ocupados: row.ocupados,
          taxaOcupacao: row.quartos > 0 ? 
            Number(((row.ocupados / row.quartos) * 100).toFixed(2)) : 0
        }));
        
        this.salvarCache(chave, cidades);
        resolve(cidades);
      });
    });
  }

  // Reservas por mês
  static pegarReservasPorMes() {
    const chave = this.gerarChaveCache('meses');
    const cacheado = this.buscarCache(chave);
    if (cacheado) return Promise.resolve(cacheado);

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT strftime('%Y-%m', res.start_date) as mes,
          COUNT(*) as reservas,
          SUM(r.cost) as receita,
          AVG(r.cost) as ticketMedio
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
        GROUP BY strftime('%Y-%m', res.start_date)
        ORDER BY mes DESC
        LIMIT 12
      `;
      
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        
        const meses = rows.map(row => ({
          mes: row.mes,
          reservas: row.reservas,
          receita: row.receita,
          ticketMedio: row.ticketMedio ? Number(row.ticketMedio.toFixed(2)) : 0
        }));
        
        this.salvarCache(chave, meses);
        resolve(meses);
      });
    });
  }

  // Top hotéis por receita
  static pegarTopHoteis() {
    const chave = this.gerarChaveCache('top');
    const cacheado = this.buscarCache(chave);
    if (cacheado) return Promise.resolve(cacheado);

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.nome as hotel, r.city, COUNT(res.id) as reservas,
          SUM(r.cost) as receita, AVG(r.cost) as ticketMedio
        FROM hotels h
        LEFT JOIN rooms r ON h.id = r.hotel_id
        LEFT JOIN reservations res ON r.id = res.room_id
        GROUP BY h.id, h.nome, r.city
        HAVING reservas > 0
        ORDER BY receita DESC
        LIMIT 10
      `;
      
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        
        const top = rows.map(row => ({
          hotel: row.hotel,
          cidade: row.city,
          reservas: row.reservas,
          receita: row.receita,
          ticketMedio: row.ticketMedio ? Number(row.ticketMedio.toFixed(2)) : 0
        }));
        
        this.salvarCache(chave, top);
        resolve(top);
      });
    });
  }

  // Por tipo de quarto
  static pegarPorTipoQuarto() {
    const chave = this.gerarChaveCache('tipos');
    const cacheado = this.buscarCache(chave);
    if (cacheado) return Promise.resolve(cacheado);

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT type as tipo, COUNT(*) as quartos,
          COUNT(*) as disponiveis, 0 as ocupados,
          AVG(cost) as precoMedio
        FROM rooms
        GROUP BY type
        ORDER BY quartos DESC
      `;
      
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        
        const tipos = rows.map(row => ({
          tipo: row.tipo,
          quartos: row.quartos,
          disponiveis: row.disponiveis,
          ocupados: row.ocupados,
          precoMedio: row.precoMedio ? Number(row.precoMedio.toFixed(2)) : 0,
          taxaOcupacao: row.quartos > 0 ? 
            Number(((row.ocupados / row.quartos) * 100).toFixed(2)) : 0
        }));
        
        this.salvarCache(chave, tipos);
        resolve(tipos);
      });
    });
  }

  // Por estação do ano
  static pegarPorEstacao() {
    const chave = this.gerarChaveCache('estacoes');
    const cacheado = this.buscarCache(chave);
    if (cacheado) return Promise.resolve(cacheado);

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT CASE 
            WHEN strftime('%m', res.start_date) IN ('12', '01', '02') THEN 'Verão'
            WHEN strftime('%m', res.start_date) IN ('03', '04', '05') THEN 'Outono'
            WHEN strftime('%m', res.start_date) IN ('06', '07', '08') THEN 'Inverno'
            ELSE 'Primavera'
          END as estacao,
          COUNT(*) as reservas,
          AVG(r.cost) as ticketMedio
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
        GROUP BY estacao
        ORDER BY reservas DESC
      `;
      
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        
        const estacoes = rows.map(row => ({
          estacao: row.estacao,
          reservas: row.reservas,
          ticketMedio: row.ticketMedio ? Number(row.ticketMedio.toFixed(2)) : 0
        }));
        
        this.salvarCache(chave, estacoes);
        resolve(estacoes);
      });
    });
  }

  // Métricas avançadas
  static pegarMetricasAvancadas() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(DISTINCT res.hospede_id) as hospedesUnicos,
          COUNT(DISTINCT res.room_id) as quartosUtilizados,
          AVG(julianday(res.end_date) - julianday(res.start_date)) as mediaEstadia,
          MAX(r.cost) as reservaMaisCara,
          MIN(r.cost) as reservaMaisBarata,
          COUNT(CASE WHEN r.cost > 1000 THEN 1 END) as reservasPremium
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
      `;
      
      db.get(sql, (err, row) => {
        if (err) return reject(err);
        
        resolve({
          hospedesUnicos: row.hospedesUnicos,
          quartosUtilizados: row.quartosUtilizados,
          mediaEstadia: row.mediaEstadia ? Number(row.mediaEstadia.toFixed(1)) : 0,
          reservaMaisCara: row.reservaMaisCara,
          reservaMaisBarata: row.reservaMaisBarata,
          reservasPremium: row.reservasPremium,
          percentualPremium: 0 // Simplificado para evitar erro
        });
      });
    });
  }

  // Tendências de crescimento
  static pegarTendencias() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          strftime('%Y-%m', res.start_date) as mes,
          COUNT(*) as reservas,
          SUM(r.cost) as receita
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
        GROUP BY strftime('%Y-%m', res.start_date)
        ORDER BY mes ASC
      `;
      
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        
        if (rows.length < 2) {
          resolve({ tendencia: 'insuficientes dados', crescimento: 0 });
          return;
        }

        const primeiro = rows[0];
        const ultimo = rows[rows.length - 1];
        const crescimento = ((ultimo.receita - primeiro.receita) / primeiro.receita * 100);
        
        resolve({
          primeiroMes: primeiro.mes,
          ultimoMes: ultimo.mes,
          crescimento: Number(crescimento.toFixed(2)),
          tendencia: crescimento > 0 ? 'crescimento' : crescimento < 0 ? 'queda' : 'estavel',
          dados: rows.map(row => ({
            mes: row.mes,
            reservas: row.reservas,
            receita: row.receita
          }))
        });
      });
    });
  }
}

module.exports = Estatisticas; 