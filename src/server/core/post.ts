import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Community Help Hub',
      backgroundUri: 'default-splash.png',
      buttonLabel: '🤝 Join the Community',
      description: 'Connect, share resources, and help each other grow! Offer help, request assistance, or share valuable resources with your community.',
      entryUri: 'index.html',
      heading: '🌟 Community Help Hub',
      appIconUri: 'default-icon.png',
    },
    postData: {
      appType: 'community-help',
      version: '1.0.0',
    },
    subredditName: subredditName,
    title: '🤝 Community Help Hub - Connect & Share Resources',
  });
};
