const authService = require('../services/authService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get secret key at runtime (not at module load time)
const getSecretKey = () => process.env.JWT_SECRET_KEY;

exports.createUser = async (req, res) => {
    const { fname, lname, email, phone, userType, state, assignedLab } = req.body;

    try {
        // Validate required fields
        if (!fname || !lname || !email || !phone || !userType) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        // Validate assignedLab for non-Admin users (optional for backward compatibility)
        // if (userType !== 'Admin' && !assignedLab) {
        //     return res.status(400).json({ error: "Assigned lab is required for Mentors and State Officers" });
        // }

        // Add the user to the database
        await authService.createUser({ fname, lname, email, phone, userType, state, assignedLab });

        // Log the user creation activity
        await authService.logActivity(req.id, `${req.email} created a new user: [${email}] with assigned lab: [${assignedLab || 'N/A'}]`);

        return res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('=== LOGIN ATTEMPT ===', email);
    try {
        const user = await authService.findUserByEmail(email);
        if (!user) {
            console.log('User not found');
            return res.json("User not found");
        }
        console.log('Status:', user.status, 'Password match check...');
        if (user.status === 'inactive') {
            return res.json("User is suspended");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);
        if (!passwordMatch) {
            return res.json("Incorrect password");
        }
        console.log('Generating token...');
        jwt.sign({
            id: user.id,
            username: user.username || '',
            email: user.email,
            state: user.state || null,
            role_id: user.role_id,
            assignedLab: user.assigned_lab_id || null
        }, getSecretKey(), { expiresIn: '100d' }, async (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.json({ error: "Token generation failed" });
            }
            console.log('✓ Token generated, sending response');
            await authService.logActivity(user.id, `User: ${email} successfully logged in`);
            return res.status(200).json({ token });
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.json("Internal Server Error");
    }
};

exports.verifyUser = (req, res) => {
    res.json({ status: "success", username: req.username, email: req.email, state: req.state, role_id: req.role_id, assignedLab: req.assignedLab });
};

exports.logout = async (req, res) => {
    try {
        await authService.logActivity(req.id, `User: ${req.email} successfully logged out`);
        res.json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await authService.findUserById(req.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await authService.updatePassword(req.id, hashedPassword);
        await authService.logActivity(req.id, `User: ${req.email} has reset their password`);

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        await authService.sendResetPasswordEmail(email);
        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (error) {
        console.error('Error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        await authService.resetUserPassword(token, password);
        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
}

exports.test = async (req, res) => {
    try {
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
}