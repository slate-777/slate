const express = require('express');
const verifyUser = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post("/login", authController.login);
router.post("/createUser", verifyUser, authController.createUser);
router.get("/verifyUser", verifyUser, authController.verifyUser);
router.post("/logout", verifyUser, authController.logout);
router.post("/changePassword", verifyUser, authController.changePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.get('/test', authController.test);

module.exports = router;