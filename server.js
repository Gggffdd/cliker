import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: false
}));

// Security headers middleware
app.use((req, res, next) => {
  // Эти заголовки теперь устанавливаются в vercel.json
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Serve SPA - это обрабатывается rewrites в vercel.json
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Запуск только в dev режиме
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FG Bot Clicker server running on port ${PORT}`);
    console.log(`📱 Ready for Telegram Mini App integration`);
    console.log(`🌐 Health check available at /health`);
  });
}

export default app;
