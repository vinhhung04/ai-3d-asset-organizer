const { parseAssetsFromInput } = require('../utils/parseAssets');

function validateAnalyzeRequest(body) {
  const { projectName, projectType, inputMode, rawInput } = body;

  if (!projectName || !projectName.trim()) {
    return { valid: false, message: 'Project name is required.' };
  }
  if (!projectType || !projectType.trim()) {
    return { valid: false, message: 'Project type is required.' };
  }
  if (!rawInput || !rawInput.trim()) {
    return { valid: false, message: 'Asset list is required.' };
  }

  if (inputMode === 'json') {
    try {
      const assets = parseAssetsFromInput('json', rawInput);
      if (assets.length === 0) {
        return { valid: false, message: 'JSON input contains no valid assets.' };
      }
    } catch (e) {
      return { valid: false, message: `Invalid JSON: ${e.message}` };
    }
  } else {
    const lines = rawInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      return { valid: false, message: 'Asset list contains no valid assets.' };
    }
  }

  return { valid: true };
}

module.exports = { validateAnalyzeRequest };
