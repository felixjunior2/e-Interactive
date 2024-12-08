const express = require('express');
const router = express.Router();
const pool = require('./db');

// Registrar acesso de usuário ao quiz
router.post('/access', async (req, res) => {
  try {
    const { quizInstanceId, userIds } = req.body;

    const accessInfo = await pool.query(
      `INSERT INTO quiz_access (quiz_instance_id, user_ids, access_granted_at)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [quizInstanceId, userIds]
    );
    res.status(201).json(accessInfo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validar acesso ao quiz
router.get('/access/:quizInstanceId/:userId', async (req, res) => {
  try {
    const { quizInstanceId, userId } = req.params;

    const validation = await pool.query(
      `SELECT * 
       FROM quiz_access
       WHERE quiz_instance_id = $1 AND $2 = ANY(user_ids)`,
      [quizInstanceId, userId]
    );

    if (validation.rows.length === 0) {
      return res.status(403).json({ isAllowed: false });
    }

    res.json({
      isAllowed: true,
      accessUrl: `/quiz/${quizInstanceId}`,
      expirationTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
