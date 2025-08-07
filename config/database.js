const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'n3u3da!',
    database: 'portfolio_db'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;