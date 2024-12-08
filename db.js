// db.js
const { Pool } = require('pg');

// Configuração de conexão
const pool = new Pool({
  user: 'postgres',       // Usuário do PostgreSQL
  host: 'localhost',      // Host do banco
  database: 'quizdb',     // Nome do banco
  password: 'senha',      // Senha do usuário
  port: 5432,             // Porta padrão
});

module.exports = pool;
