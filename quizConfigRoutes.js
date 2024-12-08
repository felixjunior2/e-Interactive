const express = require('express');
const router = express.Router();

module.exports = (storage) => {
  router.post('/', (req, res) => {
    try {
      const config = req.body;
      const configId = storage.createQuizConfig(config);
      res.status(201).json({ configId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:configId', (req, res) => {
    try {
      const config = storage.getQuizConfig(req.params.configId);
      if (!config) return res.status(404).json({ error: 'Quiz not found' });
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:configId', (req, res) => {
    try {
      storage.updateQuizConfig(req.params.configId, req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:configId', (req, res) => {
    try {
      storage.deleteQuizConfig(req.params.configId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/', (req, res) => {
    try {
      const { title, startDateFrom, startDateTo } = req.query;
      const filters = {
        title,
        startDateFrom: startDateFrom ? new Date(startDateFrom) : undefined,
        startDateTo: startDateTo ? new Date(startDateTo) : undefined,
      };
      const configs = storage.listQuizConfigurations(filters);
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
