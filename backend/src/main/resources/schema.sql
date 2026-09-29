-- ===================================================================
-- MySQL Database Setup Script for Finora Personal Expense Tracker
-- ===================================================================

-- 1. Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS expense_tracker;

-- 2. Select the database for use
USE expense_tracker;

-- 3. Create the expenses table
-- Note: Spring Boot Data JPA can also auto-create or update tables via 'spring.jpa.hibernate.ddl-auto=update',
-- but this script is provided so you can run it manually in MySQL Workbench or MySQL CLI.
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    monthly_budget DECIMAL(10, 2) NOT NULL,
    target_month VARCHAR(7) DEFAULT NULL
);

-- 5. Create the profile table
CREATE TABLE IF NOT EXISTS profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) DEFAULT 'likhithapuli2006@gmail.com',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Sample Starter Data to test your database setup
INSERT INTO expenses (description, amount, category, date, payment_method, is_recurring, recurring_frequency) VALUES
('Grocery Shopping', 1250.00, 'Food', '2026-09-15', 'UPI', FALSE, NULL),
('Electricity Bill', 1850.00, 'Bills', '2026-09-14', 'Debit Card', TRUE, 'Monthly'),
('Metro Monthly Pass', 800.00, 'Transport', '2026-09-12', 'Debit Card', TRUE, 'Monthly'),
('Java Programming Book', 650.00, 'Education', '2026-09-10', 'Credit Card', FALSE, NULL),
('Broadband WiFi Bill', 799.00, 'Bills', '2026-09-05', 'UPI', TRUE, 'Monthly'),
('Netflix Subscription', 649.00, 'Entertainment', '2026-09-03', 'Credit Card', TRUE, 'Monthly'),
('Health & Dental Checkup', 550.00, 'Health', '2026-09-02', 'UPI', FALSE, NULL),
('Weekend Movie & Snacks', 450.00, 'Entertainment', '2026-09-01', 'Cash', FALSE, NULL);

INSERT INTO budgets (monthly_budget, target_month) VALUES
(10000.00, '2026-09');

INSERT INTO profile (id, display_name, email) VALUES
(1, 'Likhitha Puli', 'likhithapuli2006@gmail.com');

