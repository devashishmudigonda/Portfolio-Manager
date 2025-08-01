-- Portfolio Management Database Schema
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Extended portfolio holdings table
CREATE TABLE IF NOT EXISTS holdings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_ticker VARCHAR(10) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    asset_type ENUM('stock', 'bond', 'etf', 'crypto', 'cash') DEFAULT 'stock',
    volume INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) DEFAULT 0.00,
    sector VARCHAR(50),
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO holdings (stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes) VALUES 
('AAPL', 'Apple Inc.', 'stock', 100, 150.00, 175.50, 'Technology', 'medium', '2024-01-15', 'Strong tech stock'),
('GOOGL', 'Alphabet Inc.', 'stock', 50, 2500.00, 2650.00, 'Technology', 'medium', '2024-01-20', 'Search engine leader'),
('MSFT', 'Microsoft Corp.', 'stock', 75, 300.00, 320.00, 'Technology', 'low', '2024-01-10', 'Cloud computing giant'),
('TSLA', 'Tesla Inc.', 'stock', 25, 200.00, 180.00, 'Automotive', 'high', '2024-01-25', 'Electric vehicle pioneer'),
('BTC-USD', 'Bitcoin', 'crypto', 2, 45000.00, 42000.00, 'Cryptocurrency', 'high', '2024-01-30', 'Digital currency');