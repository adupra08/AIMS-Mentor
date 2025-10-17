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
ALTER TABLE IF EXISTS ONLY public.opportunities DROP CONSTRAINT IF EXISTS opportunities_pkey;
ALTER TABLE IF EXISTS ONLY public.graduation_requirements DROP CONSTRAINT IF EXISTS graduation_requirements_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS achievements_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_pathways DROP CONSTRAINT IF EXISTS academic_pathways_pkey;
ALTER TABLE IF EXISTS public.todos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_profiles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_opportunities ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_course_progress ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.progress_tracking ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.opportunities ALTER COLUMN id DROP DEFAULT;
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
DROP TABLE IF EXISTS public.opportunities;
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

