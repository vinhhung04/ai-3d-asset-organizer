const PROJECT_TYPE_PREFIX = {
  'Factory': 'factory',
  'Office': 'office',
  'Apartment': 'apt',
  'Retail Showroom': 'showroom',
  'Museum': 'museum',
  'Exhibition': 'exhibit',
  'School': 'school',
  'Tourism Site': 'tourism',
};

const CATEGORY_TOKEN = {
  'Public Area': 'public',
  'Private Area': 'private',
  'Production Area': 'production',
  'Technical Area': 'technical',
  'Safety Area': 'safety',
  'Navigation Point': 'nav',
  'Interactive Hotspot': 'hotspot',
  'IoT / Sensor Point': 'iot',
  '360 Panorama': 'panorama',
  '3D Object': 'object',
  'Facility / Equipment': 'facility',
  'Training / Annotation': 'training',
};

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-');
}

function buildSlug(projectType, category, assetType, name) {
  const prefix = PROJECT_TYPE_PREFIX[projectType] || slugify(projectType);
  const catToken = CATEGORY_TOKEN[category] || slugify(category);
  const typeToken = slugify(assetType || 'asset');
  const nameToken = slugify(name);
  return `${prefix}-${catToken}-${typeToken}-${nameToken}`;
}

module.exports = { slugify, buildSlug };
