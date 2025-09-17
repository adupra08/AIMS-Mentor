-- AIMS Database Seed Data
-- Comprehensive sample data for all tables
-- Run this after creating the database schema

-- =====================================================
-- 1. USERS TABLE (Sample Users)
-- =====================================================
INSERT INTO users (id, email, first_name, last_name, profile_image_url) VALUES
('user_001', 'sarah.chen@email.com', 'Sarah', 'Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b784?w=150'),
('user_002', 'marcus.johnson@email.com', 'Marcus', 'Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('user_003', 'elena.rodriguez@email.com', 'Elena', 'Rodriguez', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
('user_004', 'david.kim@email.com', 'David', 'Kim', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('user_005', 'amara.patel@email.com', 'Amara', 'Patel', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('user_006', 'james.wilson@email.com', 'James', 'Wilson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('user_007', 'sophia.anderson@email.com', 'Sophia', 'Anderson', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150'),
('user_008', 'alex.thompson@email.com', 'Alex', 'Thompson', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150');

-- =====================================================
-- 2. STUDENT PROFILES TABLE (Detailed Student Data)
-- =====================================================
INSERT INTO student_profiles (
    user_id, current_grade, current_gpa, current_subjects, interested_subjects, 
    dream_colleges, academic_interests, career_goals, extracurricular_activities,
    completed_aps, planned_aps, test_scores, state, location, school_district, 
    is_onboarding_complete
) VALUES
('user_001', 11, 3.85, 
 '["AP Chemistry", "AP Calculus BC", "AP English Language", "AP US History", "Spanish III", "Physics Honors"]',
 '["Computer Science", "Mathematics", "Chemistry", "Physics"]',
 '["MIT", "Stanford", "UC Berkeley", "Caltech"]',
 '["STEM", "Research", "Technology"]',
 'Aspiring to become a biomedical engineer and contribute to medical device innovation',
 '["Science Olympiad", "Math Team", "Robotics Club", "Volunteer Tutoring", "Hospital Volunteer"]',
 '["AP Biology"]',
 '["AP Physics C", "AP Computer Science A"]',
 '{"sat": {"score": 1480, "math": 780, "reading": 700}, "psat": {"score": 1420}}',
 'California', 'San Jose', 'San Jose Unified', true),

('user_002', 10, 3.92, 
 '["AP World History", "Honors English", "Algebra II", "Chemistry", "Spanish II", "Art I"]',
 '["History", "Political Science", "Law", "Public Policy"]',
 '["Harvard", "Yale", "Georgetown", "Columbia"]',
 '["Humanities", "Social Justice", "Leadership"]',
 'Passionate about civil rights law and social justice advocacy',
 '["Debate Team", "Model UN", "Student Government", "Community Service", "Youth Court"]',
 '[]',
 '["AP US History", "AP Government", "AP English Literature"]',
 '{"psat": {"score": 1380}}',
 'Texas', 'Austin', 'Austin ISD', true),

('user_003', 12, 4.0, 
 '["AP Literature", "AP Statistics", "AP Environmental Science", "AP Spanish", "Economics", "Art III"]',
 '["Environmental Science", "Biology", "Sustainability", "Policy"]',
 '["UC Davis", "UC Santa Barbara", "Colorado State", "University of Washington"]',
 '["Environmental Studies", "Conservation", "Research"]',
 'Dedicated to environmental conservation and sustainable agriculture research',
 '["Environmental Club", "National Honor Society", "Peer Tutoring", "Farm Volunteer", "Green Team"]',
 '["AP Biology", "AP Chemistry"]',
 '[]',
 '{"sat": {"score": 1520, "math": 760, "reading": 760}, "act": {"score": 34}}',
 'Colorado', 'Denver', 'Denver Public Schools', true),

('user_004', 9, 3.7, 
 '["Honors Biology", "Geometry", "English I", "World Geography", "Spanish I", "Computer Applications"]',
 '["Computer Science", "Engineering", "Mathematics", "Technology"]',
 '["Carnegie Mellon", "Georgia Tech", "UIUC", "Purdue"]',
 '["Technology", "Innovation", "Programming"]',
 'Interested in software engineering and artificial intelligence development',
 '["Coding Club", "Gaming Club", "Math Olympiad", "Science Fair"]',
 '[]',
 '["AP Computer Science Principles", "AP Calculus AB", "AP Physics 1"]',
 '{}',
 'Illinois', 'Chicago', 'Chicago Public Schools', true),

('user_005', 11, 3.95, 
 '["AP Psychology", "AP Calculus AB", "AP English Language", "Chemistry Honors", "French III", "Anatomy & Physiology"]',
 '["Psychology", "Medicine", "Neuroscience", "Biology"]',
 '["Johns Hopkins", "Northwestern", "Duke", "Vanderbilt"]',
 '["Healthcare", "Mental Health", "Research"]',
 'Aspiring psychiatrist focused on adolescent mental health and therapy',
 '["Key Club", "Pre-Med Club", "Peer Counseling", "Hospital Volunteer", "Mental Health Awareness"]',
 '["AP Biology"]',
 '["AP Statistics", "AP Physics 1"]',
 '{"sat": {"score": 1450, "math": 720, "reading": 730}, "psat": {"score": 1400}}',
 'North Carolina', 'Charlotte', 'Charlotte-Mecklenburg', true),

('user_006', 10, 3.6, 
 '["AP Human Geography", "Algebra II", "English II", "Biology", "Spanish II", "Digital Media"]',
 '["Business", "Entrepreneurship", "Marketing", "Economics"]',
 '["Wharton", "NYU Stern", "UT Austin", "Indiana Kelley"]',
 '["Business", "Innovation", "Leadership"]',
 'Entrepreneur interested in sustainable business practices and social impact',
 '["Business Club", "DECA", "Young Entrepreneurs", "Community Service", "Soccer Team"]',
 '[]',
 '["AP Economics", "AP Statistics", "AP Calculus AB"]',
 '{"psat": {"score": 1320}}',
 'New York', 'New York City', 'NYC Department of Education', true),

('user_007', 12, 3.88, 
 '["AP Art History", "AP Calculus BC", "AP French", "AP Physics 1", "English IV", "Studio Art"]',
 '["Art", "Architecture", "Design", "History"]',
 '["RISD", "Parsons", "Art Center", "UCLA"]',
 '["Visual Arts", "Design", "Architecture"]',
 'Passionate about sustainable architecture and urban design',
 '["Art Club", "National Art Honor Society", "Architecture Mentorship", "Museum Volunteer", "Design Competition"]',
 '["AP Studio Art", "AP European History"]',
 '[]',
 '{"sat": {"score": 1510, "math": 750, "reading": 760}, "act": {"score": 33}}',
 'Washington', 'Seattle', 'Seattle Public Schools', true),

('user_008', 9, 3.8, 
 '["Honors English", "Algebra I", "Earth Science", "World History", "Spanish I", "Health/PE"]',
 '["Medicine", "Biology", "Chemistry", "Health Sciences"]',
 '["Pre-Med Track", "State University", "Medical School"]',
 '["Healthcare", "Service", "Science"]',
 'Future doctor interested in pediatric medicine and global health',
 '["Future Medical Professionals", "Science Club", "Red Cross Club", "Volunteer EMT Training"]',
 '[]',
 '["AP Biology", "AP Chemistry", "AP Psychology"]',
 '{}',
 'Florida', 'Miami', 'Miami-Dade County', true);

-- =====================================================
-- 3. OPPORTUNITIES TABLE (Academic & Extracurricular)
-- =====================================================
INSERT INTO opportunities (
    title, description, category, eligible_grades, subjects, deadline, 
    application_url, is_team_based, location, is_paid, difficulty_level, tags
) VALUES
('Intel International Science and Engineering Fair (ISEF)', 
 'The world''s largest international pre-college science competition, providing opportunities for students to showcase original research and compete for awards and scholarships.',
 'Competition', '[9, 10, 11, 12]', '["Science", "Engineering", "Mathematics"]', 
 '2025-01-15T23:59:59Z', 'https://www.societyforscience.org/isef/', false, 'Global', true, 'Advanced',
 '["STEM", "Research", "International", "Prestigious", "Scholarships"]'),

('Harvard Summer School Program', 
 'Rigorous academic program offering college-level courses to high school students, with opportunities to experience college life and earn college credit.',
 'Summer Program', '[10, 11, 12]', '["Liberal Arts", "Sciences", "Business"]', 
 '2025-03-01T23:59:59Z', 'https://www.summer.harvard.edu/', false, 'Cambridge, MA', false, 'Advanced',
 '["Summer", "College Prep", "Ivy League", "Academic"]'),

('Google Code-in', 
 'Contest introducing pre-university students to open source software development, with mentorship from Google engineers.',
 'Competition', '[10, 11, 12]', '["Computer Science", "Programming"]', 
 '2025-02-20T23:59:59Z', 'https://developers.google.com/open-source/gci/', false, 'Online', true, 'Intermediate',
 '["Technology", "Open Source", "Mentorship", "Google"]'),

('National Merit Scholarship Program', 
 'Academic competition for recognition and college undergraduate scholarships based on PSAT/NMSQT performance.',
 'Scholarship', '[11]', '["All Subjects"]', 
 '2024-10-15T23:59:59Z', 'https://www.nationalmerit.org/', false, 'National', true, 'Advanced',
 '["Scholarship", "Academic Excellence", "PSAT", "National"]'),

('NASA High School Aerospace Scholars', 
 'Program providing students with authentic NASA research experience through interactive online lessons and a residential experience.',
 'Research Program', '[11, 12]', '["Aerospace", "Engineering", "Physics"]', 
 '2025-01-31T23:59:59Z', 'https://www.nasa.gov/audience/forstudents/postsecondary/programs/', false, 'Various NASA Centers', true, 'Advanced',
 '["NASA", "Aerospace", "Research", "STEM"]'),

('Model United Nations Conference', 
 'Simulation of UN proceedings where students roleplay as delegates from different countries to debate global issues.',
 'Competition', '[9, 10, 11, 12]', '["Social Studies", "Political Science", "History"]', 
 '2025-04-10T23:59:59Z', 'https://www.nmun.org/', true, 'New York, NY', false, 'Intermediate',
 '["Debate", "International Relations", "Leadership", "Teamwork"]'),

('Congressional Art Competition', 
 'Annual nationwide high school visual art competition to recognize and encourage artistic talent and achievement.',
 'Competition', '[9, 10, 11, 12]', '["Visual Arts", "Art"]', 
 '2025-04-30T23:59:59Z', 'https://www.house.gov/educators-and-students/congressional-art-competition', false, 'National', false, 'Beginner',
 '["Art", "Visual Arts", "Recognition", "Congressional"]'),

('DECA International Career Development Conference', 
 'Premier conference for marketing, finance, hospitality and management students with competitions and career opportunities.',
 'Competition', '[9, 10, 11, 12]', '["Business", "Marketing", "Finance"]', 
 '2025-03-15T23:59:59Z', 'https://www.deca.org/icdc/', true, 'Various Cities', false, 'Intermediate',
 '["Business", "Leadership", "Marketing", "Networking"]'),

('Regional Science Bowl', 
 'Academic competition testing students'' knowledge in biology, chemistry, Earth science, physics, energy, and mathematics.',
 'Competition', '[9, 10, 11, 12]', '["Biology", "Chemistry", "Physics", "Mathematics"]', 
 '2025-02-28T23:59:59Z', 'https://science.osti.gov/wdts/nsb', true, 'Regional Centers', false, 'Advanced',
 '["STEM", "Academic Bowl", "Team Competition", "Science"]'),

('Youth Leadership Summit', 
 'Leadership development program focusing on civic engagement, community service, and personal growth.',
 'Leadership Program', '[10, 11, 12]', '["Leadership", "Civic Engagement"]', 
 '2025-06-15T23:59:59Z', 'https://example.org/youth-leadership', false, 'Washington, DC', false, 'Intermediate',
 '["Leadership", "Community Service", "Civic Engagement", "Personal Development"]'),

('MIT Research Science Institute (RSI)', 
 'Prestigious six-week summer research program where students conduct original research with mentors.',
 'Research Program', '[11, 12]', '["STEM", "Research"]', 
 '2025-01-20T23:59:59Z', 'https://www.cee.org/programs/rsi', false, 'Cambridge, MA', true, 'Advanced',
 '["MIT", "Research", "STEM", "Prestigious", "Summer"]'),

('Regional Science Talent Research Program', 
 'Independent research program where students work with professional scientists on cutting-edge research projects.',
 'Research Program', '[11, 12]', '["Biology", "Chemistry", "Physics", "Environmental Science"]', 
 '2025-02-01T23:59:59Z', 'https://example.org/science-research', false, 'Various Locations', true, 'Advanced',
 '["Research", "Science", "Mentorship", "Independent Study"]');

-- =====================================================
-- 4. GRADUATION REQUIREMENTS (Sample State Requirements)
-- =====================================================
INSERT INTO graduation_requirements (
    state, district, subject, course_title, credits_required, is_mandatory, 
    grade_level, description, alternatives
) VALUES
('California', 'San Jose Unified', 'English', 'English Language Arts', 4.0, true, '9-12', 
 'Four years of English language arts covering literature, composition, speaking, and listening', 
 '{"AP English Language", "AP English Literature", "Dual Enrollment English"}'),
 
('California', 'San Jose Unified', 'Mathematics', 'Mathematics (including Algebra II)', 3.0, true, '9-12', 
 'Three years of mathematics including Algebra II or its equivalent', 
 '{"Algebra I", "Geometry", "Algebra II", "Pre-Calculus", "AP Calculus"}'),
 
('California', 'San Jose Unified', 'Science', 'Laboratory Science', 3.0, true, '9-12', 
 'Three years of laboratory science including biology, chemistry, and physics', 
 '{"Biology", "Chemistry", "Physics", "AP Sciences", "Environmental Science"}'),
 
('Texas', 'Austin ISD', 'Social Studies', 'Social Studies', 4.0, true, '9-12', 
 'Four years of social studies including world history, US history, and government', 
 '{"World History", "US History", "Government", "AP History", "Economics"}'),
 
('Texas', 'Austin ISD', 'Foreign Language', 'World Languages', 2.0, true, '9-12', 
 'Two years of the same foreign language', 
 '{"Spanish", "French", "German", "Latin", "Mandarin"}');

-- =====================================================
-- 5. ACADEMIC PATHWAYS (AI-Generated Sample Plans)
-- =====================================================
INSERT INTO academic_pathways (student_id, pathway_data, target_college, overall_progress) VALUES
(1, '{
  "pathway_name": "Biomedical Engineering Track",
  "target_major": "Biomedical Engineering",
  "years": {
    "11": {
      "courses": ["AP Chemistry", "AP Calculus BC", "AP English Language", "AP Physics C"],
      "extracurriculars": ["Science Olympiad", "Hospital Volunteer", "Research Project"],
      "goals": ["Maintain 3.9+ GPA", "Complete research project", "Leadership role in Science Olympiad"]
    },
    "12": {
      "courses": ["AP Biology", "AP Physics C", "AP Computer Science", "Advanced Math"],
      "extracurriculars": ["Science Fair", "Medical Internship", "STEM Mentoring"],
      "goals": ["Science Fair finalist", "Published research", "Strong college applications"]
    }
  },
  "milestones": ["Complete AP Chemistry with A", "Research publication", "Science Olympiad state finals"],
  "recommended_opportunities": ["Intel ISEF", "MIT RSI", "Hospital Volunteer Program"]
}', 'MIT', 78.5),

(2, '{
  "pathway_name": "Pre-Law Social Justice Track",
  "target_major": "Political Science/Pre-Law",
  "years": {
    "10": {
      "courses": ["AP World History", "Honors English", "AP Human Geography"],
      "extracurriculars": ["Debate Team", "Model UN", "Community Service"],
      "goals": ["Debate team captain", "Model UN awards", "100+ service hours"]
    },
    "11": {
      "courses": ["AP US History", "AP Government", "AP English Literature"],
      "extracurriculars": ["Student Government President", "Youth Court", "Legal Internship"],
      "goals": ["Student body leadership", "Legal experience", "Strong test scores"]
    }
  },
  "milestones": ["Student Government President", "Legal internship completion", "National debate recognition"],
  "recommended_opportunities": ["Model UN Conference", "Youth Leadership Summit", "Congressional Internship"]
}', 'Harvard', 82.3),

(3, '{
  "pathway_name": "Environmental Science Research Track",
  "target_major": "Environmental Science",
  "years": {
    "12": {
      "courses": ["AP Environmental Science", "AP Statistics", "AP Literature"],
      "extracurriculars": ["Environmental Research", "Green Team Leader", "Policy Advocacy"],
      "goals": ["Complete thesis project", "Environmental award", "College applications"]
    }
  },
  "milestones": ["Environmental research publication", "State recognition", "University research collaboration"],
  "recommended_opportunities": ["Environmental Research Program", "Climate Change Conference", "Sustainability Competition"]
}', 'UC Davis', 91.2);

-- =====================================================
-- 6. STUDENT OPPORTUNITIES (Bookmarked/Applied)
-- =====================================================
INSERT INTO student_opportunities (student_id, opportunity_id, status, notes) VALUES
(1, 1, 'applied', 'Submitted research project on biomedical sensors'),
(1, 5, 'bookmarked', 'Interested in aerospace engineering applications'),
(1, 11, 'applied', 'Working on molecular biology research project'),
(2, 6, 'completed', 'Participated as delegate from Brazil, won Best Delegate award'),
(2, 10, 'applied', 'Applied for summer leadership position'),
(3, 12, 'applied', 'Research on sustainable agriculture practices'),
(4, 3, 'bookmarked', 'Planning to participate next year'),
(5, 11, 'bookmarked', 'Considering neuroscience research project');

-- =====================================================
-- 7. TODOS (Student Task Management)
-- =====================================================
INSERT INTO todos (
    student_id, title, description, due_date, priority, category, is_completed
) VALUES
(1, 'Complete Intel ISEF Research Paper', 'Finish writing research paper on biomedical sensor development', '2025-01-10T23:59:59Z', 'high', 'Academic', false),
(1, 'Schedule SAT Retake', 'Register for March SAT to improve math score', '2024-12-15T23:59:59Z', 'medium', 'Testing', false),
(1, 'Science Olympiad Practice', 'Prepare for regional competition in Chemistry Lab', '2024-12-20T23:59:59Z', 'medium', 'Extracurricular', false),
(2, 'Model UN Position Paper', 'Research and write position paper for upcoming conference', '2024-12-18T23:59:59Z', 'high', 'Academic', false),
(2, 'College Application Essays', 'Draft personal statement for Harvard application', '2025-01-01T23:59:59Z', 'high', 'College Prep', false),
(3, 'Environmental Research Data Collection', 'Complete field work for senior thesis project', '2024-12-22T23:59:59Z', 'high', 'Academic', false),
(3, 'College Scholarship Applications', 'Apply for environmental science scholarships', '2025-01-15T23:59:59Z', 'medium', 'Financial Aid', false),
(4, 'Learn Python Basics', 'Complete online Python course for AP Computer Science prep', '2025-02-01T23:59:59Z', 'medium', 'Academic', false),
(5, 'Hospital Volunteer Application', 'Submit application for summer volunteer program', '2025-01-20T23:59:59Z', 'medium', 'Extracurricular', false);

-- =====================================================
-- 8. CHAT MESSAGES (AI Mentor Conversations)
-- =====================================================
INSERT INTO chat_messages (student_id, message, sender, response) VALUES
(1, 'How can I improve my chances of getting into MIT for biomedical engineering?', 'student', 
 'Great question! For MIT biomedical engineering, focus on: 1) Strong STEM grades (especially in AP Chemistry, Physics, and Calculus), 2) Research experience (like your current sensor project), 3) Leadership in STEM activities, 4) Strong SAT/ACT scores (aim for 1500+ SAT), and 5) Compelling essays showing your passion for using engineering to help people. Your current path with Science Olympiad and research is excellent!'),

(2, 'What extracurriculars should I focus on for pre-law?', 'student', 
 'For pre-law, prioritize activities that develop critical thinking, communication, and leadership: 1) Debate team (you''re already doing great!), 2) Model UN, 3) Student government, 4) Volunteer work with legal aid organizations, 5) Internships at law firms or government offices. Your current involvement in debate and Model UN is perfect - try to take leadership roles and compete at national levels.'),

(3, 'I''m worried about my college applications. What should I emphasize?', 'student', 
 'Your environmental focus is a strength! Emphasize: 1) Your research experience and any publications, 2) Leadership in environmental initiatives, 3) Strong academic performance in relevant courses, 4) Passion for sustainability (show through essays), 5) Community impact of your environmental work. UC Davis values students who can contribute to their sustainability mission, so highlight how your work aligns with their programs.'),

(4, 'Should I take AP Computer Science Principles or A?', 'student', 
 'Since you''re interested in software engineering, I''d recommend starting with AP Computer Science Principles in 10th grade, then taking AP Computer Science A in 11th grade. This gives you a solid foundation before the more challenging course. However, if you''re already comfortable with programming basics, you could jump to AP CS A. What''s your current programming experience?'),

(5, 'How important are volunteer hours for medical school?', 'student', 
 'Volunteer hours are very important for pre-med! Medical schools want to see: 1) Clinical experience (hospital, clinic volunteering), 2) Community service (showing service mindset), 3) Consistent, long-term commitment (not just one-time events). Aim for 100+ hours of clinical volunteering and 50+ hours of community service by graduation. Quality matters more than quantity - choose meaningful experiences where you can make an impact and learn about healthcare.');

-- =====================================================
-- 9. PROGRESS TRACKING (Student Analytics)
-- =====================================================
INSERT INTO progress_tracking (student_id, category, score, details) VALUES
(1, 'Academic Performance', 85.2, '{"gpa": 3.85, "trend": "stable", "strong_subjects": ["Chemistry", "Mathematics"], "areas_for_improvement": ["English"]}'),
(1, 'Test Preparation', 78.5, '{"sat_score": 1480, "target_score": 1550, "areas_to_improve": ["Reading"], "next_test_date": "2025-03-01"}'),
(1, 'Extracurricular Engagement', 82.0, '{"leadership_roles": 1, "competition_participation": 3, "volunteer_hours": 45, "commitment_level": "high"}'),
(2, 'Academic Performance', 88.1, '{"gpa": 3.92, "trend": "improving", "strong_subjects": ["History", "English"], "areas_for_improvement": ["Mathematics"]}'),
(2, 'Leadership Development', 91.3, '{"leadership_positions": 2, "public_speaking": "excellent", "team_collaboration": "strong", "initiative_taking": "high"}'),
(3, 'Academic Performance', 95.0, '{"gpa": 4.0, "trend": "excellent", "strong_subjects": ["Science", "Mathematics"], "consistent_performance": true}'),
(3, 'Research Experience', 89.7, '{"projects_completed": 2, "presentations": 3, "research_skills": "advanced", "mentorship_quality": "excellent"}'),
(4, 'Academic Performance', 76.5, '{"gpa": 3.7, "trend": "stable", "strong_subjects": ["Mathematics", "Science"], "grade_appropriate": true}'),
(5, 'Academic Performance', 87.8, '{"gpa": 3.95, "trend": "improving", "strong_subjects": ["Psychology", "Biology"], "test_readiness": "good"}');

-- =====================================================
-- 10. ACHIEVEMENTS (Student Accomplishments)
-- =====================================================
INSERT INTO achievements (
    student_id, title, description, type, category, date_achieved, 
    organization, location, ranking, skills, is_verified
) VALUES
(1, 'Regional Science Olympiad Gold Medal', 'First place in Chemistry Lab event at regional competition', 
 'Competition', 'STEM', '2024-03-15T00:00:00Z', 'Science Olympiad', 'San Jose, CA', '1st Place', 
 '["Chemistry", "Laboratory Skills", "Problem Solving"]', true),

(1, 'Science Fair Regional Finalist', 'Advanced to regional finals with biomedical sensor research project', 
 'Competition', 'Research', '2024-05-10T00:00:00Z', 'Regional Science Fair', 'Bay Area, CA', 'Finalist', 
 '["Research", "Biomedical Engineering", "Data Analysis"]', true),

(2, 'Model UN Best Delegate Award', 'Outstanding performance representing Brazil in Security Council simulation', 
 'Competition', 'Leadership', '2024-04-20T00:00:00Z', 'Stanford Model UN', 'Stanford, CA', 'Best Delegate', 
 '["Public Speaking", "Diplomacy", "Research", "Leadership"]', true),

(2, 'State Debate Championship Semifinalist', 'Advanced to semifinal round in varsity policy debate', 
 'Competition', 'Academic', '2024-06-05T00:00:00Z', 'Texas Forensic Association', 'Austin, TX', 'Semifinalist', 
 '["Public Speaking", "Critical Thinking", "Research", "Argumentation"]', true),

(3, 'Environmental Science Research Publication', 'Co-authored research paper on sustainable agriculture practices', 
 'Publication', 'Research', '2024-08-15T00:00:00Z', 'Journal of Student Research', 'Online', 'Published', 
 '["Research", "Writing", "Environmental Science", "Data Analysis"]', true),

(3, 'National Honor Society President', 'Elected president of school chapter, leading 50+ members', 
 'Leadership', 'Service', '2024-09-01T00:00:00Z', 'National Honor Society', 'Denver, CO', 'President', 
 '["Leadership", "Service", "Organization", "Public Speaking"]', true),

(5, 'Psychology Research Award', 'Recognition for outstanding research in adolescent mental health', 
 'Award', 'Research', '2024-07-20T00:00:00Z', 'Regional Psychology Conference', 'Charlotte, NC', '1st Place', 
 '["Psychology", "Research", "Mental Health", "Data Analysis"]', true);

-- =====================================================
-- 11. STUDENT COURSE PROGRESS (Academic Tracking)
-- =====================================================
INSERT INTO student_course_progress (
    student_id, requirement_id, course_name, credits_earned, grade, 
    semester, is_completed, planned_semester
) VALUES
(1, 1, 'AP English Language', 1.0, 'A-', 'Fall 2024', true, NULL),
(1, 1, 'AP English Literature', 1.0, NULL, NULL, false, 'Spring 2025'),
(1, 2, 'AP Calculus BC', 1.0, 'A', 'Fall 2024', true, NULL),
(1, 3, 'AP Chemistry', 1.0, 'A', 'Fall 2024', true, NULL),
(1, 3, 'AP Physics C', 1.0, NULL, NULL, false, 'Spring 2025'),
(2, 4, 'AP World History', 1.0, 'A', 'Fall 2024', true, NULL),
(2, 4, 'AP US History', 1.0, NULL, NULL, false, 'Fall 2025'),
(2, 5, 'Spanish II', 1.0, 'B+', 'Fall 2024', true, NULL),
(2, 5, 'Spanish III', 1.0, NULL, NULL, false, 'Spring 2025'),
(3, 1, 'AP Literature', 1.0, 'A', 'Fall 2024', true, NULL),
(3, 2, 'AP Statistics', 1.0, 'A', 'Fall 2024', true, NULL),
(3, 3, 'AP Environmental Science', 1.0, 'A', 'Fall 2024', true, NULL);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'student_profiles', COUNT(*) FROM student_profiles
UNION ALL SELECT 'opportunities', COUNT(*) FROM opportunities
UNION ALL SELECT 'graduation_requirements', COUNT(*) FROM graduation_requirements
UNION ALL SELECT 'academic_pathways', COUNT(*) FROM academic_pathways
UNION ALL SELECT 'student_opportunities', COUNT(*) FROM student_opportunities
UNION ALL SELECT 'todos', COUNT(*) FROM todos
UNION ALL SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL SELECT 'progress_tracking', COUNT(*) FROM progress_tracking
UNION ALL SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL SELECT 'student_course_progress', COUNT(*) FROM student_course_progress
ORDER BY table_name;

-- =====================================================
-- END OF SEED DATA
-- =====================================================