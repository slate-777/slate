const db = require('../config/db');

class SchoolService {
    async addSchool(userId, schoolName, udise, state, district, address, pincode, geoLocation, schoolEmail, contactPerson, contactNo, totalStudents) {
        const camelCaseSchoolName = schoolName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Check if the UDISE already exists
        const checkQuery = `SELECT COUNT(*) AS count FROM vw_schools WHERE udise = ?`;
        const [rows] = await db.promise().query(checkQuery, [udise]);

        if (rows[0].count > 0) {
            throw new Error('School with this UDISE already exists');
        }

        const query = `INSERT INTO schools 
            (school_name, udise, state, district, address, pincode, geo_location, school_email_id, primary_contact_person, contact_no, totalStudents, on_boarded_by, on_boarded_on) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        await db.promise().query(query, [camelCaseSchoolName, udise, state, district, address, pincode, geoLocation, schoolEmail, contactPerson, contactNo, totalStudents, userId]);
    }

    async fetchMySchools(userId) {
        const query = "SELECT * FROM vw_schools WHERE on_boarded_by = ? ORDER BY id DESC";
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async fetchAllSchools(roleId, state, assignedLab) {
        let query = "SELECT DISTINCT s.* FROM vw_schools s";
        const queryParams = [];
        let hasWhere = false;

        // For non-admin users (Mentor/State Officer), filter by state
        if (roleId !== 1 && state) {
            query += " WHERE s.state = ?";
            queryParams.push(state);
            hasWhere = true;
        }

        // If user has an assigned lab AND is admin, additionally filter by that lab
        // (assignedLab filtering is skipped for mentors/state officers to show all schools in their state)
        if (assignedLab && roleId === 1) {
            query += hasWhere ? " AND" : " WHERE";
            query += " EXISTS (SELECT 1 FROM labs l WHERE l.school_id = s.id AND l.id = ?)";
            queryParams.push(assignedLab);
        }

        query += " ORDER BY s.id DESC";
        const [results] = await db.promise().query(query, queryParams);
        return results;
    }

    async fetchActiveSchools(roleId, state, assignedLab) {
        let query = "SELECT DISTINCT s.* FROM vw_schools s";
        const queryParams = [];

        query += " WHERE s.school_status = 1";

        // Mentors and State Officers can now see all schools (no state filter)
        // Only apply assignedLab filter for admins if they have an assigned lab
        if (assignedLab && roleId === 1) {
            query += " AND EXISTS (SELECT 1 FROM labs l WHERE l.school_id = s.id AND l.id = ?)";
            queryParams.push(assignedLab);
        }

        query += " ORDER BY s.id DESC";
        const [results] = await db.promise().query(query, queryParams);
        return results;
    }

    async updateSchoolData(userId, schoolId, schoolName, udise, state, district, pincode, address, geoLocation, schoolEmailId, contactPerson, contactNo, totalStudents) {
        const query = `
            UPDATE schools
            SET school_name = ?, udise = ?, state = ?, district = ?, pincode = ?, address = ?, geo_location = ?, school_email_id = ?, primary_contact_person = ?, contact_no = ?, totalStudents = ?, school_updated_by = ?
            WHERE id = ?
        `;
        await db.promise().query(query, [schoolName, udise, state, district, pincode, address, geoLocation, schoolEmailId, contactPerson, contactNo, totalStudents, userId, schoolId]);
    }

    async disableSchool(schoolId) {
        const fetchQuery = `SELECT school_status FROM vw_schools WHERE id = ?`;
        const [rows] = await db.promise().query(fetchQuery, [schoolId]);
        if (rows.length === 0) {
            throw new Error(`School with ID ${schoolId} not found.`);
        }
        const currentStatus = rows[0].school_status;
        const newStatus = currentStatus === 1 ? 0 : 1;
        const updateQuery = `UPDATE schools SET school_status = ? WHERE id = ?`;
        await db.promise().query(updateQuery, [newStatus, schoolId]);
    }

    async deleteSchool(schoolId) {
        const query = `DELETE FROM schools WHERE id = ?`;
        await db.promise().query(query, [schoolId]);
        await db.promise().query("DELETE FROM labs WHERE school_id = ?", [schoolId]);
    }

    async fetchStates() {
        const query = "SELECT DISTINCT state FROM vw_states_districts";
        const [results] = await db.promise().query(query);
        return results.map(row => row.state);
    }

    async fetchDistricts(state) {
        const query = "SELECT district FROM vw_states_districts WHERE state = ?";
        const [results] = await db.promise().query(query, [state]);
        return results.map(row => row.district);
    }

    async fetchAllDistricts() {
        const query = "SELECT district FROM vw_states_districts";
        const [results] = await db.promise().query(query);
        return results.map(row => row.district);
    }

    async fetchSchoolsPerState() {
        const query = `
            SELECT state, COUNT(*) as school_count 
            FROM vw_schools 
            WHERE state IS NOT NULL AND school_status = 1
            GROUP BY state 
            ORDER BY school_count DESC;
        `;
        const [results] = await db.promise().query(query);
        return results;
    };

    async fetchCountOfSchools() {
        const [results] = await db.promise().query(`
            SELECT COUNT(*) AS total_schools FROM vw_schools WHERE school_status = 1;
    `);
        return results[0];
    };
}

module.exports = new SchoolService();