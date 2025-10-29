# Help Forge - Community Support Platform

A Reddit-based community help platform that connects users who need assistance with those who can offer help and resources.

## What is Help Forge?

Help Forge is an interactive community support application built on Reddit's Devvit platform. It creates a centralized hub where Reddit users can:

- **Request Help**: Post questions, problems, or requests for assistance
- **Offer Help**: Share expertise, volunteer time, or provide solutions
- **Share Resources**: Contribute useful links, guides, tools, and educational materials

The platform organizes all community contributions into three distinct categories, making it easy for users to find exactly what they're looking for or contribute in their area of expertise.

## What Makes Help Forge Innovative?

- **Reddit-Native Integration**: Seamlessly embedded within Reddit posts, leveraging existing community trust and engagement
- **Real-Time Collaboration**: Instant posting and updates using Reddit's infrastructure and Redis persistence
- **Three-Pillar Support System**: Unique categorization that covers the full spectrum of community assistance
- **Zero Friction Participation**: No separate accounts or complex onboarding - works with existing Reddit authentication
- **Persistent Community Knowledge**: All contributions are stored and accessible, building a growing knowledge base
- **Mobile-First Design**: Optimized for Reddit's mobile-heavy user base

## How to Use Help Forge

### Getting Started
1. **Launch the App**: Click the "Tap to Start" button on the Help Forge post in your subreddit
2. **Explore Categories**: Browse through the three main sections:
   - 🆘 **Request Help** - See what community members need assistance with
   - 🤝 **Offer Help** - View available help and expertise being offered
   - 📚 **Resources** - Access shared tools, guides, and useful links

### Contributing to the Community

#### To Request Help:
1. Navigate to the "Request Help" section
2. Click the "Add Post" or "+" button
3. Clearly describe your problem, question, or what assistance you need
4. Submit your request - it will appear at the top of the list for maximum visibility

#### To Offer Help:
1. Go to the "Offer Help" section  
2. Click "Add Post" or "+"
3. Describe what skills, knowledge, or assistance you can provide
4. Post your offer - others can see your expertise and reach out

#### To Share Resources:
1. Access the "Resources" section
2. Click "Add Post" or "+"
3. Share useful links, tools, guides, tutorials, or any helpful materials
4. Add a brief description of what the resource provides

### Managing Content
- **Refresh**: Pull the latest posts from all community members
- **Clear All**: Moderators can clear all posts to start fresh (use carefully!)
- **Real-Time Updates**: New posts appear immediately for all users

## Technical Stack

- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for embedded applications
- **[React](https://react.dev/)**: Frontend UI framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Express](https://expressjs.com/)**: Backend API server
- **[Redis](https://redis.io/)**: Data persistence and real-time updates
- **[Tailwind CSS](https://tailwindcss.com/)**: Responsive styling
- **[Vite](https://vite.dev/)**: Build tooling and development server

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Run `npm create devvit@latest --template=react`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit developers
3. Copy the command on the success page into your terminal

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app
- `npm run launch`: Publishes your app for review
- `npm run login`: Logs your CLI into Reddit
- `npm run check`: Type checks, lints, and prettifies your app

## Cursor Integration

This template comes with a pre-configured cursor environment. To get started, [download cursor](https://www.cursor.com/downloads) and enable the `devvit-mcp` when prompted.
