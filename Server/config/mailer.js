const nodemailer = require('nodemailer');

// Initialize and export a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Initialize and export a Nodemailer transporter using your domain's SMTP settings
// const transporter = nodemailer.createTransport({
//     host: 'smtp.sprintxsol.com',  // Replace with your domain's SMTP host
//     port: 587,                   // Use 587 for TLS or 465 for SSL
//     secure: false,                // Set to true if using port 465 (SSL)
//     auth: {
//         user: process.env.EMAIL, // Your email (e.g., admin@sprintxsol.com)
//         pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
//     },
//     tls: {
//         rejectUnauthorized: false  // Optional: allow self-signed certificates
//     }
// });


module.exports = transporter;