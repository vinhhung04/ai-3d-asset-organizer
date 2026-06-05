function parseAssetsFromInput(inputMode, rawInput) {
  if (inputMode !== 'json') {
    return rawInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawInput);
  } catch {
    throw new Error('Invalid JSON syntax. Please check your input.');
  }

  let items;
  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (parsed && Array.isArray(parsed.assets)) {
    items = parsed.assets;
  } else {
    throw new Error('JSON must be an array or an object with an "assets" array key.');
  }

  const assets = items
    .map(item => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item.name === 'string') return item.name.trim();
      return '';
    })
    .filter(s => s.length > 0);

  if (assets.length === 0) {
    throw new Error('No valid assets found in JSON input. Provide strings or objects with a "name" field.');
  }

  return assets;
}

module.exports = { parseAssetsFromInput };
