--
-- AIMS Database Export for Render
-- Excludes: chat_messages, sessions (auto-regenerate)
-- Fixed: opportunities table data
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.todos DROP CONSTRAINT IF EXISTS todos_student_id_student_profiles_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_profiles DROP CONSTRAINT IF EXISTS student_profiles_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_opportunities DROP CONSTRAINT IF EXISTS student_opportunities_student_id_student_profiles_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_course_progress DROP CONSTRAINT IF EXISTS student_course_progress_student_id_student_profiles_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_course_progress DROP CONSTRAINT IF EXISTS student_course_progress_requirement_id_graduation_requirements_;
ALTER TABLE IF EXISTS ONLY public.progress_tracking DROP CONSTRAINT IF EXISTS progress_tracking_student_id_student_profiles_id_fk;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_student_id_student_profiles_id_fk;
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS achievements_student_id_student_profiles_id_fk;
ALTER TABLE IF EXISTS ONLY public.academic_pathways DROP CONSTRAINT IF EXISTS academic_pathways_student_id_student_profiles_id_fk;
DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.todos DROP CONSTRAINT IF EXISTS todos_pkey;
ALTER TABLE IF EXISTS ONLY public.student_profiles DROP CONSTRAINT IF EXISTS student_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.student_opportunities DROP CONSTRAINT IF EXISTS student_opportunities_pkey;
ALTER TABLE IF EXISTS ONLY public.student_course_progress DROP CONSTRAINT IF EXISTS student_course_progress_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.progress_tracking DROP CONSTRAINT IF EXISTS progress_tracking_pkey;
ALTER TABLE IF EXISTS ONLY public.graduation_requirements DROP CONSTRAINT IF EXISTS graduation_requirements_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS achievements_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_pathways DROP CONSTRAINT IF EXISTS academic_pathways_pkey;
ALTER TABLE IF EXISTS public.todos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_profiles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_opportunities ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_course_progress ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.progress_tracking ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.graduation_requirements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.chat_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.achievements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.academic_pathways ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.todos_id_seq;
DROP TABLE IF EXISTS public.todos;
DROP SEQUENCE IF EXISTS public.student_profiles_id_seq;
DROP TABLE IF EXISTS public.student_profiles;
DROP SEQUENCE IF EXISTS public.student_opportunities_id_seq;
DROP TABLE IF EXISTS public.student_opportunities;
DROP SEQUENCE IF EXISTS public.student_course_progress_id_seq;
DROP TABLE IF EXISTS public.student_course_progress;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.progress_tracking_id_seq;
DROP TABLE IF EXISTS public.progress_tracking;
DROP SEQUENCE IF EXISTS public.opportunities_id_seq;
DROP SEQUENCE IF EXISTS public.graduation_requirements_id_seq;
DROP TABLE IF EXISTS public.graduation_requirements;
DROP SEQUENCE IF EXISTS public.chat_messages_id_seq;
DROP TABLE IF EXISTS public.chat_messages;
DROP SEQUENCE IF EXISTS public.achievements_id_seq;
DROP TABLE IF EXISTS public.achievements;
DROP SEQUENCE IF EXISTS public.academic_pathways_id_seq;
DROP TABLE IF EXISTS public.academic_pathways;
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_pathways; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academic_pathways (
    id integer NOT NULL,
    student_id integer NOT NULL,
    pathway_data jsonb NOT NULL,
    target_college character varying NOT NULL,
    overall_progress numeric(5,2) DEFAULT '0'::numeric,
    last_updated timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: academic_pathways_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.academic_pathways_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: academic_pathways_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.academic_pathways_id_seq OWNED BY public.academic_pathways.id;


--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    type character varying NOT NULL,
    category character varying,
    date_achieved timestamp without time zone,
    organization character varying,
    location character varying,
    ranking character varying,
    certificate_url character varying,
    publication_url character varying,
    skills jsonb DEFAULT '[]'::jsonb,
    is_verified boolean DEFAULT false,
    verification_notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    student_id integer NOT NULL,
    message text NOT NULL,
    sender character varying NOT NULL,
    response text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: graduation_requirements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.graduation_requirements (
    id integer NOT NULL,
    state text NOT NULL,
    district text,
    subject text NOT NULL,
    course_title text NOT NULL,
    credits_required numeric(3,1) NOT NULL,
    is_mandatory boolean DEFAULT true NOT NULL,
    grade_level text,
    description text,
    alternatives text[],
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: graduation_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.graduation_requirements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: graduation_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.graduation_requirements_id_seq OWNED BY public.graduation_requirements.id;


--
-- Name: opportunities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.opportunities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progress_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.progress_tracking (
    id integer NOT NULL,
    student_id integer NOT NULL,
    category character varying NOT NULL,
    score numeric(5,2) NOT NULL,
    details jsonb DEFAULT '{}'::jsonb,
    recorded_at timestamp without time zone DEFAULT now()
);


--
-- Name: progress_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.progress_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progress_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_tracking_id_seq OWNED BY public.progress_tracking.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: student_course_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_course_progress (
    id integer NOT NULL,
    student_id integer NOT NULL,
    requirement_id integer,
    course_name text NOT NULL,
    credits_earned numeric(3,1) NOT NULL,
    grade text,
    semester text,
    is_completed boolean DEFAULT false NOT NULL,
    planned_semester text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: student_course_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_course_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_course_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_course_progress_id_seq OWNED BY public.student_course_progress.id;


--
-- Name: student_opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_opportunities (
    id integer NOT NULL,
    student_id integer NOT NULL,
    opportunity_id integer NOT NULL,
    status character varying DEFAULT 'bookmarked'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: student_opportunities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_opportunities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_opportunities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_opportunities_id_seq OWNED BY public.student_opportunities.id;


--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profiles (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    current_grade integer NOT NULL,
    current_gpa numeric(3,2),
    current_subjects jsonb DEFAULT '[]'::jsonb,
    interested_subjects jsonb DEFAULT '[]'::jsonb,
    dream_colleges jsonb DEFAULT '[]'::jsonb,
    academic_interests jsonb DEFAULT '[]'::jsonb,
    career_goals text,
    extracurricular_activities jsonb DEFAULT '[]'::jsonb,
    completed_aps jsonb DEFAULT '[]'::jsonb,
    planned_aps jsonb DEFAULT '[]'::jsonb,
    test_scores jsonb DEFAULT '{}'::jsonb,
    location character varying,
    school_district character varying,
    is_onboarding_complete boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    state character varying
);


--
-- Name: student_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_profiles_id_seq OWNED BY public.student_profiles.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    due_date timestamp without time zone,
    priority character varying DEFAULT 'medium'::character varying,
    category character varying,
    is_completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    password_hash text,
    email_verified boolean DEFAULT false NOT NULL,
    verification_token character varying,
    verification_token_expires timestamp without time zone,
    last_login_at timestamp without time zone
);


--
-- Name: academic_pathways id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_pathways ALTER COLUMN id SET DEFAULT nextval('public.academic_pathways_id_seq'::regclass);


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: graduation_requirements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graduation_requirements ALTER COLUMN id SET DEFAULT nextval('public.graduation_requirements_id_seq'::regclass);


--
-- Name: progress_tracking id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_tracking ALTER COLUMN id SET DEFAULT nextval('public.progress_tracking_id_seq'::regclass);


--
-- Name: student_course_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_course_progress ALTER COLUMN id SET DEFAULT nextval('public.student_course_progress_id_seq'::regclass);


--
-- Name: student_opportunities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_opportunities ALTER COLUMN id SET DEFAULT nextval('public.student_opportunities_id_seq'::regclass);


--
-- Name: student_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles ALTER COLUMN id SET DEFAULT nextval('public.student_profiles_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Data for Name: academic_pathways; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.academic_pathways (id, student_id, pathway_data, target_college, overall_progress, last_updated, created_at) FROM stdin;
1	1	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	MIT	0.00	2025-06-29 20:12:43.82073	2025-06-29 20:12:43.82073
2	2	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Princeton University	0.00	2025-06-30 00:41:08.755049	2025-06-30 00:41:08.755049
3	3	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-07-08 19:06:05.681991	2025-07-08 19:06:05.681991
4	4	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Georgia Technology	0.00	2025-07-10 02:38:25.245888	2025-07-10 02:38:25.245888
5	5	{"grade9": [{"title": "Honors Geometry", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Complete with a strong understanding to build a foundation for advanced math courses."}, {"title": "Honors Chemistry", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Develop a solid understanding of chemical principles."}, {"title": "Science Club", "status": "in_progress", "category": "extracurricular", "priority": "medium", "timeline": "Fall and Spring", "description": "Join the Science Club to engage in STEM activities and projects."}, {"title": "Math Olympiad", "status": "not_started", "category": "competition", "priority": "medium", "timeline": "Spring", "description": "Participate in Math Olympiad to enhance problem-solving skills."}, {"title": "Volunteer at Local Science Museum", "status": "not_started", "category": "volunteer", "priority": "low", "timeline": "Summer", "description": "Assist with educational programs to gain experience in science communication."}, {"title": "SAT/ACT Familiarization", "status": "not_started", "category": "test_prep", "priority": "low", "timeline": "Spring", "description": "Begin familiarizing with SAT/ACT formats and question types."}], "grade10": [{"title": "AP Calculus AB", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Advance in calculus to prepare for higher-level math courses."}, {"title": "AP Biology", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Gain in-depth knowledge of biological sciences."}, {"title": "Engineering Club", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall and Spring", "description": "Join to explore engineering concepts and projects."}, {"title": "Science Fair", "status": "not_started", "category": "competition", "priority": "high", "timeline": "Spring", "description": "Participate in a science fair with a project related to astronomy."}, {"title": "Internship at Local Observatory", "status": "not_started", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Gain hands-on experience in astronomy during the summer."}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Summer", "description": "Prepare for the PSAT to qualify for National Merit Scholarships."}], "grade11": [{"title": "AP Physics C", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Study advanced physics to prepare for college-level courses."}, {"title": "AP Environmental Science", "status": "not_started", "category": "academic", "priority": "medium", "timeline": "Fall and Spring", "description": "Explore environmental science and its applications."}, {"title": "Leadership Role in Science Club", "status": "not_started", "category": "extracurricular", "priority": "high", "timeline": "Fall and Spring", "description": "Take on a leadership role to develop leadership skills."}, {"title": "Intel Science and Engineering Fair", "status": "not_started", "category": "competition", "priority": "high", "timeline": "Spring", "description": "Submit a research project in astronomy or a related field."}, {"title": "Research Assistantship", "status": "not_started", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Work as a research assistant in a university lab."}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall and Spring", "description": "Intensive preparation for SAT/ACT exams."}], "grade12": [{"title": "AP Computer Science", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Learn programming and computer science principles."}, {"title": "AP Psychology", "status": "not_started", "category": "academic", "priority": "medium", "timeline": "Fall and Spring", "description": "Study psychological theories and their applications."}, {"title": "Entrepreneurship Club", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall and Spring", "description": "Engage in business and entrepreneurship activities."}, {"title": "College Application Preparation", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Prepare and submit college applications, focusing on MIT."}, {"title": "Volunteer Tutoring", "status": "not_started", "category": "volunteer", "priority": "low", "timeline": "Fall and Spring", "description": "Provide tutoring in math and science to younger students."}, {"title": "Attend Astronomy Conferences", "status": "not_started", "category": "summer", "priority": "medium", "timeline": "Summer", "description": "Attend conferences to network and learn from experts."}]}	MIT	0.00	2025-07-18 20:24:48.817855	2025-07-18 20:24:48.817855
6	6	{"grade9": [{"title": "Introduction to Computer Science", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Enroll in an introductory computer science course to build foundational knowledge."}, {"title": "Join Robotics Club", "status": "completed", "category": "extracurricular", "priority": "high", "timeline": "Fall", "description": "Participate in the school's robotics club to gain hands-on experience in engineering and teamwork."}, {"title": "Participate in Science Fair", "status": "completed", "category": "competition", "priority": "medium", "timeline": "Spring", "description": "Enter a project in the school science fair to develop research and presentation skills."}, {"title": "Volunteer at Local Library", "status": "completed", "category": "volunteer", "priority": "medium", "timeline": "Summer", "description": "Assist with technology workshops at the library to develop communication skills and community involvement."}, {"title": "Summer Coding Camp", "status": "completed", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Attend a summer camp focused on coding to enhance programming skills."}], "grade10": [{"title": "AP Computer Science Principles", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Take AP Computer Science Principles to deepen understanding of computer science concepts."}, {"title": "Math Club", "status": "in_progress", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Join the math club to improve problem-solving skills and participate in math competitions."}, {"title": "Hackathon Participation", "status": "not_started", "category": "competition", "priority": "high", "timeline": "Spring", "description": "Participate in local or online hackathons to gain practical experience in coding and teamwork."}, {"title": "SAT/ACT Prep Course", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Summer", "description": "Begin preparation for SAT/ACT exams to improve test-taking strategies and scores."}, {"title": "Internship at Tech Company", "status": "not_started", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Secure an internship at a local tech company to gain real-world experience in computer science."}], "grade11": [{"title": "AP Computer Science A", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Enroll in AP Computer Science A for advanced programming skills."}, {"title": "Leadership Role in Robotics Club", "status": "not_started", "category": "extracurricular", "priority": "high", "timeline": "Fall", "description": "Take on a leadership position in the robotics club to develop leadership and organizational skills."}, {"title": "Cybersecurity Competition", "status": "not_started", "category": "competition", "priority": "high", "timeline": "Spring", "description": "Participate in cybersecurity competitions such as CyberPatriot to gain experience in ethical hacking."}, {"title": "Research Project in Computer Science", "status": "not_started", "category": "academic", "priority": "medium", "timeline": "Spring", "description": "Conduct an independent research project in computer science to explore specific interests."}, {"title": "College Visits and Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Summer", "description": "Visit potential colleges and begin preparing application materials."}], "grade12": [{"title": "AP Physics C", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Take AP Physics C to strengthen engineering and analytical skills."}, {"title": "President of Computer Science Club", "status": "not_started", "category": "extracurricular", "priority": "high", "timeline": "Fall", "description": "Lead the computer science club to demonstrate leadership and commitment to the field."}, {"title": "Final SAT/ACT Attempt", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall", "description": "Take the SAT/ACT for the final time to achieve the best possible score."}, {"title": "Capstone Project in Ethical Hacking", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Spring", "description": "Complete a capstone project focused on ethical hacking to showcase skills and interests."}, {"title": "Submit College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Finalize and submit applications to dream colleges, including Harvard."}]}	Harvard University	0.00	2025-07-22 19:13:46.068381	2025-07-22 19:13:46.068381
7	7	{"grade9": [{"title": "Honors English", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Enroll in Honors English to build strong reading and writing skills."}, {"title": "Honors Algebra I", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Take Honors Algebra I to establish a strong foundation in mathematics."}, {"title": "Introduction to Computer Science", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Enroll in an introductory computer science course to explore basic programming concepts."}, {"title": "Science Club", "status": "completed", "category": "extracurricular", "priority": "medium", "timeline": "Fall and Spring", "description": "Join the Science Club to participate in science-related activities and projects."}, {"title": "Math Olympiad", "status": "completed", "category": "competition", "priority": "medium", "timeline": "Spring", "description": "Participate in Math Olympiad to enhance problem-solving skills."}, {"title": "Community Service", "status": "completed", "category": "volunteer", "priority": "medium", "timeline": "Fall and Spring", "description": "Engage in community service projects to develop empathy and leadership skills."}, {"title": "Summer Coding Camp", "status": "completed", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Attend a summer coding camp to gain hands-on programming experience."}], "grade10": [{"title": "Honors Geometry", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Take Honors Geometry to continue building mathematical skills."}, {"title": "AP Computer Science Principles", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Enroll in AP Computer Science Principles to gain a deeper understanding of computing."}, {"title": "Debate Club", "status": "completed", "category": "extracurricular", "priority": "medium", "timeline": "Fall and Spring", "description": "Join the Debate Club to improve public speaking and critical thinking skills."}, {"title": "Science Fair", "status": "completed", "category": "competition", "priority": "medium", "timeline": "Spring", "description": "Participate in the Science Fair to showcase a research project."}, {"title": "SAT/ACT Preparation", "status": "completed", "category": "test_prep", "priority": "high", "timeline": "Spring and Summer", "description": "Begin preparation for SAT/ACT exams with practice tests and tutoring."}, {"title": "Tech Internship", "status": "completed", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Secure a summer internship at a tech company to gain industry experience."}], "grade11": [{"title": "AP English Language and Composition", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Take AP English Language to enhance analytical and writing skills."}, {"title": "AP Calculus AB", "status": "completed", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Enroll in AP Calculus AB to advance mathematical understanding."}, {"title": "Computer Science Club Leader", "status": "completed", "category": "extracurricular", "priority": "high", "timeline": "Fall and Spring", "description": "Take on a leadership role in the Computer Science Club."}, {"title": "USACO Competitions", "status": "completed", "category": "competition", "priority": "high", "timeline": "Fall and Spring", "description": "Participate in USA Computing Olympiad contests to improve coding skills."}, {"title": "SAT/ACT Testing", "status": "completed", "category": "test_prep", "priority": "high", "timeline": "Fall", "description": "Take the SAT/ACT and aim for high scores."}, {"title": "Research Project", "status": "completed", "category": "academic", "priority": "high", "timeline": "Spring", "description": "Conduct an independent research project in computer science."}, {"title": "Summer Research Program", "status": "completed", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Participate in a university-sponsored summer research program."}], "grade12": [{"title": "AP English Literature and Composition", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Take AP English Literature to further develop literary analysis skills."}, {"title": "AP Physics C", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Fall and Spring", "description": "Enroll in AP Physics C to gain a deep understanding of physics principles."}, {"title": "College Application Process", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete college applications for Harvard, Stanford, and other top schools."}, {"title": "Hackathon Participation", "status": "in_progress", "category": "competition", "priority": "medium", "timeline": "Fall and Spring", "description": "Participate in hackathons to develop and showcase programming skills."}, {"title": "Volunteer Tutoring", "status": "in_progress", "category": "volunteer", "priority": "medium", "timeline": "Fall and Spring", "description": "Volunteer as a tutor for underclassmen in math and science."}, {"title": "Final SAT/ACT Attempt", "status": "in_progress", "category": "test_prep", "priority": "medium", "timeline": "Fall", "description": "Retake SAT/ACT if necessary to improve scores."}, {"title": "Summer Internship", "status": "not_started", "category": "summer", "priority": "high", "timeline": "Summer", "description": "Secure a summer internship in a tech company or research lab."}]}	Harvard University	0.00	2025-07-30 01:25:48.576923	2025-07-30 01:25:48.576923
8	8	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-08-15 21:40:10.634382	2025-08-15 21:40:10.634382
9	9	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-22 01:22:29.071917	2025-09-22 01:22:29.071917
10	10	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-22 01:28:20.177311	2025-09-22 01:28:20.177311
11	11	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-22 01:39:30.938911	2025-09-22 01:39:30.938911
12	12	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-24 00:33:50.407332	2025-09-24 00:33:50.407332
13	13	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-24 00:38:43.871661	2025-09-24 00:38:43.871661
14	14	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-24 00:38:53.367153	2025-09-24 00:38:53.367153
15	15	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-24 00:45:27.34501	2025-09-24 00:45:27.34501
16	16	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-26 01:28:58.780789	2025-09-26 01:28:58.780789
17	17	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-09-26 01:48:37.567396	2025-09-26 01:48:37.567396
18	18	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	MIT	0.00	2025-09-28 23:14:28.85697	2025-09-28 23:14:28.85697
19	19	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	MIT	0.00	2025-10-01 00:06:45.528011	2025-10-01 00:06:45.528011
20	20	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Stanford University	0.00	2025-10-06 17:16:00.855516	2025-10-06 17:16:00.855516
21	21	{"grade9": [{"title": "Build Strong Academic Foundation", "status": "in_progress", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Focus on core subjects and maintain high GPA"}, {"title": "Join Academic Clubs", "status": "not_started", "category": "extracurricular", "priority": "medium", "timeline": "Fall", "description": "Participate in Math, Science, or relevant subject clubs"}], "grade10": [{"title": "Take First AP Course", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Enroll in AP course aligned with interests"}, {"title": "PSAT Preparation", "status": "not_started", "category": "test_prep", "priority": "medium", "timeline": "Spring", "description": "Begin standardized test preparation"}], "grade11": [{"title": "Advanced Course Load", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Take multiple AP/IB courses"}, {"title": "SAT/ACT Preparation", "status": "not_started", "category": "test_prep", "priority": "high", "timeline": "Fall/Spring", "description": "Intensive test preparation and taking"}], "grade12": [{"title": "College Applications", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Fall", "description": "Complete and submit college applications"}, {"title": "Final Transcript", "status": "not_started", "category": "academic", "priority": "high", "timeline": "Year-round", "description": "Maintain strong grades through graduation"}]}	Harvard University	0.00	2025-10-08 17:33:47.365109	2025-10-08 17:33:47.365109
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, student_id, title, description, type, category, date_achieved, organization, location, ranking, certificate_url, publication_url, skills, is_verified, verification_notes, created_at, updated_at) FROM stdin;
1	2	Azure AI		certification	academic	2025-07-02 04:00:00	Microsoft	Fort Myers, FL				[]	f		2025-07-18 20:47:43.046311	2025-07-18 20:47:43.046311
2	1	Regional science fair	1st place	competition	academic	2025-08-05 04:00:00						[]	f		2025-08-17 00:32:00.694457	2025-08-17 00:32:00.694457
3	1	Math Olympiad	1st place	competition	extracurricular	2025-07-29 04:00:00						[]	f		2025-08-17 00:38:14.008349	2025-08-17 00:38:14.008349
4	4	Valdectorian		award	academic	2025-08-05 04:00:00						[]	f		2025-08-17 17:50:02.117073	2025-08-17 17:50:02.117073
\.


--
-- Data for Name: graduation_requirements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.graduation_requirements (id, state, district, subject, course_title, credits_required, is_mandatory, grade_level, description, alternatives, created_at) FROM stdin;
1	California	General	English	English Language Arts	4.0	t	9-12	Four years of English language arts	\N	2025-08-15 16:55:03.59365
2	California	General	Mathematics	Mathematics	3.0	t	9-12	Three years of mathematics including Algebra I, Geometry, and Algebra II	\N	2025-08-15 16:55:03.59365
3	California	General	Science	Laboratory Science	3.0	t	9-12	Three years of laboratory science including Biology, Chemistry, and Physics	\N	2025-08-15 16:55:03.59365
4	California	General	Social Studies	Social Studies	3.0	t	9-12	Three years of social studies including World History, U.S. History, and Government	\N	2025-08-15 16:55:03.59365
5	California	General	Foreign Language	World Language	2.0	t	9-12	Two years of the same world language	\N	2025-08-15 16:55:03.59365
6	California	General	Visual Arts	Visual/Performing Arts	1.0	t	9-12	One year of visual or performing arts	\N	2025-08-15 16:55:03.59365
7	California	General	Physical Education	Physical Education	2.0	t	9-12	Two years of physical education	\N	2025-08-15 16:55:03.59365
8	California	General	Health	Health Education	0.5	t	9-12	One semester of health education	\N	2025-08-15 16:55:03.59365
9	California	General	Electives	College Prep Electives	1.0	t	9-12	Additional college preparatory courses	\N	2025-08-15 16:55:03.59365
10	Texas	General	English	English Language Arts	4.0	t	9-12	Four units of English Language Arts	\N	2025-08-15 17:13:23.591769
11	Texas	General	Mathematics	Mathematics	4.0	t	9-12	Four units of mathematics including Algebra II	\N	2025-08-15 17:13:23.591769
12	Texas	General	Science	Science	4.0	t	9-12	Four units of science including Biology, Chemistry, and Physics	\N	2025-08-15 17:13:23.591769
13	Texas	General	Social Studies	Social Studies	4.0	t	9-12	Four units of social studies including World History, U.S. History, and Government	\N	2025-08-15 17:13:23.591769
14	Texas	General	Foreign Language	World Language	2.0	t	9-12	Two units of the same world language	\N	2025-08-15 17:13:23.591769
15	Texas	General	Fine Arts	Fine Arts	1.0	t	9-12	One unit of fine arts	\N	2025-08-15 17:13:23.591769
16	Texas	General	Physical Education	Physical Education	1.5	t	9-12	One and half units of physical education	\N	2025-08-15 17:13:23.591769
17	Texas	General	Health	Health Education	0.5	t	9-12	Half unit of health education	\N	2025-08-15 17:13:23.591769
18	Texas	General	Speech	Speech	0.5	t	9-12	Half unit of speech	\N	2025-08-15 17:13:23.591769
19	Texas	General	Electives	Electives	5.5	t	9-12	Additional elective courses	\N	2025-08-15 17:13:23.591769
20	New York	General	English	English Language Arts	4.0	t	9-12	Four units of English Language Arts	\N	2025-08-15 17:13:23.591769
21	New York	General	Social Studies	Social Studies	4.0	t	9-12	Four units of social studies including Global History, US History	\N	2025-08-15 17:13:23.591769
22	New York	General	Mathematics	Mathematics	3.0	t	9-12	Three units of mathematics	\N	2025-08-15 17:13:23.591769
23	New York	General	Science	Science	3.0	t	9-12	Three units of science including life sciences	\N	2025-08-15 17:13:23.591769
24	New York	General	Health	Health Education	0.5	t	9-12	Half unit of health education	\N	2025-08-15 17:13:23.591769
25	New York	General	Fine Arts	Arts	1.0	t	9-12	One unit of arts (music, dance, drama, or visual arts)	\N	2025-08-15 17:13:23.591769
26	New York	General	Career/Technical	Career and Technical Education	1.0	t	9-12	One unit of career and technical education or second language	\N	2025-08-15 17:13:23.591769
27	New York	General	Physical Education	Physical Education	2.0	t	9-12	Two units of physical education	\N	2025-08-15 17:13:23.591769
28	New York	General	Electives	Electives	3.5	t	9-12	Additional elective courses	\N	2025-08-15 17:13:23.591769
\.


--
-- Data for Name: progress_tracking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.progress_tracking (id, student_id, category, score, details, recorded_at) FROM stdin;
\.


--
-- Data for Name: student_course_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_course_progress (id, student_id, requirement_id, course_name, credits_earned, grade, semester, is_completed, planned_semester, created_at) FROM stdin;
\.


--
-- Data for Name: student_opportunities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_opportunities (id, student_id, opportunity_id, status, notes, created_at) FROM stdin;
1	14	18	bookmarked	\N	2025-09-26 01:26:03.470717
2	14	18	bookmarked	\N	2025-09-26 01:26:04.327232
\.


--
-- Data for Name: student_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_profiles (id, user_id, current_grade, current_gpa, current_subjects, interested_subjects, dream_colleges, academic_interests, career_goals, extracurricular_activities, completed_aps, planned_aps, test_scores, location, school_district, is_onboarding_complete, created_at, updated_at, state) FROM stdin;
8	46472922	9	3.50	["Geometry", "Algebra I", "Pre-Calculus", "English 9", "World History"]	["Mathematics", "Foreign Languages", "Engineering", "Psychology", "Political Science", "Environmental Science"]	["Harvard University", "Stanford University", "MIT"]	["STEM Research", "Engineering", "Social Sciences"]	Astro Physics	["Student Government", "Debate Team", "Quiz Bowl", "Robotics Club"]	[]	[]	{}	Montgomery	Elmore county school	t	2025-08-15 21:40:06.601474	2025-08-15 21:40:06.601474	Alabama
1	44375828	9	4.00	["Algebra II", "Biology", "English 10", "US History", "Music", "Physical Education"]	["Mathematics", "Science", "Computer Science"]	["MIT", "Harvard University", "Stanford University", "Princeton University", "Carnegie Mellon University"]	["STEM Research", "Engineering", "Computer Science"]	Want to start my own start up company in field of AI, ML and Robotics	["Student Government", "Math Team", "Debate Team", "Quiz Bowl", "Internships", "Community Service", "Drama Club"]	[]	[]	{"act": 36, "sat": 1600, "psat": 1520}			t	2025-06-29 20:12:43.495439	2025-08-24 18:04:42.781	California
2	44413279	10	5.90	["Algebra I", "Geometry", "Calculus", "Chemistry", "Earth Science", "US History", "Government", "World History", "Physics", "Biology", "Algebra II", "Chinese", "French", "Geography"]	["Mathematics", "Engineering", "Business", "Environmental Science", "Science", "Computer Science", "Medicine", "Psychology"]	["Princeton University", "Stanford University", "Harvard University", "MIT", "California Institute of Technology"]	["STEM Research", "Engineering", "Business & Entrepreneurship", "Law", "Medical Research", "Computer Science"]	to establish my own company	[]	[]	[]	{}			t	2025-06-30 00:41:08.540402	2025-06-30 00:41:08.540402	California
3	44776989	10	4.20	["Algebra II", "Chemistry", "English 11", "World History", "Physics", "Physical Education", "Music", "Earth Science"]	["Economics", "Environmental Science", "Psychology", "Medicine", "Science"]	["Harvard University", "Stanford University", "Johns Hopkins University", "Rice University", "Cornell University"]	["STEM Research", "Medical Research", "Environmental Studies"]	To pursue my career in medicine	[]	[]	[]	{}			t	2025-07-08 19:06:05.343072	2025-07-08 19:06:05.343072	California
9	02040fea-716c-49d6-8815-b35b41ea77d0	11	\N	["Algebra I", "Biology"]	["Mathematics", "Computer Science"]	["Harvard University"]	["Computer Science"]	I aspire to study computer science and contribute to AI research, focusing on algorithms and ethical AI.	[]	[]	[]	{}	Houston	Houston ISD	t	2025-09-22 01:22:25.897874	2025-09-22 01:22:25.897874	Texas
5	44660488	9	4.95	["Geometry", "Calculus", "Chemistry", "Earth Science", "US History", "Algebra II", "Pre-Calculus", "Biology", "Physics", "Government"]	["Mathematics", "Environmental Science", "Science", "Psychology"]	["MIT"]	["STEM Research", "Engineering", "Business & Entrepreneurship", "Medical Research", "Computer Science"]	to become a sucsessful astronomer	[]	[]	[]	{}			t	2025-07-18 20:24:25.005802	2025-07-18 20:24:25.005802	California
6	45385364	10	7.50	["English 10", "Earth Science", "Chemistry", "Biology", "Physics"]	["Computer Science", "Engineering", "Business"]	["Harvard University"]	["Computer Science"]	I want to become an ethical hacker 	[]	[]	[]	{}			t	2025-07-22 19:13:14.061435	2025-07-22 19:13:14.061435	California
7	32253951	12	\N	["Calculus", "Chemistry", "World History", "Biology"]	["English/Literature", "Science", "Computer Science"]	["Harvard University", "Stanford University"]	["Computer Science"]	fsdfsdf sdfsdfsdf	[]	[]	[]	{}			t	2025-07-30 01:25:20.985509	2025-07-30 01:25:20.985509	California
10	bc343d63-7d77-479c-866a-edc3ae9b50b7	9	\N	["Algebra I", "Biology", "English 9"]	["Mathematics"]	["Harvard University"]	["STEM Research"]	I hope to study computer science and participate in research and competitions to prepare for top universities.	[]	[]	[]	{}	San Francisco	San Francisco Unified School District	t	2025-09-22 01:28:18.265923	2025-09-22 01:28:18.265923	California
11	c4d19a3b-4527-4897-8ee5-391da5e6576f	9	\N	["Algebra I", "Biology", "English 10"]	["Mathematics", "Science", "Computer Science"]	["Harvard University"]	["STEM Research"]	I plan to study computer science and pursue research.	[]	[]	[]	{}	Houston	Houston ISD	t	2025-09-22 01:39:28.323273	2025-09-22 01:39:28.323273	Texas
12	666c8a9b-be96-4f35-9a82-12ca9ee95efa	11	\N	["Algebra I", "Biology"]	["Mathematics", "Computer Science"]	["Harvard University"]	["Computer Science"]	I aspire to study computer science and contribute to AI research, focusing on algorithms and real-world applications.	[]	[]	[]	{}	Houston	Houston ISD	t	2025-09-24 00:33:43.924382	2025-09-24 00:33:43.924382	Texas
4	42373366	10	4.00	["Algebra I", "Biology", "Physics", "English 10", "Government", "Algebra II", "Pre-Calculus", "US History"]	["Mathematics", "Science", "Computer Science", "Arts", "Economics", "Engineering"]	["Georgia Technology"]	["STEM Research", "Engineering", "Business & Entrepreneurship", "Computer Science", "International Relations"]	Want to be AI engineer	["Drama Club", "Model UN", "Math Team", "Quiz Bowl", "Community Service"]	[]	[]	{}			t	2025-07-10 02:38:24.950202	2025-08-17 17:51:37.106	California
13	6d9beb8a-7c77-4ba4-8e18-01a2f2def572	11	\N	["Algebra I", "Biology"]	["Mathematics", "Computer Science"]	["Harvard University"]	["Computer Science"]	I aspire to study computer science and contribute to AI research, focusing on algorithms and real-world applications.	[]	[]	[]	{}	Houston	Houston ISD	t	2025-09-24 00:38:41.647037	2025-09-24 00:38:41.647037	Texas
16	1b24f11a-5e26-4fa7-94e2-95a5825b9b39	11	\N	["Calculus"]	["Mathematics"]	["Harvard University"]	["STEM Research"]	I aim to become a software engineer focused on AI research and educational technology.	[]	[]	[]	{}	Houston	Houston ISD	t	2025-09-26 01:28:55.991815	2025-09-26 01:28:55.991815	Texas
14	5afd26b0-fec3-49f0-b2fd-c01fc9bbe4f8	12	3.98	["Theater", "Art", "German", "Spanish", "Government", "World History"]	["Mathematics", "Science"]	["Harvard University", "MIT", "Princeton University", "Yale University", "Stanford University"]	["STEM Research", "Medical Research", "Computer Science", "Fine Arts", "Liberal Arts"]	I hope to become an aspiring biotechnologist	[]	[]	[]	{}	Miami	Miami-Dade County	t	2025-09-24 00:38:51.102691	2025-09-24 00:38:51.102691	Florida
15	48dbbef1-657f-4a09-9384-e841daf54a15	11	\N	["Algebra I", "Biology"]	["Mathematics", "Computer Science"]	["Harvard University"]	["Computer Science"]	I aspire to study computer science and contribute to AI research, focusing on algorithms and real-world applications.	[]	[]	[]	{}	Houston	Houston ISD	t	2025-09-24 00:45:24.346059	2025-09-24 00:45:24.346059	Texas
17	53ae0626-e845-442d-8078-98a3d64b0c3b	11	\N	["Algebra I"]	["Mathematics"]	["Harvard University"]	["STEM Research"]	Become a biomedical researcher focusing on cancer treatments.	["Student Government", "Debate Team"]	[]	[]	{}	Austin	Austin Independent School District	t	2025-09-26 01:48:34.748307	2025-09-26 01:57:38.723	Texas
18	7c7ef065-e4f4-49f9-90d9-50e3441a84f6	12	4.00	["Physics", "Calculus"]	["Computer Science", "Medicine"]	["MIT", "Princeton University", "Harvard University", "Stanford University", "Columbia University"]	["Medical Research", "Computer Science", "STEM Research"]	I plan to become someone proficient in computer science and medicine.	["Student Government", "Science Olympiad", "Robotics Club", "National Honor Society", "Band/Orchestra", "Computer Science Club", "Community Service"]	[]	[]	{}	Miami	Miami Dade County	t	2025-09-28 23:14:26.147458	2025-09-28 23:14:26.147458	Florida
19	9f67449d-356d-4d1f-b1e7-4387f61380db	11	4.00	["English 12", "Government", "Music", "Chinese", "French"]	["Science", "Computer Science", "Medicine"]	["MIT", "Stanford University", "Harvard University", "Yale University", "Columbia University"]	["Liberal Arts", "Computer Science", "Medical Research"]	To become a tech-oriented doctor.	["Student Government", "Science Olympiad", "Robotics Club", "National Honor Society", "Math Team", "Computer Science Club", "Community Service"]	[]	[]	{}	Miami	Miami-Dade County	t	2025-10-01 00:06:42.897228	2025-10-01 00:06:42.897228	Florida
20	b0ed21a5-0bea-4eb4-a7ab-bde2ddc89592	12	3.20	["Biology", "English 12", "Calculus", "Government"]	["Computer Science"]	["Stanford University", "Princeton University", "MIT"]	["STEM Research", "Computer Science", "Business & Entrepreneurship"]	go into cybersecurity and work to keep networks safe	["Robotics Club"]	[]	[]	{}	Fort Myers	Lee County	t	2025-10-06 17:15:56.577567	2025-10-06 17:15:56.577567	Florida
21	5e17a925-f57e-472e-b98b-384e0189d7bc	12	2.30	["Physics", "English 12"]	["Arts", "Psychology"]	["Harvard University", "Stanford University", "MIT", "Princeton University", "Yale University"]	["Fine Arts"]	Art ART ART A	[]	[]	[]	{}	North fort myers	LEE county	t	2025-10-08 17:33:44.352161	2025-10-08 17:33:44.352161	Florida
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.todos (id, student_id, title, description, due_date, priority, category, is_completed, completed_at, created_at, updated_at) FROM stdin;
6	1	Apply to Canada/USA Math Camp	Application deadline for Canada/USA Math Camp	2026-03-09 00:00:00	high	application	t	2025-08-15 21:54:49.741	2025-08-15 21:49:34.91729	2025-08-15 21:54:49.742
5	1	Apply to Intel International Science Fair	Application deadline for Intel International Science Fair	2026-01-15 00:00:00	high	application	t	2025-08-15 21:54:51.671	2025-08-15 21:49:02.0313	2025-08-15 21:54:51.671
4	1	Microsoft Image Champion ship	https://imaginecup.microsoft.com/en-US/	2025-09-10 00:00:00	high	extracurricular	t	2025-08-15 21:55:00.858	2025-07-06 02:54:51.644022	2025-08-15 21:55:00.858
3	1	SAT	SAT Eng and SAT Math	2025-09-25 00:00:00	high	test_prep	t	2025-08-15 21:55:04.642	2025-07-06 01:48:01.022065	2025-08-15 21:55:04.642
2	1	Regeneron Science Talent Search	Regeneron Science Talent Search	2025-09-10 00:00:00	high	research	t	2025-08-15 21:55:06.665	2025-07-06 01:47:14.415476	2025-08-15 21:55:06.665
1	1	Congressional App	Congressional App	2025-09-18 00:00:00	high	extracurricular	t	2025-08-15 21:55:08.591	2025-07-06 01:43:37.84929	2025-08-15 21:55:08.591
7	1	Apply to Intel International Science Fair	Application deadline for Intel International Science Fair	2026-01-15 00:00:00	high	application	f	\N	2025-08-17 00:56:32.811151	2025-08-17 00:56:32.811151
8	14	Apply to MITES Summer	Application deadline for MITES Summer	2026-02-01 00:00:00	high	application	f	\N	2025-09-26 01:25:42.722135	2025-09-26 01:25:42.722135
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at, password_hash, email_verified, verification_token, verification_token_expires, last_login_at) FROM stdin;
02040fea-716c-49d6-8815-b35b41ea77d0	complete1JbTTf@example.com	Complete	Test	\N	2025-09-22 01:19:06.836612	2025-09-22 01:19:52.015	$argon2id$v=19$m=65536,t=3,p=1$fR+3KtWxcl76gofJHPcJnQ$TPGRRjR5rIf0IaTMWIl6d9Xjhsw5iwUYXx45KbXzijc	t	\N	\N	2025-09-22 01:19:52.015
53ae0626-e845-442d-8078-98a3d64b0c3b	userW8Wuib@example.com	Test	User	\N	2025-09-26 01:43:56.721574	2025-09-26 01:44:58.532	$argon2id$v=19$m=65536,t=3,p=1$WtcFTlVlOGZmS42suUN0BQ$9zU6WH9d0Corv/1dDWRC1krWC3RQuWWFfouZbRvDrXY	t	\N	\N	2025-09-26 01:44:58.532
7c7ef065-e4f4-49f9-90d9-50e3441a84f6	antonsuryaseyan001@gmail.com	Pranav	Adurty	\N	2025-09-22 01:02:18.053166	2025-10-14 00:16:17.568	$argon2id$v=19$m=65536,t=3,p=1$z+0J8dt2rlkfPn6+yfTDoA$nAZ0sUnAPNIxhrLfu7vHLxXxL9rpR/wMcUJ0rPKxE+I	f	$argon2id$v=19$m=16384,t=2,p=1$ayrUH0XE13QoD0mSqvtGpg$JoyX4b5ox4bf0GEtJB6ufAKhBs4xaqTzRdADkEbZnuM	2025-09-23 01:02:18.02	2025-10-14 00:16:17.568
bc343d63-7d77-479c-866a-edc3ae9b50b7	final9_f9il@example.com	Final	Test	\N	2025-09-22 01:25:09.095633	2025-09-22 01:25:55.668	$argon2id$v=19$m=65536,t=3,p=1$ZnfNplmkSjx/BzO9NywZsg$AFnc7yiD9jSn9oZetCLHM8bXTHwrw66zLyKr/FyOoh8	t	\N	\N	2025-09-22 01:25:55.668
84991eb5-1977-429e-9ea6-a8ed25e6190a	finalYS6Kag@example.com	Final	Test	\N	2025-09-22 01:29:34.668454	2025-09-22 01:29:34.668454	$argon2id$v=19$m=65536,t=3,p=1$AVo9BZvFInOsL3oZKhj0yQ$pYUuPX6AqQxr9AXqYvo/lTEty+W424D/ll5SIJKnBgI	f	$argon2id$v=19$m=16384,t=2,p=1$wAdidGGCMJRLsmj0SjA53Q$Iyt0mbyaLNqfJyupE1o9HRaukIKPJsOvGsAKJn3BdEM	2025-09-23 01:29:34.632	\N
44660488	padmaja.adurty@gmail.com	padmaja	Adurty	\N	2025-07-06 01:35:23.04067	2025-07-18 20:20:42.139	\N	f	\N	\N	\N
44776989	aimstester74@gmail.com	\N	\N	\N	2025-07-08 19:03:29.553889	2025-09-24 00:53:16.238	$argon2id$v=19$m=65536,t=3,p=1$iUTkS5MruTapnY81/nOVXg$IkP80WLk2syGIACDhNXJxOmmDnez7fRK2gcMVlJvxyQ	t	\N	\N	\N
45385364	devarabhotla.murthy@gmail.com	\N	\N	\N	2025-07-22 19:10:30.14129	2025-07-22 19:10:30.14129	\N	f	\N	\N	\N
44375828	pranav.adurty@gmail.com	Pranav	Adurty	\N	2025-06-29 19:40:18.864441	2025-09-24 00:54:21.486	\N	f	$argon2id$v=19$m=16384,t=2,p=1$MSuV/dR5ELEao2s4yCeWlg$dcSucto+D0zmhZFjt/j96EoerLLr8FtE/H1Eby1AeY4	2025-09-25 00:54:21.486	\N
c4d19a3b-4527-4897-8ee5-391da5e6576f	successyGUfD-@example.com	Success	Test	\N	2025-09-22 01:35:46.428755	2025-09-22 01:37:01.927	$argon2id$v=19$m=65536,t=3,p=1$BZhF6+nkxklhMlkV6Evt6Q$TrkwSYMnu5FM57pw3P9mjUo5tAKF1epsJVvxXEPSUD0	t	\N	\N	2025-09-22 01:37:01.927
32253951	ankit.developer2004@gmail.com	\N	\N	\N	2025-07-30 01:12:08.598131	2025-07-30 01:12:08.598131	\N	f	\N	\N	\N
666c8a9b-be96-4f35-9a82-12ca9ee95efa	directMIFT7D@example.com	Direct	Login	\N	2025-09-24 00:30:43.123852	2025-09-24 00:31:08.603	$argon2id$v=19$m=65536,t=3,p=1$56mGoJH66GsX3KPKAyJJHA$3HIba0jX46RPhUeq+IR/4LalQZdzXAN08ZP7uatLOjQ	f	\N	\N	2025-09-24 00:31:08.603
6d9beb8a-7c77-4ba4-8e18-01a2f2def572	directIRfJpa@example.com	Direct	Login	\N	2025-09-24 00:36:10.566073	2025-09-24 00:36:34.424	$argon2id$v=19$m=65536,t=3,p=1$p82zS0on5+GrL5iTGeNAUQ$1x+ajIZ4eWD0o+R3y8zFN5bCACuW3iFb0c1iHHruMT0	f	\N	\N	2025-09-24 00:36:34.424
5afd26b0-fec3-49f0-b2fd-c01fc9bbe4f8	padma.adurty@gmail.com	Kishore	Adurty	\N	2025-09-24 00:36:41.744092	2025-10-02 00:35:00.861	$argon2id$v=19$m=65536,t=3,p=1$6JRGk+hJsCeR7dj9sCTy2A$38JiswFbfTOryGzT2IN6l9sUQ97tUUe3ljZsMyc10I8	f	\N	\N	2025-10-02 00:35:00.861
48dbbef1-657f-4a09-9384-e841daf54a15	directXg8ahO@example.com	Direct	Login	\N	2025-09-24 00:40:32.801624	2025-09-24 00:40:54.993	$argon2id$v=19$m=65536,t=3,p=1$oPyUMGQKFozEqjb7w+3RZA$Htqiur1eBgXIwUL3ATkpe6cL+1OL/bQc7AIRMbozPzQ	f	\N	\N	2025-09-24 00:40:54.993
9ffedb9b-79be-423f-8f55-0b530c222dfb	2tqiQg@example.com	John	Doe	\N	2025-09-28 23:36:00.217962	2025-09-28 23:37:05.081	$argon2id$v=19$m=65536,t=3,p=1$8TSm68LT60KDUUU4NCFIxA$+C5kh4vc1b2zQuGcnF/TXy8GkX/sg8lNve623+bVCcU	t	\N	\N	2025-09-28 23:37:05.081
9f67449d-356d-4d1f-b1e7-4387f61380db	randEmail@gmail.com	K	A	\N	2025-10-01 00:04:52.493928	2025-10-01 00:05:01.154	$argon2id$v=19$m=65536,t=3,p=1$X+zhutVujqmIkFYysWhygA$l9FxGYQcQPLNPH8K1HJkajBNKinh6bsleZNGH5NYIqw	t	\N	\N	2025-10-01 00:05:01.154
46472922	murthymama62@gmail.com	\N	\N	\N	2025-08-15 21:35:07.092249	2025-09-24 01:08:19.758	$argon2id$v=19$m=65536,t=3,p=1$ggM5VywTWtPmXsLFBZ2vtQ$9oe/TyU9xIkSYhdrfT7xwsO1D+vFfpnemyPu8FXReL8	t	\N	\N	\N
1b24f11a-5e26-4fa7-94e2-95a5825b9b39	test-vL83uU@aims.test	Test	User	\N	2025-09-26 01:24:28.005637	2025-09-26 01:30:04.198	$argon2id$v=19$m=65536,t=3,p=1$UhKuU7N01iT8DCm9rt8n+A$I9yTtWwe94w4sVv+TpIsNtZsZJHL1AKT4D+l/egNQZ8	t	\N	\N	2025-09-26 01:24:54.185
42373366	akishore78@gmail.com	Pranav	Adurty	\N	2025-07-10 02:36:27.021067	2025-08-17 19:06:24.731	\N	f	\N	\N	\N
b0ed21a5-0bea-4eb4-a7ab-bde2ddc89592	ticklepickle@gmail.com	joe	goob	\N	2025-10-06 17:11:33.26975	2025-10-06 17:11:45.559	$argon2id$v=19$m=65536,t=3,p=1$7ZFTDTFyYidwjBLoTzjc/Q$z2fYurMPcgBFz41QLgxwBDkgvG/gO0KFytTAJSD4mIc	t	\N	\N	2025-10-06 17:11:45.559
5e17a925-f57e-472e-b98b-384e0189d7bc	BrandoGuardado123@gmail.com	brando	Guardado	\N	2025-10-08 17:30:04.775471	2025-10-08 17:30:38.867	$argon2id$v=19$m=65536,t=3,p=1$bA2vg51OxTMyyH10aZyOSg$IXRpY04Z+7fO0LD21nnHrdHqmNRGVlyA2OhJzHyLqC4	t	\N	\N	2025-10-08 17:30:38.867
f95c10b2-1364-400f-867d-cdfcaa9b1346	pranav.ad@gmail.com	Pranav	d	\N	2025-10-01 00:51:22.652304	2025-10-01 00:51:50.706	$argon2id$v=19$m=65536,t=3,p=1$OT4ajPabS7fzYs0GJPuKmQ$ipf15iDR83PKUiWBur9LghT+mbYnqESvNpU9zZTtcVM	t	\N	\N	2025-10-01 00:51:50.706
18311c6b-67ed-48fd-bdb7-a1412783d2cc	blogb390@gmail.com	Ankit	Kumar	\N	2025-10-01 00:53:49.554166	2025-10-01 00:53:59.806	$argon2id$v=19$m=65536,t=3,p=1$vhnH/hnKpAHPSHc61Y28Uw$rKsvHjRLMmC4rMEnzzhvk3JA+76aTAWg5UhT1As+qx4	t	\N	\N	2025-10-01 00:53:59.806
44413279	aryan.adurty@gmail.com	aryan	adurty	\N	2025-06-30 00:38:36.349473	2025-08-30 18:53:22.884	\N	f	\N	\N	\N
f48cf208-0707-4e07-a240-8bd05b05ec34	test@example.com	Test	User	\N	2025-09-22 00:47:07.846256	2025-09-22 00:47:07.846256	$argon2id$v=19$m=65536,t=3,p=1$uzaup+gl9lwmIWuQRLjQBA$1ly+og+UEXCymbb6UdPYeJ896GKwe1+IUfT3/tptlgM	f	$argon2id$v=19$m=16384,t=2,p=1$3qqeYrZUS6KBf4m0FOrEHw$zdq6lbNeHqQFeA5vNVofrKtW+bZtNLtEutoFJQ0uCyY	2025-09-23 00:47:07.813	\N
46d3af72-4d47-406c-8fdf-3ad24445b841	testuserlGgxwl@example.com	Test	User	\N	2025-09-22 01:10:43.699692	2025-09-22 01:10:43.699692	$argon2id$v=19$m=65536,t=3,p=1$shcDT2OboYcNZxedALnegA$ryFdwJUUBDjCx4Du7XYYYot/6sVkWz6XzRm+U70S+qc	f	$argon2id$v=19$m=16384,t=2,p=1$USW6eJ21LqX0QsH5kfk2vQ$idiuHp5yCC67ZOQ3SeV4MhGTsbjLVs3GLImTmto4sa8	2025-09-23 01:10:43.664	\N
4b7b8782-ea95-49de-8962-2bd1d2fec744	bugfixxGJD3o@example.com	Bug	Fix	\N	2025-09-22 01:15:51.078106	2025-09-22 01:16:36.772	$argon2id$v=19$m=65536,t=3,p=1$Aoedj5z6Gmbw+Qx39FnXbg$Pd03MbqdP4QtT0s+hgm9nM5/7DE/ejc3nawLwEdUlcE	t	\N	\N	2025-09-22 01:16:36.772
\.


--
-- Name: academic_pathways_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.academic_pathways_id_seq', 21, true);


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.achievements_id_seq', 4, true);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 136, true);


--
-- Name: graduation_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.graduation_requirements_id_seq', 28, true);


--
-- Name: opportunities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.opportunities_id_seq', 42, true);


--
-- Name: progress_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.progress_tracking_id_seq', 1, false);


--
-- Name: student_course_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_course_progress_id_seq', 1, false);


--
-- Name: student_opportunities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_opportunities_id_seq', 2, true);


--
-- Name: student_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_profiles_id_seq', 21, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.todos_id_seq', 8, true);


--
-- Name: academic_pathways academic_pathways_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_pathways
    ADD CONSTRAINT academic_pathways_pkey PRIMARY KEY (id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: graduation_requirements graduation_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graduation_requirements
    ADD CONSTRAINT graduation_requirements_pkey PRIMARY KEY (id);


--
-- Name: progress_tracking progress_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_tracking
    ADD CONSTRAINT progress_tracking_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: student_course_progress student_course_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_course_progress
    ADD CONSTRAINT student_course_progress_pkey PRIMARY KEY (id);


--
-- Name: student_opportunities student_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_opportunities
    ADD CONSTRAINT student_opportunities_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: academic_pathways academic_pathways_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_pathways
    ADD CONSTRAINT academic_pathways_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- Name: achievements achievements_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- Name: chat_messages chat_messages_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- Name: progress_tracking progress_tracking_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_tracking
    ADD CONSTRAINT progress_tracking_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- Name: student_course_progress student_course_progress_requirement_id_graduation_requirements_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_course_progress
    ADD CONSTRAINT student_course_progress_requirement_id_graduation_requirements_ FOREIGN KEY (requirement_id) REFERENCES public.graduation_requirements(id);


--
-- Name: student_course_progress student_course_progress_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_course_progress
    ADD CONSTRAINT student_course_progress_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- Name: student_opportunities student_opportunities_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_opportunities
    ADD CONSTRAINT student_opportunities_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- Name: student_profiles student_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: todos todos_student_id_student_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_student_id_student_profiles_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profiles(id);


--
-- PostgreSQL database dump complete
--


-- Insert opportunities data (fixed formatting)
-- Delete and recreate opportunities with proper formatting
DELETE FROM opportunities;

INSERT INTO opportunities (id, title, description, category, eligible_grades, subjects, deadline, application_url, is_team_based, location, is_paid, difficulty_level, tags, created_at, updated_at) VALUES
(1, 'NASA Human Rover Competition', 'Perfect for students interested in STEM and engineering. Design and build a human-powered rover to navigate challenging terrain.', 'competition', '[9, 10, 11, 12]', '["Engineering", "Physics", "Mathematics"]', '2025-12-15 00:00:00', 'https://www.nasa.gov/learning/students/', true, 'National', false, 'intermediate', '["STEM", "Engineering", "NASA", "Competition"]', '2025-07-06 02:03:28.508313', '2025-07-06 02:03:28.508313'),
(2, 'Congressional App Challenge', 'Create an app that helps solve problems in your community. Open to all high school students.', 'competition', '[9, 10, 11, 12]', '["Computer Science", "Programming"]', '2025-11-01 00:00:00', 'https://www.congressionalappchallenge.us/', false, 'National', false, 'beginner', '["Programming", "App Development", "Congressional"]', '2025-07-06 02:03:28.634215', '2025-07-06 02:03:28.634215'),
(3, 'Local Hospital Internship', 'Summer volunteer opportunity at Texas Children''s Hospital. Gain hands-on experience in healthcare.', 'internship', '[10, 11, 12]', '["Biology", "Medicine", "Health Sciences"]', '2026-01-15 00:00:00', 'https://www.texaschildrens.org/volunteers', false, 'Houston, TX', false, 'beginner', '["Healthcare", "Medical", "Volunteering", "Local"]', '2025-07-06 02:03:28.751646', '2025-07-06 02:03:28.751646'),
(4, 'Science Olympiad', 'National competition covering various science topics from biology to engineering.', 'competition', '[9, 10, 11, 12]', '["Biology", "Chemistry", "Physics", "Engineering"]', '2025-10-30 00:00:00', 'https://www.soinc.org/', true, 'National', false, 'intermediate', '["Science", "Competition", "Team"]', '2025-07-06 02:03:28.867088', '2025-07-06 02:03:28.867088'),
(5, 'Math Olympiad (AMC)', 'American Mathematics Competitions - the first step towards International Mathematical Olympiad.', 'competition', '[9, 10, 11, 12]', '["Mathematics"]', '2025-11-15 00:00:00', 'https://www.maa.org/math-competitions', false, 'National', false, 'advanced', '["Mathematics", "Competition", "AMC"]', '2025-07-06 02:03:28.983023', '2025-07-06 02:03:28.983023'),
(6, 'Google Code-in for Students', 'Participate in open source projects and contribute to real software development. Great for building your portfolio.', 'internship', '[9, 10, 11, 12]', '["Computer Science", "Programming"]', '2026-02-28 00:00:00', 'https://codein.withgoogle.com/', false, 'Global', true, 'intermediate', '["Programming", "Open Source", "Google"]', '2025-07-06 02:03:29.100247', '2025-07-06 02:03:29.100247'),
(12, 'Regeneron Science Talent Search', 'Most prestigious science and math competition for high school seniors in the United States.', 'competition', '[12]', '["Biology", "Chemistry", "Physics", "Mathematics", "Engineering"]', '2025-11-15 00:00:00', 'https://www.societyforscience.org/regeneron-sts/', false, 'National', false, 'advanced', '["Science", "Research", "Regeneron", "Prestigious"]', '2025-07-06 02:03:29.807269', '2025-07-06 02:03:29.807269');
