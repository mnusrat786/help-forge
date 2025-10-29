import express from 'express';
import { InitResponse, CreatePostRequest, CreatePostResponse, GetPostsResponse, ClearPostsResponse, HelpPost } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Helper function to get all posts from Redis
const getAllPosts = async () => {
  const [offerHelpData, requestHelpData, resourcesData] = await Promise.all([
    redis.get('posts:offerHelp'),
    redis.get('posts:requestHelp'),
    redis.get('posts:resources'),
  ]);

  return {
    offerHelp: offerHelpData ? JSON.parse(offerHelpData) : [],
    requestHelp: requestHelpData ? JSON.parse(requestHelpData) : [],
    resources: resourcesData ? JSON.parse(resourcesData) : [],
  };
};

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [username, posts] = await Promise.all([
        reddit.getCurrentUsername(),
        getAllPosts(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        username: username ?? 'anonymous',
        posts,
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, CreatePostResponse | { status: string; message: string }, CreatePostRequest>(
  '/api/posts',
  async (req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      const { content, type } = req.body;
      
      if (!content || !type || !['offerHelp', 'requestHelp', 'resources'].includes(type)) {
        res.status(400).json({
          status: 'error',
          message: 'Valid content and type are required',
        });
        return;
      }

      const username = await reddit.getCurrentUsername();
      
      const newPost: HelpPost = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: content.trim(),
        username: username ?? 'anonymous',
        timestamp: Date.now(),
        type,
      };

      // Get existing posts
      const existingPostsData = await redis.get(`posts:${type}`);
      const existingPosts: HelpPost[] = existingPostsData ? JSON.parse(existingPostsData) : [];
      
      // Add new post to the beginning (most recent first)
      const updatedPosts = [newPost, ...existingPosts];
      
      // Store back to Redis
      await redis.set(`posts:${type}`, JSON.stringify(updatedPosts));

      res.json({
        type: 'createPost',
        post: newPost,
      });
    } catch (error) {
      console.error(`Error creating post:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create post',
      });
    }
  }
);

router.get<{ postId: string }, GetPostsResponse | { status: string; message: string }>(
  '/api/posts',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      const posts = await getAllPosts();
      res.json({
        type: 'getPosts',
        posts,
      });
    } catch (error) {
      console.error(`Error getting posts:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get posts',
      });
    }
  }
);

router.post<{ postId: string }, ClearPostsResponse | { status: string; message: string }>(
  '/api/clear',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      // Clear all post types
      await Promise.all([
        redis.del('posts:offerHelp'),
        redis.del('posts:requestHelp'),
        redis.del('posts:resources'),
      ]);

      res.json({
        type: 'clearPosts',
        success: true,
      });
    } catch (error) {
      console.error(`Error clearing posts:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to clear posts',
      });
    }
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
