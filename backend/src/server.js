const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors'); 

app.use(cors()); 
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

// Só inicia o servidor se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 