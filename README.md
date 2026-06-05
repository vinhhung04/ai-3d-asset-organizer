# AI 3D/360 Asset Organizer

> AI-powered tool for classifying, normalizing, and organizing assets in 3D/360 digitization projects.

Built as an internship test submission for **StarGlobal 3D** — demonstrating product thinking, 3D/360 domain awareness, and AI integration for real-world digital twin workflows.

---

## Features

- **AI Asset Classification** — automatically categorizes assets into 12 domain-specific types (360 Panorama, Safety Area, IoT/Sensor Point, etc.)
- **Slug Generation** — produces clean, consistent, lowercase-hyphen slugs following a structured format
- **Auto Duplicate-Slug Fix** — duplicate slugs are automatically resolved with `-01`/`-02` suffixes
- **Project Metadata** — builds a structured summary with category breakdown and naming convention
- **Asset Quality Score** — 0–100 score with level badge (Excellent / Good / Needs Improvement) and per-issue deductions
- **Confidence & Classification Reason** — each asset shows its AI confidence % and why it was classified
- **Organization Suggestions** — 3 AI-generated recommendations for better asset management
- **Data Quality Warnings** — flags duplicate slugs, ambiguous names, and naming inconsistencies
- **CSV Export** — download full classification table with confidence and classification reason columns
- **Raw JSON Export** — copy full structured output to clipboard
- **5 Demo Presets** — Smart Factory, Retail Showroom, Apartment, Museum, Office — for immediate testing
- **Mock AI Fallback** — works fully without any API key using intelligent keyword-based classification
- **Responsive Design** — dark SaaS dashboard UI, works on desktop and mobile
- **Production Deployable** — backend on Render, frontend on Vercel

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite + TypeScript        |
| Styling  | Tailwind CSS + lucide-react icons   |
| Backend  | Node.js + Express                   |
| AI       | OpenAI GPT-4o-mini                  |
| Fallback | Keyword-based mock AI               |
| Deploy   | Vercel (frontend) + Render (backend)|

---

## Run Locally

### 1. Clone & setup server

```bash
cd server
npm install
cp .env.example .env
# Edit .env if needed (default: USE_MOCK_AI=true, works without any key)
npm run dev
```

Server starts at `http://localhost:3001`

### 2. Setup client (new terminal)

```bash
cd client
npm install
npm run dev
```

Client starts at `http://localhost:5173`

### 3. Open the app

Navigate to [http://localhost:5173](http://localhost:5173), pick a demo preset from the **Load Demo...** dropdown, and click **Analyze Assets**.

---

## Environment Variables

### Server (`server/.env`)

| Variable           | Default                    | Description                              |
|--------------------|----------------------------|------------------------------------------|
| `PORT`             | `3001`                     | Server port                              |
| `USE_MOCK_AI`      | `true`                     | Use mock AI instead of OpenAI API        |
| `OPENAI_API_KEY`   | *(empty)*                  | Your OpenAI API key (optional)           |
| `CLIENT_URL`       | `http://localhost:5173`    | Frontend URL for CORS whitelist          |

### Client (`client/.env.local`)

| Variable              | Default   | Description                              |
|-----------------------|-----------|------------------------------------------|
| `VITE_API_BASE_URL`   | *(empty)* | Backend URL (empty = use Vite dev proxy) |

---

## Enable OpenAI (Real Mode)

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. In `server/.env`, set:
   ```
   USE_MOCK_AI=false
   OPENAI_API_KEY=sk-...
   ```
3. Restart the server — the app falls back to mock AI automatically on any API error

---

## Deploy to Production

### Backend → Render (free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   ```
   USE_MOCK_AI=true
   CLIENT_URL=https://your-app.vercel.app
   ```
7. Optional: add `OPENAI_API_KEY` for real AI (set `USE_MOCK_AI=false`)

### Frontend → Vercel (free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-render-service.onrender.com
   ```
5. Deploy

---

## API Documentation

### `POST /api/analyze-assets`

**Request body:**
```json
{
  "projectName": "Smart Factory 3D/360 Demo",
  "projectType": "Factory",
  "inputMode": "text",
  "rawInput": "Main entrance 360 panorama\nReception desk\nElectrical cabinet"
}
```

**Success response:**
```json
{
  "success": true,
  "data": {
    "project_metadata": { ... },
    "classified_assets": [
      {
        "original_name": "Main entrance 360 panorama",
        "category": "360 Panorama",
        "suggested_slug": "factory-panorama-panorama-main-entrance-360-panorama",
        "priority": "Low",
        "confidence": 0.94,
        "matched_keywords": ["panorama", "360"],
        "classification_reason": "Matched keywords: panorama, 360",
        ...
      }
    ],
    "organization_suggestions": [ ... ],
    "data_quality_warnings": [ ... ],
    "quality_score": {
      "score": 88,
      "level": "Good",
      "summary": "Good quality overall with minor improvements possible.",
      "deductions": [{ "reason": "2 asset(s) fell back to generic 3D Object", "points": 8 }]
    }
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Asset list is required."
}
```

### `GET /health`

Returns server status and current AI mode.

---

## Additional Enhancements Beyond Requirements

| Enhancement | Description |
|---|---|
| Asset Quality Score | 0–100 score with level badge and itemized deductions |
| Confidence score per asset | Each asset shows AI confidence % and matched keywords |
| Auto duplicate-slug fix | Duplicates get `-01`/`-02` suffix instead of just a warning |
| CSV export | Download full table with 8 columns including confidence and reason |
| 5 demo presets | Smart Factory, Retail Showroom, Apartment, Museum, Office |
| JSON input formats | Supports string array, object array `{name}`, `{assets:[]}` wrapper |

---

## Mapping to Option B Requirements

| Requirement | Implementation |
|---|---|
| Asset input field | Textarea (Raw Text or Simple JSON modes) |
| Project type selection | Dropdown: 8 types (Factory, Office, Retail Showroom, etc.) |
| AI classification | OpenAI GPT-4o-mini (or mock AI fallback) |
| Slug generation | `{type-prefix}-{category-token}-{asset-type}-{name}` format |
| Project metadata | Name, type, total, categories, summary, naming convention |
| Organization suggestions | 3 AI-generated CMS/workflow recommendations |
| Data quality warnings | Duplicate slugs, short names, auto-fix annotations |
| Professional UI | Dark SaaS dashboard, Tailwind CSS, responsive |

---

## Mock AI Behavior

When `USE_MOCK_AI=true` (default), the system uses keyword-based classification:

| Keywords | Category |
|---|---|
| panorama, 360, overview | 360 Panorama |
| safety, fire, emergency | Safety Area |
| sensor, iot, temperature | IoT / Sensor Point |
| hotspot | Interactive Hotspot |
| training, instruction | Training / Annotation |
| machine, production | Production Area |
| electrical, control, server | Technical Area |
| entrance, reception, visitor | Public Area |
| warehouse, storage | Private Area |
| inspection, quality | Production Area |

Priority rules: **High** = Safety/IoT · **Medium** = Production/Technical · **Low** = everything else

---

*Built by [vinhhung04](https://github.com/vinhhung04) · StarGlobal 3D Internship Test 2025*
