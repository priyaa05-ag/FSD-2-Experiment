import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Activity, Cpu, RotateCcw, Zap, Layers, CheckCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store';
import { selectTotalPosts, selectFilteredPosts } from '../store/selectors';
import { toggleProfiler } from '../store/uiSlice';

// Memoized Child Component
const MemoizedPostCard = React.memo<{
  id: string;
  title: string;
  platform: string;
  onSelect: (id: string) => void;
}>(({ id, title, platform, onSelect }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-xs font-bold text-slate-200">{title}</div>
        <div className="text-[10px] text-slate-400 capitalize font-mono">Platform: {platform}</div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-bold">
          Renders: {renderCount.current}
        </span>
        <button
          onClick={() => onSelect(id)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Select
        </button>
      </div>
    </div>
  );
});

MemoizedPostCard.displayName = 'MemoizedPostCard';

// Unmemoized Child Component for Comparison
const UnmemoizedPostCard: React.FC<{
  id: string;
  title: string;
  platform: string;
  onSelect: (id: string) => void;
}> = ({ id, title, platform, onSelect }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="bg-slate-950 border border-rose-900/60 rounded-xl p-3 space-y-2 flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-xs font-bold text-slate-200">{title}</div>
        <div className="text-[10px] text-slate-400 capitalize font-mono">Platform: {platform}</div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-bold">
          Renders: {renderCount.current}
        </span>
        <button
          onClick={() => onSelect(id)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export const PerformanceProfiler: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredPosts = useAppSelector(selectFilteredPosts);
  const totalPosts = useAppSelector(selectTotalPosts);
  const profilerEnabled = useAppSelector((state) => state.ui.profilerEnabled);

  const [parentCounter, setParentCounter] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  // Memoized Callback function
  const handleSelectPostMemoized = useCallback((id: string) => {
    setSelectedPostId(id);
  }, []);

  // Unmemoized Callback function (re-created on every parent render!)
  const handleSelectPostUnmemoized = (id: string) => {
    setSelectedPostId(id);
  };

  // Heavy computation memoized with useMemo
  const heavyAnalyticsCalculation = useMemo(() => {
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i < 50000; i++) {
      sum += Math.sqrt(i) * Math.sin(i);
    }
    const end = performance.now();
    return {
      sum: sum.toFixed(2),
      timeMs: (end - start).toFixed(3),
    };
  }, [totalPosts]);

  const samplePosts = filteredPosts.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-950 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-800 uppercase">
            React.memo & useCallback
          </span>
          <span className="text-xs text-slate-400 font-mono">Component Re-render Optimization</span>
        </div>
        <h2 className="text-lg font-bold text-white">Component Re-render Suppression Profiler</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Frequent Redux state updates can cause unnecessary component re-renders. Wrapping list components with{' '}
          <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">React.memo</code> and callback props with{' '}
          <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">useCallback</code> suppresses render cascades.
        </p>
      </div>

      {/* Parent Component State Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-400" /> Parent Component State Trigger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Parent Render Count: <strong className="text-indigo-300 font-mono">{parentRenderCount.current}</strong>
            </p>
          </div>

          <button
            onClick={() => setParentCounter((prev) => prev + 1)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Zap className="h-4 w-4" /> Trigger Parent State Change ({parentCounter})
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Memoized Cards Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> React.memo + useCallback
              </h4>
              <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Optimized
              </span>
            </div>

            <div className="space-y-2">
              {samplePosts.map((post) => (
                <MemoizedPostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  platform={post.platform}
                  onSelect={handleSelectPostMemoized}
                />
              ))}
            </div>
          </div>

          {/* Unmemoized Cards Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Unmemoized Components
              </h4>
              <span className="text-[10px] text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                Re-renders on Parent Change
              </span>
            </div>

            <div className="space-y-2">
              {samplePosts.map((post) => (
                <UnmemoizedPostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  platform={post.platform}
                  onSelect={handleSelectPostUnmemoized}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* useMemo Heavy Computation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-400" /> useMemo Heavy Math Calculation Cache
          </h3>
          <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800">
            {heavyAnalyticsCalculation.timeMs} ms
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Calculation Result: <span className="text-slate-200">{heavyAnalyticsCalculation.sum}</span> (Cached until totalPosts dependencies mutate).
        </p>
      </div>

    </div>
  );
};
