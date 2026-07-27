import React, { useState } from 'react';
import { Zap, RefreshCw, Layers, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  selectFilteredPosts, 
  unmemoizedSelectFilteredPosts, 
  filteredPostsComputationCount,
  resetComputationTrackers 
} from '../store/selectors';
import { setSearchQuery, logAction } from '../store/uiSlice';
import { addPost } from '../store/postsSlice';

export const SelectorBenchmark: React.FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);

  const [unmemoizedCallsCount, setUnmemoizedCallsCount] = useState<number>(0);
  const [dummyStateCounter, setDummyStateCounter] = useState<number>(0);

  // Invoke both memoized and unmemoized selector in a loop to demonstrate performance
  const handleSimulateSelectorCalls = () => {
    // Call memoized selector multiple times
    selectFilteredPosts(state);
    selectFilteredPosts(state);
    selectFilteredPosts(state);

    // Call unmemoized selector multiple times
    unmemoizedSelectFilteredPosts(state);
    unmemoizedSelectFilteredPosts(state);
    unmemoizedSelectFilteredPosts(state);

    setUnmemoizedCallsCount((prev) => prev + 3);
  };

  const handleDispatchUnrelatedAction = () => {
    // Updating unrelated UI state (e.g. search query or dummy counter)
    setDummyStateCounter((prev) => prev + 1);
    dispatch(logAction({ actionType: 'ui/dummyAction', payload: { ping: true } }));
  };

  const handleDispatchStateMutation = () => {
    // Add new post to store to trigger true recomputation
    dispatch(
      addPost({
        id: `post-${Date.now()}`,
        title: 'Selector Benchmark Test Post',
        content: 'This post mutation forces memoized selectors to invalidate cache and recalculate.',
        platform: 'twitter',
        status: 'published',
        scheduledDate: '2026-07-31',
        scheduledTime: '12:00',
        tags: ['Benchmark', 'Reselect'],
        likesCount: 1,
        sharesCount: 0,
        commentsCount: 0,
        viewsCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Reselect Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-purple-950 text-purple-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-800 uppercase">
            createSelector (Reselect)
          </span>
          <span className="text-xs text-slate-400 font-mono">Memoization & Derived State</span>
        </div>
        <h2 className="text-lg font-bold text-white">Memoized Selector Optimization Workbench</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Without memoization, selector functions recompute on <strong>every single store dispatch</strong> or parent component re-render. Reselect's{' '}
          <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">createSelector</code> checks argument identity, returning cached results unless input state slices actually change.
        </p>
      </div>

      {/* Interactive Benchmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Control Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" /> Dispatch & Selection Triggers
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={handleSimulateSelectorCalls}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-between cursor-pointer"
            >
              <span>Invoke Selectors x3</span>
              <span className="bg-indigo-950 text-indigo-200 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-800">
                Test Cache
              </span>
            </button>

            <button
              onClick={handleDispatchUnrelatedAction}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl text-xs transition-all border border-slate-700 flex items-center justify-between cursor-pointer"
            >
              <span>Dispatch Unrelated State Action</span>
              <span className="text-slate-400 text-[10px] font-mono">Cache Hit Expected</span>
            </button>

            <button
              onClick={handleDispatchStateMutation}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-between cursor-pointer"
            >
              <span>Mutate Posts State (Add Post)</span>
              <span className="text-slate-950 text-[10px] font-mono font-bold">Cache Invalidation</span>
            </button>
          </div>
        </div>

        {/* Live Recomputation Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" /> Recomputation Tracker
              </h3>
              <button
                onClick={() => {
                  resetComputationTrackers();
                  setUnmemoizedCallsCount(0);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              
              {/* Memoized Result */}
              <div className="bg-slate-950 border border-emerald-800/60 rounded-xl p-3.5 space-y-1">
                <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> createSelector
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredPostsComputationCount}
                </div>
                <div className="text-[10px] text-slate-400">Actual Function Computations</div>
              </div>

              {/* Unmemoized Result */}
              <div className="bg-slate-950 border border-rose-800/60 rounded-xl p-3.5 space-y-1">
                <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Unmemoized Function
                </div>
                <div className="text-2xl font-bold text-white">
                  {unmemoizedCallsCount}
                </div>
                <div className="text-[10px] text-slate-400">Repeated Array Computations</div>
              </div>

            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 font-mono leading-relaxed">
            💡 Notice how <strong className="text-emerald-400">createSelector</strong> stays at 1 computation during unrelated actions because it reuses previous calculated references!
          </div>
        </div>

      </div>

    </div>
  );
};
