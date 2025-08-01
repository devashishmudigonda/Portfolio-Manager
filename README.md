# Portfolio Management API

Minimal REST API for managing financial portfolio holdings.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create MySQL database:
```bash
mysql -u root -p < database.sql
```

3. Update database credentials in `config/database.js`

4. Start server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### GET /api/portfolio
Get all portfolio holdings
```json
[
  {
    "id": 1,
    "stock_ticker": "AAPL",
    "volume": 100,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/portfolio/:id
Get specific holding by ID

### POST /api/portfolio
Create new holding
```json
{
  "stock_ticker": "TSLA",
  "volume": 25
}
```

### PUT /api/portfolio/:id
Update existing holding
```json
{
  "stock_ticker": "TSLA",
  "volume": 30
}
```

### DELETE /api/portfolio/:id
Delete holding

## Database Schema

```sql
CREATE TABLE holdings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_ticker VARCHAR(10) NOT NULL,
    volume INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```