-- ==========================================================================
-- BANKSFERE DATABASE DDL SCHEMA (MYSQL / MARIADB / SQLITE)
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS banksphere_db;
USE banksphere_db;

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    failed_logins INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS accounts (
    account_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 3. BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(20) PRIMARY KEY,
    account_id VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL, -- 'Credit' or 'Debit'
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'Success',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- SAMPLE SEED DATA
INSERT INTO customers (customer_id, name, email, phone, password_hash, status) VALUES
('CUST1001', 'Kalyan Vance', 'kalyan@banksphere.com', '+91 9876543210', 'Password123!', 'Active'),
('CUST1002', 'Rahul Sharma', 'rahul@demobank.com', '+91 9123456789', 'Password123!', 'Active');

INSERT INTO accounts (account_id, customer_id, account_number, account_type, balance) VALUES
('ACC4521', 'CUST1001', '100045218901', 'Savings Account', 120450.00),
('ACC7890', 'CUST1001', '200078904321', 'Current Account', 40000.00);

INSERT INTO beneficiaries (beneficiary_id, customer_id, name, account_number, bank_name, ifsc_code) VALUES
('BEN101', 'CUST1001', 'Rahul Sharma', '100012345678', 'DemoBank', 'DEMO0001234');

INSERT INTO transactions (transaction_id, account_id, transaction_type, category, description, amount, reference_number) VALUES
('TXN9801', 'ACC4521', 'Debit', 'Shopping', 'Amazon India Shopping', 1200.00, 'REF892019201'),
('TXN9802', 'ACC4521', 'Credit', 'Salary', 'Tech Corp Salary Credit', 35000.00, 'REF892019202');
