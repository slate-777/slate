const equipmentService = require('../services/equipmentService');
const authService = require('../services/authService');

exports.addEquipment = async (req, res) => {
    const { equipmentName, equipmentDescription, warrantyStatus, equipmentQuantity, expiryDate, serialNumber } = req.body;
    try {
        await equipmentService.addEquipment(req.id, equipmentName, equipmentDescription, warrantyStatus, equipmentQuantity, expiryDate, serialNumber);
        await authService.logActivity(req.id, `User: ${req.email} added new equipment: [${equipmentName}]`);
        res.json({ status: 'success', message: 'Equipment added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.fetchMyEquipments = async (req, res) => {
    try {
        const equipments = await equipmentService.fetchMyEquipments(req.id);
        res.status(200).json({ status: 'success', data: equipments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchAllEquipments = async (req, res) => {
    try {
        const equipments = await equipmentService.fetchAllEquipments();
        res.status(200).json({ status: 'success', data: equipments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchActiveEquipments = async (req, res) => {
    try {
        const equipments = await equipmentService.fetchActiveEquipments();
        res.status(200).json({ status: 'success', data: equipments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.allocateEquipment = async (req, res) => {
    const { equipmentId, equipmentName, schoolId, schoolName, labId, labName, allocationDate, allocatedQuantity } = req.body;
    try {
        await equipmentService.allocateEquipment(req.id, equipmentId, schoolId, labId, allocationDate, allocatedQuantity);
        await authService.logActivity(req.id, `User: ${req.email} allocated ${allocatedQuantity} units of ${equipmentName} to lab ${labName} in school ${schoolName}`);
        res.json({ status: 'success', message: 'Equipment allocated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.fetchMyAllocatedEquipments = async (req, res) => {
    try {
        const results = await equipmentService.fetchMyAllocatedEquipments(req.id);
        res.status(200).json({ status: 'success', data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchAllAllocatedEquipments = async (req, res) => {
    const userId = req.id;
    const state = req.state;
    const assignedLab = req.assignedLab;
    try {
        const results = await equipmentService.fetchAllAllocatedEquipments(userId, state, assignedLab);
        res.status(200).json({ status: 'success', data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updateEquipmentData = async (req, res) => {
    const { id } = req.params;
    const { equipment_name, equipment_description, warranty_status, equipment_quantity, expiry_date, serial_number } = req.body;
    try {
        await equipmentService.updateEquipmentData(req.id, id, equipment_name, equipment_description, warranty_status, equipment_quantity, expiry_date, serial_number);
        await authService.logActivity(req.id, `User: ${req.email} updated data of equipment: [${equipment_name}]`);
        res.json({ status: 'success', message: 'Equipment data updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.updateEquipmentAllocation = async (req, res) => {
    const { allocationId } = req.params;
    const { equipment_name, allocated_quantity } = req.body;

    try {
        await equipmentService.updateEquipmentAllocation(allocationId, allocated_quantity);
        await authService.logActivity(req.id, `User: ${req.email} updated equipment allocation: ${equipment_name} to quantity: ${allocated_quantity}`);

        res.json({ status: 'success', message: 'Equipment allocation updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};


exports.disableEquipment = async (req, res) => {
    const { id } = req.params;
    const { equipmentName, equipmentStatus } = req.body
    const action = equipmentStatus === 1 ? 'disabled' : 'enabled';
    try {
        await equipmentService.disableEquipment(id);
        await authService.logActivity(req.id, `User: ${req.email} disabled a equipment: [${equipmentName}]`);
        res.json({ status: 'success', message: `Equipment ${action} successfully` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.deleteEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        await equipmentService.deleteEquipment(id);
        await authService.logActivity(req.id, `User: ${req.email} deleted a equipment with [ID: ${id}]`);
        res.json({ status: 'success', message: 'Equipment deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchLabEquipmentCount = async (req, res) => {
    try {
        const labEquipmentData = await equipmentService.getLabEquipmentCount();
        res.status(200).json({ status: "success", data: labEquipmentData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

exports.schoolsWithMostAllocatedEquipment = async (req, res) => {
    try {
        const labEquipmentData = await equipmentService.schoolsWithMostAllocatedEquipment();
        res.status(200).json({ status: "success", data: labEquipmentData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

exports.labsWithMostAllocatedEquipment = async (req, res) => {
    try {
        const labEquipmentData = await equipmentService.labsWithMostAllocatedEquipment();
        res.status(200).json({ status: "success", data: labEquipmentData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

exports.fetchCountOfEquipment = async (req, res) => {
    try {
        const results = await equipmentService.fetchCountOfEquipment();
        res.json({ status: 'success', data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};