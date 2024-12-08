const express = require('express');
const router = express.Router();

module.exports = (storage) => {
  router.post('/access', (req, res) => {
    try {
      const { quizInstanceId, userIds } = req.body;
      const accessInfo = storage.registerQuizAccess(quizInstanceId, userIds);
      res.status(201).json(accessInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/access/:quizInstanceId/:userId', (req, res) => {
    try {
      const { quizInstanceId, userId } = req.params;
      const accessValidation = storage.validateQuizAccess(quizInstanceId, userId);
      res.json(accessValidation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/attempt', (req, res) => {
    try {
      const { quizInstanceId, userId, attemptDetails } = req.body;
      storage.recordQuizAttempt(quizInstanceId, userId, attemptDetails);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
