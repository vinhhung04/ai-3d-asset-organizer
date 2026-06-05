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

| Layer    | Technology                           |
|----------|--------------------------------------|
| Frontend | React 18 + Vite + TypeScript         |
| Styling  | Tailwind CSS + lucide-react icons    |
| Backend  | Node.js + Express                    |
| AI       | OpenAI GPT-4o-mini (or compatible)   |
| Fallback | Keyword-based mock AI                |
| Deploy   | Vercel (frontend) + Render (backend) |

---

## Local Setup (Chi tiết)

### Yêu cầu

- **Node.js** >= 18.0.0 — kiểm tra bằng `node -v`
- **npm** >= 8 — kiểm tra bằng `npm -v`
- Git

### Bước 1 — Clone repo

```bash
git clone https://github.com/vinhhung04/ai-3d-asset-organizer.git
cd ai-3d-asset-organizer
```

---

### Bước 2 — Cài đặt Backend (server)

Mở terminal, di chuyển vào thư mục `server`:

```bash
cd server
```

Cài dependencies:

```bash
npm install
```

Tạo file `.env` từ template:

```bash
cp .env.example .env     # Mac/Linux
copy .env.example .env   # Windows
```

File `server/.env` mặc định:

```env
PORT=3001
USE_MOCK_AI=true
OPENAI_API_KEY=
AI_BASE_URL=
AI_MODEL=
CLIENT_URL=http://localhost:5173
```

> Với cài đặt mặc định (`USE_MOCK_AI=true`), server chạy được ngay **không cần API key**.

Khởi động server ở chế độ dev (auto-reload):

```bash
npm run dev
```

Kết quả thành công:

```text
[nodemon] starting `node src/index.js`
Server running on port 3001 [mode: Mock AI]
```

Kiểm tra server đang chạy: mở trình duyệt vào `http://localhost:3001/health`

```json
{ "status": "ok", "mode": "mock-ai", "timestamp": "..." }
```

---

### Bước 3 — Cài đặt Frontend (client)

Mở **terminal mới** (giữ nguyên terminal server), di chuyển vào thư mục `client`:

```bash
cd client
```

Cài dependencies:

```bash
npm install
```

Khởi động client:

```bash
npm run dev
```

Kết quả thành công:

```text
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

---

### Bước 4 — Mở ứng dụng

Truy cập [http://localhost:5173](http://localhost:5173)

Để test nhanh:

1. Click dropdown **"Load Demo..."** → chọn **Smart Factory**
1. Click **Analyze Assets**
1. Kết quả phân loại xuất hiện ở panel bên phải

---

## Chạy với AI thật (OpenAI)

Nếu muốn dùng AI thật thay vì Mock AI:

### Dùng OpenAI trực tiếp

1. Lấy API key tại [platform.openai.com](https://platform.openai.com)
2. Sửa `server/.env`:

```env
USE_MOCK_AI=false
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

1. Restart server: `Ctrl+C` rồi `npm run dev`

Kết quả:

```text
Server running on port 3001 [mode: OpenAI GPT-4o-mini]
```

### Dùng custom OpenAI-compatible endpoint

Nếu có endpoint tương thích OpenAI (ví dụ proxy):

```env
USE_MOCK_AI=false
OPENAI_API_KEY=sk-...           # key của endpoint đó
AI_BASE_URL=https://your-endpoint.com/v1
AI_MODEL=gpt-5.4-mini           # model endpoint đó hỗ trợ
```

> Nếu AI gặp lỗi (sai key, hết quota, v.v.), server tự động fallback về Mock AI.

---

## Environment Variables

### Server (`server/.env`)

| Biến               | Mặc định                | Mô tả                                                |
|--------------------|-------------------------|------------------------------------------------------|
| `PORT`             | `3001`                  | Port server lắng nghe                                |
| `USE_MOCK_AI`      | `true`                  | `true` = dùng mock AI, `false` = dùng OpenAI thật    |
| `OPENAI_API_KEY`   | *(trống)*               | API key OpenAI hoặc compatible endpoint              |
| `AI_BASE_URL`      | *(trống)*               | Custom endpoint URL (để trống = dùng OpenAI mặc định)|
| `AI_MODEL`         | `gpt-4o-mini`           | Tên model muốn dùng                                  |
| `CLIENT_URL`       | `http://localhost:5173` | URL frontend — dùng cho CORS whitelist               |

### Client (`client/.env.local`) — tùy chọn

Mặc định client tự gọi `http://localhost:3001` thông qua Vite proxy. Chỉ cần tạo file này khi backend chạy ở host khác:

```env
VITE_API_BASE_URL=http://localhost:3001
```

| Variable            | Default   | Description                                         |
|---------------------|-----------|-----------------------------------------------------|
| `VITE_API_BASE_URL` | *(empty)* | Backend URL (empty = use Vite dev proxy port 3001)  |

