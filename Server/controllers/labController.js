const labService = require('../services/labService');
const authService = require('../services/authService');

exports.addLabType = async (req, res) => {
    const { labType } = req.body;
    try {
        await labService.addLabType(req.id, labType);
        await authService.logActivity(req.id, `User: ${req.email} added a new lab Type: [${labType}]`);
        res.json({ status: 'success', message: 'Lab type added successfully' });
    } catch (err) {
        if (err.message === 'Lab type already exists') {
            return res.status(409).json({ status: 'error', message: err.message });
        }
        console.log(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while adding the lab type' });
    }
};

exports.fetchLabTypes = async (req, res) => {
    try {
        const labTypes = await labService.getLabTypes();
        res.json({ status: 'success', labTypes });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching lab types' });
    }
};

exports.addLab = async (req, res) => {
    const { labName, labType, labCapacity, labDescription, schoolId } = req.body;
    try {
        await labService.addLab(req.id, labName, labType, labCapacity, labDescription, schoolId);
        await authService.logActivity(req.id, `User: ${req.email} added a new lab: [${labName}]`);
        res.json({ status: 'success', message: 'Lab added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.fetchMyLabs = async (req, res) => {
    try {
        const labs = await labService.fetchMyLabs(req.id);
        res.status(200).json({ status: 'success', data: labs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchAllLabs = async (req, res) => {
    const userId = req.id;
    const state = req.state;
    const assignedLab = req.assignedLab;
    try {
        const labs = await labService.fetchAllLabs(userId, state, assignedLab);
        res.status(200).json({ status: 'success', data: labs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchActiveLabs = async (req, res) => {
    try {
        const labs = await labService.fetchActiveLabs();
        res.status(200).json({ status: 'success', data: labs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchLabsForSchool = async (req, res) => {
    const { schoolId } = req.params;
    try {
        const labs = await labService.fetchLabsForSchool(schoolId);
        res.json({ status: 'success', labs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updateLabData = async (req, res) => {
    const { id } = req.params;
    const { lab_name, lab_type_id, lab_capacity, lab_description, school_id } = req.body;
    try {
        await labService.updateLabData(req.id, id, lab_name, lab_type_id, lab_capacity, lab_description, school_id);
        await authService.logActivity(req.id, `User: ${req.email} updated lab data with name: [${lab_name}]`);
        res.json({ status: 'success', message: 'Lab data updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.disableLab = async (req, res) => {
    const { id } = req.params;
    const { labName, labStatus } = req.body
    const action = labStatus === 1 ? 'disabled' : 'enabled';
    try {
        await labService.disableLab(id);
        await authService.logActivity(req.id, `User: ${req.email} disabled a lab: [${labName}]`);
        res.json({ status: 'success', message: `Lab ${action} successfully` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.deleteLab = async (req, res) => {
    const { id } = req.params;
    try {
        await labService.deleteLab(id);
        await authService.logActivity(req.id, `User: ${req.email} deleted a lab with [ID: ${id}]`);
        res.json({ status: 'success', message: 'Lab deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchCountOfLabs = async (req, res) => {
    try {
        const results = await labService.fetchCountOfLabs();
        res.json({ status: 'success', data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updateLabType = async (req, res) => {
    const { id } = req.params;
    const { labTypeName } = req.body;
    try {
        await labService.updateLabType(id, labTypeName, req.id);
        await authService.logActivity(req.id, `User: ${req.email} updated lab type: [${labTypeName}]`);
        res.json({ status: 'success', message: 'Lab type updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteLabType = async (req, res) => {
    const { id } = req.params;
    const { labTypeName } = req.body;
    try {
        await labService.deleteLabType(id);
        await authService.logActivity(req.id, `User: ${req.email} deleted lab type: [${labTypeName}]`);
        res.json({ status: 'success', message: 'Lab type deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
