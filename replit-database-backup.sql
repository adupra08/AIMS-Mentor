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
-- Name: opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opportunities (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    category character varying NOT NULL,
    eligible_grades jsonb DEFAULT '[]'::jsonb,
    subjects jsonb DEFAULT '[]'::jsonb,
    deadline timestamp without time zone,
    application_url character varying,
    is_team_based boolean DEFAULT false,
    location character varying,
    is_paid boolean DEFAULT false,
    difficulty_level character varying,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


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
-- Name: opportunities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.opportunities_id_seq OWNED BY public.opportunities.id;


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
-- Name: opportunities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunities ALTER COLUMN id SET DEFAULT nextval('public.opportunities_id_seq'::regclass);


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
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_messages (id, student_id, message, sender, response, created_at) FROM stdin;
1	1	In upcoming opportunities, can you find out any opportunities for High schoolers in NASA?	user	\N	2025-06-29 20:35:03.249423
2	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-06-29 20:35:03.491047
3	2	1+1	user	\N	2025-06-30 00:41:25.015561
4	2	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-06-30 00:41:25.166447
5	1	Hello	user	\N	2025-06-30 00:44:11.025229
6	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-06-30 00:44:11.148145
7	1	j	user	\N	2025-06-30 13:03:51.069013
8	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-06-30 13:03:51.252889
9	1	s	user	\N	2025-06-30 13:03:54.853108
10	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-06-30 13:03:54.981122
11	2	hello	user	\N	2025-07-06 01:29:12.541673
12	2	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-07-06 01:29:12.760278
13	3	hi	user	\N	2025-07-08 19:25:38.718832
14	3	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-07-08 19:25:38.96286
15	1	hello	user	\N	2025-07-17 18:34:31.167241
16	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-07-17 18:34:31.404822
17	5	hello	user	\N	2025-07-18 20:25:12.496652
18	5	Hello! It's great to hear from you. How can I assist you today with your academic journey or plans for the future? Whether you need advice on courses, extracurricular activities, or college prep, I'm here to help!	ai	\N	2025-07-18 20:25:14.189909
19	5	1 +1	user	\N	2025-07-18 20:25:35.688573
20	5	That's a classic math question! The sum of 1 + 1 is 2. If you have any more math questions or need help with something more complex, feel free to ask. I'm here to support you in your academic journey! Is there anything specific you'd like to focus on today?	ai	\N	2025-07-18 20:25:37.374509
21	5	A gas station sells regular gasoline for $2.39 per gallon and premium gasoline for $2.79 per gallon. If the gas station sold a total of 550 gallons of both types of gasoline in one day for a total of $1,344.50, how many gallons of premium gasoline were sold?	user	\N	2025-07-18 20:27:17.615098
22	5	To find out how many gallons of premium gasoline were sold, we can set up a system of equations based on the information given:\n\nLet's denote:\n- \\( x \\) as the number of gallons of regular gasoline sold\n- \\( y \\) as the number of gallons of premium gasoline sold\n\nFrom the problem, we have the following equations:\n\n1. \\( x + y = 550 \\) (since the total gallons sold is 550)\n2. \\( 2.39x + 2.79y = 1344.50 \\) (the total revenue from selling both types of gasoline)\n\nNow, let's solve this system of equations.\n\nStart with the first equation: \n\n\\[ x = 550 - y \\]\n\nSubstitute this expression for \\( x \\) into the second equation:\n\n\\[ 2.39(550 - y) + 2.79y = 1344.50 \\]\n\nDistribute \\( 2.39 \\) in the equation:\n\n\\[ 2.39 \\times 550 - 2.39y + 2.79y = 1344.50 \\]\n\nCalculate \\( 2.39 \\times 550 \\):\n\n\\[ 1314.5 - 2.39y + 2.79y = 1344.50 \\]\n\nCombine the \\( y \\)-terms:\n\n\\[ 1314.5 + 0.40y = 1344.50 \\]\n\nSubtract 1314.5 from both sides:\n\n\\[ 0.40y = 30 \\]\n\nDivide by 0.40 to solve for \\( y \\):\n\n\\[ y = \\frac{30}{0.40} = 75 \\]\n\nTherefore, 75 gallons of premium gasoline were sold. Keep reaching for the stars, and don't hesitate to tackle challenging problems like these—they'll help sharpen your problem-solving skills for a future in astronomy!	ai	\N	2025-07-18 20:27:21.122634
23	1	please add congressional app competitoin  in opportunities	user	\N	2025-07-20 22:17:55.65469
24	1	Absolutely! The Congressional App Challenge is a fantastic opportunity for you, considering your interest in computer science and technology. Here’s how it can benefit you and some steps to get started:\n\n### Why Participate?\n1. **Skill Development:** It’s a chance to apply your coding skills in a real-world project and learn new programming languages or tools.\n2. **Recognition:** Winning or even participating can help you gain recognition. The competition is held in various congressional districts, and winners are honored by their Members of Congress.\n3. **Networking:** You'll meet like-minded peers and professionals, which can be beneficial for future collaborations or mentorship.\n4. **Showcase Your Work:** You can use your project to demonstrate your skills on college applications or even as a starting point for your startup ideas.\n\n### Getting Started\n- **Research:** Visit the official [Congressional App Challenge website](https://www.congressionalappchallenge.us/) to understand the rules, deadlines, and submission requirements.\n- **Brainstorm Ideas:** Think about problems you’re passionate about solving with technology. This could be anything from an AI-driven app to help with study planning, to a game that teaches coding basics.\n- **Form a Team:** You can participate individually or as part of a team. If you prefer teamwork, gather some friends who share your interests.\n- **Plan and Develop:** Start drafting a plan and timeline for your app development. Choose the right tools and platforms you are comfortable with or want to learn.\n- **Seek Feedback:** As you develop your app, get feedback from teachers, mentors, or peers. This will help you improve and refine your project.\n\n### Additional Tips\n- **Stay Updated:** Keep an eye on the deadlines and any updates regarding the competition.\n- **Document Your Work:** Make sure to document your development process. This will be useful not only for the competition but also for your college applications.\n- **Practice Pitching:** Be prepared to present your app. Practice explaining your project clearly and succinctly, focusing on its innovation and impact.\n\nParticipating in such competitions will not only enhance your skills but also strengthen your college applications by showcasing your initiative and passion for technology. Good luck, and have fun creating something amazing!	ai	\N	2025-07-20 22:18:02.806718
25	1	Please add congressional app in relevant opportunities	user	\N	2025-07-20 22:18:41.109491
26	1	Absolutely! The Congressional App Challenge is a fantastic opportunity for you, especially given your interest in computer science and engineering. It allows high school students to showcase their coding skills and creativity by developing an app. Here's how it can be relevant and beneficial for you:\n\n1. **Skill Development**: Participating in this challenge will help you enhance your coding skills and give you practical experience in app development, which is crucial for your interest in computer science and your future startup goals.\n\n2. **Recognition and Networking**: Winning or even participating in the Congressional App Challenge can provide recognition for your work. It also opens up networking opportunities with other students and professionals in the tech field.\n\n3. **College Applications**: Having this experience on your resume can be a significant advantage when applying to your dream colleges like MIT, Stanford, and Carnegie Mellon. It shows initiative, creativity, and a strong interest in tech, aligning perfectly with your academic and career goals.\n\n4. **Project Experience**: This challenge can be a great way to work on a project that you can discuss in your college essays or interviews, demonstrating your passion and skills in STEM.\n\nTo get started, check out the Congressional App Challenge website for registration details and deadlines. Consider forming a team with classmates or working on it individually, depending on what you think will be most beneficial and enjoyable for you. Good luck, and remember to have fun with it! If you have any questions about the process or need help brainstorming app ideas, feel free to ask.	ai	\N	2025-07-20 22:18:45.468207
27	7	sdfsf	user	\N	2025-07-30 01:32:15.406771
28	7	It looks like there might have been a bit of a typo. No worries, I'm here to help! If you have any questions or need guidance on your path to Harvard or Stanford, especially with your interests in Computer Science, feel free to ask. Whether it's about preparing for college, finding competitions in Computer Science, or advice on balancing your current subjects, I'm here for you!	ai	\N	2025-07-30 01:32:18.569714
29	7	Hello, how are you?	user	\N	2025-07-30 01:32:41.912693
30	7	Hello! I'm doing great, thank you for asking. How about you? I'm excited to help you on your journey to Harvard or Stanford. What's on your mind today?	ai	\N	2025-07-30 01:32:43.553586
31	7	Ind vs eng?	user	\N	2025-07-30 01:46:30.795428
32	7	It sounds like you're referring to a cricket match between India and England! While I don't have live updates, I can definitely help you with academic advice or guidance if you have any questions related to your studies or college preparation. If you're a fan of sports, you might also consider exploring opportunities related to sports management or analytics, which can combine your interests. Let me know how I can assist you with your academic journey!	ai	\N	2025-07-30 01:46:34.444752
33	1	Can you access the internet to gather more opportunities that high-schoolers can avail?	user	\N	2025-08-01 01:16:45.428198
34	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:16:45.654728
35	1	Can you access the internet to gather more opportunities that high-schoolers can avail?	user	\N	2025-08-01 01:19:42.042747
36	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:19:42.22046
37	1	Can you access the internet to gather more opportunities that high-schoolers can avail?	user	\N	2025-08-01 01:20:28.002481
38	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:20:28.241484
39	1	Can you access the internet to gather more opportunities that high-schoolers can avail?	user	\N	2025-08-01 01:25:54.732684
40	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:25:54.99236
41	1	Can you access the internet to gather more opportunities that high-schoolers can avail?	user	\N	2025-08-01 01:48:15.489342
42	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:48:15.737005
43	1	Give me ai news	user	\N	2025-08-01 01:55:54.628504
44	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:55:54.853116
45	1	Can you access the internet to gather more opportunities that high-schoolers can avail?	user	\N	2025-08-01 01:57:04.382409
46	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 01:57:04.572946
47	1	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	user	\N	2025-08-01 02:02:49.642634
48	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-01 02:02:52.388874
49	1	hi	user	\N	2025-08-07 00:54:36.965326
50	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-07 00:54:40.209016
51	1	hi	user	\N	2025-08-07 17:50:22.154488
52	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-07 17:50:25.213979
53	1	hello	user	\N	2025-08-24 18:00:26.689572
54	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-24 18:00:30.015109
55	1	Provide me a resume	user	\N	2025-08-26 00:43:48.604868
56	1	I'm temporarily unavailable due to API limits. Please try again later.	ai	\N	2025-08-26 00:43:51.197315
57	1	How to organize my notes	user	\N	2025-08-26 00:49:31.480989
58	1	I'm temporarily unavailable due to API limits. Please try again later.	ai	\N	2025-08-26 00:49:35.121384
59	1	How do I organize my notes productively?	user	\N	2025-08-26 00:55:11.83138
60	1	I'm temporarily unavailable due to API limits. Please try again later.	ai	\N	2025-08-26 00:55:13.819965
61	1	How can I organize my notes effeciently	user	\N	2025-08-26 01:02:22.725741
62	1	That's an excellent question, Student! Efficient note organization is a cornerstone of academic success, especially as you tackle more complex subjects and aim for top universities like MIT and Harvard. Well-organized notes not only make studying easier but also deepen your understanding of the material.\n\nHere's how you can organize your notes efficiently:\n\n### **I. Choose an Effective Note-Taking Method**\n\nThe way you take notes initially heavily influences how easily you can organize them later. Consider these popular methods:\n\n*   **1. The Cornell Method:**\n    *   **How it works:** Divide your paper into three sections: a main note-taking area (6 inches deep), a smaller cue/question column on the left (2.5 inches wide), and a summary section at the bottom (2 inches deep).\n    *   **Why it's good:** Forces active processing during and after lectures. The cue column is perfect for keywords, questions, or prompts for self-testing, and the summary section helps consolidate main ideas.\n    *   **Best for:** Most subjects, particularly those with a lot of concepts and details like Biology and English.\n\n*   **2. The Outline Method:**\n    *   **How it works:** Use headings and subheadings (e.g., Roman numerals, letters, bullet points) to structure your notes hierarchically.\n    *   **Why it's good:** Organizes information logically, showing relationships between main topics and supporting details. It's quick and efficient during lectures.\n    *   **Best for:** Structured subjects like US History, Biology, and even Algebra II proofs where concepts build on each other.\n\n*   **3. Mapping/Diagramming Method:**\n    *   **How it works:** Start with a central topic and branch out with related ideas, keywords, and connections using lines, arrows, and shapes.\n    *   **Why it's good:** Visual representation helps you see relationships between concepts, making it great for brainstorming and understanding complex systems.\n    *   **Best for:** Visual learners, understanding processes in Biology, or mapping out complex engineering concepts in the future.\n\n### **II. Implement a Consistent Organization System**\n\nOnce you've taken your notes, the real organization begins. Consistency is key!\n\n*   **1. Use a Dedicated System (Physical or Digital	ai	\N	2025-08-26 01:02:28.076314
63	1	Add ap calculus bc	user	\N	2025-08-28 01:07:39.33265
64	1	That's fantastic that you're already thinking about advanced math courses like **AP Calculus BC**! It shows great ambition and a strong interest in STEM, which is perfect for your dream colleges like MIT and your career goals in AI, ML, and Robotics.\n\nHowever, AP Calculus BC is one of the most advanced high school math courses, typically taken by students in their junior or senior year after completing a rigorous sequence of prerequisites.\n\nHere's what you need to know about adding AP Calculus BC to your academic plan:\n\n### Understanding the Math Pathway\n\n1.  **Current Math Course:** You are currently taking **Algebra II** as a 9th grader. This is a great pace!\n2.  **Typical Progression:** Before AP Calculus BC, students usually complete:\n    *   **Algebra II**\n    *   **Pre-Calculus** (or an equivalent advanced math course like Honors Pre-Calculus/Trigonometry)\n    *   **AP Calculus AB** (often, but not always, a prerequisite for BC, or BC is taken as a direct, accelerated option after Pre-Calculus if the student is exceptionally strong).\n\n### Personalized Guidance for Your Path\n\nGiven your current course load and your dream colleges, here's a recommended math pathway to reach AP Calculus BC and beyond:\n\n*   **10th Grade:**\n    *   **Recommendation:** Aim for **Pre-Calculus** (ideally Honors Pre-Calculus if available and you feel ready for the challenge). This will build the essential foundation in trigonometry, functions, and advanced algebra needed for calculus.\n*   **11th Grade:**\n    *   **Option 1 (Accelerated):** If you excel in Pre-Calculus, you could potentially take **AP Calculus BC**. This is a very rigorous path, combining the content of AP Calculus AB and additional advanced topics.\n    *   **Option 2 (Standard Advanced):** Take **AP Calculus AB**. This is an excellent, challenging course that covers the first semester of college-level calculus.\n*   **12th Grade:**\n    *   **If you took AP Calculus AB in 11th grade:** You could then take **AP Calculus BC** in 12th grade, or explore other advanced math options like **AP Statistics**, **Multivariable Calculus** (if offered by your school or a local college), or **Linear Algebra**.\n    *   **If you took AP Calculus BC in 11th grade:** You would be in a fantastic position to pursue advanced math like **AP Statistics**, **Multivariable Calculus**, or **Linear Algebra**, further demonstrating your readiness for top STEM programs.\n\n### Why This Pathway is Important for Your Goals\n\n	ai	\N	2025-08-28 01:07:44.584978
65	2	hello	user	\N	2025-08-30 18:49:36.026432
66	2	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-30 18:49:39.131566
67	2	hello	user	\N	2025-08-30 18:53:03.789206
68	2	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-30 18:53:06.00011
69	2	hello	user	\N	2025-08-30 18:53:36.009428
70	2	Hello there! It's wonderful to connect with you. I'm AIMS, your Artificial Intelligence Mentor for Students, and I'm here to support you in your academic journey and personal growth.\n\nI see from your profile that you're a bright and ambitious 10th-grader with a fantastic GPA and big dreams for colleges like Princeton, Stanford, and MIT, along with a passion for STEM, entrepreneurship, and many other exciting fields. That's truly impressive!\n\nHow can I help you today? Whether you have questions about your classes, college planning, career goals, or just want to chat about something interesting, I'm here to help and offer guidance. What's on your mind?	ai	\N	2025-08-30 18:53:37.858725
71	2	hello	user	\N	2025-08-30 18:53:56.216263
72	2	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-30 18:53:58.361572
73	2	1+1	user	\N	2025-08-30 18:56:18.051202
74	2	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-08-30 18:56:19.584354
75	1	What is calculus	user	\N	2025-09-22 00:21:17.336476
76	1	I'm having trouble connecting right now. Please try again in a moment.	ai	\N	2025-09-22 00:21:20.345046
77	14	hey I am planning for a medical major. what should i do	user	\N	2025-09-24 00:39:27.463005
78	14	I apologize, but I couldn't generate a response. Please try asking your question again.	ai	\N	2025-09-24 00:39:32.353158
79	14	I am planning for a medical major. what should i do?	user	\N	2025-09-24 00:39:44.488753
80	14	I apologize, but I couldn't generate a response. Please try asking your question again.	ai	\N	2025-09-24 00:39:50.169049
81	14	hey can you help me	user	\N	2025-09-24 00:43:16.67879
82	14	Hello there! Absolutely, I'd be delighted to help you.\n\nAs AIMS, your AI mentor, I'm here to support you with anything from **academic planning** and **college preparation** to **career exploration**, **study strategies**, and even just general questions about your interests or personal growth.\n\nWhat's on your mind today? How can I assist you? Just let me know what you'd like to talk about!	ai	\N	2025-09-24 00:43:18.968424
83	14	I am planning for a medical major. How should I proceed?	user	\N	2025-09-24 00:43:44.957215
84	14	I apologize, but I couldn't generate a response. Please try asking your question again.	ai	\N	2025-09-24 00:43:59.933274
85	14	I am planning for a medical major. How should I proceed?	user	\N	2025-09-24 00:44:13.926201
86	14	That's wonderful to hear you're planning for a	ai	\N	2025-09-24 00:44:19.113235
87	14	regenerate message	user	\N	2025-09-24 00:44:32.702044
88	14	Hello there! I'm AIMS, your Artificial Intelligence Mentor for Students. I'm here to support you in your academic journey and personal growth, and I'm really excited to connect with you.\n\nI see you're a Grade 12 student with an impressive 3.98 GPA, aiming for some truly top-tier universities like Harvard, MIT, Princeton, Yale, and Stanford! That's fantastic ambition. It's also wonderful to see your diverse interests spanning STEM Research, Medical Research, Computer Science, Fine Arts, and Liberal Arts, all while aspiring to become a biotechnologist.\n\nI'm ready to help you with anything you need, whether it's:\n*   **Academic planning and coursework**\n*   **College preparation and admissions strategies**\n*   **Exploring educational opportunities and competitions**\n*   **Effective study strategies and test preparation**\n*   **Career guidance and exploration**\n*   **Extracurricular activities and personal development**\n*   **Scholarship and financial aid guidance**\n*   Or even just general questions about life, hobbies, or anything else you're curious about!\n\nMy goal is to be a supportive and encouraging presence as you navigate your senior year and prepare for your future. I'll always look for ways to connect your interests to potential academic or career paths.\n\nSo, what's on your mind today? How can I help you get started on achieving your goals? Please feel free to ask me anything!	ai	\N	2025-09-24 00:44:35.113628
89	14	I am planning for a medical major	user	\N	2025-09-24 00:44:55.048832
90	14	That's wonderful to hear! Planning for a medical major is an exciting and ambitious goal, and with your impressive 3.98 GPA and interest in STEM and medical research, you're certainly on a fantastic path. It's also great that you're thinking ahead about your career as an aspiring biotechnologist, as these fields often intertwine beautifully.\n\nLet's dive into what planning for a "medical major" typically entails, especially as you look towards highly competitive universities like Harvard, MIT, Princeton, Yale, and Stanford.\n\n### Understanding "Medical Major" and Pre-Med\n\nFirst, it's important to clarify that "medical major" isn't usually an undergraduate major itself. Instead, students interested in medicine pursue a **"pre-med track"** while majoring in a variety of subjects. This track involves completing specific prerequisite courses required for admission to medical school. Many pre-med students choose science-heavy majors, but you can technically major in anything as long as you complete those core science requirements.\n\nGiven your interest in biotechnology, this path aligns very well, as a strong foundation in biology, chemistry, and related sciences is crucial for both medical school and a career in biotech.\n\n### Recommended Undergraduate Majors and Academic Focus\n\nTo prepare for both medical school and a career in biotechnology, you'll want a strong foundation in the sciences. Here are some excellent undergraduate major options that align with your interests and goals:\n\n*   **Biology/Biological Sciences:** This is a very common choice, providing a deep understanding of life sciences, genetics, cell biology, and more.\n*   **Biochemistry:** Focuses on the chemical processes within living organisms, highly relevant for both medicine and biotechnology.\n*   **Biomedical Engineering:** A fantastic option if you're interested in applying engineering principles to solve medical and biological problems, directly linking to biotechnology.\n*   **Chemistry:**	ai	\N	2025-09-24 00:45:01.039248
91	14	What if I only took computer science and engineering, and in college i want to take a medical makor	user	\N	2025-09-24 00:55:45.498338
92	14	That's an excellent question, and it's a very common scenario for students with diverse interests! It's absolutely possible to pursue a medical major in college even if your high school coursework leaned heavily towards Computer Science and Engineering. In fact, a background in CS and Engineering can even be a unique asset in the medical field, especially given your interest in **biotechnology**!\n\nTop universities like Harvard, MIT, Princeton, Yale, and Stanford are looking for intellectually curious students who show depth, passion, and a strong academic foundation. They understand that students' interests evolve, and they appreciate seeing how different areas of study can connect.\n\nHere’s how you can navigate this path successfully:\n\n### **1. Understand College Expectations for Medical Majors**\n\nWhile your high school focus might have been CS/Engineering, colleges will want to see that you have a strong foundation or a clear plan to build one in the sciences and mathematics for a pre-med or medical-related major.\n\n*   **Core Science Prerequisites:** Most medical majors (like Biology, Chemistry, Biochemistry, Neuroscience, or even Biomedical Engineering) will require a solid background in **Biology, Chemistry, Physics, and Calculus**.\n*   **Intellectual Curiosity:** Your ability to excel in a rigorous CS/Engineering curriculum demonstrates strong analytical and problem-solving skills, which	ai	\N	2025-09-24 00:55:50.628254
93	14	thats excellent	user	\N	2025-09-26 01:27:47.250949
94	14	That's wonderful to hear! I'm so glad you feel that way.\n\nI'm here and ready to help you with anything you need as you navigate your senior year and look ahead to college. With your impressive 3.98 GPA and your dream of attending institutions like Harvard, MIT, and Stanford, you're clearly an incredibly dedicated and talented student.\n\nWhat's on your mind today? Are you thinking about:\n\n*   **College applications** and how to make yours stand out?\n*   **Exploring your STEM and medical research interests** further?\n*   **Balancing your current subjects** with your passion for math and science?\n*   **Scholarship opportunities** as you prepare for higher education?\n*   Or perhaps something else entirely?\n\nFeel free to ask me anything at all! I'm here to support you every step of the way.	ai	\N	2025-09-26 01:27:50.138488
95	17	Hello, mentor!	user	\N	2025-09-26 02:00:37.978243
96	17	Hello there, Student!\n\nIt's wonderful to hear from you. I'm AIMS, your AI mentor, and I'm really looking forward to supporting you on your academic journey and personal growth.\n\nI'm here to help with anything you might need, whether it's:\n\n*   **Academic planning** and **coursework**\n*   **College preparation** and **admissions**\n*   **Study strategies** and **test preparation**\n*   **Career exploration**\n*   **Extracurricular activities**\n*   Or even just general questions about life, hobbies, or anything else you're curious about!\n\nWhat's on your mind today? How can I help you get started? Feel free to ask me anything!	ai	\N	2025-09-26 02:00:40.622789
97	19	How can I become a doctor	user	\N	2025-10-01 00:07:13.933585
98	19	That's an incredibly inspiring and ambitious goal, Student! Becoming a doctor is a challenging yet immensely rewarding path, and with your impressive 4.0 GPA and interest in top-tier universities like MIT, Stanford, Harvard, Yale, and Columbia, you're already building a strong foundation. Your desire to become a "tech-oriented doctor" is particularly exciting, as the intersection of technology and medicine is where some of the most groundbreaking advancements are happening.\n\nLet's break down the journey to becoming a doctor into clear, manageable stages:\n\n### The Journey to Becoming a Doctor\n\nThe path to becoming a doctor in the United States typically involves several key stages after high school:\n\n1.  **Undergraduate Education (4 years):** Complete a bachelor's degree at a college or university.\n2.  **Medical School (4 years):** Earn a Doctor of Medicine (M.D.) or Doctor of Osteopathic Medicine (D.O.) degree.\n3.  **Residency Training (3-7+ years):** Specialize in a particular area of medicine.\n4.  **Fellowship (Optional, 1-3+ years):** Further specialize within a residency area.\n5.  **Licensure & Practice:** Obtain medical licensure and begin practicing.\n\n### Step-by-Step Guidance for Your Journey\n\nHere’s how you can prepare at each stage, tailored to your interests and goals:\n\n#### 1. High School Preparation (You are here!)\n\nThis is a critical time to build a strong academic record and explore your interests.\n\n*   **Academic Excellence:**\n    *   **Maintain Your GPA:** Continue to excel in all your courses. Your 4.0 GPA is outstanding and will be a significant asset for competitive college admissions.\n    *   **Rigorous Coursework:** While you're currently taking English 12, Government, Music, Chinese, and French, consider incorporating more **science and math courses** into your schedule, especially if you haven't already.\n        *   **Recommendation:** Look into Advanced Placement (AP) or International Baccalaureate (IB) courses in Biology, Chemistry, Physics, and Calculus. These will demonstrate your ability to handle college-level science and can even earn you college credit.\n        *   **For your "tech-oriented" goal:** Explore AP Computer Science A or AP Computer Science Principles, or even a local college course in programming or data science if available.\n*   **Extracurricular Activities:**\n    *   **Science & Medicine Focused:** Seek out opportunities that demonstrate your interest in medicine and research.\n        *   **Medical Research:** Look for summer research programs at local universities or hospitals. This aligns perfectly with your "Medical Research" interest and will give you invaluable experience.\n        *   **Clinical Experience:** Volunteer at a hospital, nursing home, or clinic. This shows commitment and provides exposure to patient care.\n        *   **Shadowing:** If possible, shadow doctors in different specialties to understand their daily routines. This is crucial for confirming your interest in the profession.\n    *   **Leadership & Service:** Continue participating in activities that showcase your leadership skills, teamwork, and commitment to service. These are highly valued by both college and medical school admissions committees.\n    *   **Connect to Tech:** Explore clubs like Robotics, Coding, or participate in hackathons. These can help you develop the tech skills essential for your "tech-oriented doctor" ambition.\n*   **Standardized Tests:**\n    *   **SAT/ACT:** Prepare diligently for the SAT or ACT. Strong scores are essential for admission to your dream colleges.\n    *   **AP Exams:** Aim for high scores (4s or 5s) on your AP exams, especially in science and math subjects.\n\n#### 2. Undergraduate Education (4 Years)\n\nYour choice of undergraduate institution and major is crucial.\n\n*   **College Selection:**\n    *   **Dream Colleges:** MIT, Stanford, Harvard, Yale, Columbia are all excellent choices that offer strong science programs and research opportunities. Focus on getting into one of these or similar rigorous universities.\n    *   **Pre-Med Advising:** Look for universities with robust pre-med advising services.\n*   **Major Choice:**\n    *   **Flexibility:** You don't need to major in "Pre-Med" or even a science field! Medical schools accept applicants from all majors (e.g., English, History, Music, Engineering).\n    *   **Your Interests:** Given your interests, you could major in **Computer Science, Biomedical Engineering, Biology, Chemistry, or even combine a Liberal Arts major with a strong science minor.**\n        *   **Recommendation:** A major in Computer Science with a strong focus on biological applications or a biology major with a minor in CS would be an excellent path for a "tech-oriented doctor."\n*   **Pre-Medical Coursework:** Regardless of your major, you'll need to complete specific prerequisite courses for medical school:\n    *   **Biology:** 1 year with lab\n    *   **General Chemistry:** 1 year with lab\n    *   **Organic Chemistry:** 1 year with lab (some schools accept biochemistry instead of the second semester)\n    *   **Physics:** 1 year with lab\n    *   **Math:** Calculus and/or Statistics\n    *   **English/Writing:** 1 year\n    *   **Biochemistry:** Highly recommended\n*   **Experiences During College:**\n    *   **Continue Research:** Seek out research opportunities with professors, especially in medical or computational biology labs.\n    *   **Clinical Experience:** Continue volunteering or working in clinical settings. Consider becoming a certified nursing assistant (CNA) or an EMT for more direct patient contact.\n    *   **Leadership & Service:** Maintain involvement in extracurriculars, demonstrating leadership and commitment to your community.\n    *   **Shadowing:** Continue to shadow doctors.\n    *   **MCAT Preparation:** The Medical College Admission Test (MCAT) is a standardized, multiple-choice examination designed to assess your problem solving, critical thinking, written communication, and knowledge of scientific concepts and principles. It's usually taken in your junior year of college. Start preparing early!\n\n#### 3. Medical School (4 Years)\n\nThis is where you'll gain in-depth medical knowledge and clinical skills.\n\n*   **Application Process:** Apply through AMCAS (for MD schools) or AACOMAS (for DO schools). This involves essays, letters of recommendation, and interviews.\n*   **Curriculum:** The first two years are typically classroom-based (anatomy, physiology, pharmacology, etc.), and the last two years are clinical rotations in various specialties (internal medicine, surgery, pediatrics, etc.).\n*   **Explore Specialties:** Use your rotations to explore different medical fields, including those that heavily integrate technology, such as radiology, pathology (with computational pathology), or even surgery (with robotics).\n\n#### 4. Residency Training (3-7+ Years) & Beyond\n\nAfter medical school, you'll enter residency to specialize.\n\n*   **Match Process:** You'll apply and interview for residency programs through the National Resident Matching Program (NRMP).\n*   **Specialization:** Your residency will train you in a specific medical specialty (e.g., Internal Medicine, Surgery, Pediatrics, Dermatology, Radiology, Neurology). The length varies by specialty.\n*   **Fellowship (Optional):** Many doctors pursue further sub-specialization through fellowships (e.g., Cardiology within Internal Medicine, Pediatric Oncology within Pediatrics).\n*   **Board Certification & Licensure:** After residency, you'll need to pass board certification exams and obtain a state medical license to practice independently.\n\n### Connecting to Your "Tech-Oriented Doctor" Goal\n\nThis is a fantastic niche, and you can start building this foundation now:\n\n*   **High School:** Take computer science courses, join coding clubs, or even try to develop a simple health-related app or project.\n*   **Undergraduate:**\n    *   **Major/Minor:** Consider a major in Computer Science, Biomedical Engineering, or Bioinformatics, or at least a strong minor/concentration in one of these alongside a science major.\n    *   **Research:** Seek out research opportunities that combine biology/medicine with computational methods, data science, or artificial intelligence.\n    *   **Projects:** Work on personal projects or join university teams that develop medical devices, health apps, or analyze medical data.\n*   **Medical School & Residency:**\n    *   **Electives:** Choose electives that focus on medical informatics, digital health, or specific technologies relevant to your chosen specialty.\n    *   **Research:** Continue pursuing research at the intersection of medicine and technology.\n    *   **Networking:** Connect with doctors and researchers who are pioneers in health tech.\n\nBecoming a doctor is a marathon, not a sprint, but every step is a learning opportunity. With your current drive and academic strength, you are incredibly well-positioned to achieve this dream. Keep working hard, stay curious, and continue to explore all the fascinating intersections of your interests!\n\nWhat part of this journey sounds most exciting or challenging to you right now?	ai	\N	2025-10-01 00:07:31.612736
99	14	thats great	user	\N	2025-10-01 00:54:30.093698
100	14	That's wonderful to hear! I'm really glad you feel that way.\n\nI'm here to help you with anything you need as you navigate your senior year and look ahead to college and your future career. Whether it's discussing your dream colleges like **Harvard, MIT, or Stanford**, exploring your interests in **biotechnology, STEM research, or computer science**, or even just chatting about your current subjects like **Theater and Art**, I'm ready to assist.\n\nWhat's on your mind today, Student? Is there anything specific you'd like to discuss, or perhaps a question you have about college applications, future courses, or anything else? I'm here to support you!	ai	\N	2025-10-01 00:54:32.668633
101	20	how do I get into MIT	user	\N	2025-10-06 17:16:50.596612
102	20	That's a fantastic goal, Student! MIT is an incredible institution, and aspiring to attend a place like that shows great ambition and a passion for STEM. It's definitely a challenging path, but with dedication and strategic planning, you can build a strong application.\n\nLet's break down what it takes to get into MIT and how you can strengthen your profile, especially as a Grade 12 student with your	ai	\N	2025-10-06 17:17:03.938353
103	21	hello	user	\N	2025-10-08 17:34:03.738274
104	21	Hello there! It's wonderful to hear from you.\n\nI'm AIMS, your Artificial Intelligence Mentor for Students, and I'm here to support you in your academic journey and personal growth. As a Grade 12 student, you're at a really exciting and important point in your education, especially with your passion for Fine Arts!\n\nHow can I help you today? Whether you have questions about college applications, your current subjects, future career paths in art, or anything else on your mind, please feel free to ask. I'm here to help you explore your interests and achieve your goals.	ai	\N	2025-10-08 17:34:06.740614
105	21	How do I get into Harvard	user	\N	2025-10-08 17:34:21.200868
106	21	I apologize, but I couldn't generate a response. Please try asking your question again.	ai	\N	2025-10-08 17:34:28.772232
107	21	Harvard	user	\N	2025-10-08 17:34:42.623237
108	21	That's a fantastic aspiration,	ai	\N	2025-10-08 17:34:51.117074
109	18	how do I become a doctor	user	\N	2025-10-14 00:13:58.79299
110	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:13:59.342366
111	18	hello	user	\N	2025-10-14 00:14:06.869119
112	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:14:07.202845
113	18	I want to become a doctor	user	\N	2025-10-14 00:14:51.08706
114	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:14:51.460961
115	18	hello	user	\N	2025-10-14 00:15:27.51527
116	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:15:27.663527
117	18	hello	user	\N	2025-10-14 00:15:53.403698
118	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:15:53.768709
119	18	hello	user	\N	2025-10-14 00:16:26.900512
120	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:16:27.309725
121	18	hello	user	\N	2025-10-14 00:17:01.770543
122	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:17:02.121409
123	18	how do I become a doctor	user	\N	2025-10-14 00:17:22.223717
124	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:17:22.374778
125	18	How do I become a Doctor?	user	\N	2025-10-14 00:29:22.857496
126	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:29:23.322213
127	18	How to become a doctor	user	\N	2025-10-14 00:29:38.817217
128	18	I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.	ai	\N	2025-10-14 00:29:39.159204
129	18	How to become a doctor	user	\N	2025-10-14 00:34:08.298977
130	18	I'm temporarily unavailable due to API limits. Please try again later.	ai	\N	2025-10-14 00:34:10.990451
131	18	how do I become a doctor	user	\N	2025-10-14 00:43:44.078838
132	18	I'm temporarily unavailable due to API limits. Please try again later.	ai	\N	2025-10-14 00:43:46.902591
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
-- Data for Name: opportunities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.opportunities (id, title, description, category, eligible_grades, subjects, deadline, application_url, is_team_based, location, is_paid, difficulty_level, tags, created_at, updated_at) FROM stdin;
4	Science Olympiad	National competition covering various science topics from biology to engineering.	competition	[9, 10, 11, 12]	["Biology", "Chemistry", "Physics", "Engineering"]	2025-10-30 00:00:00	https://www.soinc.org/	t	National	f	intermediate	["Science", "Competition", "Team"]	2025-07-06 02:03:28.867088	2025-07-06 02:03:28.867088
2	Congressional App Challenge	Create an app that helps solve problems in your community. Open to all high school students.	competition	[9, 10, 11, 12]	["Computer Science", "Programming"]	2025-11-01 00:00:00	https://www.congressionalappchallenge.us/	f	National	f	beginner	["Programming", "App Development", "Congressional"]	2025-07-06 02:03:28.634215	2025-07-06 02:03:28.634215
5	Math Olympiad (AMC)	American Mathematics Competitions - the first step towards International Mathematical Olympiad.	competition	[9, 10, 11, 12]	["Mathematics"]	2025-11-15 00:00:00	https://www.maa.org/math-competitions	f	National	f	advanced	["Mathematics", "Competition", "AMC"]	2025-07-06 02:03:28.983023	2025-07-06 02:03:28.983023
12	Regeneron Science Talent Search	Most prestigious science and math competition for high school seniors in the United States.	competition	[12]	["Biology", "Chemistry", "Physics", "Mathematics", "Engineering"]	2025-11-15 00:00:00	https://www.societyforscience.org/regeneron-sts/	f	National	f	advanced	["Science", "Research", "Regeneron", "Prestigious"]	2025-07-06 02:03:29.807269	2025-07-06 02:03:29.807269
3	Local Hospital Internship	Summer volunteer opportunity at Texas Children's Hospital. Gain hands-on experience in healthcare.	internship	[10, 11, 12]	["Biology", "Medicine", "Health Sciences"]	2026-01-15 00:00:00	https://www.texaschildrens.org/volunteers	f	Houston, TX	f	beginner	["Healthcare", "Medical", "Volunteering", "Local"]	2025-07-06 02:03:28.751646	2025-07-06 02:03:28.751646
6	Google Code-in for Students	Participate in open source projects and contribute to real software development. Great for building your portfolio.	internship	[9, 10, 11, 12]	["Computer Science", "Programming"]	2026-02-28 00:00:00	https://codein.withgoogle.com/	f	Global	t	intermediate	["Programming", "Open Source", "Google"]	2025-07-06 02:03:29.100247	2025-07-06 02:03:29.100247
1	NASA Human Rover Competition	Perfect for students interested in STEM and engineering. Design and build a human-powered rover to navigate challenging terrain.	competition	[9, 10, 11, 12]	["Engineering", "Physics", "Mathematics"]	2025-12-15 00:00:00	https://www.nasa.gov/learning/students/	t	National	f	intermediate	["STEM", "Engineering", "NASA", "Competition"]	2025-07-06 02:03:28.508313	2025-07-06 02:03:28.508313
7	Microsoft TEALS Program	High school computer science program bringing tech professionals into classrooms as volunteer teachers.	course	[9, 10, 11, 12]	["Computer Science", "Programming"]	2026-03-15 00:00:00	https://www.microsoft.com/en-us/teals	f	National	f	beginner	["Computer Science", "Microsoft", "Education"]	2025-07-06 02:03:29.217028	2025-07-06 02:03:29.217028
8	Intel International Science Fair	The world's largest international pre-college science competition, featuring over 1,800 students.	competition	[9, 10, 11, 12]	["Biology", "Chemistry", "Physics", "Engineering", "Mathematics"]	2026-01-15 00:00:00	https://www.societyforscience.org/isef/	f	International	f	advanced	["Science", "Research", "Intel", "International"]	2025-07-06 02:03:29.333119	2025-07-06 02:03:29.333119
9	NASA USRP Internship	Undergraduate Student Research Program offering hands-on research experience with NASA scientists.	internship	[11, 12]	["Physics", "Engineering", "Mathematics", "Computer Science"]	2026-01-31 00:00:00	https://www.nasa.gov/learning-resources/internship-programs/	f	National	t	advanced	["NASA", "Research", "Space", "STEM"]	2025-07-06 02:03:29.450413	2025-07-06 02:03:29.450413
10	Future Business Leaders of America	National competition in business skills, leadership, and career preparation for high school students.	competition	[9, 10, 11, 12]	["Business", "Economics", "Leadership"]	2026-02-15 00:00:00	https://www.fbla.org/	t	National	f	intermediate	["Business", "Leadership", "FBLA"]	2025-07-06 02:03:29.571994	2025-07-06 02:03:29.571994
11	MIT Research Science Institute	Six-week summer research program pairing high school students with MIT researchers.	program	[11, 12]	["Biology", "Chemistry", "Physics", "Engineering", "Mathematics"]	2026-01-10 00:00:00	https://www.cee.org/programs/research-science-institute	f	Cambridge, MA	f	advanced	["MIT", "Research", "Summer Program", "STEM"]	2025-07-06 02:03:29.690847	2025-07-06 02:03:29.690847
13	Program in Mathematics for Young Scientists (PROMYS)	6-week program at Boston University for high school sophomores to seniors who love math. Daily Number Theory lectures, research projects, advanced seminars, and guest lecturers.	program	[10, 11, 12]	["Mathematics"]	2026-03-05 00:00:00	https://promys.org/programs/promys/	f	Boston, MA	f	advanced	["Mathematics", "Boston University", "Research", "Summer Program"]	2025-07-06 02:25:33.914281	2025-07-06 02:25:33.914281
14	Canada/USA Math Camp	5-week program for students who find beauty in advanced mathematical ideas. Study with world-renowned researchers and passionate students from around the world.	program	[9, 10, 11, 12]	["Mathematics"]	2026-03-09 00:00:00	https://www.mathcamp.org/	f	International	f	advanced	["Mathematics", "International", "Research", "Summer Program"]	2025-07-06 02:25:34.049058	2025-07-06 02:25:34.049058
15	Summer Science Program (SSP)	5-week educational experience for high school juniors. 12 research teams work on difficult research projects in astrophysics, biochemistry, and genomics.	program	[11]	["Physics", "Biology", "Chemistry"]	2026-03-03 00:00:00	https://summerscience.org/	t	National	f	advanced	["Science", "Research", "Astrophysics", "Summer Program"]	2025-07-06 02:25:34.168055	2025-07-06 02:25:34.168055
16	Stanford University Math Summer Camp (SUMaC)	Advanced math program covering topics like group theory and real-life applications. Available online (3 weeks) or residential (4 weeks).	program	[10, 11]	["Mathematics"]	2026-02-01 00:00:00	https://spcs.stanford.edu/programs/stanford-university-mathematics-camp-sumac	f	Stanford, CA	f	advanced	["Mathematics", "Stanford", "Group Theory", "Summer Program"]	2025-07-06 02:25:34.289022	2025-07-06 02:25:34.289022
19	Research in Science & Engineering (RISE)	6-week, 40-hour program for rising seniors in STEM. Work on research projects with Boston University professors and advisors.	program	[12]	["Biology", "Chemistry", "Physics", "Engineering"]	2026-02-14 00:00:00	https://www.bu.edu/summer/high-school-programs/rise-internship-practicum/	f	Boston, MA	f	advanced	["Research", "Boston University", "Engineering", "Summer Program"]	2025-07-06 02:25:34.688786	2025-07-06 02:25:34.688786
17	High School Scientific Training and Enrichment Program (HiSTEP)	5-week full-time summer internship at NIH campus covering current health issues, basic science skills, and STEM careers. Includes $2,150 stipend.	internship	[9, 10, 11, 12]	["Biology", "Medicine", "Health Sciences"]	2026-02-01 00:00:00	https://www.training.nih.gov/histep	f	Bethesda, MD	t	intermediate	["Health Sciences", "NIH", "Paid", "Summer Program"]	2025-07-06 02:25:34.453668	2025-07-06 02:25:34.453668
18	Simons Summer Research Program	8-week prestigious program matching students with Stony Brook faculty mentors in science, math, and computer science fields. Paid fellowship.	program	[10, 11, 12]	["Biology", "Chemistry", "Physics", "Mathematics", "Computer Science"]	2026-02-07 00:00:00	https://www.stonybrook.edu/simons/	f	Stony Brook, NY	t	advanced	["Research", "Stony Brook", "Fellowship", "Summer Program"]	2025-07-06 02:25:34.57159	2025-07-06 02:25:34.57159
20	Summer Academy for Math and Science (SAMS)	Free 5-week engineering program at Carnegie Mellon with symposium. Includes math, science, seminars, and college preparation support.	program	[10, 11, 12]	["Engineering", "Mathematics"]	2026-03-09 00:00:00	https://www.cmu.edu/pre-college/academic-programs/sams.html	f	Pittsburgh, PA	f	intermediate	["Engineering", "Carnegie Mellon", "Free", "Summer Program"]	2025-07-06 02:25:34.809873	2025-07-06 02:25:34.809873
21	HOPP Summer Student Program	8-week full-time internship at Memorial Sloan Kettering Cancer Center. Conduct independent biomedical research with $1,200 stipend.	internship	[10, 11, 12]	["Biology", "Medicine", "Health Sciences"]	2026-02-07 00:00:00	https://www.mskcc.org/education-training/high-school-college/hopp-summer-student	f	New York, NY	t	advanced	["Medical Research", "Cancer Research", "Paid", "Summer Program"]	2025-07-06 02:25:34.934895	2025-07-06 02:25:34.934895
22	MITES Summer	6-week residential program at MIT for rising seniors from underrepresented communities. Seminars with STEM professionals and lab tours.	program	[12]	["Engineering", "Mathematics", "Physics", "Computer Science"]	2026-02-01 00:00:00	https://mites.mit.edu/discover-mites/mites-summer/	f	Cambridge, MA	f	advanced	["MIT", "Diversity", "Engineering", "Summer Program"]	2025-07-06 02:25:35.055727	2025-07-06 02:25:35.055727
23	Stanford Institutes of Medicine Summer Research Program (SIMR)	8-week program for Bay Area students to work with Stanford faculty on medical research. 8 research areas including immunology and neurobiology.	program	[11, 12]	["Biology", "Medicine", "Health Sciences"]	2026-02-25 00:00:00	https://simr.stanford.edu/	f	Stanford, CA	t	advanced	["Stanford", "Medical Research", "Paid", "Summer Program"]	2025-07-06 02:25:35.174898	2025-07-06 02:25:35.174898
24	Telluride Association Summer Seminar (TASS)	6-week program focused on history, politics, literature, and art. Examines how power and privilege affect social structures.	program	[10, 11, 12]	["History", "Political Science", "Literature"]	2026-01-04 00:00:00	https://www.tellurideassociation.org/our-programs/high-school-students/	f	National	f	intermediate	["Humanities", "Social Justice", "Free", "Summer Program"]	2025-07-06 02:25:35.292984	2025-07-06 02:25:35.292984
25	Bank of America Student Leaders	Leadership development program connecting high school students with nonprofits and includes a week in Washington D.C.	program	[11, 12]	["Leadership", "Business"]	2026-01-31 00:00:00	https://about.bankofamerica.com/en/making-an-impact/student-leaders	f	National	t	intermediate	["Leadership", "Non-profit", "Washington DC", "Summer Program"]	2025-07-06 02:25:35.426661	2025-07-06 02:25:35.426661
29	Bank of America Student Leaders Program	Leadership internship program focused on community service and professional development	internship	[11, 12]	["Leadership", "Business", "Community Service"]	2025-02-15 00:00:00	https://about.bankofamerica.com/en/making-an-impact/student-leaders	f	Various Cities	t	intermediate	["leadership", "internship", "community-service", "bank-of-america"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
30	Math Kangaroo Competition	International mathematics competition for students to enhance problem-solving skills	competition	[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]	["Mathematics"]	2025-03-20 00:00:00	https://www.thethinkacademy.com/math-kangaroo	f	Various Locations	f	intermediate	["mathematics", "competition", "international", "problem-solving"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
33	Society for Science Junior Investigators Challenge	Middle school science research competition focusing on innovative investigations	competition	[6, 7, 8]	["Biology", "Chemistry", "Physics", "Environmental Science"]	2025-01-31 00:00:00	https://www.societyforscience.org/jic/	f	National	f	intermediate	["science", "middle-school", "research", "investigation"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
34	University of Texas Participant Program	Current research participation opportunity at UT for high school students	research	[10, 11, 12]	["Research", "STEM", "Engineering"]	2025-01-15 00:00:00	https://apps.ideal-logic.com/utexasparticipant?new	f	Austin, TX	f	intermediate	["research", "ut-austin", "current", "stem"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
35	High School Research Program - Current Application	Active research program application for high school students	research	[9, 10, 11, 12]	["Research", "Technology", "Data Science"]	2025-01-20 00:00:00	https://airtable.com/appSOQW1KE1DvA3et/shrztnlLC2oCbORCU?prefill_Ref=Google&hide_Ref=true	f	Various	f	intermediate	["research", "technology", "current", "data-science"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
28	Think Academy AMC 10 Prep	Comprehensive preparation course for the American Mathematics Competitions 10	course	[9, 10]	["Mathematics"]	2025-02-28 00:00:00	https://www.thethinkacademy.com/amc-10	f	Online	t	intermediate	["mathematics", "competition", "amc", "preparation"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
31	Orlando Math Circle	Weekly enrichment program for mathematics education and competition preparation	course	[6, 7, 8, 9, 10, 11, 12]	["Mathematics"]	2025-04-15 00:00:00	https://www.orlandomathcircle.org/	f	Orlando, FL	f	intermediate	["mathematics", "enrichment", "weekly", "orlando"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
27	MIT PRIMES USA	Research program for high school students to conduct original mathematics research with MIT mentors	research	[10, 11, 12]	["Mathematics", "Computer Science", "Statistics"]	2025-01-15 00:00:00	https://math.mit.edu/research/highschool/primes/usa/apply-usa.html	f	Online/Remote	f	advanced	["mathematics", "research", "mit", "mentorship"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
32	Regeneron Science Talent Search	Prestigious science research competition for high school seniors	competition	[12]	["Biology", "Chemistry", "Physics", "Mathematics", "Computer Science", "Engineering"]	2025-01-31 00:00:00	https://sciencetalentsearch.smapply.org/	f	National	f	advanced	["science", "research", "competition", "regeneron", "prestigious"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
36	CEE Research Science Institute (RSI)	Highly selective summer research program for STEM-focused students	summer-program	[11, 12]	["Biology", "Chemistry", "Physics", "Mathematics", "Computer Science", "Engineering"]	2025-01-31 00:00:00	https://www.cee.org/programs/research-science-institute	f	MIT Cambridge, MA	f	advanced	["research", "summer", "mit", "prestigious", "stem"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
40	Harvard SEAS Summer Internships	Summer internship opportunities at Harvard School of Engineering and Applied Sciences	internship	[11, 12]	["Engineering", "Computer Science", "Applied Sciences", "Technology"]	2025-02-28 00:00:00	https://tech.seas.harvard.edu/summer#internships	f	Cambridge, MA	t	advanced	["harvard", "engineering", "summer", "internship", "applied-sciences"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
41	Microsoft Imagine Cup	Global technology startup competition for students to create innovative solutions	competition	[9, 10, 11, 12]	["Computer Science", "Technology", "Business", "Innovation"]	2025-03-15 00:00:00	https://imaginecup.microsoft.com/en-us/Category/33	t	Global/Online	f	intermediate	["microsoft", "startup", "technology", "competition", "innovation"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
42	Queen's Commonwealth Essay Competition 2025	International essay writing competition for young people across Commonwealth countries	competition	[9, 10, 11, 12]	["English", "Writing", "Literature", "Social Studies"]	2025-06-01 00:00:00	https://www.royalcwsociety.org/essay-competition/qcec2025	f	International	f	intermediate	["essay", "writing", "commonwealth", "international", "literature"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
26	Stanford FAST Internship Program	High school internships at Stanford University focusing on research, engineering, and technology projects	internship	[9, 10, 11, 12]	["Computer Science", "Engineering", "Research", "Technology"]	2025-03-01 00:00:00	https://fast.stanford.edu/resources/internships/	f	Stanford, CA	t	advanced	["research", "stem", "stanford", "technology"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
38	Ladder Free High School Internships	Free internship opportunities for high school students across various industries	internship	[9, 10, 11, 12]	["Business", "Technology", "Marketing", "Healthcare", "Engineering"]	2025-03-31 00:00:00	https://www.ladderinternships.com/ladder-internships-blog/free-internships-for-high-school-students	f	Various/Remote	f	beginner	["internship", "free", "various-industries", "flexible"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
37	Texas Tech Clark Scholars Program	Intensive summer research program for academically talented high school students	summer-program	[11, 12]	["Biology", "Chemistry", "Physics", "Engineering", "Computer Science"]	2025-02-15 00:00:00	https://www.depts.ttu.edu/clarkscholars/index.php	f	Lubbock, TX	t	advanced	["research", "summer", "texas-tech", "scholarship", "intensive"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
39	Research Science Institute Application	Application portal for the prestigious Research Science Institute summer program	summer-program	[11]	["Biology", "Chemistry", "Physics", "Mathematics", "Computer Science", "Engineering"]	2025-02-28 00:00:00	https://www.cee.org/programs/apply-rsi	f	MIT Cambridge, MA	f	advanced	["research", "summer", "mit", "application", "elite"]	2025-08-08 15:24:38.07055	2025-08-08 15:24:38.07055
\.


--
-- Data for Name: progress_tracking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.progress_tracking (id, student_id, category, score, details, recorded_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
uDXSThNP65A44wovGDwFCa2QiqWQMmdA	{"cookie": {"path": "/", "secure": true, "expires": "2025-10-15T17:30:38.954Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "passport": {"user": "5e17a925-f57e-472e-b98b-384e0189d7bc"}}	2025-10-15 17:34:52
12XGon13m22yjWjx-jgZtRKfziBLYCD0	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-21T00:16:17.754Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "passport": {"user": "7c7ef065-e4f4-49f9-90d9-50e3441a84f6"}}	2025-10-21 00:55:38
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

SELECT pg_catalog.setval('public.chat_messages_id_seq', 132, true);


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
-- Name: opportunities opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_pkey PRIMARY KEY (id);


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
-- Name: student_opportunities student_opportunities_opportunity_id_opportunities_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_opportunities
    ADD CONSTRAINT student_opportunities_opportunity_id_opportunities_id_fk FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id);


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

