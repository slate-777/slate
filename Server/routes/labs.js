const express = require('express');
const verifyUser = require('../middlewares/auth');
const labController = require('../controllers/labController');

const router = express.Router();

router.post('/addLabType', verifyUser, labController.addLabType);
router.get('/fetchLabTypes', verifyUser, labController.fetchLabTypes);
router.post('/addLab', verifyUser, labController.addLab);
router.get('/fetchMyLabs', verifyUser, labController.fetchMyLabs);
router.get('/fetchAllLabs', verifyUser, labController.fetchAllLabs);
router.get('/fetchactiveLabs', verifyUser, labController.fetchActiveLabs);
router.get('/fetchLabsForSchool/:schoolId', verifyUser, labController.fetchLabsForSchool);
router.put('/updateLabData/:id', verifyUser, labController.updateLabData);
router.put('/disableLab/:id', verifyUser, labController.disableLab);
router.delete('/deleteLab/:id', verifyUser, labController.deleteLab);
router.get('/fetchCountOfLabs', verifyUser, labController.fetchCountOfLabs);
router.put('/updateLabType/:id', verifyUser, labController.updateLabType);
router.delete('/deleteLabType/:id', verifyUser, labController.deleteLabType);

module.exports = router;
