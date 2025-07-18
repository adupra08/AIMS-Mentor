# AI Mentor for Students - AIMS

## Overview

AI Mentor for Students - AIMS is a comprehensive web application that provides AI-driven mentoring to help high school students create personalized academic pathways to reach their dream colleges. The platform combines modern web technologies with AI capabilities to deliver tailored guidance, opportunity recommendations, and progress tracking.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server components:

- **Frontend**: React-based SPA using Vite as the build tool
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration
- **AI Integration**: OpenAI GPT-4 for chat and pathway generation
- **UI Framework**: shadcn/ui components with Tailwind CSS

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom AIMS branding
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **API Server**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Authentication**: Passport.js with OpenID Connect (Replit Auth)
- **Session Management**: Express sessions with PostgreSQL store
- **AI Services**: OpenAI integration for chat responses and pathway generation

### Database Schema
The application uses a comprehensive database schema including:
- **Users**: User authentication and profile data
- **Student Profiles**: Academic information, interests, and goals
- **Academic Pathways**: AI-generated personalized academic plans
- **Opportunities**: Competitions, courses, and activities
- **Todos**: Task management for students
- **Chat Messages**: AI conversation history
- **Progress Tracking**: Student achievement monitoring

### Authentication System
- Integrated with Replit's OpenID Connect authentication
- Session-based authentication with PostgreSQL session store
- Automatic user creation and profile management
- Secure session handling with HTTP-only cookies

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating a session
2. **Profile Creation**: New users complete onboarding to create student profiles
3. **AI Pathway Generation**: Student profiles trigger AI-generated academic pathways
4. **Opportunity Matching**: System matches students with relevant opportunities
5. **Chat Interaction**: Students can chat with AI mentor for personalized guidance
6. **Progress Tracking**: System monitors and tracks student progress over time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **openai**: AI chat and pathway generation
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Client-side data fetching and caching

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **wouter**: Lightweight React router

### Authentication
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

The application is configured for deployment on Replit with:

- **Development**: `npm run dev` - Runs both frontend and backend in development mode
- **Build**: `npm run build` - Creates production builds for both client and server
- **Production**: `npm start` - Serves the production application
- **Database**: Uses Drizzle Kit for schema management and migrations

Environment variables required:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `SESSION_SECRET`: Session encryption secret
- `REPLIT_DOMAINS`: Allowed domains for authentication

## Changelog

Changelog:
- July 18, 2025: Updated app branding to "AI Mentor for Students - AIMS" across all UI components
- June 29, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.