const Anthropic = require('@anthropic-ai/sdk');
const mockAiService = require('./mockAiService');

const PROMPT_TEMPLATE = `You are an AI assistant specialized in 3D/360 digital twin and virtual tour project management.
Analyze the following 3D project assets and return ONLY a valid JSON object.
Do NOT wrap in markdown code blocks. Do NOT add explanation. Return raw JSON only.

Project Name: {PROJECT_NAME}
Project Type: {PROJECT_TYPE}
Assets to classify:
{ASSETS}

Return exactly this JSON structure (fill all fields):
{
  "project_metadata": {
    "project_name": "{PROJECT_NAME}",
    "project_type": "{PROJECT_TYPE}",
    "total_assets": <number>,
    "main_categories": ["<category1>", "..."],
    "summary": "<2-3 sentence summary of the project and its asset composition>",
    "recommended_naming_convention": "<format string with example>"
  },
  "classified_assets": [
    {
      "original_name": "<exact original name>",
      "category": "<one of the categories below>",
      "asset_type": "<short type slug e.g. panorama, sensor, hotspot, equipment, navigation, room, storage, station, object>",
      "suggested_slug": "<lowercase-hyphen-slug following format: {project-type-prefix}-{category-token}-{asset-type}-{name}>",
      "priority": "<High | Medium | Low>",
      "management_note": "<one actionable note for managing this asset>"
    }
  ],
  "organization_suggestions": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>"
  ],
  "data_quality_warnings": [
    {
      "asset": "<asset name>",
      "issue": "<issue description>",
      "suggestion": "<how to fix it>"
    }
  ]
}

Categories to use (pick the most specific match):
Public Area, Private Area, Production Area, Technical Area, Safety Area, Navigation Point, Interactive Hotspot, IoT / Sensor Point, 360 Panorama, 3D Object, Facility / Equipment, Training / Annotation

Slug format rules:
- All lowercase, hyphen-separated, no spaces, no special characters
- Format: {project-type-prefix}-{category-token}-{asset-type}-{asset-name}
- Project type prefix: factory, office, apt, showroom, museum, exhibit, school, tourism
- Category tokens: public, private, production, technical, safety, nav, hotspot, iot, panorama, object, facility, training

Priority rules:
- High: Safety Area, IoT / Sensor Point (critical for safety and monitoring)
- Medium: Production Area, Technical Area (operational assets)
- Low: everything else

Data quality warnings: flag duplicate names, very short names (<4 chars), or assets with ambiguous descriptions.
If no warnings, return an empty array: []`;

async function analyzeAssets(payload) {
  const useMock =
    process.env.USE_MOCK_AI === 'true' || !process.env.ANTHROPIC_API_KEY;

  if (useMock) {
    return mockAiService.analyzeAssets(payload);
  }

  const { projectName, projectType, assets } = payload;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = PROMPT_TEMPLATE
    .replace(/{PROJECT_NAME}/g, projectName)
    .replace(/{PROJECT_TYPE}/g, projectType)
    .replace('{ASSETS}', assets.map((a, i) => `${i + 1}. ${a}`).join('\n'));

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const rawText = message.content[0].text;

  // Strip markdown fences if Claude wrapped the response despite instructions
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `AI returned invalid JSON. Raw response: ${rawText.slice(0, 200)}`
    );
  }

  return result;
}

module.exports = { analyzeAssets };
