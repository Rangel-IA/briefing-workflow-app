import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiApp from './api/index.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Use the API router from api/index.ts (which Vercel also uses directly)
  app.use(apiApp);

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'client'); // if using standard vite outDir
    const rootDist = path.join(process.cwd(), 'dist'); // sometimes it outputs directly to dist
    
    app.use(express.static(rootDist));
    
    // express v5 routing syntax for fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(rootDist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
