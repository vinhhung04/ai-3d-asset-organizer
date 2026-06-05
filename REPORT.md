# REPORT — AI 3D/360 Asset Organizer

**Candidate:** vinhhung04  
**Position:** Technology Intern — StarGlobal 3D  
**Test Option:** Option B — AI 3D/360 Asset Organizer  
**Submission Date:** 2025

---

## 1. Features Implemented

| Feature | Status | Notes |
|---|---|---|
| Asset input (raw text / JSON) | ✅ Done | Textarea with mode toggle; 4 JSON formats supported |
| Project type selection | ✅ Done | 8 project types |
| Asset auto-classification | ✅ Done | 12 categories |
| Slug generation | ✅ Done | Structured format per spec |
| Auto duplicate-slug fix | ✅ Done | Two-pass; appends `-01`/`-02` suffix automatically |
| Project metadata output | ✅ Done | Summary, category list, naming convention |
| Asset Quality Score | ✅ Done | 0–100 score, level badge, itemized deductions |
| Confidence score per asset | ✅ Done | % + matched keywords + classification reason |
| Organization suggestions | ✅ Done | 3 AI-generated suggestions |
| Data quality warnings | ✅ Done | Duplicate slugs, short names |
| CSV export | ✅ Done | 8-column download (includes confidence, reason) |
| Raw JSON export + copy | ✅ Done | Clipboard API with fallback |
| 5 demo presets | ✅ Done | Factory, Showroom, Apartment, Museum, Office |
| Loading state | ✅ Done | Animated spinner + progress |
| Error state | ✅ Done | Friendly error card with message |
| Empty state | ✅ Done | Onboarding-style empty panel |
| Input validation | ✅ Done | Required fields + JSON parse validation |
| Mock AI fallback | ✅ Done | Keyword-based, no API key needed |
| OpenAI API integration | ✅ Done | gpt-4o-mini; falls back to mock on any error |
| Responsive layout | ✅ Done | Two-column desktop, single-column mobile |
| Production deployment support | ✅ Done | Render + Vercel ready |

---

## 2. AI/LLM Usage in This Project

The project integrates with the **OpenAI API** (model: `gpt-4o-mini`) via the `openai` npm package.

**When OpenAI is used:** When `USE_MOCK_AI=false` and `OPENAI_API_KEY` is set, every analyze request sends a structured prompt to GPT-4o-mini with `response_format: { type: 'json_object' }`, receiving a structured JSON response containing the full classification result including confidence scores and quality score.

**When Mock AI is used:** When `USE_MOCK_AI=true` (default) or when the API key is absent or invalid, a keyword-based classification engine in `server/src/services/mockAiService.js` performs the classification. The mock AI also computes confidence scores, auto-fixes duplicate slugs, and generates an Asset Quality Score using the same scoring rules as the OpenAI prompt.

**Fallback design decision:** The mock AI produces the exact same output schema as the OpenAI integration, so the frontend is unaware of which mode is active. Any OpenAI API error (401, 403, network error, invalid JSON) is caught and silently falls back to mock AI — the user always gets a result.

---

## 3. Sample Prompt Used (OpenAI Mode)

The prompt sent to GPT-4o-mini is structured as follows (simplified):

```
You are an AI assistant specialized in 3D/360 digital twin project management.
Analyze the following project assets and return ONLY a valid JSON object.
Do NOT wrap in markdown code blocks. Return raw JSON only.

Project Name: Smart Factory 3D/360 Demo
Project Type: Factory
Assets:
1. Main entrance 360 panorama
2. Reception desk
3. Electrical cabinet
...

Return exactly this JSON structure:
{
  "project_metadata": { ... },
  "classified_assets": [
    {
      "original_name": "...",
      "category": "...",
      "suggested_slug": "...",
      "priority": "High | Medium | Low",
      "management_note": "...",
      "confidence": 0.92,
      "matched_keywords": ["panorama", "360"],
      "classification_reason": "Matched keywords: panorama, 360"
    }
  ],
  "organization_suggestions": [...],
  "data_quality_warnings": [...],
  "quality_score": {
    "score": 86, "level": "Good",
    "summary": "...",
    "deductions": [{ "reason": "...", "points": 8 }]
  }
}

Categories: Public Area, Private Area, Production Area, Technical Area,
Safety Area, Navigation Point, Interactive Hotspot, IoT / Sensor Point,
360 Panorama, 3D Object, Facility / Equipment, Training / Annotation

Slug format: {project-type-prefix}-{category-token}-{asset-type}-{asset-name}
Priority: High (Safety/IoT), Medium (Production/Technical), Low (others)
Confidence: 0.90–0.98 for keyword match, 0.60 for fallback
Quality score: start 100, deduct per duplicate/short name/3D Object fallback/single category
```

**Why this prompt design:**

- `response_format: { type: 'json_object' }` enforces structured JSON output from the API
- Exact JSON schema in the prompt reduces hallucinated fields
- Category list constrains output to valid values
- Confidence and quality scoring rules are explicit so OpenAI's output is consistent with mock AI

---

## 4. Additional Features

Beyond the core requirements, the following enhancements were added to demonstrate product depth:

### Asset Quality Score

A 0–100 quality score computed from the classified asset set:

- **−8 pts** per duplicate slug auto-resolved
- **−10 pts** per asset name under 4 characters
- **−4 pts** per asset that fell back to the generic "3D Object" category
- **−8 pts** if all assets belong to a single category (≥5 assets)

