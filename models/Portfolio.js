const db = require('../config/database');

class Portfolio {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM holdings ORDER BY id');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM holdings WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const [result] = await db.execute(
            'INSERT INTO holdings (stock_ticker, company_name, asset_type, volume, purchase_price, current_price, sector, risk_level, purchase_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [data.stock_ticker, data.company_name, data.asset_type, data.volume, data.purchase_price, data.current_price, data.sector, data.risk_level, data.purchase_date, data.notes]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const [result] = await db.execute(
            'UPDATE holdings SET stock_ticker = ?, company_name = ?, asset_type = ?, volume = ?, purchase_price = ?, current_price = ?, sector = ?, risk_level = ?, purchase_date = ?, notes = ? WHERE id = ?',
            [data.stock_ticker, data.company_name, data.asset_type, data.volume, data.purchase_price, data.current_price, data.sector, data.risk_level, data.purchase_date, data.notes, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM holdings WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Portfolio;