import { useState } from 'react';
import { useCommunityHelp } from './hooks/useCommunityHelp';
import { HelpPost } from '../shared/types/api';

type TabType = 'offerHelp' | 'requestHelp' | 'resources';

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const PostCard = ({ post }: { post: HelpPost }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <span className="text-sm font-medium text-[#d93900]">u/{post.username}</span>
      <span className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</span>
    </div>
    <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
  </div>
);

const PostForm = ({ 
  onSubmit, 
  placeholder, 
  disabled 
}: { 
  onSubmit: (content: string) => void;
  placeholder: string;
  disabled: boolean;
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d93900] focus:border-transparent"
          disabled={disabled}
          maxLength={280}
        />
        <button
          type="submit"
          disabled={disabled || !content.trim()}
          className="px-4 py-2 bg-[#d93900] text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b8310a] transition-colors"
        >
          Post
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {content.length}/280 characters
      </div>
    </form>
  );
};

export const App = () => {
  const { posts, username, loading, createPost, clearAllPosts } = useCommunityHelp();
  const [activeTab, setActiveTab] = useState<TabType>('offerHelp');

  const tabs = [
    { id: 'offerHelp' as TabType, label: 'Offer Help', icon: '🤝' },
    { id: 'requestHelp' as TabType, label: 'Request Help', icon: '🙋' },
    { id: 'resources' as TabType, label: 'Resources', icon: '📚' },
  ];

  const placeholders = {
    offerHelp: 'What help can you offer to the community?',
    requestHelp: 'What do you need help with?',
    resources: 'Share a useful resource, link, or tip...',
  };

  const handleCreatePost = (content: string) => {
    createPost(content, activeTab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Community Help</h1>
              {username && (
                <p className="text-sm text-gray-600">Welcome, u/{username}!</p>
              )}
            </div>
            <button
              onClick={clearAllPosts}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              🔄 Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#d93900] text-[#d93900]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Form */}
        <PostForm
          onSubmit={handleCreatePost}
          placeholder={placeholders[activeTab]}
          disabled={loading}
        />

        {/* Posts List */}
        <div className="space-y-3">
          {posts[activeTab].length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">{tabs.find(t => t.id === activeTab)?.icon}</div>
              <p className="text-gray-500 text-sm">
                No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} posts yet.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Be the first to contribute!
              </p>
            </div>
          ) : (
            posts[activeTab].map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