---

## Xử lý lỗi thường gặp

### `EADDRINUSE: address already in use :::3001`

Port 3001 đang bị process khác chiếm. Kill process đó:

**Windows:**

```powershell
# Tìm PID đang dùng port 3001
netstat -ano | findstr :3001

# Kill process (thay <PID> bằng số thực)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3001 | xargs kill -9
```

---

### Server khởi động nhưng client báo lỗi kết nối

Kiểm tra:

1. Server có đang chạy không? → `http://localhost:3001/health`
1. `CLIENT_URL` trong `server/.env` có đúng là `http://localhost:5173` không?
1. Cả 2 terminal server và client có đang mở không?

---

### `Cannot find module` khi chạy server

Chưa cài dependencies:

```bash
cd server && npm install
```

---

## Deploy lên Production

### Backend → Render

1. Push repo lên GitHub
2. Vào [render.com](https://render.com) → **New Web Service**
3. Kết nối repo → set **Root Directory**: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Thêm environment variables:

| Key             | Value                              |
|-----------------|------------------------------------|
| `USE_MOCK_AI`   | `false`                            |
| `OPENAI_API_KEY`| *(API key của bạn)*                |
| `AI_BASE_URL`   | *(URL custom endpoint, nếu có)*    |
| `AI_MODEL`      | `gpt-4o-mini` hoặc model khác      |
| `CLIENT_URL`    | `https://your-app.vercel.app`      |

1. Click **Save & Deploy**

### Frontend → Vercel

1. Vào [vercel.com](https://vercel.com) → **New Project**
1. Kết nối repo → set **Root Directory**: `client`
1. Framework preset: **Vite**
1. Thêm environment variable:

| Key                 | Value                                        |
|---------------------|----------------------------------------------|
| `VITE_API_BASE_URL` | `https://your-render-service.onrender.com`   |

1. Click **Deploy**

> **Lưu ý thứ tự:** Deploy Render trước → lấy URL → set vào Vercel → deploy Vercel → lấy URL → set `CLIENT_URL` vào Render → Render sẽ tự restart.
> **Render free tier** sẽ sleep sau 15 phút không có request. Lần đầu gọi có thể chờ 30–60 giây.

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

`inputMode` nhận `"text"` (mỗi dòng 1 asset) hoặc `"json"` (mảng JSON).

**Success response:**

```json
{
  "success": true,
  "data": {
    "project_metadata": {
      "project_name": "Smart Factory 3D/360 Demo",
      "project_type": "Factory",
      "total_assets": 3,
      "main_categories": ["360 Panorama", "Facility / Equipment", "Technical Area"],
      "summary": "...",
      "recommended_naming_convention": "..."
    },
    "classified_assets": [
      {
        "original_name": "Main entrance 360 panorama",
        "category": "360 Panorama",
        "asset_type": "panorama",
        "suggested_slug": "factory-panorama-panorama-main-entrance-360",
        "priority": "Low",
        "management_note": "...",
        "confidence": 0.94,
        "matched_keywords": ["panorama", "360"],
        "classification_reason": "Matched keywords: panorama, 360"
      }
    ],
    "organization_suggestions": ["...", "...", "..."],
    "data_quality_warnings": [],
    "quality_score": {
      "score": 88,
      "level": "Good",
      "summary": "Good quality overall with minor improvements possible.",
      "deductions": []
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

Trả về trạng thái server và chế độ AI đang dùng.

```json
{
  "status": "ok",
  "mode": "openai-gpt4o-mini",
  "timestamp": "2025-06-05T10:00:00.000Z"
}
```

---

## Cấu trúc thư mục

```text
ai-3d-asset-organizer/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── services/        # API calls
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── .env.example
│   └── package.json
│
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── routes/          # Express routes
│   │   ├── services/        # AI service + mock AI
│   │   ├── utils/           # Asset parser, slug utils
│   │   └── validators/      # Request validation
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Mock AI Behavior

Khi `USE_MOCK_AI=true`, hệ thống dùng keyword-based classification:

| Keywords | Category |
|---|---|
| panorama, 360, overview | 360 Panorama |
| fire extinguisher, emergency exit, safety | Safety Area |
| sensor, IoT, temperature, CCTV | IoT / Sensor Point |
| hotspot, info point, interactive | Interactive Hotspot |
| training, instruction, annotation | Training / Annotation |
| route, marker, waypoint | Navigation Point |
| chair, table, desk, machine, panel | Facility / Equipment |
| production line, assembly, workshop | Production Area |
| server room, electrical, control room | Technical Area |
| entrance, lobby, reception | Public Area |
| office, meeting room, conference | Private Area |

Priority: **High** = Safety/IoT · **Medium** = Production/Technical · **Low** = everything else

---

*Built by [vinhhung04](https://github.com/vinhhung04) · StarGlobal 3D Internship Test 2025*
