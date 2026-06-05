# AI 3D/360 Asset Organizer

> AI-powered tool for classifying, normalizing, and organizing assets in 3D/360 digitization projects.

Built as an internship test submission for **StarGlobal 3D** — demonstrating product thinking, 3D/360 domain awareness, and AI integration for real-world digital twin workflows.

---

## Features

- **AI Asset Classification** — automatically categorizes assets into 12 domain-specific types (360 Panorama, Safety Area, IoT/Sensor Point, etc.)
- **Slug Generation** — produces clean, consistent, lowercase-hyphen slugs following a structured format
- **Project Metadata** — builds a structured summary with category breakdown and naming convention
- **Organization Suggestions** — 3 AI-generated recommendations for better asset management
- **Data Quality Warnings** — flags duplicate slugs, ambiguous names, and naming inconsistencies
- **Raw JSON Export** — copy full structured output to clipboard
- **Demo Mode** — one-click Factory project demo for immediate testing
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
| AI       | Anthropic Claude API (Haiku)        |
| Fallback | Keyword-based mock AI               |
| Deploy   | Vercel (frontend) + Render (backend)|

---

## Run Locally

### 1. Clone & setup server

```bash
cd server
npm install
cp .env.example .env
# Edit .env if needed (default: USE_MOCK_AI=true)
npm run dev
```

Server starts at `http://localhost:3001`

### 2. Setup client (new terminal)

```bash
cd client
npm install
# Optionally: cp .env.example .env.local
npm run dev
```

Client starts at `http://localhost:5173`

### 3. Open the app

Navigate to [http://localhost:5173](http://localhost:5173), click **Load Demo Factory** and then **Analyze Assets**.

---

## Environment Variables

### Server (`server/.env`)

| Variable           | Default                    | Description                              |
|--------------------|----------------------------|------------------------------------------|
| `PORT`             | `3001`                     | Server port                              |
| `USE_MOCK_AI`      | `true`                     | Use mock AI instead of Claude API        |
| `ANTHROPIC_API_KEY`| *(empty)*                  | Your Anthropic API key (optional)        |
| `CLIENT_URL`       | `http://localhost:5173`    | Frontend URL for CORS whitelist          |

### Client (`client/.env.local`)

| Variable              | Default | Description                              |
|-----------------------|---------|------------------------------------------|
| `VITE_API_BASE_URL`   | *(empty)*| Backend URL (empty = use Vite dev proxy) |

---

## Enable Claude AI (Real Mode)

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. In `server/.env`, set:
   ```
   USE_MOCK_AI=false
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Restart the server

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
7. Optional: add `ANTHROPIC_API_KEY` for real AI

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
    "classified_assets": [ ... ],
    "organization_suggestions": [ ... ],
    "data_quality_warnings": [ ... ]
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

## Demo Input

**Project Name:** Smart Factory 3D/360 Demo  
**Project Type:** Factory

```
Main entrance 360 panorama
Reception desk
Production line overview
Machine control panel
Electrical cabinet
Server room
Safety instruction hotspot
Emergency exit door
Fire extinguisher
IoT temperature sensor
Employee training hotspot
Warehouse storage area
Quality inspection station
Control room
Visitor route marker
```

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
