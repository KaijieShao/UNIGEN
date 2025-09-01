# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI to generate React components in a virtual file system, allowing users to iterate on components without writing files to disk.

## Development Commands

### Setup
```bash
npm run setup         # Install dependencies, generate Prisma client, run migrations
```

### Development
```bash
npm run dev           # Start development server with Turbopack
npm run dev:daemon    # Start server in background, logs to logs.txt
```

### Testing and Quality
```bash
npm test              # Run tests with Vitest
npm run lint          # Run Next.js linting
```

### Database
```bash
npx prisma generate   # Generate Prisma client
npx prisma migrate dev # Run database migrations
npm run db:reset      # Reset database (force)
```

### Production
```bash
npm run build         # Build for production
npm start             # Start production server
```

## Architecture

### Core Components
- **Virtual File System** (`src/lib/file-system.ts`): In-memory file system that simulates disk operations without writing files
- **File System Context** (`src/lib/contexts/file-system-context.tsx`): React context managing virtual files, handles tool calls from AI
- **Chat Context** (`src/lib/contexts/chat-context.tsx`): Manages AI chat integration using Vercel AI SDK

### AI Integration
- Uses Anthropic Claude via Vercel AI SDK (`src/app/api/chat/route.ts`)
- AI can manipulate virtual files through tool calls (str_replace_editor, file_manager)
- Generated components are previewed in real-time using React sandboxing

### Data Persistence
- **Database**: SQLite with Prisma ORM
- **Schema**: Users can save projects containing chat messages and virtual file system state
- **Anonymous Mode**: Temporary projects tracked in browser storage

### UI Structure
- **Main Interface**: Split view with chat, code editor, and preview pane
- **Authentication**: Optional signup/signin with anonymous fallback
- **Code Editor**: Monaco Editor with syntax highlighting
- **Preview**: Live React component rendering with hot reload

### Key Directories
- `src/actions/`: Server actions for project CRUD operations
- `src/components/chat/`: Chat interface components
- `src/components/editor/`: Code editor and file tree components  
- `src/components/preview/`: Live preview functionality
- `src/lib/tools/`: AI tool implementations for file operations
- `src/lib/transform/`: JSX transformation utilities for preview rendering

### Tech Stack
- Next.js 15 with App Router and React 19
- TypeScript with strict configuration
- Tailwind CSS v4 for styling
- Prisma with SQLite database
- Vitest for testing with jsdom environment
- Monaco Editor for code editing
- Anthropic Claude AI via Vercel AI SDK

## Environment Setup

Optional: Set `ANTHROPIC_API_KEY` in `.env` for AI functionality. Without it, static code is returned instead of AI-generated components.
- Use comments sparingly. Only comment complex code.
- The database schema is defined in the @prisma/schema.prisma file. Reference it anytime you need to understand the structure of data stored in the database.