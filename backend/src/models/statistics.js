import db from '../sqlite/db.js';

const Statistics = {
  // Obter resumo geral do sistema
  getOverview: () => {
    return new Promise((resolve, reject) => {
      const queries = {
        totalHotels: 'SELECT COUNT(*) as count FROM hotels',
        totalHospedes: 'SELECT COUNT(*) as count FROM hospede',
        totalRooms: 'SELECT COUNT(*) as count FROM rooms',
        totalReservations: 'SELECT COUNT(*) as count FROM reservations',
        activeReservations: 'SELECT COUNT(*) as count FROM reservations WHERE end_date >= date("now")',
        totalRevenue: 'SELECT SUM(r.cost) as total FROM reservations res JOIN rooms r ON res.room_id = r.id',
        avgRoomPrice: 'SELECT AVG(cost) as average FROM rooms',
        occupancyRate: `
          SELECT 
            ROUND(
              (COUNT(CASE WHEN res.id IS NOT NULL THEN 1 END) * 100.0 / COUNT(*)), 2
            ) as rate 
          FROM rooms r 
          LEFT JOIN reservations res ON r.id = res.room_id 
          AND date("now") BETWEEN res.start_date AND res.end_date
        `
      };

      const results = {};
      const queryKeys = Object.keys(queries);
      let completed = 0;

      const executeQuery = (key, query) => {
        db.get(query, [], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          results[key] = row;
          completed++;
          
          if (completed === queryKeys.length) {
            resolve({
              totalHotels: results.totalHotels?.count || 0,
              totalHospedes: results.totalHospedes?.count || 0,
              totalRooms: results.totalRooms?.count || 0,
              totalReservations: results.totalReservations?.count || 0,
              activeReservations: results.activeReservations?.count || 0,
              totalRevenue: results.totalRevenue?.total || 0,
              avgRoomPrice: results.avgRoomPrice?.average || 0,
              occupancyRate: results.occupancyRate?.rate || 0
            });
          }
        });
      };

      queryKeys.forEach(key => {
        executeQuery(key, queries[key]);
      });
    });
  },

  // Obter estatísticas por mês
  getByMonth: (year = new Date().getFullYear()) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%m', res.created_at) as month,
          strftime('%Y', res.created_at) as year,
          COUNT(res.id) as total_reservations,
          SUM(r.cost) as total_revenue,
          AVG(r.cost) as avg_price,
          COUNT(DISTINCT res.hospede_id) as unique_customers
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
        WHERE strftime('%Y', res.created_at) = ?
        GROUP BY strftime('%m', res.created_at), strftime('%Y', res.created_at)
        ORDER BY month
      `;

      db.all(query, [year.toString()], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  // Obter top hotéis
  getTopHotels: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          h.id,
          h.nome as hotel_name,
          COUNT(r.id) as total_rooms,
          COUNT(res.id) as total_reservations,
          COALESCE(SUM(r.cost), 0) as total_revenue,
          COALESCE(AVG(r.cost), 0) as avg_room_price,
          CASE 
            WHEN COUNT(r.id) > 0 THEN 
              ROUND((COUNT(CASE WHEN res.id IS NOT NULL THEN 1 END) * 100.0 / COUNT(r.id)), 2)
            ELSE 0 
          END as occupancy_rate
        FROM hotels h
        LEFT JOIN rooms r ON h.id = r.hotel_id
        LEFT JOIN reservations res ON r.id = res.room_id
        GROUP BY h.id, h.nome
        ORDER BY total_revenue DESC, total_reservations DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  // Obter estatísticas por tipo de quarto
  getByRoomType: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          r.type as room_type,
          COUNT(r.id) as total_rooms,
          COUNT(CASE WHEN res.end_date >= date('now') THEN 1 END) as active_reservations,
          CASE 
            WHEN COUNT(r.id) > 0 THEN 
              ROUND((COUNT(CASE WHEN res.end_date >= date('now') THEN 1 END) * 100.0 / COUNT(r.id)), 2)
            ELSE 0 
          END as occupancy_rate,
          COALESCE(AVG(r.cost), 0) as avg_price,
          COALESCE(SUM(r.cost), 0) as total_revenue,
          COALESCE(AVG(r.n_of_adults), 0) as avg_capacity
        FROM rooms r
        LEFT JOIN reservations res ON r.id = res.room_id
        GROUP BY r.type
        ORDER BY total_revenue DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  // Obter estatísticas por estação
  getBySeason: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          CASE 
            WHEN CAST(strftime('%m', res.created_at) AS INTEGER) IN (12, 1, 2) THEN 'Verão'
            WHEN CAST(strftime('%m', res.created_at) AS INTEGER) IN (3, 4, 5) THEN 'Outono'
            WHEN CAST(strftime('%m', res.created_at) AS INTEGER) IN (6, 7, 8) THEN 'Inverno'
            WHEN CAST(strftime('%m', res.created_at) AS INTEGER) IN (9, 10, 11) THEN 'Primavera'
          END as season,
          COUNT(res.id) as total_reservations,
          SUM(r.cost) as total_revenue,
          AVG(r.cost) as avg_price,
          COUNT(DISTINCT res.hospede_id) as unique_customers
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
        GROUP BY season
        ORDER BY total_revenue DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  // Obter métricas avançadas
  getAdvancedMetrics: () => {
    return new Promise((resolve, reject) => {
      const queries = {
        customerRetention: `
          SELECT 
            COUNT(DISTINCT hospede_id) as unique_customers,
            COUNT(*) as total_reservations,
            ROUND(            COUNT(*) * 1.0 / COUNT(DISTINCT hospede_id), 2) as avg_reservations_per_customer
          FROM reservations
        `,
        peakHours: `
          SELECT 
            strftime('%H', created_at) as hour,
            COUNT(*) as reservations
          FROM reservations
          GROUP BY strftime('%H', created_at)
          ORDER BY reservations DESC
          LIMIT 5
        `,
        revenueGrowth: `
          SELECT 
            strftime('%Y-%m', created_at) as month,
            SUM(r.cost) as revenue
          FROM reservations res
          JOIN rooms r ON res.room_id = r.id
          GROUP BY strftime('%Y-%m', created_at)
          ORDER BY month DESC
          LIMIT 12
        `
      };

      const results = {};
      const queryKeys = Object.keys(queries);
      let completed = 0;

      const executeQuery = (key, query) => {
        if (key === 'customerRetention') {
          db.get(query, [], (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            results[key] = [row];
            completed++;
            if (completed === queryKeys.length) {
              resolve(results);
            }
          });
        } else {
          db.all(query, [], (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            results[key] = rows || [];
            completed++;
            if (completed === queryKeys.length) {
              resolve(results);
            }
          });
        }
      };

      queryKeys.forEach(key => {
        executeQuery(key, queries[key]);
      });
    });
  },

  // Obter tendências
  getTrends: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%Y-%m', res.created_at) as month,
          COUNT(res.id) as reservations,
          SUM(r.cost) as revenue,
          COUNT(DISTINCT res.hospede_id) as new_customers,
          AVG(r.cost) as avg_price
        FROM reservations res
        JOIN rooms r ON res.room_id = r.id
        GROUP BY strftime('%Y-%m', res.created_at)
        ORDER BY month DESC
        LIMIT 12
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Calcular taxa de crescimento
        const trendsWithGrowth = rows.map((current, index) => {
          const previous = rows[index + 1];
          let growth_rate = 0;

          if (previous && previous.revenue > 0) {
            growth_rate = ((current.revenue - previous.revenue) / previous.revenue) * 100;
          }

          return {
            ...current,
            growth_rate: Math.round(growth_rate * 100) / 100
          };
        });

        resolve(trendsWithGrowth.reverse());
      });
    });
  },

  // Buscar hotel por ID
  getHotelById: (hotelId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM hotels WHERE id = ?';
      db.get(sql, [hotelId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Buscar quartos de um hotel específico
  getRoomsByHotel: (hotelId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM rooms WHERE hotel_id = ?';
      db.all(sql, [hotelId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  },

  // Buscar reservas de um hotel específico
  getReservationsByHotel: (hotelId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, h.nome as hospede_name, rm.identifier as room_identifier,
               rm.cost as room_cost, 
               (julianday(r.end_date) - julianday(r.start_date)) * rm.cost as total_cost
        FROM reservations r
        INNER JOIN rooms rm ON r.room_id = rm.id
        LEFT JOIN hospede h ON r.hospede_id = h.id
        WHERE rm.hotel_id = ?
        ORDER BY r.created_at DESC
      `;
      db.all(sql, [hotelId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }
};

export default Statistics;
