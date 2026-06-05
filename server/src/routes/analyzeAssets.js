const express = require('express');
const router = express.Router();
const { validateAnalyzeRequest } = require('../validators/analyzeValidator');
const { analyzeAssets } = require('../services/aiService');

router.post('/', async (req, res) => {
  const validation = validateAnalyzeRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const { projectName, projectType, inputMode, rawInput } = req.body;

  let assets;
  if (inputMode === 'json') {
    const parsed = JSON.parse(rawInput);
    assets = (Array.isArray(parsed) ? parsed : Object.values(parsed))
      .map(String)
      .filter(a => a.trim().length > 0);
  } else {
    assets = rawInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  }

  try {
    const result = await analyzeAssets({ projectName, projectType, assets });
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('AI service error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'An error occurred while analyzing assets.',
    });
  }
});

module.exports = router;
