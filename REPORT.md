# REPORT — AI 3D/360 Asset Organizer

**Candidate:** vinhhung04  
**Position:** Technology Intern — StarGlobal 3D  
**Test Option:** Option B — AI 3D/360 Asset Organizer  
**Submission Date:** 2025

---

## 1. Features Implemented

| Feature | Status | Notes |
|---|---|---|
| Asset input (raw text / JSON) | ✅ Done | Textarea with mode toggle |
| Project type selection | ✅ Done | 8 project types |
| Asset auto-classification | ✅ Done | 12 categories |
| Slug generation | ✅ Done | Structured format per spec |
| Project metadata output | ✅ Done | Summary, category list, naming convention |
| Organization suggestions | ✅ Done | 3 AI-generated suggestions |
| Data quality warnings | ✅ Done | Duplicate slugs, short names |
| Raw JSON export + copy | ✅ Done | Clipboard API with fallback |
| Demo data (Factory project) | ✅ Done | One-click fill |
| Loading state | ✅ Done | Animated spinner + progress |
| Error state | ✅ Done | Friendly error card with message |
| Empty state | ✅ Done | Onboarding-style empty panel |
| Input validation | ✅ Done | Required fields + JSON parse validation |
| Mock AI fallback | ✅ Done | Keyword-based, no API key needed |
| Claude API integration | ✅ Done | claude-haiku-4-5-20251001 |
| Responsive layout | ✅ Done | Two-column desktop, single-column mobile |
| Production deployment support | ✅ Done | Render + Vercel ready |

---

## 2. AI/LLM Usage in This Project

The project integrates with the **Anthropic Claude API** (model: `claude-haiku-4-5-20251001`) via the `@anthropic-ai/sdk` package.

**When Claude is used:** When `USE_MOCK_AI=false` and `ANTHROPIC_API_KEY` is set, every analyze request sends a structured prompt to Claude and receives a JSON response containing the full classification result.

**When Mock AI is used:** When `USE_MOCK_AI=true` (default) or when the API key is absent, a keyword-based classification engine in `server/src/services/mockAiService.js` performs the classification. This ensures the project works immediately for any reviewer without needing an API key.

**Fallback design decision:** The mock AI was built to match the exact same output schema as Claude, so the frontend is unaware of which mode is active. This makes the fallback seamless and testable.

---

## 3. Sample Prompt Used (Claude Mode)

The prompt sent to Claude is structured as follows (simplified):

```
You are an AI assistant specialized in 3D/360 digital twin project management.
Analyze the following project assets and return ONLY a valid JSON object.
Do NOT wrap in markdown. Do NOT add explanation. Return raw JSON only.

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
  "classified_assets": [...],
  "organization_suggestions": [...],
  "data_quality_warnings": [...]
}

Categories to use: Public Area, Private Area, Production Area, Technical Area,
Safety Area, Navigation Point, Interactive Hotspot, IoT / Sensor Point,
360 Panorama, 3D Object, Facility / Equipment, Training / Annotation

Slug format: {project-type-prefix}-{category-token}-{asset-type}-{asset-name}
Priority: High (Safety/IoT), Medium (Production/Technical), Low (others)
```

**Why this prompt design:**
- Explicit "Return raw JSON only" prevents Claude from wrapping in markdown
- Numbered asset list reduces ambiguity
- Exact JSON schema in the prompt reduces hallucination of fields
- Category list constrains output to valid values

---

## 4. Output Validation Approach

1. **JSON parse safety:** The Claude response is stripped of any accidental markdown fences (` ```json `) before parsing
2. **Schema validation:** The frontend TypeScript interfaces act as a type-level contract; any missing field causes a runtime access issue that surfaces clearly
3. **Mock AI parity:** The mock AI is tested against the same 15 demo assets to confirm all output fields are populated correctly
4. **Error boundary:** API errors and JSON parse failures are caught in the route handler and returned as `{ success: false, message }` — never crashing the server
5. **Frontend error state:** Any non-200 or `success: false` response renders the error card with the server's message

---

## 5. Challenges Encountered

**1. Tailwind JIT and dynamic class strings**  
Tailwind's JIT compiler only includes classes that appear as literal strings. The badge color system required a static `colorMap` object with all classes pre-written — generating class names dynamically (e.g., `bg-${color}-500`) would have caused colors to be missing in the production build.

**2. JSON reliability from Claude**  
Despite the "Return raw JSON only" instruction, LLMs occasionally wrap responses in markdown code fences. A pre-parse cleanup step (`replace(/^```(?:json)?/i, '')`) handles this edge case gracefully.

**3. CORS for multi-origin deployment**  
Supporting both local development (localhost:5173) and production (Vercel URL) in CORS required a dynamic origin allowlist rather than a hardcoded string. The `CLIENT_URL` environment variable is split and combined with the localhost defaults.

---

## 6. UI/UX Issues Found

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

### Issue 3: Error message from backend is shown raw without context
**Severity:** Low  
**Description:** When the Claude API returns an error (e.g., rate limit, invalid key), the raw error message (e.g., "Error 429: Too many requests") is shown directly in the UI without user-friendly explanation or actionable guidance.  
**Proposed Fix:** Map known error patterns to friendly messages: rate limit → "AI service is busy, please try again in a moment"; invalid key → "API key is invalid — the app will switch to demo mode"; network error → "Cannot reach the server — check your connection."

---

## 7. Future Development Directions

Given more time, the following enhancements would make this a production-ready tool:

1. **Persistent project storage** — Save and load previous analysis results via a lightweight database (SQLite or Supabase free tier) so teams can revisit and compare analyses
2. **Batch import from CSV/Excel** — Allow uploading an asset spreadsheet directly instead of manual text entry, which is the real-world workflow for large digitization projects
3. **Asset slug collision resolver** — Automatically append numeric suffixes (`-01`, `-02`) to duplicate slugs rather than only warning about them
4. **Export to CMS-ready formats** — Generate output compatible with common 3D asset management systems (Matterport, VRTK, or custom formats used at StarGlobal 3D)
5. **Multi-language asset name support** — The current slugifier strips Vietnamese diacritics correctly but a more robust Unicode normalization library (like `unidecode`) would handle edge cases across Asian and European characters better
6. **Team collaboration** — Share analysis results via a public link (similar to Excalidraw or Figma "share link"), useful for distributed 3D/360 production teams

---

*This report is submitted as part of the StarGlobal 3D Technology Internship application.*
