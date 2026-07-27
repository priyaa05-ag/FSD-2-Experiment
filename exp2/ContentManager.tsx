import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Send, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Eye, 
  X,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  selectFilteredPosts, 
  selectPlatforms, 
  selectSearchQuery, 
  selectStatusFilter, 
  selectSelectedPlatform 
} from '../store/selectors';
import { addPost, updatePost, removePost, createPostThunk } from '../store/postsSlice';
import { setSearchQuery, setStatusFilter } from '../store/uiSlice';
import { setSelectedPlatform } from '../store/platformsSlice';
import { Post, PlatformType, PostStatus } from '../types';

export const ContentManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredPosts = useAppSelector(selectFilteredPosts);
  const platforms = useAppSelector(selectPlatforms);
  const searchQuery = useAppSelector(selectSearchQuery);
  const statusFilter = useAppSelector(selectStatusFilter);
  const selectedPlatform = useAppSelector(selectSelectedPlatform);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formPlatform, setFormPlatform] = useState<PlatformType>('twitter');
  const [formStatus, setFormStatus] = useState<PostStatus>('scheduled');
  const [formDate, setFormDate] = useState('2026-07-28');
  const [formTime, setFormTime] = useState('14:00');
  const [formTags, setFormTags] = useState('Redux,React,State');

  // AI Assistant state
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const getPlatformIcon = (platformId: PlatformType) => {
    switch (platformId) {
      case 'twitter': return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-[#0A66C2]" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-[#E4405F]" />;
      case 'facebook': return <Facebook className="h-4 w-4 text-[#1877F2]" />;
      case 'youtube': return <Youtube className="h-4 w-4 text-[#FF0000]" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
            <Clock className="h-3 w-3" /> Scheduled
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <FileText className="h-3 w-3" /> Draft
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormContent('');
    setFormPlatform('twitter');
    setFormStatus('scheduled');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('12:00');
    setFormTags('Redux,React,State');
    setAiTopic('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: Post) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormContent(post.content);
    setFormPlatform(post.platform);
    setFormStatus(post.status);
    setFormDate(post.scheduledDate);
    setFormTime(post.scheduledTime);
    setFormTags(post.tags.join(','));
    setIsModalOpen(true);
  };

  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic for AI content generation.');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-ai-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          platform: formPlatform,
          tone: 'engaging and educational',
        }),
      });
      const data = await res.json();
      if (data.generatedContent) {
        setFormContent(data.generatedContent);
        if (!formTitle) setFormTitle(`Overview: ${aiTopic}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      alert('Please fill out both Title and Content');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingPostId) {
      // Dispatch Redux action updatePost
      dispatch(
        updatePost({
          id: editingPostId,
          changes: {
            title: formTitle,
            content: formContent,
            platform: formPlatform,
            status: formStatus,
            scheduledDate: formDate,
            scheduledTime: formTime,
            tags: tagsArray,
            updatedAt: new Date().toISOString(),
          },
        })
      );
    } else {
      // Dispatch Redux async thunk createPostThunk
      dispatch(
        createPostThunk({
          title: formTitle,
          content: formContent,
          platform: formPlatform,
          status: formStatus,
          scheduledDate: formDate,
          scheduledTime: formTime,
          tags: tagsArray,
        })
      );
    }

    setIsModalOpen(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this post from normalized Redux store?')) {
      dispatch(removePost(id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar & Create Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search posts by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-slate-950 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => dispatch(setSearchQuery(''))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
              className="bg-slate-950 text-slate-300 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="scheduled">Scheduled Only</option>
              <option value="draft">Drafts Only</option>
              <option value="failed">Failed Only</option>
            </select>

            {/* Create Post Button */}
            <button
              onClick={handleOpenCreateModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* Platform Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-mono mr-1">Platforms:</span>
          <button
            onClick={() => dispatch(setSelectedPlatform('all'))}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              selectedPlatform === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Platforms
          </button>

          {platforms.map((p) => {
            const isSelected = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => dispatch(setSelectedPlatform(p.id))}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {getPlatformIcon(p.id)}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts List Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-slate-200 font-bold text-base">No matching posts found</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Try adjusting your search query, status filter, or create a new post using the Redux store.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Post</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-3 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Header: Platform & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      {getPlatformIcon(post.platform)}
                    </div>
                    <span className="text-xs font-semibold text-slate-300 capitalize">
                      {post.platform}
                    </span>
                  </div>
                  {getStatusBadge(post.status)}
                </div>

                {/* Title */}
                <h3 className="text-slate-100 font-bold text-base leading-snug line-clamp-1">
                  {post.title}
                </h3>

                {/* Content */}
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Metadata, Stats & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    {post.scheduledDate} {post.scheduledTime}
                  </span>

                  {post.status === 'published' && (
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="flex items-center gap-0.5">
                        <ThumbsUp className="h-3 w-3 text-indigo-400" /> {post.likesCount}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="h-3 w-3 text-emerald-400" /> {post.viewsCount}
                      </span>
                    </span>
                  )}
                </div>

                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 rounded-lg transition-colors cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Post Creation / Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-400" />
                {editingPostId ? 'Edit Normalized Post' : 'Create New Post in Redux'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* AI Generator Helper Box */}
            <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Smart AI Caption Generator
                </span>
                <span className="text-[10px] text-indigo-400 font-mono">Gemini / Template Powered</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Redux Toolkit createEntityAdapter performance"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-indigo-900/80 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  {isGeneratingAi ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., State Normalization Best Practices"
                  className="w-full bg-slate-950 text-slate-100 text-sm px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Content</label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your social media post caption here..."
                  className="w-full bg-slate-950 text-slate-100 text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Platform</label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as PlatformType)}
                    className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PostStatus)}
                    className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hashtags (Comma Separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Redux,React,State"
                  className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {editingPostId ? 'Save Changes' : 'Dispatch Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
