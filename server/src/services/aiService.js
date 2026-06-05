const OpenAI = require('openai');
const mockAiService = require('./mockAiService');

const PROMPT_TEMPLATE = `You are an AI assistant specialized in 3D/360 digital twin project management.
Analyze the following project assets and return ONLY a valid JSON object.
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
      "suggested_slug": "<lowercase-hyphen-slug: {project-type-prefix}-{category-token}-{asset-type}-{name}>",
      "priority": "<High | Medium | Low>",
      "management_note": "<one actionable note for managing this asset>",
      "confidence": <number between 0.6 and 0.98>,
      "matched_keywords": ["<keyword1>", "..."],
      "classification_reason": "<brief reason e.g. Matched keywords: panorama, 360>"
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
  ],
  "quality_score": {
    "score": <number 0-100>,
    "level": "<Excellent | Good | Needs Improvement>",
    "summary": "<one sentence quality summary>",
    "deductions": [
      { "reason": "<reason>", "points": <positive number> }
    ]
  }
}

CLASSIFICATION DECISION TREE — apply each step in strict order, stop at the first match:

STEP 1 — 360 Panorama
  Use when: the asset is a panoramic/360° photograph or wide view of a space.
  Keywords: panorama, 360, overview, wide view, scene, full view

STEP 2 — IoT / Sensor Point
  Use when: the asset is an electronic sensor, smart device, or monitoring unit.
  Keywords: sensor, IoT, camera, CCTV, detector, beacon, thermometer, humidity, temperature sensor, scanner, smart device, motion detector

STEP 3 — Safety Area
  Use when: the asset is safety equipment, an emergency device, or a defined safety zone.
  Keywords: fire extinguisher, emergency exit, AED, first aid, safety sign, alarm, evacuation, sprinkler, fire suppression, safety zone, hazard marker

STEP 4 — Navigation Point
  Use when: the asset guides movement or marks a path through a space.
  Keywords: route, marker, waypoint, path, direction, visitor route, guide path, navigation, arrow

STEP 5 — Interactive Hotspot
  Use when: the asset is an interactive information point in a 3D/360 scene.
  Keywords: hotspot, info point, interactive, clickable, popup, info hotspot

STEP 6 — Training / Annotation
  Use when: the asset is instructional content or an educational annotation.
  Keywords: training, tutorial, guide, instruction, manual, annotation, learning, e-learning

STEP 7 — Facility / Equipment  ← USE THIS for all physical objects, furniture, and machinery
  Use when: the asset is a physical object, piece of furniture, machine, or fixture.
  Keywords: chair, table, desk, shelf, cabinet, rack, machine, panel, counter, kiosk, display case, workstation, equipment, furniture, appliance, conveyor, printer, monitor, podium, showcase
  ⚠ CRITICAL RULE: An object INSIDE a room is NOT classified as the room's area category.
     "Meeting room chair" → Facility / Equipment (NOT Private Area)
     "Server room rack"   → Facility / Equipment (NOT Technical Area)
     "Reception desk"     → Facility / Equipment (NOT Public Area)
     The room/space context is irrelevant — classify by what the OBJECT IS, not where it is.

STEP 8 — Area categories (ONLY for spaces, rooms, or zones — NEVER for objects inside them)
  • Public Area:      entrance, lobby, reception area, hallway, corridor, cafeteria, waiting area, common area, visitor zone, showroom floor
  • Private Area:     office room, meeting room, conference room, bedroom, restroom, staff area, lounge, private room, VIP room
  • Production Area:  production line, assembly area, manufacturing floor, workshop, factory floor, processing zone
  • Technical Area:   server room, electrical room, control room, mechanical room, data center, IT room, utility room

STEP 9 — 3D Object (last resort fallback only)
  Use ONLY when no step above matches. A generic prop or model with no clear classification.

---

Slug format rules:
- All lowercase, hyphen-separated, no spaces, no special characters
- Format: {project-type-prefix}-{category-token}-{asset-type}-{asset-name}
- Project type prefix: factory, office, apt, showroom, museum, exhibit, school, tourism
- Category tokens: public, private, production, technical, safety, nav, hotspot, iot, panorama, object, facility, training

Priority rules:
- High: Safety Area, IoT / Sensor Point
- Medium: Production Area, Technical Area, Facility / Equipment (machines/panels only)
- Low: everything else

Confidence rules:
- 0.90-0.98: clear keyword match (more keywords = higher confidence)
- 0.70-0.89: partial keyword match or inferred from context
- 0.60: no keyword matched, fell back to 3D Object

Quality score rules (start from 100):
- Each duplicate slug: -8 pts
- Each asset name <4 chars: -10 pts
- Each 3D Object fallback: -4 pts
- All assets in one category (>=5): -8 pts
- Excellent: >=90, Good: >=70, Needs Improvement: <70

If no data quality warnings, return: "data_quality_warnings": []
If no quality deductions, return: "deductions": []`;

async function analyzeAssets(payload) {
  const useMock =
    process.env.USE_MOCK_AI === 'true' || !process.env.OPENAI_API_KEY;

  if (useMock) {
    return mockAiService.analyzeAssets(payload);
  }

  try {
    const { projectName, projectType, assets } = payload;
    const clientOptions = { apiKey: process.env.OPENAI_API_KEY };
    if (process.env.AI_BASE_URL) clientOptions.baseURL = process.env.AI_BASE_URL;
    const client = new OpenAI(clientOptions);

    const model = process.env.AI_MODEL || 'gpt-4o-mini';

    const prompt = PROMPT_TEMPLATE
      .replace(/{PROJECT_NAME}/g, projectName)
      .replace(/{PROJECT_TYPE}/g, projectType)
      .replace('{ASSETS}', assets.map((a, i) => `${i + 1}. ${a}`).join('\n'));

    const completion = await client.chat.completions.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const rawText = completion.choices[0].message.content || '';
    return JSON.parse(rawText);
  } catch (err) {
    const status = err?.status || err?.response?.status;
    console.warn(`OpenAI error (${status || err.message}) — falling back to Mock AI`);
    return mockAiService.analyzeAssets(payload);
  }
}

module.exports = { analyzeAssets };
