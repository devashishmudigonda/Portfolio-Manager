-- Add more sample transactions for better line graph visualization
USE portfolio_db;

-- Add more buy transactions with different dates
INSERT INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price, total_amount, transaction_date, notes) VALUES 
-- January transactions
(1, 1, 'buy', 20, 2380.00, 47600.00, '2024-01-05', 'Early investment'),
(1, 2, 'buy', 15, 3150.00, 47250.00, '2024-01-08', 'Tech accumulation'),
(1, 6, 'buy', 100, 850.00, 85000.00, '2024-01-12', 'Telecom entry'),

-- February transactions
(1, 3, 'buy', 25, 1480.00, 37000.00, '2024-02-05', 'Additional IT exposure'),
(1, 4, 'buy', 20, 1620.00, 32400.00, '2024-02-08', 'Banking sector boost'),
(1, 1, 'sell', 10, 2650.00, 26500.00, '2024-02-12', 'Partial profit booking'),

-- March transactions
(1, 5, 'buy', 25, 980.00, 24500.00, '2024-03-01', 'Banking diversification'),
(1, 2, 'sell', 5, 3400.00, 17000.00, '2024-03-05', 'Profit taking'),
(1, 7, 'buy', 50, 4200.00, 210000.00, '2024-03-10', 'Gold ETF investment'),
(1, 6, 'buy', 50, 880.00, 44000.00, '2024-03-15', 'Telecom accumulation'),

-- April transactions
(1, 3, 'sell', 15, 1550.00, 23250.00, '2024-04-02', 'Rebalancing portfolio'),
(1, 4, 'buy', 15, 1560.00, 23400.00, '2024-04-08', 'Banking sector confidence'),
(1, 1, 'buy', 30, 2720.00, 81600.00, '2024-04-12', 'Energy sector bet'),

-- May transactions
(1, 5, 'sell', 20, 1050.00, 21000.00, '2024-05-03', 'Portfolio optimization'),
(1, 2, 'buy', 10, 3500.00, 35000.00, '2024-05-07', 'Tech sector strength'),
(1, 6, 'sell', 30, 920.00, 27600.00, '2024-05-15', 'Telecom profit booking');

-- Disable safe update mode and update holdings
SET SQL_SAFE_UPDATES = 0;
UPDATE holdings SET volume = 90, purchase_price = 2520.00 WHERE portfolio_id = 1 AND asset_id = 1;
UPDATE holdings SET volume = 45, purchase_price = 3280.00 WHERE portfolio_id = 1 AND asset_id = 2;
UPDATE holdings SET volume = 50, purchase_price = 1465.00 WHERE portfolio_id = 1 AND asset_id = 3;
UPDATE holdings SET volume = 65, purchase_price = 1610.00 WHERE portfolio_id = 1 AND asset_id = 4;
UPDATE holdings SET volume = 40, purchase_price = 965.00 WHERE portfolio_id = 1 AND asset_id = 5;
SET SQL_SAFE_UPDATES = 1;

INSERT INTO holdings (portfolio_id, asset_id, stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes) VALUES 
(1, 6, 'BHARTIARTL', 'Bharti Airtel Ltd.', 'stock', 120, 865.00, 920.00, 'Telecom', 'medium', '2024-01-12', 'Telecom sector play'),
(1, 7, 'GOLDIETF', 'Gold ETF', 'etf', 50, 4200.00, 4350.00, 'Commodities', 'low', '2024-03-10', 'Safe haven asset');