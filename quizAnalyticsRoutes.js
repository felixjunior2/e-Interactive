const express = require('express');
const router = express.Router();
const pool = require('./db');

// Registrar desempenho de um estudante
router.post('/performance', async (req, res) => {
  try {
    const { quizInstanceId, studentId, performance } = req.body;

    await pool.query(
      `INSERT INTO quiz_performance (quiz_instance_id, student_id, performance)
       VALUES ($1, $2, $3)`,
      [quizInstanceId, studentId, performance]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gerar relatório de desempenho
router.get('/report/:quizInstanceId', async (req, res) => {
  try {
    const { quizInstanceId } = req.params;

    const report = await pool.query(
      `SELECT 
        COUNT(*) AS total_attempts,
        AVG(performance->>'averageScore')::FLOAT AS average_score,
        AVG((performance->>'timeSpent')::INT) AS average_time_spent
       FROM quiz_performance
       WHERE quiz_instance_id = $1`,
      [quizInstanceId]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }
    res.json(report.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
