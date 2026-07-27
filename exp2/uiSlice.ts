import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TabType, PostStatus, ActionLogItem } from '../types';

export interface UIState {
  currentTab: TabType;
  searchQuery: string;
  statusFilter: PostStatus | 'all';
  actionLogs: ActionLogItem[];
  recomputationCounters: Record<string, { count: number; cacheHits: number }>;
  profilerEnabled: boolean;
  activeBenchmarkType: 'O1_VS_ON' | 'MEMOIZED_VS_UNMEMOIZED';
}

const initialState: UIState = {
  currentTab: 'content',
  searchQuery: '',
  statusFilter: 'all',
  actionLogs: [
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      actionType: '@@INIT',
      payload: { status: 'Redux store initialized with normalized entity schema' },
    },
  ],
  recomputationCounters: {
    selectFilteredPosts: { count: 0, cacheHits: 0 },
    selectPlatformAnalytics: { count: 0, cacheHits: 0 },
    selectCalendarPosts: { count: 0, cacheHits: 0 },
  },
  profilerEnabled: true,
  activeBenchmarkType: 'O1_VS_ON',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<TabType>) => {
      state.currentTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<PostStatus | 'all'>) => {
      state.statusFilter = action.payload;
    },
    logAction: (state, action: PayloadAction<{ actionType: string; payload?: any; durationMs?: number }>) => {
      state.actionLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        actionType: action.payload.actionType,
        payload: action.payload.payload ?? null,
        durationMs: action.payload.durationMs,
      });
      // Keep last 50 logs
      if (state.actionLogs.length > 50) {
        state.actionLogs.pop();
      }
    },
    clearLogs: (state) => {
      state.actionLogs = [];
    },
    incrementRecomputation: (state, action: PayloadAction<{ selectorName: string; wasCacheHit: boolean }>) => {
      const { selectorName, wasCacheHit } = action.payload;
      if (!state.recomputationCounters[selectorName]) {
        state.recomputationCounters[selectorName] = { count: 0, cacheHits: 0 };
      }
      if (wasCacheHit) {
        state.recomputationCounters[selectorName].cacheHits += 1;
      } else {
        state.recomputationCounters[selectorName].count += 1;
      }
    },
    resetRecomputationCounters: (state) => {
      state.recomputationCounters = {
        selectFilteredPosts: { count: 0, cacheHits: 0 },
        selectPlatformAnalytics: { count: 0, cacheHits: 0 },
        selectCalendarPosts: { count: 0, cacheHits: 0 },
      };
    },
    toggleProfiler: (state) => {
      state.profilerEnabled = !state.profilerEnabled;
    },
    setBenchmarkType: (state, action: PayloadAction<'O1_VS_ON' | 'MEMOIZED_VS_UNMEMOIZED'>) => {
      state.activeBenchmarkType = action.payload;
    },
  },
});

export const {
  setCurrentTab,
  setSearchQuery,
  setStatusFilter,
  logAction,
  clearLogs,
  incrementRecomputation,
  resetRecomputationCounters,
  toggleProfiler,
  setBenchmarkType,
} = uiSlice.actions;

export default uiSlice.reducer;
