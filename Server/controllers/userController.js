const userService = require('../services/userService');
const authService = require('../services/authService');

exports.fetchUsers = async (req, res) => {
    try {
        const users = await userService.fetchUsers();
        return res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.fetchUserState = async (req, res) => {
    const userId = req.id;
    try {
        const userState = await userService.fetchUserState(userId);
        return res.status(200).json({ status: 'success', data: userState[0].state });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.changeUserRole = async (req, res) => {
    const { userId, newRoleId, userEmail } = req.body;
    try {
        await userService.changeUserRole(userId, newRoleId);
        await authService.logActivity(req.id, `User: ${req.email} changed the role of user: [${userEmail}]`);
        return res.status(200).json({ status: 'success', message: 'User role updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Failed to change role' });
    }
};

exports.updateUserDetails = async (req, res) => {
    const { selectedUser } = req.body;
    const username = `${selectedUser.fname} ${selectedUser.lname}`;
    try {
        await userService.updateUserDetails(selectedUser.id, username, selectedUser.phone, selectedUser.state, selectedUser.assignedLab);
        await authService.logActivity(req.id, `User: ${req.email} updated details of user: [${selectedUser.email}] with assigned lab: [${selectedUser.assignedLab || 'N/A'}]`);
        return res.status(200).json({ status: 'success', message: 'User details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Failed to update user details' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    const { userEmail } = req.body;
    try {
        await userService.deleteUser(userId);
        await authService.logActivity(req.id, `User: ${req.email} deleted the account of user: [${userEmail}]`);
        return res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Failed to delete user' });
    }
};

exports.getControlAccessInfo = async (req, res) => {
    const userId = req.id;
    try {
        const results = await userService.getControlAccessInfo(userId);
        if (!results || results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        return res.status(200).json({ status: 'success', data: results[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Database query error' });
    }
};

exports.updateUserControlAccess = async (req, res) => {
    const { userId, userEmail, sideBarOption } = req.body;

    try {
        const result = await userService.getControlAccessInfoForUser(sideBarOption);

        // Initialize hasAccess array and convert all elements to strings
        let hasAccess = result[0].no_access ?
            result[0].no_access.split(',').map(id => id.toString()) :
            [];


        // Convert userId to string for comparison
        const userIdStr = userId.toString();

        if (hasAccess.includes(userIdStr)) {
            hasAccess = hasAccess.filter(id => id !== userIdStr);
        } else {
            hasAccess.push(userIdStr);
        }

        const newHasAccess = hasAccess.join(',');

        await userService.updateUserControlAccess(sideBarOption, newHasAccess);
        await authService.logActivity(
            req.id,
            `User: ${req.email} updated access control of user: [${userEmail}] for ${sideBarOption}`
        );

        return res.json({ status: 'success', message: 'User sidebar menu access updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.fetchControlAccessUsers = async (req, res) => {
    try {
        const users = await userService.fetchControlAccessUsers();
        return res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.suspendUser = async (req, res) => {
    const userId = req.params.id;
    const { userName, userEmail, userStatus } = req.body
    const action = userStatus === 'active' ? 'suspended' : 're-activated ';
    try {
        await userService.suspendUser(userId, userName, userEmail);
        await authService.logActivity(req.id, `User: ${req.email} ${action} a user: [${userEmail}]`);
        res.json({ status: 'success', message: `User ${action} successfully` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchUserActivity = async (req, res) => {
    const { userId, userEmail, period } = req.body;
    try {
        const results = await userService.fetchUserActivity(userId, period);
        await authService.logActivity(req.id, `User: ${req.email} searched for activities of user: [${userEmail}] in last ${period} days`);
        return res.status(200).json({ status: 'success', data: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Database query error' });
    }
};