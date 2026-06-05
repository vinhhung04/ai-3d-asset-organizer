require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeAssetsRoute = require('./routes/analyzeAssets');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.USE_MOCK_AI === 'true' ? 'mock-ai' : 'claude-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/analyze-assets', analyzeAssetsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  const mode = process.env.USE_MOCK_AI === 'true' || !process.env.ANTHROPIC_API_KEY
    ? 'Mock AI'
    : 'Claude API';
  console.log(`Server running on port ${PORT} [mode: ${mode}]`);
});
