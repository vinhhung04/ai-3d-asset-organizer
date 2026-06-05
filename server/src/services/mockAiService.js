const { buildSlug } = require('../utils/slugify');

const RULES = [
  { keywords: ['panorama', '360', 'overview', 'wide view'], category: '360 Panorama', assetType: 'panorama' },
  { keywords: ['safety', 'fire', 'emergency', 'extinguisher', 'hazard', 'warning'], category: 'Safety Area', assetType: 'safety-marker' },
  { keywords: ['sensor', 'iot', 'temperature', 'humidity', 'monitoring', 'detector'], category: 'IoT / Sensor Point', assetType: 'sensor' },
  { keywords: ['hotspot'], category: 'Interactive Hotspot', assetType: 'hotspot' },
  { keywords: ['training', 'employee', 'learning', 'guide', 'instruction', 'annotation'], category: 'Training / Annotation', assetType: 'training' },
  { keywords: ['machine', 'production line', 'manufacturing', 'assembly', 'conveyor'], category: 'Production Area', assetType: 'equipment' },
  { keywords: ['electrical', 'cabinet', 'server room', 'control panel', 'control room', 'switchboard', 'panel'], category: 'Technical Area', assetType: 'equipment' },
  { keywords: ['entrance', 'lobby', 'reception', 'visitor', 'route', 'gate', 'foyer'], category: 'Public Area', assetType: 'navigation' },
  { keywords: ['warehouse', 'storage', 'stockroom', 'rack'], category: 'Private Area', assetType: 'storage' },
  { keywords: ['inspection', 'quality', 'testing station', 'qc'], category: 'Production Area', assetType: 'station' },
  { keywords: ['desk', 'office', 'meeting room', 'conference'], category: 'Private Area', assetType: 'room' },
  { keywords: ['door', 'exit', 'corridor', 'hallway', 'staircase'], category: 'Navigation Point', assetType: 'navigation' },
];

function classifyAsset(name) {
  const lower = name.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return { category: rule.category, assetType: rule.assetType };
    }
  }
  return { category: '3D Object', assetType: 'object' };
}

function getPriority(category) {
  if (['Safety Area', 'IoT / Sensor Point'].includes(category)) return 'High';
  if (['Production Area', 'Technical Area'].includes(category)) return 'Medium';
  return 'Low';
}

function getManagementNote(category, assetType) {
  const notes = {
    'Safety Area': 'Ensure visible placement in virtual tour. Link to safety documentation.',
    'IoT / Sensor Point': 'Connect to real-time data stream if available. Add data overlay.',
    'Production Area': 'Tag with equipment ID for maintenance tracking.',
    'Technical Area': 'Restrict access in public tours. Include in admin layer only.',
    '360 Panorama': 'Set as scene anchor. Optimize resolution for web streaming.',
    'Interactive Hotspot': 'Add descriptive tooltip. Link to relevant media or documentation.',
    'Training / Annotation': 'Include in onboarding flow. Support multilingual labels.',
    'Public Area': 'Optimize for first-load performance. Use as tour entry point if applicable.',
    'Navigation Point': 'Ensure clear wayfinding arrows. Test on mobile viewport.',
    'Private Area': 'Add access control layer in production deployment.',
    'Facility / Equipment': 'Include equipment manual link in metadata.',
    '3D Object': 'Review if asset requires a more specific category for better organization.',
  };
  return notes[category] || 'Review and assign a more specific category if applicable.';
}

function analyzeAssets({ projectName, projectType, assets }) {
  const classified = assets.map(name => {
    const { category, assetType } = classifyAsset(name);
    const priority = getPriority(category);
    const slug = buildSlug(projectType, category, assetType, name);
    const managementNote = getManagementNote(category, assetType);
    return {
      original_name: name,
      category,
      asset_type: assetType,
      suggested_slug: slug,
      priority,
      management_note: managementNote,
    };
  });

  // Sort: High → Medium → Low
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  classified.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const mainCategories = [...new Set(classified.map(a => a.category))];

  const slugCounts = {};
  classified.forEach(a => {
    slugCounts[a.suggested_slug] = (slugCounts[a.suggested_slug] || 0) + 1;
  });
  const dataQualityWarnings = [];
  classified.forEach(a => {
    if (slugCounts[a.suggested_slug] > 1) {
      dataQualityWarnings.push({
        asset: a.original_name,
        issue: 'Duplicate slug detected',
        suggestion: 'Add a numeric suffix or more descriptive name to differentiate this asset.',
      });
    }
    if (a.original_name.trim().length < 4) {
      dataQualityWarnings.push({
        asset: a.original_name,
        issue: 'Asset name too short',
        suggestion: 'Use a more descriptive name (at least 4 characters) for better searchability.',
      });
    }
  });

  const safetyCount = classified.filter(a => a.category === 'Safety Area').length;
  const iotCount = classified.filter(a => a.category === 'IoT / Sensor Point').length;
  const panoramaCount = classified.filter(a => a.category === '360 Panorama').length;

  const summaryParts = [
    `${projectName} is a ${projectType.toLowerCase()} project with ${assets.length} identified assets across ${mainCategories.length} categories.`,
  ];
  if (panoramaCount > 0) summaryParts.push(`${panoramaCount} panoramic view(s) serve as spatial anchors.`);
  if (safetyCount > 0) summaryParts.push(`${safetyCount} safety asset(s) require high-priority placement.`);
  if (iotCount > 0) summaryParts.push(`${iotCount} IoT/sensor point(s) ready for real-time data integration.`);

  const typePrefix = projectType.toLowerCase().replace(/\s+/g, '-');
  const namingConvention = `{project-type}-{category}-{asset-type}-{name}\nExample: ${typePrefix}-public-navigation-main-entrance`;

  return {
    project_metadata: {
      project_name: projectName,
      project_type: projectType,
      total_assets: assets.length,
      main_categories: mainCategories,
      summary: summaryParts.join(' '),
      recommended_naming_convention: namingConvention,
    },
    classified_assets: classified,
    organization_suggestions: [
      `Group assets by category folders in your CMS: /${typePrefix}/panoramas/, /${typePrefix}/safety/, /${typePrefix}/iot/ for faster retrieval and team collaboration.`,
      `Apply a consistent slug format across all projects: {project-type}-{category}-{asset-type}-{name}. This enables automated search and filtering in your asset management system.`,
      `Prioritize High-priority assets (Safety, IoT) in your loading pipeline to ensure critical information is always visible first in virtual tours and digital twins.`,
    ],
    data_quality_warnings: dataQualityWarnings,
  };
}

module.exports = { analyzeAssets };
