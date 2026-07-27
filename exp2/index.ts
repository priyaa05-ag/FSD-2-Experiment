import { configureStore, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import postsReducer from './postsSlice';
import platformsReducer from './platformsSlice';
import uiReducer, { logAction } from './uiSlice';

// Custom middleware to log dispatched actions to UI Audit Log
const actionLoggerMiddleware: Middleware = (storeApi) => (next) => (action: any) => {
  const startTime = performance.now();
  const result = next(action);
  const endTime = performance.now();

  // Ignore internal ui/logAction to avoid recursion loop
  if (action?.type && !action.type.startsWith('ui/logAction')) {
    const durationMs = parseFloat((endTime - startTime).toFixed(2));
    storeApi.dispatch(
      logAction({
        actionType: action.type,
        payload: action.payload,
        durationMs,
      })
    );
  }

  return result;
};

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(actionLoggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom typed hooks for use across components
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
