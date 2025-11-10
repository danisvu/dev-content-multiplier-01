# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm install           # Install dependencies
npm run dev           # Start development server (port 3000)
npm run build         # Build for production
npm run start         # Start production server (port 3910)
npm run lint          # Run ESLint checks
```

### Backend (Fastify + TypeScript)
```bash
cd backend
npm install           # Install dependencies
npm run dev           # Start development server with hot reload (port 3911)
npm run build         # Compile TypeScript to dist/
npm run start         # Start production server
npm run migrate:run   # Run database migrations
```

### Database
```bash
docker-compose up -d  # Start PostgreSQL container
docker-compose down   # Stop PostgreSQL container
```

## Architecture Overview

This is a full-stack Content Ideas Manager application with AI-powered content generation capabilities:

### Backend Architecture
- **Server**: Fastify with TypeScript
- **Database**: PostgreSQL with manual migrations
- **AI Integration**: Google Gemini and Deepseek APIs
- **Structure**:
  - `routes/`: API endpoints (ideaRoutes, briefRoutes)
  - `services/`: Business logic (IdeaService, BriefService, LLMClient)
  - `migrations/`: SQL migration files
  - Environment variables required: `DATABASE_URL`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **UI**: Custom component system built on Radix UI primitives
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Dark/light mode support with next-themes
- **Key Components**:
  - `AppLayout`: Main application wrapper with sidebar navigation
  - `ThemeProvider`: Handles theme switching
  - `ui/`: Reusable UI components (buttons, cards, modals, etc.)
  - Component demos available at `/[component]-demo` routes

### Database Schema
- **ideas table**: Stores content ideas with persona, industry, and status
- **briefs table**: Stores detailed content plans generated from ideas
- Foreign key relationship: briefs.idea_id → ideas.id

## Key Workflows

### AI Content Generation
1. Ideas generation: POST `/api/ideas/generate` with persona/industry
2. Brief generation: Requires idea status = 'selected', then POST `/api/briefs/generate`
3. Uses AJV for JSON validation and exponential backoff for retries

### Frontend Routing
- `/`: Main dashboard
- `/ideas`: Ideas management
- `/briefs`: Briefs management  
- `/[feature]-demo`: Component demonstrations
- Dynamic routes: `/briefs/[id]`, `/packs/[id]`

## Important Implementation Details

### Environment Setup
- Backend runs on port 3911 (configurable via PORT env var)
- Frontend development on port 3000, production on port 3910
- CORS configured for localhost:3000, 3910, 3911

### Component System
- Uses Radix UI primitives with custom styling
- Consistent animations with Framer Motion
- Toast notifications via Sonner
- Responsive design with mobile-first approach

### API Patterns
- RESTful endpoints with proper HTTP methods
- Error handling with appropriate status codes
- Streaming support for AI responses
- Status validation for workflow control

### Database Migrations
- Manual SQL migrations in `backend/migrations/`
- Run with `npm run migrate:run` script
- No ORM - uses raw PostgreSQL with node-postgres driver