const jwt = require("jsonwebtoken");

// Middleware to verify user token
const verifyUser = (req, res, next) => {
    const token = req.headers["authorization"];
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // Get at runtime

    if (!token) {
        return res.json({ status: 'fail', message: "You are not authorized" });
    } else {
        jwt.verify(token, JWT_SECRET_KEY, {}, (err, decoded) => {
            if (err) {
                return res.json({ status: 'fail', message: "Token is not valid" });
            } else {
                req.id = decoded.id;
                req.email = decoded.email;
                req.username = decoded.username;
                req.state = decoded.state;
                req.role_id = decoded.role_id;
                req.assignedLab = decoded.assignedLab;
                next();
            }
        });
    }
};

module.exports = verifyUser;