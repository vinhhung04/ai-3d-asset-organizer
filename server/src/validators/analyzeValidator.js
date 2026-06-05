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
      const parsed = JSON.parse(rawInput);
      const assets = Array.isArray(parsed) ? parsed : Object.values(parsed);
      const validAssets = assets.map(String).filter(a => a.trim().length > 0);
      if (validAssets.length === 0) {
        return { valid: false, message: 'JSON input contains no valid assets.' };
      }
    } catch {
      return {
        valid: false,
        message: 'Invalid JSON format. Please provide a valid JSON array of asset names.',
      };
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
