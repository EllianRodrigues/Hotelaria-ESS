// Feito por Juliano Matheus Ferreira
// Banco de dados adaptado para funcionar com CommonJS e estrutura do grupo

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar conexão com banco do grupo
const dbPath = path.resolve(__dirname, '../data/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco do grupo:', err.message);
    // Se não existir, criar o banco
    console.log('Criando banco do grupo...');
    inicializarBancoGrupo();
  } else {
    console.log('✅ Banco do grupo conectado em:', dbPath);
    verificarEstruturaBanco();
  }
});

// Função para inicializar banco do grupo
function inicializarBancoGrupo() {
  db.serialize(() => {
    // Tabelas do grupo
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS hospede (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      cpf TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      cnpj TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier INTEGER NOT NULL,
      type TEXT CHECK(type IN ('hotelRoom', 'lodge')) NOT NULL,
      n_of_adults INTEGER NOT NULL,
      description TEXT,
      cost INTEGER NOT NULL,
      photos TEXT,
      city TEXT NOT NULL,
      hotel_id INTEGER,
      FOREIGN KEY (hotel_id) REFERENCES hotels(id),
      UNIQUE(identifier, type, hotel_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      room_id INTEGER NOT NULL,
      hospede_id INTEGER NOT NULL,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (hospede_id) REFERENCES hospede(id)
    )`);

    // Inserir dados de exemplo
    inserirDadosExemplo();
  });
}

// Verificar estrutura do banco
function verificarEstruturaBanco() {
  db.get("SELECT COUNT(*) as count FROM hospede", (err, row) => {
    if (err) {
      console.log('Estrutura do banco não encontrada, criando...');
      inicializarBancoGrupo();
    } else if (row.count === 0) {
      console.log('Banco vazio, inserindo dados de exemplo...');
      inserirDadosExemplo();
    } else {
      console.log('✅ Banco do grupo já possui dados');
    }
  });
}

// Inserir dados de exemplo
function inserirDadosExemplo() {
  // Inserir hóspedes
  const hospedes = [
    { nome: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00', senha: '123456' },
    { nome: 'Maria Santos', email: 'maria@email.com', cpf: '987.654.321-00', senha: '123456' },
    { nome: 'Pedro Costa', email: 'pedro@email.com', cpf: '111.222.333-44', senha: '123456' },
    { nome: 'Ana Oliveira', email: 'ana@email.com', cpf: '555.666.777-88', senha: '123456' },
    { nome: 'Carlos Ferreira', email: 'carlos@email.com', cpf: '999.888.777-66', senha: '123456' }
  ];

  hospedes.forEach(hospede => {
    db.run('INSERT OR IGNORE INTO hospede (nome, email, cpf, senha) VALUES (?, ?, ?, ?)',
      [hospede.nome, hospede.email, hospede.cpf, hospede.senha]);
  });

  // Inserir hotéis
  const hoteis = [
    { nome: 'Hotel Copacabana Palace', email: 'contato@copacabana.com', cnpj: '12.345.678/0001-01', senha: '123456' },
    { nome: 'Hotel Fasano', email: 'contato@fasano.com', cnpj: '12.345.678/0001-02', senha: '123456' },
    { nome: 'Hotel Unique', email: 'contato@unique.com', cnpj: '12.345.678/0001-03', senha: '123456' },
    { nome: 'Hotel Emiliano', email: 'contato@emiliano.com', cnpj: '12.345.678/0001-04', senha: '123456' },
    { nome: 'Hotel Santa Teresa', email: 'contato@santateresa.com', cnpj: '12.345.678/0001-05', senha: '123456' }
  ];

  hoteis.forEach(hotel => {
    db.run('INSERT OR IGNORE INTO hotels (nome, email, cnpj, senha) VALUES (?, ?, ?, ?)',
      [hotel.nome, hotel.email, hotel.cnpj, hotel.senha]);
  });

  // Inserir quartos
  const quartos = [
    { identifier: 101, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Standard', cost: 800, photos: '', city: 'Rio de Janeiro', hotel_id: 1 },
    { identifier: 102, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Deluxe', cost: 1200, photos: '', city: 'Rio de Janeiro', hotel_id: 1 },
    { identifier: 201, type: 'hotelRoom', n_of_adults: 4, description: 'Suite', cost: 2000, photos: '', city: 'Rio de Janeiro', hotel_id: 1 },
    { identifier: 301, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Standard', cost: 900, photos: '', city: 'São Paulo', hotel_id: 2 },
    { identifier: 302, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Deluxe', cost: 1400, photos: '', city: 'São Paulo', hotel_id: 2 },
    { identifier: 401, type: 'hotelRoom', n_of_adults: 4, description: 'Suite', cost: 2500, photos: '', city: 'São Paulo', hotel_id: 3 },
    { identifier: 402, type: 'hotelRoom', n_of_adults: 6, description: 'Presidential', cost: 5000, photos: '', city: 'São Paulo', hotel_id: 3 },
    { identifier: 501, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Standard', cost: 850, photos: '', city: 'São Paulo', hotel_id: 4 },
    { identifier: 502, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Deluxe', cost: 1300, photos: '', city: 'São Paulo', hotel_id: 4 },
    { identifier: 601, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Standard', cost: 600, photos: '', city: 'Rio de Janeiro', hotel_id: 5 },
    { identifier: 602, type: 'hotelRoom', n_of_adults: 2, description: 'Quarto Deluxe', cost: 900, photos: '', city: 'Rio de Janeiro', hotel_id: 5 }
  ];

  quartos.forEach(quarto => {
    db.run('INSERT OR IGNORE INTO rooms (identifier, type, n_of_adults, description, cost, photos, city, hotel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [quarto.identifier, quarto.type, quarto.n_of_adults, quarto.description, quarto.cost, quarto.photos, quarto.city, quarto.hotel_id]);
  });

  // Inserir reservas
  const reservas = [
    { name: 'Reserva João', start_date: '2024-01-15', end_date: '2024-01-18', room_id: 1, hospede_id: 1 },
    { name: 'Reserva Maria', start_date: '2024-01-20', end_date: '2024-01-25', room_id: 2, hospede_id: 2 },
    { name: 'Reserva Pedro', start_date: '2024-02-10', end_date: '2024-02-12', room_id: 3, hospede_id: 3 },
    { name: 'Reserva Ana', start_date: '2024-02-15', end_date: '2024-02-20', room_id: 4, hospede_id: 4 },
    { name: 'Reserva Carlos', start_date: '2024-03-01', end_date: '2024-03-03', room_id: 5, hospede_id: 5 }
  ];

  reservas.forEach(reserva => {
    db.run('INSERT OR IGNORE INTO reservations (name, start_date, end_date, room_id, hospede_id) VALUES (?, ?, ?, ?, ?)',
      [reserva.name, reserva.start_date, reserva.end_date, reserva.room_id, reserva.hospede_id]);
  });

  console.log('✅ Dados de exemplo inseridos com sucesso!');
}

module.exports = db; 