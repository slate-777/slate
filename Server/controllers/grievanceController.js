const grievanceService = require('../services/grievanceService');
const authService = require('../services/authService');

exports.submitGrievance = async (req, res) => {
    const {
        grievanceId,
        issueCategory,
        issueSubCategory,
        actionRequired,
        schoolName,
        labName,
        equipmentName,
        description,
        priority
    } = req.body;

    try {
        await grievanceService.submitGrievance(
            req.id,
            req.email,
            grievanceId,
            issueCategory,
            issueSubCategory,
            actionRequired,
            schoolName,
            labName,
            equipmentName,
            description,
            priority
        );

        await authService.logActivity(req.id, `User: ${req.email} submitted grievance: [${grievanceId}]`);

        res.json({
            status: 'success',
            message: 'Grievance submitted successfully',
            grievanceId: grievanceId
        });
    } catch (err) {
        console.error('Error submitting grievance:', err);
        res.status(500).json({ status: 'error', message: 'Failed to submit grievance' });
    }
};

exports.getMyGrievances = async (req, res) => {
    try {
        const grievances = await grievanceService.getMyGrievances(req.id);
        res.json({ status: 'success', data: grievances });
    } catch (err) {
        console.error('Error fetching grievances:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch grievances' });
    }
};

exports.getAllGrievances = async (req, res) => {
    // Only admin can view all grievances
    if (req.role_id !== 1) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    try {
        const grievances = await grievanceService.getAllGrievances();
        res.json({ status: 'success', data: grievances });
    } catch (err) {
        console.error('Error fetching all grievances:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch grievances' });
    }
};

exports.updateGrievanceStatus = async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;

    // Only admin can update status
    if (req.role_id !== 1) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    try {
        await grievanceService.updateGrievanceStatus(id, status, remarks, req.id);
        await authService.logActivity(req.id, `User: ${req.email} updated grievance status: [ID: ${id}] to [${status}]`);

        res.json({ status: 'success', message: 'Grievance status updated successfully' });
    } catch (err) {
        console.error('Error updating grievance status:', err);
        res.status(500).json({ status: 'error', message: 'Failed to update grievance status' });
    }
};
