const express = require('express');
const verifyUser = require('../middlewares/auth');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

router.post('/addSchool', verifyUser, schoolController.addSchool);
router.get('/fetchMySchools', verifyUser, schoolController.fetchMySchools);
router.get('/fetchAllSchools', verifyUser, schoolController.fetchAllSchools);
router.get('/fetchActiveSchools', verifyUser, schoolController.fetchActiveSchools);
router.put('/updateSchoolData/:id', verifyUser, schoolController.updateSchoolData);
router.put('/disableSchool/:id', verifyUser, schoolController.disableSchool);
router.delete('/deleteSchool/:id', verifyUser, schoolController.deleteSchool);
router.get('/fetchStates', verifyUser, schoolController.fetchStates);
router.get('/fetchDistricts/:state', verifyUser, schoolController.fetchDistricts);
router.get('/fetchAllDistricts', verifyUser, schoolController.fetchAllDistricts);
router.get('/schoolsPerState', verifyUser, schoolController.fetchSchoolsPerState);
router.get('/fetchCountOfSchools', verifyUser, schoolController.fetchCountOfSchools);

module.exports = router;