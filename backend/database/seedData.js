// Feito por Juliano Matheus Ferreira

const db = require('./database');

function inserirExemplo() {
  console.log('Inserindo dados de exemplo...');

  const hoteis = [
    ['Hotel Copacabana Palace', 'Rio de Janeiro', 'Av. Atlântica, 1702', '(21) 2548-7070', 'reservas@copacabanapalace.com'],
    ['Hotel Fasano', 'São Paulo', 'R. Vittorio Fasano, 88', '(11) 3896-4000', 'reservas@fasano.com.br'],
    ['Hotel Unique', 'São Paulo', 'Av. Brigadeiro Luis Antônio, 4700', '(11) 3055-4700', 'reservas@hotelunique.com.br'],
    ['Hotel Emiliano', 'São Paulo', 'R. Oscar Freire, 384', '(11) 3068-4399', 'reservas@emiliano.com.br'],
    ['Hotel Santa Teresa', 'Rio de Janeiro', 'R. Almirante Alexandrino, 660', '(21) 3380-0200', 'reservas@santateresa.com.br']
  ];

  hoteis.forEach((hotel, i) => {
    db.run(`INSERT INTO hotels (name, city, address, phone, email) VALUES (?, ?, ?, ?, ?)`, hotel, function(err) {
      if (err) {
        console.error('Erro ao inserir hotel:', err);
      } else {
        console.log(`Hotel ${i + 1} inserido!`);
      }
    });
  });

  setTimeout(() => {
    const quartos = [
      [1, '101', 'Standard', 2, 250.00, 1],
      [1, '102', 'Standard', 2, 250.00, 1],
      [1, '201', 'Luxo', 3, 450.00, 1],
      [1, '202', 'Luxo', 3, 450.00, 0],
      [2, '101', 'Standard', 2, 300.00, 1],
      [2, '102', 'Standard', 2, 300.00, 1],
      [2, '201', 'Suite', 4, 600.00, 1],
      [3, '101', 'Standard', 2, 280.00, 1],
      [3, '102', 'Standard', 2, 280.00, 0],
      [3, '201', 'Luxo', 3, 520.00, 1],
      [4, '101', 'Standard', 2, 320.00, 1],
      [4, '102', 'Standard', 2, 320.00, 1],
      [4, '201', 'Suite', 4, 750.00, 0],
      [5, '101', 'Standard', 2, 200.00, 1],
      [5, '102', 'Standard', 2, 200.00, 1],
      [5, '201', 'Luxo', 3, 380.00, 1]
    ];
    quartos.forEach((quarto, i) => {
      db.run(`INSERT INTO rooms (hotel_id, room_number, type, capacity, price_per_night, is_available) VALUES (?, ?, ?, ?, ?, ?)`, quarto, function(err) {
        if (err) {
          console.error('Erro ao inserir quarto:', err);
        } else {
          console.log(`Quarto ${i + 1} inserido!`);
        }
      });
    });

    setTimeout(() => {
      const hospedes = [
        ['João Silva', 'joao.silva@email.com', '(11) 99999-1111', '123.456.789-00'],
        ['Maria Santos', 'maria.santos@email.com', '(11) 99999-2222', '987.654.321-00'],
        ['Pedro Oliveira', 'pedro.oliveira@email.com', '(21) 99999-3333', '456.789.123-00'],
        ['Ana Costa', 'ana.costa@email.com', '(21) 99999-4444', '789.123.456-00'],
        ['Carlos Ferreira', 'carlos.ferreira@email.com', '(11) 99999-5555', '321.654.987-00'],
        ['Lucia Pereira', 'lucia.pereira@email.com', '(21) 99999-6666', '654.321.987-00'],
        ['Roberto Lima', 'roberto.lima@email.com', '(11) 99999-7777', '147.258.369-00'],
        ['Fernanda Rocha', 'fernanda.rocha@email.com', '(21) 99999-8888', '963.852.741-00']
      ];
      hospedes.forEach((hospede, i) => {
        db.run(`INSERT INTO hospedes (name, email, phone, document) VALUES (?, ?, ?, ?)`, hospede, function(err) {
          if (err) {
            console.error('Erro ao inserir hóspede:', err);
          } else {
            console.log(`Hóspede ${i + 1} inserido!`);
          }
        });
      });

      setTimeout(() => {
        const reservas = [
          [1, 4, '2024-01-15', '2024-01-18', 1350.00, 'confirmed'],
          [2, 9, '2024-01-20', '2024-01-22', 560.00, 'confirmed'],
          [3, 13, '2024-01-25', '2024-01-28', 2250.00, 'confirmed'],
          [4, 1, '2024-02-01', '2024-02-03', 500.00, 'confirmed'],
          [5, 6, '2024-02-05', '2024-02-08', 900.00, 'confirmed'],
          [6, 15, '2024-02-10', '2024-02-12', 760.00, 'confirmed'],
          [7, 3, '2024-02-15', '2024-02-18', 1350.00, 'confirmed'],
          [8, 11, '2024-02-20', '2024-02-22', 640.00, 'confirmed'],
          [1, 7, '2024-03-01', '2024-03-05', 2400.00, 'confirmed'],
          [2, 14, '2024-03-10', '2024-03-12', 400.00, 'confirmed']
        ];
        reservas.forEach((reserva, i) => {
          db.run(`INSERT INTO reservations (hospede_id, room_id, check_in_date, check_out_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?)`, reserva, function(err) {
            if (err) {
              console.error('Erro ao inserir reserva:', err);
            } else {
              console.log(`Reserva ${i + 1} inserida!`);
            }
          });
        });
        setTimeout(() => {
          console.log('Exemplo pronto!');
          process.exit(0);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}

inserirExemplo(); 