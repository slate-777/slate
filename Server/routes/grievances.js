const express = require('express');
const verifyUser = require('../middlewares/auth');
const grievanceController = require('../controllers/grievanceController');

const router = express.Router();

router.post('/submit', verifyUser, grievanceController.submitGrievance);
router.get('/my-grievances', verifyUser, grievanceController.getMyGrievances);
router.get('/all-grievances', verifyUser, grievanceController.getAllGrievances);
router.put('/update-status/:id', verifyUser, grievanceController.updateGrievanceStatus);

module.exports = router;
