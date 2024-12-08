const express = require('express');
const bodyParser = require('body-parser');

// Importação das rotas
const quizConfigRoutes = require('./quizConfigRoutes');

// Inicialização do servidor
const app = express();
app.use(bodyParser.json());

// Registro das rotas
app.use('/quiz/config', quizConfigRoutes());

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
