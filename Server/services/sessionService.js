const db = require('../config/db');
const path = require('path');
const fs = require('fs');

class SessionService {
    async setupSession(userId, sessionTitle, sessionHost, sessionDate, sessionTime, schoolId, labId, folderName) {
        const query = `INSERT INTO sessions 
            (session_title, session_host, session_date, session_time, school_id, lab_id, invitees, session_folder_name, session_setup_by, session_setup_on) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        const [result] = await db.promise().query(query, [sessionTitle, sessionHost, sessionDate, sessionTime, schoolId, labId, 'attendees.xlsx', folderName, userId]);
        const sessionId = result.insertId;
        return sessionId;
    }

    async fetchMySessions(userId) {
        const query = `
            SELECT DISTINCT
                s.id,
                s.session_title,
                s.session_host,
                s.session_date,
                s.session_time,
                s.session_description,
                s.session_status,
                s.session_images,
                s.school_id,
                s.lab_id,
                s.session_setup_by,
                s.session_setup_on,
                s.centre_code,
                s.state,
                s.district,
                s.sathee_mitra_name,
                s.school_type,
                s.school_type_other,
                s.school_address,
                s.principal_name,
                s.principal_contact,
                s.visit_mode,
                sc.school_name,
                l.lab_name,
                u.email as session_setup_by_email,
                sch.state as school_state
            FROM sessions s
            LEFT JOIN schools sc ON s.school_id = sc.id
            LEFT JOIN labs l ON s.lab_id = l.id
            LEFT JOIN users u ON s.session_setup_by = u.id
            LEFT JOIN schools sch ON s.school_id = sch.id
            WHERE s.session_setup_by = ? 
            ORDER BY s.id DESC
        `;
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async fetchAllSessions(userId, state, assignedLab) {
        let query = `
            SELECT DISTINCT
                s.id,
                s.session_title,
                s.session_host,
                s.session_date,
                s.session_time,
                s.session_description,
                s.session_status,
                s.session_images,
                s.school_id,
                s.lab_id,
                s.session_setup_by,
                s.session_setup_on,
                s.centre_code,
                s.state,
                s.district,
                s.sathee_mitra_name,
                s.school_type,
                s.school_type_other,
                s.school_address,
                s.principal_name,
                s.principal_contact,
                s.visit_mode,
                sc.school_name,
                l.lab_name,
                u.email as session_setup_by_email,
                sch.state as school_state
            FROM sessions s
            LEFT JOIN schools sc ON s.school_id = sc.id
            LEFT JOIN labs l ON s.lab_id = l.id
            LEFT JOIN users u ON s.session_setup_by = u.id
            LEFT JOIN schools sch ON s.school_id = sch.id
        `;
        const queryParams = [];

        // If user has an assigned lab, only show sessions for that lab
        if (assignedLab) {
            query += " WHERE s.lab_id = ?";
            queryParams.push(assignedLab);
        } else if (userId !== 1 && state) {
            query += " WHERE sch.state = ?";
            queryParams.push(state);
        }

        query += " ORDER BY s.id DESC";
        const [results] = await db.promise().query(query, queryParams);
        return results;
    }

    async fetchSessionHosts() {
        const query = "SELECT DISTINCT session_host FROM vw_sessions";
        const [results] = await db.promise().query(query);
        return results.map(row => row.session_host);
    }

    async updateSessionData(userId, sessionId, sessionData) {
        const fetchAttendanceCountQuery = "SELECT COUNT(*) AS presentCount FROM vw_students WHERE student_attendance = 'P' AND session_id = ?";
        const [result] = await db.promise().query(fetchAttendanceCountQuery, [sessionId]);
        const { presentCount } = result[0];

        // Query to update the session details including SATHEE KENDRA fields
        const updateSessionQuery = `
            UPDATE sessions
            SET session_title = ?, session_host = ?, session_date = ?, session_time = ?, 
                school_id = ?, lab_id = ?, session_description = ?, session_status = ?, attendees_count = ?,
                centre_code = ?, state = ?, district = ?, sathee_mitra_name = ?,
                school_type = ?, school_type_other = ?, school_address = ?,
                principal_name = ?, principal_contact = ?, visit_mode = ?,
                session_updated_by = ?, session_updated_on = NOW()
            WHERE id = ?
        `;
        await db.promise().query(updateSessionQuery, [
            sessionData.session_title,
            sessionData.session_host,
            sessionData.session_date,
            sessionData.session_time,
            sessionData.school_id,
            sessionData.lab_id,
            sessionData.session_description,
            sessionData.session_status,
            presentCount,
            sessionData.centre_code,
            sessionData.state,
            sessionData.district,
            sessionData.sathee_mitra_name,
            sessionData.school_type,
            sessionData.school_type_other,
            sessionData.school_address,
            sessionData.principal_name,
            sessionData.principal_contact,
            sessionData.visit_mode,
            userId,
            sessionId
        ]);
    }

    async deleteSession(sessionId) {
        const query = `DELETE FROM sessions WHERE id = ? LIMIT 1`;
        const [result] = await db.promise().query(query, [sessionId]);
        console.log(`[SESSION SERVICE] Delete query executed for ID ${sessionId}, affected rows: ${result.affectedRows}`);
        return result;
    }

    async getStudentList(sessionId) {
        const query = "SELECT * FROM vw_students WHERE session_id = ?";
        const [results] = await db.promise().query(query, [sessionId]);
        return results;
    }

    async updateStudentAttendance(sessionId, attendance) {
        const queryPromises = attendance.map((student) =>
            db.promise().query(
                `UPDATE students SET student_attendance = ? WHERE student_id = ? AND session_id = ?`,
                [student.student_attendance, student.student_id, sessionId]
            )
        );

        try {
            await Promise.all(queryPromises);
        } catch (error) {
            console.error('Error in updateStudentAttendance service:', error);
            throw new Error('Failed to update attendance');
        }
    };

    async fetchSessionsPerMonth() {
        const query = `
            SELECT 
                DATE_FORMAT(session_date, '%Y-%m') AS month,
                COUNT(*) AS session_count
            FROM vw_sessions
            WHERE YEAR(session_date) = YEAR(CURDATE()) 
            GROUP BY month
            ORDER BY month ASC;
        `;
        const [results] = await db.promise().query(query);
        return results;
    };

    async fetchCountOfSessions() {
        const [results] = await db.promise().query(`
            SELECT COUNT(*) AS total_sessions FROM vw_sessions;
    `);
        return results[0];
    };

    async fetchLatestSessions(limit) {
        const query = `
            SELECT 
                s.id,
                s.session_title,
                s.session_host,
                s.session_date,
                s.session_time,
                s.session_description,
                s.session_status,
                s.session_images,
                s.session_setup_on,
                s.centre_code,
                s.state,
                s.district,
                s.sathee_mitra_name,
                s.school_type,
                s.school_type_other,
                s.school_address,
                s.principal_name,
                s.principal_contact,
                s.visit_mode,
                sc.school_name,
                l.lab_name,
                COUNT(st.student_id) as total_students
            FROM sessions s
            LEFT JOIN schools sc ON s.school_id = sc.id
            LEFT JOIN labs l ON s.lab_id = l.id
            LEFT JOIN students st ON s.id = st.session_id
            GROUP BY s.id, s.session_title, s.session_host, s.session_date, s.session_time, 
                     s.session_description, s.session_status, s.session_images, s.session_setup_on,
                     s.centre_code, s.state, s.district, s.sathee_mitra_name,
                     s.school_type, s.school_type_other, s.school_address,
                     s.principal_name, s.principal_contact, s.visit_mode,
                     sc.school_name, l.lab_name
            ORDER BY s.session_setup_on DESC
            LIMIT ?
        `;
        const [results] = await db.promise().query(query, [limit]);
        return results;
    };
}

module.exports = new SessionService();