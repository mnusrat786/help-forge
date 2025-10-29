export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  posts: {
    offerHelp: HelpPost[];
    requestHelp: HelpPost[];
    resources: HelpPost[];
  };
};

export type HelpPost = {
  id: string;
  content: string;
  username: string;
  timestamp: number;
  type: 'offerHelp' | 'requestHelp' | 'resources';
};

export type CreatePostRequest = {
  content: string;
  type: 'offerHelp' | 'requestHelp' | 'resources';
};

export type CreatePostResponse = {
  type: 'createPost';
  post: HelpPost;
};

export type GetPostsResponse = {
  type: 'getPosts';
  posts: {
    offerHelp: HelpPost[];
    requestHelp: HelpPost[];
    resources: HelpPost[];
  };
};

export type ClearPostsResponse = {
  type: 'clearPosts';
  success: boolean;
};
