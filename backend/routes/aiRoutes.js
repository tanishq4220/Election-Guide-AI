const express = require('express');
const router = express.Router();
const { getElectionResponse } = require('../services/aiService');

router.post('/chat', async (req, res) => {
  const { prompt, history, userId, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await getElectionResponse(prompt, history, userId, mode);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
