const express = require('express');
const Portfolio = require('../models/Portfolio');
const router = express.Router();

// GET /api/portfolio - Get all holdings
router.get('/', async (req, res) => {
    try {
        const holdings = await Portfolio.getAll();
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/portfolio/:id - Get holding by ID
router.get('/:id', async (req, res) => {
    try {
        const holding = await Portfolio.getById(req.params.id);
        if (!holding) {
            return res.status(404).json({ error: 'Holding not found' });
        }
        res.json(holding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/portfolio - Create new holding
router.post('/', async (req, res) => {
    try {
        const { stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes } = req.body;
        if (!stock_ticker || !company_name || !volume || !purchase_price || !purchase_date) {
            return res.status(400).json({ error: 'stock_ticker, company_name, volume, purchase_price, and purchase_date are required' });
        }
        const data = { stock_ticker, company_name, asset_type: asset_type || 'stock', volume, purchase_price, current_price: current_price || 0, sector, risk_level: risk_level || 'medium', purchase_date, notes };
        const id = await Portfolio.create(data);
        res.status(201).json({ id, ...data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/portfolio/:id - Update holding
router.put('/:id', async (req, res) => {
    try {
        const { stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes } = req.body;
        if (!stock_ticker || !company_name || !volume || !purchase_price || !purchase_date) {
            return res.status(400).json({ error: 'stock_ticker, company_name, volume, purchase_price, and purchase_date are required' });
        }
        const data = { stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes };
        const updated = await Portfolio.update(req.params.id, data);
        if (!updated) {
            return res.status(404).json({ error: 'Holding not found' });
        }
        res.json({ id: req.params.id, ...data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/portfolio/:id - Delete holding
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Portfolio.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Holding not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;