import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Zap, 
  Clock, 
  Search, 
  CheckCircle2, 
  Activity, 
  FileCode, 
  Layers 
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store';
import { selectPostIds, selectPostEntities, selectActionLogs, selectAllPosts } from '../store/selectors';
import { clearLogs } from '../store/uiSlice';

export const ReduxInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const postIds = useAppSelector(selectPostIds);
  const postEntities = useAppSelector(selectPostEntities);
  const actionLogs = useAppSelector(selectActionLogs);
  const allPosts = useAppSelector(selectAllPosts);

  const [selectedPostId, setSelectedPostId] = useState<string>(postIds[0] ? (postIds[0] as string) : '');
  const [benchmarkResult, setBenchmarkResult] = useState<{
    dictTimeMs: number;
    arrayTimeMs: number;
    speedupRatio: number;
  } | null>(null);

  // Run O(1) vs O(N) Benchmark
  const runBenchmark = () => {
    if (postIds.length === 0) return;
    const targetId = postIds[Math.floor(Math.random() * postIds.length)] as string;
    const ITERATIONS = 100000;

    // Test 1: O(1) Normalized Dictionary Lookup
    const startDict = performance.now();
    let foundDictItem: any = null;
    for (let i = 0; i < ITERATIONS; i++) {
      foundDictItem = postEntities[targetId];
    }
    const endDict = performance.now();
    const dictTimeMs = parseFloat((endDict - startDict).toFixed(3));

    // Test 2: O(N) Array Scan
    const startArray = performance.now();
    let foundArrayItem: any = null;
    for (let i = 0; i < ITERATIONS; i++) {
      foundArrayItem = allPosts.find((p) => p.id === targetId);
    }
    const endArray = performance.now();
    const arrayTimeMs = parseFloat((endArray - startArray).toFixed(3));

    const speedupRatio = arrayTimeMs > 0 ? parseFloat((arrayTimeMs / Math.max(0.001, dictTimeMs)).toFixed(1)) : 1;

    setBenchmarkResult({
      dictTimeMs,
      arrayTimeMs,
      speedupRatio,
    });
  };

  const activeEntity = selectedPostId ? postEntities[selectedPostId] : null;

  return (
    <div className="space-y-6">
      
      {/* Redux State Normalization Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-purple-950 text-purple-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-800 uppercase">
            createEntityAdapter
          </span>
          <span className="text-xs text-slate-400 font-mono">Normalized State Design (3NF)</span>
        </div>
        <h2 className="text-lg font-bold text-white">Redux Normalized Store Inspection</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          State normalization flattens nested arrays into lookup dictionaries formatted as{' '}
          <code className="text-amber-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            {'{ ids: [id1, id2], entities: { id1: {...}, id2: {...} } }'}
          </code>. This eliminates redundant data copies and enables instant <strong className="text-indigo-400">O(1)</strong> entity access.
        </p>
      </div>

      {/* Normalized State Tree & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* IDs Array (Left Panel) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-400" /> state.posts.ids
            </h3>
            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
              {postIds.length} Keys
            </span>
          </div>

          <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
            {postIds.map((id) => {
              const isSelected = selectedPostId === id;
              const post = postEntities[id as string];
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPostId(id as string)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <span className="truncate">{String(id)}</span>
                  <span className="text-[10px] opacity-75 uppercase">{post?.platform}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entities Dictionary Object Inspection (Middle Panel) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" /> state.posts.entities["{selectedPostId}"]
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              O(1) Direct Access
            </span>
          </div>

          {activeEntity ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[340px] space-y-1">
              <pre className="text-emerald-300 leading-relaxed">
                {JSON.stringify(activeEntity, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs font-mono">
              Select a post ID from the IDs array on the left to inspect its normalized entity object.
            </div>
          )}
        </div>

      </div>

      {/* State Lookup Benchmark Test Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Lookup Speed Benchmark: O(1) Dictionary vs O(N) Array Search
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Measures time taken for 100,000 entity access operations in normalized object vs unnormalized array find.
            </p>
          </div>

          <button
            onClick={runBenchmark}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Zap className="h-4 w-4" /> Run 100k Lookup Benchmark
          </button>
        </div>

        {benchmarkResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">O(1) Dictionary Lookup:</span>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {benchmarkResult.dictTimeMs} ms
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">O(N) Array Scan (.find):</span>
              <div className="text-lg font-bold text-rose-400 font-mono">
                {benchmarkResult.arrayTimeMs} ms
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">Normalized Efficiency Gain:</span>
              <div className="text-lg font-bold text-amber-300 font-mono flex items-center gap-1">
                {benchmarkResult.speedupRatio}x Faster!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dispatched Actions Audit Trail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-400" /> Redux Action Dispatch Audit Trail
          </h3>
          <button
            onClick={() => dispatch(clearLogs())}
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
          >
            Clear Audit Trail
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/80">
            {actionLogs.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No dispatched actions recorded yet.</div>
            ) : (
              actionLogs.map((log) => (
                <div key={log.id} className="p-3 hover:bg-slate-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 text-[10px] min-w-[70px]">{log.timestamp}</span>
                    <span className="text-indigo-300 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      {log.actionType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                    {log.durationMs !== undefined && (
                      <span className="text-emerald-400 font-mono">
                        {log.durationMs}ms
                      </span>
                    )}
                    <span className="truncate max-w-xs text-slate-400">
                      {JSON.stringify(log.payload)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
