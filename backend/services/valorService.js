const db = require('../db.js');

class ValorService {
  // Calcular valor base da reserva
  async calcularValorBase(roomId, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT price, tipo, capacidade_maxima FROM rooms WHERE id = ?';
      db.get(query, [roomId], (err, room) => {
        if (err) return reject(err);
        if (!room) return reject(new Error('Quarto não encontrado'));

        const dias = this.calcularDias(startDate, endDate);
        const valorBase = room.price * dias;
        
        resolve({
          valorBase,
          tipoQuarto: room.tipo,
          capacidadeMaxima: room.capacidade_maxima,
          dias
        });
      });
    });
  }

  // Calcular taxa de ocupação extra
  calcularTaxaOcupacao(numeroHospedes, capacidadeMaxima, valorBase) {
    if (numeroHospedes <= capacidadeMaxima) {
      return 0;
    }
    
    const pessoasExtras = numeroHospedes - capacidadeMaxima;
    const taxaPorPessoa = valorBase * 0.5; // 50% por pessoa adicional
    return pessoasExtras * taxaPorPessoa;
  }

  // Calcular valor dos serviços
  async calcularValorServicos(servicos, dias) {
    return new Promise((resolve, reject) => {
      if (!servicos || servicos.length === 0) {
        return resolve(0);
      }

      const placeholders = servicos.map(() => '?').join(',');
      const query = `SELECT id, price, tipo FROM services WHERE id IN (${placeholders})`;
      
      db.all(query, servicos, (err, services) => {
        if (err) return reject(err);
        
        let valorTotal = 0;
        services.forEach(service => {
          if (service.tipo === 'diario') {
            valorTotal += service.price * dias;
          } else {
            valorTotal += service.price;
          }
        });
        
        resolve(valorTotal);
      });
    });
  }

  // Aplicar desconto de temporada
  async aplicarDescontoTemporada(valorBase, startDate) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT desconto_percentual, tipo 
        FROM seasons 
        WHERE ? BETWEEN data_inicio AND data_fim 
        AND ativo = 1
      `;
      
      db.get(query, [startDate], (err, season) => {
        if (err) return reject(err);
        
        if (season && season.tipo === 'baixa') {
          const desconto = valorBase * (season.desconto_percentual / 100);
          resolve({
            desconto,
            percentual: season.desconto_percentual,
            tipo: season.tipo
          });
        } else {
          resolve({ desconto: 0, percentual: 0, tipo: 'alta' });
        }
      });
    });
  }

  // Validar e aplicar código promocional
  async aplicarCodigoPromocional(valorBase, codigo) {
    return new Promise((resolve, reject) => {
      if (!codigo) {
        return resolve({ desconto: 0, codigo: null });
      }

      const query = `
        SELECT desconto_percentual, desconto_fixo, tipo, max_usos, usos_atuais, data_inicio, data_fim
        FROM promo_codes 
        WHERE codigo = ? AND ativo = 1
      `;
      
      db.get(query, [codigo], (err, promo) => {
        if (err) return reject(err);
        if (!promo) {
          return reject(new Error('Código promocional inválido'));
        }

        const hoje = new Date().toISOString().split('T')[0];
        if (hoje < promo.data_inicio || hoje > promo.data_fim) {
          return reject(new Error('Código promocional expirado'));
        }

        if (promo.usos_atuais >= promo.max_usos) {
          return reject(new Error('Código promocional esgotado'));
        }

        let desconto = 0;
        if (promo.tipo === 'percentual') {
          desconto = valorBase * (promo.desconto_percentual / 100);
        } else {
          desconto = promo.desconto_fixo;
        }

        resolve({
          desconto,
          codigo: promo.codigo,
          tipo: promo.tipo
        });
      });
    });
  }

  // Calcular impostos e taxas
  async calcularImpostos(valorBase) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, nome, percentual FROM taxes WHERE ativo = 1';
      
      db.all(query, [], (err, taxes) => {
        if (err) return reject(err);
        
        const impostos = taxes.map(tax => ({
          id: tax.id,
          nome: tax.nome,
          percentual: tax.percentual,
          valor: valorBase * (tax.percentual / 100)
        }));
        
        const valorTotalImpostos = impostos.reduce((total, imposto) => total + imposto.valor, 0);
        
        resolve({
          impostos,
          valorTotal: valorTotalImpostos
        });
      });
    });
  }

  // Calcular taxa de cancelamento
  calcularTaxaCancelamento(valorBase, opcaoCancelamento) {
    if (opcaoCancelamento === 'gratuito') {
      return valorBase * 0.1; // 10% do valor total
    }
    return 0;
  }

  // Calcular valor das parcelas
  calcularParcelas(valorTotal, numeroParcelas) {
    const valorParcela = valorTotal / numeroParcelas;
    return {
      valorTotal,
      numeroParcelas,
      valorParcela: Math.round(valorParcela * 100) / 100
    };
  }

  // Calcular valor total da reserva
  async calcularValorTotal(dadosReserva) {
    try {
      const {
        roomId,
        startDate,
        endDate,
        numeroHospedes = 1,
        servicos = [],
        codigoPromocional,
        opcaoCancelamento,
        parcelas = 1
      } = dadosReserva;

      // 1. Calcular valor base
      const { valorBase, tipoQuarto, capacidadeMaxima, dias } = await this.calcularValorBase(roomId, startDate, endDate);

      // 2. Calcular taxa de ocupação extra
      const taxaOcupacao = this.calcularTaxaOcupacao(numeroHospedes, capacidadeMaxima, valorBase);

      // 3. Calcular valor dos serviços
      const valorServicos = await this.calcularValorServicos(servicos, dias);

      // 4. Aplicar desconto de temporada
      const { desconto: descontoTemporada } = await this.aplicarDescontoTemporada(valorBase, startDate);

      // 5. Aplicar código promocional
      const { desconto: descontoPromocional } = await this.aplicarCodigoPromocional(valorBase, codigoPromocional);

      // 6. Calcular impostos
      const { impostos, valorTotal: valorImpostos } = await this.calcularImpostos(valorBase);

      // 7. Calcular taxa de cancelamento
      const taxaCancelamento = this.calcularTaxaCancelamento(valorBase, opcaoCancelamento);

      // 8. Calcular valor total
      const valorOriginal = valorBase + taxaOcupacao + valorServicos + valorImpostos + taxaCancelamento;
      const descontoTotal = descontoTemporada + descontoPromocional;
      const valorFinal = valorOriginal - descontoTotal;

      // 9. Calcular parcelas
      const { valorParcela } = this.calcularParcelas(valorFinal, parcelas);

      return {
        valorBase,
        taxaOcupacao,
        valorServicos,
        descontoTemporada,
        descontoPromocional,
        valorImpostos,
        taxaCancelamento,
        valorOriginal,
        descontoTotal,
        valorFinal,
        valorParcela,
        impostos,
        dias,
        tipoQuarto,
        capacidadeMaxima,
        numeroHospedes
      };
    } catch (error) {
      throw error;
    }
  }

  // Calcular dias entre duas datas
  calcularDias(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Validar datas
  validarDatas(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (start < hoje) {
      throw new Error('Data de check-in não pode ser anterior a hoje');
    }

    if (end <= start) {
      throw new Error('Data de check-out deve ser posterior à data de check-in');
    }

    return true;
  }

  // Verificar disponibilidade do quarto
  async verificarDisponibilidade(roomId, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) as count 
        FROM reservations 
        WHERE room_id = ? 
        AND status != 'cancelada'
        AND (
          (start_date <= ? AND end_date > ?) OR
          (start_date < ? AND end_date >= ?) OR
          (start_date >= ? AND end_date <= ?)
        )
      `;
      
      db.get(query, [roomId, startDate, startDate, endDate, endDate, startDate, endDate], (err, result) => {
        if (err) return reject(err);
        resolve(result.count === 0);
      });
    });
  }
}

module.exports = new ValorService(); 