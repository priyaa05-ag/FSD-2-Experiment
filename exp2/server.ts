import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // In-memory posts store for local server testing
  let mockPosts = [
    {
      id: 'server-post-1',
      title: 'Redux Toolkit 2.0 Release',
      content: 'Exploring state normalization with createEntityAdapter in Redux Toolkit!',
      platform: 'twitter',
      status: 'published',
      scheduledDate: '2026-07-25',
      scheduledTime: '10:00',
      tags: ['Redux', 'React', 'StateManagement'],
      likesCount: 120,
      sharesCount: 30,
      commentsCount: 15,
      viewsCount: 2100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'server-post-2',
      title: 'Architecting Scalable Frontends',
      content: 'Centralized state management vs local component state for enterprise dashboards.',
      platform: 'linkedin',
      status: 'scheduled',
      scheduledDate: '2026-07-28',
      scheduledTime: '14:00',
      tags: ['SoftwareArchitecture', 'WebDev'],
      likesCount: 0,
      sharesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      unit: 'Unit 1',
      experiment: 'Experiment 2 - Redux-Based Content State Management',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/posts', (req, res) => {
    res.json(mockPosts);
  });

  // Serve static public folder (for zip downloads)
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/redux-content-state-lab.zip', (req, res) => {
    const zipPath = path.join(__dirname, 'public', 'redux-content-state-lab.zip');
    res.download(zipPath, 'redux-content-state-lab.zip');
  });

  app.post('/api/posts', (req, res) => {
    const newPost = {
      ...req.body,
      id: `post-${Date.now()}`,
      likesCount: 0,
      sharesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPosts.unshift(newPost);
    res.status(201).json(newPost);
  });

  app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    mockPosts = mockPosts.filter((p) => p.id !== id);
    res.json({ success: true, deletedId: id });
  });

  // AI Content Generator endpoint
  app.post('/api/generate-ai-content', async (req, res) => {
    try {
      const { topic, platform, tone } = req.body;

      if (!topic) {
        return res.status(400).json({ error: 'Topic parameter is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Write a compelling ${platform || 'social media'} post about "${topic}" in a ${tone || 'professional'} tone. Limit to max 200 words. Include 3 relevant hashtags.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const text = response.text || '';
        return res.json({ generatedContent: text });
      } else {
        // Fallback generator when Gemini key is not configured
        const fallbackText = `🔥 Hot Take on ${topic}: As modern web applications evolve in complexity, managing state across multiple components becomes a primary architectural challenge. Using Redux Toolkit's createSlice and createEntityAdapter ensures normalized, performant state transitions! #WebDev #${platform || 'Tech'} #ReduxToolkit`;
        return res.json({ generatedContent: fallbackText, fallbackMode: true });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate AI content.' });
    }
  });

  // Vite development middleware or Production static files
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Redux Lab Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
