const db = require('../config/db');
const transporter = require('../config/mailer');

class UserService {
    async fetchUsers() {
        const query = "SELECT * FROM vw_users";
        const [results] = await db.promise().query(query);
        return results;
    }

    async fetchUserState(userId) {
        const query = "SELECT state FROM vw_users WHERE id = ?";
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async changeUserRole(userId, newRoleId) {
        let query = "UPDATE users SET role_id = ?";
        const queryParams = [newRoleId];

        if (newRoleId === 1) {
            query += ", state = NULL, assigned_lab_id = NULL";
        }

        query += " WHERE id = ?";
        queryParams.push(userId);

        const [result] = await db.promise().query(query, queryParams);
        return result;
    }

    async updateUserDetails(userId, username, phone, state, assignedLab) {
        const query = "UPDATE users SET username = ?, phone = ?, state = ?, assigned_lab_id = ? WHERE id = ?";
        const [result] = await db.promise().query(query, [username, phone, state, assignedLab || null, userId]);
        return result;
    }

    async deleteUser(userId) {
        const query = "DELETE FROM users WHERE id = ?";
        const [result] = await db.promise().query(query, [userId]);
        return result;
    }

    async getControlAccessInfoForUser(sideBarOption) {
        const query = "SELECT * FROM control_access WHERE side_bar_option = ?";
        const [results] = await db.promise().query(query, [sideBarOption]);
        return results; // Return the entire row for the sidebar option
    }

    async getControlAccessInfo(userId) {
        const query = "SELECT school, lab, equipment, equipment_allocation, session, reports FROM vw_control_access WHERE id = ?";
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async updateUserControlAccess(sideBarOption, newHasAccess) {
        const query = "UPDATE control_access SET no_access = ? WHERE side_bar_option = ?";
        const [result] = await db.promise().query(query, [newHasAccess, sideBarOption]);
        return result;
    }

    async fetchControlAccessUsers() {
        const query = "SELECT * FROM vw_control_access";
        const [results] = await db.promise().query(query);
        return results;
    }

    async suspendUser(userId, userName, userEmail) {
        const fetchQuery = `SELECT status FROM vw_users WHERE id = ?`;
        const [rows] = await db.promise().query(fetchQuery, [userId]);
        if (rows.length === 0) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        const currentStatus = rows[0].status;
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const updateQuery = `UPDATE users SET status = ? WHERE id = ?`;

        await db.promise().query(updateQuery, [newStatus, userId]);

        const mailOptions = {
            to: userEmail,
            from: process.env.EMAIL,
            subject: '',
            text: ''
        };

        if (newStatus === 'inactive') {
            mailOptions.subject = 'SLATE: Account Suspension Notification';
            mailOptions.text = `Hi ${userName},\n\nYour SLATE account has been suspended.\nKindly contact the administrator for further details.\n\nRegards,\nSLATE Admin\n*This is an un-attended mailbox, kindly do not reply to this message.`;
        } else {
            mailOptions.subject = 'SLATE: Account Re-activation Notification';
            mailOptions.text = `Hi ${userName},\n\nYour SLATE account has been activated.\n\nRegards,\nSLATE Admin\n*This is an un-attended mailbox, kindly do not reply to this message.`;
        }

        await transporter.sendMail(mailOptions);
    }

    async fetchUserActivity(userId, period) {
        const query = `
            SELECT * FROM vw_logs
            WHERE user_id = ? AND log_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY) ORDER BY log_id DESC
        `;
        const [results] = await db.promise().query(query, [userId, parseInt(period)]);
        return results;
    }
}

module.exports = new UserService;