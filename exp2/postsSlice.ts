import { createSlice, createEntityAdapter, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../types';
import { INITIAL_POSTS } from '../data/mockData';

// 1. Create Entity Adapter for State Normalization ({ ids: [], entities: {} })
export const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

// Initial state using adapter's getInitialState
export interface PostsExtraState {
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  fetchCount: number;
}

const initialState = postsAdapter.getInitialState<PostsExtraState>({
  loading: false,
  error: null,
  lastFetchedAt: new Date().toISOString(),
  fetchCount: 0,
});

// Pre-populate initial state with mock items for immediate demonstration
const preloadedState = postsAdapter.addMany(initialState, INITIAL_POSTS);

// 2. Async Thunks using createAsyncThunk for API side-effects
export const fetchPostsThunk = createAsyncThunk<
  Post[],
  { simulateDelayMs?: number; shouldFail?: boolean } | undefined,
  { rejectValue: string }
>('posts/fetchPosts', async (options, { rejectWithValue }) => {
  const delay = options?.simulateDelayMs ?? 800;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (options?.shouldFail) {
    return rejectWithValue('Network error (500): Failed to establish database socket session.');
  }

  // Simulate API response
  return INITIAL_POSTS;
});

export const createPostThunk = createAsyncThunk<
  Post,
  Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'sharesCount' | 'commentsCount' | 'viewsCount'>,
  { rejectValue: string }
>('posts/createPost', async (newPostData, { rejectWithValue }) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const createdPost: Post = {
    ...newPostData,
    id: `post-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    likesCount: 0,
    sharesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return createdPost;
});

export const updatePostThunk = createAsyncThunk<
  Post,
  Partial<Post> & { id: string },
  { rejectValue: string }
>('posts/updatePost', async (updatedFields, { rejectWithValue }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!updatedFields.id) {
    return rejectWithValue('Cannot update post: missing post ID');
  }

  return {
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  } as Post;
});

export const deletePostThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('posts/deletePost', async (postId, { rejectWithValue }) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return postId;
});

// 3. Posts Slice Definition
export const postsSlice = createSlice({
  name: 'posts',
  initialState: preloadedState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      postsAdapter.addOne(state, action.payload);
    },
    updatePost: (state, action: PayloadAction<{ id: string; changes: Partial<Post> }>) => {
      postsAdapter.updateOne(state, action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      postsAdapter.removeOne(state, action.payload);
    },
    setAllPosts: (state, action: PayloadAction<Post[]>) => {
      postsAdapter.setAll(state, action.payload);
    },
    clearAllPosts: (state) => {
      postsAdapter.removeAll(state);
    },
    resetToInitialPosts: (state) => {
      postsAdapter.setAll(state, INITIAL_POSTS);
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handling createAsyncThunk lifecycle: pending, fulfilled, rejected
    builder
      // Fetch Posts
      .addCase(fetchPostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastFetchedAt = new Date().toISOString();
        state.fetchCount += 1;
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts';
      })
      // Create Post
      .addCase(createPostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create post';
      })
      // Update Post
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const { id, ...changes } = action.payload;
        postsAdapter.updateOne(state, { id, changes });
      })
      // Delete Post
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      });
  },
});

export const {
  addPost,
  updatePost,
  removePost,
  setAllPosts,
  clearAllPosts,
  resetToInitialPosts,
} = postsSlice.actions;

export default postsSlice.reducer;
