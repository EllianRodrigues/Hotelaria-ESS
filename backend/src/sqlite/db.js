const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../data/database.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('hotel-room', 'lodge')) NOT NULL,
    n_of_adults INTEGER NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    photos TEXT
  )`);
  // photos are to be stored in the JSON.stringify(<array>) format
});

module.exports = db; 