Score levels: **Excellent** (≥90) · **Good** (≥70) · **Needs Improvement** (<70)

The score is displayed as a card with a progress bar, level badge, and itemized deductions list.

### Auto Duplicate-Slug Fix

Uses a two-pass algorithm: pass 1 counts base slug occurrences; pass 2 assigns sequential `-01`, `-02` suffixes. All occurrences (including the first) are renamed when a collision is detected. The auto-fix is reflected in both data quality warnings and the quality score deductions.

### Confidence Score & Classification Reason

Each asset includes:

- `confidence`: 0.60 (no keyword match) to 0.98 (multiple keywords matched)
- `matched_keywords`: array of keywords that triggered the rule
- `classification_reason`: human-readable explanation

These are displayed inline in the assets table and exported to CSV.

### CSV Export

One-click download of the full classification table with 8 columns: original name, category, type, slug, priority, confidence, classification reason, management note. The CSV filename is derived from the project name.

### 5 Demo Presets

A dropdown replaces the single "Load Demo Factory" button. Five realistic presets covering different StarGlobal 3D project types: Smart Factory, Retail Showroom, Apartment, Museum Exhibition, Office.

---

## 5. Output Validation Approach

1. **JSON parse safety:** OpenAI `response_format: json_object` guarantees valid JSON at the API level; mock AI returns native JS objects
2. **Schema validation:** Frontend TypeScript interfaces act as a type-level contract; all new fields are optional (`?`) so the frontend won't crash if OpenAI omits them
3. **Mock AI parity:** The mock AI produces identical structure to the OpenAI output — same fields, same nesting, same types
4. **Error boundary:** API errors and JSON parse failures are caught in the route handler and returned as `{ success: false, message }` — the server never crashes
5. **Frontend error state:** Any non-200 or `success: false` response renders the error card with the server's message

---

## 6. Challenges Encountered

**1. Tailwind JIT and dynamic class strings**  
Tailwind's JIT compiler only includes classes that appear as literal strings. The badge color system and quality score color system required static `colorMap`/`levelConfig` objects with all classes pre-written — generating class names dynamically (e.g., `bg-${color}-500`) causes colors to be missing in production builds.

**2. Two-pass slug deduplication correctness**  
A single-pass approach would assign a suffix to the second occurrence but not the first, leaving the first occurrence with an unchanged (non-unique) slug. The two-pass approach counts all occurrences first, then renames all of them — ensuring every slug in the output is unique.

**3. CORS for multi-origin deployment**  
Supporting both local development (localhost:5173) and production (Vercel URL) in CORS required a dynamic origin allowlist rather than a hardcoded string. The `CLIENT_URL` environment variable is split and combined with localhost defaults.

**4. OpenAI API reliability**  
The OpenAI API key provided for development was invalid (401). The fallback architecture means this never breaks the user experience — the mock AI activates silently, and the output schema is identical either way. On Render with a valid key, real AI mode works transparently.

---

## 7. UI/UX Issues Found

### Issue 1: Assets Table is not sortable by the user
**Severity:** Medium  
**Description:** The classified assets table is sorted by priority (High → Medium → Low) automatically, but users cannot re-sort by clicking column headers. In real asset management workflows, sorting by category or name is frequently needed.  
**Proposed Fix:** Add `onClick` handlers to column headers that toggle sort direction. Store `sortKey` and `sortDir` in component state. Use `useMemo` to derive sorted assets without mutating props.

---

### Issue 2: No pagination or virtualization for large asset lists
**Severity:** Medium  
**Description:** If a user pastes 100+ assets, the table renders all rows at once, which can cause scroll lag on lower-end devices. The textarea also has no character limit or line limit warning.  
**Proposed Fix:** Add a soft warning at 50+ assets ("Large list — AI analysis may take longer"). For the table, implement simple pagination (25 rows/page) or use a virtual list library (e.g., `@tanstack/virtual`) for lists over 50 items.

---

### Issue 3: No user feedback when Export CSV is triggered

**Severity:** Low  
**Description:** The Export CSV button triggers a file download immediately with no visual confirmation. On some browsers the download is silent and users may click the button multiple times.  
**Proposed Fix:** Briefly disable the button and show a "Downloading..." label for ~1.5 seconds after click to give clear feedback.

---

## 8. Future Development Directions

Given more time, the following enhancements would make this a production-ready tool:

1. **Persistent project storage** — Save and load previous analysis results via a lightweight database (SQLite or Supabase free tier) so teams can revisit and compare analyses
2. **Batch import from CSV/Excel** — Allow uploading an asset spreadsheet directly instead of manual text entry, which is the real-world workflow for large digitization projects
3. **Export to CMS-ready formats** — Generate output compatible with common 3D asset management systems (Matterport, VRTK, or custom formats used at StarGlobal 3D)
4. **Team collaboration** — Share analysis results via a public link (similar to Figma "share link"), useful for distributed 3D/360 production teams
5. **Multi-language asset name support** — The current slugifier strips Vietnamese diacritics but a more robust Unicode normalization library would handle edge cases across Asian and European characters better
6. **Sortable/filterable assets table** — Column sort + category filter for power users managing large asset sets

---

*This report is submitted as part of the StarGlobal 3D Technology Internship application.*
