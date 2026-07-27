import React, { useState } from 'react';
import { 
  FolderCode, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  FileCode, 
  Play, 
  ExternalLink, 
  Download, 
  Laptop, 
  CheckCircle2 
} from 'lucide-react';
import { CodeFile } from '../types';

export const VSCodeSetupGuide: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  const filesList: CodeFile[] = [
    {
      filename: 'server.ts',
      path: '/server.ts',
      language: 'typescript',
      description: 'Express server with Vite middleware integration & API routes for local testing',
      content: `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Routes for Local Development & Testing
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      unit: 'Unit 1',
      experiment: 'Experiment 2 - Redux-Based Content State Management',
      timestamp: new Date().toISOString(),
    });
  });

  // AI Content Generator endpoint
  app.post('/api/generate-ai-content', async (req, res) => {
    try {
      const { topic, platform, tone } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: \`Write a \${platform || 'social media'} caption for "\${topic}" in a \${tone || 'professional'} tone.\`,
        });
        return res.json({ generatedContent: response.text });
      }

      // Fallback response for local offline testing
      return res.json({
        generatedContent: \`🚀 Local Test Post on \${topic}: Normalized state management with Redux Toolkit createEntityAdapter ensures optimal O(1) performance in modern Web applications! #Redux #VSCode #React\`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error generating content' });
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
    console.log(\`\n======================================================\`);
    console.log(\`🚀 [Redux Lab Experiment 2] Server Running!\`);
    console.log(\`👉 Open Local Website: http://localhost:\${PORT}\`);
    console.log(\`======================================================\n\`);
  });
}

startServer();`,
    },
    {
      filename: 'index.html',
      path: '/index.html',
      language: 'html',
      description: 'Main HTML entry point served by Vite and Express',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redux Content State Manager - Unit 1 Experiment 2</title>
  </head>
  <body class="bg-slate-950 text-slate-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    {
      filename: 'package.json',
      path: '/package.json',
      language: 'json',
      description: 'Dependencies configuration with tsx server starter scripts',
      content: `{
  "name": "redux-lab-experiment-2",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.6.0",
    "react-redux": "^9.2.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/react-redux": "^7.1.34",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  }
}`,
    },
    {
      filename: 'README.md',
      path: '/README.md',
      language: 'markdown',
      description: 'Step-by-step local execution instructions for VS Code',
      content: `# Unit 1 Experiment 2: Redux-Based Content State Management

This repository contains the complete implementation for **Experiment 2: Redux-Based Content State Management** using Redux Toolkit, React, TypeScript, and Express.

## 🚀 How to Run Locally in VS Code

### Step 1: Open Terminal in VS Code
Open VS Code, navigate to this project folder, and open an integrated terminal (\`Ctrl + \` \` or \`Cmd + \` \`).

### Step 2: Install Dependencies
Run the following command to install Redux Toolkit, Express, Vite, and React:
\`\`\`bash
npm install
\`\`\`

### Step 3: Start Local Server & Application
Launch the dev server running on port 3000:
\`\`\`bash
npm run dev
\`\`\`

### Step 4: Open in Web Browser
Open your browser and navigate to:
👉 **http://localhost:3000**

---

## 🛠 Features Implemented

1. **Centralized Redux Store**: \`configureStore\` with custom action logging middleware.
2. **State Normalization**: \`createEntityAdapter<Post>()\` storing entities in \`{ ids: [], entities: {} }\` layout.
3. **Async Side-Effects**: \`createAsyncThunk\` for asynchronous fetching with pending, fulfilled, and rejected lifecycles.
4. **Reselect Memoization**: \`createSelector\` for zero-recomputation derived calendar and analytics queries.
5. **Performance Profiling**: \`React.memo\`, \`useCallback\`, and \`useMemo\` re-render suppression.
6. **Local Express Server**: Custom \`server.ts\` proxy serving Vite middleware and mock REST API.`,
    },
    {
      filename: 'src/store/index.ts',
      path: '/src/store/index.ts',
      language: 'typescript',
      description: 'Redux store configuration with configureStore and custom middleware',
      content: `import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import postsReducer from './postsSlice';
import platformsReducer from './platformsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`,
    },
    {
      filename: 'src/store/postsSlice.ts',
      path: '/src/store/postsSlice.ts',
      language: 'typescript',
      description: 'Normalized Entity Adapter slice & async thunk definitions',
      content: `import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { Post } from '../types';

export const postsAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export const fetchPostsThunk = createAsyncThunk<Post[]>('posts/fetchPosts', async () => {
  const response = await fetch('/api/posts');
  return await response.json();
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({ loading: false, error: null }),
  reducers: {
    addPost: postsAdapter.addOne,
    updatePost: postsAdapter.updateOne,
    removePost: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
      });
  },
});

export const { addPost, updatePost, removePost } = postsSlice.actions;
export default postsSlice.reducer;`,
    },
  ];

  const currentFile = filesList[selectedFileIndex];

  const handleCopyCode = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* VS Code Setup Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-950 text-purple-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-800 uppercase">
                VS Code Local Setup
              </span>
              <span className="text-xs text-slate-400 font-mono">Express + Vite + Redux Toolkit</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Local Development & Code Inspector</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Copy any file or download the pre-packaged ZIP archive below to execute this Redux Toolkit experiment directly on your local computer using Visual Studio Code.
            </p>
            <div className="mt-3">
              <a
                href="/redux-content-state-lab.zip"
                download="redux-content-state-lab.zip"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/30 transition-all border border-emerald-500 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Project ZIP Archive (.zip)</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shrink-0">
            <Server className="h-6 w-6 text-purple-400" />
            <div className="text-xs font-mono">
              <div className="text-slate-400">Local Dev Server:</div>
              <div className="font-bold text-purple-300">http://localhost:3000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Terminal Command Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" /> Terminal Quick Commands for VS Code
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Step 1 • Install Dependencies</div>
            <div className="text-emerald-400 font-bold bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 select-all">
              npm install
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Step 2 • Launch Express Dev Server</div>
            <div className="text-indigo-300 font-bold bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 select-all">
              npm run dev
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Step 3 • Open Website</div>
            <div className="text-purple-300 font-bold bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
              http://localhost:3000
            </div>
          </div>

        </div>
      </div>

      {/* Code Inspector & File Exporter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* File Tabs List (Left Column) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono px-2 mb-2">
            Project Files
          </h4>

          <div className="space-y-1">
            {filesList.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode className="h-4 w-4 shrink-0" />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  {copiedFile === file.filename && (
                    <Check className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* File Viewer Window (Right 3 Columns) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 lg:col-span-3 flex flex-col justify-between">
          <div className="space-y-3">
            
            {/* Header with filename & Copy Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-purple-400" /> {currentFile.path}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentFile.description}</p>
              </div>

              <button
                onClick={() => handleCopyCode(currentFile.filename, currentFile.content)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedFile === currentFile.filename ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy File Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Display Area */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[420px]">
              <pre className="text-purple-200/90 leading-relaxed whitespace-pre font-mono">
                {currentFile.content}
              </pre>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Language: {currentFile.language}</span>
            <span>Path: {currentFile.path}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
