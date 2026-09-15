-- ==============================================================================
-- V1__init_schema.sql
-- Project & Internship Tracker - Initial Relational Schema
-- Target Database: PostgreSQL 15+ (Supabase)
-- ==============================================================================

-- 1. Student Table
CREATE TABLE IF NOT EXISTS student (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    major VARCHAR(100),
    graduation_year INT,
    password_hash VARCHAR(255) NOT NULL,
    mentor_id INT
);

-- 2. Mentor Table
CREATE TABLE IF NOT EXISTS mentor (
    mentor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(50)
);

-- 3. Company Table
CREATE TABLE IF NOT EXISTS company (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    contact_number VARCHAR(15),
    address VARCHAR(255),
    website_url VARCHAR(255)
);

-- 4. Internship Table
CREATE TABLE IF NOT EXISTS internship (
    internship_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    stipend DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    company_id INT NOT NULL,
    CONSTRAINT fk_internship_company FOREIGN KEY (company_id) 
        REFERENCES company(company_id) ON DELETE CASCADE
);

-- 5. Application Table
CREATE TABLE IF NOT EXISTS application (
    application_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    application_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Applied',
    resume_url VARCHAR(255),
    remarks VARCHAR(255),
    CONSTRAINT fk_application_student FOREIGN KEY (student_id) 
        REFERENCES student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_application_internship FOREIGN KEY (internship_id) 
        REFERENCES internship(internship_id) ON DELETE CASCADE,
    CONSTRAINT uk_student_internship UNIQUE (student_id, internship_id)
);

-- 6. Evaluation Table
CREATE TABLE IF NOT EXISTS evaluation (
    evaluation_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    mentor_id INT NOT NULL,
    related_project_id INT,
    related_internship_id INT,
    marks_obtained DOUBLE PRECISION NOT NULL,
    max_marks DOUBLE PRECISION NOT NULL,
    remarks VARCHAR(255),
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_evaluation_student FOREIGN KEY (student_id) 
        REFERENCES student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_mentor FOREIGN KEY (mentor_id) 
        REFERENCES mentor(mentor_id) ON DELETE CASCADE
);

-- 7. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    mentor_id INT,
    related_project_id INT,
    related_internship_id INT,
    feedback_text TEXT NOT NULL,
    rating INT,
    feedback_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_student FOREIGN KEY (student_id) 
        REFERENCES student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_mentor FOREIGN KEY (mentor_id) 
        REFERENCES mentor(mentor_id) ON DELETE SET NULL
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION (DBMS Best Practices)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_internship_company_id ON internship(company_id);
CREATE INDEX IF NOT EXISTS idx_internship_status ON internship(status);
CREATE INDEX IF NOT EXISTS idx_application_student_id ON application(student_id);
CREATE INDEX IF NOT EXISTS idx_application_internship_id ON application(internship_id);
CREATE INDEX IF NOT EXISTS idx_application_status ON application(status);
CREATE INDEX IF NOT EXISTS idx_evaluation_student_id ON evaluation(student_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_mentor_id ON evaluation(mentor_id);
CREATE INDEX IF NOT EXISTS idx_feedback_student_id ON feedback(student_id);
