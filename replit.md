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
- **AI Services**: OpenAI GPT-4o-mini for chat responses and student progress analysis

### Database Schema
The application uses a comprehensive database schema including:
- **Users**: User authentication and profile data
- **Student Profiles**: Academic information, interests, and goals
- **Academic Pathways**: AI-generated personalized academic plans
- **Opportunities**: Competitions, courses, and activities
- **Scholarships**: Financial aid opportunities with eligibility criteria and matching metadata
- **Student Scholarships**: Saved scholarships with application tracking
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
- **Port Configuration**: Server runs on port 5000 with external port forwarding to 80

Environment variables required:
- `DATABASE_URL`: PostgreSQL connection string (automatically provided)
- `OPENAI_API_KEY`: OpenAI API access key
- `SESSION_SECRET`: Session encryption secret (configured)
- `REPLIT_DOMAINS`: Allowed domains for authentication (configured)
- `REPL_ID`: Replit environment identifier (configured)

**Deployment Configuration**:
- Authentication uses Replit's OpenID Connect with proper callback URLs
- Session management with PostgreSQL session store
- Cookie security settings configured for production
- All required environment variables validated at startup

## Deployment Fixes Applied

**Issue**: Deployment failed due to configuration error with missing environment variables and session table creation

**Solutions Implemented**:

