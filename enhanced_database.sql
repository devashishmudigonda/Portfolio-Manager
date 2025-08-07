-- Enhanced Portfolio Management Database Schema (6 Tables)
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- 1. Users table (for future multi-user support)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Assets table (master data for stocks/bonds/etc)
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    asset_type ENUM('stock', 'bond', 'etf', 'crypto', 'cash') NOT NULL,
    sector VARCHAR(50),
    exchange VARCHAR(20),
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Portfolios table (user can have multiple portfolios)
CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Holdings table (current positions)
-- CREATE TABLE holdings (
--    id INT AUTO_INCREMENT PRIMARY KEY,
--    portfolio_id INT NOT NULL,
--    asset_id INT NOT NULL,
--    quantity INT NOT NULL,
--    average_price DECIMAL(10,2) NOT NULL,
--    current_price DECIMAL(10,2) DEFAULT 0.00,
--    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
--    notes TEXT,
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
--  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
--    UNIQUE KEY unique_holding (portfolio_id, asset_id)
-- );

-- 5. Transactions table (buy/sell history)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,
    asset_id INT NOT NULL,
    transaction_type ENUM('buy', 'sell') NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    fees DECIMAL(8,2) DEFAULT 0.00,
    transaction_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 6. Price History table (for performance tracking)
CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_price (asset_id, price_date)
);

INSERT INTO users (username, email, password_hash) VALUES 
('demo_user', 'demo@portfolio.com', 'hashed_password');

INSERT INTO assets (symbol, name, asset_type, sector, exchange) VALUES 
('RELIANCE', 'Reliance Industries Ltd.', 'stock', 'Energy', 'NSE'),
('TCS', 'Tata Consultancy Services', 'stock', 'IT Services', 'NSE'),
('INFY', 'Infosys Ltd.', 'stock', 'IT Services', 'NSE'),
('HDFCBANK', 'HDFC Bank Ltd.', 'stock', 'Banking', 'NSE'),
('ICICIBANK', 'ICICI Bank Ltd.', 'stock', 'Banking', 'NSE'),
('BHARTIARTL', 'Bharti Airtel Ltd.', 'stock', 'Telecom', 'NSE'),
('GOLDIETF', 'Gold ETF', 'etf', 'Commodities', 'NSE');

INSERT INTO portfolios (user_id, name, description) VALUES 
(1, 'Main Portfolio', 'Primary investment portfolio');

INSERT INTO holdings (portfolio_id, asset_id, quantity, average_price, current_price, risk_level, notes) VALUES 
(1, 1, 50, 2450.00, 2680.00, 'medium', 'Oil and petrochemicals giant'),
(1, 2, 25, 3200.00, 3450.00, 'low', 'Leading IT services company'),
(1, 3, 40, 1450.00, 1520.00, 'low', 'Global IT consulting'),
(1, 4, 30, 1650.00, 1580.00, 'medium', 'Private sector bank'),
(1, 5, 35, 950.00, 1020.00, 'medium', 'Leading private bank');

INSERT INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price, total_amount, transaction_date, notes) VALUES 
(1, 1, 'buy', 50, 2450.00, 122500.00, '2024-01-15', 'Initial purchase'),
(1, 2, 'buy', 25, 3200.00, 80000.00, '2024-01-20', 'Tech sector investment'),
(1, 3, 'buy', 40, 1450.00, 58000.00, '2024-01-10', 'IT diversification'),
(1, 4, 'buy', 30, 1650.00, 49500.00, '2024-01-25', 'Banking exposure'),
(1, 5, 'buy', 35, 950.00, 33250.00, '2024-02-01', 'Additional banking');

INSERT INTO price_history (asset_id, price, price_date) VALUES 
(1, 2450.00, '2024-01-15'), (1, 2680.00, '2024-02-15'),
(2, 3200.00, '2024-01-20'), (2, 3450.00, '2024-02-15'),
(3, 1450.00, '2024-01-10'), (3, 1520.00, '2024-02-15'),
(4, 1650.00, '2024-01-25'), (4, 1580.00, '2024-02-15'),
(5, 950.00, '2024-02-01'), (5, 1020.00, '2024-02-15');