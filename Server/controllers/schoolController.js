const schoolService = require('../services/schoolService');
const authService = require('../services/authService');

exports.addSchool = async (req, res) => {
    const { schoolName, udise, state, district, address, pincode, geoLocation, schoolEmail, contactPerson, contactNo, totalStudents } = req.body;
    try {
        await schoolService.addSchool(req.id, schoolName, udise, state, district, address, pincode, geoLocation, schoolEmail, contactPerson, contactNo, totalStudents);
        await authService.logActivity(req.id, `User: ${req.email} added new school: [${schoolName}]`);
        res.json({ status: 'success', message: 'School added successfully' });
    } catch (err) {
        if (err.message === 'School with this UDISE already exists') {
            return res.status(409).json({ status: 'error', message: err.message });
        }
        console.log(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while adding the school' });
    }
};

exports.fetchMySchools = async (req, res) => {
    try {
        const schools = await schoolService.fetchMySchools(req.id);
        res.status(200).json({ status: 'success', data: schools });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchAllSchools = async (req, res) => {
    const roleId = req.role_id;
    const state = req.state;
    const assignedLab = req.assignedLab;
    try {
        const schools = await schoolService.fetchAllSchools(roleId, state, assignedLab);
        res.status(200).json({ status: 'success', data: schools });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchActiveSchools = async (req, res) => {
    const roleId = req.role_id;
    const state = req.state;
    const assignedLab = req.assignedLab;
    try {
        const schools = await schoolService.fetchActiveSchools(roleId, state, assignedLab);
        res.status(200).json({ status: 'success', data: schools });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updateSchoolData = async (req, res) => {
    const { id } = req.params;
    const { school_name, udise, state, district, pincode, address, geo_location, school_email_id, primary_contact_person, contact_no, total_students } = req.body;
    try {
        await schoolService.updateSchoolData(req.id, id, school_name, udise, state, district, pincode, address, geo_location, school_email_id, primary_contact_person, contact_no, total_students);
        await authService.logActivity(req.id, `User: ${req.email} updated school data: [ ${school_name}]`);
        res.json({ status: 'success', message: 'School data updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.disableSchool = async (req, res) => {
    const { id } = req.params;
    const { schoolName, schoolStatus } = req.body
    const action = schoolStatus === 1 ? 'disabled' : 'enabled';
    try {
        await schoolService.disableSchool(id);
        await authService.logActivity(req.id, `User: ${req.email} disabled a school: [${schoolName}]`);
        res.json({ status: 'success', message: `School ${action} successfully` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.deleteSchool = async (req, res) => {
    const { id } = req.params;
    try {
        await schoolService.deleteSchool(id);
        await authService.logActivity(req.id, `User: ${req.email} deleted a school with [ID: ${id}]`);
        res.json({ status: 'success', message: 'School deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchStates = async (req, res) => {
    try {
        const states = await schoolService.fetchStates();
        res.status(200).json({ success: true, states });
    } catch (err) {
        console.error('Error fetching states:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch states' });
    }
};

exports.fetchDistricts = async (req, res) => {
    const { state } = req.params;
    try {
        const districts = await schoolService.fetchDistricts(state);
        res.status(200).json({ success: true, districts });
    } catch (err) {
        console.error('Error fetching districts:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch districts' });
    }
};

exports.fetchAllDistricts = async (req, res) => {
    try {
        const districts = await schoolService.fetchAllDistricts();
        res.status(200).json({ success: true, districts });
    } catch (err) {
        console.error('Error fetching districts:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch districts' });
    }
};

exports.fetchSchoolsPerState = async (req, res) => {
    try {
        const schoolsData = await schoolService.fetchSchoolsPerState();
        res.status(200).json({ status: 'success', data: schoolsData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchCountOfSchools = async (req, res) => {
    try {
        const results = await schoolService.fetchCountOfSchools();
        res.json({ status: 'success', data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};