const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); // Importa o módulo 'fs'

const dbPath = path.resolve(__dirname, '../../data/database.sqlite');
const dataDir = path.dirname(dbPath); 

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true }); 
}

const db = new sqlite3.Database(dbPath);

// db.serialize(() => {
//   db.run(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     email TEXT NOT NULL UNIQUE
//   )`);

//   db.run(`CREATE TABLE IF NOT EXISTS hotels (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     city TEXT NOT NULL
//   )`);

//   db.run(`CREATE TABLE IF NOT EXISTS rooms (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     identifier INTEGER NOT NULL,
//     type TEXT CHECK(type IN ('hotelRoom', 'lodge')) NOT NULL,
//     n_of_adults INTEGER NOT NULL,
//     description TEXT,
//     cost INTEGER NOT NULL,
//     photos TEXT,
//     hotel_id INTEGER,
//     FOREIGN KEY (hotel_id) REFERENCES hotels(id),
//     UNIQUE(identifier, type, hotel_id)
//   )`);

//   db.run(`CREATE TABLE IF NOT EXISTS reservations (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     start_date TEXT NOT NULL,
//     end_date TEXT NOT NULL,
//     room_id INTEGER NOT NULL,
//     FOREIGN KEY (room_id) REFERENCES rooms(id)
//   )`);
// });


db.run(`CREATE TABLE IF NOT EXISTS hospede (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS hotel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cnpj TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
)`);

module.exports = db; 