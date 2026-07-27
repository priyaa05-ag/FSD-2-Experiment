import React from 'react';
import { 
  FileText, 
  Calendar, 
  BarChart2, 
  Search, 
  RefreshCw, 
  Zap, 
  Activity, 
  CheckSquare, 
  FolderCode 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { selectCurrentTab } from '../store/selectors';
import { setCurrentTab } from '../store/uiSlice';
import { TabType } from '../types';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(selectCurrentTab);

  const navItems: NavItem[] = [
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'calendar', label: 'Calendar View', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'inspector', label: 'Redux & Normalized State', icon: Search, badge: 'O(1)' },
    { id: 'async', label: 'Async Thunks', icon: RefreshCw },
    { id: 'selectors', label: 'Reselect Benchmarks', icon: Zap },
    { id: 'profiler', label: 'Performance Profiler', icon: Activity },
    { id: 'assignments', label: 'Lab Assignments', icon: CheckSquare, badge: '100% Lab', highlight: true },
    { id: 'vscode', label: 'VS Code Setup & Files', icon: FolderCode, badge: 'Download', highlight: true },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-[69px] z-30 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => dispatch(setCurrentTab(item.id))}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? item.highlight 
                    ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                    : 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
