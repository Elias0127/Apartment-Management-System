const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'elias0127',
    database: 'csulb_apartments'
});

module.exports = pool;
