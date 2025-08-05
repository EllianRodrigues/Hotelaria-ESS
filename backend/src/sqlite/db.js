import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

if (process.env.NODE_ENV === 'test') {
    // Use in-memory database for testing
    db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.error('Error opening in-memory database:', err.message);
        } else {
            console.log('Connected to in-memory SQLite database.');
        }
    });
} else {
    // Use persistent database for development/production
    const dbPath = path.resolve(__dirname, '../../data/database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to SQLite database at', dbPath);
        }
    });
}

db.serialize(() => {
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
    senha TEXT NOT NULL,
    cidade TEXT
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (hospede_id) REFERENCES hospede(id)
  )`);
});

export default db; 