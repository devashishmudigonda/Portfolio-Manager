// Mock API responses for testing
const mockAPI = {
  get: (url) => {
    if (url === '/api/portfolio') {
      return Promise.resolve({ status: 200, body: mockHoldings });
    }
    return Promise.resolve({ status: 404, body: { error: 'Not found' } });
  },
  post: (url, data) => {
    const newHolding = { id: 3, ...data };
    return Promise.resolve({ status: 201, body: newHolding });
  },
  put: (url, data) => {
    const id = parseInt(url.split('/').pop());
    const holding = mockHoldings.find(h => h.id === id);
    if (!holding) {
      return Promise.resolve({ status: 404, body: { error: 'Holding not found' } });
    }
    Object.assign(holding, data);
    return Promise.resolve({ status: 200, body: holding });
  },
  delete: (url) => {
    const id = parseInt(url.split('/').pop());
    const index = mockHoldings.findIndex(h => h.id === id);
    if (index === -1) {
      return Promise.resolve({ status: 404, body: { error: 'Holding not found' } });
    }
    mockHoldings.splice(index, 1);
    return Promise.resolve({ status: 204, body: null });
  }
};

// Mock portfolio data
const mockHoldings = [
  {
    id: 1,
    stock_ticker: 'RELIANCE',
    company_name: 'Reliance Industries Ltd.',
    volume: 50,
    purchase_price: 2450.00,
    current_price: 2680.00,
    sector: 'Energy',
    risk_level: 'medium'
  },
  {
    id: 2,
    stock_ticker: 'TCS',
    company_name: 'Tata Consultancy Services',
    volume: 25,
    purchase_price: 3200.00,
    current_price: 3450.00,
    sector: 'IT Services',
    risk_level: 'low'
  }
];



describe('Portfolio API Tests', () => {
  
  test('GET /api/portfolio should return all holdings', async () => {
    const response = await mockAPI.get('/api/portfolio');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].stock_ticker).toBe('RELIANCE');
  });

  test('POST /api/portfolio should create new holding', async () => {
    const newHolding = {
      stock_ticker: 'INFY',
      company_name: 'Infosys Ltd.',
      volume: 40,
      purchase_price: 1450.00,
      purchase_date: '2024-01-10'
    };

    const response = await mockAPI.post('/api/portfolio', newHolding);

    expect(response.status).toBe(201);
    expect(response.body.stock_ticker).toBe('INFY');
    expect(response.body.id).toBe(3);
  });

  test('PUT /api/portfolio/:id should update holding', async () => {
    const updateData = { current_price: 2700.00 };
    
    const response = await mockAPI.put('/api/portfolio/1', updateData);

    expect(response.status).toBe(200);
    expect(response.body.current_price).toBe(2700.00);
  });

  test('DELETE /api/portfolio/:id should delete holding', async () => {
    const response = await mockAPI.delete('/api/portfolio/1');
    expect(response.status).toBe(204);
  });

  test('PUT /api/portfolio/:id should return 404 for non-existent holding', async () => {
    const response = await mockAPI.put('/api/portfolio/999', {});
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Holding not found');
  });
});