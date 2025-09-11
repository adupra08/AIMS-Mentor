-- AIMS (AI Mentor for Students) Database Schema
-- Complete SQL file for PostgreSQL database setup

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SESSION STORAGE TABLE (for authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Index for session expiration
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- =====================================================
-- 2. USERS TABLE (authentication data)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. STUDENT PROFILES TABLE (main student data)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    current_grade INTEGER NOT NULL,
    current_gpa DECIMAL(3,2),
    current_subjects JSONB DEFAULT '[]',
    interested_subjects JSONB DEFAULT '[]',
    dream_colleges JSONB DEFAULT '[]',
    academic_interests JSONB DEFAULT '[]',
    career_goals TEXT,
    extracurricular_activities JSONB DEFAULT '[]',
    completed_aps JSONB DEFAULT '[]',
    planned_aps JSONB DEFAULT '[]',
    test_scores JSONB DEFAULT '{}',
    state VARCHAR,
    location VARCHAR,
    school_district VARCHAR,
    is_onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. ACADEMIC PATHWAYS TABLE (AI-generated plans)
-- =====================================================
CREATE TABLE IF NOT EXISTS academic_pathways (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    pathway_data JSONB NOT NULL,
    target_college VARCHAR NOT NULL,
    overall_progress DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. OPPORTUNITIES TABLE (competitions, internships, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR NOT NULL,
    eligible_grades JSONB DEFAULT '[]',
    subjects JSONB DEFAULT '[]',
    deadline TIMESTAMP,
    application_url VARCHAR,
    is_team_based BOOLEAN DEFAULT FALSE,
    location VARCHAR,
    is_paid BOOLEAN DEFAULT FALSE,
    difficulty_level VARCHAR,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. STUDENT OPPORTUNITIES TABLE (bookmarked/applied)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_opportunities (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    opportunity_id INTEGER NOT NULL REFERENCES opportunities(id),
    status VARCHAR DEFAULT 'bookmarked',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. TODOS TABLE (student task management)
-- =====================================================
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    title VARCHAR NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    priority VARCHAR DEFAULT 'medium',
    category VARCHAR,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 8. CHAT MESSAGES TABLE (AI mentor conversations)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    message TEXT NOT NULL,
    sender VARCHAR NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. PROGRESS TRACKING TABLE (student analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS progress_tracking (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    category VARCHAR NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    details JSONB DEFAULT '{}',
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 10. ACHIEVEMENTS TABLE (student accomplishments)
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    title VARCHAR NOT NULL,
    description TEXT,
    type VARCHAR NOT NULL,
    category VARCHAR,
    date_achieved TIMESTAMP,
    organization VARCHAR,
    location VARCHAR,
    ranking VARCHAR,
    certificate_url VARCHAR,
    publication_url VARCHAR,
    skills JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 11. GRADUATION REQUIREMENTS TABLE (state requirements)
-- =====================================================
CREATE TABLE IF NOT EXISTS graduation_requirements (
    id SERIAL PRIMARY KEY,
    state TEXT NOT NULL,
    district TEXT,
    subject TEXT NOT NULL,
    course_title TEXT NOT NULL,
    credits_required DECIMAL(3,1) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE NOT NULL,
    grade_level TEXT,
    description TEXT,
    alternatives TEXT[],
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 12. STUDENT COURSE PROGRESS TABLE (academic tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_course_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student_profiles(id),
    requirement_id INTEGER REFERENCES graduation_requirements(id),
    course_name TEXT NOT NULL,
    credits_earned DECIMAL(3,1) NOT NULL,
    grade TEXT,
    semester TEXT,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    planned_semester TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Student profiles indexes
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_grade ON student_profiles(current_grade);

-- Academic pathways indexes
CREATE INDEX IF NOT EXISTS idx_academic_pathways_student_id ON academic_pathways(student_id);

-- Opportunities indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);

-- Student opportunities indexes
CREATE INDEX IF NOT EXISTS idx_student_opportunities_student_id ON student_opportunities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_opportunities_opportunity_id ON student_opportunities(opportunity_id);

-- Todos indexes
CREATE INDEX IF NOT EXISTS idx_todos_student_id ON todos(student_id);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(is_completed);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_student_id ON chat_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Progress tracking indexes
CREATE INDEX IF NOT EXISTS idx_progress_tracking_student_id ON progress_tracking(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_category ON progress_tracking(category);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_student_id ON achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);

-- Course progress indexes
CREATE INDEX IF NOT EXISTS idx_student_course_progress_student_id ON student_course_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_course_progress_requirement_id ON student_course_progress(requirement_id);

-- =====================================================
-- SAMPLE DATA INSERT COMMANDS
-- =====================================================

-- To populate opportunities, you can run:
-- POST request to: http://localhost:5000/api/seed/opportunities

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- Check all tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count records in each table:
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL SELECT 'student_profiles', COUNT(*) FROM student_profiles
-- UNION ALL SELECT 'opportunities', COUNT(*) FROM opportunities
-- UNION ALL SELECT 'todos', COUNT(*) FROM todos
-- UNION ALL SELECT 'chat_messages', COUNT(*) FROM chat_messages;

-- View student profile with user info:
-- SELECT u.email, u.first_name, u.last_name, sp.current_grade, sp.current_gpa
-- FROM users u
-- JOIN student_profiles sp ON u.id = sp.user_id;

-- =====================================================
-- END OF SCHEMA
-- =====================================================