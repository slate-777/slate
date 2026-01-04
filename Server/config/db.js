const mysql = require("mysql2");

// Define the connection
let connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        timezone: '+05:30',
    });

    // Connect to the database
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to the database:', err);
            setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
        } else {
            console.log("MYSQL CONNECTED");
        }
    });

    // Handle connection errors
    connection.on('error', function (err) {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reconnect if the connection is lost
        } else {
            throw err; // Throw other errors to be handled elsewhere
        }
    });
}

// Initialize the connection
handleDisconnect();

// Export the connection
module.exports = connection;