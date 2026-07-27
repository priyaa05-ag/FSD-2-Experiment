import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { postsAdapter } from './postsSlice';
import { Post, PlatformType, PostStatus } from '../types';

// 1. Base Selectors from Entity Adapter
const postsSelectors = postsAdapter.getSelectors<RootState>((state) => state.posts);

export const selectAllPosts = postsSelectors.selectAll;
export const selectPostEntities = postsSelectors.selectEntities;
export const selectPostIds = postsSelectors.selectIds;
export const selectPostById = postsSelectors.selectById;
export const selectTotalPosts = postsSelectors.selectTotal;

// 2. Base State Selectors
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectPostsError = (state: RootState) => state.posts.error;
export const selectPostsLastFetched = (state: RootState) => state.posts.lastFetchedAt;
export const selectPostsFetchCount = (state: RootState) => state.posts.fetchCount;

export const selectPlatforms = (state: RootState) => state.platforms.platforms;
export const selectSelectedPlatform = (state: RootState) => state.platforms.selectedPlatform;

export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
export const selectStatusFilter = (state: RootState) => state.ui.statusFilter;
export const selectCurrentTab = (state: RootState) => state.ui.currentTab;
export const selectActionLogs = (state: RootState) => state.ui.actionLogs;
export const selectRecomputationCounters = (state: RootState) => state.ui.recomputationCounters;

// Counter variable for live tracking recomputation vs cache hit in demo
export let filteredPostsComputationCount = 0;
export let analyticsComputationCount = 0;
export let calendarComputationCount = 0;

export const resetComputationTrackers = () => {
  filteredPostsComputationCount = 0;
  analyticsComputationCount = 0;
  calendarComputationCount = 0;
};

// 3. Memoized Derived Selectors using createSelector
// A. Filtered Posts Selector
export const selectFilteredPosts = createSelector(
  [selectAllPosts, selectSearchQuery, selectStatusFilter, selectSelectedPlatform],
  (posts, query, statusFilter, selectedPlatform) => {
    filteredPostsComputationCount += 1;

    return posts.filter((post) => {
      // Platform match
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
        return false;
      }

      // Status match
      if (statusFilter !== 'all' && post.status !== statusFilter) {
        return false;
      }

      // Query match (title, content, tags)
      if (query.trim()) {
        const q = query.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(q);
        const contentMatch = post.content.toLowerCase().includes(q);
        const tagMatch = post.tags.some((t) => t.toLowerCase().includes(q));
        return titleMatch || contentMatch || tagMatch;
      }

      return true;
    });
  }
);

// B. Calendar Grouped Posts Selector
export const selectCalendarPosts = createSelector(
  [selectAllPosts],
  (posts) => {
    calendarComputationCount += 1;

    const grouped: Record<string, Post[]> = {};
    posts.forEach((post) => {
      const dateKey = post.scheduledDate || 'Unscheduled';
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(post);
    });

    // Sort posts within each date by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));
    });

    return grouped;
  }
);

// C. Platform Analytics Selector
export interface PlatformAnalytics {
  platformId: PlatformType | 'all';
  platformName: string;
  totalPosts: number;
  publishedCount: number;
  scheduledCount: number;
  draftCount: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  totalViews: number;
  engagementScore: number;
}

export const selectPlatformAnalytics = createSelector(
  [selectAllPosts, selectPlatforms],
  (posts, platforms) => {
    analyticsComputationCount += 1;

    const analyticsMap: Record<string, PlatformAnalytics> = {};

    // Initialize map for all platforms
    platforms.forEach((p) => {
      analyticsMap[p.id] = {
        platformId: p.id,
        platformName: p.name,
        totalPosts: 0,
        publishedCount: 0,
        scheduledCount: 0,
        draftCount: 0,
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        totalViews: 0,
        engagementScore: 0,
      };
    });

    let overallLikes = 0;
    let overallShares = 0;
    let overallComments = 0;
    let overallViews = 0;

    posts.forEach((post) => {
      const pAnalytics = analyticsMap[post.platform];
      if (pAnalytics) {
        pAnalytics.totalPosts += 1;
        if (post.status === 'published') pAnalytics.publishedCount += 1;
        if (post.status === 'scheduled') pAnalytics.scheduledCount += 1;
        if (post.status === 'draft') pAnalytics.draftCount += 1;

        pAnalytics.totalLikes += post.likesCount || 0;
        pAnalytics.totalShares += post.sharesCount || 0;
        pAnalytics.totalComments += post.commentsCount || 0;
        pAnalytics.totalViews += post.viewsCount || 0;
      }

      overallLikes += post.likesCount || 0;
      overallShares += post.sharesCount || 0;
      overallComments += post.commentsCount || 0;
      overallViews += post.viewsCount || 0;
    });

    // Compute Engagement Scores
    Object.values(analyticsMap).forEach((p) => {
      const interactions = p.totalLikes + p.totalShares * 2 + p.totalComments * 3;
      p.engagementScore = p.totalViews > 0 ? parseFloat(((interactions / p.totalViews) * 100).toFixed(2)) : 0;
    });

    return {
      byPlatform: analyticsMap,
      summary: {
        totalPosts: posts.length,
        totalLikes: overallLikes,
        totalShares: overallShares,
        totalComments: overallComments,
        totalViews: overallViews,
        averageEngagement: overallViews > 0 
          ? parseFloat((((overallLikes + overallShares * 2 + overallComments * 3) / overallViews) * 100).toFixed(2)) 
          : 0,
      },
    };
  }
);

// 4. UNMEMOIZED Selector Function (for Benchmark Testing comparison)
export const unmemoizedSelectFilteredPosts = (state: RootState) => {
  const posts = selectAllPosts(state);
  const query = selectSearchQuery(state);
  const statusFilter = selectStatusFilter(state);
  const selectedPlatform = selectSelectedPlatform(state);

  // Runs array filter on EVERY call, regardless of whether inputs changed!
  return posts.filter((post) => {
    if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) return false;
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q);
    }
    return true;
  });
};
