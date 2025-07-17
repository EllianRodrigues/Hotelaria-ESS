// Feito por Juliano Matheus Ferreira

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config/config');

// Criar conexão com banco
const db = new sqlite3.Database(path.join(__dirname, 'hotelaria.db'), (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Banco SQLite conectado!');
    inicializarBanco();
  }
});

// Função para inicializar banco
function inicializarBanco() {
  criarTabelas()
    .then(() => verificarDados())
    .then(() => console.log('✅ Banco inicializado com sucesso!'))
    .catch(erro => console.error('❌ Erro ao inicializar banco:', erro));
}

// Criar tabelas
function criarTabelas() {
  return new Promise((resolve, reject) => {
    const tabelas = [
      // Tabela de hotéis
      `CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        address TEXT,
        stars INTEGER DEFAULT 3,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Tabela de quartos
      `CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_id INTEGER,
        room_number TEXT NOT NULL,
        type TEXT NOT NULL,
        price_per_night REAL NOT NULL,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_id) REFERENCES hotels (id)
      )`,
      
      // Tabela de hóspedes
      `CREATE TABLE IF NOT EXISTS hospedes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        document TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Tabela de reservas
      `CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER,
        hospede_id INTEGER,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'confirmed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        FOREIGN KEY (hospede_id) REFERENCES hospedes (id)
      )`
    ];

    let completadas = 0;
    const total = tabelas.length;

    tabelas.forEach(sql => {
      db.run(sql, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela:', err.message);
          reject(err);
        } else {
          completadas++;
          if (completadas === total) {
            resolve();
          }
        }
      });
    });
  });
}

// Verificar se há dados
function verificarDados() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM hotels', (err, row) => {
      if (err) {
        reject(err);
      } else if (row.count === 0) {
        console.log('Inserindo dados de exemplo...');
        inserirDadosExemplo()
          .then(() => {
            console.log('Dados de exemplo inseridos com sucesso!');
            resolve();
          })
          .catch(reject);
      } else {
        resolve();
      }
    });
  });
}

