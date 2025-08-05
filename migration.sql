-- Migration Script: Add new tables to existing portfolio_db without conflicts
USE portfolio_db;

-- 1. Users table (for future multi-user support)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Assets table (master data for stocks/bonds/etc)
CREATE TABLE IF NOT EXISTS assets (
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
CREATE TABLE IF NOT EXISTS portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Modify existing holdings table to work with new structure
-- Check if columns exist before adding them
SET @sql = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'portfolio_db' AND TABLE_NAME = 'holdings' AND COLUMN_NAME = 'portfolio_id') = 0,
    'ALTER TABLE holdings ADD COLUMN portfolio_id INT DEFAULT 1 AFTER id',
    'SELECT "portfolio_id column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'portfolio_db' AND TABLE_NAME = 'holdings' AND COLUMN_NAME = 'asset_id') = 0,
    'ALTER TABLE holdings ADD COLUMN asset_id INT AFTER portfolio_id',
    'SELECT "asset_id column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Transactions table (buy/sell history)
CREATE TABLE IF NOT EXISTS transactions (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Price History table (for performance tracking)
CREATE TABLE IF NOT EXISTS price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_price (asset_id, price_date)
);

-- Insert sample data (only if tables are empty)
INSERT IGNORE INTO users (username, email, password_hash) VALUES 
('demo_user', 'demo@portfolio.com', 'hashed_password');

INSERT IGNORE INTO portfolios (user_id, name, description) VALUES 
(1, 'Main Portfolio', 'Primary investment portfolio');

-- Migrate existing holdings data to work with new structure
-- First, create assets from existing holdings if they don't exist
INSERT IGNORE INTO assets (symbol, name, asset_type, sector)
SELECT DISTINCT stock_ticker, company_name, asset_type, sector 
FROM holdings 
WHERE stock_ticker IS NOT NULL;

-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Update holdings table with asset_id references
UPDATE holdings h 
JOIN assets a ON h.stock_ticker = a.symbol 
SET h.asset_id = a.id, h.portfolio_id = 1 
WHERE h.asset_id IS NULL;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Create transaction records for existing holdings
INSERT IGNORE INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price, total_amount, transaction_date, notes)
SELECT 
    1 as portfolio_id,
    h.asset_id,
    'buy' as transaction_type,
    h.volume as quantity,
    h.purchase_price as price,
    h.volume * h.purchase_price as total_amount,
    COALESCE(h.purchase_date, CURDATE()) as transaction_date,
    h.notes
FROM holdings h
WHERE h.asset_id IS NOT NULL;

-- Add price history for existing assets
INSERT IGNORE INTO price_history (asset_id, price, price_date)
SELECT 
    h.asset_id,
    h.purchase_price,
    COALESCE(h.purchase_date, CURDATE())
FROM holdings h
WHERE h.asset_id IS NOT NULL
UNION
SELECT 
    h.asset_id,
    h.current_price,
    CURDATE()
FROM holdings h
WHERE h.asset_id IS NOT NULL AND h.current_price > 0;