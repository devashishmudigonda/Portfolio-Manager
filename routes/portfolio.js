const express = require('express');
const Portfolio = require('../models/Portfolio');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const holdings = await Portfolio.getAll();
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Portfolio.getTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/available', async (req, res) => {
    try {
        const holdings = await Portfolio.getAvailableHoldings();
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/sell', async (req, res) => {
    try {
        const { stock_ticker, volume, sell_price, transaction_date, notes } = req.body;
        if (!stock_ticker || !volume || !sell_price || !transaction_date) {
            return res.status(400).json({ error: 'stock_ticker, volume, sell_price, and transaction_date are required' });
        }
        const data = { stock_ticker, volume, sell_price, transaction_date, notes };
        const id = await Portfolio.sellHolding(data);
        res.status(201).json({ id, ...data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

router.put('/:id', async (req, res) => {
    try {
        if (req.body.current_price !== undefined && Object.keys(req.body).length === 1) {
            const updated = await Portfolio.updatePrice(req.params.id, req.body.current_price);
            if (!updated) {
                return res.status(404).json({ error: 'Holding not found' });
            }
            return res.json({ id: req.params.id, current_price: req.body.current_price });
        }
        
        const { stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes } = req.body;
        if (!stock_ticker || !company_name || !volume || !purchase_price) {
            return res.status(400).json({ error: 'stock_ticker, company_name, volume, and purchase_price are required' });
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