CREATE DATABASE quizdb;

-- Tabela para quizzes
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  settings JSONB NOT NULL
);

-- Tabela para perguntas
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
);

-- Tabela de acessos
CREATE TABLE user_access (
  id SERIAL PRIMARY KEY,
  quiz_instance_id INT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  access_granted_at TIMESTAMP DEFAULT NOW()
);
