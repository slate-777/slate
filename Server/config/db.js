const mysql = require("mysql2");
require('dotenv').config();

// Create a connection pool instead of single connection
// Pool automatically handles reconnection and connection management
const pool = mysql.createPool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || 'slate_db',
    timezone: '+05:30',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // 10 seconds
    // Handle disconnection automatically
    idleTimeout: 60000, // 60 seconds idle timeout
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Check your database credentials.');
        }
    }
    if (connection) {
        console.log("MYSQL CONNECTED");
        connection.release();
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err.message);
});

// Export the pool with promise support
module.exports = pool;
