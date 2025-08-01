const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Portfolio Management API',
        endpoints: {
            'GET /api/portfolio': 'Get all holdings',
            'GET /api/portfolio/:id': 'Get holding by ID',
            'POST /api/portfolio': 'Create new holding',
            'PUT /api/portfolio/:id': 'Update holding',
            'DELETE /api/portfolio/:id': 'Delete holding'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});