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
console.log('=== DB Config Debug ===');
console.log('ENV Path:', envPath);
console.log('DB_HOST:', process.env.DB_HOST || process.env.HOST || 'localhost');
console.log('DB_USER:', process.env.DB_USER || process.env.USER);
console.log('DB_NAME:', process.env.DB_NAME || process.env.DATABASE || 'slate_db');
console.log('Has Password:', !!(process.env.DB_PASSWORD || process.env.PASSWORD));
console.log('=======================');

// Create a connection pool - Use DB_ prefixed vars first, fallback to old names
const pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.HOST || 'localhost',
    user: process.env.DB_USER || process.env.USER || 'root',
    password: process.env.DB_PASSWORD || process.env.PASSWORD || '',
    database: process.env.DB_NAME || process.env.DATABASE || 'slate_db',
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
