const db = require('../config/database');

class Portfolio {
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT 
                h.id,
                a.symbol as stock_ticker,
                a.name as company_name,
                a.asset_type,
                h.volume,
                h.purchase_price,
                h.current_price,
                a.sector,
                h.risk_level,
                h.notes,
                h.created_at,
                h.updated_at
            FROM holdings h
            LEFT JOIN assets a ON h.asset_id = a.id
            WHERE h.portfolio_id = 1 OR h.portfolio_id IS NULL
            ORDER BY h.id
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT 
                h.id,
                COALESCE(a.symbol, h.stock_ticker) as stock_ticker,
                COALESCE(a.name, h.company_name) as company_name,
                COALESCE(a.asset_type, h.asset_type) as asset_type,
                h.volume,
                h.purchase_price,
                h.current_price,
                COALESCE(a.sector, h.sector) as sector,
                h.risk_level,
                h.notes,
                h.created_at,
                h.updated_at
            FROM holdings h
            LEFT JOIN assets a ON h.asset_id = a.id
            WHERE h.id = ?
        `, [id]);
        return rows[0];
    }

    static async create(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            let [assetRows] = await connection.execute(
                'SELECT id FROM assets WHERE symbol = ?',
                [data.stock_ticker]
            );

            let assetId;
            if (assetRows.length === 0) {
                const [assetResult] = await connection.execute(
                    'INSERT INTO assets (symbol, name, asset_type, sector) VALUES (?, ?, ?, ?)',
                    [data.stock_ticker, data.company_name, data.asset_type, data.sector]
                );
                assetId = assetResult.insertId;
            } else {
                assetId = assetRows[0].id;
            }

            const [holdingResult] = await connection.execute(
                'INSERT INTO holdings (portfolio_id, asset_id, stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [1, assetId, data.stock_ticker, data.company_name, data.asset_type, data.volume, data.purchase_price, data.current_price, data.sector, data.risk_level, data.purchase_date, data.notes]
            );

            await connection.execute(
                'INSERT INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price, total_amount, transaction_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [1, assetId, 'buy', data.volume, data.purchase_price, data.purchase_price * data.volume, data.purchase_date, data.notes]
            );

            await connection.commit();
            return holdingResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, data) {
        const [result] = await db.execute(
            'UPDATE holdings h LEFT JOIN assets a ON h.asset_id = a.id SET h.volume = ?, h.purchase_price = ?, h.current_price = ?, h.risk_level = ?, h.notes = ?, a.name = ?, a.asset_type = ?, a.sector = ? WHERE h.id = ?',
            [data.volume, data.purchase_price, data.current_price, data.risk_level, data.notes, data.company_name, data.asset_type, data.sector, id]
        );
        return result.affectedRows > 0;
    }

    static async updatePrice(id, currentPrice) {
        const [result] = await db.execute(
            'UPDATE holdings SET current_price = ? WHERE id = ?',
            [currentPrice, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM holdings WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getTransactions() {
        const [rows] = await db.execute(`
            SELECT 
                t.id,
                a.symbol,
                a.name,
                t.transaction_type,
                t.quantity,
                t.price,
                t.total_amount,
                t.fees,
                t.transaction_date,
                t.notes,
                t.created_at
            FROM transactions t
            JOIN assets a ON t.asset_id = a.id
            WHERE t.portfolio_id = 1
            ORDER BY t.transaction_date DESC, t.created_at DESC
        `);
        return rows;
    }

    static async sellHolding(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [assetRows] = await connection.execute(
                'SELECT id FROM assets WHERE symbol = ?',
                [data.stock_ticker]
            );

            if (assetRows.length === 0) {
                throw new Error('Asset not found');
            }
            const assetId = assetRows[0].id;

            const [holdingRows] = await connection.execute(
                'SELECT volume FROM holdings WHERE portfolio_id = 1 AND asset_id = ?',
                [assetId]
            );

            if (holdingRows.length === 0 || holdingRows[0].volume < data.volume) {
                throw new Error('Insufficient holdings to sell');
            }

            const newVolume = holdingRows[0].volume - data.volume;
            if (newVolume === 0) {
                await connection.execute(
                    'DELETE FROM holdings WHERE portfolio_id = 1 AND asset_id = ?',
                    [assetId]
                );
            } else {
                await connection.execute(
                    'UPDATE holdings SET volume = ? WHERE portfolio_id = 1 AND asset_id = ?',
                    [newVolume, assetId]
                );
            }

            const [transactionResult] = await connection.execute(
                'INSERT INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price, total_amount, transaction_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [1, assetId, 'sell', data.volume, data.sell_price, data.sell_price * data.volume, data.transaction_date, data.notes]
            );

            await connection.commit();
            return transactionResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAvailableHoldings() {
        const [rows] = await db.execute(`
            SELECT 
                h.id,
                COALESCE(a.symbol, h.stock_ticker) as stock_ticker,
                COALESCE(a.name, h.company_name) as company_name,
                h.volume,
                h.current_price
            FROM holdings h
            LEFT JOIN assets a ON h.asset_id = a.id
            WHERE h.volume > 0 AND (h.portfolio_id = 1 OR h.portfolio_id IS NULL)
            ORDER BY COALESCE(a.symbol, h.stock_ticker)
        `);
        return rows;
    }
}

module.exports = Portfolio;