const { buildSlug } = require('../utils/slugify');

const RULES = [
  { keywords: ['panorama', '360', 'overview', 'wide view'], category: '360 Panorama', assetType: 'panorama' },
  { keywords: ['safety', 'fire', 'emergency', 'extinguisher', 'hazard', 'warning'], category: 'Safety Area', assetType: 'safety-marker' },
  { keywords: ['sensor', 'iot', 'temperature', 'humidity', 'monitoring', 'detector', 'hvac', 'thermostat'], category: 'IoT / Sensor Point', assetType: 'sensor' },
  { keywords: ['hotspot'], category: 'Interactive Hotspot', assetType: 'hotspot' },
  { keywords: ['training', 'employee', 'learning', 'guide', 'instruction', 'annotation', 'badge'], category: 'Training / Annotation', assetType: 'training' },
  { keywords: ['machine', 'production line', 'manufacturing', 'assembly', 'conveyor'], category: 'Production Area', assetType: 'equipment' },
  { keywords: ['electrical', 'cabinet', 'server room', 'control panel', 'control room', 'switchboard', 'panel'], category: 'Technical Area', assetType: 'equipment' },
  { keywords: ['entrance', 'lobby', 'reception', 'visitor', 'route', 'gate', 'foyer', 'ticket', 'counter'], category: 'Public Area', assetType: 'navigation' },
  { keywords: ['warehouse', 'storage', 'stockroom', 'rack'], category: 'Private Area', assetType: 'storage' },
  { keywords: ['inspection', 'quality', 'testing station', 'qc'], category: 'Production Area', assetType: 'station' },
  { keywords: ['desk', 'office', 'meeting room', 'conference', 'open plan', 'ceo'], category: 'Private Area', assetType: 'room' },
  { keywords: ['door', 'exit', 'corridor', 'hallway', 'staircase', 'marker', 'tour'], category: 'Navigation Point', assetType: 'navigation' },
  { keywords: ['display', 'showcase', 'exhibit', 'artifact', 'gallery'], category: 'Facility / Equipment', assetType: 'display' },
  { keywords: ['window', 'fitting', 'pos', 'cctv', 'lighting', 'balcony'], category: 'Facility / Equipment', assetType: 'facility' },
];

function classifyAsset(name) {
  const lower = name.toLowerCase();
  for (const rule of RULES) {
    const matched = rule.keywords.filter(kw => lower.includes(kw));
    if (matched.length > 0) {
      const confidence = Math.min(0.9 + matched.length * 0.02, 0.98);
      return {
        category: rule.category,
        assetType: rule.assetType,
        confidence,
        matched_keywords: matched,
        classification_reason: `Matched keyword${matched.length > 1 ? 's' : ''}: ${matched.join(', ')}`,
      };
    }
  }
  return {
    category: '3D Object',
    assetType: 'object',
    confidence: 0.6,
    matched_keywords: [],
    classification_reason: 'No specific keyword matched; classified as generic 3D Object.',
  };
}

function getPriority(category) {
  if (['Safety Area', 'IoT / Sensor Point'].includes(category)) return 'High';
  if (['Production Area', 'Technical Area'].includes(category)) return 'Medium';
  return 'Low';
}

function getManagementNote(category) {
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

function computeQualityScore(classified, autoFixedAssets) {
  let score = 100;
  const deductions = [];

  if (autoFixedAssets.length > 0) {
    const pts = autoFixedAssets.length * 8;
    score -= pts;
    deductions.push({ reason: `${autoFixedAssets.length} duplicate slug(s) auto-resolved`, points: pts });
  }

  const shortNames = classified.filter(a => a.original_name.trim().length < 4);
  if (shortNames.length > 0) {
    const pts = shortNames.length * 10;
    score -= pts;
    deductions.push({ reason: `${shortNames.length} asset name(s) too short (<4 chars)`, points: pts });
  }

  const defaultCount = classified.filter(a => a.category === '3D Object').length;
  if (defaultCount > 0) {
    const pts = defaultCount * 4;
    score -= pts;
    deductions.push({ reason: `${defaultCount} asset(s) fell back to generic 3D Object`, points: pts });
  }

  const catCounts = {};
  classified.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });
  const catKeys = Object.keys(catCounts);
  if (catKeys.length === 1 && catCounts[catKeys[0]] >= 5) {
    score -= 8;
    deductions.push({ reason: 'All assets belong to a single category', points: 8 });
  }

  score = Math.max(0, score);
  const level = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement';
  const summary = score >= 90
    ? 'Asset naming and classification quality is excellent.'
    : score >= 70
    ? 'Good quality overall with minor improvements possible.'
    : 'Several issues found that should be addressed before production use.';

  return { score, level, summary, deductions };
}

function analyzeAssets({ projectName, projectType, assets }) {
  // Step 1: classify each asset
  const classified = assets.map(name => {
    const { category, assetType, confidence, matched_keywords, classification_reason } = classifyAsset(name);
    const priority = getPriority(category);
    const slug = buildSlug(projectType, category, assetType, name);
    const management_note = getManagementNote(category);
    return {
      original_name: name,
      category,
      asset_type: assetType,
      suggested_slug: slug,
      priority,
      management_note,
      confidence,
      matched_keywords,
      classification_reason,
    };
  });

  // Step 2: auto-fix duplicate slugs (two-pass, using array records)
  const slugCount = {};
  classified.forEach(a => {
    slugCount[a.suggested_slug] = (slugCount[a.suggested_slug] || 0) + 1;
  });
  const slugSeq = {};
  const autoFixedAssets = [];
  classified.forEach((a, index) => {
    const base = a.suggested_slug;
    if (slugCount[base] > 1) {
      slugSeq[base] = (slugSeq[base] || 0) + 1;
      a.suggested_slug = `${base}-${String(slugSeq[base]).padStart(2, '0')}`;
      autoFixedAssets.push({ index, asset: a.original_name, baseSlug: base, newSlug: a.suggested_slug });
    }
  });

  // Step 3: sort by priority
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  classified.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Step 4: build metadata
  const mainCategories = [...new Set(classified.map(a => a.category))];

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

  // Step 5: build warnings
  const dataQualityWarnings = [];
  autoFixedAssets.forEach(({ asset }) => {
    dataQualityWarnings.push({
      asset,
      issue: 'Duplicate slug auto-resolved',
      suggestion: 'A numeric suffix was appended to keep the slug unique.',
    });
  });
  classified.forEach(a => {
    if (a.original_name.trim().length < 4) {
      dataQualityWarnings.push({
        asset: a.original_name,
        issue: 'Asset name too short',
        suggestion: 'Use a more descriptive name (at least 4 characters) for better searchability.',
      });
    }
  });

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
    quality_score: computeQualityScore(classified, autoFixedAssets),
  };
}

module.exports = { analyzeAssets };
