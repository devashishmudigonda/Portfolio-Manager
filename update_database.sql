-- Drop existing table and recreate with extended schema
USE portfolio_db;

DROP TABLE IF EXISTS holdings;

-- Extended portfolio holdings table
CREATE TABLE holdings (
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

-- Sample data (INR values)
INSERT INTO holdings (stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes) VALUES 
('RELIANCE', 'Reliance Industries Ltd.', 'stock', 50, 2450.00, 2680.00, 'Energy', 'medium', '2024-01-15', 'Oil and petrochemicals giant'),
('TCS', 'Tata Consultancy Services', 'stock', 25, 3200.00, 3450.00, 'IT Services', 'low', '2024-01-20', 'Leading IT services company'),
('INFY', 'Infosys Ltd.', 'stock', 40, 1450.00, 1520.00, 'IT Services', 'low', '2024-01-10', 'Global IT consulting'),
('HDFCBANK', 'HDFC Bank Ltd.', 'stock', 30, 1650.00, 1580.00, 'Banking', 'medium', '2024-01-25', 'Private sector bank'),
('ICICIBANK', 'ICICI Bank Ltd.', 'stock', 35, 950.00, 1020.00, 'Banking', 'medium', '2024-02-01', 'Leading private bank'),
('BHARTIARTL', 'Bharti Airtel Ltd.', 'stock', 60, 850.00, 920.00, 'Telecom', 'medium', '2024-01-30', 'Telecom services provider'),
('ADANIPORTS', 'Adani Ports & SEZ', 'stock', 20, 750.00, 680.00, 'Infrastructure', 'high', '2024-02-05', 'Port operations'),
('GOLDIETF', 'Gold ETF', 'etf', 100, 4500.00, 4650.00, 'Commodities', 'low', '2024-01-18', 'Gold investment');