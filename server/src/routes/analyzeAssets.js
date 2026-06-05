const express = require('express');
const router = express.Router();
const { validateAnalyzeRequest } = require('../validators/analyzeValidator');
const { parseAssetsFromInput } = require('../utils/parseAssets');
const { analyzeAssets } = require('../services/aiService');

router.post('/', async (req, res) => {
  const validation = validateAnalyzeRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const { projectName, projectType, inputMode, rawInput } = req.body;

  let assets;
  try {
    assets = parseAssetsFromInput(inputMode, rawInput);
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
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
