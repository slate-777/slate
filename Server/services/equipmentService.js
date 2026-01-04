const db = require('../config/db');

class EquipmentService {
    async addEquipment(userId, equipmentName, equipmentDescription, warrantyStatus, equipmentQuantity, expiryDate, serialNumber) {
        const query = `INSERT INTO equipments 
            (equipment_name, equipment_description, warranty_status, equipment_quantity, available_quantity, expiry_date, serial_number, equipment_added_by, equipment_added_on) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        await db.promise().query(query, [equipmentName, equipmentDescription, warrantyStatus, equipmentQuantity, equipmentQuantity, expiryDate, serialNumber, userId]);
    }

    async fetchMyEquipments(userId) {
        const query = "SELECT * FROM vw_equipments WHERE equipment_added_by = ? ORDER BY id DESC";
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async fetchAllEquipments() {
        const query = "SELECT * FROM vw_equipments ORDER BY id DESC";
        const [results] = await db.promise().query(query);
        return results;
    }

    async fetchActiveEquipments() {
        const query = "SELECT * FROM vw_equipments WHERE equipment_status = 1 ORDER BY id DESC";
        const [results] = await db.promise().query(query);
        return results;
    }

    async allocateEquipment(userId, equipmentId, schoolId, labId, allocationDate, allocatedQuantity) {
        const query = `INSERT INTO equipments_allocation
            (equipment_id, school_id, lab_id, allocation_date, allocated_quantity, allocated_by, allocated_on) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())`;

        await db.promise().query(query, [equipmentId, schoolId, labId, allocationDate, allocatedQuantity, userId]);
        await db.promise().query("UPDATE equipments SET available_quantity = available_quantity - ? WHERE id = ?", [allocatedQuantity, equipmentId]);
    }

    async fetchMyAllocatedEquipments(userId) {
        const query = "SELECT * FROM vw_equipments_allocation WHERE allocated_by = ? ORDER BY allocation_id DESC";
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async fetchAllAllocatedEquipments(userId, state, assignedLab) {
        let query = "SELECT * FROM vw_equipments_allocation";
        const queryParams = [];

        // If user has an assigned lab, only show equipment for that lab
        if (assignedLab) {
            query += " WHERE lab_id = ?";
            queryParams.push(assignedLab);
        } else if (userId !== 1 && state) {
            query += " WHERE school_state = ?";
            queryParams.push(state);
        }

        query += " ORDER BY allocation_id DESC";
        const [results] = await db.promise().query(query, queryParams);
        return results;
    }

    async updateEquipmentData(userId, equipmentId, equipmentName, equipmentDescription, warrantyStatus, equipmentQuantity, expiryDate, serialNumber) {
        // Fetch the current remaining quantity
        const [rows] = await db.promise().query(
            `SELECT available_quantity, equipment_quantity FROM equipments WHERE id = ?`,
            [equipmentId]
        );

        if (rows.length === 0) {
            throw new Error("Equipment not found.");
        }

        const { available_quantity, equipment_quantity } = rows[0];

        // Check if the new quantity is valid
        if (equipmentQuantity < equipment_quantity - available_quantity) {
            throw new Error(`Cannot reduce quantity below ${available_quantity}.`);
        }

        // Calculate the change in quantity
        const quantityDifference = equipmentQuantity - equipment_quantity;

        // Update both `equipment_quantity` and `available_quantity` if increased
        const query = `
            UPDATE equipments
            SET equipment_name = ?, equipment_description = ?, warranty_status = ?, 
                equipment_quantity = ?, expiry_date = ?, serial_number = ?, equipment_updated_by = ?, 
                available_quantity = available_quantity + ?
            WHERE id = ?
        `;

        await db.promise().query(query, [
            equipmentName, equipmentDescription, warrantyStatus, equipmentQuantity,
            expiryDate, serialNumber, userId, quantityDifference, equipmentId
        ]);
    }

    async updateEquipmentAllocation(allocationId, newAllocatedQuantity) {
        // Fetch the current allocation details
        const [allocationRows] = await db.promise().query(
            `SELECT allocated_quantity, equipment_id FROM equipments_allocation WHERE id = ?`,
            [allocationId]
        );

        if (allocationRows.length === 0) {
            throw new Error("Allocation record not found.");
        }

        const { allocated_quantity, equipment_id } = allocationRows[0];

        // Fetch the current available quantity from equipment table
        // const [equipmentRows] = await db.promise().query(
        //     `SELECT available_quantity FROM equipment WHERE id = ?`,
        //     [equipment_id]
        // );

        // if (equipmentRows.length === 0) {
        //     throw new Error("Equipment not found.");
        // }

        // const { available_quantity } = equipmentRows[0];

        // Calculate the difference
        const difference = newAllocatedQuantity - allocated_quantity;

        // Check if increasing allocation is possible
        // if (difference > 0 && difference > available_quantity) {
        //     throw new Error(`Not enough stock available. Only ${available_quantity} items left.`);
        // }

        // Update allocation table
        const updateAllocationQuery = `
            UPDATE equipments_allocation 
            SET allocated_quantity = ?, allocated_on = NOW()
            WHERE id = ?
        `;
        await db.promise().query(updateAllocationQuery, [newAllocatedQuantity, allocationId]);

        // Update available_quantity in equipment table
        const updateEquipmentQuery = `
            UPDATE equipments
            SET available_quantity = available_quantity + ?
            WHERE id = ?
        `;
        await db.promise().query(updateEquipmentQuery, [-difference, equipment_id]); // Negative difference adds stock

    }


    async disableEquipment(equipmentId) {
        const fetchQuery = `SELECT equipment_status FROM vw_equipments WHERE id = ?`;
        const [rows] = await db.promise().query(fetchQuery, [equipmentId]);
        if (rows.length === 0) {
            throw new Error(`Equipment with ID ${equipmentId} not found.`);
        }
        const currentStatus = rows[0].equipment_status;
        const newStatus = currentStatus === 1 ? 0 : 1;
        const updateQuery = `UPDATE equipments SET equipment_status = ? WHERE id = ?`;
        await db.promise().query(updateQuery, [newStatus, equipmentId]);
    }

    async deleteEquipment(equipmentId) {
        const query = `DELETE FROM equipments WHERE id = ?`;
        await db.promise().query(query, [equipmentId]);
    }

    async getLabEquipmentCount() {
        const query = `
            SELECT 
                lab_name, 
                COUNT(equipment_name) AS equipment_count,
                GROUP_CONCAT(equipment_name SEPARATOR ', ') AS equipment_names
            FROM vw_equipments_allocation 
            WHERE lab_status = 1 AND equipment_status = 1
            GROUP BY lab_name 
            ORDER BY equipment_count DESC;
        `;
        const [results] = await db.promise().query(query);
        return results;
    }

    async schoolsWithMostAllocatedEquipment() {
        const query =
            `SELECT school_name, COUNT(equipment_id) AS total_allocated 
                    FROM vw_equipments_allocation 
                    WHERE school_status = 1 AND equipment_status = 1
                    GROUP BY school_name 
                    ORDER BY total_allocated DESC 
                    LIMIT 10; `;
        const [results] = await db.promise().query(query);
        return results;
    }

    async labsWithMostAllocatedEquipment() {
        const query = ` 
                SELECT lab_name, COUNT(equipment_id) AS total_allocated 
                FROM vw_equipments_allocation
                WHERE lab_status = 1 AND equipment_status = 1
                GROUP BY lab_name 
                ORDER BY total_allocated DESC 
                LIMIT 10; `;
        const [results] = await db.promise().query(query);
        return results;
    }

    async fetchCountOfEquipment() {
        const [results] = await db.promise().query(`
            SELECT COUNT(*) AS total_equipment FROM vw_equipments WHERE equipment_status = 1;
    `);
        return results[0];
    };
}

module.exports = new EquipmentService();
