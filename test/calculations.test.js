// Portfolio calculation functions for testing
function calculatePortfolioValue(holdings) {
  return holdings.reduce((sum, holding) => sum + (holding.current_price * holding.volume), 0);
}

function calculateTotalGainLoss(holdings) {
  const totalValue = calculatePortfolioValue(holdings);
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.purchase_price * holding.volume), 0);
  return totalValue - totalCost;
}

function calculateGainLossPercentage(holdings) {
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.purchase_price * holding.volume), 0);
  const gainLoss = calculateTotalGainLoss(holdings);
  return totalCost > 0 ? ((gainLoss / totalCost) * 100) : 0;
}

function calculateDiversificationScore(holdings) {
  const totalValue = calculatePortfolioValue(holdings);
  const weights = holdings.map(holding => (holding.current_price * holding.volume) / totalValue);
  const hhi = weights.reduce((sum, weight) => sum + (weight * weight), 0);
  return Math.min(100, Math.max(0, (1 - hhi) * 100));
}

function formatCurrency(amount, isUSD = false, exchangeRate = 83.5) {
  if (isUSD) {
    return '$' + (amount / exchangeRate).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }
  return '₹' + amount.toLocaleString();
}

// Test data
const testHoldings = [
  {
    stock_ticker: 'RELIANCE',
    volume: 50,
    purchase_price: 2450.00,
    current_price: 2680.00,
    sector: 'Energy'
  },
  {
    stock_ticker: 'TCS',
    volume: 25,
    purchase_price: 3200.00,
    current_price: 3450.00,
    sector: 'IT Services'
  },
  {
    stock_ticker: 'INFY',
    volume: 40,
    purchase_price: 1450.00,
    current_price: 1520.00,
    sector: 'IT Services'
  }
];

describe('Portfolio Calculations', () => {
  
  test('should calculate total portfolio value correctly', () => {
    const totalValue = calculatePortfolioValue(testHoldings);
    const expected = (2680 * 50) + (3450 * 25) + (1520 * 40); // 134000 + 86250 + 60800 = 281050
    expect(totalValue).toBe(281050);
  });

  test('should calculate total gain/loss correctly', () => {
    const gainLoss = calculateTotalGainLoss(testHoldings);
    const totalValue = 281050;
    const totalCost = (2450 * 50) + (3200 * 25) + (1450 * 40); // 122500 + 80000 + 58000 = 260500
    const expected = totalValue - totalCost; // 20550
    expect(gainLoss).toBe(20550);
  });

  test('should calculate gain/loss percentage correctly', () => {
    const percentage = calculateGainLossPercentage(testHoldings);
    const expected = (20550 / 260500) * 100; // ~7.89%
    expect(percentage).toBeCloseTo(7.89, 2);
  });

  test('should calculate diversification score', () => {
    const score = calculateDiversificationScore(testHoldings);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should format currency correctly for INR', () => {
    const formatted = formatCurrency(123456.78);
    expect(formatted).toBe('₹123,456.78');
  });

  test('should format currency correctly for USD', () => {
    const formatted = formatCurrency(83500, true, 83.5);
    expect(formatted).toBe('$1,000.00');
  });

  test('should handle empty portfolio', () => {
    const emptyHoldings = [];
    expect(calculatePortfolioValue(emptyHoldings)).toBe(0);
    expect(calculateTotalGainLoss(emptyHoldings)).toBe(0);
    expect(calculateGainLossPercentage(emptyHoldings)).toBe(0);
  });

  test('should handle single holding', () => {
    const singleHolding = [testHoldings[0]];
    const value = calculatePortfolioValue(singleHolding);
    const gainLoss = calculateTotalGainLoss(singleHolding);
    
    expect(value).toBe(134000);
    expect(gainLoss).toBe(11500); // (2680-2450) * 50
  });
});