// Inserir dados de exemplo
function inserirDadosExemplo() {
  return new Promise((resolve, reject) => {
    const dados = {
      hoteis: [
        { name: 'Hotel Copacabana Palace', city: 'Rio de Janeiro', address: 'Av. Atlântica, 1702', stars: 5 },
        { name: 'Hotel Fasano', city: 'São Paulo', address: 'Rua Vittorio Fasano, 88', stars: 5 },
        { name: 'Hotel Unique', city: 'São Paulo', address: 'Av. Brigadeiro Luis Antônio, 4700', stars: 5 },
        { name: 'Hotel Emiliano', city: 'São Paulo', address: 'Rua Oscar Freire, 384', stars: 5 },
        { name: 'Hotel Santa Teresa', city: 'Rio de Janeiro', address: 'Rua Almirante Alexandrino, 660', stars: 4 }
      ],
      quartos: [
        { hotel_id: 1, room_number: '101', type: 'Standard', price_per_night: 800 },
        { hotel_id: 1, room_number: '102', type: 'Deluxe', price_per_night: 1200 },
        { hotel_id: 1, room_number: '201', type: 'Suite', price_per_night: 2000 },
        { hotel_id: 2, room_number: '301', type: 'Standard', price_per_night: 900 },
        { hotel_id: 2, room_number: '302', type: 'Deluxe', price_per_night: 1400 },
        { hotel_id: 3, room_number: '401', type: 'Suite', price_per_night: 2500 },
        { hotel_id: 3, room_number: '402', type: 'Presidential', price_per_night: 5000 },
        { hotel_id: 4, room_number: '501', type: 'Standard', price_per_night: 850 },
        { hotel_id: 4, room_number: '502', type: 'Deluxe', price_per_night: 1300 },
        { hotel_id: 5, room_number: '601', type: 'Standard', price_per_night: 600 },
        { hotel_id: 5, room_number: '602', type: 'Deluxe', price_per_night: 900 },
        { hotel_id: 1, room_number: '103', type: 'Standard', price_per_night: 800, is_available: 0 },
        { hotel_id: 2, room_number: '303', type: 'Suite', price_per_night: 1800, is_available: 0 },
        { hotel_id: 3, room_number: '403', type: 'Standard', price_per_night: 1100, is_available: 0 },
        { hotel_id: 4, room_number: '503', type: 'Suite', price_per_night: 2000, is_available: 0 }
      ],
      hospedes: [
        { name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-1111', document: '123.456.789-00' },
        { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 99999-2222', document: '987.654.321-00' },
        { name: 'Pedro Costa', email: 'pedro@email.com', phone: '(21) 99999-3333', document: '111.222.333-44' },
        { name: 'Ana Oliveira', email: 'ana@email.com', phone: '(21) 99999-4444', document: '555.666.777-88' },
        { name: 'Carlos Ferreira', email: 'carlos@email.com', phone: '(11) 99999-5555', document: '999.888.777-66' },
        { name: 'Lucia Pereira', email: 'lucia@email.com', phone: '(21) 99999-6666', document: '333.444.555-66' },
        { name: 'Roberto Lima', email: 'roberto@email.com', phone: '(11) 99999-7777', document: '777.888.999-00' },
        { name: 'Fernanda Rocha', email: 'fernanda@email.com', phone: '(21) 99999-8888', document: '222.333.444-55' }
      ]
    };

    // Inserir hotéis
    const inserirHoteis = dados.hoteis.map(hotel => {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO hotels (name, city, address, stars) VALUES (?, ?, ?, ?)',
          [hotel.name, hotel.city, hotel.address, hotel.stars],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
    });

    Promise.all(inserirHoteis)
      .then(() => {
        // Inserir quartos
        const inserirQuartos = dados.quartos.map(quarto => {
          return new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO rooms (hotel_id, room_number, type, price_per_night, is_available) VALUES (?, ?, ?, ?, ?)',
              [quarto.hotel_id, quarto.room_number, quarto.type, quarto.price_per_night, quarto.is_available !== undefined ? quarto.is_available : 1],
              function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          });
        });

        return Promise.all(inserirQuartos);
      })
      .then(() => {
        // Inserir hóspedes
        const inserirHospedes = dados.hospedes.map(hospede => {
          return new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO hospedes (name, email, phone, document) VALUES (?, ?, ?, ?)',
              [hospede.name, hospede.email, hospede.phone, hospede.document],
              function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          });
        });

        return Promise.all(inserirHospedes);
      })
      .then(() => {
        // Inserir algumas reservas
        const reservas = [
          { room_id: 12, hospede_id: 1, check_in_date: '2024-01-15', check_out_date: '2024-01-18', total_price: 2400 },
          { room_id: 13, hospede_id: 2, check_in_date: '2024-01-20', check_out_date: '2024-01-25', total_price: 9000 },
          { room_id: 14, hospede_id: 3, check_in_date: '2024-02-10', check_out_date: '2024-02-12', total_price: 2200 },
          { room_id: 15, hospede_id: 4, check_in_date: '2024-02-15', check_out_date: '2024-02-20', total_price: 10000 },
          { room_id: 1, hospede_id: 5, check_in_date: '2024-03-01', check_out_date: '2024-03-03', total_price: 1600 },
          { room_id: 2, hospede_id: 6, check_in_date: '2024-03-05', check_out_date: '2024-03-08', total_price: 3600 },
          { room_id: 3, hospede_id: 7, check_in_date: '2024-03-10', check_out_date: '2024-03-12', total_price: 4000 },
          { room_id: 4, hospede_id: 8, check_in_date: '2024-03-15', check_out_date: '2024-03-18', total_price: 2700 },
          { room_id: 5, hospede_id: 1, check_in_date: '2024-04-01', check_out_date: '2024-04-05', total_price: 5600 },
          { room_id: 6, hospede_id: 2, check_in_date: '2024-04-10', check_out_date: '2024-04-12', total_price: 5000 }
        ];

        const inserirReservas = reservas.map(reserva => {
          return new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO reservations (room_id, hospede_id, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ?)',
              [reserva.room_id, reserva.hospede_id, reserva.check_in_date, reserva.check_out_date, reserva.total_price],
              function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          });
        });

        return Promise.all(inserirReservas);
      })
      .then(() => resolve())
      .catch(reject);
  });
}

module.exports = db; 