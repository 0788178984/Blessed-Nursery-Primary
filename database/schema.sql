-- Blessed Nursery and Primary School Database Schema
-- Created for comprehensive website management

CREATE DATABASE IF NOT EXISTS blessed_nursery_school;
USE blessed_nursery_school;

-- Users table for admin authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(32) NOT NULL, -- MD5 hash
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pages table for website content management
CREATE TABLE pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content LONGTEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    template VARCHAR(100) DEFAULT 'default',
    sort_order INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- News and events table
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content LONGTEXT,
    excerpt TEXT,
    featured_image VARCHAR(255),
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Programs table for academic programs
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    content LONGTEXT,
    duration VARCHAR(50),
    level ENUM('certificate', 'diploma', 'degree', 'masters', 'phd') NOT NULL,
    requirements TEXT,
    fees DECIMAL(10,2),
    featured_image VARCHAR(255),
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Staff directory table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    qualifications TEXT,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media library table
CREATE TABLE media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Navigation menu table
CREATE TABLE navigation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    target ENUM('_self', '_blank') DEFAULT '_self',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES navigation(id) ON DELETE CASCADE
);

-- Site settings table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'textarea', 'image', 'boolean', 'number') DEFAULT 'text',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partners table
CREATE TABLE partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, email, password, full_name, role) VALUES 
('admin', 'admin@blessednursery.com', MD5('admin123'), 'System Administrator', 'admin');

-- Insert default site settings
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'Blessed Nursery and Primary School', 'text', 'Website title'),
('site_description', 'Leading educational institution focused on practical learning and community transformation', 'textarea', 'Website description'),
('contact_email', 'info@blessednursery.com', 'text', 'Main contact email'),
('contact_phone', '+256 XXX XXX XXX', 'text', 'Main contact phone'),
('contact_address', 'Kampala, Uganda', 'text', 'Physical address'),
('social_facebook', '', 'text', 'Facebook page URL'),
('social_twitter', '', 'text', 'Twitter profile URL'),
('social_linkedin', '', 'text', 'LinkedIn profile URL'),
('social_youtube', '', 'text', 'YouTube channel URL');

-- Insert sample partners
INSERT INTO partners (name, logo, website, description, sort_order) VALUES
('UVTAB', 'images/uvtabLogo.png', '', 'Assessment for Employable Skills', 1),
('Ministry of ICT', 'images/Ministry-of-ICT.jpg', '', 'Ministry of ICT and National Guidance', 2),
('Hope', 'images/hopef.png', '', 'Hope Foundation', 3),
('Paradigm FM', 'images/paradigmFm.png', '', 'Paradigm FM Radio', 4);

-- Insert sample navigation
INSERT INTO navigation (title, url, sort_order) VALUES
('Home', '/', 1),
('About', '/about/', 2),
('Academics', '/academics/', 3),
('Admissions', '/admissions/', 4),
('News', '/news/', 5),
('Research', '/research/', 6),
('E-Learning', '/elearning/', 7),
('Contact', '/contact/', 8);

-- Insert sample pages
INSERT INTO pages (title, slug, content, status, created_by) VALUES
('About Us', 'about', '<h1>About Blessed Nursery and Primary School</h1><p>We are committed to providing quality education...</p>', 'published', 1),
('Vision & Mission', 'vision-mission', '<h1>Our Vision</h1><p>To be a leading educational institution...</p>', 'published', 1),
('History', 'history', '<h1>Our History</h1><p>Founded in 2020...</p>', 'published', 1);

-- Insert sample news
INSERT INTO news (title, slug, content, excerpt, featured_image, status, is_featured, published_at, created_by) VALUES
('New Academic Programs Launched', 'new-academic-programs-launched', '<h1>Exciting New Programs</h1><p>We are proud to announce...</p>', 'Discover our latest academic offerings designed for the modern workforce.', 'images/1.jpg', 'published', TRUE, NOW(), 1),
('Research Collaboration with Industry', 'research-collaboration-industry', '<h1>Industry Partnership</h1><p>We have partnered with leading companies...</p>', 'Building bridges between academia and industry for practical learning.', 'images/2.jpg', 'published', FALSE, NOW(), 1),
('Student Success Stories', 'student-success-stories', '<h1>Graduate Achievements</h1><p>Our graduates are making a difference...</p>', 'Celebrating the achievements of our outstanding graduates.', 'images/3.jpg', 'published', FALSE, NOW(), 1);

-- Insert sample programs
INSERT INTO programs (title, slug, description, content, duration, level, requirements, fees, featured_image, status, created_by) VALUES
('Certificate in ICT', 'certificate-ict', 'Basic ICT skills for beginners', '<h1>Certificate in Information and Communication Technology</h1><p>This program provides...</p>', '6 months', 'certificate', 'O-Level certificate', 500000.00, 'images/paradigmblock.jpg', 'active', 1),
('Diploma in Business Administration', 'diploma-business', 'Comprehensive business management training', '<h1>Diploma in Business Administration</h1><p>Develop essential business skills...</p>', '2 years', 'diploma', 'A-Level certificate', 1200000.00, 'images/tailoring.jpg', 'active', 1);

-- Insert sample staff
INSERT INTO staff (full_name, position, department, email, bio, profile_image, is_active) VALUES
('Dr. John Smith', 'Director', 'Administration', 'director@blessednursery.com', 'Experienced educator with 20+ years in academic leadership.', 'images/ACAALI.jpg', TRUE),
('Prof. Jane Doe', 'Head of Academics', 'Academic Affairs', 'academics@blessednursery.com', 'Leading expert in curriculum development and educational innovation.', 'images/LECT.jpg', TRUE);
