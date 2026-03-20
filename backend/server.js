require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api', routes);

// Error handler (ต้องอยู่หลังสุด)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.\nRun: npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
