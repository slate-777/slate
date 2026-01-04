const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const transporter = require('../config/mailer');

class AuthService {

    async findUserById(userId) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM vw_users WHERE id = ?", [userId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    };

    async findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            // Temporarily query users table directly to bypass view issues
            db.query("SELECT u.*, l.lab_name as assignedLab FROM users u LEFT JOIN labs l ON u.assigned_lab_id = l.id WHERE u.email = ?", [email], (err, results) => {
                if (err) {
                    console.error('Database error in findUserByEmail:', err);
                    return reject(new Error(err.message));
                }
                console.log('Query results for', email, ':', results[0] ? 'User found' : 'No user');
                if (results[0]) {
                    console.log('User fields:', Object.keys(results[0]));
                }
                resolve(results[0]);
            });
        });
    }

    async findUserByState(userEmail, roleId, state) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM vw_users WHERE role_id = ? AND state = ? AND email <> ?", [roleId, state, userEmail], (err, results) => {
                if (err) {
                    return reject(new Error(err.message));
                }
                resolve(results[0]);
            });
        });
    }

    async createUser(userData) {
        const { fname, lname, email, phone, userType, state, assignedLab } = userData;
        const username = `${fname} ${lname}`; // Merge fname and lname into username
        // Generate random password
        const plainPassword = crypto.randomBytes(8).toString('hex'); // Generate a strong password
        const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password

        // Generate reset token (valid for 30 minutes)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
        const role_id = userType === "Admin" ? 1 : userType === "Mentor" ? 2 : 3; // Map userType to role_id

        await db.promise().query(
            "INSERT INTO users (username, email, phone, password, role_id, state, assigned_lab_id, resetPasswordToken, resetPasswordExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [username, email, phone, hashedPassword, role_id, state, assignedLab || null, resetToken, resetPasswordExpires],
            (err, result) => {
                if (err) {
                    return reject(new Error(err.message));
                }
                resolve(result.insertId);
            }
        );
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const forgotPasswordLink = `${process.env.FRONTEND_URL}/forgot-password`;

        // Send email with the password to the user
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'SLATE: New User Password Setup Link',
            text: `Dear ${username},\n\nYour account has been created successfully. Please set your password using the link below:\n\n${resetLink}\n\nThis link will expire in 24 hours.\n\nIf the link has expired, please go to the following link to reset your password:\n\n${forgotPasswordLink}\n\nRegards,\nSLATE Admin\n*This is an un-attended mailbox, kindly do not reply to this message.`
        };

        await transporter.sendMail(mailOptions);
    }

    async updatePassword(userId, hashedPassword) {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, userId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    };

    async sendResetPasswordEmail(email) {
        const [user] = await db.promise().query('SELECT * FROM vw_users WHERE email = ?', [email]);
        if (user.length === 0) {
            throw { status: 404, message: 'User not found' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await db.promise().query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?',
            [resetToken, resetPasswordExpires, email]
        );

        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'SLATE: Password Reset Link',
            text: `Hi ${user[0].username},\n\nYou are receiving this because you (or someone else) requested to reset the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\n` +
                `This link will expire in 24 hours.\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n\nRegards,\nSLATE Admin\n*This is an un-attended mailbox, kindly do not reply to this message.`
        };

        await transporter.sendMail(mailOptions);
    }

    async resetUserPassword(token, password) {
        const [user] = await db.promise().query('SELECT * FROM vw_users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
            [token, Date.now()]
        );

        if (user.length === 0) {
            throw { status: 400, message: 'Invalid or expired token' };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.promise().query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?',
            [hashedPassword, user[0].email]
        );

        const mailOptions = {
            to: user[0].email,
            from: process.env.EMAIL,
            subject: 'SLATE: Password Changed Successfully',
            text: `Hi ${user[0].username},\n\nThis is a confirmation that the password for your SLATE account has been changed successfully.\n\n` +
                `If you did not make this change, please contact the administrator immediately.\n\n` +
                `Regards,\nSLATE Admin\n*This is an un-attended mailbox, kindly do not reply to this message.`
        };

        await transporter.sendMail(mailOptions);
    }

    async logActivity(userId, activity) {
        const currentISTTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO logs (user_id, activity, log_date) VALUES (?, ?, ?)", [userId, activity, currentISTTime], (err, result) => {
                if (err) {
                    return reject(new Error(err.message));
                }
                resolve(result);
            });
        });
    }

}

module.exports = new AuthService;