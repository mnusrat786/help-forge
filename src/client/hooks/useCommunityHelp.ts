import { useCallback, useEffect, useState } from 'react';
import type { InitResponse, CreatePostRequest, CreatePostResponse, GetPostsResponse, ClearPostsResponse, HelpPost } from '../../shared/types/api';

interface CommunityHelpState {
  posts: {
    offerHelp: HelpPost[];
    requestHelp: HelpPost[];
    resources: HelpPost[];
  };
  username: string | null;
  loading: boolean;
}

export const useCommunityHelp = () => {
  const [state, setState] = useState<CommunityHelpState>({
    posts: {
      offerHelp: [],
      requestHelp: [],
      resources: [],
    },
    username: null,
    loading: true,
  });
  const [postId, setPostId] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        if (data.type !== 'init') throw new Error('Unexpected response');
        setState({ 
          posts: data.posts, 
          username: data.username, 
          loading: false 
        });
        setPostId(data.postId);
      } catch (err) {
        console.error('Failed to init community help', err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    void init();
  }, []);

  const createPost = useCallback(
    async (content: string, type: 'offerHelp' | 'requestHelp' | 'resources') => {
      if (!postId) {
        console.error('No postId – cannot create post');
        return;
      }
      try {
        const requestBody: CreatePostRequest = { content, type };
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: CreatePostResponse = await res.json();
        
        // Update local state with new post
        setState((prev) => ({
          ...prev,
          posts: {
            ...prev.posts,
            [type]: [data.post, ...prev.posts[type]],
          },
        }));
      } catch (err) {
        console.error(`Failed to create post`, err);
      }
    },
    [postId]
  );

  const refreshPosts = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: GetPostsResponse = await res.json();
      setState((prev) => ({ ...prev, posts: data.posts }));
    } catch (err) {
      console.error('Failed to refresh posts', err);
    }
  }, [postId]);

  const clearAllPosts = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await fetch('/api/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ClearPostsResponse = await res.json();
      
      if (data.success) {
        setState((prev) => ({
          ...prev,
          posts: {
            offerHelp: [],
            requestHelp: [],
            resources: [],
          },
        }));
      }
    } catch (err) {
      console.error('Failed to clear posts', err);
    }
  }, [postId]);

  return {
    ...state,
    createPost,
    refreshPosts,
    clearAllPosts,
  } as const;
};