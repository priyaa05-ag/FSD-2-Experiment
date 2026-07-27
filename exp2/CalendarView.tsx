import React from 'react';
import { Calendar as CalendarIcon, Clock, Twitter, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import { useAppSelector } from '../store';
import { selectCalendarPosts } from '../store/selectors';
import { PlatformType } from '../types';

export const CalendarView: React.FC = () => {
  const calendarPosts = useAppSelector(selectCalendarPosts);
  const sortedDates = Object.keys(calendarPosts).sort();

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'twitter':
        return <span className="bg-[#1DA1F2]/20 text-[#1DA1F2] px-2 py-0.5 rounded text-[10px] font-bold">X</span>;
      case 'linkedin':
        return <span className="bg-[#0A66C2]/20 text-[#0A66C2] px-2 py-0.5 rounded text-[10px] font-bold">LinkedIn</span>;
      case 'instagram':
        return <span className="bg-[#E4405F]/20 text-[#E4405F] px-2 py-0.5 rounded text-[10px] font-bold">Instagram</span>;
      case 'facebook':
        return <span className="bg-[#1877F2]/20 text-[#1877F2] px-2 py-0.5 rounded text-[10px] font-bold">Facebook</span>;
      case 'youtube':
        return <span className="bg-[#FF0000]/20 text-[#FF0000] px-2 py-0.5 rounded text-[10px] font-bold">YouTube</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-950 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-800/60 uppercase">
              createSelector Memoization
            </span>
            <span className="text-xs text-slate-400">selectCalendarPosts Selector</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Content Release Calendar</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Posts grouped and sorted by release schedule via memoized Redux selector.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs text-slate-300 flex items-center gap-3">
          <CalendarIcon className="h-4 w-4 text-indigo-400" />
          <span>Scheduled Dates: <strong className="text-indigo-300">{sortedDates.length}</strong></span>
        </div>
      </div>

      {/* Date Timeline List */}
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No scheduled posts found in Redux store.
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const posts = calendarPosts[dateStr];
            return (
              <div
                key={dateStr}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                {/* Date Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                    <h3 className="text-sm font-bold text-white font-mono">{dateStr}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                {/* Posts Grid for Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          {getPlatformBadge(post.platform)}
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-indigo-400" /> {post.scheduledTime}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{post.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>ID: {post.id}</span>
                        <span className="capitalize text-indigo-400">{post.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