1. **Environment Variable Validation**: Added comprehensive validation in `server/index.ts` for production environment that checks for:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REPLIT_DOMAINS`: Allowed domains for authentication  
   - `REPL_ID`: Replit environment identifier
   - `SESSION_SECRET`: Session encryption secret

2. **Session Store Configuration**: Updated `server/replitAuth.ts` to set `createTableIfMissing: true` for PostgreSQL session store, ensuring sessions table is created automatically in production

3. **Production Startup Script**: Created `start-production.js` with comprehensive environment validation and database schema deployment before server startup

4. **Build Process**: Enhanced `build-deploy.sh` to include database schema deployment (`npm run db:push`) before building the application

5. **Database Schema**: Verified all required tables exist with proper migrations using Drizzle Kit

**Status**: ✅ DEPLOYED SUCCESSFULLY - All deployment issues resolved and application is now live in production.

## Recent Updates

### November 22, 2025 - **INTELLIGENT SCHOLARSHIP MATCHING SYSTEM** ✅
- **Database Schema**: Added scholarships and studentScholarships tables with comprehensive matching criteria
- **Seed Data**: Pre-loaded 18 diverse scholarships covering STEM, arts, athletics, leadership, and community service
- **Matching Algorithm**: Multi-criteria scoring system in `server/services/scholarshipMatcher.ts`:
  - Hard eligibility requirements: grade level, minimum GPA, state residency, test scores
  - Preference bonuses: academic subjects, extracurricular activities, specific interests
  - Match scores range 0-100% with detailed match reasons
- **API Endpoints**:
  - GET /api/student/matched-scholarships - Returns scholarships matched to student profile with scores
  - POST /api/student/scholarships/:id/save - Save scholarship to student's list (prevents duplicates)
  - GET /api/student/scholarships - Retrieve student's saved scholarships
  - PATCH /api/student/scholarships/:id - Update scholarship status and notes
  - DELETE /api/student/scholarships/:id - Remove saved scholarship
- **Scholarships Page Component**: Full-featured UI with:
  - Scholarship cards displaying amount, deadline, provider, requirements
  - Visual match scores with progress bars and match reason badges
  - Color-coded deadline indicators (red for <7 days, orange for <30 days)
  - Save for Later functionality with duplicate prevention
  - Direct "Apply Now" links to external applications
  - Saved badge indicators for bookmarked scholarships
  - Empty states for incomplete profiles
- **Navigation Integration**: Added Scholarships tab to main navigation (desktop and mobile)
- **Error Handling**: Comprehensive error handling including duplicate save detection with user-friendly toast messages

### October 29, 2025 - **STATE-SPECIFIC GRADUATION REQUIREMENTS** ✅
- **State Selector**: Added dropdown to select state and view state-specific graduation requirements
- **Available States**: California, New York, and Texas graduation requirements pre-loaded
- **Dynamic Requirements**: Requirements update in real-time when state is changed
- **Profile Integration**: Selected state saves to student profile for future sessions
- **API Endpoints**: 
  - GET /api/graduation-requirements/states - Returns available states
  - GET /api/student/graduation-requirements?state={state} - Returns state-specific requirements
- **User Experience**: MapPin icon with clean dropdown interface, toast notifications on state updates

### October 29, 2025 - **DEADLINE NOTIFICATION SYSTEM** ✅
- **Real-time Notifications**: Added bell icon in header with live badge counter showing upcoming deadlines
- **Smart Filtering**: Automatically tracks incomplete todos and bookmarked opportunities expiring within 7 days
- **Visual Feedback**: Red notification badge displays count of upcoming items
- **Notification Popover**: Dropdown panel shows:
  - Task/opportunity titles
  - Days remaining until deadline
  - Priority indicators (high priority items highlighted)
  - Empty state when no deadlines approaching
- **Auto-refresh**: Notifications update automatically every 5 minutes
- **Date Logic**: Uses inclusive date range from start of today through end of 7th day
- **API Endpoint**: GET /api/student/notifications returns structured notification data

### August 18, 2025 - **PROFILE EDITING SYSTEM** ✅
- **Enhanced ProfileSettings Component**: Added comprehensive profile editing with tabbed interface
- **Basic Info Tab**: Edit first name, last name (email read-only)
- **Academic Profile Tab**: Full editing capabilities for:
  - Extracurricular Activities: 16 predefined options with checkboxes
  - Academic Interests: 14 subject areas with visual tags
  - Interested Subjects: 15 academic subjects with color-coded display
  - **GPA Updates**: Annual GPA tracking (0.00-4.00 scale) with progress reminders
  - **Test Scores**: SAT (400-1600), ACT (1-36), PSAT (320-1520) score management
- **Real-time Updates**: Form validation, state management, and database persistence
- **Visual Design**: Color-coded tags, empty states, and intuitive UI/UX

### Key Features Added:
- **Profile Management**: Students can now update all academic information post-onboarding
- **Test Prep Integration**: Test scores directly impact progress calculations (75% when scores present)
- **Annual GPA Tracking**: Built-in reminders for yearly GPA updates
- **Achievement System**: Extracurricular accomplishments tracked separately from general activities

## Changelog

- November 22, 2025: **INTELLIGENT SCHOLARSHIP MATCHING SYSTEM** - Implemented comprehensive scholarship recommendation engine with 18 pre-seeded scholarships, multi-criteria matching algorithm (GPA, grade, state, subjects, test scores, extracurriculars), dedicated Scholarships page with save functionality, match scores, deadline tracking, and duplicate prevention
- October 29, 2025: **STATE-SPECIFIC GRADUATION REQUIREMENTS** - Added state selector dropdown allowing students to view graduation requirements specific to their state (California, New York, Texas); requirements update dynamically with profile persistence
- October 29, 2025: **DEADLINE NOTIFICATION SYSTEM** - Implemented real-time deadline notifications with bell icon, badge counter, and popover displaying upcoming todos/opportunities within 7 days
- October 14, 2025: **AI MIGRATION** - Switched from Google Gemini to OpenAI GPT-4o-mini for chat and analysis due to quota limits; enhanced Render deployment compatibility with PostgreSQL SSL support
- August 18, 2025: **PROFILE EDITING SYSTEM** - Added comprehensive profile editing with GPA updates, test scores management, and extracurricular activities modification
- July 18, 2025 (Evening): **DEPLOYMENT FIXES** - Resolved all deployment configuration errors: added environment variable validation, fixed session table creation, enhanced build process with database schema deployment
- July 18, 2025 (Evening): Fixed build process - Resolved static file serving path issue, created build-deploy.sh script, verified production build works correctly
- July 18, 2025 (Evening): Applied deployment fixes - Added environment variable validation for REPL_ID and SESSION_SECRET, configured cookie security settings for production, verified database and session table configuration
- July 18, 2025: Updated app branding to "AI Mentor for Students - AIMS" across all UI components
- June 29, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.