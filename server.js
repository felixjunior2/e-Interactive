const express = require('express');
const bodyParser = require('body-parser');
const InMemoryStorage = require('./storage'); // Classe de armazenamento
const quizConfigRoutes = require('./quizConfigRoutes');
const userDeploymentRoutes = require('./userDeploymentRoutes');
const quizAnalyticsRoutes = require('./quizAnalyticsRoutes');

const app = express();
const storage = new InMemoryStorage();

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/quiz/config', quizConfigRoutes(storage));
app.use('/quiz/user', userDeploymentRoutes(storage));
app.use('/quiz/analytics', quizAnalyticsRoutes(storage));

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
