
const db = require('../db.js');
const valorService = require('../services/valorService.js');

module.exports = {
  // Criar reserva com cálculo automático de valor
  async create(req, res) {
    try {
      const {
        name,
        start_date,
        end_date,
        room_id,
        hospede_id,
        numero_hospedes = 1,
        servicos = [],
        codigo_promocional,
        opcao_cancelamento,
        parcelas = 1
      } = req.body;

      // Validações básicas
      if (!name || !start_date || !end_date || !room_id || !hospede_id) {
        return res.status(400).json({ 
          message: 'Dados obrigatórios ausentes na reserva',
          required: ['name', 'start_date', 'end_date', 'room_id', 'hospede_id']
        });
      }

      // Validar datas
      try {
        valorService.validarDatas(start_date, end_date);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      // Verificar disponibilidade do quarto
      const disponivel = await valorService.verificarDisponibilidade(room_id, start_date, end_date);
      if (!disponivel) {
        return res.status(409).json({ 
          message: 'Quarto indisponível para o período solicitado',
          room_id,
          start_date,
          end_date
        });
      }

      // Calcular valor total da reserva
      const calculoValor = await valorService.calcularValorTotal({
        roomId: room_id,
        startDate: start_date,
        endDate: end_date,
        numeroHospedes: numero_hospedes,
        servicos,
        codigoPromocional: codigo_promocional,
        opcaoCancelamento: opcao_cancelamento,
        parcelas
      });

      // Inserir reserva no banco
      const query = `
        INSERT INTO reservations (
          name, start_date, end_date, room_id, hospede_id, 
          valor, valor_original, desconto, numero_hospedes,
          taxa_ocupacao_extra, taxa_cancelamento, codigo_promocional,
          parcelas, valor_parcela, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        name, start_date, end_date, room_id, hospede_id,
        calculoValor.valorFinal, calculoValor.valorOriginal, calculoValor.descontoTotal,
        numero_hospedes, calculoValor.taxaOcupacao, calculoValor.taxaCancelamento,
        codigo_promocional, parcelas, calculoValor.valorParcela, 'pendente'
      ];

      db.run(query, params, function (err) {
        if (err) {
          console.error('Erro ao criar reserva:', err);
          return res.status(500).json({ message: 'Erro interno ao criar reserva' });
        }

        const reservaId = this.lastID;

        // Inserir serviços da reserva
        if (servicos && servicos.length > 0) {
          this.inserirServicos(reservaId, servicos, calculoValor.dias);
        }

        // Inserir impostos da reserva
        this.inserirImpostos(reservaId, calculoValor.impostos);

        // Atualizar uso do código promocional
        if (codigo_promocional) {
          this.atualizarUsoCodigoPromocional(codigo_promocional);
        }

        return res.status(201).json({
          id: reservaId,
          name,
          start_date,
          end_date,
          room_id,
          hospede_id,
          valor: calculoValor.valorFinal,
          valor_original: calculoValor.valorOriginal,
          desconto: calculoValor.descontoTotal,
          numero_hospedes,
          parcelas,
          valor_parcela: calculoValor.valorParcela,
          status: 'pendente',
          detalhes_calculo: {
            valor_base: calculoValor.valorBase,
            taxa_ocupacao: calculoValor.taxaOcupacao,
            valor_servicos: calculoValor.valorServicos,
            desconto_temporada: calculoValor.descontoTemporada,
            desconto_promocional: calculoValor.descontoPromocional,
            valor_impostos: calculoValor.valorImpostos,
            taxa_cancelamento: calculoValor.taxaCancelamento,
            impostos: calculoValor.impostos,
            dias: calculoValor.dias,
            tipo_quarto: calculoValor.tipoQuarto,
            capacidade_maxima: calculoValor.capacidadeMaxima
          }
        });
      }.bind(this));

    } catch (error) {
      console.error('Erro no controller:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Buscar reserva por ID
  getById(req, res) {
    const { id } = req.params;

    const query = `
      SELECT r.*, h.name as hospede_nome, rm.description as quarto_descricao
      FROM reservations r
      LEFT JOIN hospedes h ON r.hospede_id = h.id
      LEFT JOIN rooms rm ON r.room_id = rm.id
      WHERE r.id = ?
    `;

    db.get(query, [id], (err, reserva) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar reserva' });
      }

      if (!reserva) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }

      // Buscar serviços da reserva
      const servicosQuery = `
        SELECT s.name, s.description, rs.quantidade, rs.valor_unitario, rs.valor_total
        FROM reservation_services rs
        JOIN services s ON rs.service_id = s.id
        WHERE rs.reservation_id = ?
      `;

      db.all(servicosQuery, [id], (err, servicos) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao buscar serviços da reserva' });
        }

        // Buscar impostos da reserva
        const impostosQuery = `
          SELECT t.nome, rt.valor
          FROM reservation_taxes rt
          JOIN taxes t ON rt.tax_id = t.id
          WHERE rt.reservation_id = ?
        `;

        db.all(impostosQuery, [id], (err, impostos) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao buscar impostos da reserva' });
          }

          return res.status(200).json({
            ...reserva,
            servicos,
            impostos
          });
        });
      });
    });
  },

  // Listar todas as reservas
  getAll(req, res) {
    const query = `
      SELECT r.*, h.name as hospede_nome, rm.description as quarto_descricao
      FROM reservations r
      LEFT JOIN hospedes h ON r.hospede_id = h.id
      LEFT JOIN rooms rm ON r.room_id = rm.id
      ORDER BY r.created_at DESC
    `;

    db.all(query, [], (err, reservas) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar reservas' });
      }

      return res.status(200).json(reservas);
    });
  },

  // Atualizar reserva
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        servicos_adicionais = [],
        servicos_removidos = []
      } = req.body;

      // Buscar reserva atual
      const reservaQuery = 'SELECT * FROM reservations WHERE id = ?';
      db.get(reservaQuery, [id], async (err, reserva) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao buscar reserva' });
        }

        if (!reserva) {
          return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        if (reserva.status === 'cancelada') {
          return res.status(400).json({ message: 'Não é possível alterar uma reserva cancelada' });
        }

        // Buscar serviços atuais
        const servicosAtuaisQuery = 'SELECT service_id FROM reservation_services WHERE reservation_id = ?';
        db.all(servicosAtuaisQuery, [id], async (err, servicosAtuais) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao buscar serviços da reserva' });
          }

          // Remover serviços
          if (servicos_removidos.length > 0) {
            const removeQuery = 'DELETE FROM reservation_services WHERE reservation_id = ? AND service_id IN (?)';
            db.run(removeQuery, [id, servicos_removidos.join(',')]);
          }

          // Adicionar novos serviços
          if (servicos_adicionais.length > 0) {
            const dias = valorService.calcularDias(reserva.start_date, reserva.end_date);
            this.inserirServicos(id, servicos_adicionais, dias);
          }

          // Recalcular valor
          const servicosFinais = servicosAtuais
            .map(s => s.service_id)
            .filter(id => !servicos_removidos.includes(id))
            .concat(servicos_adicionais);

          const calculoValor = await valorService.calcularValorTotal({
            roomId: reserva.room_id,
            startDate: reserva.start_date,
            endDate: reserva.end_date,
            numeroHospedes: reserva.numero_hospedes,
            servicos: servicosFinais,
            codigoPromocional: reserva.codigo_promocional,
            opcaoCancelamento: reserva.taxa_cancelamento > 0 ? 'gratuito' : null,
            parcelas: reserva.parcelas
          });

          // Atualizar reserva
          const updateQuery = `
            UPDATE reservations 
            SET valor = ?, valor_original = ?, desconto = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `;

          db.run(updateQuery, [
            calculoValor.valorFinal,
            calculoValor.valorOriginal,
            calculoValor.descontoTotal,
            id
          ], function (err) {
            if (err) {
              return res.status(500).json({ message: 'Erro ao atualizar reserva' });
            }

            return res.status(200).json({
              message: 'Reserva atualizada com sucesso',
              id,
              valor_anterior: reserva.valor,
              valor_novo: calculoValor.valorFinal,
              diferenca: calculoValor.valorFinal - reserva.valor,
              detalhes_calculo: {
                valor_base: calculoValor.valorBase,
                taxa_ocupacao: calculoValor.taxaOcupacao,
                valor_servicos: calculoValor.valorServicos,
                desconto_temporada: calculoValor.descontoTemporada,
                desconto_promocional: calculoValor.descontoPromocional,
                valor_impostos: calculoValor.valorImpostos,
                taxa_cancelamento: calculoValor.taxaCancelamento
              }
            });
          });
        });
      });

    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Cancelar reserva
  cancel(req, res) {
    const { id } = req.params;

    // Buscar reserva
    const query = 'SELECT * FROM reservations WHERE id = ?';
    db.get(query, [id], (err, reserva) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar reserva' });
      }

      if (!reserva) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }

      if (reserva.status === 'cancelada') {
        return res.status(400).json({ message: 'Reserva já está cancelada' });
      }

      // Calcular reembolso
      const checkIn = new Date(reserva.start_date);
      const hoje = new Date();
      const diasAntes = Math.ceil((checkIn - hoje) / (1000 * 60 * 60 * 24));

      let valorReembolso = 0;
      let politicaReembolso = '';

      if (diasAntes > 7) {
        valorReembolso = reserva.valor * 0.9; // 90% de reembolso
        politicaReembolso = 'Reembolso de 90% - Cancelamento com mais de 7 dias de antecedência';
      } else if (diasAntes > 1) {
        valorReembolso = reserva.valor * 0.5; // 50% de reembolso
        politicaReembolso = 'Reembolso de 50% - Cancelamento com 1-7 dias de antecedência';
      } else {
        valorReembolso = 0; // Sem reembolso
        politicaReembolso = 'Sem reembolso - Cancelamento com menos de 24h de antecedência';
      }

      // Atualizar status da reserva
      const updateQuery = 'UPDATE reservations SET status = ? WHERE id = ?';
      db.run(updateQuery, ['cancelada', id], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao cancelar reserva' });
        }

        return res.status(200).json({
          message: 'Reserva cancelada com sucesso',
          id,
          valor_original: reserva.valor,
          valor_reembolso: valorReembolso,
          politica_reembolso: politicaReembolso,
          dias_antecedencia: diasAntes
        });
      });
    });
  },

  // Calcular valor de uma reserva (sem criar)
  async calcularValor(req, res) {
    try {
      const {
        room_id,
        start_date,
        end_date,
        numero_hospedes = 1,
        servicos = [],
        codigo_promocional,
        opcao_cancelamento,
        parcelas = 1
      } = req.body;

      if (!room_id || !start_date || !end_date) {
        return res.status(400).json({ 
          message: 'Dados obrigatórios ausentes',
          required: ['room_id', 'start_date', 'end_date']
        });
      }

      // Validar datas
      try {
        valorService.validarDatas(start_date, end_date);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      // Verificar disponibilidade
      const disponivel = await valorService.verificarDisponibilidade(room_id, start_date, end_date);
      if (!disponivel) {
        return res.status(409).json({ 
          message: 'Quarto indisponível para o período solicitado'
        });
      }

      // Calcular valor
      const calculoValor = await valorService.calcularValorTotal({
        roomId: room_id,
        startDate: start_date,
        endDate: end_date,
        numeroHospedes: numero_hospedes,
        servicos,
        codigoPromocional: codigo_promocional,
        opcaoCancelamento: opcao_cancelamento,
        parcelas
      });

      return res.status(200).json({
        valor_final: calculoValor.valorFinal,
        valor_original: calculoValor.valorOriginal,
        desconto_total: calculoValor.descontoTotal,
        parcelas: {
          numero: parcelas,
          valor_parcela: calculoValor.valorParcela
        },
        detalhes: {
          valor_base: calculoValor.valorBase,
          taxa_ocupacao: calculoValor.taxaOcupacao,
          valor_servicos: calculoValor.valorServicos,
          desconto_temporada: calculoValor.descontoTemporada,
          desconto_promocional: calculoValor.descontoPromocional,
          valor_impostos: calculoValor.valorImpostos,
          taxa_cancelamento: calculoValor.taxaCancelamento,
          impostos: calculoValor.impostos,
          dias: calculoValor.dias,
          tipo_quarto: calculoValor.tipoQuarto,
          capacidade_maxima: calculoValor.capacidadeMaxima
        }
      });

    } catch (error) {
      console.error('Erro ao calcular valor:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Métodos auxiliares
  inserirServicos(reservaId, servicos, dias) {
    servicos.forEach(serviceId => {
      const query = `
        INSERT INTO reservation_services (reservation_id, service_id, quantidade, valor_unitario, valor_total)
        SELECT ?, ?, 1, price, CASE WHEN tipo = 'diario' THEN price * ? ELSE price END
        FROM services WHERE id = ?
      `;
      db.run(query, [reservaId, serviceId, dias, serviceId]);
    });
  },

  inserirImpostos(reservaId, impostos) {
    impostos.forEach(imposto => {
      const query = 'INSERT INTO reservation_taxes (reservation_id, tax_id, valor) VALUES (?, ?, ?)';
      db.run(query, [reservaId, imposto.id, imposto.valor]);
    });
  },

  atualizarUsoCodigoPromocional(codigo) {
    const query = 'UPDATE promo_codes SET usos_atuais = usos_atuais + 1 WHERE codigo = ?';
    db.run(query, [codigo]);
  }
};
