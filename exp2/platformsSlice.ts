import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlatformConfig, PlatformType } from '../types';
import { INITIAL_PLATFORMS } from '../data/mockData';

export interface PlatformsState {
  platforms: PlatformConfig[];
  selectedPlatform: PlatformType | 'all';
}

const initialState: PlatformsState = {
  platforms: INITIAL_PLATFORMS,
  selectedPlatform: 'all',
};

export const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    setSelectedPlatform: (state, action: PayloadAction<PlatformType | 'all'>) => {
      state.selectedPlatform = action.payload;
    },
    togglePlatformConnection: (state, action: PayloadAction<PlatformType>) => {
      const platform = state.platforms.find((p) => p.id === action.payload);
      if (platform) {
        platform.connected = !platform.connected;
      }
    },
    updatePlatformFollowers: (
      state,
      action: PayloadAction<{ id: PlatformType; followers: number }>
    ) => {
      const platform = state.platforms.find((p) => p.id === action.payload.id);
      if (platform) {
        platform.totalFollowers = action.payload.followers;
      }
    },
  },
});

export const {
  setSelectedPlatform,
  togglePlatformConnection,
  updatePlatformFollowers,
} = platformsSlice.actions;

export default platformsSlice.reducer;
