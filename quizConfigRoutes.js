const express = require('express');
const router = express.Router();
const db = require('./db');

// Rotas de Configuração de Quizzes
module.exports = () => {
  router.post('/', async (req, res) => {
    try {
      const { title, startDate, endDate, settings } = req.body;

      const result = await db.query(
        `INSERT INTO quizzes (title, start_date, end_date, settings) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, startDate, endDate, settings]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:configId', async (req, res) => {
    try {
      const { configId } = req.params;

      const result = await db.query(
        `SELECT * FROM quizzes WHERE id = $1`,
        [configId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:configId', async (req, res) => {
    try {
      const { configId } = req.params;

      await db.query(`DELETE FROM quizzes WHERE id = $1`, [configId]);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
