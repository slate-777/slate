const express = require('express');
const verifyUser = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/fetchUsers', verifyUser, userController.fetchUsers);
router.get('/fetchUserState', verifyUser, userController.fetchUserState);
router.put('/changeUserRole', verifyUser, userController.changeUserRole);
router.put('/updateUserDetails', verifyUser, userController.updateUserDetails);
router.post('/deleteUser/:id', verifyUser, userController.deleteUser);
router.get('/getControlAccessInfo', verifyUser, userController.getControlAccessInfo);
router.put('/updateUserControlAccess', verifyUser, userController.updateUserControlAccess);
router.get('/fetchControlAccessUsers', verifyUser, userController.fetchControlAccessUsers);
router.put('/suspendUser/:id', verifyUser, userController.suspendUser);
router.post('/fetchUserActivity', verifyUser, userController.fetchUserActivity);

module.exports = router;