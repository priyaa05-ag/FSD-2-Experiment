import React, { useState } from 'react';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play, 
  Layers, 
  Cpu, 
  Database 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchPostsThunk, createPostThunk, deletePostThunk } from '../store/postsSlice';
import { selectPostsLoading, selectPostsError, selectPostsLastFetched, selectPostsFetchCount } from '../store/selectors';

export const AsyncSimulator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);
  const lastFetched = useAppSelector(selectPostsLastFetched);
  const fetchCount = useAppSelector(selectPostsFetchCount);

  const [simulateDelayMs, setSimulateDelayMs] = useState<number>(1000);
  const [shouldFail, setShouldFail] = useState<boolean>(false);
  const [lastLifecycleAction, setLastLifecycleAction] = useState<string>('Idle');

  const handleFetchThunk = async () => {
    setLastLifecycleAction('posts/fetchPosts/pending');
    const resultAction = await dispatch(
      fetchPostsThunk({
        simulateDelayMs,
        shouldFail,
      })
    );

    if (fetchPostsThunk.fulfilled.match(resultAction)) {
      setLastLifecycleAction('posts/fetchPosts/fulfilled');
    } else if (fetchPostsThunk.rejected.match(resultAction)) {
      setLastLifecycleAction('posts/fetchPosts/rejected');
    }
  };

  const handleSimulateNewPostThunk = async () => {
    setLastLifecycleAction('posts/createPost/pending');
    const res = await dispatch(
      createPostThunk({
        title: 'Async Thunk Generated Post',
        content: 'This entity was created asynchronously via createAsyncThunk side-effect reducer!',
        platform: 'twitter',
        status: 'published',
        scheduledDate: '2026-07-30',
        scheduledTime: '15:00',
        tags: ['AsyncThunk', 'ReduxToolkit'],
      })
    );

    if (createPostThunk.fulfilled.match(res)) {
      setLastLifecycleAction('posts/createPost/fulfilled');
    } else {
      setLastLifecycleAction('posts/createPost/rejected');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Async Thunk Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-amber-950 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-800 uppercase">
            createAsyncThunk
          </span>
          <span className="text-xs text-slate-400 font-mono">Asynchronous State Machine</span>
        </div>
        <h2 className="text-lg font-bold text-white">Async Thunk Network Lifecycle Simulator</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Redux thunks automatically dispatch three distinct action lifecycle states:{' '}
          <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">.pending</code>,{' '}
          <code className="text-emerald-400 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">.fulfilled</code>, and{' '}
          <code className="text-rose-400 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">.rejected</code>.
        </p>
      </div>

      {/* Simulator Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Controls Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Play className="h-4 w-4 text-amber-400" /> Dispatch Thunk Controls
          </h3>

          <div className="space-y-4 text-xs">
            {/* Delay Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Network Latency Simulation:</span>
                <span className="text-indigo-400 font-bold">{simulateDelayMs} ms</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={simulateDelayMs}
                onChange={(e) => setSimulateDelayMs(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Error Injection Toggle */}
            <label className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={shouldFail}
                onChange={(e) => setShouldFail(e.target.checked)}
                className="h-4 w-4 text-rose-500 rounded border-slate-700 focus:ring-rose-500 bg-slate-900"
              />
              <div>
                <div className="font-semibold text-rose-300">Inject Network Error (500)</div>
                <div className="text-[11px] text-slate-400">Forces thunk to dispatch .rejected action</div>
              </div>
            </label>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleFetchThunk}
                disabled={isLoading}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Fetching Data...' : 'Dispatch fetchPostsThunk'}</span>
              </button>

              <button
                onClick={handleSimulateNewPostThunk}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Async Create Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live State Machine Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" /> Thunk State Machine
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Executions: <strong className="text-indigo-300">{fetchCount}</strong>
              </span>
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Last Lifecycle Action:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  lastLifecycleAction.includes('pending')
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : lastLifecycleAction.includes('fulfilled')
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : lastLifecycleAction.includes('rejected')
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {lastLifecycleAction}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">state.posts.loading:</span>
                <span className={`font-bold ${isLoading ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`}>
                  {isLoading ? 'true (SPINNER ACTIVE)' : 'false'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">state.posts.error:</span>
                <span className={`font-bold ${error ? 'text-rose-400' : 'text-slate-500'}`}>
                  {error ? error : 'null'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-500">Last Fetch Timestamp:</span>
                <span className="text-slate-400">{lastFetched ? new Date(lastFetched).toLocaleTimeString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Error Banner if state.error exists */}
          {error && (
            <div className="bg-rose-950/60 border border-rose-800 text-rose-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
