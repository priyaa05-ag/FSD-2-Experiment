import React from 'react';
import { BarChart3, Eye, ThumbsUp, Share2, MessageSquare, TrendingUp, Layers } from 'lucide-react';
import { useAppSelector } from '../store';
import { selectPlatformAnalytics } from '../store/selectors';
import { PlatformType } from '../types';

export const AnalyticsView: React.FC = () => {
  const analytics = useAppSelector(selectPlatformAnalytics);

  const getPlatformColor = (platformId: string) => {
    switch (platformId) {
      case 'twitter': return '#1DA1F2';
      case 'linkedin': return '#0A66C2';
      case 'instagram': return '#E4405F';
      case 'facebook': return '#1877F2';
      case 'youtube': return '#FF0000';
      default: return '#6366F1';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-950 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-800 uppercase">
            Derived State Selector
          </span>
          <span className="text-xs text-slate-400 font-mono">selectPlatformAnalytics</span>
        </div>
        <h2 className="text-lg font-bold text-white">Cross-Platform Analytics Dashboard</h2>
        <p className="text-xs text-slate-400">
          Computed on the fly from normalized Redux post data without data duplication.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Views</span>
            <Eye className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {analytics.summary.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">Across published content</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Likes</span>
            <ThumbsUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {analytics.summary.totalLikes.toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-400 font-mono">Engagement interactions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Shares</span>
            <Share2 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {analytics.summary.totalShares.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-400 font-mono">Virality metric</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Engagement Rate</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {analytics.summary.averageEngagement}%
          </div>
          <div className="text-[11px] text-amber-400 font-mono">Calculated formula score</div>
        </div>

      </div>

      {/* Breakdown per Platform */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-400" /> Platform Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(analytics.byPlatform).map((p) => {
            const brandColor = getPlatformColor(p.platformId);
            return (
              <div
                key={p.platformId}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-md text-white capitalize"
                    style={{ backgroundColor: `${brandColor}33`, color: brandColor, border: `1px solid ${brandColor}66` }}
                  >
                    {p.platformName}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {p.totalPosts} {p.totalPosts === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Published / Sched / Draft:</span>
                    <span>{p.publishedCount} / {p.scheduledCount} / {p.draftCount}</span>
                  </div>

                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Views:</span>
                    <span className="text-emerald-400 font-bold">{p.totalViews.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Likes & Shares:</span>
                    <span className="text-indigo-300">{p.totalLikes} likes, {p.totalShares} shares</span>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Engagement Score</span>
                    <span className="text-indigo-400 font-bold">{p.engagementScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, p.engagementScore * 10)}%`,
                        backgroundColor: brandColor,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
