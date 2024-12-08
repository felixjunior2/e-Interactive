const express = require('express');
const router = express.Router();

module.exports = (storage) => {
  router.post('/performance', (req, res) => {
    try {
      const { quizInstanceId, studentId, performance } = req.body;
      storage.recordStudentPerformance(quizInstanceId, studentId, performance);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/report/:quizInstanceId', (req, res) => {
    try {
      const report = storage.generateQuizReport(req.params.quizInstanceId);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
