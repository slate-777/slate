const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");

// Load .env from Server directory
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    console.error('Warning: .env file not found at', envPath);
}

// Debug: Log what we're using (remove in production)
console.log('DB Config:', {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    database: process.env.DATABASE || 'slate_db',
    hasPassword: !!process.env.PASSWORD
});

// Create a connection pool
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
    keepAliveInitialDelay: 10000,
    idleTimeout: 60000,
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Check your database credentials in .env file.');
        }
    }
    if (connection) {
        console.log("✅ MYSQL CONNECTED");
        connection.release();
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err.message);
});

module.exports = pool;
