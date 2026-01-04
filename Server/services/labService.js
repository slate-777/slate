const db = require('../config/db');

class LabService {

    async addLabType(userId, labType) {
        const checkQuery = `SELECT COUNT(*) AS count FROM vw_lab_types WHERE lab_type_name = ?`;
        const [rows] = await db.promise().query(checkQuery, [labType]);

        if (rows[0].count > 0) {
            throw new Error('Lab type already exists');
        }

        const query = `INSERT INTO lab_types (lab_type, lab_type_added_by, lab_type_added_on) VALUES (?, ?, NOW())`;
        await db.promise().query(query, [labType, userId]);
    };

    async getLabTypes() {
        const query = `SELECT * FROM vw_lab_types`;
        const [rows] = await db.promise().query(query);
        return rows;
    };

    async addLab(userId, labName, labType, labCapacity, labDescription, schoolId) {
        const query = `INSERT INTO labs 
            (lab_name, lab_type, lab_description, lab_capacity, school_id, lab_added_by, lab_added_on) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        await db.promise().query(query, [labName, labType, labDescription, labCapacity, schoolId, userId]);
    }

    async fetchMyLabs(userId) {
        const query = "SELECT * FROM vw_labs WHERE lab_added_by = ? ORDER BY id DESC";
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async fetchAllLabs(userId, state, assignedLab) {
        let query = "SELECT * FROM vw_labs";
        const queryParams = [];

        // If user has an assigned lab, only show that lab
        if (assignedLab) {
            query += " WHERE id = ?";
            queryParams.push(assignedLab);
        } else if (userId !== 1 && state) {
            query += " WHERE school_state = ?";
            queryParams.push(state);
        }

        query += " ORDER BY id DESC";
        const [results] = await db.promise().query(query, queryParams);
        return results;
    }

    async fetchActiveLabs() {
        const query = "SELECT * FROM vw_labs WHERE lab_status = 1 ORDER BY id DESC";
        const [results] = await db.promise().query(query);
        return results;
    }

    async fetchLabsForSchool(schoolId) {
        const query = `SELECT id, lab_name FROM vw_labs WHERE school_id = ? AND lab_status = 1`;
        const [results] = await db.promise().query(query, [schoolId]);
        return results;
    }

    async updateLabData(userId, labId, labName, labTypeId, labCapacity, labDescription, schoolId) {
        const query = `
            UPDATE labs
            SET lab_name = ?, lab_type = ?, lab_capacity = ?, lab_description = ?, school_id = ?, lab_updated_by = ?
            WHERE id = ?
        `;

        await db.promise().query(query, [labName, labTypeId, labCapacity, labDescription, schoolId, userId, labId]);
    }

    async disableLab(labId) {
        const fetchQuery = `SELECT lab_status FROM vw_labs WHERE id = ?`;
        const [rows] = await db.promise().query(fetchQuery, [labId]);
        if (rows.length === 0) {
            throw new Error(`Lab with ID ${labId} not found.`);
        }
        const currentStatus = rows[0].lab_status;
        const newStatus = currentStatus === 1 ? 0 : 1;
        const updateQuery = `UPDATE labs SET lab_status = ? WHERE id = ?`;
        await db.promise().query(updateQuery, [newStatus, labId]);
    }

    async deleteLab(labId) {
        const query = `DELETE FROM labs WHERE id = ?`;
        await db.promise().query(query, [labId]);
    }

    async fetchCountOfLabs() {
        const [results] = await db.promise().query(`
            SELECT COUNT(*) AS total_labs FROM vw_labs WHERE lab_status = 1;
    `);
        return results[0];
    };

    async updateLabType(labTypeId, labTypeName, userId) {
        const query = `UPDATE lab_types SET lab_type = ? WHERE lab_type_id = ?`;
        await db.promise().query(query, [labTypeName, labTypeId]);
    }

    async deleteLabType(labTypeId) {
        const query = `DELETE FROM lab_types WHERE lab_type_id = ?`;
        await db.promise().query(query, [labTypeId]);
    }
}

module.exports = new LabService();
