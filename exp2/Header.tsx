import React from 'react';
import { 
  Database, 
  RotateCcw, 
  Terminal, 
  Code2, 
  Layers, 
  Cpu, 
  BookOpen 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { selectTotalPosts, selectPostsLoading } from '../store/selectors';
import { resetToInitialPosts } from '../store/postsSlice';
import { setCurrentTab } from '../store/uiSlice';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const totalPosts = useAppSelector(selectTotalPosts);
  const isLoading = useAppSelector(selectPostsLoading);
  const currentTab = useAppSelector((state) => state.ui.currentTab);

  const handleReset = () => {
    if (confirm('Reset Redux Store to initial normalized dataset?')) {
      dispatch(resetToInitialPosts());
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Title & Experiment Badge */}
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold">
            <Layers className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-950 text-indigo-300 text-[11px] font-mono px-2 py-0.5 rounded border border-indigo-800/60 font-semibold tracking-wide uppercase">
                Unit 1 • Experiment 2
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Cpu className="h-3 w-3 text-emerald-400" /> Redux Toolkit 2.0
              </span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Redux-Based Content State Management
            </h1>
          </div>
        </div>

        {/* Global Metrics & Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs">
          
          {/* Total Posts Badge */}
          <div className="bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-300">Normalized Posts:</span>
            <span className="font-mono font-bold text-white bg-indigo-900/60 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-700/50">
              {totalPosts} entities
            </span>
          </div>

          {/* Sync status */}
          <div className="bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="text-slate-300">{isLoading ? 'Async Thunk Processing...' : 'State In-Sync'}</span>
          </div>

          {/* Reset Store Action */}
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset Redux state to default data"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset State</span>
          </button>

          {/* VS Code Setup Button */}
          <button
            onClick={() => dispatch(setCurrentTab('vscode'))}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'vscode'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-purple-300" />
            <span>Local VS Code Setup</span>
          </button>
        </div>

      </div>
    </header>
  );
};
