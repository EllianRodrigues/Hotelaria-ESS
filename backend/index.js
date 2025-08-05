
const express = require('express');
const reservaRoutes = require('./routes/reservas.routes');
const favoritosRoutes = require('./routes/favoritos.routes');

const app = express();
app.use(express.json());

// Rotas de reservas
app.use('/api/reservas', reservaRoutes);

// Rotas de favoritos
app.use('/api/favoritos', favoritosRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`API de Reservas: http://localhost:${port}/api/reservas`);
  console.log(`API de Favoritos: http://localhost:${port}/api/favoritos`);
});

module.exports = app;




